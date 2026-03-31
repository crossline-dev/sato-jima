import Link from 'next/link'
import { useState } from 'react'
import {
  PRODUCTS_MENU_COLLECTION_ITEMS,
  storefrontCollectionPath,
} from '@/config/storefront'
import { FeaturedCollections } from '@/components/collection/featured-collections'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/utils/classes'

export interface NavItem {
  label: string
  href: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Collections', href: '/collections' },
  {
    label: 'Products',
    href: storefrontCollectionPath(PRODUCTS_MENU_COLLECTION_ITEMS[0].handle),
  },
] as const

interface NavLinksProps {
  className?: string
  linkClassName?: string
  onClick?: () => void
  onMegaMenuChange?: (isOpen: boolean) => void
}

export function NavLinks({
  className,
  linkClassName,
  onClick,
  onMegaMenuChange,
}: NavLinksProps) {
  const [menuValue, setMenuValue] = useState('')
  const [openCount, setOpenCount] = useState(0)

  const handleValueChange = (value: string) => {
    setMenuValue(value)
    onMegaMenuChange?.(value !== '')
    // メニューが開いた時にカウンターをインクリメント（アニメーション再トリガー用）
    if (value === 'Collections') {
      setOpenCount(prev => prev + 1)
    }
  }

  const handleItemClick = () => {
    // メニューを閉じる
    setMenuValue('')
    onMegaMenuChange?.(false)
    onClick?.()
  }

  return (
    <NavigationMenu
      className={className}
      value={menuValue}
      onValueChange={handleValueChange}>
      <NavigationMenuList className='gap-2'>
        {NAV_ITEMS.map(item => (
          <NavigationMenuItem key={item.href} value={item.label}>
            {item.label === 'Collections' ? (
              <>
                <NavigationMenuTrigger
                  className={cn(
                    'bg-transparent font-medium text-sm transition-all hover:opacity-100',
                    'relative pb-2 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-current after:transition-all hover:after:w-full data-[state=open]:after:w-full',
                    linkClassName,
                  )}>
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className='w-screen'>
                    <div className='mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8'>
                      <FeaturedCollections
                        key={openCount}
                        onItemClick={handleItemClick}
                        animateOnMount
                      />
                    </div>
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'bg-transparent font-medium text-sm hover:opacity-70',
                    linkClassName,
                  )}
                  onClick={handleItemClick}>
                  {item.label}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
