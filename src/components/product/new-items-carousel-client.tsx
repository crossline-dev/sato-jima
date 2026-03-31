'use client'

import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react/ssr'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import type { GetCollectionProductsQuery } from '@/lib/shopify/generated/graphql'
import { ProductCard } from './product-card'

type Product = NonNullable<
  NonNullable<
    NonNullable<GetCollectionProductsQuery['collection']>['products']['edges']
  >[number]
>['node']

interface NewItemsCarouselClientProps {
  products: Product[]
}

export function NewItemsCarouselClient({
  products,
}: NewItemsCarouselClientProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(true)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('select', onSelect)
    api.on('reInit', onSelect)
  }, [api, onSelect])

  return (
    <div className='mt-2 w-full'>
      {/* PC: Grid Layout (3 columns) */}
      <div className='hidden md:grid md:grid-cols-3 md:gap-x-4 md:gap-y-8 xl:gap-x-6 xl:gap-y-10'>
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Mobile: Carousel Layout (1.5 items) with Snap and Custom Nav */}
      <div className='md:hidden'>
        <div className='mb-6 flex justify-end gap-2'>
          <Button
            variant='ghost'
            size='icon'
            className='size-8 rounded-full border border-border'
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}>
            <ArrowLeftIcon size={16} />
            <span className='sr-only'>Previous</span>
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='size-8 rounded-full border border-border'
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}>
            <ArrowRightIcon size={16} />
            <span className='sr-only'>Next</span>
          </Button>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            containScroll: 'trimSnaps',
            dragFree: false,
          }}
          className='w-full'>
          <CarouselContent className='-ml-4'>
            {products.map((product, index) => (
              <CarouselItem key={product.id} className='basis-[65%] pl-4'>
                <ProductCard product={product} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
