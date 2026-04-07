module.exports = function routeQuery(query) {
  const q = String(query || '').toLowerCase()

  if (q.includes('po') && q.includes('material')) {
    return 'getPOCount'
  }

  if (q.includes('revenue')) {
    return 'getMonthlyRevenue'
  }

  if (q.includes('vendor due')) {
    return 'getVendorDue'
  }

  if (q.includes('profit center')) {
    return 'getProfitCenterRevenue'
  }

  return 'unknown'
}
