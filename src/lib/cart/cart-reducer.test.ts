import { describe, expect, it } from 'vitest'
import type { Cart, CartItem } from '@/lib/shopify'
import type { CurrencyCode } from '@/lib/shopify/generated/graphql'
import {
  formatMinorToAmount,
  multiplyUnitPriceByQuantity,
  parseMoneyToMinor,
} from './cart-money'
import { cartReducer, cloneCartSnapshot, createEmptyCart } from './cart-reducer'

const jpy: CurrencyCode = 'JPY'
const usd: CurrencyCode = 'USD'

function makeLine(
  id: string,
  qty: number,
  price: string,
  currency: CurrencyCode = jpy,
): CartItem {
  return {
    id,
    quantity: qty,
    cost: {
      totalAmount: {
        amount: multiplyUnitPriceByQuantity(price, qty, currency),
        currencyCode: currency,
      },
    },
    merchandise: {
      id: `m-${id}`,
      title: 'Variant',
      selectedOptions: [],
      price: { amount: price, currencyCode: currency },
      product: {
        id: 'p1',
        handle: 'p1',
        title: 'Product',
      },
    },
  }
}

function makeCart(
  lines: CartItem[],
  costOverrides?: Partial<Cart['cost']>,
): Cart {
  const totalQuantity = lines.reduce((s, l) => s + l.quantity, 0)
  const currency = lines[0]?.cost.totalAmount.currencyCode ?? jpy
  const subtotalMinor = lines.reduce(
    (s, l) => s + parseMoneyToMinor(l.cost.totalAmount.amount, l.cost.totalAmount.currencyCode),
    0n,
  )
  const baseCost: Cart['cost'] = {
    subtotalAmount: {
      amount: formatMinorToAmount(subtotalMinor, currency),
      currencyCode: currency,
    },
    totalAmount: {
      amount: formatMinorToAmount(subtotalMinor, currency),
      currencyCode: currency,
    },
    totalTaxAmount: { amount: '0', currencyCode: currency },
  }
  const cost = { ...baseCost, ...costOverrides }
  return {
    id: 'c1',
    checkoutUrl: '',
    totalQuantity,
    lines,
    cost,
  }
}

describe('createEmptyCart', () => {
  it('uses JPY for cost fields and zero totals', () => {
    const empty = createEmptyCart()
    expect(empty.cost.subtotalAmount.currencyCode).toBe('JPY')
    expect(empty.cost.totalAmount.currencyCode).toBe('JPY')
    expect(empty.cost.totalTaxAmount?.currencyCode).toBe('JPY')
    expect(empty.cost.totalAmount.amount).toBe('0')
    expect(empty.lines).toEqual([])
    expect(empty.totalQuantity).toBe(0)
  })
})

describe('cloneCartSnapshot', () => {
  it('returns undefined when cart is undefined', () => {
    expect(cloneCartSnapshot(undefined)).toBeUndefined()
  })
})

describe('cartReducer', () => {
  it('RESET_TO_CART restores cloned snapshot including undefined', () => {
    const before = makeCart([makeLine('a', 1, '1000')])
    const snapshot = cloneCartSnapshot(before)
    const afterAdd = cartReducer(before, {
      type: 'ADD_ITEM',
      payload: { item: makeLine('b', 1, '500') },
    })
    expect(afterAdd?.lines).toHaveLength(2)

    const restored = cartReducer(afterAdd, {
      type: 'RESET_TO_CART',
      payload: { cart: snapshot },
    })
    expect(restored).toEqual(before)
  })

  it('RESET_TO_CART returns the same snapshot reference (single clone at snapshot time)', () => {
    const before = makeCart([makeLine('a', 1, '1000')])
    const snapshot = cloneCartSnapshot(before)
    const restored = cartReducer(undefined, {
      type: 'RESET_TO_CART',
      payload: { cart: snapshot },
    })
    expect(restored).toBe(snapshot)
  })

  it('RESET_TO_CART with undefined clears optimistic cart', () => {
    const cart = makeCart([makeLine('a', 1, '1000')])
    const cleared = cartReducer(cart, {
      type: 'RESET_TO_CART',
      payload: { cart: undefined },
    })
    expect(cleared).toBeUndefined()
  })

  it('UPDATE_ITEM plus increases quantity and totals', () => {
    const cart = makeCart([makeLine('L1', 1, '1000')])
    const next = cartReducer(cart, {
      type: 'UPDATE_ITEM',
      payload: { lineId: 'L1', updateType: 'plus' },
    })
    expect(next?.lines[0]?.quantity).toBe(2)
    expect(next?.cost.subtotalAmount.amount).toBe('2000')
    expect(next?.cost.totalAmount.amount).toBe('2000')
  })

  it('UPDATE_ITEM minus removes line at quantity 1', () => {
    const cart = makeCart([makeLine('L1', 1, '1000')])
    const next = cartReducer(cart, {
      type: 'UPDATE_ITEM',
      payload: { lineId: 'L1', updateType: 'minus' },
    })
    expect(next?.lines).toHaveLength(0)
    expect(next?.cost.totalAmount.amount).toBe('0')
  })

  it('UPDATE_ITEM delete clears the line', () => {
    const cart = makeCart([makeLine('L1', 2, '1000')])
    const next = cartReducer(cart, {
      type: 'UPDATE_ITEM',
      payload: { lineId: 'L1', updateType: 'delete' },
    })
    expect(next?.lines).toHaveLength(0)
  })

  it('ADD_ITEM merges quantity for same merchandise', () => {
    const line = makeLine('L1', 1, '1000')
    const cart = makeCart([line])
    const next = cartReducer(cart, {
      type: 'ADD_ITEM',
      payload: { item: makeLine('L2', 2, '1000') },
    })
    expect(next?.lines).toHaveLength(1)
    expect(next?.lines[0]?.quantity).toBe(3)
    expect(next?.cost.subtotalAmount.amount).toBe('3000')
  })

  it('uses first line currency when optimistic cart was JPY-empty', () => {
    const emptyDerived = createEmptyCart()
    const usdItem = makeLine('L1', 1, '10.00', usd)
    const next = cartReducer(emptyDerived, {
      type: 'ADD_ITEM',
      payload: { item: usdItem },
    })
    expect(next?.cost.subtotalAmount.currencyCode).toBe('USD')
    expect(next?.cost.totalAmount.currencyCode).toBe('USD')
  })

  it('USD decimal line totals avoid float noise (0.1 × 3)', () => {
    const cart = makeCart([makeLine('L1', 3, '0.1', usd)])
    expect(cart.lines[0]?.cost.totalAmount.amount).toBe('0.3')
  })

  it('preserves non-subtotal delta and totalTaxAmount on optimistic change', () => {
    const line = makeLine('L1', 1, '100', jpy)
    const cart = makeCart([line], {
      subtotalAmount: { amount: '100', currencyCode: jpy },
      totalAmount: { amount: '110', currencyCode: jpy },
      totalTaxAmount: { amount: '10', currencyCode: jpy },
    })
    const next = cartReducer(cart, {
      type: 'UPDATE_ITEM',
      payload: { lineId: 'L1', updateType: 'plus' },
    })
    expect(next?.cost.subtotalAmount.amount).toBe('200')
    expect(next?.cost.totalAmount.amount).toBe('210')
    expect(next?.cost.totalTaxAmount?.amount).toBe('10')
  })
})
