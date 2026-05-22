import { apiClient } from "../api/client"
import type { Order, OrderItem } from "../api/types"

export const orderService = {
  async getOrders(params?: Record<string, unknown>) {
    const response = await apiClient.getOrders(params)
    if (response.code === 200) return response.data
    throw new Error(response.message)
  },

  async create(orderData: Partial<Order>) {
    const response = await apiClient.createOrder(orderData)
    if (response.code === 200) return response.data
    throw new Error(response.message)
  },

  async update(id: string, orderData: Partial<Order>) {
    const response = await apiClient.updateOrder(id, orderData)
    if (response.code === 200) return response.data
    throw new Error(response.message)
  },

  async addItem(orderId: string, item: Omit<OrderItem, "id">) {
    const response = await apiClient.addOrderItem(orderId, item)
    if (response.code === 200) return response.data
    throw new Error(response.message)
  },
}
