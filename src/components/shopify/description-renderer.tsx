'use client'

import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from 'html-react-parser'

const parserOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if (!(domNode instanceof Element)) return

    const children = domToReact(domNode.children as DOMNode[], parserOptions)

    switch (domNode.name) {
      case 'p':
        return (
          <p className='mb-4 text-sm leading-loose tracking-wide last:mb-0'>
            {children}
          </p>
        )

      case 'ul':
        return <ul className='mb-4 list-disc space-y-1 pl-5'>{children}</ul>

      case 'li':
        return <li className='text-muted-foreground'>{children}</li>

      case 'a':
        return (
          <a
            href={domNode.attribs.href}
            target={domNode.attribs.target}
            rel={domNode.attribs.rel || 'noopener noreferrer'}
            className='text-primary underline transition-colors hover:text-primary/80'>
            {children}
          </a>
        )

      case 'strong':
        return (
          <strong className='font-semibold text-foreground'>{children}</strong>
        )
    }
  },
}

interface DescriptionRendererProps {
  html: string
  className?: string
}

export function DescriptionRenderer({
  html,
  className,
}: DescriptionRendererProps) {
  if (!html) return null

  return <div className={className}>{parse(html, parserOptions)}</div>
}
