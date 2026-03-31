import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description:
    'TRIANGLE SHOP へのお問い合わせはこちらから。商品に関するご質問やご要望など、お気軽にお問い合わせください。',
  openGraph: {
    title: 'お問い合わせ',
    description:
      'TRIANGLE SHOP へのお問い合わせはこちらから。商品に関するご質問やご要望など、お気軽にお問い合わせください。',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return (
    <Main>
      <PageHeader title='Contact' description='お問い合わせ' />
      <section className='py-16 md:py-24'>
        <Container>
          <div className='mx-auto max-w-xl'>
            <ContactForm />
          </div>
        </Container>
      </section>
    </Main>
  )
}
