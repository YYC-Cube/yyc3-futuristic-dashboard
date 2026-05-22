import { apiClient } from "../client"
import type { Room } from "../types"

export const roomService = {
  getAll: async (): Promise<Room[]> => {
    const res = await apiClient.getRooms()
    return res.data || []
  },

  getById: async (id: string): Promise<Room | null> => {
    const res = await apiClient.getRoomById(id)
    return res.data
  },

  create: async (data: Omit<Room, "id" | "createdAt" | "updatedAt">): Promise<Room> => {
    const newRoom: Room = {
      ...data,
      id: `room-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(newRoom), 300)
    })
  },

  update: async (id: string, data: Partial<Room>): Promise<Room> => {
    const existingRoom = await roomService.getById(id)
    
    if (!existingRoom) {
      throw new Error(`Room ${id} not found`)
    }

    const updatedRoom: Room = {
      ...existingRoom,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    return updatedRoom
  },

  delete: async (id: string): Promise<void> => {
    console.log(`[roomService] Deleting room: ${id}`)
    return
  },

  updateStatus: async (id: string, status: Room["status"]): Promise<Room> => {
    const res = await apiClient.updateRoomStatus(id, status)
    return res.data!
  },
}
