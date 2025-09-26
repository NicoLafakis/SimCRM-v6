require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { createOrchestrator } = require('./orchestrator')

const PORT = process.env.PORT || 4000
const API_TOKEN = process.env.HUBSPOT_API_TOKEN
if (!API_TOKEN) console.warn('Warning: HUBSPOT_API_TOKEN not set. Server will throw on API calls.')

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
