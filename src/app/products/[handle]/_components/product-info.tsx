'use client'

import { parseAsString, useQueryStates } from 'nuqs'
import { useMemo, useState } from 'react'
import { AddToCart } from '@/components/cart/add-to-cart'
import { DescriptionRenderer } from '@/components/shopify/description-renderer'
import type { CurrencyCode } from '@/lib/shopify/generated/graphql'
import { formatPrice } from '@/utils/format/price'
import {
  calculateDiscountPercentage,
  isLowStock,
  isMadeToOrder,
  isOnSale,
} from '@/utils/product-badges'
import { ProductMetafields } from './product-metafields'
import { VariantSelector } from './variant-selector'

interface ProductInfoProps {
  product: {
    id: string
    handle: string
    title: string
    description: string
    descriptionHtml: string
    availableForSale: boolean
    options: Array<{ id: string; name: string; values: string[] }>
    variants: {
      edges: Array<{
        node: {
          id: string
          title: string
          availableForSale: boolean
          selectedOptions: Array<{ name: string; value: string }>
          price: { amount: string; currencyCode: CurrencyCode }
          compareAtPrice?: { amount: string; currencyCode: CurrencyCode } | null
          quantityAvailable?: number | null
        }
      }>
    }
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: CurrencyCode }
      maxVariantPrice: { amount: string; currencyCode: CurrencyCode }
    }
    featuredImage?: {
      url: string
      altText?: string | null
      width?: number | null
      height?: number | null
    } | null
    tags: string[]
    // メタフィールド
    materials?: { value: string } | null
    dimensions?: { value: string } | null
    materialFeature?: { value: string } | null
    precautions?: { value: string } | null
    saleStartDate?: { value: string } | null
    madeToOrderNotice?: { value: string } | null
  }
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  )

  // 選択中のバリアントを取得
  const selectedVariant = useMemo(() => {
    // オプションが実質的にない（単一バリアント）かチェック
    const isSingleVariant =
      product.options.length === 0 ||
      (product.options.length === 1 && product.options[0]?.values.length === 1)

    if (selectedVariantId) {
      return product.variants.edges.find(v => v.node.id === selectedVariantId)
        ?.node
    }

    // 単一バリアントの場合は最初から選択済みとする
    if (isSingleVariant) {
      return product.variants.edges[0]?.node
    }

    return null
  }, [selectedVariantId, product.variants.edges, product.options])

  // nuqs でクエリパラメータの状態を取得
  const parsers = useMemo(
    () =>
      Object.fromEntries(
        product.options.map(opt => [opt.name.toLowerCase(), parseAsString]),
      ),
    [product.options],
  )
  const [queryOptions] = useQueryStates(parsers)

  // 未選択のオプション名を特定
  const unselectedOptionName = useMemo(() => {
    if (selectedVariant) return null
    if (product.options.length === 0) return null

    // クエリパラメータで値が設定されていない最初のオプションを探す
    const missingOption = product.options.find(
      opt => !queryOptions[opt.name.toLowerCase()],
    )

    return missingOption?.name ?? product.options[0]?.name
  }, [selectedVariant, product.options, queryOptions])

  // セール情報（バリアント選択時はそのバリアント、未選択時は最初のバリアントから取得）
  const saleInfo = useMemo(() => {
    const targetVariant = selectedVariant ?? product.variants.edges[0]?.node
    if (!targetVariant?.compareAtPrice) {
      return null
    }

    const { price, compareAtPrice } = targetVariant
    const onSale = isOnSale(price.amount, compareAtPrice.amount)

    if (!onSale) return null

    return {
      originalPrice: formatPrice(
        compareAtPrice.amount,
        compareAtPrice.currencyCode,
      ),
      discountPercent: calculateDiscountPercentage(
        price.amount,
        compareAtPrice.amount,
      ),
    }
  }, [selectedVariant, product.variants.edges])

  // 価格表示（バリアントが選択されていればそのバリアントの価格、なければ価格帯）
  const priceDisplay = useMemo(() => {
    if (selectedVariant) {
      return formatPrice(
        selectedVariant.price.amount,
        selectedVariant.price.currencyCode,
      )
    }

    const min = product.priceRange.minVariantPrice
    const max = product.priceRange.maxVariantPrice

    if (min.amount === max.amount) {
      return formatPrice(min.amount, min.currencyCode)
    }

    return `${formatPrice(min.amount, min.currencyCode)} 〜 ${formatPrice(max.amount, max.currencyCode)}`
  }, [selectedVariant, product.priceRange])

  // カートに追加可能かどうか
  // バリアント選択時: そのバリアントの在庫状態
  // バリアント未選択時: 商品全体の在庫状態（オプション選択を促すため在庫ありとして扱う）
  const canAddToCart = selectedVariant
    ? selectedVariant.availableForSale
    : product.availableForSale

  // 在庫数（バリアント選択時はそのバリアント、未選択時は全バリアント合計）
  const stockQuantity = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.quantityAvailable ?? 0
    }
    return product.variants.edges.reduce(
      (sum, e) => sum + (e.node.quantityAvailable ?? 0),
      0,
    )
  }, [selectedVariant, product.variants.edges])

  return (
    <div className='space-y-8'>
      {/* タイトル & 価格 */}
      <div className='space-y-4'>
        {/* 受注生産ラベル */}
        {isMadeToOrder(product.tags) && (
          <span className='inline-flex items-center border border-red-700/30 bg-red-900/10 px-2.5 py-1 font-medium text-red-900/80 text-xs tracking-wide'>
            受注生産
          </span>
        )}
        <h1 className='font-en font-medium text-xl'>{product.title}</h1>
        <div className='flex flex-wrap items-center gap-3'>
          <p
            className={`font-en text-lg ${
              saleInfo ? 'text-red-600' : 'text-foreground'
            }`}>
            {priceDisplay}
          </p>
          {saleInfo && (
            <>
              <span className='font-en text-muted-foreground text-sm line-through'>
                {saleInfo.originalPrice}
              </span>
              <span className='bg-red-500 px-2 py-0.5 font-en text-white text-xs'>
                {saleInfo.discountPercent}%OFF
              </span>
            </>
          )}
        </div>
        {!product.availableForSale && (
          <p className='font-en text-destructive text-sm'>SOLD OUT</p>
        )}
        {/* 残りわずか表示 */}
        {canAddToCart && isLowStock(stockQuantity) && (
          <p className='font-bold text-red-600 text-sm'>残りわずか</p>
        )}
      </div>

      {/* バリエーション選択 */}
      <VariantSelector
        options={product.options}
        variants={product.variants.edges}
        onVariantChange={setSelectedVariantId}
      />

      {/* 説明文 */}
      {product.descriptionHtml && (
        <DescriptionRenderer html={product.descriptionHtml} />
      )}

      {/* 受注生産の注意文言 */}
      {isMadeToOrder(product.tags) && (
        <div className='space-y-1 border border-red-700/30 bg-red-900/10 p-4'>
          <p className='font-medium text-red-900/80 text-sm'>受注販売商品</p>
          <p className='whitespace-pre-line text-red-900/70 text-xs leading-relaxed'>
            {product.madeToOrderNotice?.value ??
              '受注販売商品となり、ご注文を受けてからの発注となるため、お届けに時間がかかります。\n発送は6月初旬の発送を予定しております。\n※生産上の都合によりお届け予定日が前後する場合もございます。'}
          </p>
        </div>
      )}

      {/* カートに追加ボタン */}
      <AddToCart
        variantId={selectedVariant?.id ?? null}
        availableForSale={canAddToCart}
        unselectedOptionName={unselectedOptionName}
        saleStartDate={product.saleStartDate?.value}
        itemInfo={{
          variantTitle: selectedVariant?.title ?? '',
          price:
            selectedVariant?.price.amount ??
            product.priceRange.minVariantPrice.amount,
          currencyCode:
            selectedVariant?.price.currencyCode ??
            product.priceRange.minVariantPrice.currencyCode,
          product: {
            id: product.id,
            handle: product.handle,
            title: product.title,
            featuredImage: product.featuredImage,
          },
        }}
      />

      {/* メタフィールド（アコーディオン） */}
      <ProductMetafields
        materials={product.materials}
        dimensions={product.dimensions}
        materialFeature={product.materialFeature}
        precautions={product.precautions}
      />
    </div>
  )
}
