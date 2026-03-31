import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'About',
  description:
    '佐藤三兄弟のグッズ販売サイトについて。ファンのみなさんとのつながりを大切にしながら、三兄弟それぞれの個性と世界観を楽しんでいただける場所です。',
  openGraph: {
    title: 'About',
    description:
      '佐藤三兄弟のグッズ販売サイトについて。ファンのみなさんとのつながりを大切にしながら、三兄弟それぞれの個性と世界観を楽しんでいただける場所です。',
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
              佐藤三兄弟のグッズ販売サイトは、ファンのみなさんとのつながりを大切にしながら
              <br className='hidden md:block' />
              三兄弟それぞれの個性と世界観を楽しんでいただける場所です。
            </p>
            <p className='mt-8'>
              三人の魅力が交わることで生まれる特別な世界を、グッズを通して感じていただけます。
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
