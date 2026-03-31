import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { createStorefrontClient } from '@shopify/hydrogen-react'
import { print } from 'graphql'
import { env } from '@/env/client'
import {
  isShopifyApiError,
  processShopifyStorefrontResponse,
  rejectAsShopifyNetworkError,
  rejectAsShopifyParseError,
} from './shopify-api-error'

/**
 * Shopify Storefront Client (Client-side)
 *
 * クライアントサイド専用のクライアントです。
 * パブリックストアフロントトークンを使用します。
 *
 * 注意: サーバーサイドでは shopify-server-client.ts を使用してください。
 */
const client = createStorefrontClient({
  storeDomain: env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  storefrontApiVersion: env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION,
  publicStorefrontToken: env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN,
})

export const getStorefrontApiUrl = client.getStorefrontApiUrl
export const getPublicTokenHeaders = client.getPublicTokenHeaders

export interface ShopifyFetchOptions<TResult, TVariables> {
  query: TypedDocumentNode<TResult, TVariables>
  variables?: TVariables
  headers?: HeadersInit
  cache?: RequestCache
  tags?: string[]
}

export interface ShopifyFetchResult<TResult> {
  status: number
  body: { data: TResult }
}

/**
 * Shopify Storefront API への GraphQL リクエストを実行します（クライアントサイド用）
 *
 * パブリックトークンを使用するため、クライアントコンポーネントから
 * 呼び出す場合に使用してください。
 *
 * @example
 * const { body } = await shopifyClientFetch({
 *   query: ProductQuery,
 *   variables: { handle: 'example-product' },
 * });
 */
export async function shopifyClientFetch<TResult, TVariables>(
  options: ShopifyFetchOptions<TResult, TVariables>,
): Promise<ShopifyFetchResult<TResult>> {
  const {
    query,
    variables,
    headers,
    cache = 'force-cache',
    tags = [],
  } = options

  const queryStr = print(query)

  try {
    const result = await fetch(getStorefrontApiUrl(), {
      method: 'POST',
      headers: {
        ...getPublicTokenHeaders(),
        ...headers,
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
    rejectAsShopifyNetworkError(queryStr, error)
  }
}
