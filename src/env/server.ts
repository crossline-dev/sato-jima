import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SHOPIFY_STOREFRONT_SECRET_TOKEN: z.string().min(1),
    SHOPIFY_REVALIDATION_SECRET: z.string().min(1),
    MICROCMS_SERVICE_DOMAIN: z.string().min(1),
    MICROCMS_API_KEY: z.string().min(1),
    MICROCMS_WEBHOOK_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z.string().min(1),
    RESEND_TO_EMAIL: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    SHOPIFY_STOREFRONT_SECRET_TOKEN:
      process.env.SHOPIFY_STOREFRONT_SECRET_TOKEN,
    SHOPIFY_REVALIDATION_SECRET: process.env.SHOPIFY_REVALIDATION_SECRET,
    MICROCMS_SERVICE_DOMAIN: process.env.MICROCMS_SERVICE_DOMAIN,
    MICROCMS_API_KEY: process.env.MICROCMS_API_KEY,
    MICROCMS_WEBHOOK_SECRET: process.env.MICROCMS_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    RESEND_TO_EMAIL: process.env.RESEND_TO_EMAIL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
})
