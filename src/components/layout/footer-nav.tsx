import type { Route } from 'next'
import Link from 'next/link'

export const FOOTER_NAV = {
  about: [
    { label: 'ブログ', href: '/blog' },
    { label: '会社概要', href: '/about' },
    { label: 'お問い合わせ', href: '/contact' },
    { label: 'よくある質問', href: '/faq' },
  ],
  shop: [{ label: '全商品', href: '/products' }],
  policies: [
    { label: '利用規約', href: '/terms-of-use' },
    { label: '特定商取引法に基づく表記', href: '/terms-of-sale' },
    { label: 'ショッピングガイド', href: '/shopping-guide' },
    { label: 'プライバシーポリシー', href: '/privacy-policy' },
    { label: 'お問い合わせ', href: '/contact' },
  ],
} as const

interface FooterNavSectionProps {
  title: string
  links: ReadonlyArray<{ label: string; href: Route }>
}

export function FooterNavSection({ title, links }: FooterNavSectionProps) {
  return (
    <div>
      <h3 className='font-medium text-sm uppercase tracking-wider'>{title}</h3>
      <ul className='mt-4 space-y-3'>
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className='text-sm text-white/70 transition-colors hover:text-white'>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
