function isInvalidCartEnglish(lower: string): boolean {
  return (
    /\binvalid cart\b/.test(lower) ||
    /\bcart id is invalid\b/.test(lower) ||
    /\bcart is invalid\b/.test(lower)
  )
}

/**
 * Shopify は日本語ロケールの場合、日本語のエラーメッセージを返す
 */
export function isCartNotFoundError(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('not found') ||
    lower.includes('expired') ||
    isInvalidCartEnglish(lower) ||
    message.includes('指定されたカートは存在しません') ||
    message.includes('カートが見つかりません') ||
    message.includes('カートは期限切れ')
  )
}

export const CART_ERROR_MESSAGES = {
  cartDisabled:
    'カートは現在ご利用いただけません。販売開始までお待ちください。',
  cartMissing: 'カートが存在しません',
  expired:
    'カートの有効期限が切れました。再度商品を追加してください。',
  createFailed: 'カートの作成に失敗しました',
  recreateFailed: 'カートの再作成に失敗しました',
  addFailed: 'アイテムの追加に失敗しました',
  removeFailed: '削除に失敗しました',
  updateFailed: '更新に失敗しました',
  checkoutFailed:
    'チェックアウトを開始できませんでした。しばらくしてからもう一度お試しください。',
} as const

export function failCartAction(error: string) {
  return { success: false as const, error }
}

export function expiredCartError() {
  return failCartAction(CART_ERROR_MESSAGES.expired)
}

export function failCartActionFromUnknown(
  error: unknown,
  fallback: string,
) {
  console.error('[cart-action] unexpected error', error)
  return failCartAction(fallback)
}
