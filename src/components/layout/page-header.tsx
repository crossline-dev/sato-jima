import type { ReactNode } from 'react'
import { Container } from './container'

interface PageHeaderProps {
  /**
   * ページタイトル（h1として表示）
   */
  title: string
  /**
   * サブテキスト（ReactNodeで柔軟に対応）
   * - 文字列: "最新のお知らせをお届けします"
   * - 動的なJSX: <>{count} {count === 1 ? 'collection' : 'collections'}</>
   */
  description?: ReactNode
  /**
   * セクションに追加するクラス名
   */
  className?: string
}

/**
 * 各ページ共通のヘッダーセクション
 * - border-yのボーダースタイル
 * - 中央揃えのタイトルとサブテキスト
 * - font-en適用
 */
export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <section className={`border-y py-6 md:py-12 ${className ?? ''}`}>
      <Container>
        <hgroup className='flex flex-col items-center gap-2 font-en'>
          <h1 className='font-medium text-heading text-lg'>{title}</h1>
          {description && (
            <p className='text-muted-foreground text-sm'>{description}</p>
          )}
        </hgroup>
      </Container>
    </section>
  )
}
