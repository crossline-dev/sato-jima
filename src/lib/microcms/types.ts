import type { MicroCMSDate, MicroCMSImage } from 'microcms-js-sdk'

/**
 * カテゴリー（コンテンツ参照）
 */
export interface Category {
  id: string
  name: string
}

/**
 * お知らせ記事
 * MicroCMSDateを継承し、publishedAtを必須として上書き
 */
export interface NewsArticle extends MicroCMSDate {
  id: string
  title: string
  content: string // リッチエディタHTML
  eyecatch?: MicroCMSImage
  category?: Category
  publishedAt: string // microCMSのシステムフィールド（公開時に必ず設定される）
}

/**
 * お知らせ記事一覧レスポンス
 */
export interface NewsListResponse {
  contents: NewsArticle[]
  totalCount: number
  offset: number
  limit: number
}
