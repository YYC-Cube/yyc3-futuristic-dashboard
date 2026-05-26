import { describe, it, expect, beforeEach, vi } from 'vitest'
import logger from '@/lib/logger'

describe('Logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('单例模式', () => {
    it('导出的logger应该是一个对象', () => {
      expect(logger).toBeDefined()
      expect(typeof logger).toBe('object')
    })

    it('logger应该包含所有日志方法', () => {
      expect(typeof logger.debug).toBe('function')
      expect(typeof logger.info).toBe('function')
      expect(typeof logger.warn).toBe('function')
      expect(typeof logger.error).toBe('function')
    })
  })

  describe('日志级别过滤', () => {
    it('在开发环境下应该输出所有级别的日志', () => {
      const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      logger.debug('TestModule', 'Debug message')
      logger.info('TestModule', 'Info message')
      logger.warn('TestModule', 'Warn message')
      logger.error('TestModule', 'Error message')

      expect(consoleDebugSpy).toHaveBeenCalled()
      expect(consoleInfoSpy).toHaveBeenCalled()
      expect(consoleWarnSpy).toHaveBeenCalled()
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('debug 方法', () => {
    it('应该输出调试信息', () => {
      const spy = vi.spyOn(console, 'debug').mockImplementation(() => {})

      logger.debug('Auth', '用户登录', { userId: '123' })

      expect(spy).toHaveBeenCalledTimes(1)
      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toContain('[Auth]')
      expect(logMessage).toContain('用户登录')
    })

    it('应该包含数据对象', () => {
      const spy = vi.spyOn(console, 'debug').mockImplementation(() => {})

      logger.debug('API', '请求发送', { url: '/api/test', method: 'GET' })

      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toContain('/api/test')
      expect(logMessage).toContain('GET')
    })

    it('应该在无数据时正常工作', () => {
      const spy = vi.spyOn(console, 'debug').mockImplementation(() => {})

      logger.debug('Simple', '简单消息')

      expect(spy).toHaveBeenCalled()
    })
  })

  describe('info 方法', () => {
    it('应该输出信息日志', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

      logger.info('Inventory', '商品创建成功')

      expect(spy).toHaveBeenCalledTimes(1)
      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toContain('[Inventory]')
      expect(logMessage).toContain('商品创建成功')
    })

    it('应该格式化包含数据的消息', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

      logger.info('Order', '订单更新', { orderId: 'ORD-001', status: 'completed' })

      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toContain('ORD-001')
      expect(logMessage).toContain('completed')
    })
  })

  describe('warn 方法', () => {
    it('应该输出警告信息', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      logger.warn('Storage', 'localStorage写入失败')

      expect(spy).toHaveBeenCalledTimes(1)
      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toContain('[Storage]')
      expect(logMessage).toContain('localStorage写入失败')
    })

    it('应该包含警告上下文数据', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      logger.warn('API', '响应超时', { timeout: 5000, endpoint: '/api/slow' })

      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toContain('5000')
      expect(logMessage).toContain('/api/slow')
    })
  })

  describe('error 方法', () => {
    it('应该输出错误信息', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      logger.error('Network', '请求失败')

      expect(spy).toHaveBeenCalledTimes(1)
      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toContain('[Network]')
      expect(logMessage).toContain('请求失败')
    })

    it('应该处理Error对象', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const testError = new Error('连接失败')

      logger.error('Database', '数据库查询失败', testError)

      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toContain('数据库查询失败')
      expect(logMessage).toContain('连接失败')
    })

    it('应该处理非Error类型的错误', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      logger.error('Validation', '验证失败', 'Invalid input string')

      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toContain('Invalid input string')
    })

    it('应该处理null/undefined错误', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      logger.error('System', '系统错误', undefined, { code: 500 })

      expect(spy).toHaveBeenCalled()
    })

    it('应该包含错误上下文数据', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Not found')

      logger.error('API', '资源未找到', error, { resourceId: 'RES-001' })

      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toContain('RES-001')
    })
  })

  describe('消息格式化', () => {
    it('应该包含时间戳', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

      logger.info('Timing', '时间戳测试')

      const logMessage = spy.mock.calls[0][0]
      expect(logMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('应该使用正确的emoji图标', () => {
      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
      const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      logger.debug('M', '')
      logger.info('M', '')
      logger.warn('M', '')
      logger.error('M', '')

      expect(debugSpy.mock.calls[0][0]).toContain('🔍')
      expect(infoSpy.mock.calls[0][0]).toContain('ℹ️')
      expect(warnSpy.mock.calls[0][0]).toContain('⚠️')
      expect(errorSpy.mock.calls[0][0]).toContain('❌')
    })
  })

  describe('边界条件', () => {
    it('应该处理空模块名', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

      logger.info('', '空模块消息')

      expect(spy).toHaveBeenCalled()
    })

    it('应该处理空消息', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

      logger.info('Module', '')

      expect(spy).toHaveBeenCalled()
    })

    it('应该处理特殊字符', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

      logger.info('Special', '特殊字符测试：<>{}[]|\\/"\'`~!@#$%^&*()')

      expect(spy).toHaveBeenCalled()
    })

    it('应该处理Unicode字符', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

      logger.info('Unicode', '中文测试 日本語 한국어 🎉🚀')

      expect(spy).toHaveBeenCalled()
    })

    it('应该处理非常大的数据对象', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
      const largeData = Array(1000).fill({ key: 'value' })

      logger.info('Large', '大数据测试', { items: largeData })

      expect(spy).toHaveBeenCalled()
    })

    it('应该处理嵌套数据结构', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

      logger.info('Nested', '嵌套数据', {
        level1: {
          level2: {
            level3: 'deep value',
          },
        },
        array: [1, [2, [3]]],
      })

      expect(spy).toHaveBeenCalled()
    })

    it('应该处理多次快速调用', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {})

      for (let i = 0; i < 100; i++) {
        logger.info('Stress', `消息 ${i}`)
      }

      expect(spy).toHaveBeenCalledTimes(100)
    })
  })
})
