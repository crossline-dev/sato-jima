'use client'

import { UserIcon } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { CartButton } from '@/components/cart/cart-button'
import { SHOPIFY_CUSTOMER_ACCOUNT_URL } from '@/config/navigation'
import { cn } from '@/utils/classes'
import { MobileMenu } from './mobile-menu'
import { NavLinks } from './nav-links'
import { SiteLogo } from './site-logo'

function CartButtonFallback() {
  return (
    <output
      className='block h-10 w-10 animate-pulse rounded-full bg-secondary'
      aria-label='カート読み込み中'
    />
  )
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  // 透明状態: ホームページ + スクロールなし + メガメニュー閉じた状態
  const isTransparent = isHomePage && !isScrolled && !isMegaMenuOpen

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    // passive: true でスクロールパフォーマンスを向上
    // ブラウザは preventDefault() が呼ばれないことを保証し、
    // メインスレッドをブロックせずにスクロール処理を実行できる
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      data-transparent={isTransparent}
      data-menu-open={isMegaMenuOpen}
      className={cn(
        'group/header fixed top-0 z-50 w-full font-en transition-all duration-300 ease-in-out',
        isTransparent
          ? 'bg-transparent pt-1.5 text-white'
          : 'bg-white text-foreground',
      )}>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between gap-4'>
          {/* 左側: モバイルメニュー (Mobile) / ナビゲーション (Desktop) */}
          <div className='flex-1'>
            <div className='flex items-center gap-4 md:hidden'>
              <Suspense fallback={null}>
                <MobileMenu />
              </Suspense>
            </div>
            <NavLinks
              className='hidden md:flex'
              onMegaMenuChange={setIsMegaMenuOpen}
            />
          </div>

          {/* 中央: ロゴ */}
          <div className='flex shrink-0 items-center justify-center'>
            <SiteLogo />
          </div>

          {/* 右側: アカウント + カート */}
          <div className='flex flex-1 items-center justify-end gap-2'>
            <a
              href={SHOPIFY_CUSTOMER_ACCOUNT_URL}
              className='hidden h-10 items-center gap-1 px-2 font-medium text-sm hover:opacity-70 md:flex'
              aria-label='アカウント'>
              <UserIcon weight='light' className='size-6' />
              <span className='sr-only'>Account</span>
            </a>
            <Suspense fallback={<CartButtonFallback />}>
              <CartButton />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  )
}
