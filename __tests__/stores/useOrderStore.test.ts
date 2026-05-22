import { describe, it, expect, beforeEach, vi } from "vitest"

vi.mock("../../lib/services", () => ({
  orderService: {
    getOrders: vi.fn().mockResolvedValue({
      orders: [
        { id: "1", roomNumber: "101", items: [], totalAmount: 0, status: "active" },
        { id: "2", roomNumber: "102", items: [], totalAmount: 100, status: "completed" },
      ],
    }),
    create: vi.fn().mockResolvedValue({
      id: "3", roomNumber: "103", items: [], totalAmount: 0, status: "active",
    }),
  },
}))

import { useOrderStore } from "../../lib/stores/useOrderStore"

describe("useOrderStore", () => {
  beforeEach(() => {
    useOrderStore.setState({
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
      lastFetched: null,
    })
  })

  describe("初始状态", () => {
    it("应该有正确的默认值", () => {
      const state = useOrderStore.getState()
      expect(state.orders).toEqual([])
      expect(state.currentOrder).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe("fetchOrders", () => {
    it("应该成功获取订单列表", async () => {
      await useOrderStore.getState().fetchOrders()
      const state = useOrderStore.getState()

      expect(state.orders).toHaveLength(2)
      expect(state.loading).toBe(false)
      expect(state.lastFetched).not.toBeNull()
    })

    it("应该在加载中时跳过请求", async () => {
      useOrderStore.setState({ loading: true })
      await useOrderStore.getState().fetchOrders()
      expect(useOrderStore.getState().orders).toEqual([])
    })
  })

  describe("createOrder", () => {
    it("应该创建订单并返回 Order 对象", async () => {
      const order = await useOrderStore.getState().createOrder({
        roomNumber: "103",
        status: "pending",
      })

      expect(order).not.toBeNull()
      expect(order?.id).toBe("3")
      expect(useOrderStore.getState().orders).toHaveLength(1)
    })
  })

  describe("clearError", () => {
    it("应该清除错误信息", () => {
      useOrderStore.setState({ error: "创建失败" })
      useOrderStore.getState().clearError()
      expect(useOrderStore.getState().error).toBeNull()
    })
  })
})
