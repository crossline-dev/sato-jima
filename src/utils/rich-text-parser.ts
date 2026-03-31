/**
 * Shopify Rich Text メタフィールドのJSON構造を定義
 * https://shopify.dev/docs/apps/custom-data/metafields/types#rich-text
 */

interface RichTextNode {
  type: string
  value?: string
  url?: string
  title?: string
  target?: string
  bold?: boolean
  italic?: boolean
  children?: RichTextNode[]
}

/**
 * Shopify Rich Text JSONをHTMLに変換する
 * @param value - Rich Text JSON文字列
 * @returns HTML文字列
 */
export function parseRichText(value: string | null | undefined): string {
  if (!value) return ''

  try {
    const parsed = JSON.parse(value) as RichTextNode
    return renderNode(parsed)
  } catch {
    // JSON解析に失敗した場合は、プレーンテキストとして返す
    console.warn('Failed to parse Rich Text, returning as plain text:', value)
    return value
  }
}

/**
 * Rich Textノードを再帰的にHTMLにレンダリング
 */
function renderNode(node: RichTextNode): string {
  switch (node.type) {
    case 'root':
      return renderChildren(node.children)

    case 'paragraph':
      return `<p className="leading-loose text-sm">${renderChildren(node.children)}</p>`

    case 'heading': {
      // Shopify Rich Text は heading レベルを level プロパティで指定
      const level = (node as RichTextNode & { level?: number }).level ?? 2
      return `<h${level}>${renderChildren(node.children)}</h${level}>`
    }

    case 'list': {
      const listType = (node as RichTextNode & { listType?: string }).listType
      const tag = listType === 'ordered' ? 'ol' : 'ul'
      return `<${tag}>${renderChildren(node.children)}</${tag}>`
    }

    case 'list-item':
      return `<li>${renderChildren(node.children)}</li>`

    case 'link': {
      const href = node.url ?? '#'
      const target = node.target ? ` target="${node.target}"` : ''
      return `<a href="${href}"${target}>${renderChildren(node.children)}</a>`
    }

    case 'text': {
      let text = escapeHtml(node.value ?? '')
      if (node.bold) {
        text = `<strong>${text}</strong>`
      }
      if (node.italic) {
        text = `<em>${text}</em>`
      }
      // 改行を<br>に変換
      text = text.replace(/\n/g, '<br>')
      return text
    }

    default:
      // 未知のノードタイプは子要素をレンダリング
      return renderChildren(node.children)
  }
}

/**
 * 子ノードをレンダリング
 */
function renderChildren(children?: RichTextNode[]): string {
  if (!children || children.length === 0) return ''
  return children.map(renderNode).join('')
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, char => escapeMap[char] ?? char)
}
