/**
 * 商品タグからバッジ情報を生成する
 */

export type BadgeType =
  | 'new'
  | 'sale'
  | 'preorder'
  | 'limited'
  | 'soldout'
  | 'made-to-order'

export interface Badge {
  type: BadgeType
  label: string
  variant: 'default' | 'destructive' | 'secondary' | 'outline'
}

const BADGE_TAG_MAP: Record<string, Badge> = {
  new: { type: 'new', label: 'New Arrival', variant: 'default' },
  'new-arrival': { type: 'new', label: 'New Arrival', variant: 'default' },
  'new arrival': { type: 'new', label: 'New Arrival', variant: 'default' },
  limited: { type: 'limited', label: 'Limited Goods', variant: 'secondary' },
  'limited-edition': {
    type: 'limited',
    label: 'Limited Goods',
    variant: 'secondary',
  },
  'limited goods': {
    type: 'limited',
    label: 'Limited Goods',
    variant: 'secondary',
  },
  preorder: { type: 'preorder', label: 'PRE-ORDER', variant: 'outline' },
  'pre-order': { type: 'preorder', label: 'PRE-ORDER', variant: 'outline' },
  'made-to-order': {
    type: 'made-to-order',
    label: '受注生産',
    variant: 'outline',
  },
  'made to order': {
    type: 'made-to-order',
    label: '受注生産',
    variant: 'outline',
  },
  sale: { type: 'sale', label: 'SALE', variant: 'destructive' },
}

/**
 * 商品タグからバッジを抽出
 */
export function getBadgesFromTags(tags: string[]): Badge[] {
  const normalizedTags = tags.map(tag => tag.toLowerCase().trim())
  const badges: Badge[] = []

  for (const tag of normalizedTags) {
    const badge = BADGE_TAG_MAP[tag]
    if (badge && !badges.some(b => b.type === badge.type)) {
      badges.push(badge)
    }
  }

  return badges
}

/**
 * セール中かどうかを判定
 */
export function isOnSale(
  price: string,
  compareAtPrice: string | null | undefined,
): boolean {
  if (!compareAtPrice) return false
  return Number.parseFloat(compareAtPrice) > Number.parseFloat(price)
}

/**
 * 割引率を計算
 */
export function calculateDiscountPercentage(
  price: string,
  compareAtPrice: string,
): number {
  const priceNum = Number.parseFloat(price)
  const compareNum = Number.parseFloat(compareAtPrice)
  if (compareNum <= 0) return 0
  return Math.round(((compareNum - priceNum) / compareNum) * 100)
}

/** 「残りわずか」と判定する在庫数の閾値 */
const LOW_STOCK_THRESHOLD = 3

/**
 * 在庫が残りわずかかどうかを判定
 * @param quantity 在庫数（全バリアント合計 or 単一バリアント）
 */
export function isLowStock(quantity: number): boolean {
  return quantity > 0 && quantity <= LOW_STOCK_THRESHOLD
}

/**
 * 受注生産（Made to Order）商品かどうかを判定
 */
export function isMadeToOrder(tags: string[]): boolean {
  return tags.some(
    tag =>
      tag.toLowerCase().trim() === 'made-to-order' ||
      tag.toLowerCase().trim() === 'made to order',
  )
}
