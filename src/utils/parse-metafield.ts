/**
 * JSON形式のメタフィールド（寸法等）を読みやすい文字列に変換する
 *
 * @example
 * // Input: '[{"label":"幅","value":"17"},{"label":"高さ","value":"8.5"}]'
 * // Output: '幅: 17, 高さ: 8.5'
 */
export function parseJsonMetafield(value?: string | null): string | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as unknown
    if (Array.isArray(parsed)) {
      return parsed
        .map(
          (item: { label: string; value: string }) =>
            `${item.label}: ${item.value}`,
        )
        .join(', ')
    }
    return value
  } catch {
    return value
  }
}
