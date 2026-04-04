import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { Skeleton } from '@/components/ui/skeleton'

export default function CollectionsLoading() {
  return (
    <Main>
      {/* PageHeader スケルトン */}
      <section className='border-y py-6 md:py-12'>
        <Container>
          <div className='flex flex-col items-center gap-2'>
            <Skeleton className='h-7 w-40' />
            <Skeleton className='h-5 w-24' />
          </div>
        </Container>
      </section>

      {/* FeaturedCollections スケルトン */}
      <section className='py-6 md:py-12'>
        <Container>
          <div className='mt-8 md:mt-12'>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-12'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`collection-skeleton-${i}`}
                  className='flex flex-col items-center'
                  style={{ aspectRatio: '304 / 264' }}>
                  <Skeleton className='h-full w-full' />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </Main>
  )
}
