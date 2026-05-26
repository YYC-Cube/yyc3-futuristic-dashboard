import { describe, it, expect, beforeEach } from 'vitest'
import { useMultiStoreStore } from '@/lib/stores/useMultiStore'

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
})
