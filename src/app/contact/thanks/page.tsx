import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'お問い合わせ完了',
  description: 'お問い合わせを受け付けました。',
  robots: { index: false },
}

export default function ContactThanksPage() {
  return (
    <Main>
      <PageHeader title='Thank You' description='お問い合わせ完了' />
      <section className='py-16 md:py-24'>
        <Container>
          <div className='mx-auto max-w-xl text-center'>
            <p className='text-muted-foreground text-sm leading-loose md:text-base'>
              お問い合わせいただきありがとうございます。
              <br />
              内容を確認の上、折り返しご連絡いたします。
            </p>
            <div className='mt-10'>
              <Button render={<Link href='/' />}>
                トップページへ戻る
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Main>
  )
}
