"use client"

import { LazyRoomStatusDashboard } from "@/components/lazy-components"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useRoomStore } from "@/lib/stores/useRoomStore"

const LazyRoomDetailModal = dynamic(
  () => import("@/components/room/room-detail-modal"),
  { ssr: false }
)

interface RoomData {
  id: string
  number: string
  type: string
  status: string
  capacity: number
  currentGuests?: number
  startTime?: Date
  amount?: number
  unpaidAmount?: number
  features?: string[]
}

export default function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { fetchRooms, updateRoomStatus, startRoom, checkoutRoom } = useRoomStore()

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const handleRoomClick = (room: RoomData) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const handleAction = async (action: string) => {
    if (!selectedRoom) return
    try {
      switch (action) {
        case "start": await startRoom(selectedRoom.id); break
        case "checkout": await checkoutRoom(selectedRoom.id); break
        case "clean": await updateRoomStatus(selectedRoom.id, "cleaning"); break
        case "pause": await updateRoomStatus(selectedRoom.id, "maintenance"); break
      }
    } catch {
      // TODO: toast error
    }
  }

  const handleQuickAction = async (action: string) => {
    if (action === "refresh") await fetchRooms()
  }

  return (
    <div className="h-full">
      <LazyRoomStatusDashboard onRoomClick={handleRoomClick} onQuickAction={handleQuickAction} />
      <LazyRoomDetailModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedRoom(null) }}
        onAction={handleAction}
      />
    </div>
  )
}
