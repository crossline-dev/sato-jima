import type { ShopifyAnalyticsProduct } from '@shopify/hydrogen-react'
import type { CartItem } from '@/lib/shopify/types'

/**
 * カートラインを Shopify Analytics 用の商品情報に変換
 *
 * @param cartLines - カートのラインアイテム配列
 * @param quantity - 追加した数量
 * @param variantId - 追加したバリエーション ID (merchandiseId)
 * @returns ShopifyAnalyticsProduct 配列、または見つからない場合は undefined
 *
 * @example
 * ```ts
 * const products = productToAnalytics(cart.lines, 1, 'gid://shopify/ProductVariant/123')
 * // => [{ productGid, variantGid, name, variantName, price, quantity }]
 * ```
 */
export function productToAnalytics(
  cartLines: CartItem[],
  quantity: number,
  variantId: string,
): ShopifyAnalyticsProduct[] | undefined {
  const line = cartLines.find(line => line.merchandise.id === variantId)

  if (!line) {
    return undefined
  }

  const { merchandise } = line

  return [
    {
      productGid: merchandise.product.id,
      variantGid: variantId,
      name: merchandise.product.title,
      variantName: merchandise.title,
      brand: '', // CartItem に vendor 情報がないため空文字列
      price: merchandise.price.amount,
      quantity,
    },
  ]
}
