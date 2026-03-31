import { Container } from '@/components/layout/container'
import type { GetCollectionQuery } from '@/lib/shopify/generated/graphql'

type Collection = NonNullable<GetCollectionQuery['collection']>

interface CollectionHeaderProps {
  collection: Collection
  productCount: number
}

export function CollectionHeader({
  collection,
  productCount,
}: CollectionHeaderProps) {
  const { title } = collection

  return (
    <section className='border-y py-6 md:py-12'>
      <Container>
        <hgroup className='flex flex-col items-center gap-2 font-en'>
          <h1 className='font-medium text-heading text-lg'>{title}</h1>
          <p className='text-muted-foreground text-sm'>
            {productCount} products
          </p>
        </hgroup>
      </Container>
    </section>
  )
}
