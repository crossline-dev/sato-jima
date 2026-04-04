'use client'

import { useEffect, useMemo, useState } from 'react'
import { CART_OPEN_DATE } from '@/config/site.config'
import { formatCartOpenLabel } from '@/lib/cart/format-cart-open-label'

const MAX_CART_OPEN_TIMER_MS = 24 * 60 * 60 * 1000

/**
 * 次回いつカート開放を再判定するか（ミリ秒）。既に開放済みなら null。
 * 24時間超先の開放でも、最大24時間ごとにタイマーを張り直す。
 */
export function getNextCartOpenCheckDelayMs(
  nowMs: number,
  targetMs: number,
): number | null {
  if (nowMs >= targetMs) return null
  const remaining = targetMs - nowMs
  return Math.min(remaining, MAX_CART_OPEN_TIMER_MS)
}

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

  const targetDate = useMemo(() => {
    if (saleStartDate) {
      const parsed = new Date(saleStartDate)
      if (!Number.isNaN(parsed.getTime())) return parsed
    }
    return CART_OPEN_DATE
  }, [saleStartDate])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const schedule = () => {
      const delay = getNextCartOpenCheckDelayMs(
        Date.now(),
        targetDate.getTime(),
      )
      if (delay === null) {
        setIsCartOpen(true)
        return
      }
      timeoutId = setTimeout(schedule, delay)
    }

    schedule()

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
    }
  }, [targetDate])

  const cartOpenLabel = useMemo(
    () => formatCartOpenLabel(targetDate),
    [targetDate],
  )

  return {
    /** カートが現在オープンしているか */
    isCartOpen,
    /** 表示用ラベル（例: "2/28(土) 12:00"） */
    cartOpenLabel,
  } as const
}
