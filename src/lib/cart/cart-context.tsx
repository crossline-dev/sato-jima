'use client'

import {
  createContext,
  use,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
  useState,
} from 'react'
import type { Cart, CartItem } from '@/lib/shopify'
import { cartReducer } from './cart-reducer'
import type {
  CartContextValue,
  UpdateType,
  UseCartReturn,
} from './context-types'

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode
  cartPromise: Promise<Cart | undefined>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  return (
    <CartContext.Provider value={{ cartPromise, isOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): UseCartReturn {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  const { isOpen, openCart, closeCart } = context
  const initialCart = use(context.cartPromise)
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer,
  )

  const updateCartItem = useCallback(
    (lineId: string, updateType: UpdateType) => {
      updateOptimisticCart({
        type: 'UPDATE_ITEM',
        payload: { lineId, updateType },
      })
    },
    [updateOptimisticCart],
  )

  const addCartItem = useCallback(
    (item: CartItem) => {
      updateOptimisticCart({ type: 'ADD_ITEM', payload: { item } })
    },
    [updateOptimisticCart],
  )

  const restoreCartToSnapshot = useCallback(
    (snapshot: Cart | undefined) => {
      updateOptimisticCart({
        type: 'RESET_TO_CART',
        payload: { cart: snapshot },
      })
    },
    [updateOptimisticCart],
  )

  return useMemo(
    () => ({
      cart: optimisticCart,
      items: optimisticCart?.lines ?? [],
      itemCount: optimisticCart?.totalQuantity ?? 0,
      isOpen,
      openCart,
      closeCart,
      updateCartItem,
      addCartItem,
      restoreCartToSnapshot,
    }),
    [
      optimisticCart,
      isOpen,
      openCart,
      closeCart,
      updateCartItem,
      addCartItem,
      restoreCartToSnapshot,
    ],
  )
}
