import Link from 'next/link'
import { siteConfig } from '@/config/site.config'
import { FOOTER_NAV } from './footer-nav'

export function Footer() {
  return (
    <footer className='bg-heading text-background'>
      {/* メインフッター
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>

          <div className='md:col-span-1'>
            <Link
              href='/'
              className='font-bold text-xl tracking-tight transition-colors hover:text-white/80'>
              {siteConfig.siteName}
            </Link>
            <p className='mt-4 text-sm text-white/70'>
              {siteConfig.siteSubTitle}
            </p>
            <div className='mt-6'>
              <SocialLinks />
            </div>
          </div>

          <FooterNavSection title='About' links={FOOTER_NAV.about} />

          <FooterNavSection title='Shop' links={FOOTER_NAV.shop} />
        </div>
      </div> */}

      {/* サブフッター */}
      <div className='border-white/10 border-t'>
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            {/* コピーライト */}
            <p className='font-en text-white/50 text-xs tracking-wide'>
              &copy; {new Date().getFullYear()} {siteConfig.siteName}. All
              rights reserved.
            </p>

            {/* ポリシーリンク */}
            <nav>
              <ul className='grid grid-cols-2 gap-x-6 gap-y-3 md:flex md:flex-wrap md:items-center md:justify-center'>
                {FOOTER_NAV.policies.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-white/50 text-xs transition-colors hover:text-white'>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
