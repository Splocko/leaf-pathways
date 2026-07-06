import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Build the limiter lazily and ONLY when Upstash is configured. Without the env
// vars we skip rate limiting entirely (fail open) so /api routes keep working —
// constructing Redis with empty credentials can throw, so we never do that.
let ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  if (!ratelimit) {
    try {
      ratelimit = new Ratelimit({
        redis: new Redis({ url, token }),
        // Sliding window: 150 requests per minute per IP (launch traffic).
        limiter: Ratelimit.slidingWindow(150, '1 m'),
      })
    } catch (e) {
      console.error('[middleware] failed to init rate limiter', e)
      return null
    }
  }
  return ratelimit
}

export async function middleware(req: NextRequest) {
  const limiter = getRatelimit()
  if (!limiter) return NextResponse.next() // rate limiting disabled (no Upstash env)

  try {
    // Prefer x-forwarded-for behind proxies; fall back to real-ip or 'anon'.
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : (req.ip as string | undefined) || req.headers.get('x-real-ip') || 'anon'

    const { success, limit, reset, remaining } = await limiter.limit(ip)

    if (!success) {
      const resHeaders = new Headers()
      resHeaders.set('X-RateLimit-Limit', String(limit))
      resHeaders.set('X-RateLimit-Remaining', String(remaining))
      resHeaders.set('X-RateLimit-Reset', String(reset))
      return new NextResponse('Too Many Requests', { status: 429, headers: resHeaders })
    }

    const resp = NextResponse.next()
    resp.headers.set('X-RateLimit-Limit', String(limit))
    resp.headers.set('X-RateLimit-Remaining', String(remaining))
    resp.headers.set('X-RateLimit-Reset', String(reset))
    return resp
  } catch (e) {
    // Rate limiter service failure → fail open (allow request), log server-side.
    console.error('[middleware] rate limit error', e)
    return NextResponse.next()
  }
}

// Only match API routes to avoid throttling pages and static assets.
export const config = {
  matcher: ['/api/:path*'],
}
