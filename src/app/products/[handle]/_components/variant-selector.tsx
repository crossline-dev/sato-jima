'use client'

import Image from 'next/image'
import { parseAsString, useQueryStates } from 'nuqs'
import { useEffect, useMemo } from 'react'
import { cn } from '@/utils/classes'
import { isColorOption } from '@/utils/color-swatch'

interface ProductOption {
  id: string
  name: string
  values: string[]
}

interface ProductVariant {
  id: string
  availableForSale: boolean
  selectedOptions: Array<{ name: string; value: string }>
  image?: {
    url: string
    altText?: string | null
    width?: number | null
    height?: number | null
  } | null
}

interface VariantSelectorProps {
  options: ProductOption[]
  variants: Array<{ node: ProductVariant }>
  onVariantChange?: (variantId: string | null) => void
}

type Combination = {
  id: string
  availableForSale: boolean
  image?: {
    url: string
    altText?: string | null
    width?: number | null
    height?: number | null
  } | null
  [key: string]: string | boolean | object | undefined | null
}

export function VariantSelector({
  options,
  variants,
  onVariantChange,
}: VariantSelectorProps) {
  // オプションがない or 1つで1値のみの場合は非表示
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1)

  // nuqs で動的にパーサーを生成
  const parsers = useMemo(
    () =>
      Object.fromEntries(
        options.map(opt => [opt.name.toLowerCase(), parseAsString]),
      ),
    [options],
  )

  const [selectedOptions, setSelectedOptions] = useQueryStates(parsers, {
    shallow: false,
  })

  // バリエーションの組み合わせマップを作成
  const combinations: Combination[] = useMemo(
    () =>
      variants.map(v => ({
        id: v.node.id,
        availableForSale: v.node.availableForSale,
        ...Object.fromEntries(
          v.node.selectedOptions.map(opt => [
            opt.name.toLowerCase(),
            opt.value,
          ]),
        ),
        image: v.node.image,
      })),
    [variants],
  )

  // 選択中のバリアントを特定
  const selectedVariant = useMemo(() => {
    if (Object.values(selectedOptions).every(v => !v)) return null

    return (
      combinations.find(combo =>
        options.every(
          opt =>
            combo[opt.name.toLowerCase()] ===
            selectedOptions[opt.name.toLowerCase()],
        ),
      ) ?? null
    )
  }, [combinations, options, selectedOptions])

  // バリアント変更時にコールバック
  useEffect(() => {
    onVariantChange?.(selectedVariant?.id ?? null)
  }, [selectedVariant, onVariantChange])

  if (hasNoOptionsOrJustOneOption) {
    return null
  }

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions({ [optionName.toLowerCase()]: value })
  }

  return (
    <div className='space-y-6'>
      {options.map(option => {
        const optionNameLower = option.name.toLowerCase()
        const isColor = isColorOption(option.name)

        return (
          <div key={option.id}>
            <div className='mb-3 flex items-center gap-1.5'>
              <h3 className='font-en font-medium text-sm'>{option.name}</h3>
            </div>
            <div className='flex flex-wrap gap-3'>
              {option.values.map(value => {
                const isActive = selectedOptions[optionNameLower] === value

                // この値を選んだ場合に在庫があるかチェック
                const testOptions = {
                  ...selectedOptions,
                  [optionNameLower]: value,
                }
                const isAvailableForSale = combinations.some(
                  combo =>
                    Object.entries(testOptions).every(
                      ([key, val]) => !val || combo[key] === val,
                    ) && combo.availableForSale,
                )

                if (isColor) {
                  // カラーオプションの各バリアント画像を収集
                  const colorImages = option.values
                    .map(v => {
                      const variant = combinations.find(
                        combo => combo[optionNameLower] === v && combo.image,
                      )
                      return variant?.image?.url
                    })
                    .filter(Boolean)

                  // すべてのカラーに個別画像があり、かつすべてユニークな場合のみ画像表示
                  // 1つでも画像がないか、同じ画像があれば背景色にフォールバック
                  const hasUniqueImages =
                    colorImages.length === option.values.length &&
                    new Set(colorImages).size === colorImages.length

                  // この値のバリアント画像を取得（ユニーク画像がある場合のみ）
                  const variantWithImage = hasUniqueImages
                    ? combinations.find(
                        combo =>
                          combo[optionNameLower] === value && combo.image,
                      )
                    : null
                  const variantImage = variantWithImage?.image

                  return (
                    <div
                      key={value}
                      className='flex flex-col items-center gap-1.5'>
                      <button
                        type='button'
                        onClick={() => handleOptionSelect(option.name, value)}
                        disabled={!isAvailableForSale}
                        title={`${option.name}: ${value}${!isAvailableForSale ? ' (在庫切れ)' : ''}`}
                        className={cn(
                          'group relative overflow-hidden rounded-[3px] transition-all duration-200',
                          variantImage ? 'h-16 w-16' : 'h-10 w-16',
                          isActive
                            ? 'ring-1 ring-foreground ring-offset-1 ring-offset-background'
                            : 'border border-border hover:border-muted-foreground',
                          !isAvailableForSale && 'opacity-25',
                        )}>
                        {variantImage ? (
                          <Image
                            src={variantImage.url}
                            alt={`${option.name}: ${value}`}
                            fill
                            className='object-cover'
                            sizes='(min-width: 768px) 64px, 48px'
                          />
                        ) : (
                          <div
                            className='h-full w-full rounded-[2px]'
                            style={{ backgroundColor: getColorValue(value) }}
                          />
                        )}

                        {/* 在庫切れの斜線 (SVG) */}
                        {!isAvailableForSale && (
                          <svg
                            className='absolute inset-0 h-full w-full'
                            viewBox='0 0 100 100'
                            preserveAspectRatio='none'
                            role='img'
                            aria-label='在庫切れ'>
                            <title>在庫切れ</title>
                            <line
                              x1='100'
                              y1='0'
                              x2='0'
                              y2='100'
                              strokeWidth='2'
                              className={
                                variantImage
                                  ? 'stroke-muted-foreground/60'
                                  : 'stroke-white/80'
                              }
                            />
                          </svg>
                        )}
                      </button>
                      <span
                        className={cn(
                          'font-en text-xs',
                          !isAvailableForSale && 'opacity-25',
                        )}>
                        {value}
                      </span>
                    </div>
                  )
                }

                // その他のオプションはテキストボタン
                return (
                  <button
                    key={value}
                    type='button'
                    onClick={() => handleOptionSelect(option.name, value)}
                    disabled={!isAvailableForSale}
                    title={
                      !isAvailableForSale ? `${value} (在庫切れ)` : undefined
                    }
                    className={cn(
                      'flex min-h-12 min-w-16 items-center justify-center rounded-[3px] px-4 py-2 font-en font-medium text-sm transition-all duration-200',
                      isActive
                        ? 'bg-background ring-1 ring-foreground ring-offset-1 ring-offset-background'
                        : 'border border-border bg-background hover:border-muted-foreground',
                      !isAvailableForSale &&
                        'cursor-not-allowed border-muted-foreground/10 bg-muted-foreground/5 opacity-40',
                    )}>
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * カラー名から CSS カラー値を取得
 */
function getColorValue(colorName: string): string {
  const colorMap: Record<string, string> = {
    red: '#A14D4A',
    blue: '#5E768E',
    green: '#637F71',
    black: '#1A1A1A',
    white: '#F5F5F5',
    pink: '#D4A0A0',
    yellow: '#D4C87A',
    orange: '#D4965A',
    purple: '#8B7AAD',
    brown: '#8B7355',
    gray: '#808080',
    grey: '#808080',
    navy: '#2C3E6B',
    beige: '#C8B99A',
  }

  const lowerName = colorName.toLowerCase()
  return colorMap[lowerName] ?? '#9CA3AF'
}
