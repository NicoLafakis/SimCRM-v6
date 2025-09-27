// Worker process consuming simulation jobs.
// Run with: node server/worker.js

const { Worker } = require('bullmq')
const { createClient: createRedisClient } = require('redis')
const knexConfig = require('../knexfile')
const Knex = require('knex')
const { createClient } = require('./hubspotClient')
const { createTools } = require('./toolsFactory')
const { getDecryptedToken } = require('./hubspotKeyStore')

const knex = Knex(knexConfig.development || knexConfig)

// Redis progress counters (optional). Enabled if REDIS_PROGRESS=1
const USE_REDIS_PROGRESS = process.env.REDIS_PROGRESS === '1'
let redisClient = null
if (USE_REDIS_PROGRESS) {
  redisClient = createRedisClient()
  redisClient.on('error', (e) => console.warn('Redis error:', e.message)) // eslint-disable-line no-console
  redisClient.connect().catch(e => console.warn('Redis connect failed:', e.message)) // eslint-disable-line no-console
}

async function flushProgress(simulationId) {
  if (!USE_REDIS_PROGRESS || !redisClient) return
  const key = `sim:${simulationId}:processed`
  const valStr = await redisClient.get(key)
  if (!valStr) return
  const val = parseInt(valStr, 10)
  if (isNaN(val)) return
  // Write absolute value to DB
  await knex('simulations').where({ id: simulationId }).update({ records_processed: val, updated_at: Date.now() })
}

// Placeholder: we will later resolve per-user token or scenario-driven logic.
async function processJob(job) {
  const { simulationId, index, user_id, scenario_params } = job.data

  const sim = await knex('simulations').where({ id: simulationId }).first()
  if (!sim) {
    return { ok: false, error: 'simulation missing' }
  }

  // Resolve user HubSpot token if available
  let hubspotToken = null
  if (user_id) {
    // Look up active key id from users
    try {
      const userRow = await knex('users').where({ id: user_id }).first()
      if (userRow?.hubspot_active_key_id) {
        hubspotToken = await getDecryptedToken({ userId: user_id, id: userRow.hubspot_active_key_id })
      }
    } catch (e) {
      console.warn('Token resolution failed:', e.message) // eslint-disable-line no-console
    }
  }

  if (hubspotToken) {
    // In future: actually create objects in HubSpot using tools.
    try {
      const client = createClient({})
      client.setToken(hubspotToken)
      const tools = createTools(client)
      // Minimal placeholder (no-op network to keep runtime light now)
      // Example (commented until full spec):
      // await tools.contacts.create({ properties: { firstname: 'Sim', lastname: 'Lead', email: `lead${index}@example.com` } })
    } catch (e) {
      console.warn('HubSpot op failed (non-fatal):', e.message) // eslint-disable-line no-console
    }
  }

  if (USE_REDIS_PROGRESS && redisClient) {
    const key = `sim:${simulationId}:processed`
    const newVal = await redisClient.incr(key)
    // Every 10 increments flush to DB
    if (newVal % 10 === 0) {
      await flushProgress(simulationId)
    }
    if (newVal >= sim.total_records) {
      await flushProgress(simulationId)
      await knex('simulations').where({ id: simulationId }).update({ status: 'COMPLETED', updated_at: Date.now() })
    }
  } else {
    // Fallback direct DB increment
    await knex('simulations')
      .where({ id: simulationId })
      .increment('records_processed', 1)
      .update({ updated_at: Date.now() })
    const updated = await knex('simulations').where({ id: simulationId }).first()
    if (updated && updated.records_processed >= updated.total_records) {
      await knex('simulations')
        .where({ id: simulationId })
        .update({ status: 'COMPLETED', updated_at: Date.now() })
    }
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

async function gracefulShutdown() {
  console.log('Worker shutting down...') // eslint-disable-line no-console
  try { await worker.close() } catch (e) { console.warn('Worker close error:', e.message) }
  if (USE_REDIS_PROGRESS && redisClient) {
    // Flush all simulation counters that might exist (simplistic: scan)
    try {
      for await (const key of (async function* scanKeys(cursor=0){
        let cur = cursor
        do {
          const res = await redisClient.scan(cur, { MATCH: 'sim:*:processed', COUNT: 100 })
          cur = res.cursor
          for (const k of res.keys) yield k
        } while (cur !== 0)
      })()) {
        const simId = key.split(':')[1]
        await flushProgress(simId)
      }
    } catch (e) {
      console.warn('Flush scan error:', e.message)
    }
    try { await redisClient.quit() } catch {}
  }
  process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
