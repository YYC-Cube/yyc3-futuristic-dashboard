import { describe, it, expect, beforeEach, vi } from "vitest"

vi.mock("../../lib/services", () => ({
  roomService: {
    getRooms: vi.fn().mockResolvedValue([
      { id: "1", number: "101", type: "vip", status: "available", floor: 1, capacity: 8, hourlyRate: 128, features: [] },
      { id: "2", number: "102", type: "standard", status: "occupied", floor: 1, capacity: 6, hourlyRate: 88, features: [] },
      { id: "3", number: "103", type: "vip", status: "cleaning", floor: 2, capacity: 10, hourlyRate: 168, features: [] },
    ]),
    updateStatus: vi.fn().mockResolvedValue({ id: "1", status: "occupied" }),
    start: vi.fn().mockResolvedValue({}),
    checkout: vi.fn().mockResolvedValue({}),
  },
}))

import { useRoomStore } from "../../lib/stores/useRoomStore"

describe("useRoomStore", () => {
  beforeEach(() => {
    useRoomStore.setState({
      rooms: [],
      selectedRoom: null,
      loading: false,
      error: null,
      lastFetched: null,
    })
  })

  describe("初始状态", () => {
    it("应该有正确的默认值", () => {
      const state = useRoomStore.getState()
      expect(state.rooms).toEqual([])
      expect(state.selectedRoom).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).toBeNull()
    })
  })

  describe("fetchRooms", () => {
    it("应该成功获取包厢列表", async () => {
      await useRoomStore.getState().fetchRooms()
      const state = useRoomStore.getState()

      expect(state.rooms).toHaveLength(3)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).not.toBeNull()
    })

    it("应该在 STALE_TIME 内跳过重复请求", async () => {
      await useRoomStore.getState().fetchRooms()
      const firstFetched = useRoomStore.getState().lastFetched

      await useRoomStore.getState().fetchRooms()
      const secondFetched = useRoomStore.getState().lastFetched

      expect(firstFetched).toBe(secondFetched)
    })

    it("应该在加载中时跳过请求", async () => {
      useRoomStore.setState({ loading: true })
      await useRoomStore.getState().fetchRooms()

      expect(useRoomStore.getState().rooms).toEqual([])
    })
  })

  describe("clearError", () => {
    it("应该清除错误信息", () => {
      useRoomStore.setState({ error: "测试错误" })
      useRoomStore.getState().clearError()
      expect(useRoomStore.getState().error).toBeNull()
    })
  })

  describe("getRoomStats", () => {
    it("应该正确统计包厢状态", async () => {
      await useRoomStore.getState().fetchRooms()
      const stats = useRoomStore.getState().getRoomStats()

      expect(stats.total).toBe(3)
      expect(stats.available).toBe(1)
      expect(stats.occupied).toBe(1)
      expect(stats.cleaning).toBe(1)
    })
  })

  describe("getRoomsByStatus", () => {
    it("应该按状态筛选包厢", async () => {
      await useRoomStore.getState().fetchRooms()
      const available = useRoomStore.getState().getRoomsByStatus("available")

      expect(available).toHaveLength(1)
      expect(available[0].status).toBe("available")
    })
  })
})
