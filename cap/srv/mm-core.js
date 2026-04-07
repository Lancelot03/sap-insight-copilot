const CURRENCY = 'USD'
const ALLOWED_INPUT = /^[A-Za-z0-9_\-./]+$/

const samplePurchaseOrders = [
  { poNumber: '4500000010', material: 'MAT-1000', vendor: 'VEND-001', plant: 'PL01', netValue: 1200.5 },
  { poNumber: '4500000011', material: 'MAT-1000', vendor: 'VEND-002', plant: 'PL01', netValue: 500.0 },
  { poNumber: '4500000012', material: 'MAT-2000', vendor: 'VEND-001', plant: 'PL02', netValue: 850.75 },
  { poNumber: '4500000013', material: 'MAT-3000', vendor: 'VEND-003', plant: 'PL03', netValue: 980.0 }
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

function enforceRole(req, roles = ['MM_VIEWER', 'MM_ADMIN']) {
  if (!req.user || typeof req.user.is !== 'function') {
    req.reject(401, 'Unauthorized')
    return false
  }

  const authorized = roles.some((role) => req.user.is(role))
  if (!authorized) {
    req.reject(403, 'Forbidden: Missing required MM role')
    return false
  }

  return true
}

function aggregateTotal(records) {
  return Number(records.reduce((sum, item) => sum + Number(item.netValue || 0), 0).toFixed(2))
}

function getPOCount(material, orders = samplePurchaseOrders) {
  const normalizedMaterial = validateKey(material, 'material')
  const records = orders.filter((po) => normalize(po.material) === normalizedMaterial)
  return { material: normalizedMaterial, poCount: records.length }
}

function getMaterialSpend(material, orders = samplePurchaseOrders) {
  const normalizedMaterial = validateKey(material, 'material')
  const records = orders.filter((po) => normalize(po.material) === normalizedMaterial)

  return {
    key: normalizedMaterial,
    poCount: records.length,
    totalSpend: aggregateTotal(records),
    currency: CURRENCY
  }
}

function getVendorSpend(vendor, orders = samplePurchaseOrders) {
  const normalizedVendor = validateKey(vendor, 'vendor')
  const records = orders.filter((po) => normalize(po.vendor) === normalizedVendor)

  return {
    key: normalizedVendor,
    poCount: records.length,
    totalSpend: aggregateTotal(records),
    currency: CURRENCY
  }
}

function getPlantPO(plant, orders = samplePurchaseOrders) {
  const normalizedPlant = validateKey(plant, 'plant')
  const records = orders.filter((po) => normalize(po.plant) === normalizedPlant)

  return {
    plant: normalizedPlant,
    poCount: records.length,
    totalSpend: aggregateTotal(records),
    currency: CURRENCY
  }
}

function getGeneralPO(orders = samplePurchaseOrders) {
  return {
    totalPOCount: orders.length,
    totalSpend: aggregateTotal(orders),
    uniqueVendors: new Set(orders.map((po) => normalize(po.vendor))).size,
    uniquePlants: new Set(orders.map((po) => normalize(po.plant))).size,
    currency: CURRENCY
  }
}

module.exports = {
  samplePurchaseOrders,
  validateKey,
  enforceRole,
  getPOCount,
  getMaterialSpend,
  getVendorSpend,
  getPlantPO,
  getGeneralPO
}
