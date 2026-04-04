import type { Metadata } from 'next'

type Robots = NonNullable<Metadata['robots']>

/**
 * インデックス可否に応じた robots / googleBot（プレビュー系スニペット方針を統一）
 */
export function robotsWithGooglePreview(options: {
  index: boolean
  follow?: boolean
}): Robots {
  const { index } = options
  const follow = options.follow ?? index
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
