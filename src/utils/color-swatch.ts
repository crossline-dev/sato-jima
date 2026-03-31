/**
 * カラースウォッチ関連のユーティリティ
 */

interface ProductImage {
  url: string
  altText?: string | null
  width?: number | null
  height?: number | null
}

interface ProductVariant {
  id: string
  availableForSale: boolean
  selectedOptions: Array<{ name: string; value: string }>
  image?: ProductImage | null
}

interface ProductOption {
  id: string
  name: string
  values: string[]
}

export interface ColorSwatchInfo {
  value: string
  image: ProductImage | null
  isAvailable: boolean
  optionName: string
}

/**
 * カラーオプションかどうかを判定
 */
export function isColorOption(name: string): boolean {
  const colorNames = ['color', 'colour', 'カラー', '色']
  return colorNames.includes(name.toLowerCase())
}

/**
 * カラーオプションを取得
 */
export function getColorOption(
  options: ProductOption[] | null | undefined,
): ProductOption | null {
  return options?.find(opt => isColorOption(opt.name)) ?? null
}

/**
 * カラースウォッチがユニーク画像を持つかチェック
 * すべてのカラーバリアントに個別のユニーク画像がある場合のみ true
 */
export function hasUniqueColorImages(
  colorOption: ProductOption,
  variants: ProductVariant[],
): boolean {
  const optionNameLower = colorOption.name.toLowerCase()

  // 各カラーのバリアント画像を収集
  // 同じカラーで複数バリアントがある場合（サイズ違いなど）、画像を持つものを探す
  const colorImages = colorOption.values
    .map(value => {
      // このカラー値を持つバリアントの中から、画像があるものを探す
      const variantWithImage = variants.find(
        v =>
          v.selectedOptions.some(
            opt =>
              opt.name.toLowerCase() === optionNameLower && opt.value === value,
          ) && v.image?.url,
      )
      return variantWithImage?.image?.url
    })
    .filter((url): url is string => !!url)

  // すべてのカラーに個別画像があり、かつすべてユニークな場合のみ true
  return (
    colorImages.length === colorOption.values.length &&
    new Set(colorImages).size === colorImages.length
  )
}

/**
 * カラースウォッチ情報を構築
 * @param colorOption カラーオプション
 * @param variants バリアント配列
 * @param maxCount 最大表示数 (デフォルト: 無制限)
 */
export function buildColorSwatches(
  colorOption: ProductOption | null,
  variants: ProductVariant[],
  maxCount?: number,
): ColorSwatchInfo[] {
  if (!colorOption) return []

  // ユニーク画像チェック
  if (!hasUniqueColorImages(colorOption, variants)) return []

  const optionNameLower = colorOption.name.toLowerCase()
  const values = maxCount
    ? colorOption.values.slice(0, maxCount)
    : colorOption.values

  return values.map(value => {
    // このカラー値を持つ全バリアントを取得
    const colorVariants = variants.filter(v =>
      v.selectedOptions.some(
        opt =>
          opt.name.toLowerCase() === optionNameLower && opt.value === value,
      ),
    )
    // 画像を持つバリアントを優先して取得
    const variantWithImage =
      colorVariants.find(v => v.image?.url) ?? colorVariants[0]
    // 1つでも在庫ありなら isAvailable: true
    const isAvailable = colorVariants.some(v => v.availableForSale)
    return {
      value,
      image: variantWithImage?.image ?? null,
      isAvailable,
      optionName: colorOption.name,
    }
  })
}
