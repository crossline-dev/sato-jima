'use client'

import * as m from 'motion/react-m'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { GetProductsQuery } from '@/lib/shopify/generated/graphql'
import { cn } from '@/utils/classes'
import { buildColorSwatches, getColorOption } from '@/utils/color-swatch'
import { formatPrice } from '@/utils/format/price'
import {
  type Badge,
  getBadgesFromTags,
  isLowStock,
  isOnSale,
} from '@/utils/product-badges'
import { ProductCardCarousel } from './product-card-carousel'

type Product = NonNullable<
  NonNullable<
    NonNullable<GetProductsQuery['products']['edges']>[number]
  >['node']
>

interface ProductCardProps {
  product: Product
  index: number
  priority?: boolean
}

/**
 * 在庫切れを示す斜線SVG（静的要素をモジュールスコープでホイスト）
 * レンダリングごとの再生成を防ぎ、React の差分比較をスキップ
 */
const SoldOutLineOverlay = (
  <svg
    className='absolute inset-0 h-full w-full'
    viewBox='0 0 100 100'
    preserveAspectRatio='none'
    role='img'
    aria-label='在庫切れ'>
    <title>在庫切れ</title>
    <line
      x1='100'
      y1='0'
      x2='0'
      y2='100'
      strokeWidth='3'
      className='stroke-neutral-400'
    />
  </svg>
)

