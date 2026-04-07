export type ExtractedEntities = {
  material?: string
  vendor?: string
  customer?: string
  plant?: string
  pc?: string
}

const STOPWORDS = new Set([
  'DUE',
  'OUTSTANDING',
  'SPEND',
  'REVENUE',
  'FOR',
  'PO',
  'POS',
  'COUNT',
])

const ENTITY_PATTERNS: Array<{ key: keyof ExtractedEntities; regex: RegExp }> = [
  { key: 'material', regex: /\bmaterial(?:\s+id|\s+code)?\s*[:#=\-]?\s*([a-z0-9_.\-/]+)/gi },
  { key: 'vendor', regex: /\bvendor(?:\s+id|\s+code)?\s*[:#=\-]?\s*([a-z0-9_.\-/]+)/gi },
  { key: 'customer', regex: /\bcustomer(?:\s+id|\s+code)?\s*[:#=\-]?\s*([a-z0-9_.\-/]+)/gi },
  { key: 'plant', regex: /\bplant(?:\s+id|\s+code)?\s*[:#=\-]?\s*([a-z0-9_.\-/]+)/gi },
  { key: 'pc', regex: /\b(?:profit\s*center|profitcenter|pc)\s*[:#=\-]?\s*([a-z0-9_.\-/]+)/gi },
]

export function normalizeQuestion(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, ' ')
}

function extractByPattern(question: string, regex: RegExp): string | undefined {
  const matches = [...question.matchAll(regex)]
  for (let i = matches.length - 1; i >= 0; i -= 1) {
    const candidate = matches[i]?.[1]?.toUpperCase()
    if (candidate && !STOPWORDS.has(candidate)) return candidate
  }
  return undefined
}

export function extractEntities(question: string): ExtractedEntities {
  const entities: ExtractedEntities = {}

  for (const { key, regex } of ENTITY_PATTERNS) {
    const extracted = extractByPattern(question, regex)
    if (extracted) entities[key] = extracted
  }

  return entities
}

export function hasAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w))
}
