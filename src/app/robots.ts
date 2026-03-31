import type { MetadataRoute } from 'next'

import { siteConfig } from '@/config/site.config'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.siteUrl

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/cart/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