export function ProductCard({
  product,
  index,
  priority = false,
}: ProductCardProps) {
  const {
    title,
    handle,
    priceRange,
    featuredImage,
    images,
    tags,
    variants,
    options,
    availableForSale,
  } = product

  const [selectedColorValue, setSelectedColorValue] = useState<string | null>(
    null,
  )
  const prefersReducedMotion = useReducedMotion()

  // 画像一覧を取得
  const productImages = useMemo(() => {
    const imgs = images?.edges?.map(e => e.node) ?? []
    if (imgs.length === 0 && featuredImage) {
      return [featuredImage]
    }
    return imgs
  }, [images, featuredImage])

  // バリアント情報
  const variantNodes = useMemo(
    () => variants?.edges?.map(e => e.node) ?? [],
    [variants],
  )

  const firstVariant = variantNodes[0]

  // 価格情報
  const price = firstVariant?.price ?? priceRange.minVariantPrice
  const compareAtPrice = firstVariant?.compareAtPrice
  const onSale = isOnSale(price.amount, compareAtPrice?.amount)

  // 全バリアントの合計在庫数
  const totalStock = useMemo(
    () => variantNodes.reduce((sum, v) => sum + (v.quantityAvailable ?? 0), 0),
    [variantNodes],
  )

  // バッジ
  const badges = useMemo(() => {
    const result: Badge[] = getBadgesFromTags(tags).filter(
      b => b.type !== 'made-to-order',
    ) // 一覧カードでは受注生産バッジを非表示

    // SALEバッジの文言を 'SALE' に固定
    if (onSale && !result.some(b => b.type === 'sale')) {
      result.push({
        type: 'sale',
        label: 'SALE',
        variant: 'destructive',
      })
    }

    return result
  }, [tags, onSale])

  // カラーオプションを取得
  const colorOption = useMemo(() => getColorOption(options), [options])

  // カラースウォッチ情報を構築（共通ユーティリティを使用）
  const colorSwatches = useMemo(
    () => buildColorSwatches(colorOption, variantNodes, 4),
    [colorOption, variantNodes],
  )

  const hasColorSwatches = colorSwatches.length > 0

  // カラー選択時の画像配列を再構成
  const displayImages = useMemo(() => {
    if (!selectedColorValue || !colorOption) return productImages

    const optionNameLower = colorOption.name.toLowerCase()
    const colorVariant = variantNodes.find(v =>
      v.selectedOptions.some(
        opt =>
          opt.name.toLowerCase() === optionNameLower &&
          opt.value === selectedColorValue,
      ),
    )
    const colorImage = colorVariant?.image

    if (!colorImage) return productImages

    // 選択画像を先頭に、残りから重複を除去
    return [
      colorImage,
      ...productImages.filter(img => img.url !== colorImage.url),
    ]
  }, [productImages, selectedColorValue, colorOption, variantNodes])

  // 商品詳細ページへのリンクURL
  const productUrl = useMemo(() => {
    const base = `/products/${handle}`
    if (selectedColorValue && colorOption) {
      return `${base}?${colorOption.name.toLowerCase()}=${encodeURIComponent(selectedColorValue)}`
    }
    return base
  }, [handle, selectedColorValue, colorOption])

  return (
    <m.article
      initial={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 0, filter: 'blur(4px)' }
      }
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.4, delay: index * 0.05, ease: 'easeOut' }
      }
      className='group relative flex flex-col'>
      {/* 画像エリア */}
      <Link
        href={productUrl as never}
        className='relative block overflow-hidden bg-muted/30'>
        <ProductCardCarousel
          images={displayImages}
          productTitle={title}
          priority={priority}
        />

        {/* バッジ */}
        {badges.length > 0 && (
          <div className='absolute top-2 left-2 z-10 flex flex-col gap-1 font-en'>
            {badges.map(badge => (
              <span
                key={badge.type}
                className={`inline-flex items-center justify-center px-2 py-0.5 text-center text-[0.65rem] tracking-wider ${
                  badge.variant === 'destructive'
                    ? 'bg-red-500 text-white'
                    : badge.variant === 'secondary'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-white text-muted-foreground'
                }`}>
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {/* View More ボタン (hover時に表示) */}
        <div className='absolute right-0 bottom-0 left-0 z-10 translate-y-full bg-linear-to-t from-black/20 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
          <Button
            variant='secondary'
            size='sm'
            className='w-full cursor-pointer bg-white font-medium text-neutral-900 text-xs hover:bg-neutral-100'>
            View More
          </Button>
        </div>
      </Link>

      {/* カラースウォッチ */}
      {hasColorSwatches && (
        <div className='flex items-center gap-1.5 pt-2'>
          {colorSwatches.map(swatch => (
            <button
              key={swatch.value}
              type='button'
              onClick={() => setSelectedColorValue(swatch.value)}
              title={`${swatch.optionName}: ${swatch.value}${!swatch.isAvailable ? ' (在庫切れ)' : ''}`}
              className={cn(
                'relative size-8 overflow-hidden rounded-[2px] transition-all duration-200 md:size-10 lg:size-12 xl:size-14',
                selectedColorValue === swatch.value
                  ? 'ring-1 ring-foreground ring-offset-1 ring-offset-background'
                  : 'border border-border hover:border-muted-foreground',
                !swatch.isAvailable && 'opacity-40',
              )}>
              {swatch.image && (
                <Image
                  src={swatch.image.url}
                  alt={`${swatch.optionName}: ${swatch.value}`}
                  fill
                  className='object-cover'
                  sizes='24px'
                />
              )}
              {/* 在庫切れの斜線 */}
              {!swatch.isAvailable && SoldOutLineOverlay}
            </button>
          ))}
        </div>
      )}

      {/* 情報エリア */}
      <div className='flex flex-1 flex-col pt-3'>
        {/* タイトル */}
        <h3 className='font-en font-normal text-foreground text-sm leading-tight'>
          <Link href={productUrl as never}>{title}</Link>
        </h3>

        {/* 価格 */}
        <div className='mt-1 flex items-center gap-2'>
          <span
            className={`font-en font-normal text-sm ${onSale ? 'text-red-600' : 'text-foreground'}`}>
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {onSale && compareAtPrice && (
            <span className='font-en text-muted-foreground text-xs line-through'>
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
          {!availableForSale && (
            <span className='font-en text-[0.65rem] text-muted-foreground'>
              Sold Out
            </span>
          )}
        </div>

        {/* 残りわずか表示 */}
        {availableForSale && isLowStock(totalStock) && (
          <p className='mt-1 font-bold text-red-600 text-xs'>残りわずか</p>
        )}

        {/* サイズ / 在庫情報 (MVPでは非表示) */}
        {/*
        <div className='mt-1.5 flex flex-wrap items-center gap-1'>
          {sizeOption.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {sizeOption.map(size => (
                <span key={size} className='text-[10px] text-muted-foreground'>
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>
        */}

        {/* 在庫・Pre-order表示 (MVPでは非表示) */}
        {/*
        {!availableForSale ? (
          <span className='mt-1 text-[11px] text-muted-foreground'>
            Sold out
          </span>
        ) : badges.some(b => b.type === 'preorder') ? (
          <span className='mt-1 text-[11px] text-muted-foreground'>
            Pre-order
          </span>
        ) : inStockCount > 0 && inStockCount <= 10 ? (
          <span className='mt-1 text-[11px] text-muted-foreground'>
            {inStockCount} in stock
          </span>
        ) : null}
        */}
      </div>
    </m.article>
  )
}
