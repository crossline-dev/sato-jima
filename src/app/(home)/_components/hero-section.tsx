'use client'

import heroImage from '@@/public/images/hero.jpeg'
import * as m from 'motion/react-m'
import Image from 'next/image'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className='relative h-120 w-full overflow-hidden p-1.5 sm:h-180 md:h-220 xl:h-[80vh]'>
      {/* Wrapper */}
      <div className='relative h-full w-full overflow-hidden'>
        {/* Animated wrapper for image content */}
        <m.div
          initial={
            prefersReducedMotion
              ? { opacity: 1 }
              : { scale: 1.1, filter: 'blur(10px)', opacity: 0 }
          }
          animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 2, ease: [0.22, 1, 0.36, 1] }
          }
          className='absolute inset-0 z-0'>
          <div className='relative h-full w-full'>
            <Image
              src={heroImage}
              alt=''
              priority
              fetchPriority='high'
              fill
              sizes='100vw'
              className='object-cover object-[42%_center] md:object-center'
            />
          </div>
        </m.div>

        {/* Dark overlay */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 z-1 bg-[rgba(23,23,23,0.12)] transition-opacity duration-350'
        />

        {/* Vignette overlay */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -inset-x-25 -inset-y-50 z-10 bg-[radial-gradient(rgb(0_0_0/0.16)_0%,transparent_70%)]'
        />
      </div>
    </section>
  )
}
