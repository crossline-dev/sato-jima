import { describe, expect, it } from 'vitest'
import { formatCartOpenLabel } from './format-cart-open-label'

describe('formatCartOpenLabel', () => {
  it('uses ja-JP locale and Asia/Tokyo for wall clock fields', () => {
    const d = new Date('2026-02-28T03:00:00.000Z')
    expect(formatCartOpenLabel(d)).toMatch(/2\/28/)
    expect(formatCartOpenLabel(d)).toMatch(/12:00/)
  })
})
