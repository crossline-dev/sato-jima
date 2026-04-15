interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * JSON-LD 構造化データを安全に埋め込むコンポーネント
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      id='json-ld'
      type='application/ld+json'
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify でエスケープ済み、ユーザー入力なし
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
