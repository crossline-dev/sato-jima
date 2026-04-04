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

  // 表示用タイトルのマッピング（改行対応）
  const DISPLAY_TITLES: Record<string, string> = {
    'original-bear': 'Original\nBear',
    'event-goods': 'Event\nGoods',
    apparel: 'Apparel',
  }
  const displayTitle = DISPLAY_TITLES[handle] || title

  const width = 300
  const height = 260
  const padding = 2

  // 三角形の重心（テキスト配置用）
  const centroidX = width / 2
  const centroidY = (0 + height + height) / 3 // 三角形の重心Y座標

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
            className='fill-foreground font-en font-medium text-xl leading-loose tracking-wide'>
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
    </m.article>
  )
}
