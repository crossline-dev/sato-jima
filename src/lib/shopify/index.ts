// Cart API
export {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from './cart-api'
// Collections API
export {
  getAllCollectionHandles,
  getCollection,
  getCollectionProducts,
  getCollections,
} from './collections-api'
// Products API
export {
  getProduct,
  getProductRecommendations,
  getProducts,
} from './products-api'
// Shopify API エラー（サーバー／クライアント共通）
export type {
  ShopifyApiErrorKind,
  ShopifyGraphQLErrorEntry,
} from './shopify-api-error'
export { isShopifyApiError, ShopifyApiError } from './shopify-api-error'
// Shopify Server Client (サーバーサイド用 - プライベートトークン使用)
// クライアントサイド用は直接 '@/lib/shopify/shopify-client' からインポートしてください
export type {
  ShopifyFetchOptions,
  ShopifyFetchResult,
} from './shopify-server-client'
export {
  getPrivateTokenHeaders,
  getStorefrontApiUrl,
  shopifyFetch,
} from './shopify-server-client'

// Types
export type { Cart, CartItem } from './types'
