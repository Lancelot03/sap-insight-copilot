const test = require('node:test')
const assert = require('node:assert/strict')

const {
  validateKey,
  enforceRole,
  getPOCount,
  getMaterialSpend,
  getVendorSpend,
  getPlantPO,
  getGeneralPO
} = require('../srv/mm-core')

test('validateKey rejects empty inputs', () => {
  assert.throws(() => validateKey('', 'material'), /material is required/)
})

test('validateKey rejects unsupported characters', () => {
  assert.throws(() => validateKey('MAT 1000', 'material'), /unsupported characters/)
})

test('getPOCount returns deterministic count by material', () => {
  const response = getPOCount('mat-1000')
  assert.deepEqual(response, { material: 'MAT-1000', poCount: 2 })
})

test('getMaterialSpend returns spend summary for a material', () => {
  const response = getMaterialSpend('MAT-1000')
  assert.equal(response.key, 'MAT-1000')
  assert.equal(response.poCount, 2)
  assert.equal(response.totalSpend, 1700.5)
  assert.equal(response.currency, 'USD')
})

test('getVendorSpend returns spend summary by vendor', () => {
  const response = getVendorSpend('vend-001')
  assert.equal(response.key, 'VEND-001')
  assert.equal(response.poCount, 2)
  assert.equal(response.totalSpend, 2051.25)
})

test('getPlantPO returns plant-level PO totals', () => {
  const response = getPlantPO('pl01')
  assert.deepEqual(response, {
    plant: 'PL01',
    poCount: 2,
    totalSpend: 1700.5,
    currency: 'USD'
  })
})

test('getGeneralPO returns global PO KPI response', () => {
  const response = getGeneralPO()
  assert.equal(response.totalPOCount, 4)
  assert.equal(response.totalSpend, 3531.25)
  assert.equal(response.uniqueVendors, 3)
  assert.equal(response.uniquePlants, 3)
  assert.equal(response.currency, 'USD')
})

test('enforceRole allows authorized users', () => {
  const req = {
    user: { is: (role) => role === 'MM_VIEWER' },
    reject: () => {
      throw new Error('reject should not be called')
    }
  }

  assert.equal(enforceRole(req), true)
})

test('enforceRole rejects unauthorized users', () => {
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
    message: 'Forbidden: Missing required MM role'
  })
})


test('getOpenPOs returns count and spend for open POs', () => {
  const { getOpenPOs } = require('../srv/mm-core')
  const response = getOpenPOs()
  assert.equal(response.openPOCount, 3)
  assert.equal(response.openPOSpend, 3031.25)
})

test('getTopVendors returns ranked vendors', () => {
  const { getTopVendors } = require('../srv/mm-core')
  const response = getTopVendors(2)
  assert.equal(response.length, 2)
  assert.equal(response[0].vendor, 'VEND-001')
})
