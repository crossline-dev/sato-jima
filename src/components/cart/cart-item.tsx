'use client'

import { Minus, Plus, TrashIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { useRef, useTransition } from 'react'
import { toast } from 'sonner'
import { removeItem, updateItemQuantity } from '@/actions/cart-actions'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart'
import { cloneCartSnapshot } from '@/lib/cart/cart-reducer'
import type { CartItem as CartItemType } from '@/lib/shopify'
import { formatPrice } from '@/utils/format/price'

type CartItemProps = {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { cart, updateCartItem, restoreCartToSnapshot } = useCart()
  const cartRef = useRef(cart)
  cartRef.current = cart
  const [isPending, startTransition] = useTransition()

  const handleQuantityChange = (action: 'plus' | 'minus') => {
    startTransition(async () => {
      const snapshot = cloneCartSnapshot(cartRef.current)
      updateCartItem(item.id, action)
      const newQuantity =
        action === 'plus' ? item.quantity + 1 : item.quantity - 1
      const result = await updateItemQuantity(item.id, newQuantity)

      if (!result.success) {
        restoreCartToSnapshot(snapshot)
        toast.error(result.error || '数量の更新に失敗しました。')
      }
    })
  }

  const handleRemove = () => {
    startTransition(async () => {
      const snapshot = cloneCartSnapshot(cartRef.current)
      updateCartItem(item.id, 'delete')
      const result = await removeItem(item.id)

      if (!result.success) {
        restoreCartToSnapshot(snapshot)
        toast.error(result.error || '削除に失敗しました。')
      }
    })
  }

  const { merchandise } = item
  const imageUrl = merchandise.product.featuredImage?.url

  return (
    <div className='flex gap-4 p-2'>
      {/* 商品画像 */}
      <div className='relative size-20 shrink-0 overflow-hidden rounded-[3px] border bg-foreground/10'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={merchandise.product.title}
            fill
            className='object-cover'
            sizes='80px'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center font-en text-foreground/60 text-xs'>
            No Image
          </div>
        )}
      </div>

      {/* 商品情報 */}
      <div className='flex flex-1 flex-col justify-center'>
        <div className='flex justify-between'>
          <div>
            <h3 className='font-en font-medium text-sm leading-tight'>
              {merchandise.product.title}
            </h3>
            {merchandise.title !== 'Default Title' && (
              <p className='mt-0.5 font-en text-muted-foreground text-xs'>
                {merchandise.title}
              </p>
            )}
          </div>
          <p className='font-en font-medium text-sm'>
            {formatPrice(item.cost.totalAmount.amount)}
          </p>
        </div>

        {/* 数量操作 */}
        <div className='mt-2 flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='icon'
              className='size-6 cursor-pointer'
              onClick={() => handleQuantityChange('minus')}
              disabled={isPending}
              aria-label='数量を減らす'>
              <Minus className='h-3 w-3' />
            </Button>
            <span className='w-8 text-center font-en text-sm'>
              {item.quantity}
            </span>
            <Button
              variant='outline'
              size='icon'
              className='size-6 cursor-pointer'
              onClick={() => handleQuantityChange('plus')}
              disabled={isPending}
              aria-label='数量を増やす'>
              <Plus className='h-3 w-3' />
            </Button>
          </div>

          <button
            type='button'
            className='flex size-6 cursor-pointer items-center justify-center text-muted-foreground transition-opacity hover:opacity-60 disabled:opacity-50'
            onClick={handleRemove}
            disabled={isPending}
            aria-label='カートから削除'>
            <TrashIcon className='size-5' weight='light' />
          </button>
        </div>
      </div>
    </div>
  )
}
