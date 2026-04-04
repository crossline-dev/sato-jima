import type { CurrencyCode } from '@/lib/shopify/generated/graphql'

const exponentCache = new Map<CurrencyCode, number>()

export function getCurrencyMinorExponent(currency: CurrencyCode): number {
  const cached = exponentCache.get(currency)
  if (cached !== undefined) return cached
  const fmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  })
  const n = fmt.resolvedOptions().maximumFractionDigits ?? 2
  exponentCache.set(currency, n)
  return n
}

export function parseMoneyToMinor(amount: string, currency: CurrencyCode): bigint {
  const exp = getCurrencyMinorExponent(currency)
  const t = amount.trim()
  const neg = t.startsWith('-')
  const raw = neg ? t.slice(1) : t
  if (raw === '' || raw === '.') return 0n
  const [wholeRaw, fracRaw = ''] = raw.split('.')
  const whole = wholeRaw === '' ? '0' : wholeRaw
  const frac = fracRaw.slice(0, exp).padEnd(exp, '0')
  const rawDigits = `${whole}${frac}`.replace(/\D/g, '') || '0'
  const digits = rawDigits.replace(/^0+(?=\d)/, '') || '0'
  let v = BigInt(digits)
  if (neg) v = -v
  return v
}

export function formatMinorToAmount(minor: bigint, currency: CurrencyCode): string {
  const exp = getCurrencyMinorExponent(currency)
  if (exp === 0) return minor.toString()
  const neg = minor < 0n
  const abs = neg ? -minor : minor
  const s = abs.toString().padStart(exp + 1, '0')
  const whole = s.slice(0, -exp).replace(/^0+(?=\d)/, '') || '0'
  const frac = s.slice(-exp).replace(/0+$/, '')
  const num = frac.length > 0 ? `${whole}.${frac}` : whole
  return neg ? `-${num}` : num
}

export function multiplyUnitPriceByQuantity(
  unitAmount: string,
  quantity: number,
  currency: CurrencyCode,
): string {
  if (quantity <= 0) return formatMinorToAmount(0n, currency)
  const unitMinor = parseMoneyToMinor(unitAmount, currency)
  const lineMinor = unitMinor * BigInt(quantity)
  return formatMinorToAmount(lineMinor, currency)
}
