/**
 * 寸法データの型定義
 */
export interface Dimension {
  label: string
  value: string
}

/**
 * 寸法データをJSONからパースする
 * @param value - JSON文字列
 * @returns パースされた寸法配列
 */
export function parseDimensions(value: string | null | undefined): Dimension[] {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item): item is Dimension =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.label === 'string' &&
        typeof item.value === 'string',
    )
  } catch {
    console.warn('Failed to parse dimensions:', value)
    return []
  }
}

/**
 * 注意事項をJSONからパースする
 * @param value - JSON文字列
 * @returns パースされた文字列配列
 */
export function parsePrecautions(value: string | null | undefined): string[] {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    console.warn('Failed to parse precautions:', value)
    return []
  }
}
