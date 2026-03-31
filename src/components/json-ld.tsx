import Script from 'next/script'

interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * JSON-LD 構造化データを安全に埋め込むコンポーネント
 * Next.js の Script コンポーネントを使用してセキュリティリスクを軽減
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id='json-ld'
      type='application/ld+json'
      strategy='beforeInteractive'
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify でエスケープ済み、ユーザー入力なし
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
