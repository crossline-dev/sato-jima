import { CaretRightIcon } from '@phosphor-icons/react/ssr'
import type { Route } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/utils/classes'

export interface BreadcrumbData {
  label: string
  /** アプリ内のパス（`next` の静的ルート型に合わせる） */
  href?: Route
}

interface BreadcrumbsProps {
  items: BreadcrumbData[]
  className?: string
  baseUrl?: string
}

export function Breadcrumbs({ items, className, baseUrl }: BreadcrumbsProps) {
  // JSON-LD 構造化データの生成
  const host = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${host}${item.href}` : undefined,
    })),
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumb className={cn('py-4', className)}>
        <BreadcrumbList className='font-en text-xs'>
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <div key={item.label} className='flex items-center gap-1'>
                <BreadcrumbItem>
                  {item.href && !isLast ? (
                    <BreadcrumbLink render={<Link href={item.href} />}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className='max-w-50 truncate md:max-w-100'>
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <CaretRightIcon weight='light' />
                  </BreadcrumbSeparator>
                )}
              </div>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
