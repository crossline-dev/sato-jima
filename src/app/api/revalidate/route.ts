import crypto from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { env } from '@/env/server'
import { TAGS } from '@/lib/shopify/constants'

/**
 * Shopify Webhook のトピックと対応するキャッシュタグのマッピング
 */
const TOPIC_TO_TAGS: Record<string, (keyof typeof TAGS)[]> = {
  'products/create': ['products'],
  'products/update': ['products'],
  'products/delete': ['products'],
  'collections/create': ['collections'],
  'collections/update': ['collections'],
  'collections/delete': ['collections'],
  'inventory_levels/update': ['products'],
  'inventory_items/update': ['products'],
}

/**
 * Shopify Webhook の HMAC-SHA256 署名を検証
 */
function verifyShopifyWebhook(
  rawBody: string,
  hmacHeader: string | null,
): boolean {
  if (!hmacHeader) {
    return false
  }

  const generatedHash = crypto
    .createHmac('sha256', env.SHOPIFY_REVALIDATION_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64')

  return crypto.timingSafeEqual(
    Buffer.from(generatedHash),
    Buffer.from(hmacHeader),
  )
}

/**
 * Shopify Webhook を受け取りキャッシュを再検証するエンドポイント
 *
 * Shopify Admin で以下の Webhook を設定してください:
 * - Products: create, update, delete
 * - Collections: create, update, delete
 * - Inventory: levels/update, items/update
 *
 * API Version: 2025-07
 *
 * URL: https://your-domain.com/api/revalidate
 * Format: JSON
 */
export async function POST(request: Request) {
  const headersList = await headers()
  const hmacHeader = headersList.get('x-shopify-hmac-sha256')
  const topic = headersList.get('x-shopify-topic')

  // ボディを取得（署名検証のために raw body が必要）
  const rawBody = await request.text()

  // HMAC 署名を検証
  if (!verifyShopifyWebhook(rawBody, hmacHeader)) {
    console.error('[Revalidate] Invalid HMAC signature')
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  }

  // トピックが不明な場合
  if (!topic) {
    console.error('[Revalidate] Missing x-shopify-topic header')
    return NextResponse.json({ message: 'Missing topic' }, { status: 400 })
  }

  // ペイロードを解析してハンドルを取得（詳細ページの再検証用）
  let jsonBody: { handle?: string } = {}
  try {
    jsonBody = JSON.parse(rawBody)
  } catch {
    console.error('[Revalidate] Failed to parse JSON body')
  }

  // 対応するタグを取得
  const tagsToRevalidate = TOPIC_TO_TAGS[topic]

  if (!tagsToRevalidate || tagsToRevalidate.length === 0) {
    return NextResponse.json({ message: 'Topic not handled', topic })
  }

  // キャッシュを再検証
  // Next.js 16 では revalidateTag(tag, cacheLifeProfile) の形式
  const revalidatedTags: string[] = []

  // 基本のタグを再検証
  for (const tagKey of tagsToRevalidate) {
    const tag = TAGS[tagKey]
    revalidateTag(tag, 'days')
    revalidatedTags.push(tag)
  }

  // ハンドルが存在する場合、詳細ページのタグも再検証
  if (jsonBody.handle) {
    if (topic.startsWith('products/')) {
      const detailTag = `product:${jsonBody.handle}`
      revalidateTag(detailTag, 'days')
      revalidatedTags.push(detailTag)
    } else if (topic.startsWith('collections/')) {
      const detailTag = `collection:${jsonBody.handle}`
      revalidateTag(detailTag, 'days')
      revalidatedTags.push(detailTag)
    }
  }

  return NextResponse.json({
    revalidated: true,
    topic,
    tags: revalidatedTags,
  })
}
