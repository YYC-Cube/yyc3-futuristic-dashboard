import { apiClient } from "../api/client"
import type { User } from "../stores/useAuthStore"

export interface LoginResponse {
  token: string
  user: User
}

export const authService = {
  async login(username: string, password: string) {
    const response = await apiClient.login(username, password)
    if (response.code === 200) return response.data as LoginResponse
    throw new Error(response.message)
  },

  async logout() {
    await apiClient.logout()
  },

  getStoredAuth(): { token: string | null; user: User | null } {
    if (typeof window === "undefined") return { token: null, user: null }
    try {
      const token = localStorage.getItem("yyc3_auth_token")
      const userJson = localStorage.getItem("yyc3_auth_user")
      const user = userJson ? (JSON.parse(userJson) as User) : null
      return { token, user }
    } catch {
      return { token: null, user: null }
    }
  },
}
