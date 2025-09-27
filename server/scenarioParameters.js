// Scenario parameter bundles consumed by orchestrator / worker.
// Values are indicative; calibrate later.

const scenarios = {
  b2b: {
    id: 'b2b',
    leadVolumeMultiplier: 0.8,
    avgSalesCycleDays: 60,
    dealWinRateBase: 0.6,
    dealAmount: { distribution: 'lognormal', mu: 10.5, sigma: 0.9 },
    contactToCompanyRatio: { min: 3, max: 6 },
    touchpointDensity: { notesPerLead: [1,3], tasksPerLead: [0,2], callsPerLead: [0,1] },
  },
  b2c: {
    id: 'b2c',
    leadVolumeMultiplier: 1.8,
    avgSalesCycleDays: 7,
    dealWinRateBase: 0.42,
    dealAmount: { distribution: 'lognormal', mu: 7.8, sigma: 0.5 },
    contactToCompanyRatio: { min: 1, max: 2 },
    touchpointDensity: { notesPerLead: [0,1], tasksPerLead: [0,1], callsPerLead: [0,0] },
  }
}

function getScenarioParameters(id) {
  return scenarios[id] || null
}

module.exports = { getScenarioParameters }
