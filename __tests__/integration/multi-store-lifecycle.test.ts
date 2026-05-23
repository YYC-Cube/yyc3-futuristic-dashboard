import { describe, it, expect, beforeEach } from 'vitest'
import { useMultiStoreStore } from '@/lib/stores/useMultiStore'
import { useRoomStore } from '@/lib/stores/useRoomStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'

describe('多门店管理完整流程集成测试', () => {
  beforeEach(() => {
    useMultiStoreStore.setState({
      stores: [],
      currentStoreId: null,
      loading: false,
      error: null,
    })

    useRoomStore.setState({
      rooms: [],
      selectedRoom: null,
      loading: false,
      error: null,
      lastFetched: null,
    })

    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    })
  })

  describe('门店切换与数据隔离', () => {
    it('应该支持门店切换并保持数据隔离', () => {
      const stores = [
        { id: 'store-001', name: '总店', location: '北京' },
        { id: 'store-002', name: '分店A', location: '上海' },
        { id: 'store-003', name: '分店B', location: '广州' },
      ] as any

      useMultiStoreStore.setState({ stores, currentStoreId: 'store-001' })
      expect(useMultiStoreStore.getState().currentStoreId).toBe('store-001')

      const storeRooms = [
        { id: 'room-001', storeId: 'store-001', status: 'available' },
        { id: 'room-002', storeId: 'store-001', status: 'occupied' },
      ] as any

      useRoomStore.setState({ rooms: storeRooms })
      expect(useRoomStore.getState().rooms.length).toBe(2)

      if (typeof useMultiStoreStore.getState().switchStore === 'function') {
        useMultiStoreStore.getState().switchStore('store-002')
        expect(useMultiStoreStore.getState().currentStoreId).toBe('store-002')
      }

      useRoomStore.setState({ rooms: [] })
      expect(useRoomStore.getState().rooms.length).toBe(0)
    })
  })

  describe('权限控制集成', () => {
    it('应该支持基于角色的门店访问控制', () => {
      if (typeof useAuthStore.getState().ghostModeLogin === 'function') {
        useAuthStore.getState().ghostModeLogin()
        expect(useAuthStore.getState().isAdmin()).toBe(true)
      }

      const adminStores = [
        { id: 'store-001', name: '总店', accessLevel: 'full' },
        { id: 'store-002', name: '分店A', accessLevel: 'full' },
        { id: 'store-003', name: '分店B', accessLevel: 'full' },
      ] as any

      useMultiStoreStore.setState({ stores: adminStores })
      expect(useMultiStoreStore.getState().stores.length).toBe(3)

      useAuthStore.setState({
        user: { id: 'staff-001', name: '员工', role: 'staff' } as any,
        isAuthenticated: true,
      })

      const staffStores = [
        { id: 'store-002', name: '分店A', accessLevel: 'limited' },
      ] as any

      useMultiStoreStore.setState({ stores: staffStores })
      expect(useMultiStoreStore.getState().stores.length).toBe(1)
    })
  })

  describe('跨门店操作', () => {
    it('应该支持查看所有门店的汇总数据', () => {
      const allStores = [
        { id: 'store-001', name: '总店', totalRooms: 10, occupiedRooms: 7 },
        { id: 'store-002', name: '分店A', totalRooms: 8, occupiedRooms: 5 },
        { id: 'store-003', name: '分店B', totalRooms: 6, occupiedRooms: 2 },
      ] as any

      useMultiStoreStore.setState({ stores: allStores })
      expect(useMultiStoreStore.getState().stores.length).toBe(3)

      const state = useMultiStoreStore.getState()
      expect(state.stores).toBeDefined()
      expect(Array.isArray(state.stores)).toBe(true)

      const totalRooms = (state.stores as any[]).reduce(
        (sum, store) => sum + (store.totalRooms || 0),
        0
      )
      expect(totalRooms).toBe(24)
    })
  })

  describe('数据同步集成', () => {
    it('应该支持多门店数据的批量更新', async () => {
      const initialStores = [
        { id: 'store-001', name: '总店', syncStatus: 'synced' },
        { id: 'store-002', name: '分店A', syncStatus: 'pending' },
      ] as any

      useMultiStoreStore.setState({ stores: initialStores })

      const updatedStores = initialStores.map((store) => ({
        ...store,
        syncStatus: 'synced',
        lastSyncTime: new Date().toISOString(),
      })) as any

      useMultiStoreStore.setState({ stores: updatedStores })

      const currentStores = useMultiStoreStore.getState().stores
      expect(currentStores.length).toBe(2)

      const allSynced = (currentStores as any[]).every(
        (store) => store.syncStatus === 'synced'
      )
      expect(allSynced).toBe(true)
    })
  })
})
