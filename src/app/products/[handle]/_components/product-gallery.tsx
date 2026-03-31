'use client'

import Fade from 'embla-carousel-fade'
import Image from 'next/image'
import { parseAsString, useQueryStates } from 'nuqs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/utils/classes'
import { getColorOption } from '@/utils/color-swatch'

interface ProductImage {
  url: string
  altText?: string | null
  width?: number | null
  height?: number | null
}

interface ProductVariant {
  id: string
  selectedOptions: Array<{ name: string; value: string }>
  image?: ProductImage | null
}

interface ProductOption {
  id: string
  name: string
  values: string[]
}

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
  variants: ProductVariant[]
  options: ProductOption[]
}

export function ProductGalleryMobile({
  images,
  productName,
  variants,
  options,
}: ProductGalleryProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)

  // nuqs で URL から選択中のオプションを取得
  const parsers = useMemo(
    () =>
      Object.fromEntries(
        options.map(opt => [opt.name.toLowerCase(), parseAsString]),
      ),
    [options],
  )
  const [queryOptions] = useQueryStates(parsers)

  // カラーオプションを特定
  const colorOption = useMemo(() => getColorOption(options), [options])

  // 選択されたカラーに対応する画像のインデックスを特定
  const selectedImageIndex = useMemo(() => {
    if (!colorOption) return -1
    const selectedColor = queryOptions[colorOption.name.toLowerCase()]
    if (!selectedColor) return -1

    // 選択されたカラーを持つ最初のバリアント画像を探す
    const variant = variants.find(
      v =>
        v.image &&
        v.selectedOptions.some(
          opt =>
            opt.name.toLowerCase() === colorOption.name.toLowerCase() &&
            opt.value === selectedColor,
        ),
    )

    if (!variant?.image) return -1

    // 画像一覧からその画像のインデックスを探す
    return images.findIndex(img => img.url === variant.image?.url)
  }, [colorOption, queryOptions, variants, images])

  // 画像が選択されたらスクロール
  useEffect(() => {
    if (api && selectedImageIndex !== -1) {
      api.scrollTo(selectedImageIndex)
    }
  }, [api, selectedImageIndex])

  const onSelect = useCallback(() => {
    if (!api || !thumbsApi) return
    setSelectedIndex(api.selectedScrollSnap())
    thumbsApi.scrollTo(api.selectedScrollSnap())
  }, [api, thumbsApi])

  useEffect(() => {
    if (!api || !thumbsApi) return

    onSelect()
    api.on('select', onSelect)
    api.on('reInit', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api, thumbsApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  if (images.length === 0) {
    return (
      <div className='flex flex-col gap-3 lg:hidden'>
        <div className='-mx-4 flex aspect-4/5 items-center justify-center bg-muted sm:mx-0'>
          <p className='text-muted-foreground'>画像がありません</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3 lg:hidden'>
      {/* メインカルーセル（SPでは全幅表示、フェード切り替え） */}
      <Carousel
        setApi={setApi}
        plugins={[Fade()]}
        className='-mx-4 w-[calc(100%+2rem)] sm:mx-0 sm:w-full'
        opts={{
          loop: true,
          containScroll: false,
        }}>
        <CarouselContent className='ml-0'>
          {images.map((image, index) => (
            <CarouselItem key={image.url} className='pl-0'>
              <div className='relative aspect-4/5 overflow-hidden bg-muted'>
                <Image
                  src={image.url}
                  alt={image.altText ?? `${productName} - ${index + 1}`}
                  fill
                  className='object-cover'
                  priority={index === 0}
                  sizes='(min-width: 1024px) 50vw, 100vw'
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* ナビゲーションボタン（デスクトップのみ表示） */}
        {images.length > 1 && (
          <>
            <CarouselPrevious className='left-4 hidden h-10 w-10 bg-background/80 backdrop-blur-sm hover:bg-background lg:flex' />
            <CarouselNext className='right-4 hidden h-10 w-10 bg-background/80 backdrop-blur-sm hover:bg-background lg:flex' />
          </>
        )}
      </Carousel>

      {/* サムネイル一覧 */}
      {images.length > 1 && (
        <Carousel
          setApi={setThumbsApi}
          opts={{
            containScroll: 'keepSnaps',
            dragFree: true,
          }}>
          <CarouselContent className='ml-0 gap-1'>
            {images.map((image, index) => (
              <CarouselItem key={image.url} className='basis-auto pl-0'>
                <button
                  type='button'
                  onClick={() => scrollTo(index)}
                  className='group relative shrink-0'>
                  <div
                    className={cn(
                      'relative size-15 overflow-hidden bg-muted transition-opacity duration-200',
                      selectedIndex !== index &&
                        'opacity-60 group-hover:opacity-100',
                    )}>
                    <Image
                      src={image.url}
                      alt={image.altText ?? `サムネイル ${index + 1}`}
                      fill
                      className='object-cover'
                      sizes='60px'
                    />
                  </div>
                  {/* 選択インジケーター（アンダーライン） */}
                  <div
                    className={cn(
                      'absolute right-0 bottom-0 left-0 h-0.5 bg-foreground transition-opacity duration-200',
                      selectedIndex === index ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  )
}
