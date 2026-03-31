import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/classes'

/**
 * 商品グリッドレイアウト用のクラス名
 * - モバイル: 2列
 * - sm以上: 3列（最大）
 */
const gridClassName =
  'grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:gap-x-4 md:gap-y-8 xl:gap-x-6 xl:gap-y-10'

interface ProductGridProps {
  children: ReactNode
  className?: string
}

/**
 * 商品カードを配置するグリッドコンポーネント
 * 最大3列のレスポンシブグリッドレイアウトを提供
 */
export function ProductGrid({ children, className }: ProductGridProps) {
  return <div className={cn(gridClassName, className)}>{children}</div>
}

interface ProductGridSkeletonProps {
  count?: number
  className?: string
}

/**
 * ProductGrid用のスケルトンコンポーネント
 * ProductCardのレイアウトに完全にマッチ
 */
export function ProductGridSkeleton({
  count = 12,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div className={cn(gridClassName, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='flex flex-col'>
          {/* 画像エリア */}
          <Skeleton className='aspect-3/4 w-full' />
          {/* 情報エリア */}
          <div className='flex flex-col pt-3'>
            {/* タイトル */}
            <Skeleton className='h-4 w-3/4' />
            {/* 価格 */}
            <Skeleton className='mt-1 h-4 w-1/3' />
          </div>
        </div>
      ))}
    </div>
  )
}
