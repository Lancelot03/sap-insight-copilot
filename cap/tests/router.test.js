const test = require('node:test')
const assert = require('node:assert/strict')

const { routeIntent } = require('../srv/router-service')

test('routeIntent maps monthly revenue', () => {
  assert.equal(routeIntent('What is monthly revenue?'), 'getMonthlyRevenue')
})

test('routeIntent maps PO material query', () => {
  assert.equal(routeIntent('How many PO for material MAT-1000'), 'getPOCount')
})
