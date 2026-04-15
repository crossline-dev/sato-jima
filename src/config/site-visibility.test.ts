import { describe, expect, it } from 'vitest'

import { getSiteVisibility, isPublicSiteVisibility } from './site-visibility'

describe('site visibility', () => {
  it('defaults to public when env is unset', () => {
    expect(getSiteVisibility(undefined)).toBe('public')
    expect(isPublicSiteVisibility(undefined)).toBe(true)
  })

  it('treats test env as non-public', () => {
    expect(getSiteVisibility('test')).toBe('test')
    expect(isPublicSiteVisibility('test')).toBe(false)
  })
})
