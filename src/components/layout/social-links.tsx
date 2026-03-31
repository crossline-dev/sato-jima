import { InstagramLogoIcon, TwitterLogoIcon } from '@phosphor-icons/react/ssr'
import type { ComponentType, SVGProps } from 'react'

type SocialIcon = ComponentType<SVGProps<SVGSVGElement>>

interface SocialLink {
  name: string
  href: string
  icon: SocialIcon
}

const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Instagram', href: '#', icon: InstagramLogoIcon },
  { name: 'Twitter', href: '#', icon: TwitterLogoIcon },
]

export function SocialLinks() {
  return (
    <ul className='flex items-center gap-4'>
      {SOCIAL_LINKS.map(link => {
        const Icon = link.icon
        return (
          <li key={link.name}>
            <a
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className='flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white'
              aria-label={link.name}>
              <Icon className='h-5 w-5' />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
