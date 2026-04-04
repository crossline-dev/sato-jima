'use client'

import * as m from 'motion/react-m'
import Link from 'next/link'
import {
  FEATURED_COLLECTION_MENU_ITEMS,
  storefrontCollectionPath,
} from '@/config/storefront'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface Collection {
  id: string
  handle: string
  title: string
}

const HARDCODED_COLLECTIONS: Collection[] = (
  FEATURED_COLLECTION_MENU_ITEMS as unknown as {
    handle: string
    label: string
  }[]
).map(item => ({
  id: `gid://shopify/Collection/${item.handle}`,
  handle: item.handle,
  title: item.label,
}))

interface FeaturedCollectionsProps {
  collections?: Collection[]
  onItemClick?: () => void
  /** trueの場合、viewportではなくマウント時にアニメーション（メガメニュー用） */
  animateOnMount?: boolean
}

export function FeaturedCollections({
  collections = HARDCODED_COLLECTIONS,
  onItemClick,
  animateOnMount = false,
}: FeaturedCollectionsProps) {
  if (collections.length === 0) {
    return null
  }

  return (
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-12'>
      {collections.map((collection, index) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          index={index}
          onClick={onItemClick}
          animateOnMount={animateOnMount}
        />
      ))}
    </div>
  )
}

interface CollectionCardProps {
  collection: Collection
  index: number
  onClick?: () => void
  animateOnMount?: boolean
}

function CollectionCard({
  collection,
  index,
  onClick,
  animateOnMount = false,
}: CollectionCardProps) {
  const { handle, title } = collection
  const prefersReducedMotion = useReducedMotion()

  // アニメーション設定（reduced-motion 対応）
  const animationProps = prefersReducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 },
      }
    : animateOnMount
      ? {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.3,
            delay: index * 0.06,
            ease: 'easeOut' as const,
          },
        }
      : {
          initial: { opacity: 0, y: 10 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-50px' as const },
          transition: {
            duration: 0.4,
            delay: index * 0.08,
            ease: 'easeOut' as const,
          },
        }

  return (
    <m.article
      {...animationProps}
      className='flex flex-col items-center px-8 sm:px-0'>
      <Link
        href={storefrontCollectionPath(handle)}
        onClick={onClick}
        className='group relative flex w-full cursor-pointer flex-col items-center justify-center border border-border bg-muted/30 px-6 py-12 transition-all duration-300 hover:border-foreground/30 hover:bg-muted/50'
        style={{ aspectRatio: '304 / 264' }}>
        <span className='font-en font-medium text-foreground text-xl tracking-wide'>
          {title}
        </span>
      </Link>
    </m.article>
  )
}
