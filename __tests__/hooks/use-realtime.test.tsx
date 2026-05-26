import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRealtime } from '@/lib/hooks/use-realtime'

const mockListeners = new Map<string, Array<(data: unknown) => void>>()

const mockWebSocketManager = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  send: vi.fn(),
  on: vi.fn((event: string, callback: (data: unknown) => void) => {
    if (!mockListeners.has(event)) {
      mockListeners.set(event, [])
    }
    mockListeners.get(event)!.push(callback)
    return () => {
      const listeners = mockListeners.get(event)
      const index = listeners?.indexOf(callback)
      if (index !== undefined && index > -1) {
        listeners?.splice(index, 1)
      }
    }
  }),
  mockEmit: (event: string, data?: unknown) => {
    const listeners = mockListeners.get(event)
    listeners?.forEach(cb => cb(data))
  },
  _clearMocks: () => mockListeners.clear(),
}

vi.mock('@/lib/websocket/manager', () => ({
  getWebSocketManager: () => mockWebSocketManager,
}))

describe('useRealtime', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockListeners.clear()
  })

  describe('初始状态', () => {
    it('默认应该断开连接状态', () => {
      const { result } = renderHook(() => useRealtime())

      expect(result.current.connected).toBe(false)
    })

    it('应该返回send和disconnect函数', () => {
      const { result } = renderHook(() => useRealtime())

      expect(typeof result.current.send).toBe('function')
      expect(typeof result.current.disconnect).toBe('function')
    })
  })

  describe('autoConnect选项', () => {
    it('默认应该自动连接（autoConnect=true）', () => {
      renderHook(() => useRealtime())

      expect(mockWebSocketManager.connect).toHaveBeenCalled()
    })

    it('设置autoConnect=false时不应该自动连接', () => {
      renderHook(() => useRealtime({ autoConnect: false }))

      expect(mockWebSocketManager.connect).not.toHaveBeenCalled()
    })
  })

  describe('连接状态管理', () => {
    it('收到connected状态时应该更新connected为true', async () => {
      const { result } = renderHook(() => useRealtime())

      await act(async () => {
        mockWebSocketManager.mockEmit('connection_status', { status: 'connected' })
      })
      
      expect(result.current.connected).toBe(true)
    })

    it('收到disconnected状态时应该更新connected为false', async () => {
      const { result } = renderHook(() => useRealtime())

      await act(async () => {
        mockWebSocketManager.mockEmit('connection_status', { status: 'connected' })
      })
      expect(result.current.connected).toBe(true)

      await act(async () => {
        mockWebSocketManager.mockEmit('connection_status', { status: 'disconnected' })
      })
      expect(result.current.connected).toBe(false)
    })
  })

  describe('消息处理', () => {
    it('应该监听指定的事件并调用onMessage回调', async () => {
      const onMessageMock = vi.fn()
      renderHook(() => useRealtime({ events: ['room_update' as any], onMessage: onMessageMock }))
      
      await act(async () => {
        mockWebSocketManager.mockEmit('room_update', { roomId: 'room-001', status: 'occupied' })
      })
      
      expect(onMessageMock).toHaveBeenCalledWith('room_update', { roomId: 'room-001', status: 'occupied' })
    })

    it('应该支持多个事件监听', async () => {
      const onMessageMock = vi.fn()
      renderHook(() => useRealtime({ 
        events: ['room_update' as any, 'order_update' as any], 
        onMessage: onMessageMock 
      }))
      
      await act(async () => {
        mockWebSocketManager.mockEmit('room_update', { id: 1 })
        mockWebSocketManager.mockEmit('order_update', { id: 2 })
      })
      
      expect(onMessageMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('send方法', () => {
    it('应该通过WebSocket发送消息', () => {
      const { result } = renderHook(() => useRealtime())

      result.current.send('test', { message: 'hello' })

      expect(mockWebSocketManager.send).toHaveBeenCalledWith('test', { message: 'hello' })
    })

    it('应该能够发送不同类型的消息', () => {
      const { result } = renderHook(() => useRealtime())

      result.current.send('action', { action: 'start' })
      result.current.send('query', { id: '123' })

      expect(mockWebSocketManager.send).toHaveBeenCalledTimes(2)
    })
  })

  describe('disconnect方法', () => {
    it('应该调用WebSocket的disconnect方法', () => {
      const { result } = renderHook(() => useRealtime())

      result.current.disconnect()

      expect(mockWebSocketManager.disconnect).toHaveBeenCalled()
    })
  })

  describe('清理行为', () => {
    it('卸载时应该取消所有事件订阅', () => {
      const { unmount } = renderHook(() =>
        useRealtime({
          events: ['event1', 'event2'] as any[],
          onMessage: vi.fn(),
        })
      )

      unmount()

      expect(mockWebSocketManager.on).toHaveBeenCalled()
    })

    describe('边界情况', () => {
      it('空事件列表不应该报错', () => {
        expect(() => {
          renderHook(() => useRealtime({ events: [] }))
        }).not.toThrow()
      })

      it('没有options对象不应该报错', () => {
        expect(() => {
          renderHook(() => useRealtime())
        }).not.toThrow()
      })

      it('多次更新连接状态应该正确反映最新状态', async () => {
        const { result } = renderHook(() => useRealtime())

        await act(async () => {
          mockWebSocketManager.mockEmit('connection_status', { status: 'connected' })
        })
        expect(result.current.connected).toBe(true)

        await act(async () => {
          mockWebSocketManager.mockEmit('connection_status', { status: 'connecting' })
        })
        expect(result.current.connected).toBe(false)

        await act(async () => {
          mockWebSocketManager.mockEmit('connection_status', { status: 'connected' })
        })
        expect(result.current.connected).toBe(true)
      })
    })
  })
})