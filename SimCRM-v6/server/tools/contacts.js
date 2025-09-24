module.exports = (client) => ({
  create: async (props) => {
    const body = { properties: props }
    const res = await client.post('/crm/v3/objects/contacts', body)
    return res.data
  },
  get: async (id, opts) => {
    const url = id ? `/crm/v3/objects/contacts/${encodeURIComponent(id)}` : '/crm/v3/objects/contacts'
    const res = await client.get(url, opts)
    return res.data
  },
  update: async (id, props) => {
    const body = { properties: props }
    const res = await client.patch(`/crm/v3/objects/contacts/${encodeURIComponent(id)}`, body)
    return res.data
  },
  delete: async (id) => {
    const res = await client.del(`/crm/v3/objects/contacts/${encodeURIComponent(id)}`)
    return res.data
  },
  batchUpsert: async (inputs, idProperty = 'email') => {
    const body = { inputs: inputs.map(i => ({ id: i[idProperty], idProperty, properties: i.properties })) }
    const res = await client.post('/crm/v3/objects/contacts/batch/upsert', body)
    return res.data
  }
})
