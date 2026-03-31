import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記',
  description:
    'TRIANGLE SHOPの特定商取引法に基づく表記ページです。当サイトをご利用いただく前に、利用条件をご確認ください。',
  openGraph: {
    title: '特定商取引法に基づく表記',
    description:
      'TRIANGLE SHOPの特定商取引法に基づく表記ページです。当サイトをご利用いただく前に、利用条件をご確認ください。',
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/terms-of-sale',
  },
}

export default function TermsOfSalePage() {
  return (
    <Main>
      <PageHeader
        title='Terms of Sale'
        description='特定商取引法に基づく表記'
      />
      <Container className='py-12 md:py-20'>
        <div className='mx-auto max-w-4xl'>
          <dl className='space-y-6 md:space-y-8'>
            <div className='flex flex-col md:flex-row md:items-start md:gap-12'>
              <dt className='shrink-0 font-bold text-heading text-xs uppercase tracking-wider md:w-64 md:py-1'>
                販売業者
              </dt>
              <dd className='mt-2 text-sm leading-loose tracking-wide md:mt-0'>
                株式会社オーサム
              </dd>
            </div>

            <div className='flex flex-col md:flex-row md:items-start md:gap-12'>
              <dt className='shrink-0 font-bold text-heading text-xs uppercase tracking-wider md:w-64 md:py-1'>
                代表責任者
              </dt>
              <dd className='mt-2 text-sm leading-loose tracking-wide md:mt-0'>
                渡辺有希子
              </dd>
            </div>

            <div className='flex flex-col md:flex-row md:items-start md:gap-12'>
              <dt className='shrink-0 font-bold text-heading text-xs uppercase tracking-wider md:w-64 md:py-1'>
                事業者の所在地
              </dt>
              <dd className='mt-2 text-sm leading-loose tracking-wide md:mt-0'>
                〒151-0071 東京都渋谷区本町1-4-16 ガイア初台6F
              </dd>
            </div>

            <div className='flex flex-col md:flex-row md:items-start md:gap-12'>
              <dt className='shrink-0 font-bold text-heading text-xs uppercase tracking-wider md:w-64 md:py-1'>
                事業者の連絡先
              </dt>
              <dd className='mt-2 space-y-2 text-sm leading-loose tracking-wide md:mt-0'>
                <p>メール: info@dot-at.com</p>
                <p>電話: 03-6300-5202</p>
                <p className='text-muted-foreground text-xs'>
                  ※お電話でのお問い合わせはお受けしておりません。
                </p>
              </dd>
            </div>

            <div className='flex flex-col md:flex-row md:items-start md:gap-12'>
              <dt className='shrink-0 font-bold text-heading text-xs uppercase tracking-wider md:w-64 md:py-1'>
                営業時間・定休日
              </dt>
              <dd className='mt-2 space-y-1 text-sm leading-loose tracking-wide md:mt-0'>
                <p>営業時間: 11:00 ~ 17:00</p>
                <p>定休日: 土日祝祭日、年末年始</p>
              </dd>
            </div>

            <div className='flex flex-col md:flex-row md:items-start md:gap-12'>
              <dt className='shrink-0 font-bold text-heading text-xs uppercase tracking-wider md:w-64 md:py-1'>
                販売価格
              </dt>
              <dd className='mt-2 text-sm leading-loose tracking-wide md:mt-0'>
                販売価格は、税込み表記となっております。また、別途配送料が掛かる場合もございます。
              </dd>
            </div>

            <div className='flex flex-col md:flex-row md:items-start md:gap-12'>
              <dt className='shrink-0 font-bold text-heading text-xs uppercase tracking-wider md:w-64 md:py-1'>
                お支払方法
              </dt>
              <dd className='mt-2 space-y-1 text-sm leading-loose tracking-wide md:mt-0'>
                <ul className='list-inside list-disc space-y-1'>
                  <li>クレジットカードによる決済</li>
                  <li>atone 翌月払い（コンビニ/口座振替）による決済</li>
                  <li>後払い（コンビニ/銀行ATM）による決済</li>
                  <li>Apple Pay、Google Payによる決済</li>
                  <li>銀行振込</li>
                </ul>
              </dd>
            </div>

            <div className='flex flex-col md:flex-row md:items-start md:gap-12'>
              <dt className='shrink-0 font-bold text-heading text-xs uppercase tracking-wider md:w-64 md:py-1'>
                お支払時期
              </dt>
              <dd className='mt-2 text-sm leading-loose tracking-wide md:mt-0'>
                商品注文確定時にお支払いが確定いたします。
              </dd>
            </div>

            <div className='flex flex-col md:flex-row md:items-start md:gap-12'>
              <dt className='shrink-0 font-bold text-heading text-xs uppercase tracking-wider md:w-64 md:py-1'>
                商品の引渡時期
              </dt>
              <dd className='mt-2 text-sm leading-loose tracking-wide md:mt-0'>
                各シーズン、商品により異なります。各商品詳細ページをご確認ください。
              </dd>
            </div>

            <div className='flex flex-col md:flex-row md:items-start md:gap-12'>
              <dt className='shrink-0 font-bold text-heading text-xs uppercase tracking-wider md:w-64 md:py-1'>
                返品・交換
              </dt>
              <dd className='mt-2 text-sm leading-loose tracking-wide md:mt-0'>
                商品に欠陥がある場合をのぞき、基本的には返品には応じません。但し、受注生産販売品等については、この限りではなく、弊社に商品納品後の発送となります。
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </Main>
  )
}
