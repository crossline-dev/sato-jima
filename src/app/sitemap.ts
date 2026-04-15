import type { MetadataRoute } from 'next'

import { siteConfig } from '@/config/site.config'
import { isPublicSiteVisibility } from '@/config/site-visibility'
import { getAllNewsArticleIds } from '@/lib/microcms'
import { getAllCollectionHandles, getProducts } from '@/lib/shopify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isPublicSiteVisibility()) {
    return []
  }

  const baseUrl = siteConfig.siteUrl

  // TODO: 一般公開前のテスト公開期間は sitemap を空配列にするか route 自体を止める
  // robots と合わせて、商品・コレクション URL を検索エンジンへ通知しない状態にする

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shopping-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-sale`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // 動的ページ: コレクション
  let collectionPages: MetadataRoute.Sitemap = []
  try {
    const collectionHandles = await getAllCollectionHandles()
    collectionPages = collectionHandles.map((handle: string) => ({
      url: `${baseUrl}/collections/${handle}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  } catch {
    // API障害時は空配列でフォールバック
  }

  // 動的ページ: 商品
  let productPages: MetadataRoute.Sitemap = []
  try {
    const products = await getProducts({ first: 250 })
    productPages = products.map(product => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch {
    // API障害時は空配列でフォールバック
  }

  // 動的ページ: お知らせ記事
  let newsPages: MetadataRoute.Sitemap = []
  try {
    const newsIds = await getAllNewsArticleIds()
    newsPages = newsIds.map((id: string) => ({
      url: `${baseUrl}/news/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch {
    // API障害時は空配列でフォールバック
  }

  return [...staticPages, ...collectionPages, ...productPages, ...newsPages]
}
