import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import { CartSheet } from '@/components/cart/cart-sheet'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { LazyMotionProvider } from '@/components/providers/lazy-motion-provider'
import { Toaster } from '@/components/ui/sonner'
import { ShopifyAnalytics } from '@/lib/analytics'
import { CartProvider } from '@/lib/cart'
import { getCart } from '@/lib/shopify'
import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import { metadataBase, siteConfig } from '@/config/site.config'
import { accentFont, inter, notoSansJP } from '@/utils/fonts'

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.siteMetaTitle}`,
    default: siteConfig.siteTitle,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteConfig.siteUrl,
    title: {
      template: `%s | ${siteConfig.siteMetaTitle}`,
      default: siteConfig.siteName,
    },
    description: siteConfig.siteDescription,
    siteName: siteConfig.siteName,
    images: [
      {
        url: '/ogp.png',
        width: 1200,
        height: 630,
        alt: siteConfig.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  description: siteConfig.siteDescription,
  metadataBase: metadataBase,
  keywords: siteConfig.siteKeywords,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Server Component で Promise を生成し、Client Component に渡す
  const cartPromise = getCart()

  return (
    <html
      lang='ja'
      className={`${inter.variable} ${notoSansJP.variable} ${accentFont.variable}`}>
      <head>
        <link rel='preconnect' href='https://cdn.shopify.com' />
      </head>
      <body className='grid min-h-screen grid-cols-[100%] grid-rows-[1fr_auto]'>
        <LazyMotionProvider>
          <NuqsAdapter>
            <CartProvider cartPromise={cartPromise}>
              <ShopifyAnalytics />
              <Header />
              <Suspense fallback={<div className='h-full min-h-dvh' />}>
                {children}
              </Suspense>
              <Footer />
              <CartSheet />
              <Toaster />
            </CartProvider>
          </NuqsAdapter>
        </LazyMotionProvider>
        <Analytics />
      </body>
    </html>
  )
}
