import { Skeleton } from '@/components/ui/skeleton'

export function ProductInfoSkeleton() {
  return (
    <div className='mt-8 space-y-8 lg:mt-0'>
      {/* タイトル */}
      <div className='space-y-4'>
        <Skeleton className='h-12 w-3/4' />
        <Skeleton className='h-8 w-1/4' />
      </div>

      {/* バリエーション */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-20' />
        <div className='flex gap-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-12 w-12 rounded-full' />
          ))}
        </div>
      </div>

      <div className='space-y-4'>
        <Skeleton className='h-6 w-20' />
        <div className='flex gap-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-12 w-16 rounded-lg' />
          ))}
        </div>
      </div>

      {/* 説明 */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </div>

      {/* カートボタン */}
      <Skeleton className='h-14 w-full rounded-lg' />
    </div>
  )
}
