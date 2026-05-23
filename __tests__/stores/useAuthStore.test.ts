import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/lib/stores/useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    })
  })

  describe('初始状态', () => {
    it('应该有正确的默认值', () => {
      const state = useAuthStore.getState()

      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('ghostModeLogin', () => {
    it('应该能够通过幽灵模式登录', () => {
      useAuthStore.getState().ghostModeLogin()

      const state = useAuthStore.getState()

      expect(state.user).not.toBeNull()
      expect(state.user?.id).toBe('ghost-dev-user')
      expect(state.user?.name).toBe('👻 幽灵开发者')
      expect(state.user?.role).toBe('admin')
      expect(state.token).toContain('ghost_token_')
      expect(state.isAuthenticated).toBe(true)
      expect(state.loading).toBe(false)
    })

    it('应该设置正确的用户角色', () => {
      useAuthStore.getState().ghostModeLogin()

      expect(useAuthStore.getState().isAdmin()).toBe(true)
      expect(useAuthStore.getState().hasRole('admin')).toBe(true)
      expect(useAuthStore.getState().hasRole('manager')).toBe(false)
      expect(useAuthStore.getState().hasRole('staff')).toBe(false)
    })
  })

  describe('logout', () => {
    it('应该清除所有认证状态', () => {
      useAuthStore.getState().ghostModeLogin()
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('clearError', () => {
    it('应该清除错误信息', () => {
      useAuthStore.setState({ error: '登录失败' })
      useAuthStore.getState().clearError()
      expect(useAuthStore.getState().error).toBeNull()
    })
  })

  describe('reset', () => {
    it('应该重置所有状态到初始值', () => {
      useAuthStore.setState({
        user: { id: '1', name: '测试', role: 'admin' },
        token: 'test-token',
        isAuthenticated: true,
        loading: true,
        error: '错误',
      })

      useAuthStore.getState().reset()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('安全访问器', () => {
    describe('getUserSafe', () => {
      it('应该返回当前用户', () => {
        useAuthStore.setState({ user: { id: '1', name: 'Test', role: 'admin' } as any })

        const user = useAuthStore.getState().getUserSafe()
        expect(user?.id).toBe('1')
        expect(user?.name).toBe('Test')
      })

      it('应该返回null当没有用户时', () => {
        useAuthStore.setState({ user: null })

        const user = useAuthStore.getState().getUserSafe()
        expect(user).toBeNull()
      })
    })

    describe('getTokenSafe', () => {
      it('应该返回当前token', () => {
        useAuthStore.setState({ token: 'test-token-123' })

        const token = useAuthStore.getState().getTokenSafe()
        expect(token).toBe('test-token-123')
      })

      it('应该返回null当没有token时', () => {
        useAuthStore.setState({ token: null })

        const token = useAuthStore.getState().getTokenSafe()
        expect(token).toBeNull()
      })
    })
  })

  describe('权限检查方法', () => {
    beforeEach(() => {
      useAuthStore.setState({
        user: { id: 'admin-001', name: '管理员', role: 'admin' },
        isAuthenticated: true,
      })
    })

    describe('isAdmin', () => {
      it('应该返回true对于admin用户', () => {
        expect(useAuthStore.getState().isAdmin()).toBe(true)
      })

      it('应该返回false对于非admin用户', () => {
        useAuthStore.setState({
          user: { id: 'staff-001', name: '员工', role: 'staff' } as any
        })

        expect(useAuthStore.getState().isAdmin()).toBe(false)
      })

      it('应该返回false当没有用户时', () => {
        useAuthStore.setState({ user: null, isAuthenticated: false })

        expect(useAuthStore.getState().isAdmin()).toBe(false)
      })
    })

    describe('hasRole', () => {
      it('应该正确检查admin角色', () => {
        expect(useAuthStore.getState().hasRole('admin')).toBe(true)
        expect(useAuthStore.getState().hasRole('manager')).toBe(false)
        expect(useAuthStore.getState().hasRole('staff')).toBe(false)
      })

      it('应该正确检查manager角色', () => {
        useAuthStore.setState({
          user: { id: 'mgr-001', name: '经理', role: 'manager' } as any
        })

        expect(useAuthStore.getState().hasRole('admin')).toBe(false)
        expect(useAuthStore.getState().hasRole('manager')).toBe(true)
        expect(useAuthStore.getState().hasRole('staff')).toBe(false)
      })

      it('应该正确检查staff角色', () => {
        useAuthStore.setState({
          user: { id: 'staff-001', name: '员工', role: 'staff' } as any
        })

        expect(useAuthStore.getState().hasRole('admin')).toBe(false)
        expect(useAuthStore.getState().hasRole('manager')).toBe(false)
        expect(useAuthStore.getState().hasRole('staff')).toBe(true)
      })

      it('应该返回false当没有用户时', () => {
        useAuthStore.setState({ user: null, isAuthenticated: false })

        expect(useAuthStore.getState().hasRole('admin')).toBe(false)
        expect(useAuthStore.getState().hasRole('manager')).toBe(false)
        expect(useAuthStore.getState().hasRole('staff')).toBe(false)
      })
    })
  })

  describe('状态更新', () => {
    it('应该能够手动设置user', () => {
      const newUser = { id: 'new-user', name: '新用户', role: 'manager' } as any
      useAuthStore.setState({ user: newUser, isAuthenticated: true })

      expect(useAuthStore.getState().user?.name).toBe('新用户')
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('应该能够设置loading状态', () => {
      useAuthStore.setState({ loading: true })
      expect(useAuthStore.getState().loading).toBe(true)

      useAuthStore.setState({ loading: false })
      expect(useAuthStore.getState().loading).toBe(false)
    })

    it('应该能够设置error状态', () => {
      useAuthStore.setState({ error: '网络超时' })
      expect(useAuthStore.getState().error).toBe('网络超时')

      useAuthStore.setState({ error: '服务器错误' })
      expect(useAuthStore.getState().error).toBe('服务器错误')

      useAuthStore.setState({ error: null })
      expect(useAuthStore.getState().error).toBeNull()
    })
  })

  describe('完整认证流程模拟（修复时序问题）', () => {
    it('应该支持幽灵模式登录→权限检查→登出流程', () => {
      useAuthStore.getState().ghostModeLogin()

      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().user?.role).toBe('admin')
      expect(useAuthStore.getState().isAdmin()).toBe(true)

      useAuthStore.getState().logout()

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().isAdmin()).toBe(false)
    })

    it('应该支持多次幽灵模式登录并生成有效token', () => {
      useAuthStore.getState().ghostModeLogin()

      const firstToken = useAuthStore.getState().token
      expect(firstToken).not.toBeNull()
      expect(firstToken).toContain('ghost_token_')

      useAuthStore.getState().logout()
      expect(useAuthStore.getState().token).toBeNull()

      useAuthStore.getState().ghostModeLogin()

      const secondToken = useAuthStore.getState().token
      expect(secondToken).not.toBeNull()
      expect(secondToken).toContain('ghost_token_')

      expect(typeof firstToken).toBe('string')
      expect(typeof secondToken).toBe('string')
      expect(firstToken!.length).toBeGreaterThan(0)
      expect(secondToken!.length).toBeGreaterThan(0)
    })

    it('应该在登录后保持状态一致性', () => {
      useAuthStore.getState().ghostModeLogin()

      const state1 = useAuthStore.getState()
      const state2 = useAuthStore.getState()

      expect(state1.isAuthenticated).toBe(state2.isAuthenticated)
      expect(state1.user?.id).toBe(state2.user?.id)
      expect(state1.token).toBe(state2.token)

      expect(state1.isAdmin()).toBe(state2.isAdmin())
      expect(state1.hasRole('admin')).toBe(state2.hasRole('admin'))
    })
  })
})
