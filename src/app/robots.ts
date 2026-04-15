import type { MetadataRoute } from 'next'

import { siteConfig } from '@/config/site.config'
import { isPublicSiteVisibility } from '@/config/site-visibility'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.siteUrl
  const isPublic = isPublicSiteVisibility()

  // TODO: 一般公開前のテスト公開期間は noindex / nofollow に切り替える
  // 独自ドメインを本番に向けたまま公開する場合、Deployment Protection だけでなく検索流入も止める
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/cart/'],
      },
    ],
    sitemap: isPublic ? `${baseUrl}/sitemap.xml` : undefined,
    host: baseUrl,
  }
}
