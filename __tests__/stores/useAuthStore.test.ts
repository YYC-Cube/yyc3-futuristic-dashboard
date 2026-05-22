import { describe, it, expect, beforeEach, vi } from "vitest"

const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: vi.fn((key: string, value: string) => { mockLocalStorage.store[key] = value }),
  removeItem: vi.fn((key: string) => { delete mockLocalStorage.store[key] }),
  clear: vi.fn(() => { mockLocalStorage.store = {} }),
}
Object.defineProperty(globalThis, "localStorage", { value: mockLocalStorage })

vi.mock("../../lib/api/client", () => ({
  apiClient: {
    login: vi.fn().mockResolvedValue({
      code: 200,
      message: "登录成功",
      data: {
        token: "test-jwt-token",
        user: { id: "admin-1", name: "管理员", role: "admin" },
      },
      timestamp: new Date().toISOString(),
    }),
    logout: vi.fn(),
  },
}))

import { useAuthStore } from "../../lib/stores/useAuthStore"

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    })
    mockLocalStorage.store = {}
  })

  describe("初始状态", () => {
    it("应该有正确的默认值", () => {
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe("login", () => {
    it("应该成功登录并存储 token", async () => {
      const result = await useAuthStore.getState().login("admin", "password")
      expect(result).toBe(true)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.token).toBe("test-jwt-token")
      expect(state.user?.name).toBe("管理员")
      expect(state.user?.role).toBe("admin")
      expect(state.loading).toBe(false)
    })

    it("登录成功后应该持久化到 localStorage", async () => {
      await useAuthStore.getState().login("admin", "password")
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("yyc3_auth_token", "test-jwt-token")
    })
  })

  describe("logout", () => {
    it("应该清除认证状态", async () => {
      await useAuthStore.getState().login("admin", "password")
      useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it("应该清除 localStorage", () => {
      useAuthStore.getState().logout()
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("yyc3_auth_token")
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("yyc3_auth_user")
    })
  })

  describe("loadFromStorage", () => {
    it("应该从 localStorage 恢复认证状态", () => {
      mockLocalStorage.store["yyc3_auth_token"] = "stored-token"
      mockLocalStorage.store["yyc3_auth_user"] = JSON.stringify({ id: "1", name: "测试", role: "staff" })

      useAuthStore.getState().loadFromStorage()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.token).toBe("stored-token")
      expect(state.user?.name).toBe("测试")
    })

    it("localStorage 为空时不应设置认证", () => {
      useAuthStore.getState().loadFromStorage()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe("clearError", () => {
    it("应该清除错误信息", () => {
      useAuthStore.setState({ error: "测试错误" })
      useAuthStore.getState().clearError()
      expect(useAuthStore.getState().error).toBeNull()
    })
  })
})
