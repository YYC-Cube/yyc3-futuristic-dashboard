import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { roomService } from "../services"
import type { Room } from "../api/types"

const EMPTY_ROOMS: Room[] = []

interface RoomStats {
  total: number
  available: number
  occupied: number
  cleaning: number
  maintenance: number
  checkout: number
}

interface RoomStoreState {
  rooms: Room[]
  selectedRoom: Room | null
  loading: boolean
  error: string | null
  lastFetched: number | null
}

interface RoomStoreActions {
  fetchRooms: () => Promise<void>
  selectRoom: (room: Room | null) => void
  updateRoomStatus: (roomId: string, status: string, data?: Record<string, unknown>) => Promise<void>
  startRoom: (roomId: string, customerId?: string, packageId?: string) => Promise<void>
  checkoutRoom: (roomId: string) => Promise<void>
  cleanRoom: (roomId: string) => Promise<void>
  refreshRooms: () => Promise<void>
  clearError: () => void
  reset: () => void

  getRoomsByStatus: (status: string) => Room[]
  getRoomStats: () => RoomStats
  getRoomCount: () => number
  getRoomsSafe: () => Room[]
  getAvailableRooms: () => Room[]
  getOccupiedRooms: () => Room[]
}

type RoomStore = RoomStoreState & RoomStoreActions

const STALE_TIME = 30_000

export const useRoomStore = create<RoomStore>()(
  devtools(
    (set, get) => ({
      rooms: EMPTY_ROOMS,
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
          set({ rooms: rooms ?? EMPTY_ROOMS, loading: false, lastFetched: now })
        } catch (err) {
          console.error("❌ [RoomStore] Fetch rooms failed:", err)
          set({ 
            error: "获取包厢信息失败", 
            loading: false,
            rooms: EMPTY_ROOMS,
          })
        }
      },

      selectRoom: (room) => set({ selectedRoom: room }),

      updateRoomStatus: async (roomId, status, data) => {
        const currentRooms = get().rooms ?? EMPTY_ROOMS
        const prevRooms = currentRooms
        const optimisticRooms = currentRooms.map((r) =>
          r.id === roomId ? { ...r, status: status as Room["status"] } : r
        )
        set({ rooms: optimisticRooms })

        try {
          const updated = await roomService.updateStatus(roomId, status, data)
            const updatedRooms = currentRooms.map((room) =>
              room.id === roomId ? { ...room, ...updated } : room
            )
            set({ rooms: updatedRooms, lastFetched: null })
        } catch (err) {
          console.error("❌ [RoomStore] Update room status failed:", err)
          set({ rooms: prevRooms, error: "更新包厢状态失败" })
        }
      },

      startRoom: async (roomId, customerId, packageId) => {
        try {
          await roomService.start(roomId, customerId, packageId)
          set({ lastFetched: null })
          await get().fetchRooms()
        } catch (err) {
          console.error("❌ [RoomStore] Start room failed:", err)
          set({ error: "开房失败" })
        }
      },

      checkoutRoom: async (roomId) => {
        try {
          await roomService.checkout(roomId)
          set({ lastFetched: null })
          await get().fetchRooms()
        } catch (err) {
          console.error("❌ [RoomStore] Checkout room failed:", err)
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

      reset: () => set({
        rooms: EMPTY_ROOMS,
        selectedRoom: null,
        loading: false,
        error: null,
        lastFetched: null,
      }),

      getRoomsByStatus: (status) => (get().rooms ?? EMPTY_ROOMS).filter((room) => room.status === status),

      getRoomStats: () => {
        const safeRooms = get().rooms ?? EMPTY_ROOMS
        return {
          total: safeRooms.length,
          available: safeRooms.filter((r) => r.status === "available").length,
          occupied: safeRooms.filter((r) => r.status === "occupied").length,
          cleaning: safeRooms.filter((r) => r.status === "cleaning").length,
          maintenance: safeRooms.filter((r) => r.status === "maintenance").length,
          checkout: safeRooms.filter((r) => r.status === "checkout").length,
        }
      },

      getRoomCount: () => (get().rooms ?? EMPTY_ROOMS).length,

      getRoomsSafe: () => get().rooms ?? EMPTY_ROOMS,

      getAvailableRooms: () => (get().rooms ?? EMPTY_ROOMS).filter((r) => r.status === "available"),

      getOccupiedRooms: () => (get().rooms ?? EMPTY_ROOMS).filter((r) => r.status === "occupied"),
    }),
    { name: "RoomStore" }
  )
)

export type { RoomStoreState, RoomStoreActions, RoomStats }
