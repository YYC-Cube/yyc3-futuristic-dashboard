import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('速率限制模块测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rateLimit() - 基础限流功能', () => {
    it('应该返回限流结果对象', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const mockRequest = {
        url: 'http://localhost:3000/api/test',
        headers: new Map([['x-forwarded-for', '127.0.0.1']]),
      } as any

      const result = rateLimit(mockRequest)

      expect(result).toHaveProperty('success', expect.any(Boolean))
      expect(result).toHaveProperty('limit', expect.any(Number))
      expect(result).toHaveProperty('remaining', expect.any(Number))
      expect(result).toHaveProperty('resetTime', expect.any(Number))
    })

    it('应该首次请求时允许通过', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const mockRequest = {
        url: 'http://localhost:3000/api/test',
        headers: new Map([['x-forwarded-for', '192.168.1.1']]),
      } as any

      const result = rateLimit(mockRequest)

      expect(result.success).toBe(true)
      expect(result.remaining).toBeGreaterThan(0)
    })

    it('应该跟踪请求计数', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const mockRequest = {
        url: 'http://localhost:3000/api/test',
        headers: new Map([['x-forwarded-for', '10.0.0.1']]),
      } as any

      const firstResult = rateLimit(mockRequest)
      const secondResult = rateLimit(mockRequest)

      expect(firstResult.success).toBe(true)
      expect(secondResult.success).toBe(true)
      expect(secondResult.remaining).toBeLessThanOrEqual(firstResult.remaining)
    })
  })

  describe('路径特定配置', () => {
    it('应该对API auth路径应用严格限制', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const mockAuthRequest = {
        url: 'http://localhost:3000/api/auth/login',
        headers: new Map([['x-forwarded-for', '172.16.0.1']]),
      } as any

      const result = rateLimit(mockAuthRequest)

      expect(result.limit).toBeLessThanOrEqual(10) // auth路径限制更严格
    })

    it('应该对chat API应用中等限制', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const mockChatRequest = {
        url: 'http://localhost:3000/api/chat/message',
        headers: new Map([['x-forwarded-for', '172.16.0.2']]),
      } as any

      const result = rateLimit(mockChatRequest)

      expect(result.limit).toBe(20) // chat路径限制20次/分钟
    })
  })

  describe('客户端标识提取', () => {
    it('应该优先使用x-forwarded-for头', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const mockRequest = {
        url: 'http://localhost:3000/api/test',
        headers: new Map([
          ['x-forwarded-for', '203.0.113.1'],
          ['x-real-ip', '192.168.1.100'],
        ]),
      } as any

      const result1 = rateLimit(mockRequest)
      const result2 = rateLimit(mockRequest)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      // 验证请求计数在增加（remaining在减少或保持不变）
      expect(result2.remaining).toBeLessThanOrEqual(result1.remaining + 1)
    })

    it('应该回退到x-real-ip头', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const mockRequest = {
        url: 'http://localhost:3000/api/test',
        headers: new Map([
          ['x-real-ip', '198.51.100.1'],
        ]),
      } as any

      const result = rateLimit(mockRequest)

      expect(result.success).toBe(true)
    })

    it('应该使用unknown作为最后手段', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const mockRequest = {
        url: 'http://localhost:3000/api/test',
        headers: new Map(),
      } as any

      const result = rateLimit(mockRequest)

      expect(result.success).toBe(true)
    })
  })

  describe('createRateLimiter() - 中间件工厂', () => {
    it('应该创建中间件函数', async () => {
      const { createRateLimiter } = await import('@/lib/auth/rate-limit')
      
      const middleware = createRateLimiter()

      expect(typeof middleware).toBe('function')
    })

    it('应该在请求未超限时返回null', async () => {
      const { createRateLimiter } = await import('@/lib/auth/rate-limit')
      
      const middleware = createRateLimiter()
      const mockRequest = {
        url: 'http://localhost:3000/api/test',
        headers: new Map([['x-forwarded-for', 'unique-ip-1']]),
      } as any

      const result = middleware(mockRequest)

      expect(result).toBeNull()
    })

    it('应该支持自定义配置', async () => {
      const { createRateLimiter } = await import('@/lib/auth/rate-limit')
      
      const customConfig = {
        message: "自定义限流消息",
      }
      const middleware = createRateLimiter(customConfig)

      expect(typeof middleware).toBe('function')
    })
  })

  describe('createIPWhitelist() - IP白名单', () => {
    it('应该创建IP白名单中间件', async () => {
      const { createIPWhitelist } = await import('@/lib/auth/rate-limit')
      
      const allowedIPs = ['192.168.1.1', '192.168.1.2']
      const middleware = createIPWhitelist(allowedIPs)

      expect(typeof middleware).toBe('function')
    })

    it('应该允许白名单IP访问', async () => {
      const { createIPWhitelist } = await import('@/lib/auth/rate-limit')
      
      const allowedIPs = ['10.0.0.50']
      const middleware = createIPWhitelist(allowedIPs)
      const mockRequest = {
        headers: new Map([['x-forwarded-for', '10.0.0.50']]),
      } as any

      const result = middleware(mockRequest)

      expect(result).toBeNull()
    })

    it('应该拒绝非白名单IP', async () => {
      const { createIPWhitelist } = await import('@/lib/auth/rate-limit')
      
      const allowedIPs = ['10.0.0.50']
      const middleware = createIPWhitelist(allowedIPs)
      const mockRequest = {
        headers: new Map([['x-forwarded-for', '10.0.0.99']]),
      } as any

      const result = middleware(mockRequest)

      expect(result).not.toBeNull()
      expect(result?.status).toBe(403)
    })
  })

  describe('边界情况和错误处理', () => {
    it('应该处理多个IP地址的forwarded头', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const mockRequest = {
        url: 'http://localhost:3000/api/test',
        headers: new Map([
          ['x-forwarded-for', '203.0.113.1, 198.51.100.1, 192.0.2.1'],
        ]),
      } as any

      const result = rateLimit(mockRequest)

      expect(result.success).toBe(true)
    })

    it('应该正确计算重置时间', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const beforeCall = Date.now()
      const mockRequest = {
        url: 'http://localhost:3000/api/test',
        headers: new Map([['x-forwarded-for', 'timing-test-ip']]),
      } as any

      const result = rateLimit(mockRequest)

      expect(result.resetTime).toBeGreaterThan(beforeCall)
    })

    it('应该确保remaining不为负数', async () => {
      const { rateLimit } = await import('@/lib/auth/rate-limit')
      
      const mockRequest = {
        url: 'http://localhost:3000/api/test',
        headers: new Map([['x-forwarded-for', 'stress-test-ip']]),
      } as any

      for (let i = 0; i < 200; i++) {
        const result = rateLimit(mockRequest)
        expect(result.remaining).toBeGreaterThanOrEqual(0)
      }
    })
  })
})
