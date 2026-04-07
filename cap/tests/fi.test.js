const test = require('node:test')
const assert = require('node:assert/strict')

const {
  validateKey,
  getMonthlyRevenue,
  getVendorDue,
  getCustomerDue,
  getProfitCenterRevenue,
  enforceRole
} = require('../srv/fi-core')

test('validateKey rejects bad customer input', () => {
  assert.throws(() => validateKey('CUST 01', 'customer'), /unsupported characters/)
})

test('getMonthlyRevenue aggregates revenue by month', () => {
  const response = getMonthlyRevenue()
  assert.equal(response.totalRevenue, 32400)
  assert.deepEqual(response.monthly, [
    { month: '2026-01', revenue: 20500, currency: 'USD' },
    { month: '2026-02', revenue: 11900, currency: 'USD' }
  ])
})

test('getVendorDue returns due aging buckets for vendor', () => {
  const response = getVendorDue('VEND-001', undefined, new Date('2026-02-28'))
  assert.equal(response.key, 'VEND-001')
  assert.equal(response.openItems, 2)
  assert.equal(response.totalDue, 3400)
  assert.deepEqual(response.aging, {
    current: 1300,
    due1To30: 0,
    due31To60: 2100,
    due61Plus: 0
  })
})

test('getCustomerDue returns due aging buckets for customer', () => {
  const response = getCustomerDue('CUST-001', undefined, new Date('2026-02-28'))
  assert.equal(response.key, 'CUST-001')
  assert.equal(response.openItems, 2)
  assert.equal(response.totalDue, 8200)
  assert.deepEqual(response.aging, {
    current: 0,
    due1To30: 5000,
    due31To60: 0,
    due61Plus: 3200
  })
})

test('getProfitCenterRevenue groups by month for pc', () => {
  const response = getProfitCenterRevenue('pc-100')
  assert.equal(response.key, 'PC-100')
  assert.equal(response.documentCount, 2)
  assert.equal(response.totalRevenue, 20500)
  assert.deepEqual(response.monthly, [
    { month: '2026-01', revenue: 20500, currency: 'USD' }
  ])
})

test('FI authorization middleware rejects missing roles', () => {
  let rejected
  const req = {
    user: { is: () => false },
    reject: (code, message) => {
      rejected = { code, message }
    }
  }

  assert.equal(enforceRole(req), false)
  assert.deepEqual(rejected, {
    code: 403,
    message: 'Forbidden: Missing required FI role'
  })
})


test('getProfitMargin returns revenue profitability KPI', () => {
  const { getProfitMargin } = require('../srv/fi-core')
  const response = getProfitMargin()
  assert.equal(response.revenue, 32400)
  assert.equal(response.expenses, 5200)
  assert.equal(response.profit, 27200)
})

test('getTopProfitCenters returns sorted revenue list', () => {
  const { getTopProfitCenters } = require('../srv/fi-core')
  const response = getTopProfitCenters()
  assert.equal(response[0].pc, 'PC-100')
})
