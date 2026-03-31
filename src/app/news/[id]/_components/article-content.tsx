import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from 'html-react-parser'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'

interface ArticleContentProps {
  html: string
  className?: string
}

/**
 * html-react-parser のオプション
 * 各HTMLタグにカスタムスタイリングを適用
 */
const parserOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if (!(domNode instanceof Element)) {
      return
    }

    const { name, attribs, children } = domNode

    switch (name) {
      // 見出し
      case 'h1':
        return (
          <h1 className='mt-10 mb-6 font-bold text-2xl text-heading'>
            {domToReact(children as DOMNode[], parserOptions)}
          </h1>
        )
      case 'h2':
        return (
          <h2 className='mt-10 mb-5 font-bold text-heading text-xl'>
            {domToReact(children as DOMNode[], parserOptions)}
          </h2>
        )
      case 'h3':
        return (
          <h3 className='mt-10 mb-4 border-heading border-l-2 pl-3 font-medium text-base text-heading'>
            {domToReact(children as DOMNode[], parserOptions)}
          </h3>
        )
      case 'h4':
        return (
          <h4 className='mt-6 mb-3 font-bold text-base text-heading'>
            {domToReact(children as DOMNode[], parserOptions)}
          </h4>
        )

      // 段落
      case 'p':
        return (
          <p className='mb-4 text-sm leading-loose tracking-wide'>
            {domToReact(children as DOMNode[], parserOptions)}
          </p>
        )

      // リンク
      case 'a': {
        const href = attribs.href || '#'
        const isExternal = href.startsWith('http') || href.startsWith('mailto:')

        if (isExternal) {
          return (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary underline underline-offset-4 transition-opacity hover:opacity-80'>
              {domToReact(children as DOMNode[], parserOptions)}
            </a>
          )
        }

        return (
          <Link
            href={href as Route}
            className='text-primary underline underline-offset-4 transition-opacity hover:opacity-80'>
            {domToReact(children as DOMNode[], parserOptions)}
          </Link>
        )
      }

      // 画像
      case 'img': {
        const src = attribs.src || ''
        const alt = attribs.alt || ''
        const width = Number(attribs.width) || 800
        const height = Number(attribs.height) || 450

        return (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className='my-6 h-auto w-full rounded-lg'
          />
        )
      }

      // リスト
      case 'ul':
        return (
          <ul className='mb-4 list-disc space-y-2 pl-6'>
            {domToReact(children as DOMNode[], parserOptions)}
          </ul>
        )
      case 'ol':
        return (
          <ol className='mb-4 list-decimal space-y-2 pl-6'>
            {domToReact(children as DOMNode[], parserOptions)}
          </ol>
        )
      case 'li':
        return (
          <li className='text-foreground leading-relaxed'>
            {domToReact(children as DOMNode[], parserOptions)}
          </li>
        )

      // 引用
      case 'blockquote':
        return (
          <blockquote className='my-6 border-primary border-l-4 pl-4 text-muted-foreground italic'>
            {domToReact(children as DOMNode[], parserOptions)}
          </blockquote>
        )

      // コード
      case 'code':
        return (
          <code className='rounded bg-muted px-1.5 py-0.5 font-mono text-sm'>
            {domToReact(children as DOMNode[], parserOptions)}
          </code>
        )
      case 'pre':
        return (
          <pre className='my-6 overflow-x-auto rounded-lg bg-muted p-4'>
            {domToReact(children as DOMNode[], parserOptions)}
          </pre>
        )

      // 強調
      case 'strong':
      case 'b':
        return (
          <strong className='font-bold'>
            {domToReact(children as DOMNode[], parserOptions)}
          </strong>
        )
      case 'em':
      case 'i':
        return (
          <em className='italic'>
            {domToReact(children as DOMNode[], parserOptions)}
          </em>
        )

      // 水平線
      case 'hr':
        return <hr className='my-8 border-border' />

      // テーブル
      case 'table':
        return (
          <div className='my-6 overflow-x-auto'>
            <table className='w-full border-collapse border border-border'>
              {domToReact(children as DOMNode[], parserOptions)}
            </table>
          </div>
        )
      case 'th':
        return (
          <th className='border border-border bg-muted px-4 py-2 text-left font-bold'>
            {domToReact(children as DOMNode[], parserOptions)}
          </th>
        )
      case 'td':
        return (
          <td className='border border-border px-4 py-2'>
            {domToReact(children as DOMNode[], parserOptions)}
          </td>
        )

      default:
        return undefined
    }
  },
}

/**
 * 記事本文をパースしてスタイリングを適用するコンポーネント
 */
export function ArticleContent({ html, className }: ArticleContentProps) {
  return <div className={className}>{parse(html, parserOptions)}</div>
}
