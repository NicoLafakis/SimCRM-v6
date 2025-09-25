module.exports = (client) => ({
  create: async (props, associations = []) => {
    const body = { properties: props }
    if (associations.length) body.associations = associations
    const res = await client.post('/crm/v3/objects/deals', body)
    return res.data
  },
  get: async (id, opts) => {
    const url = id ? `/crm/v3/objects/deals/${encodeURIComponent(id)}` : '/crm/v3/objects/deals'
    const res = await client.get(url, opts)
    return res.data
  },
  update: async (id, props) => {
    const res = await client.patch(`/crm/v3/objects/deals/${encodeURIComponent(id)}`, { properties: props })
    return res.data
  },
  delete: async (id) => {
    const res = await client.del(`/crm/v3/objects/deals/${encodeURIComponent(id)}`)
    return res.data
  }
})
