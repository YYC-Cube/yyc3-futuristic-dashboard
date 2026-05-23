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
  
  // 安全访问辅助方法
  getOrderCount: () => number
  getOrdersSafe: () => Order[]
}

const STALE_TIME = 30_000

// 默认空数组常量（避免重复创建）
const EMPTY_ORDERS: Order[] = []

export const useOrderStore = create<OrderStore>()(
  devtools(
    (set, get) => ({
      orders: EMPTY_ORDERS,
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
            set({ 
              orders: data?.orders ?? EMPTY_ORDERS, 
              loading: false, 
              lastFetched: now 
            })
        } catch (err) {
          console.error('Fetch orders failed:', err)
          set({ 
            error: "获取订单失败", 
            loading: false,
            orders: EMPTY_ORDERS, // 确保失败时也有默认值
          })
        }
      },

      createOrder: async (orderData) => {
        try {
          const order = await orderService.create(orderData)
          if (order) {
            const { orders } = get()
            const safeOrders = orders ?? EMPTY_ORDERS
            set({ 
              orders: [...safeOrders, order], 
              lastFetched: null 
            })
            return order
          }
          return null
        } catch (err) {
          console.error('Create order failed:', err)
          set({ error: "创建订单失败" })
          return null
        }
      },

      updateOrder: async (id, orderData) => {
        try {
          const updated = await orderService.update(id, orderData)
          const { orders } = get()
          const safeOrders = orders ?? EMPTY_ORDERS
          const updatedOrders = safeOrders.map((o) =>
            o.id === id ? { ...o, ...updated } : o
          )
          set({ orders: updatedOrders, lastFetched: null })
        } catch (err) {
          console.error('Update order failed:', err)
          set({ error: "更新订单失败" })
        }
      },

      addOrderItem: async (orderId, orderItem) => {
        try {
          const item = await orderService.addItem(orderId, orderItem)
          const { orders } = get()
          const safeOrders = orders ?? EMPTY_ORDERS
          const updatedOrders = safeOrders.map((o) => {
            if (o.id === orderId) {
              return { ...o, items: [...(o.items ?? []), item] }
            }
            return o
          })
          set({ orders: updatedOrders })
        } catch (err) {
          console.error('Add order item failed:', err)
          set({ error: "添加商品失败" })
        }
      },

      removeOrderItem: async (orderId, itemId) => {
        const { orders } = get()
        const safeOrders = orders ?? EMPTY_ORDERS
        const updatedOrders = safeOrders.map((order) => {
          if (order.id === orderId) {
            const safeItems = order.items ?? []
            return { 
              ...order, 
              items: safeItems.filter((item) => item.id !== itemId) 
            }
          }
          return order
        })
        set({ orders: updatedOrders })
      },

      setCurrentOrder: (order) => set({ currentOrder: order }),
      clearError: () => set({ error: null }),

      getOrdersByRoom: (roomId) => {
        const { orders } = get()
        const safeOrders = orders ?? EMPTY_ORDERS
        return safeOrders.filter((order) => order.roomId === roomId)
      },

      getTodayOrders: () => {
        const today = new Date().toISOString().split("T")[0]
        const { orders } = get()
        const safeOrders = orders ?? EMPTY_ORDERS
        return safeOrders.filter((order) => 
          order.createdAt?.startsWith(today) ?? false
        )
      },

      getPendingOrders: () => {
        const { orders } = get()
        const safeOrders = orders ?? EMPTY_ORDERS
        return safeOrders.filter((order) => order.status === "pending")
      },
      
      // 安全访问方法
      getOrderCount: () => {
        const { orders } = get()
        return (orders ?? EMPTY_ORDERS).length
      },
      
      getOrdersSafe: () => {
        return get().orders ?? EMPTY_ORDERS
      },
    }),
    { name: "OrderStore" }
  )
)
