import { getProducts } from '@/lib/shopify'
import { ProductCard } from './product-card'
import { ProductGrid, ProductGridSkeleton } from './product-grid'

/**
 * ProductListのスケルトンコンポーネント
 */
export function ProductListSkeleton() {
  return <ProductGridSkeleton count={12} className='my-12' />
}

export async function ProductList() {
  const products = await getProducts({ first: 6 })

  if (products.length === 0) {
    return (
      <div className='py-20 text-center'>
        <p className='text-muted-foreground'>商品は見つかりませんでした。</p>
      </div>
    )
  }

  return (
    <ProductGrid className='my-12'>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          priority={index < 4}
        />
      ))}
    </ProductGrid>
  )
}
