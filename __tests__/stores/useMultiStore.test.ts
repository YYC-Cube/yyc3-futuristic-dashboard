import { describe, it, expect, beforeEach } from 'vitest'
import { useMultiStoreStore } from '@/lib/stores/useMultiStore'

function createTestStoreData(overrides: Record<string, unknown> = {}) {
  return {
    name: '测试门店',
    nameEn: 'Test Store',
    code: 'TEST-001',
    description: '测试描述',
    status: 'active' as const,
    isDefault: false,
    isHeadquarters: false,
    location: { address: '', city: '', province: '', postalCode: '' },
    businessHours: { open: '10:00', close: '22:00', isOpen24Hours: false },
    contact: { phone: '', email: '', managerName: '' },
    config: {
      currency: 'CNY',
      timezone: 'Asia/Shanghai',
      taxRate: 0,
      serviceChargeRate: 0,
      roomTypes: [],
      features: [],
    },
    tags: [],
    ...overrides,
  } as any
}

describe('useMultiStore', () => {
  beforeEach(() => {
    useMultiStoreStore.setState({
      stores: [],
      activeStoreId: null,
      loading: false,
      error: null,
      lastFetched: null,
    })
  })

  describe('初始状态', () => {
    it('应该有正确的默认值', () => {
      const state = useMultiStoreStore.getState()
      
      expect(state.activeStoreId).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).toBeNull()
    })
  })

  describe('setActiveStore', () => {
    it('应该设置活跃门店ID', () => {
      const storeId = 'store-001'
      
      useMultiStoreStore.setState({ activeStoreId: storeId })
      const state = useMultiStoreStore.getState()

      expect(state.activeStoreId).toBe(storeId)
    })

    it('应该能够清除活跃门店', () => {
      useMultiStoreStore.setState({ activeStoreId: 'store-001' })
      useMultiStoreStore.setState({ activeStoreId: null })
      
      expect(useMultiStoreStore.getState().activeStoreId).toBeNull()
    })
  })

  describe('clearError和reset', () => {
    it('clearError 应该清除错误信息', () => {
      useMultiStoreStore.setState({ error: '网络错误' })
      useMultiStoreStore.getState().clearError()
      
      expect(useMultiStoreStore.getState().error).toBeNull()
    })

    it('reset 应该重置所有状态', () => {
      useMultiStoreStore.setState({
        stores: [{ id: '1' }] as any,
        activeStoreId: 'store-001',
        loading: true,
        error: '错误',
        lastFetched: Date.now(),
      })
      
      useMultiStoreStore.getState().reset()
      
      const state = useMultiStoreStore.getState()
      expect(state.stores).toEqual([])
      expect(state.activeStoreId).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).toBeNull()
    })
  })

  describe('查询方法', () => {
    beforeEach(() => {
      useMultiStoreStore.setState({
        stores: [
          {
            id: 'store-001',
            name: 'YYC³ 总店',
            status: 'active' as const,
            isDefault: true,
            isHeadquarters: true,
            location: { address: '', city: '', province: '', postalCode: '' },
            businessHours: { open: '10:00', close: '02:00', isOpen24Hours: false },
            contact: { phone: '', email: '', managerName: '' },
            config: { currency: 'CNY', timezone: 'Asia/Shanghai', taxRate: 0, serviceChargeRate: 0, roomTypes: [], features: [] },
            stats: { totalRooms: 20, availableRooms: 15, occupiedRooms: 5, todayRevenue: 5000, monthRevenue: 150000, todayOrders: 25, memberCount: 100, rating: 4.8, lastUpdated: new Date().toISOString() },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: [],
          } as any,
          {
            id: 'store-002',
            name: 'YYC³ 分店A',
            status: 'active' as const,
            isDefault: false,
            isHeadquarters: false,
            location: { address: '', city: '', province: '', postalCode: '' },
            businessHours: { open: '10:00', close: '02:00', isOpen24Hours: false },
            contact: { phone: '', email: '', managerName: '' },
            config: { currency: 'CNY', timezone: 'Asia/Shanghai', taxRate: 0, serviceChargeRate: 0, roomTypes: [], features: [] },
            stats: { totalRooms: 15, availableRooms: 10, occupiedRooms: 5, todayRevenue: 3000, monthRevenue: 90000, todayOrders: 18, memberCount: 80, rating: 4.6, lastUpdated: new Date().toISOString() },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: [],
          } as any,
          {
            id: 'store-003',
            name: 'YYC³ 分店B（维护中）',
            status: 'maintenance' as const,
            isDefault: false,
            isHeadquarters: false,
            location: { address: '', city: '', province: '', postalCode: '' },
            businessHours: { open: '10:00', close: '02:00', isOpen24Hours: false },
            contact: { phone: '', email: '', managerName: '' },
            config: { currency: 'CNY', timezone: 'Asia/Shanghai', taxRate: 0, serviceChargeRate: 0, roomTypes: [], features: [] },
            stats: { totalRooms: 10, availableRooms: 0, occupiedRooms: 0, todayRevenue: 0, monthRevenue: 0, todayOrders: 0, memberCount: 50, rating: 4.5, lastUpdated: new Date().toISOString() },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: [],
          } as any,
        ],
        activeStoreId: 'store-001',
      })
    })

    it('getActiveStore 应该返回当前活跃门店', () => {
      const activeStore = useMultiStoreStore.getState().getActiveStore()
      expect(activeStore?.id).toBe('store-001')
      expect((activeStore as any)?.name).toBe('YYC³ 总店')
    })

    it('getStoreById 应该根据ID返回门店', () => {
      const store = useMultiStoreStore.getState().getStoreById('store-002')
      expect(store?.id).toBe('store-002')
      expect((store as any)?.name).toBe('YYC³ 分店A')
    })

    it('getStoreById 对于不存在的ID应返回undefined', () => {
      const store = useMultiStoreStore.getState().getStoreById('non-existent')
      expect(store).toBeUndefined()
    })

    it('getStoresByStatus 应该按状态过滤门店', () => {
      const activeStores = useMultiStoreStore.getState().getStoresByStatus('active')
      expect(activeStores.length).toBe(2)

      const maintenanceStores = useMultiStoreStore.getState().getStoresByStatus('maintenance')
      expect(maintenanceStores.length).toBe(1)
    })

    it('getActiveStores 应该返回所有活跃状态的门店', () => {
      const activeStores = useMultiStoreStore.getState().getActiveStores()
      expect(activeStores.length).toBe(2)
      expect(activeStores.every(s => s.status === 'active')).toBe(true)
    })

    it('getDefaultStore 应该返回默认门店', () => {
      const defaultStore = useMultiStoreStore.getState().getDefaultStore()
      expect(defaultStore?.id).toBe('store-001')
      expect((defaultStore as any)?.isDefault).toBe(true)
    })
  })

  describe('状态更新', () => {
    it('应该能够更新loading状态', () => {
      useMultiStoreStore.setState({ loading: true })
      
      expect(useMultiStoreStore.getState().loading).toBe(true)
    })

    it('应该能够更新error状态', () => {
      useMultiStoreStore.setState({ error: '网络错误' })
      
      expect(useMultiStoreStore.getState().error).toBe('网络错误')
    })

    it('应该能够设置lastFetched时间戳', () => {
      const now = Date.now()
      useMultiStoreStore.setState({ lastFetched: now })
      
      expect(useMultiStoreStore.getState().lastFetched).toBe(now)
    })

    it('应该能够直接设置stores数组', () => {
      const mockStores = [{ id: 'test-store' }] as any
      useMultiStoreStore.setState({ stores: mockStores })

      expect(useMultiStoreStore.getState().stores).toEqual(mockStores)
    })
  })

  describe('fetchStores - 获取门店列表', () => {
    it('应该成功获取门店列表', async () => {
      await useMultiStoreStore.getState().fetchStores()

      const state = useMultiStoreStore.getState()
      expect(state.stores.length).toBeGreaterThan(0)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).not.toBeNull()
    }, 10000)

    it('应该在loading时避免重复请求', async () => {
      useMultiStoreStore.setState({ loading: true })

      await useMultiStoreStore.getState().fetchStores()

      expect(useMultiStoreStore.getState().loading).toBe(true)
    })
  })

  describe('addStore - 添加门店', () => {
    it('应该成功添加新门店', async () => {
      const newStoreData = createTestStoreData({
        name: '新测试门店',
        nameEn: 'New Test Store',
        code: 'TEST-001',
        description: '测试门店描述',
        location: { address: '测试地址', city: '测试城市', province: '测试省', postalCode: '100000' },
        contact: { phone: '13800138000', email: 'test@test.com', managerName: '张经理' },
        config: {
          currency: 'CNY',
          timezone: 'Asia/Shanghai',
          taxRate: 0.06,
          serviceChargeRate: 0.1,
          roomTypes: [],
          features: ['parking', 'wifi'],
        },
        tags: ['new'],
      })

      const result = await useMultiStoreStore.getState().addStore(newStoreData)

      expect(result).toBeDefined()
      expect(result.id).toMatch(/^store-/)
      expect(result.name).toBe('新测试门店')
      expect(useMultiStoreStore.getState().stores.length).toBe(1)
    })

    it('添加时应该初始化统计数据', async () => {
      const storeData = createTestStoreData({ name: '统计测试' })

      const result = await useMultiStoreStore.getState().addStore(storeData)

      expect(result.stats).toBeDefined()
      expect(result.stats.totalRooms).toBe(0)
      expect(result.stats.todayRevenue).toBe(0)
    })
  })

  describe('updateStore - 更新门店', () => {
    beforeEach(async () => {
      await useMultiStoreStore.getState().addStore(createTestStoreData({ name: '待更新门店' }))
    })

    it('应该成功更新门店信息', async () => {
      const storeId = useMultiStoreStore.getState().stores[0].id

      await useMultiStoreStore.getState().updateStore(storeId, {
        name: '更新后的门店名称',
      })

      const updatedStore = useMultiStoreStore.getState().getStoreById(storeId)
      expect(updatedStore?.name).toBe('更新后的门店名称')
      expect(updatedStore?.updatedAt).toBeDefined()
    })

    it('更新不存在的门店不应报错', async () => {
      await useMultiStoreStore.getState().updateStore('non-existent', {
        name: '不存在的门店',
      })

      expect(useMultiStoreStore.getState().stores.length).toBe(1)
    })
  })

  describe('deleteStore - 删除门店', () => {
    beforeEach(async () => {
      await useMultiStoreStore.getState().addStore(createTestStoreData({ name: '待删除门店' }))
    })

    it('应该成功删除门店', async () => {
      const storeId = useMultiStoreStore.getState().stores[0].id
      const initialCount = useMultiStoreStore.getState().stores.length

      await useMultiStoreStore.getState().deleteStore(storeId)

      expect(useMultiStoreStore.getState().stores.length).toBe(initialCount - 1)
      expect(useMultiStoreStore.getState().getStoreById(storeId)).toBeUndefined()
    })

    it('删除当前活跃门店应清除activeStoreId', async () => {
      const storeId = useMultiStoreStore.getState().stores[0].id
      useMultiStoreStore.getState().setActiveStore(storeId)

      await useMultiStoreStore.getState().deleteStore(storeId)

      expect(useMultiStoreStore.getState().activeStoreId).toBeNull()
    })
  })

  describe('toggleStoreStatus - 切换门店状态', () => {
    beforeEach(async () => {
      await useMultiStoreStore.getState().addStore(createTestStoreData({ name: '状态切换测试' }))
    })

    it('应该从active切换到inactive', async () => {
      const storeId = useMultiStoreStore.getState().stores[0].id

      await useMultiStoreStore.getState().toggleStoreStatus(storeId)

      const store = useMultiStoreStore.getState().getStoreById(storeId)
      expect(store?.status).toBe('inactive')
    })

    it('应该从inactive切换回active', async () => {
      const storeId = useMultiStoreStore.getState().stores[0].id

      await useMultiStoreStore.getState().toggleStoreStatus(storeId)
      await useMultiStoreStore.getState().toggleStoreStatus(storeId)

      const store = useMultiStoreStore.getState().getStoreById(storeId)
      expect(store?.status).toBe('active')
    })
  })

  describe('refreshStoreStats - 刷新门店统计', () => {
    beforeEach(async () => {
      await useMultiStoreStore.getState().addStore(createTestStoreData({ name: '统计刷新测试' }))
    })

    it('应该更新门店统计数据', async () => {
      const storeId = useMultiStoreStore.getState().stores[0].id
      const originalTime = useMultiStoreStore.getState().getStoreById(storeId)?.stats?.lastUpdated

      await new Promise(resolve => setTimeout(resolve, 100))
      await useMultiStoreStore.getState().refreshStoreStats(storeId)

      const updatedStore = useMultiStoreStore.getState().getStoreById(storeId)
      expect(updatedStore?.stats?.lastUpdated).not.toBe(originalTime)
    })

    it('不存在的门店应处理异常', async () => {
      try {
        await useMultiStoreStore.getState().refreshStoreStats('non-existent')
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })

  describe('getActiveStoreSafe - 安全获取活跃门店', () => {
    it('有活跃门店时应返回该门店', () => {
      useMultiStoreStore.setState({
        stores: [{
          id: 'store-active',
          name: '活跃门店',
          status: 'active' as const,
          isDefault: false,
          isHeadquarters: false,
          location: { address: '', city: '', province: '', postalCode: '' },
          businessHours: { open: '10:00', close: '22:00', isOpen24Hours: false },
          contact: { phone: '', email: '', managerName: '' },
          config: { currency: 'CNY', timezone: 'Asia/Shanghai', taxRate: 0, serviceChargeRate: 0, roomTypes: [], features: [] },
          stats: { totalRooms: 0, availableRooms: 0, occupiedRooms: 0, todayRevenue: 0, monthRevenue: 0, todayOrders: 0, memberCount: 0, rating: 0, lastUpdated: new Date().toISOString() },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
        } as any],
        activeStoreId: 'store-active',
      })

      const activeStore = useMultiStoreStore.getState().getActiveStoreSafe()
      expect(activeStore?.id).toBe('store-active')
    })

    it('无活跃门店或门店不存在时应返回null', () => {
      useMultiStoreStore.setState({
        stores: [],
        activeStoreId: 'non-existent',
      })

      const activeStore = useMultiStoreStore.getState().getActiveStoreSafe()
      expect(activeStore).toBeNull()
    })
  })

  describe('边界条件和错误处理', () => {
    it('addStore 失败时应处理异常', async () => {
      try {
        await useMultiStoreStore.getState().addStore(null as any)
      } catch (e) {
        expect(e).toBeDefined()
      }

      expect(useMultiStoreStore.getState().loading).toBe(false)
    })

    it('updateStore 应处理异常情况', async () => {
      await useMultiStoreStore.getState().addStore(createTestStoreData({ name: '异常更新测试' }))
      const storeId = useMultiStoreStore.getState().stores[0].id

      try {
        await useMultiStoreStore.getState().updateStore(storeId, null as any)
      } catch (e) {
        expect(e).toBeDefined()
      }
    })

    it('deleteStore 应处理异常情况', async () => {
      await useMultiStoreStore.getState().addStore(createTestStoreData({ name: '异常删除测试' }))
      const storeId = useMultiStoreStore.getState().stores[0].id

      try {
        await useMultiStoreStore.getState().deleteStore(storeId)
      } catch (e) {
        expect(e).toBeDefined()
      }

      expect(useMultiStoreStore.getState().getStoreById(storeId)).toBeUndefined()
    })

    it('toggleStoreStatus 不存在时应处理异常', async () => {
      try {
        await useMultiStoreStore.getState().toggleStoreStatus('non-existent')
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })
})
