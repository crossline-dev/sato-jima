import { CaretRightIcon } from '@phosphor-icons/react/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { FeaturedCollections } from '@/components/collection/featured-collections'
import { Container } from '@/components/layout/container'
import { SectionTitle } from '@/components/layout/section-title'
import { ThreeLine } from '@/components/layout/three-line'
import { NewsList, NewsListSkeleton } from '@/components/news/news-list'
import {
  NewItemsCarousel,
  NewItemsCarouselSkeleton,
} from '@/components/product/new-items-carousel'
import {
  ProductList,
  ProductListSkeleton,
} from '@/components/product/product-list'
import { AnimationImage } from './_components/animation-image'
import { HeroSection } from './_components/hero-section'

export const metadata: Metadata = {
  title: 'TRIANGLE SHOP | 佐藤三兄弟 公式グッズショップ',
  description:
    '佐藤三兄弟の公式グッズ販売サイト。オリジナルベアやイベントグッズ、アパレルなど、三兄弟それぞれの個性と世界観を楽しんでいただけるアイテムをご用意しています。',
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ThreeLine />
      <section className='pt-24 pb-12'>
        <Container>
          <SectionTitle title='Concept' subtitle='コンセプト' />
          <div className='mt-12 text-center text-muted-foreground text-sm leading-loose md:text-base'>
            <p>
              佐藤三兄弟のグッズ販売サイトは、ファンのみなさんとのつながりを大切にしながら
              <br className='hidden md:block' />
              三兄弟それぞれの個性と世界観を楽しんでいただける場所です。
            </p>
            <p className='mt-6'>
              三人の魅力が交わることで生まれる特別な世界を、グッズを通して感じていただけます。
            </p>
            <p className='mt-6'>
              ただのアイテムではなく、みなさんとのコミュニケーションをつなぐツールとして、
              <br className='hidden md:block' />
              遊び心のあるデザインやアート性のあるグッズもご用意しています。
            </p>
          </div>
        </Container>
      </section>
      <AnimationImage />
      <ThreeLine />
      <Suspense fallback={<NewItemsCarouselSkeleton />}>
        <NewItemsCarousel />
      </Suspense>
      <ThreeLine />
      <section className='py-24'>
        <Container>
          <SectionTitle title='Collections' subtitle='コレクション一覧' />
          <div className='mt-12'>
            <FeaturedCollections />
          </div>
        </Container>
      </section>
      <ThreeLine />
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
      <ThreeLine />
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
