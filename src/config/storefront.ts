/**
 * @agent-guard
 * - ストアフロント URL・コレクションハンドルの SSOT（単一の更新点）
 * - PRODUCTS_MENU_COLLECTION_ITEMS / FEATURED_COLLECTION_MENU_ITEMS は
 *   sato-jima のコレクションが確定次第、実際のハンドルに差し替える
 * - ナビゲーション表示は `src/config/navigation.ts` がこのファイルを re-export している
 * - handle を変更すると Shopify API クエリ・ナビゲーション・ページルーティングに影響する
 *
 * @see docs/business/domain-spec.md §4（コレクション構成）
 * @see docs/business/migration-checklist.md
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
 *
 * TODO: sato-jima のコレクションが確定次第、実際のハンドルを追加する
 */
export const PRODUCTS_MENU_COLLECTION_ITEMS = [
  { label: 'All', handle: 'all' },
] as const

/**
 * メガメニュー「Collections」／モバイル Collections 配下の Featured 表示用。
 * 順序がそのまま表示順。
 *
 * TODO: sato-jima のコレクションが確定次第、実際のハンドルを追加する
 */
export const FEATURED_COLLECTION_MENU_ITEMS = [] as const

export type FeaturedCollectionHandle =
  (typeof FEATURED_COLLECTION_MENU_ITEMS)[number] extends { handle: infer H }
    ? H
    : string

/** Shopify API（getFeaturedCollections 等）で順序付きフィルタに使うハンドル一覧 */
export const FEATURED_COLLECTION_HANDLES =
  FEATURED_COLLECTION_MENU_ITEMS.length > 0
    ? (FEATURED_COLLECTION_MENU_ITEMS as unknown as { handle: string }[]).map(
        item => item.handle,
      )
    : ([] as FeaturedCollectionHandle[])
