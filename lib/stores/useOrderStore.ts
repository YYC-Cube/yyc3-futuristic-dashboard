import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { orderService } from "../services"
import type { Order, OrderItem } from "../api/types"

interface OrderStore {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
  lastFetched: number | null

  fetchOrders: (params?: Record<string, unknown>) => Promise<void>
  createOrder: (orderData: Partial<Order>) => Promise<Order | null>
  updateOrder: (id: string, orderData: Partial<Order>) => Promise<void>
  addOrderItem: (orderId: string, item: Omit<OrderItem, "id">) => Promise<void>
  removeOrderItem: (orderId: string, itemId: string) => Promise<void>
  setCurrentOrder: (order: Order | null) => void
  clearError: () => void

  getOrdersByRoom: (roomId: string) => Order[]
  getTodayOrders: () => Order[]
  getPendingOrders: () => Order[]
}

const STALE_TIME = 30_000

export const useOrderStore = create<OrderStore>()(
  devtools(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
      lastFetched: null,

      fetchOrders: async (params) => {
        const now = Date.now()
        const { lastFetched, loading } = get()
        if (loading) return
        if (lastFetched && now - lastFetched < STALE_TIME) return

        set({ loading: true, error: null })
        try {
          const data = await orderService.getOrders(params)
            set({ orders: data.orders, loading: false, lastFetched: now })
        } catch {
          set({ error: "获取订单失败", loading: false })
        }
      },

      createOrder: async (orderData) => {
        try {
          const order = await orderService.create(orderData)
          if (order) {
            const { orders } = get()
            set({ orders: [...orders, order], lastFetched: null })
            return order
          }
          return null
        } catch {
          set({ error: "创建订单失败" })
          return null
        }
      },

      updateOrder: async (id, orderData) => {
        try {
          const updated = await orderService.update(id, orderData)
          const { orders } = get()
          const updatedOrders = orders.map((o) =>
            o.id === id ? { ...o, ...updated } : o
          )
          set({ orders: updatedOrders, lastFetched: null })
        } catch {
          set({ error: "更新订单失败" })
        }
      },

      addOrderItem: async (orderId, orderItem) => {
        try {
          const item = await orderService.addItem(orderId, orderItem)
          const { orders } = get()
          const updatedOrders = orders.map((o) => {
            if (o.id === orderId) {
              return { ...o, items: [...o.items, item] }
            }
            return o
          })
          set({ orders: updatedOrders })
        } catch {
          set({ error: "添加商品失败" })
        }
      },

      removeOrderItem: async (orderId, itemId) => {
        const { orders } = get()
        const updatedOrders = orders.map((order) => {
          if (order.id === orderId) {
            return { ...order, items: order.items.filter((item) => item.id !== itemId) }
          }
          return order
        })
        set({ orders: updatedOrders })
      },

      setCurrentOrder: (order) => set({ currentOrder: order }),
      clearError: () => set({ error: null }),

      getOrdersByRoom: (roomId) => get().orders.filter((order) => order.roomId === roomId),

      getTodayOrders: () => {
        const today = new Date().toISOString().split("T")[0]
        return get().orders.filter((order) => order.createdAt.startsWith(today))
      },

      getPendingOrders: () => get().orders.filter((order) => order.status === "pending"),
    }),
    { name: "OrderStore" }
  )
)
