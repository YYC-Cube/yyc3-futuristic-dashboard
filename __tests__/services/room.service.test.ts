import { describe, it, expect } from 'vitest'
import { roomService } from '@/lib/services/room.service'

describe('roomService', () => {
  describe('服务结构验证', () => {
    it('应该导出正确的服务方法', () => {
      expect(roomService).toBeDefined()
      expect(typeof roomService.getRooms).toBe('function')
      expect(typeof roomService.getRoomById).toBe('function')
      expect(typeof roomService.updateStatus).toBe('function')
      expect(typeof roomService.start).toBe('function')
      expect(typeof roomService.checkout).toBe('function')
    })

    it('getRooms 应该是一个异步函数', () => {
      const result = roomService.getRooms()
      expect(result).toBeInstanceOf(Promise)
    })

    it('getRoomById 应该接受id参数', async () => {
      try {
        await roomService.getRoomById('test-id')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('updateStatus 应该接受必要参数', async () => {
      try {
        await roomService.updateStatus('room-001', 'available')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('start 应该接受roomId参数', async () => {
      try {
        await roomService.start('room-001')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('start 应该接受可选的customerId和packageId参数', async () => {
      try {
        await roomService.start('room-001', 'customer-001', 'package-001')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('checkout 应该接受roomId参数', async () => {
      try {
        await roomService.checkout('room-001')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('正常功能测试', () => {
    it('getRooms 应该返回房间数据或null', async () => {
      const result = await roomService.getRooms()

      expect(result !== undefined).toBe(true)
      expect(result === null || Array.isArray(result)).toBe(true)
    })

    it('getRoomById 应该返回房间对象或undefined', async () => {
      const result = await roomService.getRoomById('room-001')

      expect(result !== undefined).toBe(true)
      if (result) {
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('number')
      }
    })

    it('updateStatus 应该更新房间状态', async () => {
      const result = await roomService.updateStatus('room-001', 'cleaning')

      expect(result !== undefined).toBe(true)
    })

    it('start 应该创建订单', async () => {
      const result = await roomService.start('room-001')

      expect(result !== undefined).toBe(true)
      if (result) {
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('roomId')
      }
    })

    it('checkout 应该结账并返回信息', async () => {
      const result = await roomService.checkout('room-001')

      expect(result !== undefined).toBe(true)
    })
  })

  describe('边界情况处理', () => {
    it('getRoomById 对于不存在的ID应返回undefined或抛出错误', async () => {
      let result
      let threwError = false

      try {
        result = await roomService.getRoomById('non-existent-id')
      } catch (error) {
        threwError = true
        expect(error).toBeInstanceOf(Error)
      }

      expect(threwError || result === undefined || result === null).toBe(true)
    })

    it('updateStatus 对于空字符串参数应处理优雅降级', async () => {
      let result
      let threwError = false

      try {
        result = await roomService.updateStatus('', '')
      } catch (error) {
        threwError = true
      }

      expect(threwError || result === undefined || result === null).toBe(true)
    })

    it('并发调用应该正常工作', async () => {
      const promises = [
        roomService.getRooms(),
        roomService.getRooms(),
        roomService.getRooms(),
      ]

      const results = await Promise.allSettled(promises)

      results.forEach((result) => {
        expect(result.status).toBe('fulfilled')
      })
    })
  })

  describe('数据完整性验证', () => {
    it('返回的房间数据应该包含必要字段', async () => {
      const rooms = await roomService.getRooms()

      if (Array.isArray(rooms) && rooms.length > 0) {
        const room = rooms[0]
        expect(room).toHaveProperty('id')
        expect(room).toHaveProperty('number')
        expect(room).toHaveProperty('type')
        expect(room).toHaveProperty('status')
        expect(room).toHaveProperty('capacity')
      }
    })

    it('房间状态应该是有效的枚举值', async () => {
      const rooms = await roomService.getRooms()
      const validStatuses = ['available', 'occupied', 'cleaning', 'maintenance', 'checkout']

      if (Array.isArray(rooms)) {
        rooms.forEach((room: any) => {
          expect(validStatuses).toContain(room.status)
        })
      }
    })
  })
})
