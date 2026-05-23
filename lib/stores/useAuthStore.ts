import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface User {
  id: string
  name: string
  role: "admin" | "manager" | "staff"
  avatar?: string
}

interface AuthStoreState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

interface AuthStoreActions {
  login: (username: string, password: string) => Promise<boolean>
  ghostModeLogin: () => void
  logout: () => void
  loadFromStorage: () => void
  clearError: () => void
  reset: () => void

  getUserSafe: () => User | null
  getTokenSafe: () => string | null
  isAdmin: () => boolean
  hasRole: (role: User["role"]) => boolean
}

type AuthStore = AuthStoreState & AuthStoreActions

const TOKEN_KEY = "yyc3_auth_token"
const USER_KEY = "yyc3_auth_user"

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
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
            } catch (storageError) {
              console.warn("⚠️ [AuthStore] localStorage write failed:", storageError)
            }
            set({ user, token, isAuthenticated: true, loading: false })
            return true
          }
          set({ error: response.message || "登录失败", loading: false })
          return false
        } catch (err) {
          console.error("❌ [AuthStore] Login failed:", err)
          set({ error: "网络错误，请重试", loading: false })
          return false
        }
      },

      ghostModeLogin: () => {
        const ghostUser: User = {
          id: 'ghost-dev-user',
          name: '👻 幽灵开发者',
          role: 'admin',
          avatar: undefined,
        }

        const ghostToken = `ghost_token_${Date.now()}_dev_only`

        try {
          localStorage.setItem(TOKEN_KEY, ghostToken)
          localStorage.setItem(USER_KEY, JSON.stringify(ghostUser))
        } catch (storageError) {
          console.warn("⚠️ [AuthStore] Ghost mode localStorage write failed:", storageError)
        }

        set({
          user: ghostUser,
          token: ghostToken,
          isAuthenticated: true,
          error: null,
        })

        console.log('👻 Ghost Mode Login Successful!')
        console.log('📝 User:', ghostUser.name)
        console.log('🔑 Role:', ghostUser.role)
        console.log('⚠️  This is development mode only!')
      },

      logout: () => {
        try {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        } catch (storageError) {
          console.warn("⚠️ [AuthStore] localStorage remove failed:", storageError)
        }
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
        } catch (err) {
          console.error("❌ [AuthStore] loadFromStorage failed:", err)
          set({ user: null, token: null, isAuthenticated: false })
        }
      },

      clearError: () => set({ error: null }),

      reset: () => {
        try {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        } catch (storageError) {
          console.warn("⚠️ [AuthStore] Reset cleanup failed:", storageError)
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        })
      },

      getUserSafe: () => get().user ?? null,

      getTokenSafe: () => get().token ?? null,

      isAdmin: () => get().user?.role === "admin",

      hasRole: (role) => get().user?.role === role,
    }),
    { name: "AuthStore" }
  )
)

export type { AuthStoreState, AuthStoreActions }
