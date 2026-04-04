import { CaretRightIcon } from '@phosphor-icons/react/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { FeaturedCollections } from '@/components/collection/featured-collections'
import { Container } from '@/components/layout/container'
import { SectionTitle } from '@/components/layout/section-title'
import { NewsList, NewsListSkeleton } from '@/components/news/news-list'
import {
  NewItemsCarousel,
  NewItemsCarouselSkeleton,
} from '@/components/product/new-items-carousel'
import {
  ProductList,
  ProductListSkeleton,
} from '@/components/product/product-list'
import { siteConfig } from '@/config/site.config'
import { HeroSection } from './_components/hero-section'

export const metadata: Metadata = {
  title: `${siteConfig.siteName} | ${siteConfig.siteSubTitle}`,
  description: siteConfig.siteDescription,
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section className='pt-24 pb-12'>
        <Container>
          <SectionTitle title='Concept' subtitle='コンセプト' />
          <div className='mt-12 text-center text-muted-foreground text-sm leading-loose md:text-base'>
            <p>
              こだわりのアイテムを通じて、ファンのみなさんとのつながりを
              <br className='hidden md:block' />
              大切にしていく場所です。
            </p>
            <p className='mt-6'>
              ここでしか手に入らない特別なグッズをお届けします。
            </p>
            <p className='mt-6'>
              ただのアイテムではなく、みなさんとのコミュニケーションをつなぐツールとして、
              <br className='hidden md:block' />
              遊び心のあるデザインやアート性のあるグッズもご用意しています。
            </p>
          </div>
        </Container>
      </section>
      <Suspense fallback={<NewItemsCarouselSkeleton />}>
        <NewItemsCarousel />
      </Suspense>
      <section className='py-24'>
        <Container>
          <SectionTitle title='Collections' subtitle='コレクション一覧' />
          <div className='mt-12'>
            <FeaturedCollections />
          </div>
        </Container>
      </section>
      <section className='py-24'>
        <Container>
          <SectionTitle title='Products' subtitle='商品一覧' />
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList />
          </Suspense>
          <div className='mt-12 flex justify-center'>
            <Link
              href='/collections/all'
              className='inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap border border-foreground bg-transparent px-6 py-3 font-en text-foreground text-sm transition-all duration-300 hover:bg-foreground hover:text-background md:w-fit'>
              View More
              <CaretRightIcon />
            </Link>
          </div>
        </Container>
      </section>
      <section className='py-24'>
        <Container>
          <SectionTitle title='News' subtitle='お知らせ' />
          <div className='mt-6'>
            <Suspense fallback={<NewsListSkeleton count={3} />}>
              <NewsList limit={3} />
            </Suspense>
          </div>
        </Container>
      </section>
    </main>
  )
}

