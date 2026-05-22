import { apiClient } from "../api/client"
import type { Room, Order } from "../api/types"

export const roomService = {
  async getRooms() {
    const response = await apiClient.getRooms()
    if (response.code === 200) return response.data
    throw new Error(response.message)
  },

  async getRoomById(id: string) {
    const response = await apiClient.getRoomById(id)
    if (response.code === 200) return response.data
    throw new Error(response.message)
  },

  async updateStatus(id: string, status: string, data?: Record<string, unknown>) {
    const response = await apiClient.updateRoomStatus(id, status, data)
    if (response.code === 200) return response.data
    throw new Error(response.message)
  },

  async start(roomId: string, customerId?: string, packageId?: string) {
    const response = await apiClient.startRoom(roomId, customerId, packageId)
    if (response.code === 200) return response.data
    throw new Error(response.message)
  },

  async checkout(roomId: string) {
    const response = await apiClient.checkoutRoom(roomId)
    if (response.code === 200) return response.data
    throw new Error(response.message)
  },
}
