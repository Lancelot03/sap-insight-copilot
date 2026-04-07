const cds = require('@sap/cds')

module.exports = cds.service.impl(function () {
  this.on('READ', 'HealthCheck', () => [
    { ID: '00000000-0000-0000-0000-000000000001', status: 'UP' }
  ])
})
