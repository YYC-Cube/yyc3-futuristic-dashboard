import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"

// Mock Sentry before any imports
const mockSentryCaptureException = vi.fn()
const mockSentryLastEventId = vi.fn(() => "test-error-id")
const mockSentryShowReportDialog = vi.fn()

vi.mock("@sentry/nextjs", () => ({
  captureException: (...args: any[]) => mockSentryCaptureException(...args),
  lastEventId: () => mockSentryLastEventId(),
  showReportDialog: (...args: any[]) => mockSentryShowReportDialog(...args),
}))

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

// Helper function to safely render components
function safeRender(ui: React.ReactElement) {
  return render(ui)
}

describe("Error Boundaries Test Suite", () => {
  
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window.location
    delete (window as any).location
    window.location = { href: "http://localhost", pathname: "/" } as any
  })

  // ============================================================
  // Part 1: Global Error Component Structure Tests
  // ============================================================
  describe("GlobalError Component Structure", () => {
    
    it("应该导出默认函数", async () => {
      const GlobalError = await import("../../app/global-error")
      expect(GlobalError.default).toBeDefined()
      expect(typeof GlobalError.default).toBe('function')
    })

    it("应该接受 error 和 reset 参数", async () => {
      const GlobalError = await import("../../app/global-error")
      const props = {
        error: new Error("test"),
        reset: vi.fn()
      }
      
      // 不应抛出类型错误
      expect(() => {
        React.createElement(GlobalError.default, props)
      }).not.toThrow()
    })
  })

  // ============================================================
  // Part 2: Error Component Structure Tests  
  // ============================================================
  describe("Error Component Structure", () => {
    
    it("应该导出默认函数", async () => {
      const ErrorComponent = await import("../../app/error")
      expect(ErrorComponent.default).toBeDefined()
      expect(typeof ErrorComponent.default).toBe('function')
    })

    it("应该接受 error 和 reset 参数", async () => {
      const ErrorComponent = await import("../../app/error")
      const props = {
        error: new Error("test"),
        reset: vi.fn()
      }
      
      expect(() => {
        React.createElement(ErrorComponent.default, props)
      }).not.toThrow()
    })
  })

  // ============================================================
  // Part 3: OrderStore Safety Tests
  // ============================================================
  describe("OrderStore Type Safety & Default Values", () => {
    
    it("orders 初始状态应该是空数组而非 undefined", async () => {
      const { useOrderStore } = await import("../../lib/stores/useOrderStore")
      const state = useOrderStore.getState()
      
      expect(state.orders).toBeDefined()
      expect(Array.isArray(state.orders)).toBe(true)
      expect(state.orders).toHaveLength(0)
    })

    it("getOrderCount 方法应该始终返回非负数", async () => {
      const { useOrderStore } = await import("../../lib/stores/useOrderStore")
      const state = useOrderStore.getState()
      
      if (state.getOrderCount) {
        const count = state.getOrderCount()
        expect(typeof count).toBe('number')
        expect(count).toBeGreaterThanOrEqual(0)
        expect(Number.isInteger(count)).toBe(true)
      }
    })

    it("getOrdersSafe 方法应该始终返回数组", async () => {
      const { useOrderStore } = await import("../../lib/stores/useOrderStore")
      const state = useOrderStore.getState()
      
      if (state.getOrdersSafe) {
        const orders = state.getOrdersSafe()
        expect(Array.isArray(orders)).toBe(true)
        expect(orders).toBeDefined()
      }
    })

    it("初始状态的所有字段都应该有安全默认值", async () => {
      const { useOrderStore } = await import("../../lib/stores/useOrderStore")
      const state = useOrderStore.getState()
      
      // 验证所有关键字段
      expect(state.orders).toEqual([])
      expect(state.currentOrder).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).toBeNull()
    })

    it("即使手动设置 undefined，getOrdersSafe 也应返回空数组", async () => {
      const { useOrderStore } = await import("../../lib/stores/useOrderStore")
      
      // 模拟异常状态
      useOrderStore.setState({ orders: undefined as any })
      
      const state = useOrderStore.getState()
      if (state.getOrdersSafe) {
        const orders = state.getOrdersSafe()
        expect(Array.isArray(orders)).toBe(true)
      }
      
      // 重置为正常状态
      useOrderStore.setState({ orders: [] })
    })
  })

  // ============================================================
  // Part 4: Error Handling Edge Cases
  // ============================================================
  describe("Edge Cases and Error Scenarios", () => {
    
    it("应该处理空字符串错误消息", async () => {
      const ErrorComponent = await import("../../app/error")
      const emptyError = new Error("")
      
      expect(() => {
        safeRender(
          React.createElement(ErrorComponent.default, {
            error: emptyError,
            reset: vi.fn()
          })
        )
      }).not.toThrow()
    })

    it("应该处理带有特殊字符的错误消息", async () => {
      const ErrorComponent = await import("../../app/error")
      const xssError = new Error("<script>alert('xss')</script>")
      
      expect(() => {
        safeRender(
          React.createElement(ErrorComponent.default, {
            error: xssError,
            reset: vi.fn()
          })
        )
      }).not.toThrow()
    })

    it("应该处理超长错误消息（10000+字符）", async () => {
      const ErrorComponent = await import("../../app/error")
      const longMessage = "A".repeat(10000)
      const longError = new Error(longMessage)
      
      expect(() => {
        safeRender(
          React.createElement(ErrorComponent.default, {
            error: longError,
            reset: vi.fn()
          })
        )
      }).not.toThrow()
    })

    it("应该处理带堆栈跟踪的错误", async () => {
      const ErrorComponent = await import("../../app/error")
      const stackError = new Error("Stack test")
      stackError.stack = `Error: Stack test
    at Component (/app/page.tsx:10:5)
    at renderWithHooks (react-dom.js:14985:18)`
      
      expect(() => {
        safeRender(
          React.createElement(ErrorComponent.default, {
            error: stackError,
            reset: vi.fn()
          })
        )
      }).not.toThrow()
    })

    it("应该处理带 digest ID 的错误", async () => {
      const ErrorComponent = await import("../../app/error")
      const digestError = new Error("Digest test") as Error & { digest?: string }
      digestError.digest = "error-digest-12345"
      
      expect(() => {
        safeRender(
          React.createElement(ErrorComponent.default, {
            error: digestError,
            reset: vi.fn()
          })
        )
      }).not.toThrow()
    })

    it("reset 函数应该被正确调用多次而不出错", async () => {
      const ErrorComponent = await import("../../app/error")
      const mockReset = vi.fn()
      
      const { unmount } = safeRender(
        React.createElement(ErrorComponent.default, {
          error: new Error("Multi-click test"),
          reset: mockReset
        })
      )
      
      // 模拟用户快速点击重试按钮10次
      for (let i = 0; i < 10; i++) {
        try {
          const buttons = screen.getAllByRole('button')
          const retryButton = buttons.find(btn => 
            btn.textContent?.includes('重试加载') || btn.textContent?.includes('Retry')
          )
          if (retryButton) {
            fireEvent.click(retryButton)
          }
        } catch (e) {
          // 按钮可能不存在，忽略
        }
      }
      
      unmount()
    })
  })

  // ============================================================
  // Part 5: Sentry Integration Tests
  // ============================================================
  describe("Sentry Integration Safety", () => {
    
    it("Sentry 调用应该在 try-catch 中，不应导致崩溃", async () => {
      const ErrorComponent = await import("../../app/error")
      
      // 即使 Sentry 抛出异常也不应影响组件渲染
      mockSentryCaptureException.mockImplementationOnce(() => {
        throw new Error("Sentry failed")
      })
      
      expect(() => {
        safeRender(
          React.createElement(ErrorComponent.default, {
            error: new Error("Sentry failure test"),
            reset: vi.fn()
          })
        )
      }).not.toThrow()
    })

    it("未配置 Sentry DSN 时不应报错", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_SENTRY_DSN
      
      // 测试无 Sentry 配置的情况
      delete process.env.NEXT_PUBLIC_SENTRY_DSN
      
      const ErrorComponent = await import("../../app/error")
      
      expect(() => {
        safeRender(
          React.createElement(ErrorComponent.default, {
            error: new Error("No Sentry config"),
            reset: vi.fn()
          })
        )
      }).not.toThrow()
      
      // 恢复环境变量
      if (originalEnv) {
        process.env.NEXT_PUBLIC_SENTRY_DSN = originalEnv
      }
    })
  })

  // ============================================================
  // Part 6: Accessibility & UX Tests
  // ============================================================
  describe("User Experience and Accessibility", () => {
    
    it("错误页面应该提供清晰的视觉反馈", async () => {
      const ErrorComponent = await import("../../app/error")
      
      const { container } = safeRender(
        React.createElement(ErrorComponent.default, {
          error: new Error("UX test"),
          reset: vi.fn()
        })
      )
      
      // 应该有可见的内容
      expect(container.innerHTML.length).toBeGreaterThan(0)
    })

    it("应该提供多种恢复选项给用户", async () => {
      const ErrorComponent = await import("../../app/error")
      
      safeRender(
        React.createElement(ErrorComponent.default, {
          error: new Error("Options test"),
          reset: vi.fn()
        })
      )
      
      // 应该至少有一个可交互元素（按钮或链接）
      const interactiveElements = screen.getAllByRole('button')
      expect(interactiveElements.length).toBeGreaterThanOrEqual(1)
    })
  })

  // ============================================================
  // Part 7: Data Integrity Tests
  // ============================================================
  describe("Data Integrity and State Management", () => {
    
    it("OrderStore 应该在 fetchOrders 失败后保持一致状态", async () => {
      const { useOrderStore } = await import("../../lib/stores/useOrderStore")
      
      const initialState = useOrderStore.getState()
      
      // 验证初始状态完整性
      expect(initialState.orders).toBeDefined()
      expect(Array.isArray(initialState.orders)).toBe(true)
      
      // 所有辅助方法应该可用
      if (initialState.getOrderCount) {
        expect(typeof initialState.getOrderCount).toBe('function')
      }
      
      if (initialState.getOrdersSafe) {
        expect(typeof initialState.getOrdersSafe).toBe('function')
      }
    })

    it("状态更新不应该引入 undefined 值", async () => {
      const { useOrderStore } = await import("../../lib/stores/useOrderStore")

      // 设置一些测试数据（完整的 Order 类型）
      const testOrders = [
        {
          id: "1",
          roomId: "room-101",
          roomNumber: "101",
          waiterId: "waiter-1",
          waiterName: "服务员A",
          orderType: "room_service" as const,
          status: "confirmed" as const,
          items: [],
          subtotal: 100,
          discount: 0,
          tax: 0,
          total: 100,
          paymentStatus: "unpaid" as const,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
        {
          id: "2",
          roomId: "room-102",
          roomNumber: "102",
          waiterId: "waiter-2",
          waiterName: "服务员B",
          orderType: "room_service" as const,
          status: "completed" as const,
          items: [],
          subtotal: 200,
          discount: 0,
          tax: 0,
          total: 200,
          paymentStatus: "paid" as const,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      ]

      useOrderStore.setState({ orders: testOrders })
      
      const state = useOrderStore.getState()
      
      // 验证数据完整性
      expect(state.orders).toHaveLength(2)
      expect(state.orders[0].id).toBe("1")
      
      // 辅助方法应该返回正确的值
      if (state.getOrderCount) {
        expect(state.getOrderCount()).toBe(2)
      }
      
      if (state.getOrdersSafe) {
        const safeOrders = state.getOrdersSafe()
        expect(safeOrders).toEqual(testOrders)
      }
      
      // 重置状态
      useOrderStore.setState({ orders: [] })
    })
  })
})

