import type { ProductCollectionSortKeys } from './generated/graphql'
import {
  CollectionProductsQuery,
  CollectionQuery,
  CollectionsQuery,
} from './queries/collection'
import { shopifyFetch, shopifyFetchStatic } from './shopify-server-client'

/**
 * 単一コレクション情報を取得
 *
 * リクエストコンテキスト内で呼び出す必要があります。
 */
export async function getCollection(handle: string) {
  const res = await shopifyFetch({
    query: CollectionQuery,
    variables: { handle },
    tags: ['collections', `collection:${handle}`],
  })

  return res.body.data.collection ?? null
}

/**
 * コレクション内の商品一覧を取得
 *
 * リクエストコンテキスト内で呼び出す必要があります。
 */
export async function getCollectionProducts(
  handle: string,
  variables?: {
    sortKey?: ProductCollectionSortKeys
    reverse?: boolean
  },
) {
  const res = await shopifyFetch({
    query: CollectionProductsQuery,
    variables: {
      handle,
      sortKey:
        variables?.sortKey ??
        ('COLLECTION_DEFAULT' as ProductCollectionSortKeys),
      reverse: variables?.reverse ?? false,
    },
    tags: ['collections', 'products'],
  })

  if (!res.body.data.collection) {
    return []
  }

  return res.body.data.collection.products.edges.map(edge => edge.node)
}

/**
 * 全コレクション一覧を取得
 *
 * リクエストコンテキスト内で呼び出す必要があります。
 */
export async function getCollections() {
  const res = await shopifyFetch({
    query: CollectionsQuery,
    tags: ['collections'],
  })

  return res.body.data.collections.edges.map(edge => edge.node)
}

/**
 * 全コレクション一覧を取得（静的生成用）
 *
 * generateStaticParams やビルド時のデータ取得で使用します。
 * リクエストコンテキスト外で呼び出し可能です。
 */
export async function getAllCollectionHandles() {
  const res = await shopifyFetchStatic({
    query: CollectionsQuery,
    tags: ['collections'],
  })

  return res.body.data.collections.edges.map(edge => edge.node.handle)
}

/**
 * メインコレクション（Featured）を取得
 *
 * 指定されたハンドルのコレクションを順序を維持して返します。
 */
export const FEATURED_COLLECTION_HANDLES = [
  'original-bear',
  'event-goods',
  'apparel',
] as const

export async function getFeaturedCollections() {
  const allCollections = await getCollections()

  // 指定されたハンドル順序を維持してフィルタリング
  return FEATURED_COLLECTION_HANDLES.map(handle =>
    allCollections.find(c => c.handle === handle),
  ).filter((c): c is NonNullable<typeof c> => c !== undefined)
}
