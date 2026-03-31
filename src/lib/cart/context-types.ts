import type { Cart, CartItem } from '@/lib/shopify'

/**
 * カート更新タイプ
 */
export type UpdateType = 'plus' | 'minus' | 'delete'

/**
 * カートアクション
 */
export type CartAction =
  | { type: 'UPDATE_ITEM'; payload: { lineId: string; updateType: UpdateType } }
  | { type: 'ADD_ITEM'; payload: { item: CartItem } }

/**
 * カートコンテキストの内部型
 */
export interface CartContextValue {
  cartPromise: Promise<Cart | undefined>
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

/**
 * useCart フックの戻り値
 */
export interface UseCartReturn {
  cart: Cart | undefined
  items: CartItem[]
  itemCount: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  updateCartItem: (lineId: string, updateType: UpdateType) => void
  addCartItem: (item: CartItem) => void
}
