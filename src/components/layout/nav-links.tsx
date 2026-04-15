import Link from 'next/link'
import {
  PRODUCTS_MENU_COLLECTION_ITEMS,
  storefrontCollectionPath,
} from '@/config/navigation'
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
}

export function NavLinks({ className, linkClassName, onClick }: NavLinksProps) {
  return (
    <nav className={cn('items-center gap-2', className)}>
      {NAV_ITEMS.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'inline-flex h-9 items-center rounded-md px-4 py-2 font-medium text-sm transition-opacity hover:opacity-70',
            linkClassName,
          )}
          onClick={onClick}>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
