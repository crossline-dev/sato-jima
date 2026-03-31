function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT || 3000}`
}

/**
 * カートオープン日時
 * この日時を過ぎるとカート機能（追加・チェックアウト）が有効になる
 * 公開後不要になったら `null` に変更するか、この設定を削除する
 */
export const CART_OPEN_DATE = new Date('2026-02-14T20:00:00+09:00')

/**
 * カートが現在有効かどうかを判定
 * サーバー / クライアント両方で使用可能
 */
export function isCartEnabled(): boolean {
  return Date.now() >= CART_OPEN_DATE.getTime()
}

/**
 * カートオープン日時の表示用ラベル（例: "2/14(金) 20:00"）
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
  siteName: 'TRIANGLE SHOP',
  siteNameEn: 'TRIANGLE SHOP',
  siteDescription:
    '佐藤三兄弟オフィシャルショップ「TRIANGLE SHOP」。オリジナルベアやイベントグッズ、アパレルなど、佐藤三兄弟の公式グッズをお届けします。',
  siteTitle: 'TRIANGLE SHOP | 佐藤三兄弟オフィシャルショップ',
  siteMetaTitle: 'TRIANGLE SHOP',
  siteKeywords: [
    'TRIANGLE SHOP',
    '佐藤三兄弟',
    'オフィシャルショップ',
    '公式グッズ',
    'オリジナルベア',
    'イベントグッズ',
    'アパレル',
  ],
  siteUrl: resolveBaseUrl(),
  blogURL: 'https://ameblo.jp/sitanosan/',
  siteSubTitle: '佐藤三兄弟オフィシャルショップ',
}

export const metadataBase = new URL(resolveBaseUrl())
