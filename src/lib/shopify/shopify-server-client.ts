import 'server-only'

import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { createStorefrontClient } from '@shopify/hydrogen-react'
import { print } from 'graphql'
import { headers } from 'next/headers'
import { env as clientEnv } from '@/env/client'
import { env as serverEnv } from '@/env/server'
import {
  isShopifyApiError,
  processShopifyStorefrontResponse,
  rejectAsShopifyNetworkError,
  rejectAsShopifyParseError,
} from './shopify-api-error'

/**
 * Shopify Storefront Client (Server-side)
 *
 * サーバーサイド専用のクライアントです。
 */
const serverClient = createStorefrontClient({
  storeDomain: clientEnv.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  storefrontApiVersion: clientEnv.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION,
  privateStorefrontToken: serverEnv.SHOPIFY_STOREFRONT_SECRET_TOKEN,
})

export const getStorefrontApiUrl = serverClient.getStorefrontApiUrl
export const getPrivateTokenHeaders = serverClient.getPrivateTokenHeaders

// ============================================================================
// Types
// ============================================================================

export interface ShopifyFetchOptions<TResult, TVariables> {
  query: TypedDocumentNode<TResult, TVariables>
  variables?: TVariables
  headers?: HeadersInit
  cache?: RequestCache
  tags?: string[]
}

/**
 * 静的生成用のオプション（headers は使用しない）
 */
export type ShopifyFetchStaticOptions<TResult, TVariables> = Omit<
  ShopifyFetchOptions<TResult, TVariables>,
  'headers'
>

export interface ShopifyFetchResult<TResult> {
  status: number
  body: { data: TResult }
}

// ============================================================================
// Internal: Core fetch implementation
// ============================================================================

interface InternalFetchOptions<TResult, TVariables> {
  query: TypedDocumentNode<TResult, TVariables>
  variables?: TVariables
  headersInit?: HeadersInit
  cache: RequestCache
  tags: string[]
  buyerIp?: string
}

async function shopifyFetchInternal<TResult, TVariables>(
  options: InternalFetchOptions<TResult, TVariables>,
): Promise<ShopifyFetchResult<TResult>> {
  const { query, variables, headersInit, cache, tags, buyerIp } = options
  const queryStr = print(query)

  try {
    const result = await fetch(getStorefrontApiUrl(), {
      method: 'POST',
      headers: {
        ...getPrivateTokenHeaders({ buyerIp }),
        ...headersInit,
      },
      body: JSON.stringify({
        query: queryStr,
        ...(variables && { variables }),
      }),
      cache,
      next: { tags },
    })

    let body: unknown
    try {
      body = await result.json()
    } catch (error) {
      rejectAsShopifyParseError(queryStr, result.status, error)
    }

    return processShopifyStorefrontResponse<TResult>(result, body, queryStr)
  } catch (error) {
    if (isShopifyApiError(error)) {
      throw error
    }
    console.error('[Shopify Fetch Error]', error)
    rejectAsShopifyNetworkError(queryStr, error)
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Shopify Storefront API への GraphQL リクエストを実行します（動的リクエスト用）
 *
 * - リクエストコンテキスト内で呼び出す必要があります
 * - buyerIp を自動取得してアナリティクスに使用します
 * - Server Components、Server Actions、Route Handlers で使用してください
 *
 * @example
 * ```ts
 * const result = await shopifyFetch({
 *   query: ProductQuery,
 *   variables: { handle: 'my-product' },
 *   tags: ['products'],
 * })
 * ```
 */
export async function shopifyFetch<TResult, TVariables>(
  options: ShopifyFetchOptions<TResult, TVariables>,
): Promise<ShopifyFetchResult<TResult>> {
  const {
    query,
    variables,
    headers: headersInit,
    cache = 'force-cache',
    tags = [],
  } = options

  // リクエストコンテキストから buyerIp を取得
  const headerList = await headers()
  const buyerIp = headerList.get('x-forwarded-for')?.split(',')[0]

  return shopifyFetchInternal({
    query,
    variables,
    headersInit,
    cache,
    tags,
    buyerIp,
  })
}

/**
 * Shopify Storefront API への GraphQL リクエストを実行します（静的生成用）
 *
 * - リクエストコンテキスト外で呼び出し可能です
 * - buyerIp は使用しません（アナリティクス情報なし）
 * - generateStaticParams、ISR、ビルド時のデータ取得に使用してください
 *
 * @example
 * ```ts
 * // generateStaticParams で使用
 * export async function generateStaticParams() {
 *   const result = await shopifyFetchStatic({
 *     query: AllProductHandlesQuery,
 *     tags: ['products'],
 *   })
 *   return result.body.data.products.edges.map(...)
 * }
 * ```
 */
export async function shopifyFetchStatic<TResult, TVariables>(
  options: ShopifyFetchStaticOptions<TResult, TVariables>,
): Promise<ShopifyFetchResult<TResult>> {
  const { query, variables, cache = 'force-cache', tags = [] } = options

  return shopifyFetchInternal({
    query,
    variables,
    cache,
    tags,
    // buyerIp は意図的に undefined（静的生成では利用不可）
  })
}
