const contacts = require('./tools/contacts')
const companies = require('./tools/companies')
const deals = require('./tools/deals')
const tickets = require('./tools/tickets')
const engagements = require('./tools/engagements')
const quotes = require('./tools/quotes')
const invoices = require('./tools/invoices')
const customObjects = require('./tools/customObjects')

function createTools(client) {
  return {
    contacts: contacts(client),
    companies: companies(client),
    deals: deals(client),
    tickets: tickets(client),
    engagements: engagements(client),
    quotes: quotes(client),
    invoices: invoices(client),
    customObjects: customObjects(client),
  }
}

module.exports = { createTools }
