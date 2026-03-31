import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from '@/env/server'

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

// 同一IPから10分間に5回まで
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  prefix: 'contact-form',
})

export async function checkRateLimit(ip: string) {
  const { success, remaining, reset } = await ratelimit.limit(ip)
  return { success, remaining, reset }
}
