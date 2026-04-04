import type { Cart, CartItem } from '@/lib/shopify'
import type { CurrencyCode } from '@/lib/shopify/generated/graphql'
import type { CartAction, UpdateType } from './context-types'
import {
  formatMinorToAmount,
  multiplyUnitPriceByQuantity,
  parseMoneyToMinor,
} from './cart-money'

const DEFAULT_CURRENCY = 'JPY' as CurrencyCode

function resolveOptimisticCurrency(
  lines: CartItem[],
  fallback: CurrencyCode,
): CurrencyCode {
  const first = lines[0]
  if (!first) return fallback
  return first.cost.totalAmount.currencyCode
}

function updateCartItemInList(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === 'delete') return null

  const newQuantity =
    updateType === 'plus' ? item.quantity + 1 : item.quantity - 1
  if (newQuantity <= 0) return null

  const currency = item.merchandise.price.currencyCode
  const newTotalAmount = multiplyUnitPriceByQuantity(
    item.merchandise.price.amount,
    newQuantity,
    currency,
  )

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      totalAmount: {
        amount: newTotalAmount,
        currencyCode: item.cost.totalAmount.currencyCode,
      },
    },
  }
}

function updateCartTotals(
  lines: CartItem[],
  currencyCode: CurrencyCode,
  previousCost: Cart['cost'],
): Pick<Cart, 'totalQuantity' | 'cost'> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0)
  const subtotalMinor = lines.reduce((sum, item) => {
    const c = item.cost.totalAmount.currencyCode
    return sum + parseMoneyToMinor(item.cost.totalAmount.amount, c)
  }, 0n)

  const sameCurrency =
    previousCost.subtotalAmount.currencyCode === currencyCode &&
    previousCost.totalAmount.currencyCode === currencyCode

  const nonSubtotalMinor = sameCurrency
    ? parseMoneyToMinor(previousCost.totalAmount.amount, currencyCode) -
      parseMoneyToMinor(previousCost.subtotalAmount.amount, currencyCode)
    : 0n

  const totalMinor = subtotalMinor + nonSubtotalMinor

  return {
    totalQuantity,
    cost: {
      subtotalAmount: {
        amount: formatMinorToAmount(subtotalMinor, currencyCode),
        currencyCode,
      },
      totalAmount: {
        amount: formatMinorToAmount(totalMinor, currencyCode),
        currencyCode,
      },
      totalTaxAmount: previousCost.totalTaxAmount
        ? {
            amount: previousCost.totalTaxAmount.amount,
            currencyCode: previousCost.totalTaxAmount.currencyCode,
          }
        : previousCost.totalTaxAmount,
    },
  }
}

export function cloneCartSnapshot(cart: Cart | undefined): Cart | undefined {
  return cart ? structuredClone(cart) : undefined
}

export function createEmptyCart(): Cart {
  return {
    id: '',
    checkoutUrl: '',
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: DEFAULT_CURRENCY },
      totalAmount: { amount: '0', currencyCode: DEFAULT_CURRENCY },
      totalTaxAmount: { amount: '0', currencyCode: DEFAULT_CURRENCY },
    },
  }
}

export function cartReducer(
  state: Cart | undefined,
  action: CartAction,
): Cart | undefined {
  if (action.type === 'RESET_TO_CART') {
    return action.payload.cart
  }

  const currentCart = state || createEmptyCart()

  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { lineId, updateType } = action.payload
      const updatedLines = currentCart.lines
        .map(item =>
          item.id === lineId ? updateCartItemInList(item, updateType) : item,
        )
        .filter((item): item is CartItem => item !== null)

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            subtotalAmount: {
              ...currentCart.cost.subtotalAmount,
              amount: '0',
            },
            totalAmount: {
              ...currentCart.cost.totalAmount,
              amount: '0',
            },
            totalTaxAmount: currentCart.cost.totalTaxAmount
              ? {
                  ...currentCart.cost.totalTaxAmount,
                  amount: '0',
                }
              : currentCart.cost.totalTaxAmount,
          },
        }
      }

      const currencyCode = resolveOptimisticCurrency(
        updatedLines,
        currentCart.cost.totalAmount.currencyCode as CurrencyCode,
      )

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines, currencyCode, currentCart.cost),
        lines: updatedLines,
      }
    }

    case 'ADD_ITEM': {
      const { item } = action.payload
      const existingItem = currentCart.lines.find(
        line => line.merchandise.id === item.merchandise.id,
      )

      let updatedLines: CartItem[]

      if (existingItem) {
        const c = existingItem.merchandise.price.currencyCode
        updatedLines = currentCart.lines.map(line =>
          line.merchandise.id === item.merchandise.id
            ? {
                ...line,
                quantity: line.quantity + item.quantity,
                cost: {
                  totalAmount: {
                    amount: multiplyUnitPriceByQuantity(
                      line.merchandise.price.amount,
                      line.quantity + item.quantity,
                      c,
                    ),
                    currencyCode: line.cost.totalAmount.currencyCode,
                  },
                },
              }
            : line,
        )
      } else {
        updatedLines = [...currentCart.lines, item]
      }

      const currencyCode = resolveOptimisticCurrency(
        updatedLines,
        currentCart.cost.totalAmount.currencyCode as CurrencyCode,
      )

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines, currencyCode, currentCart.cost),
        lines: updatedLines,
      }
    }

    default:
      return currentCart
  }
}
