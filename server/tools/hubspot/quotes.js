module.exports = (client) => ({
  create: async (props, associations = []) => {
    const body = { properties: props }
    if (associations.length) body.associations = associations
    const res = await client.post('/crm/v3/objects/quotes', body)
    return res.data
  },
  get: async (id, opts) => {
    const url = id ? `/crm/v3/objects/quotes/${encodeURIComponent(id)}` : '/crm/v3/objects/quotes'
    const res = await client.get(url, opts)
    return res.data
  },
  update: async (id, props) => {
    const res = await client.patch(`/crm/v3/objects/quotes/${encodeURIComponent(id)}`, { properties: props })
    return res.data
  }
})
