import { extractEntities, hasAny, normalizeQuestion, type ExtractedEntities } from './parser.ts'

export type ActionName =
  | 'getPOCount'
  | 'getMaterialSpend'
  | 'getVendorSpend'
  | 'getPlantPO'
  | 'getGeneralPO'
  | 'getMonthlyRevenue'
  | 'getVendorDue'
  | 'getCustomerDue'
  | 'getProfitCenterRevenue'

export type RouteResult = {
  action: ActionName | 'unknown'
  entities: ExtractedEntities
  confidence: number
  reason: string
}

type Detector = {
  action: ActionName
  score: (text: string, entities: ExtractedEntities) => number
  reason: string
}

const detectors: Detector[] = [
  {
    action: 'getPOCount',
    reason: 'PO counting intent with material context',
    score: (text, e) => {
      let score = 0
      if (hasAny(text, ['how many po', 'number of po', 'po count', 'purchase orders'])) score += 0.6
      if (e.material) score += 0.35
      return score
    },
  },
  {
    action: 'getMaterialSpend',
    reason: 'Material spend intent detected',
    score: (text, e) => {
      let score = 0
      if (hasAny(text, ['material spend', 'spend for material', 'cost for material'])) score += 0.65
      if (e.material) score += 0.3
      return score
    },
  },
  {
    action: 'getVendorSpend',
    reason: 'Vendor spend intent detected',
    score: (text, e) => {
      let score = 0
      if (hasAny(text, ['vendor spend', 'spend by vendor', 'supplier spend'])) score += 0.65
      if (e.vendor) score += 0.3
      return score
    },
  },
  {
    action: 'getPlantPO',
    reason: 'Plant PO intent detected',
    score: (text, e) => {
      let score = 0
      if (hasAny(text, ['plant po', 'po for plant', 'purchase orders for plant'])) score += 0.65
      if (e.plant) score += 0.3
      return score
    },
  },
  {
    action: 'getGeneralPO',
    reason: 'General PO KPI intent detected',
    score: (text) => (hasAny(text, ['general po', 'overall po', 'all purchase orders', 'po summary']) ? 0.85 : 0),
  },
  {
    action: 'getMonthlyRevenue',
    reason: 'Monthly revenue intent detected',
    score: (text) => {
      let score = 0
      if (hasAny(text, ['monthly revenue', 'revenue by month'])) score += 0.8
      if (text.includes('revenue')) score += 0.15
      return score
    },
  },
  {
    action: 'getVendorDue',
    reason: 'Vendor due aging intent detected',
    score: (text, e) => {
      let score = 0
      if (hasAny(text, ['vendor due', 'vendor outstanding', 'payable due'])) score += 0.65
      if (e.vendor) score += 0.3
      return score
    },
  },
  {
    action: 'getCustomerDue',
    reason: 'Customer due aging intent detected',
    score: (text, e) => {
      let score = 0
      if (hasAny(text, ['customer due', 'customer outstanding', 'receivable due'])) score += 0.65
      if (e.customer) score += 0.3
      return score
    },
  },
  {
    action: 'getProfitCenterRevenue',
    reason: 'Profit center revenue intent detected',
    score: (text, e) => {
      let score = 0
      if (hasAny(text, ['profit center revenue', 'pc revenue', 'revenue for pc'])) score += 0.65
      if (e.pc) score += 0.3
      return score
    },
  },
]

export function routeQuery(question: string): RouteResult {
  const normalized = normalizeQuestion(question)
  const entities = extractEntities(normalized)

  let winner: RouteResult = {
    action: 'unknown',
    entities,
    confidence: 0,
    reason: 'No intent matched confidently',
  }

  for (const detector of detectors) {
    const score = Math.min(1, detector.score(normalized, entities))
    if (score > winner.confidence) {
      winner = {
        action: detector.action,
        entities,
        confidence: Number(score.toFixed(2)),
        reason: detector.reason,
      }
    }
  }

  if (winner.confidence < 0.55) {
    return { ...winner, action: 'unknown', reason: 'Intent confidence below threshold (0.55)' }
  }

  return winner
}
