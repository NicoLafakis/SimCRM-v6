const { createClient } = require('./hubspotClient')
const { createTools } = require('./toolsFactory')

function createOrchestrator({ apiToken }) {
  const client = createClient({ apiToken })
  const tools = createTools(client)

  return {
    // High-level: create contact + company and associate
    createContactWithCompany: async ({ contactProps, companyProps }) => {
      const company = await tools.companies.create(companyProps)
      const contact = await tools.contacts.create({ ...contactProps })
      // associate contact -> company using associations API
      // HubSpot associations v4: PUT /crm/v4/objects/{fromObjectType}/{fromObjectId}/associations/{toObjectType}/{toObjectId}/{associationTypeId}
      // Default associationTypeId for contact->company may vary; using 1 is common but recommend fetching via associations API in production
      const assocUrl = `/crm/v4/objects/contacts/${contact.id}/associations/companies/${company.id}/1`
      try {
        await client.put(assocUrl)
      } catch (err) {
        // best-effort; ignore association errors here
      }
      return { contact, company }
    },

    createDealForContact: async ({ contactId, companyId, dealProps }) => {
      const deal = await tools.deals.create(dealProps, [/* associations optional */])
      // associate the deal with contact/company via associations API
      try {
        await client.put(`/crm/v4/objects/deals/${deal.id}/associations/contacts/${contactId}/5`)
        if (companyId) await client.put(`/crm/v4/objects/deals/${deal.id}/associations/companies/${companyId}/3`)
      } catch (e) {}
      return deal
    },

    // pass-through for tools
    tools,
  }
}

module.exports = { createOrchestrator }
