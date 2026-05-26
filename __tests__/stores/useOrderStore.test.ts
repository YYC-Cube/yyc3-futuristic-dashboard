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
    update: vi.fn().mockResolvedValue({ id: "1", status: "updated" }),
    addItem: vi.fn().mockResolvedValue({ 
      id: "item-001", 
      productId: "prod-001", 
      productName: "青岛啤酒",
      quantity: 5,
      unitPrice: 12,
      totalPrice: 60,
      status: "pending" as const,
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

  describe("updateOrder", () => {
    it("应该更新订单信息", async () => {
      useOrderStore.setState({
        orders: [{ id: "1", status: "active" }] as any,
      })

      await useOrderStore.getState().updateOrder("1", { status: "completed" } as any)

      expect(useOrderStore.getState().orders[0].status).toBeDefined()
    })
  })

  describe("setCurrentOrder", () => {
    it("应该设置当前订单", () => {
      const mockOrder = { id: "order-001", totalAmount: 200 } as any

      useOrderStore.getState().setCurrentOrder(mockOrder)

      expect(useOrderStore.getState().currentOrder?.id).toBe("order-001")
      expect((useOrderStore.getState().currentOrder as any)?.totalAmount).toBe(200)
    })

    it("应该能够清除当前订单", () => {
      useOrderStore.setState({ currentOrder: { id: "1" } as any })
      
      useOrderStore.getState().setCurrentOrder(null)
      
      expect(useOrderStore.getState().currentOrder).toBeNull()
    })
  })

  describe("clearError", () => {
    it("应该清除错误信息", () => {
      useOrderStore.setState({ error: "创建失败" })
      useOrderStore.getState().clearError()
      expect(useOrderStore.getState().error).toBeNull()
    })
  })

  describe("查询方法", () => {
    beforeEach(() => {
      useOrderStore.setState({
        orders: [
          { id: "order-001", roomId: "room-101", status: "active", createdAt: new Date().toISOString(), items: [] },
          { id: "order-002", roomId: "room-102", status: "pending", createdAt: new Date().toISOString(), items: [] },
          { id: "order-003", roomId: "room-101", status: "completed", createdAt: "2024-01-01T10:00:00Z", items: [] },
          { id: "order-004", roomId: "room-103", status: "pending", createdAt: new Date().toISOString(), items: [] },
        ] as any,
      })
    })

    it("getOrdersByRoom 应该返回指定房间的订单", () => {
      const roomOrders = useOrderStore.getState().getOrdersByRoom("room-101")
      expect(roomOrders.length).toBe(2)
      expect(roomOrders.every(o => o.roomId === "room-101")).toBe(true)
    })

    it("getPendingOrders 应该返回待处理订单", () => {
      const pending = useOrderStore.getState().getPendingOrders()
      expect(pending.length).toBe(2)
      expect(pending.every(o => o.status === "pending")).toBe(true)
    })

    it("getTodayOrders 应该返回今天的订单", () => {
      const todayOrders = useOrderStore.getState().getTodayOrders()
      expect(todayOrders.length).toBeGreaterThanOrEqual(3)
    })

    it("getOrderCount 应该返回订单数量", () => {
      expect(useOrderStore.getState().getOrderCount()).toBe(4)
    })

    it("getOrdersSafe 应该返回安全的订单数组", () => {
      const safe = useOrderStore.getState().getOrdersSafe()
      expect(Array.isArray(safe)).toBe(true)
      expect(safe.length).toBe(4)
    })
  })

  describe("状态管理", () => {
    it("应该能够更新loading状态", () => {
      useOrderStore.setState({ loading: true })
      expect(useOrderStore.getState().loading).toBe(true)

      useOrderStore.setState({ loading: false })
      expect(useOrderStore.getState().loading).toBe(false)
    })

    it("应该能够设置error状态", () => {
      useOrderStore.setState({ error: "网络错误" })
      expect(useOrderStore.getState().error).toBe("网络错误")
    })

    it("应该能够设置lastFetched时间戳", () => {
      const now = Date.now()
      useOrderStore.setState({ lastFetched: now })
      expect(useOrderStore.getState().lastFetched).toBe(now)
    })
  })

  describe("addOrderItem - 添加订单项", () => {
    it("应该成功添加订单项", async () => {
      useOrderStore.setState({
        orders: [{ id: "order-001", items: [] }] as any,
      })

      await useOrderStore.getState().addOrderItem("order-001", {
        productId: "prod-001",
        productName: "青岛啤酒",
        quantity: 5,
        unitPrice: 12,
        totalPrice: 60,
        status: "pending" as const,
      })

      const order = useOrderStore.getState().orders.find(o => o.id === "order-001")
      expect(order?.items).toHaveLength(1)
    })
  })

  describe("removeOrderItem - 删除订单项", () => {
    it("应该成功删除订单项", async () => {
      useOrderStore.setState({
        orders: [{
          id: "order-001",
          items: [{ id: "item-001", productId: "prod-001" }] as any,
        }] as any,
      })

      await useOrderStore.getState().removeOrderItem("order-001", "item-001")

      const order = useOrderStore.getState().orders.find(o => o.id === "order-001")
      expect(order?.items).toHaveLength(0)
    })
  })

  describe("边界条件测试", () => {
    it("应该处理空订单列表的查询", () => {
      useOrderStore.setState({ orders: [] })

      expect(useOrderStore.getState().getOrdersByRoom("room-101")).toEqual([])
      expect(useOrderStore.getState().getPendingOrders()).toEqual([])
      expect(useOrderStore.getState().getTodayOrders()).toEqual([])
      expect(useOrderStore.getState().getOrderCount()).toBe(0)
    })

    it("应该处理多次clearError调用", () => {
      useOrderStore.setState({ error: "Error 1" })
      useOrderStore.getState().clearError()
      useOrderStore.getState().clearError()

      expect(useOrderStore.getState().error).toBeNull()
    })

    it("应该处理setCurrentOrder为null", () => {
      useOrderStore.setState({ currentOrder: { id: "1" } as any })
      useOrderStore.getState().setCurrentOrder(null)

      expect(useOrderStore.getState().currentOrder).toBeNull()
    })
  })
})
