const cds = require('@sap/cds')
const core = require('./fi-core')

module.exports = cds.service.impl(function () {
  this.on('getMonthlyRevenue', (req) => (core.enforceRole(req) ? core.getMonthlyRevenue() : undefined))
  this.on('getVendorDue', (req) => (core.enforceRole(req) ? core.getVendorDue(req.data.vendor) : undefined))
  this.on('getCustomerDue', (req) => (core.enforceRole(req) ? core.getCustomerDue(req.data.customer) : undefined))
  this.on('getProfitCenterRevenue', (req) => (core.enforceRole(req) ? core.getProfitCenterRevenue(req.data.pc) : undefined))
  this.on('getProfitMargin', (req) => (core.enforceRole(req) ? core.getProfitMargin() : undefined))
  this.on('getTopProfitCenters', (req) => (core.enforceRole(req) ? core.getTopProfitCenters() : undefined))
  this.on('getReceivablesAging', (req) => (core.enforceRole(req) ? core.getReceivablesAging() : undefined))
  this.on('getPayablesAging', (req) => (core.enforceRole(req) ? core.getPayablesAging() : undefined))
})
