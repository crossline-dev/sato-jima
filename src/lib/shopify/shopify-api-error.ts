/**
 * Shopify Storefront API 呼び出しの統一エラー契約。
 * クライアント／サーバー双方の fetch で同一の型を throw する。
 */

export type ShopifyApiErrorKind = 'graphql' | 'http' | 'network' | 'parse'

/** GraphQL レスポンスの `errors[]` 要素（Shopify / GraphQL 仕様に沿った保持） */
export interface ShopifyGraphQLErrorEntry {
  message: string
  locations?: ReadonlyArray<{ line: number; column: number }>
  path?: ReadonlyArray<string | number>
  extensions?: Record<string, unknown>
}

export class ShopifyApiError extends Error {
  override readonly name = 'ShopifyApiError'

  readonly kind: ShopifyApiErrorKind

  /** HTTP レスポンスのステータス（取得できた場合） */
  readonly httpStatus?: number

  /** `kind === 'graphql'` のとき GraphQL `errors` 配列のコピー */
  readonly graphqlErrors?: readonly ShopifyGraphQLErrorEntry[]

  /** デバッグ用: 送信したクエリ文字列 */
  readonly query?: string

  /** HTTP エラー時など、応答ボディのスナップショット（型不明のまま保持） */
  readonly responseBody?: unknown

  constructor(options: {
    message: string
    kind: ShopifyApiErrorKind
    httpStatus?: number
    graphqlErrors?: readonly ShopifyGraphQLErrorEntry[]
    query?: string
    responseBody?: unknown
    cause?: unknown
  }) {
    super(options.message, { cause: options.cause })
    this.kind = options.kind
    this.httpStatus = options.httpStatus
    this.graphqlErrors = options.graphqlErrors
    this.query = options.query
    this.responseBody = options.responseBody
  }
}

export function isShopifyApiError(value: unknown): value is ShopifyApiError {
  return value instanceof ShopifyApiError
}

/** `response.json()` 失敗など */
export function rejectAsShopifyParseError(
  queryStr: string,
  httpStatus: number | undefined,
  cause: unknown,
): never {
  throw new ShopifyApiError({
    kind: 'parse',
    message: 'Failed to parse Shopify response as JSON',
    httpStatus,
    query: queryStr,
    cause,
  })
}

/** `fetch` 失敗・その他ネットワーク例外 */
export function rejectAsShopifyNetworkError(
  queryStr: string,
  cause: unknown,
): never {
  throw new ShopifyApiError({
    kind: 'network',
    message:
      cause instanceof Error
        ? cause.message
        : 'Shopify Storefront request failed',
    query: queryStr,
    cause,
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * API の `errors` 配列を正規化（message 必須の要素のみ採用）
 */
/**
 * fetch 完了後の Response と JSON ボディを検証し、成功時は `{ status, body }` を返す。
 * GraphQL errors / HTTP 失敗は `ShopifyApiError` を throw。
 */
export function processShopifyStorefrontResponse<TResult>(
  result: Response,
  body: unknown,
  queryStr: string,
): { status: number; body: { data: TResult } } {
  if (typeof body !== 'object' || body === null) {
    throw new ShopifyApiError({
      kind: 'parse',
      message: 'Invalid Shopify response: expected JSON object',
      httpStatus: result.status,
      query: queryStr,
      responseBody: body,
    })
  }

  const graphqlErrors = normalizeShopifyGraphQLErrors(
    (body as { errors?: unknown }).errors,
  )
  if (graphqlErrors.length > 0) {
    console.error(
      '[Shopify GraphQL Error]',
      JSON.stringify(graphqlErrors, null, 2),
    )
    const first = graphqlErrors[0]
    throw new ShopifyApiError({
      kind: 'graphql',
      message: first?.message ?? 'GraphQL error',
      graphqlErrors,
      httpStatus: result.status,
      query: queryStr,
    })
  }

  if (!result.ok) {
    throw new ShopifyApiError({
      kind: 'http',
      message: `Shopify HTTP error: ${result.status} ${result.statusText}`.trim(),
      httpStatus: result.status,
      query: queryStr,
      responseBody: body,
    })
  }

  return {
    status: result.status,
    body: body as { data: TResult },
  }
}

export function normalizeShopifyGraphQLErrors(
  raw: unknown,
): ShopifyGraphQLErrorEntry[] {
  if (!Array.isArray(raw)) {
    return []
  }
  const out: ShopifyGraphQLErrorEntry[] = []
  for (const item of raw) {
    if (!isRecord(item) || typeof item.message !== 'string') {
      continue
    }
    const entry: ShopifyGraphQLErrorEntry = { message: item.message }
    if (Array.isArray(item.locations)) {
      entry.locations = item.locations as ShopifyGraphQLErrorEntry['locations']
    }
    if (item.path !== undefined) {
      entry.path = item.path as ShopifyGraphQLErrorEntry['path']
    }
    if (isRecord(item.extensions)) {
      entry.extensions = item.extensions as Record<string, unknown>
    }
    out.push(entry)
  }
  return out
}
