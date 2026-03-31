'use client'

import image01 from '@@/public/images/ayato.png'
import image02 from '@@/public/images/hayato.png'
import image03 from '@@/public/images/yoshito.png'
import type { Variants } from 'motion/react'
import * as m from 'motion/react-m'
import Image from 'next/image'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const characters = [
  { src: image01, alt: 'AYATO' },
  { src: image02, alt: 'HAYATO' },
  { src: image03, alt: 'YOSHITO' },
]

// POPなバウンスアニメーション
const popVariants: Variants = {
  hidden: {
    y: 40,
    opacity: 0,
    scale: 0.95,
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
      delay: i * 0.15,
    },
  }),
}

// reduced-motion 用のシンプルなバリアント
const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
}

export function AnimationImage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className='mx-auto w-full px-4 md:px-8 lg:max-w-4xl lg:px-12 xl:px-15'>
      <div className='grid grid-cols-3 overflow-hidden pt-6 sm:gap-4 md:gap-6'>
        {characters.map((char, i) => (
          <m.div
            key={char.alt}
            custom={i}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3, margin: '0px 0px -50px 0px' }}
            variants={
              prefersReducedMotion ? reducedMotionVariants : popVariants
            }
            className='relative aspect-[1/0.7] w-full overflow-hidden'>
            <Image
              src={char.src}
              alt={char.alt}
              fill
              className='object-cover object-[center_20%]'
              sizes='(max-width: 768px) 50vw, 300px'
            />
          </m.div>
        ))}
      </div>
    </div>
  )
}
