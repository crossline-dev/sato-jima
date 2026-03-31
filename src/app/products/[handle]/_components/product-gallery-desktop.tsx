'use client'

import Image from 'next/image'
import { parseAsString, useQueryStates } from 'nuqs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getColorOption } from '@/utils/color-swatch'
import { ImageLightbox } from './image-lightbox'

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

interface ProductGalleryDesktopProps {
  images: ProductImage[]
  productName: string
  variants: ProductVariant[]
  options: ProductOption[]
}

export function ProductGalleryDesktop({
  images,
  productName,
  variants,
  options,
}: ProductGalleryDesktopProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const imageRefs = useRef<(HTMLButtonElement | null)[]>([])

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
    if (selectedImageIndex !== -1 && imageRefs.current[selectedImageIndex]) {
      const element = imageRefs.current[selectedImageIndex]
      // 少し遅延させて確実にマウントされた後にスクロール（初期ロード時用）
      const timer = setTimeout(() => {
        element?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [selectedImageIndex])

  const handleImageClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  if (images.length === 0) {
    return (
      <div className='hidden aspect-4/5 items-center justify-center bg-muted lg:flex'>
        <p className='text-muted-foreground'>画像がありません</p>
      </div>
    )
  }

  return (
    <>
      <div className='hidden lg:block'>
        <ProductGalleryGrid
          images={images}
          productName={productName}
          imageRefs={imageRefs}
          onImageClick={handleImageClick}
        />
      </div>

      <ImageLightbox
        key={lightboxIndex}
        images={images}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        productName={productName}
      />
    </>
  )
}

interface ProductGalleryGridProps {
  images: ProductImage[]
  productName: string
  imageRefs: React.RefObject<(HTMLButtonElement | null)[]>
  onImageClick: (index: number) => void
}

function ProductGalleryGrid({
  images,
  productName,
  imageRefs,
  onImageClick,
}: ProductGalleryGridProps) {
  if (images.length === 1) {
    return (
      <button
        type='button'
        onClick={() => onImageClick(0)}
        className='relative aspect-4/5 w-full cursor-zoom-in overflow-hidden bg-muted'>
        <Image
          src={images[0].url}
          alt={images[0].altText ?? `${productName} - 1`}
          fill
          className='object-cover transition-transform duration-300 hover:scale-102'
          priority
          sizes='(min-width: 1024px) 60vw, 100vw'
        />
      </button>
    )
  }

  // 残り枚数（1枚目を除く）が奇数かどうか
  const remainingCount = images.length - 1
  const isLastOdd = remainingCount % 2 === 1

  return (
    <div className='grid grid-cols-2 gap-4'>
      {images.map((image, index) => {
        const isFirst = index === 0
        const isLast = index === images.length - 1

        // 最初の画像、または最後が奇数余りの場合は大きく表示
        const isFullWidth = isFirst || (isLast && isLastOdd)

        return (
          <button
            key={image.url}
            ref={el => {
              imageRefs.current[index] = el
            }}
            type='button'
            onClick={() => onImageClick(index)}
            className={`relative cursor-zoom-in overflow-hidden bg-muted ${
              isFullWidth ? 'col-span-2 aspect-4/5' : 'aspect-4/5'
            }`}>
            <Image
              src={image.url}
              alt={image.altText ?? `${productName} - ${index + 1}`}
              fill
              className='object-cover transition-transform duration-300 hover:scale-102'
              priority={index < 4}
              loading={index >= 4 ? 'lazy' : undefined}
              sizes={
                isFullWidth
                  ? '(min-width: 1024px) 60vw, 100vw'
                  : '(min-width: 1024px) 30vw, 50vw'
              }
            />
          </button>
        )
      })}
    </div>
  )
}
