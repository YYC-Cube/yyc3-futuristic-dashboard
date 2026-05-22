import { describe, it, expect, vi } from "vitest"

vi.mock("../../lib/api/client", () => ({
  apiClient: {
    getRooms: vi.fn().mockResolvedValue({
      code: 200, message: "操作成功",
      data: [{ id: "1", number: "101", status: "available" }],
      timestamp: new Date().toISOString(),
    }),
    getRoomById: vi.fn().mockResolvedValue({
      code: 200, message: "操作成功",
      data: { id: "1", number: "101", status: "available" },
      timestamp: new Date().toISOString(),
    }),
    updateRoomStatus: vi.fn().mockResolvedValue({
      code: 200, message: "操作成功",
      data: { id: "1", status: "occupied" },
      timestamp: new Date().toISOString(),
    }),
    startRoom: vi.fn().mockResolvedValue({
      code: 200, message: "操作成功",
      data: { id: "order-1" },
      timestamp: new Date().toISOString(),
    }),
    checkoutRoom: vi.fn().mockResolvedValue({
      code: 200, message: "操作成功",
      data: {},
      timestamp: new Date().toISOString(),
    }),
  },
}))

import { roomService } from "../../lib/services/room.service"

describe("roomService", () => {
  describe("getRooms", () => {
    it("应该返回包厢列表", async () => {
      const rooms = await roomService.getRooms()
      expect(rooms).toHaveLength(1)
      expect(rooms[0].id).toBe("1")
    })
  })

  describe("updateStatus", () => {
    it("应该更新包厢状态", async () => {
      const result = await roomService.updateStatus("1", "occupied")
      expect(result).toBeDefined()
      expect(result.status).toBe("occupied")
    })
  })

  describe("start", () => {
    it("应该开房成功", async () => {
      const result = await roomService.start("1")
      expect(result).toBeDefined()
    })
  })

  describe("checkout", () => {
    it("应该结账成功", async () => {
      const result = await roomService.checkout("1")
      expect(result).toBeDefined()
    })
  })
})
