import type { Metadata } from 'next'
import { FeaturedCollections } from '@/components/collection/featured-collections'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'
import { siteConfig } from '@/config/site.config'

const pageTitle = 'コレクション一覧'
const pageDescription =
  'TRIANGLE SHOPの商品コレクション一覧です。カテゴリ別に商品をお探しいただけます。'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/collections',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/collections',
    siteName: siteConfig.siteName,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
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

export default function CollectionsPage() {
  return (
    <Main>
      <PageHeader title='Our collections' description={<>3 collections</>} />
      <section className='py-6 md:py-12'>
        <Container>
          <div className='mt-8 md:mt-12'>
            <FeaturedCollections />
          </div>
        </Container>
      </section>
    </Main>
  )
}
