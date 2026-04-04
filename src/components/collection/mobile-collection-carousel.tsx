'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Link from 'next/link'
import {
  FEATURED_COLLECTION_MENU_ITEMS,
  storefrontCollectionPath,
} from '@/config/storefront'

interface Collection {
  id: string
  handle: string
  title: string
}

/**
 * FEATURED_COLLECTION_MENU_ITEMS から動的に生成。
 * コレクション確定次第、storefront.ts を更新するだけで反映される。
 */
const COLLECTIONS: Collection[] = (
  FEATURED_COLLECTION_MENU_ITEMS as unknown as {
    handle: string
    label: string
  }[]
).map(item => ({
  id: `gid://shopify/Collection/${item.handle}`,
  handle: item.handle,
  title: item.label,
}))

interface MobileCollectionCarouselProps {
  onItemClick?: () => void
}

export function MobileCollectionCarousel({
  onItemClick,
}: MobileCollectionCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  })

  if (COLLECTIONS.length === 0) {
    return null
  }

  return (
    <div className='overflow-hidden' ref={emblaRef}>
      <div className='flex'>
        {COLLECTIONS.map(collection => (
          <CollectionSlide
            key={collection.id}
            collection={collection}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  )
}

interface CollectionSlideProps {
  collection: Collection
  onClick?: () => void
}

function CollectionSlide({ collection, onClick }: CollectionSlideProps) {
  const { handle, title } = collection

  return (
    <div className='mr-4 w-[70%] shrink-0'>
      <Link
        href={storefrontCollectionPath(handle)}
        onClick={onClick}
        className='group flex w-full items-center justify-center border border-border bg-muted/30 px-6 py-12 transition-all duration-300 hover:border-foreground/30 hover:bg-muted/50'
        style={{ aspectRatio: '304 / 264' }}>
        <span className='font-en font-medium text-2xl text-foreground tracking-wide'>
          {title}
        </span>
      </Link>
    </div>
  )
}
