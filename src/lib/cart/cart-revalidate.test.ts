import { afterEach, describe, expect, it, vi } from 'vitest'
import { TAGS } from '@/lib/shopify/constants'

const updateTag = vi.fn()

vi.mock('next/cache', () => ({
  updateTag,
}))

describe('revalidateCartTag', () => {
  afterEach(() => {
    updateTag.mockClear()
  })

  it('invalidates cart via updateTag (no invalid cacheLife profile)', async () => {
    const { revalidateCartTag } = await import('./cart-revalidate')
    revalidateCartTag()
    expect(updateTag).toHaveBeenCalledTimes(1)
    expect(updateTag).toHaveBeenCalledWith(TAGS.cart)
  })
})
