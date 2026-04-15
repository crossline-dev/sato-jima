/**
 * @agent-guard
 * - CART_OPEN_DATE は Coming Soon / カート有効判定の根幹。変更時は以下に影響:
 *   → isCartEnabled() → cart-actions.ts (addItem) → AddToCartButton → ComingSoonBadge
 * - siteConfig はブランド情報の SSOT。変更は全ページメタデータ・OGP に波及する
 * - siteUrl は環境変数から自動解決。手動でハードコードしないこと
 *
 * @see docs/business/domain-spec.md
 * @see docs/business/migration-checklist.md
 */

function resolveBaseUrl(): string {
  // TODO: Vercel の独自ドメインを本番適用したら、Production 環境に NEXT_PUBLIC_SITE_URL を必ず設定する
  // 未設定だと metadata / canonical / sitemap / robots が *.vercel.app を基準に生成される場合がある
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT || 3000}`
}

/**
 * カートオープン日時
 * この日時を過ぎるとカート機能（追加・チェックアウト）が有効になる
 * 公開後不要になったら `null` に変更するか、この設定を削除する
 */
export const CART_OPEN_DATE = new Date('2026-06-30T00:00:00+09:00')

/**
 * カートが現在有効かどうかを判定
 * サーバー / クライアント両方で使用可能
 */
export function isCartEnabled(): boolean {
  return Date.now() >= CART_OPEN_DATE.getTime()
}

/**
 * カートオープン日時の表示用ラベル（例: "6/30(月) 00:00"）
 * モジュールレベルで1回だけ計算
 */
export const CART_OPEN_LABEL = CART_OPEN_DATE.toLocaleDateString('ja-JP', {
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Tokyo',
})

export const siteConfig = {
  siteName: 'さと島 SHOP',
  siteNameEn: 'SATO-JIMA SHOP',
  siteDescription:
    'さと島 SHOP はアーティスト公式グッズのオンラインショップです。こだわりのアイテムをお届けします。',
  siteTitle: 'さと島 SHOP | 公式オンラインショップ',
  siteMetaTitle: 'さと島 SHOP',
  siteKeywords: [
    'さと島 SHOP',
    '公式グッズ',
    'オンラインショップ',
    'アーティストグッズ',
  ],
  siteUrl: resolveBaseUrl(),
  siteSubTitle: '公式オンラインショップ',
}

export const metadataBase = new URL(resolveBaseUrl())
