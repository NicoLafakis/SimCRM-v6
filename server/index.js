require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { createOrchestrator } = require('./orchestrator')
const { listKeys, createKey, deleteKey, getDecryptedToken } = require('./hubspotKeyStore')
const { pool } = require('./db')
const axios = require('axios')

const PORT = process.env.PORT || 4000
const API_TOKEN = process.env.HUBSPOT_API_TOKEN // optional now
if (!API_TOKEN) console.log('Info: HUBSPOT_API_TOKEN not set at startup (expected: per-user tokens will be used).')

const orchestrator = createOrchestrator({ apiToken: API_TOKEN })

const app = express()
app.use(bodyParser.json())

app.post('/api/create-contact-company', async (req, res) => {
  try {
    const { contactProps = {}, companyProps = {} } = req.body
    const result = await orchestrator.createContactWithCompany({ contactProps, companyProps })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message, details: err.response?.data || null })
  }
})

app.post('/api/create-deal', async (req, res) => {
  try {
    const { contactId, companyId, dealProps } = req.body
    const result = await orchestrator.createDealForContact({ contactId, companyId, dealProps })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message, details: err.response?.data || null })
  }
})

app.post('/api/create-note', async (req, res) => {
  try {
    const { noteProps, contactId, companyId, dealId, ticketId } = req.body
    const result = await orchestrator.createNoteWithAssociations({ noteProps, contactId, companyId, dealId, ticketId })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message, details: err.response?.data || null })
  }
})

app.post('/api/create-call', async (req, res) => {
  try {
    const { callProps, contactId } = req.body
    const result = await orchestrator.createCallForContact({ callProps, contactId })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message, details: err.response?.data || null })
  }
})

app.post('/api/create-task', async (req, res) => {
  try {
    const { taskProps, contactId } = req.body
    const result = await orchestrator.createTaskForContact({ taskProps, contactId })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message, details: err.response?.data || null })
  }
})

// ---- Simulation APIs ----
const { v4: uuidv4 } = require('uuid')
const knexConfig = require('../knexfile')
const Knex = require('knex')
const knex = Knex(knexConfig.development || knexConfig)

app.post('/api/simulations', async (req, res) => {
  try {
    const { userId, scenario, distributionMethod, totalRecords, startTime, endTime } = req.body || {}
    if (!userId) return res.status(400).json({ ok:false, error:'userId required' })
    if (!scenario) return res.status(400).json({ ok:false, error:'scenario required' })
    if (!distributionMethod) return res.status(400).json({ ok:false, error:'distributionMethod required' })
    if (!totalRecords || totalRecords <= 0) return res.status(400).json({ ok:false, error:'totalRecords > 0 required' })
    const now = Date.now()
    const sim = {
      id: uuidv4(),
      user_id: userId,
      status: 'QUEUED',
      scenario,
      distribution_method: distributionMethod,
      total_records: totalRecords,
      records_processed: 0,
      start_time: startTime || now,
      end_time: endTime || (now + 60 * 60 * 1000),
      created_at: now,
      updated_at: now,
    }
    await knex('simulations').insert(sim)
    res.json({ ok: true, simulation: sim })
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message })
  }
})

app.post('/api/simulations/:id/start', async (req, res) => {
  try {
    const { id } = req.params
    const out = await orchestrator.startSimulation(id)
    res.json({ ok: true, ...out })
  } catch (e) {
    res.status(400).json({ ok:false, error: e.message })
  }
})

app.get('/api/simulations', async (req, res) => {
  try {
    const userId = req.query.userId
    if (!userId) return res.status(400).json({ ok:false, error: 'userId required' })
    const rows = await knex('simulations').where({ user_id: userId }).orderBy('created_at', 'desc').limit(50)
    res.json({ ok: true, simulations: rows })
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message })
  }
})

app.get('/api/simulations/:id', async (req, res) => {
  try {
    const { id } = req.params
    const row = await knex('simulations').where({ id }).first()
    if (!row) return res.status(404).json({ ok:false, error: 'not found' })
    res.json({ ok: true, simulation: row })
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message })
  }
})

