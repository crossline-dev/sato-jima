import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from '@/env/server'

const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

// 同一IPから10分間に5回まで
const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      prefix: 'contact-form',
    })
  : null

export async function checkRateLimit(ip: string) {
  if (!ratelimit) {
    return { success: true, remaining: 999, reset: 0 }
  }
  const { success, remaining, reset } = await ratelimit.limit(ip)
  return { success, remaining, reset }
}
