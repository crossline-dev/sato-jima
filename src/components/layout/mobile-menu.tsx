'use client'

import { UserIcon } from '@phosphor-icons/react'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FOOTER_NAV } from '@/components/layout/footer-nav'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const SHOPIFY_ACCOUNT_URL = 'https://shopify.com/70593708186/account'

export interface MobileNavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: 'About', href: '/about' },
  {
    label: 'Products',
    href: '/collections/all',
    children: [
      { label: 'All', href: '/collections/all' },
      { label: 'New Items', href: '/collections/new-items' },
      { label: 'Limited Goods', href: '/collections/limited-goods' },
    ],
  },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const prevPathnameRef = useRef(pathname)

  // パス変更時にメニューを閉じる（レンダー中に比較、useEffectでの同期的setStateを回避）
  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname
    if (isOpen) {
      setIsOpen(false)
    }
  }

  // リサイズ時にメニューを閉じる
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors md:hidden'
        aria-label='メニューを開く'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24px'
          height='24px'
          fill='none'
          viewBox='0 0 24 24'>
          <title>メニューを開く</title>
          <path
            stroke='currentColor'
            strokeMiterlimit='10'
            strokeWidth='1.1'
            d='M2.4 8.4h19.2M2.4 15.615h19.2'
          />
        </svg>
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side='left'
          className='flex w-75 flex-col overflow-hidden p-0 sm:w-87.5'>
          <SheetHeader className='border-b px-5'>
            <SheetTitle className='sr-only'>Menu</SheetTitle>
            <SheetDescription className='sr-only'>
              Menu for Mobile Device User.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className='min-h-0 flex-1'>
            <div className='flex flex-col gap-6 py-6'>
              <nav className='flex flex-col gap-1'>
                {MOBILE_NAV_ITEMS.map(item => (
                  <div key={item.href}>
                    <Link
                      href={item.href as Route}
                      onClick={() => setIsOpen(false)}
                      className='block rounded-md px-5 py-3 font-en font-medium text-lg transition-colors hover:bg-secondary'>
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className='flex flex-col gap-1'>
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            href={child.href as Route}
                            onClick={() => setIsOpen(false)}
                            className='block rounded-md py-2 pr-5 pl-9 font-en text-muted-foreground text-sm transition-colors hover:bg-secondary hover:text-foreground'>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Collections セクション */}
              <div>
                <Link
                  href='/collections'
                  onClick={() => setIsOpen(false)}
                  className='block rounded-md px-5 py-3 font-en font-medium text-lg transition-colors hover:bg-secondary'>
                  Collections
                </Link>
                <div className='flex flex-col gap-1'>
                  <Link
                    href='/collections/original-bear'
                    onClick={() => setIsOpen(false)}
                    className='block rounded-md py-2 pr-5 pl-9 font-en text-muted-foreground text-sm transition-colors hover:bg-secondary hover:text-foreground'>
                    Original Bear
                  </Link>
                  <Link
                    href='/collections/event-goods'
                    onClick={() => setIsOpen(false)}
                    className='block rounded-md py-2 pr-5 pl-9 font-en text-muted-foreground text-sm transition-colors hover:bg-secondary hover:text-foreground'>
                    Event Goods
                  </Link>
                  <Link
                    href='/collections/apparel'
                    onClick={() => setIsOpen(false)}
                    className='block rounded-md py-2 pr-5 pl-9 font-en text-muted-foreground text-sm transition-colors hover:bg-secondary hover:text-foreground'>
                    Apparel
                  </Link>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Account リンク + Policies リンクセクション */}
          <SheetFooter className='border-t bg-background p-0 py-4'>
            <div className='w-full'>
              <a
                href={SHOPIFY_ACCOUNT_URL}
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-2 px-5 py-2 text-sm transition-colors hover:opacity-70'
                aria-label='アカウント'>
                <UserIcon weight='light' className='size-5' />
                <span className='font-en text-xs'>アカウント</span>
              </a>
              <ul className='flex flex-wrap gap-x-5 gap-y-1 px-5 leading-none'>
                {FOOTER_NAV.policies.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href as Route}
                      onClick={() => setIsOpen(false)}
                      className='text-[0.65rem] text-muted-foreground transition-colors hover:text-foreground'>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
