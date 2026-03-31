import 'server-only'

import { unstable_cache } from 'next/cache'
import { microcmsClient } from './client'
import type { NewsArticle } from './types'

const NEWS_ENDPOINT = 'news'

/**
 * お知らせ記事一覧を取得
 * Webook経由で 'news' タグを再検証可能
 */
export const getNewsArticles = unstable_cache(
  async (options?: {
    limit?: number
    offset?: number
  }): Promise<{ articles: NewsArticle[]; totalCount: number }> => {
    const data = await microcmsClient.getList<NewsArticle>({
      endpoint: NEWS_ENDPOINT,
      queries: {
        limit: options?.limit ?? 10,
        offset: options?.offset ?? 0,
        orders: '-publishedAt', // 最新順
      },
    })

    return {
      articles: data.contents,
      totalCount: data.totalCount,
    }
  },
  ['news-articles'],
  { tags: ['news'], revalidate: 3600 },
)

/**
 * お知らせ記事詳細を取得
 * Webook経由で 'news' および 'news:{id}' タグを再検証可能
 */
export async function getNewsArticleById(
  id: string,
): Promise<NewsArticle | null> {
  return unstable_cache(
    async () => {
      try {
        const article = await microcmsClient.get<NewsArticle>({
          endpoint: NEWS_ENDPOINT,
          contentId: id,
        })
        return article
      } catch {
        return null
      }
    },
    [`news-article-${id}`],
    { tags: ['news', `news:${id}`], revalidate: 3600 },
  )()
}

/**
 * 全てのお知らせ記事IDを取得（静的生成用）
 * ビルド時に呼ばれるため、短いrevalidateを設定
 */
export const getAllNewsArticleIds = unstable_cache(
  async (): Promise<string[]> => {
    const data = await microcmsClient.getList<NewsArticle>({
      endpoint: NEWS_ENDPOINT,
      queries: {
        limit: 100,
        fields: 'id',
      },
    })

    return data.contents.map(article => article.id)
  },
  ['news-article-ids'],
  { tags: ['news'], revalidate: 3600 },
)
