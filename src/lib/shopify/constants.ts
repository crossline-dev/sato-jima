/**
 * キャッシュタグ定義
 * Next.js の cacheTag / revalidateTag で使用
 */
export const TAGS = {
  products: 'products',
  collections: 'collections',
  cart: 'cart',
  blog: 'blog',
  news: 'news',
} as const

/**
 * 非公開商品を示すタグ
 * このタグを持つ商品は検索エンジンにインデックスされない
 */
export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden'
