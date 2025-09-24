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

app.listen(PORT, () => console.log(`Server listening ${PORT}`))
