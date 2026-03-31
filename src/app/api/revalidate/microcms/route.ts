import crypto from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { env } from '@/env/server'

/**
 * microCMS Webhook の HMAC-SHA256 署名を検証
 */
function verifyMicroCMSWebhook(
  rawBody: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature) {
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature),
    )
  } catch {
    return false
  }
}

/**
 * microCMS Webhook を受け取りキャッシュを再検証するエンドポイント
 *
 * microCMS 管理画面で以下の Webhook を設定してください:
 * - API: news
 * - タイミング: コンテンツの公開時・更新時、コンテンツの公開終了時、公開中コンテンツの削除時
 * - 通知先URL: https://your-domain.com/api/revalidate/microcms
 * - シークレット: MICROCMS_WEBHOOK_SECRET と同じ値を設定
 */
export async function POST(request: Request) {
  const headersList = await headers()
  const signature = headersList.get('x-microcms-signature')

  // ボディを取得（署名検証のために raw body が必要）
  const rawBody = await request.text()

  // シークレットが設定されている場合は署名を検証
  if (env.MICROCMS_WEBHOOK_SECRET) {
    if (
      !verifyMicroCMSWebhook(rawBody, signature, env.MICROCMS_WEBHOOK_SECRET)
    ) {
      console.error('[microCMS Revalidate] Invalid signature')
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 },
      )
    }
  }

  // ペイロードを解析
  let body: {
    service?: string
    api?: string
    id?: string
    type?: 'new' | 'edit' | 'delete'
  } = {}

  try {
    body = JSON.parse(rawBody)
  } catch {
    console.error('[microCMS Revalidate] Failed to parse JSON body')
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  // お知らせAPIの場合のみ処理
  if (body.api !== 'news') {
    return NextResponse.json({ message: 'API not handled', api: body.api })
  }

  const revalidatedTags: string[] = []

  // 基本のタグを再検証
  revalidateTag('news', 'days')
  revalidatedTags.push('news')

  // IDが存在する場合、詳細ページのタグも再検証
  if (body.id) {
    const detailTag = `news:${body.id}`
    revalidateTag(detailTag, 'days')
    revalidatedTags.push(detailTag)
  }

  return NextResponse.json({
    revalidated: true,
    api: body.api,
    type: body.type,
    id: body.id,
    tags: revalidatedTags,
  })
}
