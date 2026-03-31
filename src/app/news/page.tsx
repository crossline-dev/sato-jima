import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'
import { NewsList, NewsListSkeleton } from '@/components/news/news-list'
import { siteConfig } from '@/config/site.config'

const pageTitle = 'お知らせ一覧'
const pageDescription =
  'TRIANGLE SHOPの最新のお知らせ・ニュースをお届けします。新商品情報やキャンペーン情報などをご確認いただけます。'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/news',
    siteName: siteConfig.siteName,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
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

export default function NewsPage() {
  return (
    <Main>
      <PageHeader
        title='News'
        description='最新のお知らせ・ニュースをお届けします。'
      />

      <section>
        <Container>
          <h2 className='sr-only'>お知らせ一覧</h2>
          <Suspense fallback={<NewsListSkeleton />}>
            <NewsList />
          </Suspense>
        </Container>
      </section>
    </Main>
  )
}
