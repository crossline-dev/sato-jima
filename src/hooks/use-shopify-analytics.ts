'use client'

import type { ShopifyAnalyticsProduct } from '@shopify/hydrogen-react'
import {
  AnalyticsEventName,
  AnalyticsPageType,
  getClientBrowserParameters,
  ShopifySalesChannel,
  sendShopifyAnalytics,
  useShopifyCookies,
} from '@shopify/hydrogen-react'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { env } from '@/env/client'

/**
 * Shopify Analytics の基本設定
 */
const SHOP_ID = env.NEXT_PUBLIC_SHOPIFY_SHOP_ID
const CURRENCY = 'JPY' as const
const LANGUAGE = 'JA' as const

/**
 * pathname からページタイプを推測
 */
function getPageTypeFromPathname(pathname: string): string {
  if (pathname === '/') return AnalyticsPageType.home
  if (pathname.startsWith('/products/')) return AnalyticsPageType.product
  if (pathname.startsWith('/collections/')) return AnalyticsPageType.collection
  if (pathname === '/collections') return AnalyticsPageType.listCollections
  if (pathname.startsWith('/cart')) return AnalyticsPageType.cart
  if (pathname.startsWith('/news/')) return AnalyticsPageType.article
  if (pathname === '/news') return AnalyticsPageType.blog
  if (pathname.startsWith('/search')) return AnalyticsPageType.search
  return AnalyticsPageType.page
}

/**
 * PAGE_VIEW イベントのペイロード
 */
export type SendPageViewPayload = {
  pageType?: string
  products?: ShopifyAnalyticsProduct[]
  collectionHandle?: string
  searchString?: string
  totalValue?: number
  cartId?: string
  resourceId?: string
}

/**
 * ADD_TO_CART イベントのペイロード
 */
export type SendAddToCartPayload = {
  cartId: string
  products?: ShopifyAnalyticsProduct[]
  totalValue?: number
}

/**
 * Shopify Analytics を使用するためのカスタムフック
 *
 * @example
 * ```tsx
 * // 基本的な使い方（PAGE_VIEW は ShopifyAnalytics コンポーネントで自動送信）
 * const { sendAddToCart } = useShopifyAnalytics()
 *
 * // カートに追加時
 * sendAddToCart({
 *   cartId: cart.id,
 *   products: [{ productGid, name, price, ... }],
 *   totalValue: 1000,
 * })
 * ```
 *
 * @see https://shopify.dev/docs/api/hydrogen-react/latest/utilities/sendshopifyanalytics
 */
export function useShopifyAnalytics() {
  const pathname = usePathname()

  /**
   * Shopify Cookies を設定（_shopify_y, _shopify_s）
   *
   * 現在は hasUserConsent: true で固定していますが、
   * GDPR/CCPA 対応が必要な場合は以下の対応が必要です：
   *
   * 【Cookie 同意管理を実装する場合の注意点】
   *
   * 1. Cookie 同意バナーを実装し、ユーザーの同意状態を管理
   *    - 例: react-cookie-consent, cookieyes 等のライブラリを使用
   *    - または、Shopify の Customer Privacy API を使用
   *
   * 2. 同意状態を Context または Cookie で管理
   *    ```tsx
   *    const [hasConsent, setHasConsent] = useState(false)
   *    useShopifyCookies({ hasUserConsent: hasConsent })
   *    ```
   *
   * 3. sendShopifyAnalytics の payload にも hasUserConsent を反映
   *    - hasUserConsent: false の場合、イベントは送信されない
   *
   * 4. Shopify の Customer Privacy API を使用する場合：
   *    - analyticsProcessingAllowed() - アナリティクス許可
   *    - marketingAllowed() - マーケティング許可
   *    - saleOfDataAllowed() - データ販売許可（CCPA）
   *
   * @see https://shopify.dev/docs/api/hydrogen-react/latest/hooks/useshopifycookies
   * @see https://shopify.dev/docs/api/consent-and-privacy
   */
  useShopifyCookies({
    hasUserConsent: true,
  })

  /**
   * PAGE_VIEW イベントを送信
   */
  const sendPageView = useCallback(
    (payload?: SendPageViewPayload) => {
      if (!SHOP_ID) {
        console.warn(
          '[ShopifyAnalytics] NEXT_PUBLIC_SHOPIFY_SHOP_ID is not set. Skipping analytics.',
        )
        return
      }

      const shopId = SHOP_ID.startsWith('gid://shopify/Shop/')
        ? SHOP_ID
        : `gid://shopify/Shop/${SHOP_ID}`

      sendShopifyAnalytics({
        eventName: AnalyticsEventName.PAGE_VIEW,
        payload: {
          ...getClientBrowserParameters(),
          hasUserConsent: true,
          shopifySalesChannel: ShopifySalesChannel.headless,
          shopId,
          currency: CURRENCY,
          acceptedLanguage: LANGUAGE,
          pageType: payload?.pageType ?? getPageTypeFromPathname(pathname),
          ...payload,
        },
      })
    },
    [pathname],
  )

  /**
   * ADD_TO_CART イベントを送信
   */
  const sendAddToCart = useCallback(
    ({ cartId, products, totalValue }: SendAddToCartPayload) => {
      if (!SHOP_ID) {
        console.warn(
          '[ShopifyAnalytics] NEXT_PUBLIC_SHOPIFY_SHOP_ID is not set. Skipping analytics.',
        )
        return
      }

      const shopId = SHOP_ID.startsWith('gid://shopify/Shop/')
        ? SHOP_ID
        : `gid://shopify/Shop/${SHOP_ID}`

      sendShopifyAnalytics({
        eventName: AnalyticsEventName.ADD_TO_CART,
        payload: {
          ...getClientBrowserParameters(),
          hasUserConsent: true,
          shopifySalesChannel: ShopifySalesChannel.headless,
          shopId,
          currency: CURRENCY,
          acceptedLanguage: LANGUAGE,
          cartId,
          products,
          totalValue,
        },
      })
    },
    [],
  )

  return {
    /** 現在の pathname */
    pathname,
    /** PAGE_VIEW イベントを送信 */
    sendPageView,
    /** ADD_TO_CART イベントを送信 */
    sendAddToCart,
  }
}
