import type { CodegenConfig } from '@graphql-codegen/cli'

/**
 * GraphQL Codegen 設定
 *
 * 注意: このファイルは Next.js の外部で実行されるため、
 * process.env を直接使用しています。
 * .env ファイルの値は pnpm の --env-file オプションで読み込まれます。
 */

const storeDomain =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  'https://sato-triplets.myshopify.com'
const apiVersion =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION || '2025-07'
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN || ''

if (!accessToken) {
  console.warn(
    '⚠️  NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN が設定されていません。',
  )
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [`${storeDomain}/api/${apiVersion}/graphql.json`]: {
        headers: {
          'X-Shopify-Storefront-Access-Token': accessToken,
        },
      },
    },
  ],
  documents: [
    'src/lib/shopify/queries/**/*.ts',
    'src/lib/shopify/mutations/**/*.ts',
    'src/lib/shopify/fragments/**/*.ts',
  ],
  generates: {
    'src/lib/shopify/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
