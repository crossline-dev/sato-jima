import { describe, expect, it } from 'vitest'
import { getNextCartOpenCheckDelayMs } from './use-cart-schedule'

const DAY = 24 * 60 * 60 * 1000

describe('getNextCartOpenCheckDelayMs', () => {
  it('returns null when already past target', () => {
    expect(getNextCartOpenCheckDelayMs(2000, 1000)).toBeNull()
  })

  it('caps delay at 24h when target is far ahead', () => {
    const now = 0
    const target = now + 3 * DAY
    expect(getNextCartOpenCheckDelayMs(now, target)).toBe(DAY)
  })

  it('returns exact remaining when under 24h', () => {
    const now = 0
    const target = now + 3600_000
    expect(getNextCartOpenCheckDelayMs(now, target)).toBe(3600_000)
  })
})
