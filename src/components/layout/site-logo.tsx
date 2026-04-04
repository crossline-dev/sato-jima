import Link from 'next/link'
import { siteConfig } from '@/config/site.config'

export function SiteLogo() {
  return (
    <Link
      href='/'
      className='font-en font-medium text-lg tracking-wider hover:opacity-70'>
      {siteConfig.siteName}
    </Link>
  )
}
