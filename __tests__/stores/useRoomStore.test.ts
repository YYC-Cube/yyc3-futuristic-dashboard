import { describe, it, expect, beforeEach } from 'vitest'
import { useRoomStore } from '@/lib/stores/useRoomStore'

describe('useRoomStore', () => {
  beforeEach(() => {
    useRoomStore.setState({
      rooms: [],
      selectedRoom: null,
      loading: false,
      error: null,
      lastFetched: null,
    })
  })

  describe('初始状态', () => {
    it('应该有正确的默认值', () => {
      const state = useRoomStore.getState()

      expect(state.rooms).toEqual([])
      expect(state.selectedRoom).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).toBeNull()
    })
  })

  describe('selectRoom', () => {
    it('应该设置选中的房间', () => {
      const mockRoom = { id: 'room-001', name: 'VIP包厢' } as any

      useRoomStore.getState().selectRoom(mockRoom)

      expect(useRoomStore.getState().selectedRoom?.id).toBe('room-001')
      expect(useRoomStore.getState().selectedRoom?.name).toBe('VIP包厢')
    })

    it('应该能够清除选中房间', () => {
      useRoomStore.getState().selectRoom({ id: 'room-001' } as any)
      expect(useRoomStore.getState().selectedRoom).not.toBeNull()

      useRoomStore.getState().selectRoom(null)
      expect(useRoomStore.getState().selectedRoom).toBeNull()
    })
  })

  describe('clearError', () => {
    it('应该清除错误信息', () => {
      useRoomStore.setState({ error: '获取数据失败' })
      useRoomStore.getState().clearError()
      expect(useRoomStore.getState().error).toBeNull()
    })
  })

  describe('reset', () => {
    it('应该重置所有状态到初始值', async () => {
      useRoomStore.setState({
        rooms: [{ id: '1' }] as any,
        selectedRoom: { id: '1' } as any,
        loading: true,
        error: '错误',
        lastFetched: Date.now(),
      })

      useRoomStore.getState().reset()

      const state = useRoomStore.getState()
      expect(state.rooms).toEqual([])
      expect(state.selectedRoom).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).toBeNull()
    })
  })

  describe('getRoomsByStatus', () => {
    beforeEach(() => {
      useRoomStore.setState({
        rooms: [
          { id: 'room-001', status: 'available' },
          { id: 'room-002', status: 'occupied' },
          { id: 'room-003', status: 'available' },
          { id: 'room-004', status: 'cleaning' },
          { id: 'room-005', status: 'maintenance' },
          { id: 'room-006', status: 'checkout' },
        ] as any,
      })
    })

    it('应该返回可用房间', () => {
      const available = useRoomStore.getState().getRoomsByStatus('available')
      expect(available.length).toBe(2)
      expect(available.every(r => r.status === 'available')).toBe(true)
    })

    it('应该返回占用房间', () => {
      const occupied = useRoomStore.getState().getRoomsByStatus('occupied')
      expect(occupied.length).toBe(1)
      expect(occupied[0].id).toBe('room-002')
    })

    it('应该返回清洁中房间', () => {
      const cleaning = useRoomStore.getState().getRoomsByStatus('cleaning')
      expect(cleaning.length).toBe(1)
    })

    it('应该返回维护中房间', () => {
      const maintenance = useRoomStore.getState().getRoomsByStatus('maintenance')
      expect(maintenance.length).toBe(1)
    })

    it('应该返回待结账房间', () => {
      const checkout = useRoomStore.getState().getRoomsByStatus('checkout')
      expect(checkout.length).toBe(1)
    })

    it('应该返回空数组当没有匹配的房间时', () => {
      const unknown = useRoomStore.getState().getRoomsByStatus('unknown_status')
      expect(unknown).toEqual([])
    })
  })

  describe('getRoomStats', () => {
    beforeEach(() => {
      useRoomStore.setState({
        rooms: [
          { id: 'room-001', status: 'available' },
          { id: 'room-002', status: 'available' },
          { id: 'room-003', status: 'available' },
          { id: 'room-004', status: 'occupied' },
          { id: 'room-005', status: 'occupied' },
          { id: 'room-006', status: 'cleaning' },
          { id: 'room-007', status: 'maintenance' },
          { id: 'room-008', status: 'checkout' },
        ] as any,
      })
    })

    it('应该返回正确的统计信息', () => {
      const stats = useRoomStore.getState().getRoomStats()

      expect(stats.total).toBe(8)
      expect(stats.available).toBe(3)
      expect(stats.occupied).toBe(2)
      expect(stats.cleaning).toBe(1)
      expect(stats.maintenance).toBe(1)
      expect(stats.checkout).toBe(1)
    })

    it('应该处理空房间列表', () => {
      useRoomStore.setState({ rooms: [] })
      const stats = useRoomStore.getState().getRoomStats()

      expect(stats.total).toBe(0)
      expect(stats.available).toBe(0)
      expect(stats.occupied).toBe(0)
      expect(stats.cleaning).toBe(0)
      expect(stats.maintenance).toBe(0)
      expect(stats.checkout).toBe(0)
    })
  })

  describe('getRoomCount', () => {
    it('应该返回正确的房间数量', () => {
      useRoomStore.setState({
        rooms: [
          { id: '1' }, { id: '2' }, { id: '3' }
        ] as any,
      })

      expect(useRoomStore.getState().getRoomCount()).toBe(3)
    })

    it('应该返回0当没有房间时', () => {
      useRoomStore.setState({ rooms: [] })
      expect(useRoomStore.getState().getRoomCount()).toBe(0)
    })
  })

  describe('getRoomsSafe', () => {
    it('应该返回安全的房间数组', () => {
      const mockRooms = [{ id: '1' }, { id: '2' }] as any
      useRoomStore.setState({ rooms: mockRooms })

      const safe = useRoomStore.getState().getRoomsSafe()
      expect(safe).toEqual(mockRooms)
      expect(safe.length).toBe(2)
    })

    it('应该返回空数组当rooms为undefined', () => {
      useRoomStore.setState({ rooms: undefined as any })
      const safe = useRoomStore.getState().getRoomsSafe()
      expect(safe).toEqual([])
    })
  })

  describe('getAvailableRooms', () => {
    it('应该只返回可用房间', () => {
      useRoomStore.setState({
        rooms: [
          { id: '1', status: 'available' },
          { id: '2', status: 'occupied' },
          { id: '3', status: 'available' },
        ] as any,
      })

      const available = useRoomStore.getState().getAvailableRooms()
      expect(available.length).toBe(2)
      expect(available.every(r => r.status === 'available')).toBe(true)
    })
  })

  describe('getOccupiedRooms', () => {
    it('应该只返回占用房间', () => {
      useRoomStore.setState({
        rooms: [
          { id: '1', status: 'available' },
          { id: '2', status: 'occupied' },
          { id: '3', status: 'occupied' },
          { id: '4', status: 'cleaning' },
        ] as any,
      })

      const occupied = useRoomStore.getState().getOccupiedRooms()
      expect(occupied.length).toBe(2)
      expect(occupied.every(r => r.status === 'occupied')).toBe(true)
    })
  })

  describe('状态更新', () => {
    it('应该能够更新loading状态', () => {
      useRoomStore.setState({ loading: true })
      expect(useRoomStore.getState().loading).toBe(true)

      useRoomStore.setState({ loading: false })
      expect(useRoomStore.getState().loading).toBe(false)
    })

    it('应该能够更新error状态', () => {
      useRoomStore.setState({ error: '网络错误' })
      expect(useRoomStore.getState().error).toBe('网络错误')

      useRoomStore.setState({ error: '服务器错误' })
      expect(useRoomStore.getState().error).toBe('服务器错误')
    })

    it('应该能够更新lastFetched时间戳', () => {
      const timestamp = Date.now()
      useRoomStore.setState({ lastFetched: timestamp })
      expect(useRoomStore.getState().lastFetched).toBe(timestamp)
    })

    it('应该能够直接设置rooms', () => {
      const newRooms = [{ id: 'new-room' }] as any
      useRoomStore.setState({ rooms: newRooms })
      expect(useRoomStore.getState().rooms).toEqual(newRooms)
    })
  })

  describe('复杂场景模拟', () => {
    it('应该支持完整的房间选择和状态查询流程', () => {
      useRoomStore.setState({
        rooms: [
          { id: 'room-001', name: '小包A', status: 'available' },
          { id: 'room-002', name: '中包B', status: 'occupied' },
          { id: 'room-003', name: '大包C', status: 'cleaning' },
        ] as any,
      })

      useRoomStore.getState().selectRoom(
        useRoomStore.getState().rooms[0]
      )
      expect(useRoomStore.getState().selectedRoom?.name).toBe('小包A')

      const available = useRoomStore.getState().getAvailableRooms()
      expect(available.length).toBe(1)

      const occupied = useRoomStore.getState().getOccupiedRooms()
      expect(occupied.length).toBe(1)

      const stats = useRoomStore.getState().getRoomStats()
      expect(stats.total).toBe(3)
      expect(stats.available).toBe(1)
      expect(stats.occupied).toBe(1)

      useRoomStore.getState().reset()
      expect(useRoomStore.getState().rooms).toEqual([])
      expect(useRoomStore.getState().selectedRoom).toBeNull()
    })
  })
})
