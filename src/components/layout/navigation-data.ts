import {
  PRODUCTS_MENU_COLLECTION_ITEMS,
  storefrontCollectionPath,
} from '@/config/navigation'

export interface MobileNavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: 'About', href: '/about' },
  {
    label: 'Products',
    href: storefrontCollectionPath(PRODUCTS_MENU_COLLECTION_ITEMS[0].handle),
    children: PRODUCTS_MENU_COLLECTION_ITEMS.map(({ label, handle }) => ({
      label,
      href: storefrontCollectionPath(handle),
    })),
  },
]
