import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: z.url(),
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN: z.string(),
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION: z.string(),
    NEXT_PUBLIC_SHOPIFY_SHOP_ID: z.string().optional(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN:
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION:
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION,
    NEXT_PUBLIC_SHOPIFY_SHOP_ID: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID,
  },
})
