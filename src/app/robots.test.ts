import { afterEach, describe, expect, it, vi } from 'vitest'

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
const originalSiteVisibility = process.env.NEXT_PUBLIC_SITE_VISIBILITY

describe('robots route', () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl
    process.env.NEXT_PUBLIC_SITE_VISIBILITY = originalSiteVisibility
    vi.resetModules()
  })

  it('omits sitemap during test visibility', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://sato-jima.store'
    process.env.NEXT_PUBLIC_SITE_VISIBILITY = 'test'

    const { default: robots } = await import('./robots')
    const result = robots()

    expect(result.sitemap).toBeUndefined()
    expect(result.host).toBe('https://sato-jima.store')
  })

  it('publishes sitemap during public visibility', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://sato-jima.store'
    process.env.NEXT_PUBLIC_SITE_VISIBILITY = 'public'

    const { default: robots } = await import('./robots')
    const result = robots()

    expect(result.sitemap).toBe('https://sato-jima.store/sitemap.xml')
  })
})
