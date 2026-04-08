const test = require('node:test')
const assert = require('node:assert/strict')

const routeQuery = require('../srv/router-service')

test('routeQuery maps monthly revenue', () => {
  assert.equal(routeQuery('What is monthly revenue?'), 'getMonthlyRevenue')
})

test('routeQuery maps PO material query', () => {
  assert.equal(routeQuery('How many PO for material MAT-1000'), 'getPOCount')
})

test('routeQuery returns unknown for unsupported query', () => {
  assert.equal(routeQuery('tell me weather'), 'unknown')
})


test('routeQuery maps customer due query', () => {
  assert.equal(routeQuery('customer due for customer CUST-001'), 'getCustomerDue')
})
