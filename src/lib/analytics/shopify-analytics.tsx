'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
import { useShopifyAnalytics } from '@/hooks/use-shopify-analytics'

/**
 * PAGE_VIEW イベントを自動送信するコンポーネント（内部実装）
 */
function ShopifyAnalyticsInner() {
  const { sendPageView, pathname } = useShopifyAnalytics()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)

  // pathname と searchParams を組み合わせて URL を生成
  // これによりルート変更を検知する
  const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

  // biome-ignore lint/correctness/useExhaustiveDependencies: url の変更でルート変更を検知するため意図的に依存配列に含める
  useEffect(() => {
    // 初回マウント時は少し遅延させて送信（ページ読み込み完了を待つ）
    if (isInitialMount.current) {
      isInitialMount.current = false
      const timer = setTimeout(() => {
        sendPageView()
      }, 100)
      return () => clearTimeout(timer)
    }

    // ルート変更時に PAGE_VIEW を送信
    sendPageView()
  }, [url, sendPageView])

  return null
}

/**
 * Shopify Analytics の PAGE_VIEW イベントを自動送信するコンポーネント
 *
 * layout.tsx で使用してください。
 * ページ遷移時に自動的に PAGE_VIEW イベントを Shopify に送信します。
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { ShopifyAnalytics } from '@/lib/analytics'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ShopifyAnalytics />
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 *
 * @see https://shopify.dev/docs/api/hydrogen-react/latest/utilities/sendshopifyanalytics
 */
export function ShopifyAnalytics() {
  return (
    <Suspense fallback={null}>
      <ShopifyAnalyticsInner />
    </Suspense>
  )
}
