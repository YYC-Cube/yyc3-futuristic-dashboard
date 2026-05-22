import { NextRequest, NextResponse } from "next/server"
import NodeCache from "node-cache"

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
}

const rateLimitCache = new NodeCache({
  stdTTL: 60,
  checkperiod: 10,
  useClones: false,
})

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  "/api/auth": {
    windowMs: 15 * 60 * 1000,
    maxRequests: 10,
    message: "登录尝试次数过多，请15分钟后重试",
  },
  "/api/chat": {
    windowMs: 60 * 1000,
    maxRequests: 20,
    message: "API 调用频率过高，请稍后重试",
  },
  default: {
    windowMs: 60 * 1000,
    maxRequests: 100,
    message: "请求过于频繁，请稍后重试",
  },
}

interface RateLimitInfo {
  count: number
  resetTime: number
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  
  return forwarded?.split(",")[0]?.trim() || 
         realIp || 
         "unknown"
}

function getConfigForPath(pathname: string): RateLimitConfig {
  for (const [pattern, config] of Object.entries(DEFAULT_CONFIGS)) {
    if (pathname.startsWith(pattern)) {
      return config
    }
  }
  return DEFAULT_CONFIGS.default
}

export function rateLimit(request: NextRequest): {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
} {
  const clientId = getClientIdentifier(request)
  const pathname = new URL(request.url).pathname
  const config = getConfigForPath(pathname)

  const cacheKey = `ratelimit:${clientId}:${pathname}`
  let info = rateLimitCache.get<RateLimitInfo>(cacheKey)

  const now = Date.now()

  if (!info || now > info.resetTime) {
    info = {
      count: 1,
      resetTime: now + config.windowMs,
    }
  } else {
    info.count++
  }

  rateLimitCache.set(cacheKey, info, config.windowMs / 1000)

  return {
    success: info.count <= config.maxRequests,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - info.count),
    resetTime: info.resetTime,
  }
}

export function createRateLimiter(config?: Partial<RateLimitConfig>) {
  return (request: NextRequest): NextResponse | null => {
    const result = rateLimit(request)
    
    if (result.success) {
      const response = NextResponse.next()
      response.headers.set("X-RateLimit-Limit", result.limit.toString())
      response.headers.set("X-RateLimit-Remaining", result.remaining.toString())
      response.headers.set("X-RateLimit-Reset", result.resetTime.toString())
      return null
    }

    const pathname = new URL(request.url).pathname
    const pathConfig = getConfigForPath(pathname)
    const finalConfig = { ...pathConfig, ...config }

    return NextResponse.json(
      {
        error: "Too Many Requests",
        message: finalConfig.message || "请求过于频繁",
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": result.resetTime.toString(),
          "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
        },
      }
    )
  }
}

export function createIPWhitelist(allowedIPs: string[]) {
  return (request: NextRequest): NextResponse | null => {
    const ip = getClientIdentifier(request)
    
    if (!allowedIPs.includes(ip)) {
      return NextResponse.json(
        { error: "Forbidden", message: "IP 地址不在允许列表中" },
        { status: 403 }
      )
    }

    return null
  }
}

export function cleanupExpiredEntries(): void {
  const keys = rateLimitCache.keys()
  const now = Date.now()

  keys.forEach(key => {
    const info = rateLimitCache.get<RateLimitInfo>(key)
    if (info && now > info.resetTime) {
      rateLimitCache.del(key)
    }
  })
}

setInterval(cleanupExpiredEntries, 5 * 60 * 1000)