// HubSpot API key management (user scoping placeholder: using playerName or provided userId from body)
app.get('/api/hubspot/keys', async (req, res) => {
  try {
    const userId = req.query.userId
    const saas = req.query.saas || 'hubspot'
    if (!userId) return res.status(400).json({ ok:false, error: 'userId required' })
    const keys = await listKeys(userId, { saas })
    res.json({ ok: true, keys })
  } catch (e) {
    const msg = e.message.includes('TOKEN_ENC_SECRET') ? 'Server missing TOKEN_ENC_SECRET; cannot decrypt tokens.' : e.message
    res.status(500).json({ ok: false, error: msg })
  }
})

app.post('/api/hubspot/keys', async (req, res) => {
  try {
    const { userId, label, token, saas = 'hubspot' } = req.body || {}
    if (!userId) return res.status(400).json({ ok:false, error: 'userId required' })
    if (!label || !token) return res.status(400).json({ ok:false, error: 'label and token required' })
    const key = await createKey({ userId, label, token, saas })
    res.json({ ok: true, key })
  } catch (e) {
    const msg = e.message.includes('TOKEN_ENC_SECRET') ? 'Server missing TOKEN_ENC_SECRET; cannot encrypt token.' : e.message
    res.status(500).json({ ok: false, error: msg })
  }
})

app.delete('/api/hubspot/keys/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.query.userId
    if (!userId) return res.status(400).json({ ok:false, error: 'userId required' })
    await deleteKey({ userId, id })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

app.post('/api/hubspot/validate', async (req, res) => {
  try {
    const { userId, keyId } = req.body || {}
    if (!userId) return res.status(400).json({ ok:false, error: 'userId required' })
    if (!keyId) return res.status(400).json({ ok:false, error: 'keyId required' })
    const token = await getDecryptedToken({ userId, id: keyId })
    if (!token) return res.status(404).json({ ok:false, error: 'Key not found' })
    try {
      const resp = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
        params: { limit: 1, properties: 'firstname' },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000
      })
      if (resp.status >= 200 && resp.status < 300) {
        if (pool) {
          try { await pool.query('UPDATE users SET hubspot_active_key_id = ?, hubspot_connected_at = ? WHERE id = ? LIMIT 1', [keyId, Date.now(), userId]) } catch (e) { console.warn('Failed to update user hubspot columns:', e.message) }
        }
        return res.json({ ok: true })
      }
      return res.status(400).json({ ok:false, error: 'Unexpected status from HubSpot: ' + resp.status })
    } catch (apiErr) {
      const status = apiErr.response?.status
      if (status === 401 || status === 403) return res.status(401).json({ ok:false, error: 'HubSpot token unauthorized (401/403). Check scopes.' })
      return res.status(400).json({ ok:false, error: 'Validation request failed: ' + (apiErr.message || 'unknown error') })
    }
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message })
  }
})

// Auth endpoints (migrated from dev-auth; now using unified users table)
try {
  const devAuth = require('./devAuthStore')
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { playerName, passcode, email, companyName } = req.body || {}
      const out = await devAuth.signup({ playerName, passcode, email, companyName })
      res.json({ ok: true, user: out })
    } catch (e) {
      res.status(400).json({ ok: false, error: e.message })
    }
  })

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { identifier, passcode } = req.body || {}
      const out = await devAuth.login({ identifier, passcode })
      res.json(out)
    } catch (e) {
      res.status(400).json({ ok: false, error: e.message })
    }
  })

  // Admin endpoints: list/reset users (still convenience; protect in production)
  app.get('/api/auth/users', async (req, res) => {
    try {
      const rows = await devAuth.listUsers()
      res.json({ ok: true, users: rows })
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message })
    }
  })

  app.post('/api/auth/reset', async (req, res) => {
    try {
      await devAuth.resetUsers()
      res.json({ ok: true })
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message })
    }
  })
} catch (e) {
  console.warn('Dev auth store not available:', e.message)
}

app.listen(PORT, () => console.log(`Server listening ${PORT}`))
