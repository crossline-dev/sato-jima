import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'
import { siteConfig } from '@/config/site.config'

const pageDescription = `${siteConfig.siteName}について。こだわりのアイテムを通じて、ファンのみなさんとのつながりを大切にしていく場所です。`

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
              こだわりのアイテムを通じて、ファンのみなさんとのつながりを
              <br className='hidden md:block' />
              大切にしていく場所です。
            </p>
            <p className='mt-8'>
              ここでしか手に入らない特別なグッズをお届けします。
            </p>
            <p className='mt-8'>
              ただのアイテムではなく、みなさんとのコミュニケーションをつなぐツールとして、
              <br className='hidden md:block' />
              遊び心のあるデザインやアート性のあるグッズもご用意しています。
            </p>
          </div>
        </Container>
      </section>
    </Main>
  )
}