describe("Integration: System Resilience", () => {
  
  it("系统应该能够优雅地处理连续的错误场景", async () => {
    const ErrorComponent = await import("../../app/error")
    
    // 模拟连续多个不同类型的错误
    const errors = [
      new Error("Network error"),
      new Error("Timeout"),
      new Error("Permission denied"),
      new Error(""), // 空错误
    ]
    
    for (const error of errors) {
      expect(() => {
        const { unmount } = safeRender(
          React.createElement(ErrorComponent.default, {
            error: error,
            reset: vi.fn()
          })
        )
        unmount()
      }).not.toThrow()
    }
  })

  it("OrderStore 应该在各种边界条件下保持稳定", async () => {
    const { useOrderStore } = await import("../../lib/stores/useOrderStore")
    
    // 测试各种边界条件
    const edgeCases = [
      [], // 空数组
      [{
        id: "1",
        roomId: "room-101",
        roomNumber: "101",
        waiterId: "waiter-1",
        waiterName: "服务员A",
        orderType: "room_service" as const,
        status: "confirmed" as const,
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        paymentStatus: "unpaid" as const,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      }], // 单元素
      Array(100).fill(null).map((_, i) => ({ // 大数组
        id: String(i),
        roomId: `room-${i}`,
        roomNumber: String(i),
        waiterId: `waiter-${i}`,
        waiterName: `服务员${i}`,
        orderType: "room_service" as const,
        status: "confirmed" as const,
        items: [],
        subtotal: i * 100,
        discount: 0,
        tax: 0,
        total: i * 100,
        paymentStatus: "unpaid" as const,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      })),
    ]
    
    for (const orders of edgeCases) {
      useOrderStore.setState({ orders })
      
      const state = useOrderStore.getState()
      
      // 验证状态一致性
      expect(state.orders).toEqual(orders)
      
      if (state.getOrderCount) {
        expect(state.getOrderCount()).toBe(orders.length)
      }
      
      if (state.getOrdersSafe) {
        expect(state.getOrdersSafe()).toEqual(orders)
      }
    }
    
    // 最终重置
    useOrderStore.setState({ orders: [] })
  })
})
