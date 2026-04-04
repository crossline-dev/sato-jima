interface SectionTitleProps {
  /**
   * メインタイトル（英語表記）
   * @example "Concept"
   */
  title: string
  /**
   * サブタイトル（日本語表記、オプション）
   * @example "コンセプト"
   */
  subtitle?: string
  /**
   * 見出しのHTML要素を指定
   * @default 'h2'
   */
  as?: 'h2' | 'h3' | 'h4'
  /**
   * hgroupに追加するクラス名
   */
  className?: string
}

/**
 * セクションのタイトル表示コンポーネント
 *
 * @example
 * // 基本的な使用法
 * <SectionTitle title="Concept" subtitle="コンセプト" />
 *
 * @example
 * // 見出しレベルを変更
 * <SectionTitle title="Products" subtitle="商品一覧" as="h3" />
 */
export function SectionTitle({
  title,
  subtitle,
  as: Tag = 'h2',
  className,
}: SectionTitleProps) {
  return (
    <hgroup className={`flex flex-col items-center gap-2 ${className ?? ''}`}>
      <Tag className='font-en text-3xl text-heading tracking-wide'>
        {title}
      </Tag>
      {subtitle && (
        <p className='text-muted-foreground text-xs tracking-wide'>
          {subtitle}
        </p>
      )}
    </hgroup>
  )
}
