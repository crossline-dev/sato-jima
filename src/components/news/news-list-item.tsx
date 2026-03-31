import { CaretRightIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import type { NewsArticle } from '@/lib/microcms'
import { formatDate } from '@/utils/format/date'

interface NewsListItemProps {
  article: NewsArticle
}

/**
 * ニュース一覧のリストアイテムコンポーネント
 * トップページのお知らせセクションと/newsページで共通利用
 */
export function NewsListItem({ article }: NewsListItemProps) {
  return (
    <li>
      <Link
        href={`/news/${article.id}`}
        className='group relative flex gap-6 py-6 pr-8 md:gap-8'>
        <div className='flex min-w-0 flex-col justify-center gap-1'>
          <div className='flex items-center gap-2'>
            <time
              dateTime={article.publishedAt}
              className='font-en text-muted-foreground text-xs leading-relaxed md:text-sm'>
              {formatDate(article.publishedAt)}
            </time>
            {article.category && (
              <span className='rounded bg-muted px-2 py-0.5 text-muted-foreground text-xs'>
                {article.category.name}
              </span>
            )}
          </div>
          <h3 className='line-clamp-2 text-heading text-sm leading-[1.8em] transition-opacity group-hover:opacity-80 md:text-base'>
            {article.title}
          </h3>
        </div>
        <CaretRightIcon className='absolute top-1/2 right-0 size-3 -translate-y-1/2 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
      </Link>
    </li>
  )
}
