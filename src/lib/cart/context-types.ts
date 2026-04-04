import type { Cart, CartItem } from '@/lib/shopify'

export type UpdateType = 'plus' | 'minus' | 'delete'

export type CartAction =
  | { type: 'UPDATE_ITEM'; payload: { lineId: string; updateType: UpdateType } }
  | { type: 'ADD_ITEM'; payload: { item: CartItem } }
  | { type: 'RESET_TO_CART'; payload: { cart: Cart | undefined } }

export interface CartContextValue {
  cartPromise: Promise<Cart | undefined>
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

export interface UseCartReturn {
  cart: Cart | undefined
  items: CartItem[]
  itemCount: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  updateCartItem: (lineId: string, updateType: UpdateType) => void
  addCartItem: (item: CartItem) => void
  restoreCartToSnapshot: (snapshot: Cart | undefined) => void
}
