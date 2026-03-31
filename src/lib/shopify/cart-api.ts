import { cookies } from 'next/headers'
import { TAGS } from './constants'
import type {
  CartFragmentFragment,
  CartLineInput,
  CartLineUpdateInput,
} from './generated/graphql'
import {
  CartCreateMutation,
  CartLinesAddMutation,
  CartLinesRemoveMutation,
  CartLinesUpdateMutation,
} from './mutations/cart'
import { CartQuery } from './queries/cart'
import { shopifyFetch } from './shopify-server-client'
import type { Cart, CartItem } from './types'

/**
 * GraphQL レスポンスのカートを、使いやすい形式に変換
 */
function reshapeCart(cart: CartFragmentFragment): Cart {
  const lines: CartItem[] = []

  for (const edge of cart.lines.edges) {
    const node = edge.node
    // ComponentizableCartLine の場合は merchandise がないのでスキップ
    if (node.__typename === 'ComponentizableCartLine') {
      continue
    }

    lines.push({
      id: node.id,
      quantity: node.quantity,
      cost: {
        totalAmount: {
          amount: node.cost.totalAmount.amount,
          currencyCode: node.cost.totalAmount.currencyCode,
        },
      },
      merchandise: {
        id: node.merchandise.id,
        title: node.merchandise.title,
        selectedOptions: node.merchandise.selectedOptions.map(opt => ({
          name: opt.name,
          value: opt.value,
        })),
        price: {
          amount: node.merchandise.price.amount,
          currencyCode: node.merchandise.price.currencyCode,
        },
        product: {
          id: node.merchandise.product.id,
          handle: node.merchandise.product.handle,
          title: node.merchandise.product.title,
          featuredImage: node.merchandise.product.featuredImage ?? null,
        },
      },
    })
  }

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    cost: {
      subtotalAmount: {
        amount: cart.cost.subtotalAmount.amount,
        currencyCode: cart.cost.subtotalAmount.currencyCode,
      },
      totalAmount: {
        amount: cart.cost.totalAmount.amount,
        currencyCode: cart.cost.totalAmount.currencyCode,
      },
      totalTaxAmount: cart.cost.totalTaxAmount
        ? {
            amount: cart.cost.totalTaxAmount.amount,
            currencyCode: cart.cost.totalTaxAmount.currencyCode,
          }
        : null,
    },
    lines,
  }
}

/**
 * Cookie から cartId を取得してカートを取得
 * カートが存在しない or 期限切れの場合は undefined を返す
 */
export async function getCart(): Promise<Cart | undefined> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get('cartId')?.value

  if (!cartId) {
    return undefined
  }

  try {
    const res = await shopifyFetch({
      query: CartQuery,
      variables: { cartId },
      cache: 'no-store',
      tags: [TAGS.cart],
    })

    // カートが期限切れの場合は null が返る
    // Server Component からは Cookie を変更できないため、ログのみ
    // Cookie の削除は次回の Server Action（addItem 等）で自動対処
    if (!res.body.data.cart) {
      console.warn(
        '[getCart] Cart not found (expired or completed), cartId:',
        cartId,
      )
      return undefined
    }

    return reshapeCart(res.body.data.cart)
  } catch (error) {
    // Server Component からは Cookie を変更できないため、ログのみ
    // Cookie の削除は Server Action 側（cart-actions.ts）で対処
    console.warn('[getCart] Cart fetch failed, cartId may be stale:', error)
    return undefined
  }
}

/**
 * 新しいカートを作成
 * オプションで初期アイテムを同時に追加可能
 */
export async function createCart(lines?: CartLineInput[]): Promise<Cart> {
  const res = await shopifyFetch({
    query: CartCreateMutation,
    variables: {
      input: lines ? { lines } : {},
    },
    cache: 'no-store',
  })

  // userErrors のチェック
  const userErrors = res.body.data.cartCreate?.userErrors
  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors.map(e => e.message).join('. '))
  }

  const cart = res.body.data.cartCreate?.cart
  if (!cart) {
    throw new Error('Failed to create cart')
  }

  return reshapeCart(cart)
}

/**
 * カートにアイテムを追加
 */
export async function addToCart(
  cartId: string,
  lines: CartLineInput[],
): Promise<Cart> {
  const res = await shopifyFetch({
    query: CartLinesAddMutation,
    variables: { cartId, lines },
    cache: 'no-store',
  })

  // userErrors のチェック
  const userErrors = res.body.data.cartLinesAdd?.userErrors
  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors.map(e => e.message).join('. '))
  }

  const cart = res.body.data.cartLinesAdd?.cart
  if (!cart) {
    throw new Error('Failed to add items to cart')
  }

  return reshapeCart(cart)
}

/**
 * カートのアイテム数量を更新
 * 注意: lineId (merchandiseId ではない) を指定する必要がある
 */
export async function updateCart(
  cartId: string,
  lines: CartLineUpdateInput[],
): Promise<Cart> {
  const res = await shopifyFetch({
    query: CartLinesUpdateMutation,
    variables: { cartId, lines },
    cache: 'no-store',
  })

  // userErrors のチェック
  const userErrors = res.body.data.cartLinesUpdate?.userErrors
  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors.map(e => e.message).join('. '))
  }

  const cart = res.body.data.cartLinesUpdate?.cart
  if (!cart) {
    throw new Error('Failed to update cart')
  }

  return reshapeCart(cart)
}

/**
 * カートからアイテムを削除
 * 注意: lineId (merchandiseId ではない) を指定する必要がある
 */
export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const res = await shopifyFetch({
    query: CartLinesRemoveMutation,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })

  // userErrors のチェック
  const userErrors = res.body.data.cartLinesRemove?.userErrors
  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors.map(e => e.message).join('. '))
  }

  const cart = res.body.data.cartLinesRemove?.cart
  if (!cart) {
    throw new Error('Failed to remove items from cart')
  }

  return reshapeCart(cart)
}
