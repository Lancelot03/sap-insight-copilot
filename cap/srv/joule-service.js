const cds = require('@sap/cds')
const router = require('./router-service')
const mm = require('./mm-core')
const fi = require('./fi-core')

async function handleJouleQuery(query) {
  const action = router(query)

  switch (action) {
    case 'getPOCount': {
      const material = String(query).match(/material\s+([a-z0-9_.\-/]+)/i)?.[1] || 'MAT-1000'
      return mm.getPOCount(material)
    }
    case 'getMonthlyRevenue':
      return fi.getMonthlyRevenue()
    case 'getVendorDue': {
      const vendor = String(query).match(/vendor\s+([a-z0-9_.\-/]+)/i)?.[1] || 'VEND-001'
      return fi.getVendorDue(vendor)
    }
    case 'getCustomerDue': {
      const customer = String(query).match(/customer\s+([a-z0-9_.\-/]+)/i)?.[1] || 'CUST-001'
      return fi.getCustomerDue(customer)
    }
    case 'getProfitCenterRevenue': {
      const pc = String(query).match(/(pc|profit center)\s+([a-z0-9_.\-/]+)/i)?.[2] || 'PC-100'
      return fi.getProfitCenterRevenue(pc)
    }
    default:
      return { message: 'Intent not recognized' }
  }
}

module.exports = cds.service.impl(function () {
  this.on('askJoule', async (req) => {
    if (!req.user || typeof req.user.is !== 'function') {
      req.reject(401, 'Unauthorized: missing SAP BTP authentication context')
      return
    }

    const question = req.data.question
    if (!question || !String(question).trim()) {
      req.reject(400, 'question is required')
      return
    }

    const payload = await handleJouleQuery(question)
    return {
      intent: router(question),
      authorized: true,
      payload: JSON.stringify(payload)
    }
  })
})

module.exports.handleJouleQuery = handleJouleQuery
