'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/utils/classes'

interface ProductImage {
  url: string
  altText?: string | null
  width?: number | null
  height?: number | null
}

interface ProductCardCarouselProps {
  images: ProductImage[]
  productTitle: string
  className?: string
  priority?: boolean
}

export function ProductCardCarousel({
  images,
  productTitle,
  className,
  priority = false,
}: ProductCardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 0 })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const hasMultipleImages = images.length > 1

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      emblaApi?.scrollPrev()
    },
    [emblaApi],
  )

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      emblaApi?.scrollNext()
    },
    [emblaApi],
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Hover時に2枚目に自動切替 (PC/Hover対応デバイスのみ)
  const handleMouseEnter = useCallback(() => {
    if (!emblaApi || !hasMultipleImages) return
    const isHoverDevice = window.matchMedia('(hover: hover)').matches
    if (!isHoverDevice) return
    if (emblaApi.selectedScrollSnap() === 0) {
      emblaApi.scrollTo(1)
    }
  }, [emblaApi, hasMultipleImages])

  const handleMouseLeave = useCallback(() => {
    if (!emblaApi || !hasMultipleImages) return
    const isHoverDevice = window.matchMedia('(hover: hover)').matches
    if (!isHoverDevice) return
    if (emblaApi.selectedScrollSnap() !== 0) {
      emblaApi.scrollTo(0)
    }
  }, [emblaApi, hasMultipleImages])

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'flex aspect-3/4 items-center justify-center bg-foreground/10',
          className,
        )}>
        <span className='text-foreground/60 text-sm'>No Image</span>
      </div>
    )
  }

  // 画像1枚の場合はシンプル表示
  if (!hasMultipleImages) {
    return (
      <div className={cn('relative aspect-3/4 overflow-hidden', className)}>
        <Image
          src={images[0].url}
          alt={images[0].altText || productTitle}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          sizes='(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
        />
      </div>
    )
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Mouse hover for carousel image switching
    <div
      className={cn('group/carousel relative aspect-3/4', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div ref={emblaRef} className='h-full overflow-hidden'>
        <div className='flex h-full'>
          {images.map((image, index) => (
            <div
              key={image.url}
              className='relative h-full min-w-0 flex-none basis-full bg-background'>
              <Image
                src={image.url}
                alt={image.altText || `${productTitle} - ${index + 1}`}
                fill
                className='object-cover'
                sizes='(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
                priority={priority && index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows - visible on hover */}
      <button
        type='button'
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={cn(
          'absolute top-1/2 left-2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-all duration-200',
          'opacity-0 group-hover/carousel:opacity-100',
          'hover:bg-white disabled:pointer-events-none disabled:opacity-0',
        )}
        aria-label='Previous image'>
        <CaretLeft className='h-4 w-4' />
      </button>

      <button
        type='button'
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={cn(
          'absolute top-1/2 right-2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-all duration-200',
          'opacity-0 group-hover/carousel:opacity-100',
          'hover:bg-white disabled:pointer-events-none disabled:opacity-0',
        )}
        aria-label='Next image'>
        <CaretRight className='h-4 w-4' />
      </button>

      {/* Dot indicators - always visible on mobile, hover-only on desktop */}
      <div
        className={cn(
          'absolute bottom-3 left-3 z-10 flex gap-1 transition-opacity duration-200',
          'opacity-100 lg:opacity-0 lg:group-hover/carousel:opacity-100',
        )}>
        {images.map((image, index) => (
          <div
            key={`dot-${image.url}`}
            className={cn(
              'h-1.5 w-1.5 rounded-full transition-all duration-200',
              selectedIndex === index ? 'bg-neutral-700' : 'bg-neutral-400',
            )}
          />
        ))}
      </div>
    </div>
  )
}
