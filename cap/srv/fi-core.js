const CURRENCY = 'USD'
const ALLOWED_INPUT = /^[A-Za-z0-9_\-./]+$/

const sampleFinancePostings = [
  { docNumber: '19000001', postingType: 'RV', customer: 'CUST-001', profitCenter: 'PC-100', amount: 12000, postingDate: '2026-01-03', status: 'POSTED' },
  { docNumber: '19000002', postingType: 'RV', customer: 'CUST-002', profitCenter: 'PC-100', amount: 8500, postingDate: '2026-01-18', status: 'POSTED' },
  { docNumber: '19000003', postingType: 'RV', customer: 'CUST-003', profitCenter: 'PC-200', amount: 7600, postingDate: '2026-02-07', status: 'POSTED' },
  { docNumber: '19000004', postingType: 'RV', customer: 'CUST-001', profitCenter: 'PC-200', amount: 4300, postingDate: '2026-02-22', status: 'POSTED' },
  { docNumber: '19000005', postingType: 'AP', vendor: 'VEND-001', amount: 2100, postingDate: '2026-01-10', dueDate: '2026-01-25', status: 'OPEN' },
  { docNumber: '19000006', postingType: 'AP', vendor: 'VEND-001', amount: 1300, postingDate: '2026-02-02', dueDate: '2026-03-05', status: 'OPEN' },
  { docNumber: '19000007', postingType: 'AP', vendor: 'VEND-002', amount: 1800, postingDate: '2025-12-01', dueDate: '2025-12-15', status: 'OPEN' },
  { docNumber: '19000008', postingType: 'AR', customer: 'CUST-001', amount: 5000, postingDate: '2026-01-11', dueDate: '2026-01-31', status: 'OPEN' },
  { docNumber: '19000009', postingType: 'AR', customer: 'CUST-001', amount: 3200, postingDate: '2025-11-25', dueDate: '2025-12-10', status: 'OPEN' },
  { docNumber: '19000010', postingType: 'AR', customer: 'CUST-002', amount: 2800, postingDate: '2025-10-05', dueDate: '2025-10-20', status: 'OPEN' }
]

function normalize(input) {
  return typeof input === 'string' ? input.trim().toUpperCase() : ''
}

function validateKey(value, fieldName) {
  const normalized = normalize(value)
  if (!normalized) {
    const error = new Error(`${fieldName} is required`)
    error.statusCode = 400
    throw error
  }
  if (!ALLOWED_INPUT.test(normalized)) {
    const error = new Error(`${fieldName} contains unsupported characters`)
    error.statusCode = 400
    throw error
  }
  return normalized
}

function aggregateAmount(records) {
  return Number(records.reduce((sum, r) => sum + Number(r.amount || 0), 0).toFixed(2))
}

function getMonthKey(dateStr) {
  return dateStr.slice(0, 7)
}

function dueAging(records, asOfDate) {
  const buckets = { current: 0, due1To30: 0, due31To60: 0, due61Plus: 0 }

  for (const row of records) {
    const dueDate = new Date(row.dueDate)
    const days = Math.floor((asOfDate - dueDate) / (1000 * 60 * 60 * 24))

    if (days <= 0) buckets.current += Number(row.amount)
    else if (days <= 30) buckets.due1To30 += Number(row.amount)
    else if (days <= 60) buckets.due31To60 += Number(row.amount)
    else buckets.due61Plus += Number(row.amount)
  }

  return {
    current: Number(buckets.current.toFixed(2)),
    due1To30: Number(buckets.due1To30.toFixed(2)),
    due31To60: Number(buckets.due31To60.toFixed(2)),
    due61Plus: Number(buckets.due61Plus.toFixed(2))
  }
}

function getMonthlyRevenue(records = sampleFinancePostings) {
  const revenueRows = records.filter((r) => r.postingType === 'RV')
  const grouped = new Map()

  for (const row of revenueRows) {
    const key = getMonthKey(row.postingDate)
    grouped.set(key, (grouped.get(key) || 0) + Number(row.amount))
  }

  const monthly = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue: Number(revenue.toFixed(2)), currency: CURRENCY }))

  return {
    monthly,
    totalRevenue: aggregateAmount(revenueRows),
    currency: CURRENCY
  }
}

