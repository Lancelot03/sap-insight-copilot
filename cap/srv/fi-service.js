const cds = require('@sap/cds')
const {
  getMonthlyRevenue,
  getVendorDue,
  getCustomerDue,
  getProfitCenterRevenue,
  enforceRole
} = require('./fi-core')

module.exports = cds.service.impl(function () {
  this.on('getMonthlyRevenue', (req) => {
    if (!enforceRole(req)) return
    return getMonthlyRevenue()
  })

  this.on('getVendorDue', (req) => {
    if (!enforceRole(req)) return
    return getVendorDue(req.data.vendor)
  })

  this.on('getCustomerDue', (req) => {
    if (!enforceRole(req)) return
    return getCustomerDue(req.data.customer)
  })

  this.on('getProfitCenterRevenue', (req) => {
    if (!enforceRole(req)) return
    return getProfitCenterRevenue(req.data.pc)
  })
})

