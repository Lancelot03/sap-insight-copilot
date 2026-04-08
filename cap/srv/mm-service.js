const cds = require('@sap/cds')
const core = require('./mm-core')

module.exports = cds.service.impl(function () {
  this.on('getPOCount', (req) => (core.enforceRole(req) ? core.getPOCount(req.data.material) : undefined))
  this.on('getMaterialSpend', (req) => (core.enforceRole(req) ? core.getMaterialSpend(req.data.material) : undefined))
  this.on('getVendorSpend', (req) => (core.enforceRole(req) ? core.getVendorSpend(req.data.vendor) : undefined))
  this.on('getPlantPO', (req) => (core.enforceRole(req) ? core.getPlantPO(req.data.plant) : undefined))
  this.on('getGeneralPO', (req) => (core.enforceRole(req) ? core.getGeneralPO() : undefined))
  this.on('getOpenPOs', (req) => (core.enforceRole(req) ? core.getOpenPOs() : undefined))
  this.on('getTopVendors', (req) => (core.enforceRole(req) ? core.getTopVendors(req.data.limit) : undefined))
  this.on('getPlantSpend', (req) => (core.enforceRole(req) ? core.getPlantSpend(req.data.plant) : undefined))
  this.on('getMonthlyPOTrend', (req) => (core.enforceRole(req) ? core.getMonthlyPOTrend(req.data.month) : undefined))
})
