import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { ProductGridSkeleton } from '@/components/product/product-grid'
import { Skeleton } from '@/components/ui/skeleton'

export default function CollectionDetailLoading() {
  return (
    <Main>
      {/* ヘッダー Skeleton */}
      <section className='border-y py-6 md:py-12'>
        <Container>
          <div className='flex flex-col items-center gap-2'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-4 w-20' />
          </div>
        </Container>
      </section>

      {/* 商品グリッド Skeleton */}
      <section className='py-6 md:py-12'>
        <Container>
          <ProductGridSkeleton count={9} />
        </Container>
      </section>
    </Main>
  )
}
