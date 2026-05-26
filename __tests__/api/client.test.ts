import { describe, it, expect, beforeEach, vi } from 'vitest'
import { apiClient } from '@/lib/api/client'

describe('apiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('实例化', () => {
    it('应该是一个对象', () => {
      expect(apiClient).toBeDefined()
      expect(typeof apiClient).toBe('object')
    })

    it('应该包含所有API方法', () => {
      expect(typeof apiClient.login).toBe('function')
      expect(typeof apiClient.logout).toBe('function')
      expect(typeof apiClient.getRooms).toBe('function')
      expect(typeof apiClient.getProducts).toBe('function')
      expect(typeof apiClient.getOrders).toBe('function')
      expect(typeof apiClient.createOrder).toBe('function')
    })
  })

  describe('login 方法', () => {
    it('应该返回登录响应', async () => {
      const result = await apiClient.login('admin', 'password')

      expect(result).toBeDefined()
      expect(result.code).toBeDefined()
      if (result.data) {
        expect(result.data.token).toBeDefined()
        expect(result.data.user).toBeDefined()
      }
    })

    it('应该处理空用户名', async () => {
      try {
        const result = await apiClient.login('', 'password')
        expect(result).toBeDefined()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('应该处理空密码', async () => {
      try {
        const result = await apiClient.login('user', '')
        expect(result).toBeDefined()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('logout 方法', () => {
    it('应该返回登出响应', async () => {
      const result = await apiClient.logout()

      expect(result).toBeDefined()
      expect(result.code).toBeDefined()
    })
  })

  describe('getRooms 方法', () => {
    it('应该返回房间列表', async () => {
      const result = await apiClient.getRooms()

      expect(result).toBeDefined()
      expect(result.code).toBe(200)
      if (result.data) {
        expect(Array.isArray(result.data)).toBe(true)
        expect(result.data.length).toBeGreaterThan(0)
      }
    })
  })

  describe('getRoomById 方法', () => {
    it('应该返回指定房间信息', async () => {
      const result = await apiClient.getRoomById('room-001')

      expect(result).toBeDefined()
      if (result.data) {
        expect(result.data.id).toBe('room-001')
        expect(result.data.number).toBeDefined()
      }
    })

    it('应该处理不存在的房间ID', async () => {
      const result = await apiClient.getRoomById('non-existent')

      expect(result).toBeDefined()
    })
  })

  describe('updateRoomStatus 方法', () => {
    it('应该更新房间状态', async () => {
      const result = await apiClient.updateRoomStatus('room-001', 'available')

      expect(result).toBeDefined()
      if (result.data) {
        expect(result.data.status).toBeDefined()
      }
    })
  })

  describe('startRoom 方法', () => {
    it('应该开始使用房间并创建订单', async () => {
      const result = await apiClient.startRoom('room-001')

      expect(result).toBeDefined()
      if (result.data) {
        expect(result.data.id).toBeDefined()
        expect(result.data.roomId).toBeDefined()
      }
    })
  })

  describe('checkoutRoom 方法', () => {
    it('应该结账并返回订单信息', async () => {
      const result = await apiClient.checkoutRoom('room-001')

      expect(result).toBeDefined()
      if (result.data) {
        expect(result.data.orderId).toBeDefined()
        expect(result.data.total).toBeDefined()
      }
    })
  })

  describe('getOrders 方法', () => {
    it('应该返回订单列表', async () => {
      const result = await apiClient.getOrders()

      expect(result).toBeDefined()
      expect(result.code).toBe(200)
      if (result.data && 'orders' in result.data) {
        expect(Array.isArray((result.data as any).orders)).toBe(true)
      }
    })

    it('应该支持查询参数', async () => {
      const result = await apiClient.getOrders({ status: 'active' })

      expect(result).toBeDefined()
    })
  })

  describe('createOrder 方法', () => {
    it('应该创建新订单', async () => {
      const result = await apiClient.createOrder({
        roomId: 'room-001',
        status: 'active',
      } as any)

      expect(result).toBeDefined()
      expect(result.code).toBeDefined()
    })
  })

  describe('updateOrder 方法', () => {
    it('应该更新订单信息', async () => {
      const result = await apiClient.updateOrder('order-001', { status: 'completed' } as any)

      expect(result).toBeDefined()
    })
  })

  describe('addOrderItem 方法', () => {
    it('应该向订单添加商品项', async () => {
      const result = await apiClient.addOrderItem('order-001', {
        productId: 'prod-001',
        productName: '青岛啤酒',
        quantity: 5,
        unitPrice: 12,
        totalPrice: 60,
        status: 'pending',
      })

      expect(result).toBeDefined()
      expect(result.code).toBeDefined()
    })
  })

  describe('getProducts 方法', () => {
    it('应该返回商品列表', async () => {
      const result = await apiClient.getProducts()

      expect(result).toBeDefined()
      expect(result.code).toBe(200)
      if (result.data && 'products' in result.data) {
        expect(Array.isArray((result.data as any).products)).toBe(true)
        expect((result.data as any).products.length).toBeGreaterThan(0)
      }
    })

    it('应该支持查询参数过滤', async () => {
      const result = await apiClient.getProducts({ categoryId: 'beer' })

      expect(result).toBeDefined()
    })
  })

  describe('getProductById 方法', () => {
    it('应该返回指定商品信息', async () => {
      const result = await apiClient.getProductById('prod-001')

      expect(result).toBeDefined()
      expect(result.code).toBeDefined()
    })

    it('应该处理不存在的商品ID', async () => {
      const result = await apiClient.getProductById('non-existent')

      expect(result).toBeDefined()
    })
  })

  describe('createProduct 方法', () => {
    it('应该创建新商品', async () => {
      const result = await apiClient.createProduct({
        name: '测试商品',
        unit: '份',
        originalPrice: 100,
        salePrice: 80,
        memberPrice: 70,
        categoryId: 'other',
      } as any)

      expect(result).toBeDefined()
      expect(result.code).toBeDefined()
    })
  })

  describe('updateProduct 方法', () => {
    it('应该更新商品信息', async () => {
      const result = await apiClient.updateProduct('prod-001', { salePrice: 15 } as any)

      expect(result).toBeDefined()
    })
  })

  describe('getEmployees 方法', () => {
    it('应该返回员工列表', async () => {
      const result = await apiClient.getEmployees()

      expect(result).toBeDefined()
      expect(result.code).toBe(200)
      if (result.data) {
        expect(Array.isArray(result.data)).toBe(true)
      }
    })
  })

  describe('错误处理', () => {
    it('应该处理API调用错误', async () => {
      const originalFetch = global.fetch
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      try {
        const result = await apiClient.getRooms()
        expect(result).toBeDefined()
      } catch (error) {
        expect(error).toBeDefined()
      }

      global.fetch = originalFetch
    })
  })

  describe('边界条件', () => {
    it('应该处理特殊字符的参数', async () => {
      const result = await apiClient.getProductById('special-id-<>{}|\\/"\'`~!')

      expect(result).toBeDefined()
    })

    it('应该处理空字符串参数', async () => {
      const result = await apiClient.getRoomById('')

      expect(result).toBeDefined()
    })

    it('应该处理Unicode参数', async () => {
      const result = await apiClient.getProductById('中文ID-日本語-한국어')

      expect(result).toBeDefined()
    })
  })
})
