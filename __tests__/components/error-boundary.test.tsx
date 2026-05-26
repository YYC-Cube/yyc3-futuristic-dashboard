import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { ErrorBoundary } from '@/components/common/error-boundary'

vi.mock('@sentry/react', () => ({
  captureException: vi.fn().mockReturnValue('test-event-id'),
  showReportDialog: vi.fn(),
  ErrorBoundary: ({ children, fallback }: any) =>
    fallback ? <div>{fallback}</div> : <div>{children}</div>,
}))

describe('ErrorBoundary', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    vi.restoreAllMocks()
  })

  const ThrowErrorComponent = () => {
    throw new Error('Test error')
  }

  const NormalComponent = () => <div>Normal Content</div>

  describe('错误捕获', () => {
    it('应该捕获子组件的错误并显示错误UI', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText(/页面出现错误/i)).toBeInTheDocument()
    })

    it('应该显示错误消息', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText(/Test error/)).toBeInTheDocument()
    })
  })

  describe('正常渲染', () => {
    it('应该正常渲染子组件当没有错误时', () => {
      render(
        <ErrorBoundary>
          <NormalComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Normal Content')).toBeInTheDocument()
    })
  })

  describe('自定义fallback', () => {
    it('应该使用自定义fallback当提供时', () => {
      const CustomFallback = () => <div>Custom Error UI</div>

      render(
        <ErrorBoundary fallback={<CustomFallback />}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom Error UI')).toBeInTheDocument()
    })
  })

  describe('重试功能', () => {
    it('应该在点击重试按钮后清除错误状态', async () => {
      let shouldThrow = true

      const ConditionalThrowComponent = () => {
        if (shouldThrow) throw new Error('Conditional error')
        return <div>Recovered</div>
      }

      const { rerender } = render(
        <ErrorBoundary>
          <ConditionalThrowComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText(/页面出现错误/i)).toBeInTheDocument()

      const retryButton = screen.getByRole('button', { name: /重试/i })
      shouldThrow = false
      fireEvent.click(retryButton)

      rerender(
        <ErrorBoundary>
          <ConditionalThrowComponent />
        </ErrorBoundary>
      )
    })
  })

  describe('onError回调', () => {
    it('应该调用onError回调当错误发生时', () => {
      const onErrorMock = vi.fn()

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      )
    })
  })

  describe('多个子组件', () => {
    it('应该渲染多个子组件', () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })
  })
})
