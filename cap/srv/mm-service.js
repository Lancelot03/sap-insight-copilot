const cds = require('@sap/cds')
const {
  enforceRole,
  getPOCount,
  getMaterialSpend,
  getVendorSpend,
  getPlantPO,
  getGeneralPO
} = require('./mm-core')

module.exports = cds.service.impl(function () {
  this.on('getPOCount', (req) => {
    if (!enforceRole(req)) return
    return getPOCount(req.data.material)
  })

  this.on('getMaterialSpend', (req) => {
    if (!enforceRole(req)) return
    return getMaterialSpend(req.data.material)
  })

  this.on('getVendorSpend', (req) => {
    if (!enforceRole(req)) return
    return getVendorSpend(req.data.vendor)
  })

  this.on('getPlantPO', (req) => {
    if (!enforceRole(req)) return
    return getPlantPO(req.data.plant)
  })

  this.on('getGeneralPO', (req) => {
    if (!enforceRole(req)) return
    return getGeneralPO()
  })
})
