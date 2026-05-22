import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface User {
  id: string
  name: string
  role: "admin" | "manager" | "staff"
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loadFromStorage: () => void
  clearError: () => void
}

const TOKEN_KEY = "yyc3_auth_token"
const USER_KEY = "yyc3_auth_user"

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const { apiClient } = await import("../api/client")
          const response = await apiClient.login(username, password)
          if (response.code === 200 && response.data) {
            const { token, user } = response.data as { token: string; user: User }
            try {
              localStorage.setItem(TOKEN_KEY, token)
              localStorage.setItem(USER_KEY, JSON.stringify(user))
            } catch {}
            set({ user, token, isAuthenticated: true, loading: false })
            return true
          }
          set({ error: response.message || "登录失败", loading: false })
          return false
        } catch {
          set({ error: "网络错误，请重试", loading: false })
          return false
        }
      },

      logout: () => {
        try {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        } catch {}
        set({ user: null, token: null, isAuthenticated: false })
      },

      loadFromStorage: () => {
        try {
          const token = localStorage.getItem(TOKEN_KEY)
          const userJson = localStorage.getItem(USER_KEY)
          if (token && userJson) {
            const user = JSON.parse(userJson) as User
            set({ user, token, isAuthenticated: true })
          }
        } catch {
          set({ user: null, token: null, isAuthenticated: false })
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: "AuthStore" }
  )
)
