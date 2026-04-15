'use client'

import { BasketIcon } from '@phosphor-icons/react/ssr'
import { useState } from 'react'
import { toast } from 'sonner'
import { getCheckoutUrl } from '@/actions/cart-actions'
import { CartItem } from '@/components/cart/cart-item'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { useCartSchedule } from '@/hooks/use-cart-schedule'
import { useCart } from '@/lib/cart'
import { CART_ERROR_MESSAGES } from '@/lib/cart/cart-error'
import { formatPrice } from '@/utils/format/price'

export function CartSheet() {
  const { isOpen, closeCart, items, itemCount, cart } = useCart()
  const { isCartOpen, cartOpenLabel } = useCartSchedule()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const result = await getCheckoutUrl()
      if (result.success && result.url) {
        window.location.href = result.url
        return
      }
      if (!result.success) {
        toast.error(result.error ?? CART_ERROR_MESSAGES.checkoutFailed)
      } else {
        toast.error(CART_ERROR_MESSAGES.checkoutFailed)
      }
    } catch (error) {
      console.error('[cart] getCheckoutUrl failed', error)
      toast.error(CART_ERROR_MESSAGES.checkoutFailed)
    }
    setIsCheckingOut(false)
  }

  const subtotal = cart?.cost.subtotalAmount.amount ?? '0'

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && closeCart()}>
      <SheetContent className='flex data-[side=right]:w-full data-[side=right]:sm:max-w-none'>
        <SheetHeader className='border-b pb-4'>
          <SheetTitle className='flex items-center gap-2 font-en font-medium leading-none'>
            <span>Cart</span>
            {itemCount > 0 && (
              <span className='font-normal text-muted-foreground text-xs'>
                ({itemCount} items)
              </span>
            )}
          </SheetTitle>
          <SheetDescription className='sr-only'>
            Your cart items and total amount.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 py-12'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-secondary'>
              <BasketIcon size={32} weight='light' />
            </div>
            <div className='text-center'>
              <p className='font-medium'>カートは空です</p>
              <p className='mt-2 text-muted-foreground text-xs'>
                商品を追加してください
              </p>
            </div>
            <Button
              variant='outline'
              onClick={closeCart}
              className='mt-2 cursor-pointer'>
              お買い物を続ける
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className='flex-1'>
              <div className='divide-y'>
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className='mt-auto border-t pt-4'>
              <div className='w-full space-y-6'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-base'>
                    <span className='font-medium text-sm'>小計</span>
                    <span className='font-en font-medium'>
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    送料・税はチェックアウト時に計算されます。
                  </p>
                </div>
                <div className='space-y-2'>
                  <Button
                    className='w-full cursor-pointer border-0 bg-heading font-en font-medium text-background'
                    onClick={handleCheckout}
                    disabled={isCheckingOut || !isCartOpen}>
                    {isCheckingOut && <Spinner size='sm' className='mr-2' />}
                    {!isCartOpen
                      ? `${cartOpenLabel} 販売開始`
                      : isCheckingOut
                        ? 'Loading...'
                        : 'Checkout'}
                  </Button>
                  <button
                    type='button'
                    onClick={closeCart}
                    className='w-full cursor-pointer text-muted-foreground text-xs transition-colors hover:text-foreground'>
                    お買い物を続ける
                  </button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
