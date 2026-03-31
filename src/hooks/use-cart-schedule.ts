'use client'

import { useEffect, useMemo, useState } from 'react'
import { CART_OPEN_DATE } from '@/config/site.config'

/**
 * カートの開放状態をリアクティブに管理するフック
 * 指定時刻に到達すると自動的に `isCartOpen` が `true` に切り替わる
 * （ページリロード不要）
 *
 * SSR/CSR のハイドレーション不整合を防ぐため、
 * 初期値は常に `false` にして `useEffect` で判定する
 *
 * @param saleStartDate - 商品単位の販売開始日時（ISO 8601文字列）。
 *   指定されている場合はこの日時を使用し、未指定の場合はグローバルの CART_OPEN_DATE にフォールバック。
 */
export function useCartSchedule(saleStartDate?: string | null) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  // 判定対象の日時を決定
  const targetDate = useMemo(() => {
    if (saleStartDate) {
      const parsed = new Date(saleStartDate)
      // 不正な日時の場合はグローバル設定にフォールバック
      if (!Number.isNaN(parsed.getTime())) return parsed
    }
    return CART_OPEN_DATE
  }, [saleStartDate])

  useEffect(() => {
    // クライアントサイドで現在の状態を判定
    if (Date.now() >= targetDate.getTime()) {
      setIsCartOpen(true)
      return
    }

    const remaining = targetDate.getTime() - Date.now()

    // 残り時間が24時間以上の場合はタイマーを設定しない
    // ページリロード時に再計算される
    if (remaining > 24 * 60 * 60 * 1000) return

    const timerId = setTimeout(() => {
      setIsCartOpen(true)
    }, remaining)

    return () => clearTimeout(timerId)
  }, [targetDate])

  // 表示用ラベル（例: "2/28(土) 12:00"）
  const cartOpenLabel = useMemo(
    () =>
      targetDate.toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tokyo',
      }),
    [targetDate],
  )

  return {
    /** カートが現在オープンしているか */
    isCartOpen,
    /** 表示用ラベル（例: "2/28(土) 12:00"） */
    cartOpenLabel,
  } as const
}
