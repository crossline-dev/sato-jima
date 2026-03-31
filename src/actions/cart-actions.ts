'use server'

import type { ShopifyAnalyticsProduct } from '@shopify/hydrogen-react'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { isCartEnabled } from '@/config/site.config'
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from '@/lib/shopify'
import { TAGS } from '@/lib/shopify/constants'
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
 * キャッシュを再検証
 * Next.js 16 では第2引数に cacheLife タイプを指定
 */
function revalidateCartTag() {
  revalidateTag(TAGS.cart, 'seconds')
}

/**
 * カートが存在しない/期限切れかどうかを判定
 * Shopify は日本語ロケールの場合、日本語のエラーメッセージを返す
 */
function isCartNotFoundError(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('not found') ||
    lower.includes('expired') ||
    lower.includes('invalid') ||
    message.includes('指定されたカートは存在しません') ||
    message.includes('カートが見つかりません') ||
    message.includes('カートは期限切れ')
  )
}

/**
 * Cookie のオプション設定
 */
const CART_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
}

/**
 * cartId を Cookie に保存
 */
async function setCartIdCookie(cartId: string) {
  const cookieStore = await cookies()
  cookieStore.set('cartId', cartId, CART_COOKIE_OPTIONS)
}

/**
 * cartId の Cookie を削除
 */
async function deleteCartIdCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('cartId')
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
  // カートオープン前はブロック
  if (!isCartEnabled()) {
    return {
      success: false,
      error: 'カートは現在ご利用いただけません。販売開始までお待ちください。',
    }
  }

  const cookieStore = await cookies()
  const existingCartId = cookieStore.get('cartId')?.value

  // カートが存在しない場合は新規作成（アイテムも同時追加）
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
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'カートの作成に失敗しました',
      }
    }
  }

  // 既存カートにアイテムを追加
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

    // カートが期限切れ、または存在しないエラー
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
        return {
          success: false,
          error:
            createError instanceof Error
              ? createError.message
              : 'カートの再作成に失敗しました',
        }
      }
    }

    return {
      success: false,
      error: message || 'アイテムの追加に失敗しました',
    }
  }
}

/**
 * カートからアイテムを削除
 * 注意: lineId (merchandiseId ではない) を使用
 */
export async function removeItem(lineId: string) {
  const cookieStore = await cookies()
  const cartId = cookieStore.get('cartId')?.value

  if (!cartId) {
    return { success: false, error: 'カートが存在しません' }
  }

  try {
    const cart = await removeFromCart(cartId, [lineId])
    revalidateCartTag()
    return { success: true, cart }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (isCartNotFoundError(message)) {
      await deleteCartIdCookie()
      revalidateCartTag()
      return {
        success: false,
        error: 'カートの有効期限が切れました。再度商品を追加してください。',
      }
    }
    return {
      success: false,
      error: message || '削除に失敗しました',
    }
  }
}

/**
 * カートアイテムの数量を更新
 * 注意: lineId (merchandiseId ではない) を使用
 * 数量が 0 の場合は削除
 */
export async function updateItemQuantity(lineId: string, quantity: number) {
  const cookieStore = await cookies()
  const cartId = cookieStore.get('cartId')?.value

  if (!cartId) {
    return { success: false, error: 'カートが存在しません' }
  }

  // 数量が 0 以下の場合は削除
  if (quantity <= 0) {
    return removeItem(lineId)
  }

  try {
    const cart = await updateCart(cartId, [{ id: lineId, quantity }])
    revalidateCartTag()
    return { success: true, cart }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (isCartNotFoundError(message)) {
      await deleteCartIdCookie()
      revalidateCartTag()
      return {
        success: false,
        error: 'カートの有効期限が切れました。再度商品を追加してください。',
      }
    }
    return {
      success: false,
      error: message || '更新に失敗しました',
    }
  }
}

/**
 * チェックアウトURLを取得
 * クライアントサイドでリダイレクトするためにURLを返す
 */
export async function getCheckoutUrl() {
  // カートオープン前はブロック
  if (!isCartEnabled()) {
    return {
      success: false,
      error: 'カートは現在ご利用いただけません。販売開始までお待ちください。',
      url: null,
    }
  }

  const cart = await getCart()

  if (!cart) {
    // カートが取得できない場合は stale cookie を削除
    await deleteCartIdCookie()
    return { success: false, error: 'カートが存在しません', url: null }
  }

  return { success: true, url: cart.checkoutUrl }
}
