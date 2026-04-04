import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CART_ERROR_MESSAGES } from '@/lib/cart/cart-error'
import { addItem } from './cart-actions'

vi.mock('@/config/site.config', () => ({
  isCartEnabled: () => true,
}))

vi.mock('@/lib/cart/cart-revalidate', () => ({
  revalidateCartTag: vi.fn(),
}))

vi.mock('@/lib/cart/cart-session', () => ({
  getCartIdFromCookies: vi.fn(),
  setCartIdCookie: vi.fn(),
  deleteCartIdCookie: vi.fn(),
}))

vi.mock('@/utils/analytics', () => ({
  productToAnalytics: vi.fn(),
}))

vi.mock('@/lib/shopify', () => ({
  addToCart: vi.fn(),
  createCart: vi.fn(),
  getCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateCart: vi.fn(),
}))

import * as session from '@/lib/cart/cart-session'
import * as shopify from '@/lib/shopify'

describe('addItem error surface', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(session.getCartIdFromCookies).mockResolvedValue('cart-id')
  })

  it('returns centralized message instead of raw API error text', async () => {
    vi.mocked(shopify.addToCart).mockRejectedValue(
      new Error('internal graphql: something sensitive'),
    )
    const result = await addItem('gid://variant')
    expect(result.success).toBe(false)
    expect(result.error).toBe(CART_ERROR_MESSAGES.addFailed)
    expect(result.error).not.toContain('graphql')
  })
})
