module.exports = (client) => ({
  create: async (props) => {
    const res = await client.post('/crm/v3/objects/companies', { properties: props })
    return res.data
  },
  get: async (id, opts) => {
    const url = id ? `/crm/v3/objects/companies/${encodeURIComponent(id)}` : '/crm/v3/objects/companies'
    const res = await client.get(url, opts)
    return res.data
  },
  update: async (id, props) => {
    const res = await client.patch(`/crm/v3/objects/companies/${encodeURIComponent(id)}`, { properties: props })
    return res.data
  },
  delete: async (id) => {
    const res = await client.del(`/crm/v3/objects/companies/${encodeURIComponent(id)}`)
    return res.data
  }
})
