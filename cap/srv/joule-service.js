const cds = require('@sap/cds')

const mm = require('./mm-core')
const fi = require('./fi-core')

function normalize(question = '') {
  return String(question).trim().toLowerCase()
}

function detectIntent(question) {
  const text = normalize(question)

  if (text.includes('monthly revenue')) return 'getMonthlyRevenue'
  if (text.includes('profit center') || text.includes('pc revenue')) return 'getProfitCenterRevenue'
  if (text.includes('vendor due') || text.includes('payable due')) return 'getVendorDue'
  if (text.includes('customer due') || text.includes('receivable due')) return 'getCustomerDue'

  if (text.includes('how many po') || text.includes('po count')) return 'getPOCount'
  if (text.includes('material spend')) return 'getMaterialSpend'
  if (text.includes('vendor spend')) return 'getVendorSpend'
  if (text.includes('plant po')) return 'getPlantPO'

  return 'getGeneralPO'
}

function extractValue(question, key) {
  const match = normalize(question).match(new RegExp(`${key}\\s+([a-z0-9_.\\-/]+)`))
  return match?.[1]?.toUpperCase()
}

function ensureRoles(req, roles) {
  if (!req.user || typeof req.user.is !== 'function') {
    req.reject(401, 'Unauthorized: missing SAP BTP authentication context')
    return false
  }

  if (!roles.some((role) => req.user.is(role))) {
    req.reject(403, `Forbidden: missing required role (${roles.join(' | ')})`)
    return false
  }

  return true
}

function routeToHandler(intent, question) {
  switch (intent) {
    case 'getPOCount':
      return mm.getPOCount(extractValue(question, 'material'))
    case 'getMaterialSpend':
      return mm.getMaterialSpend(extractValue(question, 'material'))
    case 'getVendorSpend':
      return mm.getVendorSpend(extractValue(question, 'vendor'))
    case 'getPlantPO':
      return mm.getPlantPO(extractValue(question, 'plant'))
    case 'getMonthlyRevenue':
      return fi.getMonthlyRevenue()
    case 'getVendorDue':
      return fi.getVendorDue(extractValue(question, 'vendor'))
    case 'getCustomerDue':
      return fi.getCustomerDue(extractValue(question, 'customer'))
    case 'getProfitCenterRevenue':
      return fi.getProfitCenterRevenue(extractValue(question, 'pc'))
    case 'getGeneralPO':
    default:
      return mm.getGeneralPO()
  }
}

function scopeForIntent(intent) {
  return intent.startsWith('getMonthlyRevenue') || intent.startsWith('getVendorDue') || intent.startsWith('getCustomerDue') || intent.startsWith('getProfitCenterRevenue')
    ? ['FI_VIEWER', 'FI_ADMIN']
    : ['MM_VIEWER', 'MM_ADMIN']
}

module.exports = cds.service.impl(function () {
  this.on('askJoule', (req) => {
    const question = req.data.question

    if (!question || !String(question).trim()) {
      req.reject(400, 'question is required')
      return
    }

    const intent = detectIntent(question)
    const roles = scopeForIntent(intent)

    if (!ensureRoles(req, roles)) return

    const payload = routeToHandler(intent, question)

    return {
      intent,
      authorized: true,
      payload: JSON.stringify(payload),
    }
  })
})

module.exports.__test = {
  detectIntent,
  extractValue,
  scopeForIntent,
}
