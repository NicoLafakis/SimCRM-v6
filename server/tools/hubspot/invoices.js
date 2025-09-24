module.exports = (client) => ({
  create: async (props) => {
    const res = await client.post('/crm/v3/objects/invoices', { properties: props })
    return res.data
  },
  get: async (id, opts) => {
    const url = id ? `/crm/v3/objects/invoices/${encodeURIComponent(id)}` : '/crm/v3/objects/invoices'
    const res = await client.get(url, opts)
    return res.data
  },
  update: async (id, props) => {
    const res = await client.patch(`/crm/v3/objects/invoices/${encodeURIComponent(id)}`, { properties: props })
    return res.data
  }
})
