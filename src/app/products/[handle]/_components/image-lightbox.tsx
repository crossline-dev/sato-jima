'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import { cn } from '@/utils/classes'

interface ProductImage {
  url: string
  altText?: string | null
  width?: number | null
  height?: number | null
}

interface ImageLightboxProps {
  images: ProductImage[]
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
  productName: string
}

export function ImageLightbox({
  images,
  initialIndex,
  open,
  onOpenChange,
  productName,
}: ImageLightboxProps) {
  // open時には親からkey={initialIndex}でリマウントされるため、初期値が正しく反映される
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // キーボードナビゲーション
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, goToPrevious, goToNext])

  if (images.length === 0) return null

  const currentImage = images[currentIndex]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className='bg-white/90 backdrop-blur-sm' />
        <DialogPrimitive.Content
          className='fixed inset-0 z-50 flex items-center justify-center focus:outline-none'
          aria-describedby={undefined}>
          <DialogPrimitive.Title className='sr-only'>
            {productName} - 画像 {currentIndex + 1} / {images.length}
          </DialogPrimitive.Title>

          {/* 閉じるボタン */}
          <DialogClose className='absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-black/5 p-2 text-black transition-colors hover:bg-black/10'>
            <X className='size-6' strokeWidth={1.2} />
            <span className='sr-only'>閉じる</span>
          </DialogClose>

          {/* 前へボタン */}
          {images.length > 1 && (
            <button
              type='button'
              onClick={goToPrevious}
              className='absolute left-4 z-10 cursor-pointer rounded-full bg-black/5 p-3 text-black transition-colors hover:bg-black/10'
              aria-label='前の画像'>
              <ChevronLeft className='size-8' strokeWidth={1.2} />
            </button>
          )}

          {/* メイン画像 */}
          <div className='relative h-[80vh] w-[90vw] max-w-5xl'>
            <Image
              src={currentImage.url}
              alt={
                currentImage.altText ?? `${productName} - ${currentIndex + 1}`
              }
              fill
              className='object-contain'
              sizes='90vw'
              priority
            />
          </div>

          {/* 次へボタン */}
          {images.length > 1 && (
            <button
              type='button'
              onClick={goToNext}
              className='absolute right-4 z-10 cursor-pointer rounded-full bg-black/5 p-3 text-black transition-colors hover:bg-black/10'
              aria-label='次の画像'>
              <ChevronRight className='size-8' strokeWidth={1.2} />
            </button>
          )}

          {/* インジケーター */}
          {images.length > 1 && (
            <div className='absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2'>
              {images.map((_, index) => (
                <button
                  key={images[index].url}
                  type='button'
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'size-2 cursor-pointer rounded-full transition-colors',
                    index === currentIndex
                      ? 'bg-black'
                      : 'bg-black/20 hover:bg-black/40',
                  )}
                  aria-label={`画像 ${index + 1}`}
                />
              ))}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
