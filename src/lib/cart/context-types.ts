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
  /** Server Action 失敗時など、楽観更新前のカートへ明示的に戻す */
  | { type: 'RESET_TO_CART'; payload: { cart: Cart | undefined } }

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
  /**
   * 楽観更新を打ち消す（例: addCartItem 直前に cloneCartSnapshot で取った状態を渡す）
   */
  restoreCartToSnapshot: (snapshot: Cart | undefined) => void
}
