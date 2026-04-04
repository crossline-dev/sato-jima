import type { Metadata } from 'next'
import { siteConfig } from '@/config/site.config'

const pageDescription = `${siteConfig.siteName}の利用規約ページです。当サイトをご利用いただく前に、利用条件をご確認ください。`

export const metadata: Metadata = {
  title: '利用規約',
  description: pageDescription,
  openGraph: {
    title: '利用規約',
    description: pageDescription,
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/terms-of-use',
  },
}

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'

export default function TermsOfUsePage() {
  return (
    <Main>
      <PageHeader title='Terms of Use' description='利用規約' />
      <Container className='py-12 md:py-20'>
        <div className='mx-auto max-w-3xl space-y-12'>
          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>1.</span> 利用規約の同意
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              お客様は、本サービス利用時に本規約に同意したものとみなします。無断で本サービスの内容を転載・複製・送信することを禁止します。また、当社は事前通知なく情報を削除する場合がありますが、情報の監視・削除義務はありません。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>2.</span> 第三者の権利を守る義務
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              本サービスに関して、当社や他の第三者の権利を侵害する行為は禁止です。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>3.</span> 個人情報の取り扱い
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              当社はプライバシーポリシーに従って個人情報を適切に管理します。詳しくは
              <Link
                href='/privacy-policy'
                className='underline decoration-1 decoration-dotted underline-offset-4'>
                プライバシーポリシー
              </Link>
              をご確認ください。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>4.</span> 情報の保証
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              本サービスの情報について、完全性・正確性・有用性などの保証は行いません。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>5.</span> 責任の制限
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              本サービスの利用による他の利用者や第三者への損害について、当社は一切の責任を負いません。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>6.</span> 権利・義務の譲渡制限
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              お客様は、本規約に基づく権利や義務を第三者に移転・譲渡することはできません。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>7.</span> サービス内容の変更
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              当社は、本サービスを予告なく変更・中止・終了することがあります。これにより生じた損害についても責任を負いません。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>8.</span> 規約変更の承認
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              当社は、本サービス画面上で変更内容を表示することにより、いつでも利用規約を変更でき、お客様はその後の利用により変更を承諾したとみなされます。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>9.</span> 利用者の責任
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              お客様は、公序良俗を守り、すべてご自身の責任で本サービスを利用してください。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>10.</span> 損害賠償
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              お客様が本規約に違反し、当社に損害を与えた場合、当社は相応の損害賠償を請求することができます。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>11.</span> 商品の返品・交換
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              商品の返品や交換は、配送中の破損や商品不良、誤送など当社に責任がある場合に限り可能です。代品の交換が難しい場合は、ご購入金額を返金いたします。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>12.</span> 注文の取り消し
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              ご注文確定後、お客様都合による注文の取り消しはできませんので、予めご了承ください。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>13.</span> 紛争解決
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              疑義や争いが生じた場合、誠意をもって協議しますが、解決しない場合は東京地方裁判所を管轄裁判所とします。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>14.</span> 未定事項
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              本規約にない事項については、別途当社が定める内容に従います。
            </p>
          </section>

          <section className='space-y-6'>
            <h2 className='font-medium text-base text-heading'>
              <span className='font-en'>15.</span> 規約の一部が無効な場合
            </h2>
            <p className='text-sm leading-loose tracking-wide'>
              本規約の一部が無効であっても、その他の規定は有効です。
            </p>
          </section>
        </div>
      </Container>

      <section className='border-y bg-muted/5 py-6 md:py-12'>
        <Container>
          <div className='flex flex-col items-center gap-2 text-center font-en'>
            <h2 className='font-medium text-heading text-lg tracking-wider'>
              Membership Terms
            </h2>
            <p className='text-muted-foreground text-sm'>会員規約</p>
          </div>
        </Container>
      </section>

      <Container className='py-12 md:py-20'>
        <div className='mx-auto max-w-3xl space-y-12'>
          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>1.</span> 適用範囲と変更
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              本規約は、当社と「利用者」に適用され、当社は事前の同意なしに変更できます。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>2.</span> 会員の定義
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              会員とは、規約を承認し、登録手続きを行った方です。未成年者は法定代理人の同意が必要です。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>3.</span> サービス利用
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              利用者は本規約に従いサービスを利用し、当社は内容を変更できる権利があります。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>4.</span> 利用者
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              「利用者」は本サービスを利用する方で、利用した時点で規約に同意したものとみなされます。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>5.</span> 会員登録
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              サービス利用には会員登録が必要な場合があります。過去に問題があった方は登録を拒否されることがあります。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>6.</span> 認証
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              会員はメールアドレスとパスワードを登録し、これにより本人認証が行われます。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>7.</span> 情報管理
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              会員は登録情報の変更があれば速やかに通知し、メールアドレスとパスワードは自己責任で管理します。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>8.</span> 提供サービス
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              提供されるサービスには物品販売や情報提供が含まれます。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>9.</span> 特典
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              会員確認ができない場合、特典は受けられません。特典は譲渡や換金ができず、変更されることがあります。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>10.</span> 退会
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              会員は退会を希望する場合、当社に申請できます。退会後のデータや特典は戻りません。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>11.</span> 利用停止
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              規約違反などの場合、サービス利用が停止されることがあります。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>12.</span> 禁止事項
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              虚偽の登録や運営を妨げる行為は禁止されています。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>13.</span> 個人情報
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              会員の個人情報は法令に従い取り扱われます。
            </p>
          </section>

          <section className='space-y-6'>
            <h3 className='font-medium text-base text-heading'>
              <span className='font-en'>14.</span> 規約変更
            </h3>
            <p className='text-sm leading-loose tracking-wide'>
              本規約は予告なく変更されることがあります。
            </p>
          </section>

          <section className='border-t pt-12 text-muted-foreground text-xs leading-loose'>
            <p>
              付則：本規約は 2026 年 2 月 1
              日から全ての利用者に適用されるものとします。
            </p>
          </section>
        </div>
      </Container>
    </Main>
  )
}
