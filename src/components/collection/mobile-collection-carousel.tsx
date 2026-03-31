'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Link from 'next/link'

interface Collection {
  id: string
  handle: string
  title: string
}

// ハードコードされたコレクションデータ
const COLLECTIONS: Collection[] = [
  {
    id: 'gid://shopify/Collection/original-bear',
    handle: 'original-bear',
    title: 'Original Bear',
  },
  {
    id: 'gid://shopify/Collection/event-goods',
    handle: 'event-goods',
    title: 'Event Goods',
  },
  {
    id: 'gid://shopify/Collection/apparel',
    handle: 'apparel',
    title: 'Apparel',
  },
]

// 表示用タイトルのマッピング（改行対応）
const DISPLAY_TITLES: Record<string, string> = {
  'original-bear': 'Original\nBear',
  'event-goods': 'Event\nGoods',
  apparel: 'Apparel',
}

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

  return (
    <div className='overflow-hidden' ref={emblaRef}>
      <div className='flex'>
        {COLLECTIONS.map(collection => (
          <TriangleSlide
            key={collection.id}
            collection={collection}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  )
}

interface TriangleSlideProps {
  collection: Collection
  onClick?: () => void
}

function TriangleSlide({ collection, onClick }: TriangleSlideProps) {
  const { handle, title } = collection
  const displayTitle = DISPLAY_TITLES[handle] || title

  const width = 300
  const height = 260
  const padding = 2

  // 三角形の重心（テキスト配置用）
  const centroidX = width / 2
  const centroidY = (0 + height + height) / 3

  return (
    <div className='mr-4 w-[70%] shrink-0'>
      <Link
        href={`/collections/${handle}`}
        onClick={onClick}
        className='group relative flex w-full cursor-pointer flex-col items-center transition-transform hover:scale-105'
        style={{
          aspectRatio: `${width + padding * 2} / ${height + padding * 2}`,
        }}>
        <svg
          width='100%'
          height='100%'
          viewBox={`${-padding} ${-padding} ${width + padding * 2} ${height + padding * 2}`}
          preserveAspectRatio='xMidYMid meet'
          className='h-full w-full'>
          <title>{title}</title>

          {/* 線1: 一番外側（太い） - foreground色 100% */}
          <path
            d={`M${width / 2},0 L0,${height} L${width},${height} Z`}
            fill='none'
            className='stroke-foreground'
            strokeWidth='2'
            strokeLinejoin='miter'
          />

          {/* 線2: 内側（細い） - foreground色 50% */}
          <path
            d={`M${width / 2},12 L12,${height - 7} L${width - 12},${height - 7} Z`}
            fill='none'
            className='stroke-foreground/50'
            strokeWidth='1.5'
            strokeLinejoin='miter'
          />

          {/* 線3: 一番内側（細い） - foreground色 25% */}
          <path
            d={`M${width / 2},24 L24,${height - 14} L${width - 24},${height - 14} Z`}
            fill='none'
            className='stroke-foreground/25'
            strokeWidth='1'
            strokeLinejoin='miter'
          />

          {/* タイトルテキスト - 三角形の中央に配置（改行対応） */}
          <text
            x={centroidX}
            y={centroidY}
            textAnchor='middle'
            dominantBaseline='middle'
            className='fill-foreground font-accent font-medium text-2xl leading-loose tracking-wide'>
            {displayTitle.split('\n').map((line, i, arr) => (
              <tspan
                key={line}
                x={centroidX}
                dy={i === 0 ? `${-(arr.length - 1) * 0.6}em` : '1.25em'}>
                {line}
              </tspan>
            ))}
          </text>
        </svg>
      </Link>
    </div>
  )
}
