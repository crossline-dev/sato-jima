import { Container } from '@/components/layout/container'
import { SectionTitle } from '@/components/layout/section-title'
import { Skeleton } from '@/components/ui/skeleton'
import { getCollectionProducts } from '@/lib/shopify'
import { NewItemsCarouselClient } from './new-items-carousel-client'

/**
 * 新着商品カルーセルのスケルトン表示
 */
export function NewItemsCarouselSkeleton() {
  return (
    <section className='overflow-hidden py-24'>
      <Container>
        <SectionTitle title='New Items' subtitle='新着商品' />
        {/* PC Skeleton: 3 columns */}
        <div className='mt-12 hidden md:grid md:grid-cols-3 md:gap-x-4 md:gap-y-8 xl:gap-x-6 xl:gap-y-10'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex flex-col'>
              <Skeleton className='aspect-3/4 w-full' />
              <div className='flex flex-col pt-3'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='mt-1 h-4 w-1/3' />
              </div>
            </div>
          ))}
        </div>
        {/* Mobile Skeleton: Carousel look (1.2 items) */}
        <div className='mt-12 -ml-4 flex md:hidden'>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className='shrink-0 basis-[82%] pl-4'>
              <div className='flex flex-col'>
                <Skeleton className='aspect-3/4 w-full' />
                <div className='flex flex-col pt-3'>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='mt-1 h-4 w-1/3' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/**
 * 新着商品カルーセル (サーバーコンポーネント)
 */
export async function NewItemsCarousel() {
  const products = await getCollectionProducts('new-items')
  const displayProducts = products.slice(0, 10)

  if (displayProducts.length === 0) {
    return null
  }

  return (
    <section className='overflow-hidden py-24'>
      <Container>
        <div className='flex flex-col items-center justify-between gap-4'>
          <SectionTitle title='New Items' subtitle='新着商品' />
          <NewItemsCarouselClient products={displayProducts} />
        </div>
      </Container>
    </section>
  )
}
