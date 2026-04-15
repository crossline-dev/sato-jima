export type SiteVisibility = 'public' | 'test'

export function getSiteVisibility(
  rawVisibility = process.env.NEXT_PUBLIC_SITE_VISIBILITY,
): SiteVisibility {
  return rawVisibility === 'test' ? 'test' : 'public'
}

export function isPublicSiteVisibility(
  rawVisibility = process.env.NEXT_PUBLIC_SITE_VISIBILITY,
): boolean {
  return getSiteVisibility(rawVisibility) === 'public'
}
