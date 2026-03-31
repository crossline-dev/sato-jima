import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CollectionHeader } from '@/components/collection/collection-header'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { ProductCard } from '@/components/product/product-card'
import { ProductGrid } from '@/components/product/product-grid'
import { siteConfig } from '@/config/site.config'
import {
  getAllCollectionHandles,
  getCollection,
  getCollectionProducts,
} from '@/lib/shopify/collections-api'
import { HIDDEN_PRODUCT_TAG } from '@/lib/shopify/constants'

interface CollectionPageProps {
  params: Promise<{ handle: string }>
}

export async function generateStaticParams() {
  const handles = await getAllCollectionHandles()
  // "all" を追加して全商品ページも静的生成
  return [
    { handle: 'all' },
    ...handles.map(handle => ({
      handle,
    })),
  ]
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params

  // "all" の場合は全商品ページ
  if (handle === 'all') {
    const allProductsTitle = 'すべての商品'
    const allProductsDescription = `${siteConfig.siteName}の全商品一覧です。すべてのアイテムをご覧いただけます。`

    return {
      title: allProductsTitle,
      description: allProductsDescription,
      alternates: {
        canonical: '/collections/all',
      },
      openGraph: {
        title: allProductsTitle,
        description: allProductsDescription,
        url: '/collections/all',
        siteName: siteConfig.siteName,
        locale: 'ja_JP',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: allProductsTitle,
        description: allProductsDescription,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  }

  const collection = await getCollection(handle)

  if (!collection) {
    return {
      title: 'コレクションが見つかりません',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = collection.seo?.title || collection.title
  const description =
    collection.seo?.description ||
    collection.description ||
    `${collection.title}の商品一覧です。${siteConfig.siteName}でお買い求めいただけます。`

  // コレクション画像をOG画像として使用
  const ogImages = collection.image
    ? [
        {
          url: collection.image.url,
          width: collection.image.width ?? 1200,
          height: collection.image.height ?? 630,
          alt: collection.image.altText || collection.title,
        },
      ]
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: `/collections/${handle}`,
    },
    openGraph: {
      title,
      description,
      url: `/collections/${handle}`,
      siteName: siteConfig.siteName,
      locale: 'ja_JP',
      type: 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: collection.image ? [collection.image.url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params

  // "all" の場合は全商品を表示
  if (handle === 'all') {
    const allProducts = await getCollectionProducts('all')
    const products = allProducts.filter(
      p => !p.tags.includes(HIDDEN_PRODUCT_TAG),
    )

    return (
      <Main>
        <section className='border-y py-6 md:py-12'>
          <Container>
            <hgroup className='flex flex-col items-center gap-2 font-en'>
              <h1 className='font-medium text-heading text-lg'>All Products</h1>
              <p className='text-muted-foreground text-sm'>
                {products.length} products
              </p>
            </hgroup>
          </Container>
        </section>
        <section className='py-6 md:py-12'>
          <Container>
            {products.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-24'>
                <p className='font-en text-2xl text-muted-foreground tracking-widest'>
                  Coming soon...
                </p>
              </div>
            ) : (
              <ProductGrid>
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    priority={index < 4}
                  />
                ))}
              </ProductGrid>
            )}
          </Container>
        </section>
      </Main>
    )
  }

  const [collection, allProducts] = await Promise.all([
    getCollection(handle),
    getCollectionProducts(handle),
  ])

  if (!collection) {
    notFound()
  }

  const products = allProducts.filter(
    p => !p.tags.includes(HIDDEN_PRODUCT_TAG),
  )

  return (
    <Main>
      <CollectionHeader
        collection={collection}
        productCount={products.length}
      />
      <section className='mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
        {products.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24'>
            <p className='font-en text-2xl text-muted-foreground tracking-widest'>
              Coming soon...
            </p>
          </div>
        ) : (
          <ProductGrid>
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                priority={index < 4}
              />
            ))}
          </ProductGrid>
        )}
      </section>
    </Main>
  )
}
