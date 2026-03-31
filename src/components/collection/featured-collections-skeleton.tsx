/**
 * FeaturedCollectionsのスケルトンコンポーネント
 * 3つの三角形カードのローディング状態を表示
 */
export function FeaturedCollectionsSkeleton() {
  const width = 300
  const height = 260
  const padding = 2

  return (
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-12'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className='flex flex-col items-center'
          style={{
            aspectRatio: `${width + padding * 2} / ${height + padding * 2}`,
          }}>
          <svg
            width='100%'
            height='100%'
            viewBox={`${-padding} ${-padding} ${width + padding * 2} ${height + padding * 2}`}
            preserveAspectRatio='xMidYMid meet'
            className='h-full w-full animate-pulse'>
            <title>Loading...</title>
            {/* 三角形のスケルトン */}
            <path
              d={`M${width / 2},0 L0,${height} L${width},${height} Z`}
              fill='none'
              className='stroke-muted'
              strokeWidth='2'
              strokeLinejoin='miter'
            />
            <path
              d={`M${width / 2},12 L12,${height - 7} L${width - 12},${height - 7} Z`}
              fill='none'
              className='stroke-muted/50'
              strokeWidth='1.5'
              strokeLinejoin='miter'
            />
            <path
              d={`M${width / 2},24 L24,${height - 14} L${width - 24},${height - 14} Z`}
              fill='none'
              className='stroke-muted/25'
              strokeWidth='1'
              strokeLinejoin='miter'
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
