/**
 * 価格を指定された通貨記号とロケールでフォーマットします。
 *
 * @param amount - 金額（数値または文字列）
 * @param currencyCode - 通貨コード（例: 'JPY', 'USD'）
 * @param locale - ロケール（デフォルト: 'ja-JP'）
 * @returns フォーマットされた価格文字列
 */
export function formatPrice(
  amount: number | string,
  currencyCode = 'JPY',
  locale = 'ja-JP',
) {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'symbol',
  }).format(value)
}