function getVendorDue(vendor, records = sampleFinancePostings, asOf = new Date()) {
  const normalizedVendor = validateKey(vendor, 'vendor')
  const vendorRows = records.filter((r) => r.postingType === 'AP' && r.status === 'OPEN' && normalize(r.vendor) === normalizedVendor)
  const aging = dueAging(vendorRows, asOf)

  return {
    key: normalizedVendor,
    openItems: vendorRows.length,
    totalDue: aggregateAmount(vendorRows),
    aging,
    currency: CURRENCY
  }
}

function getCustomerDue(customer, records = sampleFinancePostings, asOf = new Date()) {
  const normalizedCustomer = validateKey(customer, 'customer')
  const customerRows = records.filter((r) => r.postingType === 'AR' && r.status === 'OPEN' && normalize(r.customer) === normalizedCustomer)
  const aging = dueAging(customerRows, asOf)

  return {
    key: normalizedCustomer,
    openItems: customerRows.length,
    totalDue: aggregateAmount(customerRows),
    aging,
    currency: CURRENCY
  }
}

function getProfitCenterRevenue(pc, records = sampleFinancePostings) {
  const normalizedPC = validateKey(pc, 'pc')
  const pcRows = records.filter((r) => r.postingType === 'RV' && normalize(r.profitCenter) === normalizedPC)

  const groupedByMonth = new Map()
  for (const row of pcRows) {
    const month = getMonthKey(row.postingDate)
    groupedByMonth.set(month, (groupedByMonth.get(month) || 0) + Number(row.amount))
  }

  return {
    key: normalizedPC,
    documentCount: pcRows.length,
    totalRevenue: aggregateAmount(pcRows),
    monthly: [...groupedByMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, revenue]) => ({
      month,
      revenue: Number(revenue.toFixed(2)),
      currency: CURRENCY
    })),
    currency: CURRENCY
  }
}

function getProfitMargin(records = sampleFinancePostings) {
  const revenue = aggregateAmount(records.filter((r) => r.postingType === 'RV'))
  const expenses = aggregateAmount(records.filter((r) => r.postingType === 'AP'))
  const margin = revenue - expenses
  return {
    revenue,
    expenses,
    profit: Number(margin.toFixed(2)),
    marginPercent: revenue ? Number(((margin / revenue) * 100).toFixed(2)) : 0,
    currency: CURRENCY
  }
}

function getTopProfitCenters(records = sampleFinancePostings) {
  const grouped = new Map()
  for (const row of records.filter((r) => r.postingType === 'RV')) {
    const key = normalize(row.profitCenter)
    grouped.set(key, (grouped.get(key) || 0) + Number(row.amount))
  }

  return [...grouped.entries()]
    .map(([pc, revenue]) => ({ pc, revenue: Number(revenue.toFixed(2)), currency: CURRENCY }))
    .sort((a, b) => b.revenue - a.revenue)
}

function getReceivablesAging(records = sampleFinancePostings, asOf = new Date()) {
  const receivables = records.filter((r) => r.postingType === 'AR' && r.status === 'OPEN')
  return { ...dueAging(receivables, asOf), total: aggregateAmount(receivables), currency: CURRENCY }
}

function getPayablesAging(records = sampleFinancePostings, asOf = new Date()) {
  const payables = records.filter((r) => r.postingType === 'AP' && r.status === 'OPEN')
  return { ...dueAging(payables, asOf), total: aggregateAmount(payables), currency: CURRENCY }
}

function enforceRole(req, roles = ['FI_VIEWER', 'FI_ADMIN']) {
  if (!req.user || typeof req.user.is !== 'function') {
    req.reject(401, 'Unauthorized')
    return false
  }

  if (!roles.some((role) => req.user.is(role))) {
    req.reject(403, 'Forbidden: Missing required FI role')
    return false
  }

  return true
}

module.exports = {
  sampleFinancePostings,
  validateKey,
  getMonthlyRevenue,
  getVendorDue,
  getCustomerDue,
  getProfitCenterRevenue,
  getProfitMargin,
  getTopProfitCenters,
  getReceivablesAging,
  getPayablesAging,
  enforceRole
}
