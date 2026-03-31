import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductRecommendations } from '@/lib/shopify'
import { formatPrice } from '@/utils/format/price'

interface RelatedProductsProps {
  productId: string
}

export async function RelatedProducts({ productId }: RelatedProductsProps) {
  const products = await getProductRecommendations(productId)

  if (products.length === 0) return null

  return (
    <section className='mt-16'>
      <h2 className='mb-6 font-bold text-2xl'>関連商品</h2>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {products.slice(0, 5).map(product => (
          <Link
            key={product.id}
            href={`/products/${product.handle}` as Route}
            className='group'>
            <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
              {product.featuredImage && (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  fill
                  className='object-cover transition-transform group-hover:scale-105'
                  sizes='(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw'
                />
              )}
            </div>
            <div className='mt-2'>
              <h3 className='line-clamp-2 font-medium text-sm'>
                {product.title}
              </h3>
              <p className='text-muted-foreground text-sm'>
                {formatPrice(
                  product.priceRange.maxVariantPrice.amount,
                  product.priceRange.maxVariantPrice.currencyCode,
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
