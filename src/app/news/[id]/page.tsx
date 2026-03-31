import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Container } from '@/components/layout/container'
import { Main } from '@/components/layout/main'
import { getAllNewsArticleIds, getNewsArticleById } from '@/lib/microcms'
import { formatDate } from '@/utils/format/date'
import { ArticleContent } from './_components/article-content'

interface PageProps {
  params: Promise<{ id: string }>
}

/**
 * 静的パラメータを生成
 */
export async function generateStaticParams() {
  const ids = await getAllNewsArticleIds()
  return ids.map(id => ({ id }))
}

/**
 * メタデータを生成
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const article = await getNewsArticleById(id)

  if (!article) {
    return {
      title: 'お知らせが見つかりません',
    }
  }

  const title = article.title
  const description = undefined // microCMSには概要フィールドがないため

  return {
    title,
    description,
    alternates: {
      canonical: `/news/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/news/${id}`,
      type: 'article',
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params
  const article = await getNewsArticleById(id)

  if (!article) {
    notFound()
  }

  return (
    <Main>
      <article>
        <Container>
          {/* パンくずリスト */}
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'News', href: '/news' },
              { label: article.title },
            ]}
          />

          {/* アイキャッチ画像 */}
          {article.eyecatch && (
            <div className='-mx-4 md:-mx-8 lg:mx-0'>
              <Image
                src={article.eyecatch.url}
                alt={article.title}
                width={article.eyecatch.width ?? 800}
                height={article.eyecatch.height ?? 450}
                className='h-full w-full object-cover'
                priority
              />
            </div>
          )}

          {/* ヘッダー */}
          <header className='my-6 flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <time
                dateTime={article.publishedAt}
                className='font-en text-muted-foreground text-xs'>
                {formatDate(article.publishedAt)}
              </time>
              {article.category && (
                <span className='rounded bg-muted px-2 py-0.5 text-muted-foreground text-xs'>
                  {article.category.name}
                </span>
              )}
            </div>
            <h1 className='font-medium text-heading text-xl leading-relaxed'>
              {article.title}
            </h1>
          </header>

          {/* 本文 */}
          <ArticleContent html={article.content} />

          {/* 一覧に戻る */}
          <div className='mt-12 flex flex-col items-center border-t pt-8'>
            <Link
              href='/news'
              className='inline-flex items-center text-sm hover:underline'>
              お知らせ一覧に戻る
            </Link>
          </div>
        </Container>
      </article>
    </Main>
  )
}
