function routeIntent(question = '') {
  const text = question.toLowerCase()
  if (text.includes('monthly revenue')) return 'getMonthlyRevenue'
  if (text.includes('profit center')) return 'getProfitCenterRevenue'
  if (text.includes('vendor due')) return 'getVendorDue'
  if (text.includes('customer due')) return 'getCustomerDue'
  if (text.includes('po') && text.includes('material')) return 'getPOCount'
  return 'getGeneralPO'
}

module.exports = { routeIntent }
