import { act, render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it } from 'vitest'
import type { Cart } from '@/lib/shopify'
import type { CurrencyCode } from '@/lib/shopify/generated/graphql'
import { CartProvider, useCart } from './cart-context'

const currency: CurrencyCode = 'JPY'

function makeCart(totalQuantity: number): Cart {
  return {
    id: 'c1',
    checkoutUrl: '',
    totalQuantity,
    lines: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: currency },
      totalAmount: { amount: '0', currencyCode: currency },
      totalTaxAmount: { amount: '0', currencyCode: currency },
    },
  }
}

function ItemCount() {
  const { itemCount } = useCart()
  return <span data-testid="item-count">{itemCount}</span>
}

describe('CartProvider', () => {
  it('exposes cartPromise resolution via useCart', async () => {
    const cart = makeCart(3)
    await act(async () => {
      render(
        <Suspense fallback={null}>
          <CartProvider cartPromise={Promise.resolve(cart)}>
            <ItemCount />
          </CartProvider>
        </Suspense>,
      )
      await Promise.resolve()
    })
    expect(screen.getByTestId('item-count')).toHaveTextContent('3')
  })

  it('exposes itemCount after cartPromise resolves in a later turn', async () => {
    let resolveCart!: (value: Cart) => void
    const cartPromise = new Promise<Cart>(resolve => {
      resolveCart = resolve
    })
    await act(async () => {
      render(
        <Suspense fallback={<span data-testid="suspense-fallback" />}>
          <CartProvider cartPromise={cartPromise}>
            <ItemCount />
          </CartProvider>
        </Suspense>,
      )
      await Promise.resolve()
    })
    expect(screen.getByTestId('suspense-fallback')).toBeInTheDocument()

    await act(async () => {
      resolveCart(makeCart(7))
      await Promise.resolve()
    })
    expect(await screen.findByTestId('item-count')).toHaveTextContent('7')
  })
})
