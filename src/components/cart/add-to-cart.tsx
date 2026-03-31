'use client'

import { HandbagIcon } from '@phosphor-icons/react'
import { Plus } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { addItem } from '@/actions/cart-actions'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useCartSchedule } from '@/hooks/use-cart-schedule'
import { useShopifyAnalytics } from '@/hooks/use-shopify-analytics'
import { useCart } from '@/lib/cart'
import type { CartItem } from '@/lib/shopify'
import type { CurrencyCode } from '@/lib/shopify/generated/graphql'

type AddToCartProps = {
  /** バリエーション ID (merchandiseId) */
  variantId: string | null
  /** 在庫があるかどうか */
  availableForSale: boolean
  /** 未選択のオプション名（選択されていない場合のみ） */
  unselectedOptionName?: string | null
  /** 商品単位の販売開始日時（ISO 8601） */
  saleStartDate?: string | null
  /** 楽観的更新用のアイテム情報 */
  itemInfo: {
    variantTitle: string
    price: string
    currencyCode: CurrencyCode
    product: {
      id: string
      handle: string
      title: string
      featuredImage?: {
        url: string
        altText?: string | null
        width?: number | null
        height?: number | null
      } | null
    }
  }
}

export function AddToCart({
  variantId,
  availableForSale,
  unselectedOptionName,
  saleStartDate,
  itemInfo,
}: AddToCartProps) {
  const { addCartItem, openCart } = useCart()
  const { sendAddToCart } = useShopifyAnalytics()
  const { isCartOpen, cartOpenLabel } = useCartSchedule(saleStartDate)
  const [isPending, startTransition] = useTransition()

  const handleAddToCart = () => {
    if (!variantId) return

    // 楽観的更新用のカートアイテムを作成
    const optimisticItem: CartItem = {
      id: `optimistic-${Date.now()}`, // 一時的な ID
      quantity: 1,
      cost: {
        totalAmount: {
          amount: itemInfo.price,
          currencyCode: itemInfo.currencyCode,
        },
      },
      merchandise: {
        id: variantId,
        title: itemInfo.variantTitle,
        selectedOptions: [],
        price: {
          amount: itemInfo.price,
          currencyCode: itemInfo.currencyCode,
        },
        product: itemInfo.product,
      },
    }

    // 楽観的更新とサーバーアクションを transition 内で実行
    // 完了後にシートを開く
    startTransition(async () => {
      addCartItem(optimisticItem)
      const result = await addItem(variantId)

      if (!result.success) {
        // エラーが発生した場合は、楽観的更新の状態（addCartItem）について再検証が必要だが、
        // 開発の現状では revalidateTag が走るため、整合性は保たれる。
        toast.error(result.error || 'カートへの追加に失敗しました。')
        return
      }

      // Shopify Analytics: ADD_TO_CART イベントを送信
      if (result.cartId) {
        sendAddToCart({
          cartId: result.cartId,
          products: result.products,
          totalValue: Number.parseFloat(itemInfo.price),
        })
      }

      openCart()
    })
  }

  // 1. カート未オープンの場合
  if (!isCartOpen) {
    return (
      <Button
        disabled
        className='flex w-full items-center gap-2 border-0 bg-muted font-en font-medium text-muted-foreground'>
        {cartOpenLabel} 販売開始
      </Button>
    )
  }

  // 2. 在庫がない場合
  if (!availableForSale) {
    return (
      <Button
        disabled
        className='flex w-full items-center gap-2 border-0 bg-muted font-en font-medium text-muted-foreground'>
        在庫がありません
      </Button>
    )
  }

  // 3. バリエーションが選択されていない場合
  if (!variantId || unselectedOptionName) {
    return (
      <Button
        disabled
        className='flex w-full items-center gap-2 border-0 bg-muted font-en font-medium text-muted-foreground'>
        {unselectedOptionName ?? 'オプション'}を選択してください
      </Button>
    )
  }

  // 4. 在庫がある場合
  return (
    <Button
      onClick={handleAddToCart}
      disabled={isPending}
      className='flex w-full items-center gap-2 border-0 bg-heading font-en font-medium text-background'>
      {isPending ? (
        <Spinner />
      ) : (
        <HandbagIcon weight='light' className='size-5' />
      )}
      {isPending ? 'Adding...' : 'Add to Cart'}
    </Button>
  )
}

/**
 * シンプルなカート追加ボタン（商品一覧用）
 */
export function AddToCartMini({
  variantId,
  availableForSale,
  saleStartDate,
}: {
  variantId: string
  availableForSale: boolean
  saleStartDate?: string | null
}) {
  const [isPending, startTransition] = useTransition()
  const { openCart } = useCart()
  const { isCartOpen } = useCartSchedule(saleStartDate)

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addItem(variantId)
      if (!result.success) {
        toast.error(result.error || 'カートへの追加に失敗しました。')
        return
      }
      openCart()
    })
  }

  if (!availableForSale || !isCartOpen) {
    return (
      <Button disabled size='icon' variant='outline'>
        <Plus className='h-4 w-4' />
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isPending}
      size='icon'
      variant='outline'
      aria-label='カートに追加'>
      <Plus className='h-4 w-4' />
    </Button>
  )
}
