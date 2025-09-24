module.exports = (client) => ({
  // For custom objects, clients must provide the objectType in the path
  create: async (objectType, props) => {
    const res = await client.post(`/crm/v3/objects/${objectType}`, { properties: props })
    return res.data
  },
  get: async (objectType, id, opts) => {
    const url = id ? `/crm/v3/objects/${objectType}/${encodeURIComponent(id)}` : `/crm/v3/objects/${objectType}`
    const res = await client.get(url, opts)
    return res.data
  },
  update: async (objectType, id, props) => {
    const res = await client.patch(`/crm/v3/objects/${objectType}/${encodeURIComponent(id)}`, { properties: props })
    return res.data
  }
})
