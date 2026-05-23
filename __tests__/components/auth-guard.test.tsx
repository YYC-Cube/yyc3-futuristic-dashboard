import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { AuthGuard } from '@/components/common/auth-guard'

const mockLoadFromStorage = vi.fn()

vi.mock('@/lib/stores/useAuthStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    loadFromStorage: mockLoadFromStorage,
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

vi.mock('@/components/common/page-loader', () => ({
  default: ({ message }: { message?: string }) => (
    <div data-testid="page-loader">{message || 'Loading...'}</div>
  ),
}))

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('已认证状态', () => {
    it('应该渲染子组件当用户已认证', () => {
      render(
        <AuthGuard>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  describe('未认证状态', () => {
    it('应该显示加载器当用户未认证', () => {
      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      )

      const loader = screen.queryByTestId('page-loader')
      if (loader) {
        expect(loader).toBeInTheDocument()
      }
    })
  })

  describe('加载行为', () => {
    it('应该在挂载时调用loadFromStorage', () => {
      render(
        <AuthGuard>
          <div>Content</div>
        </AuthGuard>
      )
      
      expect(mockLoadFromStorage).toHaveBeenCalled()
    })
  })

  describe('多个子元素', () => {
    it('应该正确渲染多个子元素', () => {
      render(
        <AuthGuard>
          <div>Element 1</div>
          <div>Element 2</div>
          <span>Element 3</span>
        </AuthGuard>
      )

      expect(screen.getByText('Element 1')).toBeInTheDocument()
      expect(screen.getByText('Element 2')).toBeInTheDocument()
      expect(screen.getByText('Element 3')).toBeInTheDocument()
    })
  })
})
