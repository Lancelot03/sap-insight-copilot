import test from 'node:test'
import assert from 'node:assert/strict'

import { extractEntities, normalizeQuestion } from '../utils/parser.ts'
import { routeQuery } from '../utils/query-router.ts'

test('normalizeQuestion normalizes whitespace and case', () => {
  assert.equal(normalizeQuestion('  What is   MONTHLY Revenue?  '), 'what is monthly revenue?')
})

test('extractEntities extracts all supported entities', () => {
  const entities = extractEntities('material 100023 vendor vend-200 customer cust-9 plant pl01 pc pc-77')
  assert.deepEqual(entities, {
    material: '100023',
    vendor: 'VEND-200',
    customer: 'CUST-9',
    plant: 'PL01',
    pc: 'PC-77',
  })
})

test('routes material PO count question', () => {
  const result = routeQuery('How many POs for material 100023?')
  assert.equal(result.action, 'getPOCount')
  assert.equal(result.entities.material, '100023')
  assert.ok(result.confidence >= 0.55)
})

test('routes monthly revenue question', () => {
  const result = routeQuery('What is monthly revenue?')
  assert.equal(result.action, 'getMonthlyRevenue')
  assert.ok(result.confidence >= 0.55)
})

test('routes vendor due question', () => {
  const result = routeQuery('Show vendor due for vendor vend-001')
  assert.equal(result.action, 'getVendorDue')
  assert.equal(result.entities.vendor, 'VEND-001')
})

test('routes customer due question', () => {
  const result = routeQuery('customer outstanding for customer cust-001')
  assert.equal(result.action, 'getCustomerDue')
  assert.equal(result.entities.customer, 'CUST-001')
})

test('routes profit center revenue question', () => {
  const result = routeQuery('Revenue for PC pc-100')
  assert.equal(result.action, 'getProfitCenterRevenue')
  assert.equal(result.entities.pc, 'PC-100')
})

test('returns unknown for unrelated question', () => {
  const result = routeQuery('How is the weather in Berlin?')
  assert.equal(result.action, 'unknown')
  assert.ok(result.confidence < 0.55)
})
