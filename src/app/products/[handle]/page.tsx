import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { JsonLd } from '@/components/json-ld'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { siteConfig } from '@/config/site.config'
import { robotsWithGooglePreview } from '@/lib/metadata/robots-metadata'
import { getProduct } from '@/lib/shopify'
import { HIDDEN_PRODUCT_TAG } from '@/lib/shopify/constants'
import { parseJsonMetafield } from '@/utils/parse-metafield'
import { ProductGalleryMobile } from './_components/product-gallery'
import { ProductGalleryDesktop } from './_components/product-gallery-desktop'
import { ProductGallerySkeleton } from './_components/product-gallery-skeleton'
import { ProductInfo } from './_components/product-info'
import { ProductInfoSkeleton } from './_components/product-info-skeleton'

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return {
      title: '商品が見つかりません',
      robots: robotsWithGooglePreview({ index: false }),
    }
  }

  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG)
  const title = product.seo?.title ?? product.title

  // SEO用説明文の構築:
  // 1. 冒頭に定型文を挿入
  // 2. 素材やサイズ情報がある場合は補足する
  let description = `${siteConfig.siteName}の商品 ${product.title}です。${product.seo?.description ?? product.description}`

  const dimensionsStr = parseJsonMetafield(product.dimensions?.value)

  const extraInfo = [
    product.materials?.value ? `素材: ${product.materials.value}` : null,
    dimensionsStr ? `サイズ: ${dimensionsStr}` : null,
  ]
    .filter(Boolean)
    .join(' / ')

  if (extraInfo) {
    description = `${description} ${extraInfo}`.trim()
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${handle}`,
    },
    robots: robotsWithGooglePreview({ index: indexable }),
    openGraph: {
      title,
      description,
      url: `/products/${handle}`,
      type: 'website',
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width ?? undefined,
              height: product.featuredImage.height ?? undefined,
              alt: product.featuredImage.altText ?? product.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.featuredImage ? [product.featuredImage.url] : undefined,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  // JSON-LD 構造化データ
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    material: product.materials?.value,
    size: parseJsonMetafield(product.dimensions?.value),
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
    },
  }

  // 画像一覧をフラット化
  const images = product.images.edges.map(edge => edge.node)

  return (
    <Main>
      <JsonLd data={productJsonLd} />
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/collections/all' },
            { label: product.title },
          ]}
        />

        <div className='lg:grid lg:grid-cols-[1fr_minmax(22.5rem,25rem)] lg:gap-12'>
          {/* SP: カルーセル表示 */}
          <Suspense fallback={<ProductGallerySkeleton />}>
            <ProductGalleryMobile
              images={images}
              productName={product.title}
              variants={product.variants.edges.map(edge => edge.node)}
              options={product.options}
            />
          </Suspense>

          {/* PC: グリッド表示 */}
          <ProductGalleryDesktop
            images={images}
            productName={product.title}
            variants={product.variants.edges.map(edge => edge.node)}
            options={product.options}
          />

          {/* 商品情報（PC: sticky固定） */}
          <div className='mt-8 lg:sticky lg:top-24 lg:mt-0 lg:self-start'>
            <Suspense fallback={<ProductInfoSkeleton />}>
              <ProductInfo product={product} />
            </Suspense>
          </div>
        </div>
      </Container>
    </Main>
  )
}
