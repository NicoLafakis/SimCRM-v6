module.exports = (client) => ({
  create: async (props, associations = []) => {
    const body = { properties: props }
    if (associations.length) body.associations = associations
    const res = await client.post('/crm/v3/objects/tickets', body)
    return res.data
  },
  get: async (id, opts) => {
    const url = id ? `/crm/v3/objects/tickets/${encodeURIComponent(id)}` : '/crm/v3/objects/tickets'
    const res = await client.get(url, opts)
    return res.data
  },
  update: async (id, props) => {
    return (await client.patch(`/crm/v3/objects/tickets/${encodeURIComponent(id)}`, { properties: props })).data
  },
  delete: async (id) => {
    return (await client.del(`/crm/v3/objects/tickets/${encodeURIComponent(id)}`)).data
  }
})
