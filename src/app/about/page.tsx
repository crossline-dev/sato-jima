import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'
import { siteConfig } from '@/config/site.config'

const pageDescription = `${siteConfig.siteName}について。こちらは仮のモックテキストです。`

export const metadata: Metadata = {
  title: 'About',
  description: pageDescription,
  openGraph: {
    title: 'About',
    description: pageDescription,
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <Main>
      <PageHeader title='About' description='私たちについて' />
      <section className='py-16 md:py-24'>
        <Container>
          <div className='mx-auto max-w-3xl text-center text-muted-foreground text-sm leading-loose md:text-base'>
            <p>
              こちらはモック用の仮テキストです。実際の公開時には、
              <br className='hidden md:block' />
              正式なコンセプト文に差し替わります。
            </p>
            <p className='mt-8'>
              現在はレイアウト確認のためのダミー文を表示しています。
            </p>
            <p className='mt-8'>
              この段落も仮の文章です。文量や改行バランスを確認するために、
              <br className='hidden md:block' />
              一時的にプレースホルダーを配置しています。
            </p>
          </div>
        </Container>
      </section>
    </Main>
  )
}

