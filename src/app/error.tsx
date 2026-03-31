'use client'

import { ArrowClockwiseIcon, CaretRightIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 実際には Sentry などのログサービスに送る
    console.error('Unhandled runtime error:', error)
  }, [error])

  return (
    <Main>
      <Container>
        <div className='flex flex-col justify-center gap-12 py-14 md:gap-16 md:pb-0'>
          <hgroup className='text-center md:text-left'>
            <h2 className='font-en font-medium text-xl md:text-5xl'>
              An error occurred
            </h2>
            <p className='mt-2 text-muted-foreground text-xs md:mt-6 md:text-lg'>
              予期せぬエラーが発生しました。
            </p>
          </hgroup>

          <div className='space-y-4'>
            <p className='text-sm leading-loose tracking-wide'>
              申し訳ございません。システムエラーが発生しました。
              <br />
              一時的な問題の可能性がありますので、再試行していただくか、トップページからやり直してください。
            </p>
            {process.env.NODE_ENV !== 'production' && (
              <pre className='overflow-x-auto rounded border bg-muted p-4 font-mono text-destructive text-xs'>
                {error.message}
              </pre>
            )}
          </div>

          <div className='flex flex-col gap-4 md:flex-row'>
            <Button
              onClick={reset}
              className='flex h-12 w-full items-center justify-center gap-2 border-0 bg-heading px-6 py-3 font-en font-medium text-background md:max-w-fit'>
              <span>Try Again</span>
              <ArrowClockwiseIcon weight='light' className='size-5' />
            </Button>

            <Link
              href='/'
              className='flex h-12 w-full items-center justify-center gap-2 border border-heading px-6 py-3 font-en font-medium text-heading transition-colors hover:bg-heading hover:text-background md:max-w-fit'>
              <span>Back to Home</span>
              <CaretRightIcon weight='light' className='size-5' />
            </Link>
          </div>
        </div>
      </Container>
    </Main>
  )
}
