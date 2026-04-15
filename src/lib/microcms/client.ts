import 'server-only'

import { createClient } from 'microcms-js-sdk'
import { env } from '@/env/server'

/**
 * microCMS クライアント
 * Server Componentsでのみ使用
 * 環境変数が未設定の場合は null（デモ・開発環境でのグレースフルデグラデーション）
 */
export const microcmsClient =
  env.MICROCMS_SERVICE_DOMAIN && env.MICROCMS_API_KEY
    ? createClient({
        serviceDomain: env.MICROCMS_SERVICE_DOMAIN,
        apiKey: env.MICROCMS_API_KEY,
      })
    : null
