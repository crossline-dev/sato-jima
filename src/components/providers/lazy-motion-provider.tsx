'use client'

import { LazyMotion, domAnimation } from 'motion/react'
import type { ReactNode } from 'react'

interface LazyMotionProviderProps {
  children: ReactNode
}

/**
 * LazyMotion プロバイダー
 *
 * motion/react のバンドルサイズを最適化するためのプロバイダー
 * - 初期バンドル: ~4.6kb (motion の ~34kb から大幅削減)
 * - domAnimation: animations, variants, exit animations, gestures (hover/focus/press) をサポート
 *
 * @see https://motion.dev/docs/react-lazy-motion
 */
export function LazyMotionProvider({ children }: LazyMotionProviderProps) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>
}
