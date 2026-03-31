import { Skeleton } from '@/components/ui/skeleton'
import { getNewsArticles } from '@/lib/microcms'
import { NewsListItem } from './news-list-item'

interface NewsListProps {
  /** 表示する記事数（デフォルト: 10） */
  limit?: number
}

/**
 * ニュース一覧のスケルトンコンポーネント
 * NewsListのレイアウトと完全に一致
 */
export function NewsListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className='divide-y divide-border'>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className='relative flex gap-8 py-6 pr-6.5'>
          <Skeleton className='h-5 w-28 shrink-0' />
          <Skeleton className='h-5 w-full max-w-md' />
          <Skeleton className='absolute top-1/2 right-0 size-3 -translate-y-1/2' />
        </li>
      ))}
    </ul>
  )
}

export async function NewsList({ limit = 10 }: NewsListProps) {
  const { articles } = await getNewsArticles({ limit })

  if (articles.length === 0) {
    return (
      <div className='py-20 text-center'>
        <p className='text-muted-foreground'>お知らせはまだありません。</p>
      </div>
    )
  }

  return (
    <ul className='divide-y divide-border'>
      {articles.map(article => (
        <NewsListItem key={article.id} article={article} />
      ))}
    </ul>
  )
}
