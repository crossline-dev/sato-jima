import type { Cart, CartItem } from '@/lib/shopify'
import type { CurrencyCode } from '@/lib/shopify/generated/graphql'
import type { CartAction, UpdateType } from './context-types'

/**
 * デフォルト通貨コード
 */
const DEFAULT_CURRENCY = 'JPY' as CurrencyCode

/**
 * アイテムコストを計算
 */
function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString()
}

/**
 * カートアイテムを更新
 */
function updateCartItemInList(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === 'delete') return null

  const newQuantity =
    updateType === 'plus' ? item.quantity + 1 : item.quantity - 1
  if (newQuantity <= 0) return null

  const singleItemPrice = Number(item.merchandise.price.amount)
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemPrice.toString(),
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

/**
 * カート合計を更新
 */
function updateCartTotals(
  lines: CartItem[],
  currencyCode: CurrencyCode,
): Pick<Cart, 'totalQuantity' | 'cost'> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  )

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: '0', currencyCode },
    },
  }
}

/**
 * 楽観更新の打ち消し用に、現在のカートをディープコピーする
 * （undefined の場合はそのまま戻すことで、厳密な直前状態を維持する）
 */
export function cloneCartSnapshot(cart: Cart | undefined): Cart | undefined {
  return cart ? structuredClone(cart) : undefined
}

/**
 * 空のカートを作成
 */
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

/**
 * カートリデューサー
 */
export function cartReducer(
  state: Cart | undefined,
  action: CartAction,
): Cart | undefined {
  if (action.type === 'RESET_TO_CART') {
    return action.payload.cart ? structuredClone(action.payload.cart) : undefined
  }

  const currentCart = state || createEmptyCart()
  const currencyCode = currentCart.cost.totalAmount.currencyCode as CurrencyCode

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
            totalAmount: { ...currentCart.cost.totalAmount, amount: '0' },
            subtotalAmount: { ...currentCart.cost.subtotalAmount, amount: '0' },
          },
        }
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines, currencyCode),
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
        updatedLines = currentCart.lines.map(line =>
          line.merchandise.id === item.merchandise.id
            ? {
                ...line,
                quantity: line.quantity + item.quantity,
                cost: {
                  totalAmount: {
                    amount: calculateItemCost(
                      line.quantity + item.quantity,
                      line.merchandise.price.amount,
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

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines, currencyCode),
        lines: updatedLines,
      }
    }

    default:
      return currentCart
  }
}
