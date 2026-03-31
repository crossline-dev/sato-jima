// コンポーネント
export { ShopifyAnalytics } from './shopify-analytics'

// フック（再エクスポート）
export { useShopifyAnalytics } from '@/hooks/use-shopify-analytics'
export type {
  SendAddToCartPayload,
  SendPageViewPayload,
} from '@/hooks/use-shopify-analytics'
