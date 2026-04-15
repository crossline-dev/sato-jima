import { afterEach, describe, expect, it, vi } from 'vitest'

const getAllNewsArticleIds = vi.fn()
const getAllCollectionHandles = vi.fn()
const getProducts = vi.fn()

vi.mock('@/lib/microcms', () => ({
  getAllNewsArticleIds,
}))

vi.mock('@/lib/shopify', () => ({
  getAllCollectionHandles,
  getProducts,
}))

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
const originalSiteVisibility = process.env.NEXT_PUBLIC_SITE_VISIBILITY

describe('sitemap route', () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl
    process.env.NEXT_PUBLIC_SITE_VISIBILITY = originalSiteVisibility
    getAllNewsArticleIds.mockReset()
    getAllCollectionHandles.mockReset()
    getProducts.mockReset()
    vi.resetModules()
  })

  it('returns empty sitemap during test visibility', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://sato-jima.store'
    process.env.NEXT_PUBLIC_SITE_VISIBILITY = 'test'

    const { default: sitemap } = await import('./sitemap')
    const result = await sitemap()

    expect(result).toEqual([])
    expect(getAllNewsArticleIds).not.toHaveBeenCalled()
    expect(getAllCollectionHandles).not.toHaveBeenCalled()
    expect(getProducts).not.toHaveBeenCalled()
  })

  it('returns sitemap entries during public visibility', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://sato-jima.store'
    process.env.NEXT_PUBLIC_SITE_VISIBILITY = 'public'
    getAllNewsArticleIds.mockResolvedValue(['news-1'])
    getAllCollectionHandles.mockResolvedValue(['all'])
    getProducts.mockResolvedValue([
      { handle: 'product-1', updatedAt: '2026-04-15T00:00:00.000Z' },
    ])

    const { default: sitemap } = await import('./sitemap')
    const result = await sitemap()

    expect(result).not.toHaveLength(0)
    expect(result.some(entry => entry.url === 'https://sato-jima.store')).toBe(
      true,
    )
    expect(
      result.some(
        entry => entry.url === 'https://sato-jima.store/products/product-1',
      ),
    ).toBe(true)
  })
})
