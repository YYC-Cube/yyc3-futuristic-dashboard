import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('ISR工具函数测试套件', () => {
  describe('getCacheConfig() - 缓存配置生成', () => {
    it('应该生成包含Cache-Control头的配置', async () => {
      const { getCacheConfig } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {} as any
      const config = getCacheConfig(mockRequest)

      expect(config).toHaveProperty('Cache-Control')
      expect(config).toHaveProperty('CDN-Cache-Control')
      expect(config).toHaveProperty('Vercel-CDN-Cache-Control')
    })

    it('应该默认使用公共缓存策略', async () => {
      const { getCacheConfig } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {} as any
      const config = getCacheConfig(mockRequest)

      expect(config['Cache-Control']).toContain('public')
    })

    it('应该支持私有缓存配置', async () => {
      const { getCacheConfig } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {} as any
      const config = getCacheConfig(mockRequest, { isPublic: false })

      expect(config['Cache-Control']).toContain('private')
    })

    it('应该使用自定义revalidate时间', async () => {
      const { getCacheConfig } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {} as any
      const config = getCacheConfig(mockRequest, { revalidate: 120 })

      expect(config['Cache-Control']).toContain('s-maxage=120')
    })

    it('应该配置CDN缓存头', async () => {
      const { getCacheConfig } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {} as any
      const config = getCacheConfig(mockRequest)

      expect(config['CDN-Cache-Control']).toContain('public')
      expect(config['Vercel-CDN-Cache-Control']).toContain('public')
    })
  })

  describe('shouldRevalidate() - 重验证判断', () => {
    it('应该对有认证信息的请求返回true', async () => {
      const { shouldRevalidate } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {
        headers: new Map([['authorization', 'Bearer token123']]),
        method: 'GET',
      } as any

      expect(shouldRevalidate(mockRequest)).toBe(true)
    })

    it('应该对GET请求且无认证返回false', async () => {
      const { shouldRevalidate } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {
        headers: new Map(),
        method: 'GET',
      } as any

      expect(shouldRevalidate(mockRequest)).toBe(false)
    })

    it('应该对POST请求返回true', async () => {
      const { shouldRevalidate } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {
        headers: new Map(),
        method: 'POST',
      } as any

      expect(shouldRevalidate(mockRequest)).toBe(true)
    })

    it('应该对PUT请求返回true', async () => {
      const { shouldRevalidate } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {
        headers: new Map(),
        method: 'PUT',
      } as any

      expect(shouldRevalidate(mockRequest)).toBe(true)
    })

    it('应该对DELETE请求返回true', async () => {
      const { shouldRevalidate } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {
        headers: new Map(),
        method: 'DELETE',
      } as any

      expect(shouldRevalidate(mockRequest)).toBe(true)
    })

    it('应该对HEAD请求且无认证返回false', async () => {
      const { shouldRevalidate } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {
        headers: new Map(),
        method: 'HEAD',
      } as any

      expect(shouldRevalidate(mockRequest)).toBe(false)
    })
  })

  describe('withCache() - 带缓存的数据获取', () => {
    it('应该调用fetcher并返回数据', async () => {
      const { withCache } = await import('@/lib/cache/isr-utils')
      
      const mockFetcher = vi.fn().mockResolvedValue({ data: 'cached' })
      const result = await withCache('test-key', mockFetcher)

      expect(result).toEqual({ data: 'cached' })
      expect(mockFetcher).toHaveBeenCalled()
    })

    it('应该传递错误给fetcher', async () => {
      const { withCache } = await import('@/lib/cache/isr-utils')
      
      const error = new Error('Fetch failed')
      const mockFetcher = vi.fn().mockRejectedValue(error)

      await expect(withCache('error-key', mockFetcher)).rejects.toThrow('Fetch failed')
    })

    it('应该支持自定义TTL配置', async () => {
      const { withCache } = await import('@/lib/cache/isr-utils')
      
      const mockFetcher = vi.fn().mockResolvedValue({ ttl: 'custom' })
      const result = await withCache('ttl-key', mockFetcher, { ttl: 300 })

      expect(result).toEqual({ ttl: 'custom' })
    })
  })

  describe('generateETag() - ETag生成', () => {
    it('应该为相同数据生成相同的ETag', async () => {
      const { generateETag } = await import('@/lib/cache/isr-utils')
      
      const data = { id: 1, name: 'Test' }
      const etag1 = generateETag(data)
      const etag2 = generateETag(data)

      expect(etag1).toBe(etag2)
    })

    it('应该为不同数据生成不同的ETag', async () => {
      const { generateETag } = await import('@/lib/cache/isr-utils')
      
      const etag1 = generateETag({ id: 1 })
      const etag2 = generateETag({ id: 2 })

      expect(etag1).not.toBe(etag2)
    })

    it('应该生成带引号的ETag字符串', async () => {
      const { generateETag } = await import('@/lib/cache/isr-utils')
      
      const etag = generateETag('data')

      expect(etag).toMatch(/^".*"$/)
    })

    it('应该处理复杂数据结构', async () => {
      const { generateETag } = await import('@/lib/cache/isr-utils')
      
      const complexData = {
        users: [
          { id: 1, items: [1, 2, 3] },
          { id: 2, items: ['a', 'b'] }
        ],
        metadata: { version: '1.0', timestamp: Date.now() }
      }

      const etag = generateETag(complexData)
      expect(typeof etag).toBe('string')
      expect(etag.length).toBeGreaterThan(0)
    })
  })

  describe('validateETag() - ETag验证', () => {
    it('应该匹配相同的ETag', async () => {
      const { validateETag } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {
        headers: new Map([['if-none-match', '"abc123"']]),
      } as any

      expect(validateETag(mockRequest, '"abc123"')).toBe(true)
    })

    it('应该不匹配不同的ETag', async () => {
      const { validateETag } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {
        headers: new Map([['if-none-match', '"abc123"']]),
      } as any

      expect(validateETag(mockRequest, '"def456"')).toBe(false)
    })

    it('应该在没有if-none-match头时返回false', async () => {
      const { validateETag } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {
        headers: new Map(),
      } as any

      expect(validateETag(mockRequest, '"abc123"')).toBe(false)
    })

    it('应该处理多个ETag（逗号分隔）', async () => {
      const { validateETag } = await import('@/lib/cache/isr-utils')
      
      const mockRequest = {
        headers: new Map([['if-none-match', '"abc", "def", "xyz"']]),
      } as any

      expect(validateETag(mockRequest, '"def"')).toBe(true)
    })
  })

  describe('CacheMonitor() - 缓存监控', () => {
    beforeEach(async () => {
      const { CacheMonitor } = await import('@/lib/cache/isr-utils')
      CacheMonitor.reset()
    })

    it('应该记录缓存命中和未命中', async () => {
      const { CacheMonitor } = await import('@/lib/cache/isr-utils')
      
      CacheMonitor.recordHit('cache-key-1')
      CacheMonitor.recordMiss('cache-key-2')

      const stats = CacheMonitor.getStats()
      
      expect(stats.length).toBe(2)
      const hitStat = stats.find((s: any) => s.key === 'cache-key-1')
      const missStat = stats.find((s: any) => s.key === 'cache-key-2')
      expect(hitStat?.hits).toBe(1)
      expect(missStat?.misses).toBe(1)
    })

    it('应该计算命中率', async () => {
      const { CacheMonitor } = await import('@/lib/cache/isr-utils')
      
      for (let i = 0; i < 8; i++) {
        CacheMonitor.recordHit('popular-key')
      }
      for (let i = 0; i < 2; i++) {
        CacheMonitor.recordMiss('popular-key')
      }

      const stats = CacheMonitor.getStats()
      const keyStats = stats.find((s: any) => s.key === 'popular-key')

      expect(keyStats?.hitRate).toBe('80.00%')
    })

    it('应该重置统计信息', async () => {
      const { CacheMonitor } = await import('@/lib/cache/isr-utils')
      
      CacheMonitor.recordHit('reset-key')
      CacheMonitor.reset()

      const stats = CacheMonitor.getStats()
      expect(stats.length).toBe(0)
    })

    it('应该累积多次记录', async () => {
      const { CacheMonitor } = await import('@/lib/cache/isr-utils')
      
      CacheMonitor.recordHit('accumulated')
      CacheMonitor.recordHit('accumulated')
      CacheMonitor.recordMiss('accumulated')

      const stats = CacheMonitor.getStats()
      const keyStats = stats.find((s: any) => s.key === 'accumulated')

      expect(keyStats?.hits).toBe(2)
      expect(keyStats?.misses).toBe(1)
    })
  })
})
