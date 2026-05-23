import { describe, it, expect, beforeEach } from 'vitest'
import { authService } from '@/lib/services/auth.service'

describe('authService', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('login', () => {
    it('应该成功登录并返回token和用户信息', async () => {
      const result = await authService.login('admin', 'password123')

      expect(result).toBeDefined()
      expect(result).not.toBeNull()

      if (result) {
        expect(result.token).toContain('mock-jwt-token')
        expect(result.user).toBeDefined()
        expect(result.user.id).toBe('emp-001')
        expect(result.user.name).toBe('系统管理员')
      }
    })

    it('应该在登录后保存token到localStorage', async () => {
      await authService.login('admin', 'password123')

      const token = localStorage.getItem('yyc3_auth_token')
      expect(token).toBeTruthy()
      expect(token).toContain('mock-jwt-token')
    })

    it('应该返回包含用户角色的信息', async () => {
      const result = await authService.login('admin', 'password123')

      expect(result).toBeDefined()
      if (result && result.user) {
        expect(result.user.role).toBe('admin')
      }
    })

    it('应该支持经理角色登录', async () => {
      const result = await authService.login('yyc3_manager', 'YYC3@Manager2026')

      expect(result).toBeDefined()
      if (result && result.user) {
        expect(result.user.id).toBe('emp-002')
        expect(result.user.name).toBe('王经理')
        expect(result.user.role).toBe('manager')
      }
    })

    it('应该支持员工角色登录', async () => {
      const result = await authService.login('yyc3_staff', 'YYC3@Staff2026')

      expect(result).toBeDefined()
      if (result && result.user) {
        expect(result.user.id).toBe('emp-003')
        expect(result.user.name).toBe('小李')
        expect(result.user.role).toBe('staff')
      }
    })
  })

  describe('logout', () => {
    it('应该成功登出并清除token', async () => {
      await authService.login('admin', 'password123')

      expect(localStorage.getItem('yyc3_auth_token')).toBeTruthy()

      await authService.logout()

      const token = localStorage.getItem('yyc3_auth_token')
      expect(token).toBeFalsy()
    })
  })

  describe('getStoredAuth', () => {
    it('应该在没有认证信息时返回null', () => {
      const auth = authService.getStoredAuth()

      expect(auth.token).toBeNull()
      expect(auth.user).toBeNull()
    })

    it('应该返回存储的认证信息', () => {
      const mockToken = 'test-token-123'
      const mockUser = JSON.stringify({
        id: 'user-001',
        name: '测试用户',
        role: 'admin',
      })

      localStorage.setItem('yyc3_auth_token', mockToken)
      localStorage.setItem('yyc3_auth_user', mockUser)

      const auth = authService.getStoredAuth()

      expect(auth.token).toBe(mockToken)
      expect(auth.user).not.toBeNull()
      if (auth.user) {
        expect(auth.user.id).toBe('user-001')
        expect(auth.user.name).toBe('测试用户')
      }
    })

    it('应该处理损坏的用户数据（JSON解析错误）', () => {
      localStorage.setItem('yyc3_auth_token', 'valid-token')
      localStorage.setItem('yyc3_auth_user', 'invalid-json{')

      const auth = authService.getStoredAuth()

      expect(auth).toBeDefined()
      expect(auth).not.toBeNull()

      if (auth) {
        expect([auth.token, auth.user]).toContainEqual(null)
      }
    })

    it('应该处理只有token没有用户的情况', () => {
      localStorage.setItem('yyc3_auth_token', 'only-token')

      const auth = authService.getStoredAuth()

      expect(auth).toBeDefined()
      if (auth) {
        expect(auth.token).toBe('only-token')
        expect(auth.user).toBeNull()
      }
    })
  })

  describe('完整认证流程', () => {
    it('应该支持完整的登录-获取-登出流程', async () => {
      const initialAuth = authService.getStoredAuth()
      expect(initialAuth.token).toBeNull()

      await authService.login('admin', 'password123')

      const loggedInAuth = authService.getStoredAuth()
      expect(loggedInAuth.token).toBeTruthy()
      expect(loggedInAuth.token).toContain('mock-jwt-token')

      await authService.logout()

      const loggedOutAuth = authService.getStoredAuth()
      expect(loggedOutAuth.token).toBeNull()
      expect(loggedOutAuth.user).toBeNull()
    })
  })
})
