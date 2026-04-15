import type { Metadata } from 'next'
import { isPublicSiteVisibility } from '@/config/site-visibility'

type Robots = NonNullable<Metadata['robots']>

/**
 * インデックス可否に応じた robots / googleBot（プレビュー系スニペット方針を統一）
 */
export function robotsWithGooglePreview(options: {
  index: boolean
  follow?: boolean
}): Robots {
  const isPublic = isPublicSiteVisibility()
  const index = isPublic ? options.index : false
  const follow = isPublic ? (options.follow ?? index) : false
  return {
    index,
    follow,
    googleBot: {
      index,
      follow,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}
