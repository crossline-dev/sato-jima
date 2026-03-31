import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'ショッピングガイド',
  description:
    'TRIANGLE SHOPのショッピングガイドページです。ご注文方法やお支払い方法、配送、返品についてご確認いただけます。',
  openGraph: {
    title: 'ショッピングガイド',
    description:
      'TRIANGLE SHOPのショッピングガイドページです。ご注文方法やお支払い方法、配送、返品についてご確認いただけます。',
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/shopping-guide',
  },
}

export default function ShoppingGuidePage() {
  return (
    <Main>
      <PageHeader title='Shopping Guide' description='ショッピングガイド' />
      <Container className='py-12 md:py-20'>
        <div className='mx-auto max-w-3xl space-y-12 md:space-y-16'>
          {/* STEP 1 */}
          <section className='flex flex-col items-start gap-6 text-left'>
            <div className='flex flex-col items-start gap-4'>
              <span className='rounded-[2px] bg-heading px-3 py-1 font-en font-medium text-[10px] text-white tracking-widest'>
                STEP.1
              </span>
              <h2 className='font-bold text-heading text-xl'>商品の選択</h2>
            </div>
            <p className='text-sm leading-loose tracking-wide'>
              商品ページにて、ご希望の商品をカートに入れます。カート内の商品を確認し、問題なければ「購入手続き」ボタンを押して次の手順に進みます。
            </p>
          </section>

          {/* ARROW */}
          <div className='flex justify-center text-muted-foreground/30'>
            <span className='text-xs'>▼</span>
          </div>

          {/* STEP 2 */}
          <section className='flex flex-col items-start gap-6 text-left'>
            <div className='flex flex-col items-start gap-4'>
              <span className='rounded-[2px] bg-heading px-3 py-1 font-en font-medium text-[10px] text-white tracking-widest'>
                STEP.2
              </span>
              <h2 className='font-bold text-heading text-xl'>お届け先の入力</h2>
            </div>
            <div className='flex flex-col items-start gap-2'>
              <p className='text-sm leading-loose tracking-wide'>
                以下の情報をご入力ください。
              </p>
              <ul className='text-sm leading-loose tracking-wide'>
                <li>・ご連絡先メールアドレス</li>
                <li>・お届け先ご住所</li>
              </ul>
            </div>
          </section>

          {/* ARROW */}
          <div className='flex justify-center text-muted-foreground/30'>
            <span className='text-xs'>▼</span>
          </div>

          {/* STEP 3 */}
          <section className='flex flex-col items-start gap-6 text-left'>
            <div className='flex flex-col items-start gap-4'>
              <span className='rounded-[2px] bg-heading px-3 py-1 font-en font-medium text-[10px] text-white tracking-widest'>
                STEP.3
              </span>
              <h2 className='font-bold text-heading text-xl'>
                お支払い方法の選択
              </h2>
            </div>
            <div className='flex flex-col items-start gap-6'>
              <p className='text-sm leading-loose tracking-wide'>
                以下のお支払い方法がご利用いただけます。
              </p>
              <div className='grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3'>
                <div className='space-y-3 font-en'>
                  <p className='font-bold text-heading text-xs uppercase tracking-wider'>
                    Credit Card
                  </p>
                  <ul className='space-y-1 text-muted-foreground text-sm leading-loose tracking-wide'>
                    <li>VISA / MasterCard</li>
                    <li>JCB / American Express</li>
                  </ul>
                </div>
                <div className='space-y-3'>
                  <p className='font-bold text-heading text-xs uppercase tracking-wider'>
                    Digital Wallet
                  </p>
                  <ul className='space-y-1 text-muted-foreground text-sm leading-loose tracking-wide'>
                    <li>Apple Pay</li>
                    <li>Google Pay</li>
                  </ul>
                </div>
                <div className='space-y-3'>
                  <p className='font-bold text-heading text-xs uppercase tracking-wider'>
                    Others
                  </p>
                  <ul className='space-y-1 text-muted-foreground text-sm leading-loose tracking-wide'>
                    <li>銀行振込</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ARROW */}
          <div className='flex justify-center text-muted-foreground/30'>
            <span className='text-xs'>▼</span>
          </div>

          {/* STEP 4 */}
          <section className='flex flex-col items-start gap-6 text-left'>
            <div className='flex flex-col items-start gap-4'>
              <span className='rounded-[2px] bg-heading px-3 py-1 font-en font-medium text-[10px] text-white tracking-widest'>
                STEP.4
              </span>
              <h2 className='font-bold text-heading text-xl'>購入の完了</h2>
            </div>
            <p className='text-sm leading-loose tracking-wide'>
              ご入力内容に間違いがなければ「支払う」ボタンを押してください。
              <br />
              ご購入の前に、
              <Link
                href='/terms-of-service'
                className='underline decoration-1 decoration-dotted underline-offset-4'>
                利用規約
              </Link>
              ・
              <Link
                href='/privacy-policy'
                className='underline decoration-1 decoration-dotted underline-offset-4'>
                プライバシーポリシー
              </Link>
              を必ずご確認ください。
            </p>
          </section>
        </div>
      </Container>
    </Main>
  )
}
