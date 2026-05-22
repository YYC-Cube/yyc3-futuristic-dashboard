import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { roomService } from "../services"
import type { Room } from "../api/types"

interface RoomStats {
  total: number
  available: number
  occupied: number
  cleaning: number
  maintenance: number
  checkout: number
}

interface RoomStore {
  rooms: Room[]
  selectedRoom: Room | null
  loading: boolean
  error: string | null
  lastFetched: number | null

  fetchRooms: () => Promise<void>
  selectRoom: (room: Room | null) => void
  updateRoomStatus: (roomId: string, status: string, data?: Record<string, unknown>) => Promise<void>
  startRoom: (roomId: string, customerId?: string, packageId?: string) => Promise<void>
  checkoutRoom: (roomId: string) => Promise<void>
  cleanRoom: (roomId: string) => Promise<void>
  refreshRooms: () => Promise<void>
  clearError: () => void

  getRoomsByStatus: (status: string) => Room[]
  getRoomStats: () => RoomStats
}

const STALE_TIME = 30_000

export const useRoomStore = create<RoomStore>()(
  devtools(
    (set, get) => ({
      rooms: [],
      selectedRoom: null,
      loading: false,
      error: null,
      lastFetched: null,

      fetchRooms: async () => {
        const now = Date.now()
        const { lastFetched, loading } = get()
        if (loading) return
        if (lastFetched && now - lastFetched < STALE_TIME) return

        set({ loading: true, error: null })
        try {
          const rooms = await roomService.getRooms()
          set({ rooms, loading: false, lastFetched: now })
        } catch {
          set({ error: "获取包厢信息失败", loading: false })
        }
      },

      selectRoom: (room) => set({ selectedRoom: room }),

      updateRoomStatus: async (roomId, status, data) => {
        const { rooms } = get()
        const prevRooms = rooms
        const optimisticRooms = rooms.map((r) =>
          r.id === roomId ? { ...r, status: status as Room["status"] } : r
        )
        set({ rooms: optimisticRooms })

        try {
          const updated = await roomService.updateStatus(roomId, status, data)
            const updatedRooms = rooms.map((room) =>
              room.id === roomId ? { ...room, ...updated } : room
            )
            set({ rooms: updatedRooms, lastFetched: null })
        } catch {
          set({ rooms: prevRooms, error: "更新包厢状态失败" })
        }
      },

      startRoom: async (roomId, customerId, packageId) => {
        try {
          await roomService.start(roomId, customerId, packageId)
          set({ lastFetched: null })
          await get().fetchRooms()
        } catch {
          set({ error: "开房失败" })
        }
      },

      checkoutRoom: async (roomId) => {
        try {
          await roomService.checkout(roomId)
          set({ lastFetched: null })
          await get().fetchRooms()
        } catch {
          set({ error: "结账失败" })
        }
      },

      cleanRoom: async (roomId) => {
        await get().updateRoomStatus(roomId, "cleaning")
      },

      refreshRooms: async () => {
        set({ lastFetched: null })
        await get().fetchRooms()
      },

      clearError: () => set({ error: null }),

      getRoomsByStatus: (status) => get().rooms.filter((room) => room.status === status),

      getRoomStats: () => {
        const { rooms } = get()
        return {
          total: rooms.length,
          available: rooms.filter((r) => r.status === "available").length,
          occupied: rooms.filter((r) => r.status === "occupied").length,
          cleaning: rooms.filter((r) => r.status === "cleaning").length,
          maintenance: rooms.filter((r) => r.status === "maintenance").length,
          checkout: rooms.filter((r) => r.status === "checkout").length,
        }
      },
    }),
    { name: "RoomStore" }
  )
)
