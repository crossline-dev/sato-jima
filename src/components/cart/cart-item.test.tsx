import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as cartActions from '@/actions/cart-actions'
import type { Cart, CartItem as CartLine } from '@/lib/shopify'
import type { CurrencyCode } from '@/lib/shopify/generated/graphql'
import { CartItem } from './cart-item'

vi.mock('next/image', () => ({
  default: (props: { alt: string }) => <img alt={props.alt} />,
}))

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}))

const currency: CurrencyCode = 'JPY'

const cartHooks = {
  cart: undefined as Cart | undefined,
  restoreCartToSnapshot: vi.fn(),
  updateCartItem: vi.fn(),
}

vi.mock('@/actions/cart-actions', () => ({
  updateItemQuantity: vi.fn(),
  removeItem: vi.fn(),
}))

vi.mock('@/lib/cart', () => ({
  useCart: () => ({
    cart: cartHooks.cart,
    items: cartHooks.cart?.lines ?? [],
    itemCount: cartHooks.cart?.totalQuantity ?? 0,
    isOpen: false,
    openCart: vi.fn(),
    closeCart: vi.fn(),
    updateCartItem: cartHooks.updateCartItem,
    restoreCartToSnapshot: cartHooks.restoreCartToSnapshot,
  }),
}))

function makeLine(id: string, qty: number, price: string): CartLine {
  return {
    id,
    quantity: qty,
    cost: {
      totalAmount: {
        amount: (Number(price) * qty).toString(),
        currencyCode: currency,
      },
    },
    merchandise: {
      id: `m-${id}`,
      title: 'Variant',
      selectedOptions: [],
      price: { amount: price, currencyCode: currency },
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
    checkoutUrl: '',
    totalQuantity,
    lines,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode: currency },
      totalAmount: { amount: totalAmount.toString(), currencyCode: currency },
      totalTaxAmount: { amount: '0', currencyCode: currency },
    },
  }
}

describe('CartItem', () => {
  const line = makeLine('line-1', 2, '1000')

  beforeEach(() => {
    vi.clearAllMocks()
    cartHooks.cart = makeCart([line])
    vi.mocked(cartActions.updateItemQuantity).mockResolvedValue({
      success: false,
      error: 'failed',
    })
  })

  it('restores cart snapshot when quantity update fails', async () => {
    render(<CartItem item={line} />)
    fireEvent.click(screen.getByRole('button', { name: '数量を増やす' }))
    await waitFor(() => {
      expect(cartHooks.restoreCartToSnapshot).toHaveBeenCalled()
    })
    const snapshot = cartHooks.restoreCartToSnapshot.mock.calls[0][0]
    expect(snapshot).toEqual(cartHooks.cart)
  })
})
