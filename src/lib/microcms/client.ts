import 'server-only'

import { createClient } from 'microcms-js-sdk'
import { env } from '@/env/server'

/**
 * microCMS クライアント
 * Server Componentsでのみ使用
 */
export const microcmsClient = createClient({
  serviceDomain: env.MICROCMS_SERVICE_DOMAIN,
  apiKey: env.MICROCMS_API_KEY,
})
