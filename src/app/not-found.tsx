import { CaretRightIcon } from '@phosphor-icons/react/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'

export const metadata: Metadata = {
  title: 'ページが見つかりません',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <Main>
      <Container>
        <div className='flex flex-col justify-center gap-12 py-14 md:gap-16 md:pb-0'>
          <hgroup className='text-center md:text-left'>
            <h2 className='font-en font-medium text-xl md:text-5xl'>
              404 - Not Found
            </h2>
            <p className='mt-2 text-muted-foreground text-xs md:mt-6 md:text-lg'>
              ページが見つかりませんでした。
            </p>
          </hgroup>
          <p className='text-sm leading-loose tracking-wide'>
            申し訳ございません。
            <br />
            お探しのページは見つかりませんでした。
          </p>
          <Link
            href='/'
            className='flex h-12 w-full items-center justify-center gap-2 border-0 bg-heading px-6 py-3 font-en font-medium text-background md:max-w-fit'>
            <span>Back to Home</span>
            <CaretRightIcon weight='light' className='size-5' />
          </Link>
        </div>
      </Container>
    </Main>
  )
}
