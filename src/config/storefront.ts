/**
 * ストアフロント（本サイト）と Shopify Customer Accounts 周りの固定値。
 * URL・コレクションハンドルの変更はここを単一の更新点にする。
 */

/** Shopify Customer Accounts（ログイン・アカウント）の絶対 URL */
export const SHOPIFY_CUSTOMER_ACCOUNT_URL =
  'https://shopify.com/70593708186/account' as const

/** `/collections/[handle]` 形式のパスを生成 */
export function storefrontCollectionPath(
  handle: string,
): `/collections/${string}` {
  return `/collections/${handle}` as `/collections/${string}`
}

/**
 * デスクトップ「Products」およびモバイル Products 配下で使うコレクション。
 * 先頭が Products トップ（All）のリンク先。
 */
export const PRODUCTS_MENU_COLLECTION_ITEMS = [
  { label: 'All', handle: 'all' },
  { label: 'New Items', handle: 'new-items' },
  { label: 'Limited Goods', handle: 'limited-goods' },
] as const

/**
 * メガメニュー「Collections」／モバイル Collections 配下の Featured 表示用。
 * 順序がそのまま表示順。
 */
export const FEATURED_COLLECTION_MENU_ITEMS = [
  { label: 'Original Bear', handle: 'original-bear' },
  { label: 'Event Goods', handle: 'event-goods' },
  { label: 'Apparel', handle: 'apparel' },
] as const

export type FeaturedCollectionHandle =
  (typeof FEATURED_COLLECTION_MENU_ITEMS)[number]['handle']

/** Shopify API（getFeaturedCollections 等）で順序付きフィルタに使うハンドル一覧 */
export const FEATURED_COLLECTION_HANDLES: FeaturedCollectionHandle[] =
  FEATURED_COLLECTION_MENU_ITEMS.map(item => item.handle)
