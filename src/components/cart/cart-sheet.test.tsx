import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import * as cartActions from '@/actions/cart-actions'
import type { Cart, CartItem as CartLine } from '@/lib/shopify'
import type { CurrencyCode } from '@/lib/shopify/generated/graphql'
import { CART_ERROR_MESSAGES } from '@/lib/cart/cart-error'
import { CartSheet } from './cart-sheet'

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}))

vi.mock('@phosphor-icons/react/ssr', () => ({
  BasketIcon: () => <span data-testid='basket' />,
}))

vi.mock('@/actions/cart-actions', () => ({
  getCheckoutUrl: vi.fn(),
}))

vi.mock('@/hooks/use-cart-schedule', () => ({
  useCartSchedule: () => ({ isCartOpen: true, cartOpenLabel: '' }),
}))

vi.mock('@/components/cart/cart-item', () => ({
  CartItem: () => <div data-testid='cart-line' />,
}))

const currency: CurrencyCode = 'JPY'

function makeLine(id: string): CartLine {
  return {
    id,
    quantity: 1,
    cost: {
      totalAmount: { amount: '1000', currencyCode: currency },
    },
    merchandise: {
      id: `m-${id}`,
      title: 'Variant',
      selectedOptions: [],
      price: { amount: '1000', currencyCode: currency },
      product: { id: 'p1', handle: 'p1', title: 'Product' },
    },
  }
}

function makeCart(lines: CartLine[]): Cart {
  const totalQuantity = lines.reduce((s, l) => s + l.quantity, 0)
  const totalAmount = lines.reduce(
    (s, l) => s + Number(l.cost.totalAmount.amount),
    0,
  )
  return {
    id: 'c1',
    checkoutUrl: 'https://shop.example/checkout',
    totalQuantity,
    lines,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode: currency },
      totalAmount: { amount: totalAmount.toString(), currencyCode: currency },
      totalTaxAmount: { amount: '0', currencyCode: currency },
    },
  }
}

const cartHook = {
  isOpen: true,
  closeCart: vi.fn(),
  items: [] as CartLine[],
  itemCount: 0,
  cart: undefined as Cart | undefined,
}

vi.mock('@/lib/cart', () => ({
  useCart: () => ({
    cart: cartHook.cart,
    items: cartHook.items,
    itemCount: cartHook.itemCount,
    isOpen: cartHook.isOpen,
    openCart: vi.fn(),
    closeCart: cartHook.closeCart,
    updateCartItem: vi.fn(),
    addCartItem: vi.fn(),
    restoreCartToSnapshot: vi.fn(),
  }),
}))

describe('CartSheet checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const line = makeLine('line-1')
    cartHook.items = [line]
    cartHook.itemCount = 1
    cartHook.cart = makeCart([line])
  })

  it('shows server error message when getCheckoutUrl returns failure', async () => {
    vi.mocked(cartActions.getCheckoutUrl).mockResolvedValue({
      success: false,
      error: CART_ERROR_MESSAGES.cartMissing,
      url: null,
    })
    render(<CartSheet />)
    fireEvent.click(screen.getByRole('button', { name: 'Checkout' }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(CART_ERROR_MESSAGES.cartMissing)
    })
  })

  it('shows generic checkout message when getCheckoutUrl rejects', async () => {
    vi.mocked(cartActions.getCheckoutUrl).mockRejectedValue(new Error('network'))
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<CartSheet />)
    fireEvent.click(screen.getByRole('button', { name: 'Checkout' }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        CART_ERROR_MESSAGES.checkoutFailed,
      )
    })
    spy.mockRestore()
  })
})
