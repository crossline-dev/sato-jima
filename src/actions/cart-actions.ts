'use server'

import type { ShopifyAnalyticsProduct } from '@shopify/hydrogen-react'
import { isCartEnabled } from '@/config/site.config'
import {
  CART_ERROR_MESSAGES,
  expiredCartError,
  failCartAction,
  failCartActionFromUnknown,
  isCartNotFoundError,
} from '@/lib/cart/cart-error'
import { revalidateCartTag } from '@/lib/cart/cart-revalidate'
import {
  deleteCartIdCookie,
  getCartIdFromCookies,
  setCartIdCookie,
} from '@/lib/cart/cart-session'
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from '@/lib/shopify'
import { productToAnalytics } from '@/utils/analytics'

/**
 * addItem アクションの戻り値の型
 */
export type AddItemResult = {
  success: boolean
  cart?: Awaited<ReturnType<typeof createCart>>
  /** アナリティクス用: カート ID */
  cartId?: string
  /** アナリティクス用: 追加された商品情報 */
  products?: ShopifyAnalyticsProduct[]
  error?: string
}

/**
 * 商品をカートに追加
 * カートが存在しない場合は新規作成
 *
 * @returns AddItemResult - アナリティクス用に cartId と products を含む
 */
export async function addItem(
  merchandiseId: string,
  quantity = 1,
): Promise<AddItemResult> {
  if (!isCartEnabled()) {
    return failCartAction(CART_ERROR_MESSAGES.cartDisabled)
  }

  const existingCartId = await getCartIdFromCookies()

  if (!existingCartId) {
    try {
      const cart = await createCart([{ merchandiseId, quantity }])
      await setCartIdCookie(cart.id)
      revalidateCartTag()
      return {
        success: true,
        cart,
        cartId: cart.id,
        products: productToAnalytics(cart.lines, quantity, merchandiseId),
      }
    } catch (error) {
      return failCartActionFromUnknown(
        error,
        CART_ERROR_MESSAGES.createFailed,
      )
    }
  }

  try {
    const cart = await addToCart(existingCartId, [{ merchandiseId, quantity }])
    revalidateCartTag()
    return {
      success: true,
      cart,
      cartId: cart.id,
      products: productToAnalytics(cart.lines, quantity, merchandiseId),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''

    if (isCartNotFoundError(message)) {
      try {
        await deleteCartIdCookie()
        const cart = await createCart([{ merchandiseId, quantity }])
        await setCartIdCookie(cart.id)
        revalidateCartTag()
        return {
          success: true,
          cart,
          cartId: cart.id,
          products: productToAnalytics(cart.lines, quantity, merchandiseId),
        }
      } catch (createError) {
        return failCartActionFromUnknown(
          createError,
          CART_ERROR_MESSAGES.recreateFailed,
        )
      }
    }

    console.error('[cart-action] addItem failed', error)
    return failCartAction(CART_ERROR_MESSAGES.addFailed)
  }
}

/**
 * カートからアイテムを削除
 * 注意: lineId (merchandiseId ではない) を使用
 */
export async function removeItem(lineId: string) {
  const cartId = await getCartIdFromCookies()

  if (!cartId) {
    return failCartAction(CART_ERROR_MESSAGES.cartMissing)
  }

  try {
    const cart = await removeFromCart(cartId, [lineId])
    revalidateCartTag()
    return { success: true as const, cart }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (isCartNotFoundError(message)) {
      await deleteCartIdCookie()
      revalidateCartTag()
      return expiredCartError()
    }
    console.error('[cart-action] removeItem failed', error)
    return failCartAction(CART_ERROR_MESSAGES.removeFailed)
  }
}

/**
 * カートアイテムの数量を更新
 * 注意: lineId (merchandiseId ではない) を使用
 * 数量が 0 の場合は削除
 */
export async function updateItemQuantity(lineId: string, quantity: number) {
  const cartId = await getCartIdFromCookies()

  if (!cartId) {
    return failCartAction(CART_ERROR_MESSAGES.cartMissing)
  }

  if (quantity <= 0) {
    return removeItem(lineId)
  }

  try {
    const cart = await updateCart(cartId, [{ id: lineId, quantity }])
    revalidateCartTag()
    return { success: true as const, cart }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (isCartNotFoundError(message)) {
      await deleteCartIdCookie()
      revalidateCartTag()
      return expiredCartError()
    }
    console.error('[cart-action] updateItemQuantity failed', error)
    return failCartAction(CART_ERROR_MESSAGES.updateFailed)
  }
}

/**
 * チェックアウトURLを取得
 * クライアントサイドでリダイレクトするためにURLを返す
 */
export async function getCheckoutUrl() {
  if (!isCartEnabled()) {
    return {
      ...failCartAction(CART_ERROR_MESSAGES.cartDisabled),
      url: null as string | null,
    }
  }

  const cart = await getCart()

  if (!cart) {
    await deleteCartIdCookie()
    return {
      ...failCartAction(CART_ERROR_MESSAGES.cartMissing),
      url: null as string | null,
    }
  }

  return { success: true as const, url: cart.checkoutUrl }
}
