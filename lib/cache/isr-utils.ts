import type { NextRequest } from "next/server"

export function getCacheConfig(request: NextRequest, options: {
  revalidate?: number
  staleWhileRevalidate?: number
  isPublic?: boolean
} = {}) {
  const {
    revalidate = 60,
    staleWhileRevalidate = 30,
    isPublic = true,
  } = options

  const cacheControl = [
    isPublic ? "public" : "private",
    `s-maxage=${revalidate}`,
    `stale-while-revalidate=${staleWhileRevalidate}`,
  ].join(", ")

  const cdnCacheControl = [
    "public",
    `max-age=${revalidate * 6}`,
    `stale-while-revalidate=${revalidate * 24}`,
  ].join(", ")

  return {
    "Cache-Control": cacheControl,
    "CDN-Cache-Control": cdnCacheControl,
    "Vercel-CDN-Cache-Control": cdnCacheControl,
  }
}

export function shouldRevalidate(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  const hasAuth = !!authHeader

  if (hasAuth) {
    return true
  }

  const method = request.method
  if (method !== "GET" && method !== "HEAD") {
    return true
  }

  return false
}

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number
    staleTtl?: number
  } = {}
): Promise<T> {
  const { ttl = 60, staleTtl = 300 } = options

  try {
    if (typeof window === "undefined") {
      const NodeCache = (await import("node-cache")).default
      const cache = new NodeCache({
        stdTTL: ttl,
        checkperiod: ttl / 2,
        useClones: false,
      })

      const cached = cache.get<T>(key)

      if (cached !== undefined) {
        return cached
      }

      const data = await fetcher()
      cache.set(key, data, ttl)
      return data
    }
  } catch (error) {
    console.error("[Cache] Error:", error)
  }

  return fetcher()
}

export function generateETag(data: unknown): string {
  const str = JSON.stringify(data)
  
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  return `"${Math.abs(hash).toString(16)}"`
}

export function validateETag(request: NextRequest, etag: string): boolean {
  const ifNoneMatch = request.headers.get("if-none-match")
  
  if (!ifNoneMatch) {
    return false
  }

  return ifNoneMatch === etag || ifNoneMatch.includes(etag)
}

export interface CacheStats {
  hits: number
  misses: number
  hitRate: string
}

export class CacheMonitor {
  private static stats: Map<string, { hits: number; misses: number }> = new Map()

  static recordHit(key: string) {
    const current = this.stats.get(key) || { hits: 0, misses: 0 }
    current.hits++
    this.stats.set(key, current)
  }

  static recordMiss(key: string) {
    const current = this.stats.get(key) || { hits: 0, misses: 0 }
    current.misses++
    this.stats.set(key, current)
  }

  static getStats(): CacheStats[] {
    return Array.from(this.stats.entries()).map(([key, value]) => ({
      key,
      ...value,
      hitRate: `${((value.hits / (value.hits + value.misses)) * 100).toFixed(2)}%`,
    }))
  }

  static reset() {
    this.stats.clear()
  }
}
