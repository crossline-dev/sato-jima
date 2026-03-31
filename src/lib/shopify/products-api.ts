import type { ProductSortKeys } from './generated/graphql'
import { ProductQuery, ProductRecommendationsQuery } from './queries/product'
import { ProductsQuery } from './queries/products'
import { shopifyFetch } from './shopify-server-client'

/**
 * 商品一覧を取得
 */
export async function getProducts(variables?: {
  first?: number
  last?: number
  after?: string
  before?: string
  query?: string
  reverse?: boolean
  sortKey?: ProductSortKeys
}) {
  const res = await shopifyFetch({
    query: ProductsQuery,
    variables,
    tags: ['products'],
  })

  return res.body.data.products.edges.map(edge => edge.node)
}

/**
 * 商品詳細を取得
 */
export async function getProduct(handle: string) {
  const res = await shopifyFetch({
    query: ProductQuery,
    variables: { handle },
    tags: ['products', `product:${handle}`],
  })

  return res.body.data.product ?? null
}

/**
 * 関連商品を取得
 */
export async function getProductRecommendations(productId: string) {
  const res = await shopifyFetch({
    query: ProductRecommendationsQuery,
    variables: { productId },
    tags: ['products'],
  })

  return res.body.data.productRecommendations ?? []
}
