// Worker process consuming simulation jobs.
// Run with: node server/worker.js

const { Worker } = require('bullmq')
const knexConfig = require('../knexfile')
const Knex = require('knex')
const { createClient } = require('./hubspotClient')
const { createTools } = require('./toolsFactory')

const knex = Knex(knexConfig.development || knexConfig)

// Placeholder: we will later resolve per-user token or scenario-driven logic.
async function processJob(job) {
  const { simulationId, index } = job.data

  // Simulate record creation (future: call HubSpot via per-user token).
  // For now: increment records_processed.
  await knex('simulations')
    .where({ id: simulationId })
    .increment('records_processed', 1)
    .update({ updated_at: Date.now() })

  // Check completion
  const sim = await knex('simulations').where({ id: simulationId }).first()
  if (sim && sim.records_processed >= sim.total_records) {
    await knex('simulations')
      .where({ id: simulationId })
      .update({ status: 'COMPLETED', updated_at: Date.now() })
  }

  return { ok: true, index }
}

const worker = new Worker('simulation-jobs', processJob, { connection: {} })

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`) // eslint-disable-line no-console
})
worker.on('failed', (job, err) => {
  console.warn(`Job ${job?.id} failed: ${err.message}`) // eslint-disable-line no-console
})
