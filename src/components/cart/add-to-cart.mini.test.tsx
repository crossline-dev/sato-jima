import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as cartActions from '@/actions/cart-actions'
import type { Cart } from '@/lib/shopify'
import type { CurrencyCode } from '@/lib/shopify/generated/graphql'
import { AddToCartMini } from './add-to-cart'

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}))

vi.mock('@/hooks/use-cart-schedule', () => ({
  useCartSchedule: () => ({ isCartOpen: true, cartOpenLabel: '' }),
}))

vi.mock('@/hooks/use-shopify-analytics', () => ({
  useShopifyAnalytics: () => ({ sendAddToCart: vi.fn() }),
}))

vi.mock('@/actions/cart-actions', () => ({
  addItem: vi.fn(),
}))

const currency: CurrencyCode = 'JPY'

const cartHooks = {
  cart: undefined as Cart | undefined,
  addCartItem: vi.fn(),
  restoreCartToSnapshot: vi.fn(),
  openCart: vi.fn(),
}

vi.mock('@/lib/cart', () => ({
  useCart: () => ({
    cart: cartHooks.cart,
    items: cartHooks.cart?.lines ?? [],
    itemCount: cartHooks.cart?.totalQuantity ?? 0,
    isOpen: false,
    openCart: cartHooks.openCart,
    closeCart: vi.fn(),
    updateCartItem: vi.fn(),
    addCartItem: cartHooks.addCartItem,
    restoreCartToSnapshot: cartHooks.restoreCartToSnapshot,
  }),
}))

const itemInfo = {
  variantTitle: 'Default',
  price: '1000',
  currencyCode: currency,
  product: {
    id: 'p1',
    handle: 'p1',
    title: 'Product',
  },
}

describe('AddToCartMini', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cartHooks.cart = {
      id: 'c1',
      checkoutUrl: '',
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: '0', currencyCode: currency },
        totalAmount: { amount: '0', currencyCode: currency },
        totalTaxAmount: { amount: '0', currencyCode: currency },
      },
    }
    vi.mocked(cartActions.addItem).mockResolvedValue({
      success: false,
      error: 'failed',
    })
  })

  it('rolls back optimistic cart when addItem fails', async () => {
    render(
      <AddToCartMini
        variantId='gid://shopify/ProductVariant/1'
        availableForSale
        itemInfo={itemInfo}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'カートに追加' }))
    await waitFor(() => {
      expect(cartHooks.restoreCartToSnapshot).toHaveBeenCalled()
    })
    expect(cartHooks.addCartItem).toHaveBeenCalled()
  })
})
