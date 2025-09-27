const { createClient } = require('./hubspotClient')
const { createTools } = require('./toolsFactory')
const { Queue } = require('bullmq')
const { expandDistribution } = require('./distributionUtil')
const Redis = require('redis')
const knexConfig = require('../knexfile')
const Knex = require('knex')

// Lazily create Redis connection options (BullMQ will manage its own ioredis internally if given connection params)
function getQueue(connectionOpts = {}) {
  return new Queue('simulation-jobs', { connection: connectionOpts })
}

const knex = Knex(knexConfig.development || knexConfig)

function createOrchestrator({ apiToken } = {}) {
  const client = createClient({ apiToken })
  if (apiToken) client.setToken(apiToken)
  const tools = createTools(client)

  return {
    // Dynamically create a tools instance for a given token (per-user private app token)
    withToken(token) {
      const userClient = createClient({})
      userClient.setToken(token)
      return createTools(userClient)
    },

    // High-level: create contact + company and associate
    createContactWithCompany: async ({ contactProps, companyProps }) => {
      const company = await tools.companies.create(companyProps)
      const contact = await tools.contacts.create({ ...contactProps })
      
      // Use centralized associations module with correct type IDs
      try {
        await tools.associations.associateContactToCompany(contact.id, company.id, true) // primary association
      } catch (err) {
        // best-effort; ignore association errors here
        console.warn('Association failed:', err.message)
      }
      
      return { contact, company }
    },

    createDealForContact: async ({ contactId, companyId, dealProps }) => {
      const deal = await tools.deals.create(dealProps, [/* associations optional */])
      
      // Use centralized associations module with correct type IDs
      try {
        const associationResults = await tools.associations.associateDealToContactAndCompany(deal.id, contactId, companyId)
        // Log any association failures for debugging
        associationResults.forEach((result, index) => {
          if (result.status === 'rejected') {
            const type = index === 0 ? 'contact' : 'company'
            console.warn(`Deal to ${type} association failed:`, result.reason?.message)
          }
        })
      } catch (err) {
        console.warn('Deal association failed:', err.message)
      }
      
      return deal
    },

    // New method: Create a note and associate it with related objects
    createNoteWithAssociations: async ({ noteProps, contactId, companyId, dealId, ticketId }) => {
      const note = await tools.engagements.create({
        engagement: {
          type: 'NOTE'
        },
        metadata: {
          body: noteProps.body || noteProps.hs_note_body
        }
      })
      
      // Associate note with provided objects
      if (contactId || companyId || dealId || ticketId) {
        try {
          await tools.associations.associateNote(note.id, { contactId, companyId, dealId, ticketId })
        } catch (err) {
          console.warn('Note association failed:', err.message)
        }
      }
      
      return note
    },

    // New method: Create a call and associate it with a contact
    createCallForContact: async ({ callProps, contactId }) => {
      const call = await tools.engagements.create({
        engagement: {
          type: 'CALL'
        },
        metadata: {
          body: callProps.body,
          status: callProps.status || 'COMPLETED',
          duration: callProps.duration
        }
      })
      
      if (contactId) {
        try {
          await tools.associations.associateCallToContact(call.id, contactId)
        } catch (err) {
          console.warn('Call association failed:', err.message)
        }
      }
      
      return call
    },

    // New method: Create a task and associate it with a contact (for ownership)
    createTaskForContact: async ({ taskProps, contactId }) => {
      const task = await tools.engagements.create({
        engagement: {
          type: 'TASK'
        },
        metadata: {
          body: taskProps.body,
          subject: taskProps.subject,
          status: taskProps.status || 'NOT_STARTED'
        }
      })
      
      if (contactId) {
        try {
          await tools.associations.associateTaskToContact(task.id, contactId)
        } catch (err) {
          console.warn('Task association failed:', err.message)
        }
      }
      
      return task
    },

    // pass-through for tools
    tools,

    /**
     * startSimulation(simulationId)
     * Reads simulation record, expands distribution into per-record timestamps, enqueues delayed jobs.
     */
    startSimulation: async (simulationId) => {
      // Load simulation row
      const sim = await knex('simulations').where({ id: simulationId }).first()
      if (!sim) throw new Error('Simulation not found')
      if (sim.status !== 'QUEUED') throw new Error('Simulation not in QUEUED state')

      const now = Date.now()
      const timestamps = expandDistribution(
        sim.distribution_method,
        sim.total_records,
        sim.start_time,
        sim.end_time
      )

      const queue = getQueue()
      let scheduled = 0
      for (let i = 0; i < timestamps.length; i++) {
        const ts = timestamps[i]
        const delay = Math.max(0, ts - now)
        await queue.add('create-record', {
          simulationId,
          index: i + 1,
          scenario: sim.scenario,
          distribution_method: sim.distribution_method,
        }, { delay })
        scheduled++
      }

      await knex('simulations').where({ id: simulationId }).update({
        status: 'RUNNING',
        updated_at: Date.now()
      })

      return { scheduled }
    },
  }
}

module.exports = { createOrchestrator }
