'use client'

import * as m from 'motion/react-m'
import Image from 'next/image'
import Link from 'next/link'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { GetCollectionsQuery } from '@/lib/shopify/generated/graphql'

/**
 * GetCollectionsQuery から単一の Collection オブジェクトの型を抽出
 *
 * Shopify Storefront API は edges → node パターンを使用するため、
 * ネストされた型から目的の型を取り出す必要がある
 *
 * 1. GetCollectionsQuery['collections']['edges'] → edges 配列の型を取得
 * 2. NonNullable<...> → null | undefined を除外
 * 3. [number] → 配列の要素型を取得（Array<T> → T）
 * 4. ['node'] → edge から node プロパティの型を取得
 * 5. 最外の NonNullable → 最終的な型から nullable を除外
 */
type Collection = NonNullable<
  NonNullable<
    NonNullable<GetCollectionsQuery['collections']['edges']>[number]
  >['node']
>

interface CollectionCardProps {
  collection: Collection
  index: number
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  const { handle, title, image, description } = collection
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.article
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.5, delay: index * 0.1, ease: 'easeOut' }
      }
      className='group flex flex-col'>
      <Link href={`/collections/${handle}`} className='block'>
        {/* 画像 */}
        <div className='relative aspect-square overflow-hidden'>
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || title}
              width={image.width || 800}
              height={image.height || 800}
              className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-102'
              sizes='(min-width: 768px) 80vw, 100vw'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-foreground/10'>
              <span className='text-foreground/60'>No Image</span>
            </div>
          )}
        </div>
        {/* テキスト */}
        <div className='mt-4'>
          <h2 className='font-en'>{title}</h2>
          {description && (
            <p className='text-muted-foreground text-xs leading-loose tracking-wide'>
              {description}
            </p>
          )}
        </div>
      </Link>
    </m.article>
  )
}
