import { Skeleton } from '@/components/ui/skeleton'

export function ProductGallerySkeleton() {
  return (
    <div className='flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start'>
      {/* メイン画像 */}
      <Skeleton className='aspect-4/5 w-full' />

      {/* サムネイル */}
      <div className='flex gap-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='aspect-square w-[72px] sm:w-20' />
        ))}
      </div>
    </div>
  )
}
