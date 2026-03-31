'use client'

import { useEffect, useState } from 'react'

/**
 * prefers-reduced-motion メディアクエリを監視するカスタムフック
 *
 * OS/ブラウザで「視差効果を減らす」設定が有効な場合に true を返す
 * WCAG 2.1 Level AA 準拠のアクセシビリティ対応
 *
 * @returns ユーザーがモーション削減を希望している場合は true
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // 初期値を設定
    setPrefersReducedMotion(mediaQuery.matches)

    // 設定変更を監視
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}
