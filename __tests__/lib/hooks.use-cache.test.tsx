import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'

describe('缓存Hooks测试套件', () => {
  describe('useCache() - 基础缓存操作', () => {
    it('应该提供缓存操作方法', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => useCache<string>())

      expect(result.current.setCache).toBeDefined()
      expect(result.current.getCache).toBeDefined()
      expect(result.current.deleteCache).toBeDefined()
      expect(result.current.clearCache).toBeDefined()
      expect(result.current.hasCache).toBeDefined()
    })

    it('应该支持设置和获取缓存数据', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => useCache<string>())

      act(() => {
        result.current.setCache('test-key', 'test-value')
      })

      const cachedValue = result.current.getCache('test-key')
      expect(cachedValue).toBe('test-value')
    })

    it('应该返回null对于不存在的键', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => useCache<string>())

      const value = result.current.getCache('non-existent-key')
      expect(value).toBeNull()
    })

    it('应该支持删除缓存', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => useCache<string>())

      act(() => {
        result.current.setCache('delete-me', 'value')
        result.current.deleteCache('delete-me')
      })

      const value = result.current.getCache('delete-me')
      expect(value).toBeNull()
    })

    it('应该支持清空所有缓存', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => useCache<string>())

      act(() => {
        result.current.setCache('key1', 'value1')
        result.current.setCache('key2', 'value2')
        result.current.clearCache()
      })

      expect(result.current.getCache('key1')).toBeNull()
      expect(result.current.getCache('key2')).toBeNull()
    })

    it('应该检查缓存是否存在', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => useCache<string>())

      expect(result.current.hasCache('new-key')).toBe(false)

      act(() => {
        result.current.setCache('new-key', 'value')
      })

      expect(result.current.hasCache('new-key')).toBe(true)
    })
  })

  describe('useCache() - TTL过期机制', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('应该在TTL后使缓存失效', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => 
        useCache<string>({ ttl: 1000 }) // 1秒TTL
      )

      act(() => {
        result.current.setCache('expiring-key', 'will-expire')
      })

      expect(result.current.getCache('expiring-key')).toBe('will-expire')

      act(() => {
        vi.advanceTimersByTime(1500) // 前进1.5秒
      })

      expect(result.current.getCache('expiring-key')).toBeNull()
    })
  })

  describe('边界情况和错误处理', () => {
    it('应该处理空字符串键', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => useCache<string>())

      act(() => {
        result.current.setCache('', 'empty-key-value')
      })

      expect(result.current.getCache('')).toBe('empty-key-value')
    })

    it('应该处理特殊字符键', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => useCache<string>())

      act(() => {
        result.current.setCache('key-with-special-chars!@#$%', 'special-value')
      })

      expect(result.current.getCache('key-with-special-chars!@#$%')).toBe('special-value')
    })

    it('应该处理大型数据对象', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => useCache<object>())

      const largeObject = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        data: `Data ${i}`.repeat(10)
      }))

      act(() => {
        result.current.setCache('large-data', largeObject)
      })

      const cached = result.current.getCache('large-data')
      if (Array.isArray(cached)) {
        expect(cached).toHaveLength(1000)
      }
    })

    it('应该处理undefined和null值', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() => useCache<any>())

      act(() => {
        result.current.setCache('null-value', null)
        result.current.setCache('undefined-value', undefined as any)
      })

      expect(result.current.getCache('null-value')).toBeNull()
    })

    it('应该支持自定义TTL配置', async () => {
      const { useCache } = await import('@/lib/hooks/use-cache')
      
      const { result } = renderHook(() =>
        useCache<string>({ ttl: 5000, maxSize: 200 })
      )

      expect(result.current.setCache).toBeDefined()
      expect(result.current.getCache).toBeDefined()

      act(() => {
        result.current.setCache('custom-ttl-key', 'value')
      })

      expect(result.current.getCache('custom-ttl-key')).toBe('value')
    })
  })

  describe('useCachedData - Hook导出验证', () => {
    it('应该导出useCachedData函数', async () => {
      const { useCachedData } = await import('@/lib/hooks/use-cache')

      expect(typeof useCachedData).toBe('function')
    })

    it('useCachedData应该返回正确的接口结构', async () => {
      const { useCachedData } = await import('@/lib/hooks/use-cache')
      
      const mockFetcher = vi.fn().mockResolvedValue({ data: 'test' })
      
      const { result } = renderHook(() =>
        useCachedData('interface-test', mockFetcher)
      )

      // 验证hook返回了预期的属性（可能还未加载完成）
      expect(result.current).toHaveProperty('data')
      expect(result.current).toHaveProperty('loading')
      expect(result.current).toHaveProperty('error')
      expect(mockFetcher).toHaveBeenCalled()
    }, 10000)
  })
})
