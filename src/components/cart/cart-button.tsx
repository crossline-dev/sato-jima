'use client'

import { HandbagIcon } from '@phosphor-icons/react'
import { useCart } from '@/lib/cart'

export function CartButton() {
  const { itemCount, openCart } = useCart()

  return (
    <button
      type='button'
      onClick={openCart}
      className='relative cursor-pointer rounded-full p-1 hover:opacity-70'
      aria-label='カートを開く'>
      <HandbagIcon weight='light' className='size-6' />
      {itemCount > 0 && (
        <span className='absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full border border-current bg-background font-en text-xs transition-colors duration-300 ease-in-out'>
          <span className='text-foreground'>
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        </span>
      )}
    </button>
  )
}
