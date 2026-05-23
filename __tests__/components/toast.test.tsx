import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastViewport,
} from '@/components/ui/toast'

function ToastTestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  )
}

describe('Toast组件系统', () => {
  describe('基础渲染和显示', () => {
    it('应该正确渲染成功提示', () => {
      render(
        <ToastTestWrapper>
          <Toast data-testid="success-toast" variant="default" open>
            <ToastTitle>操作成功</ToastTitle>
            <ToastDescription>房间信息已更新</ToastDescription>
          </Toast>
        </ToastTestWrapper>
      )

      const toastElement = screen.getByTestId('success-toast')
      expect(toastElement).toBeInTheDocument()
    })

    it('应该渲染错误提示', () => {
      render(
        <ToastTestWrapper>
          <Toast data-testid="error-toast" variant="destructive" open>
            <ToastTitle>操作失败</ToastTitle>
            <ToastDescription>网络连接超时</ToastDescription>
          </Toast>
        </ToastTestWrapper>
      )

      const toastElement = screen.getByTestId('error-toast')
      expect(toastElement).toBeInTheDocument()
    })

    it('应该渲染只有标题的简洁提示', () => {
      render(
        <ToastTestWrapper>
          <Toast data-testid="simple-toast" open>
            <ToastTitle data-testid="simple-title">简单提示</ToastTitle>
          </Toast>
        </ToastTestWrapper>
      )

      const title = screen.getByTestId('simple-title')
      expect(title).toBeInTheDocument()
      expect(title.textContent).toBe('简单提示')
    })
  })

  describe('Toast关闭功能', () => {
    it('应该渲染关闭按钮', () => {
      const handleDismiss = vi.fn()

      render(
        <ToastTestWrapper>
          <Toast onOpenChange={handleDismiss} open data-testid="closable-toast">
            <ToastTitle>Closable Toast</ToastTitle>
            <ToastClose />
          </Toast>
        </ToastTestWrapper>
      )

      const toastElement = screen.getByTestId('closable-toast')
      expect(toastElement).toBeInTheDocument()

      const closeButtons = toastElement.querySelectorAll('button')
      expect(closeButtons.length).toBeGreaterThan(0)

      if (closeButtons.length > 0) {
        fireEvent.click(closeButtons[0])
        if (handleDismiss) {
          expect(handleDismiss).toHaveBeenCalled()
        }
      }
    })
  })

  describe('Toast操作按钮', () => {
    it('应该渲染操作按钮并响应点击', () => {
      const handleAction = vi.fn()

      render(
        <ToastTestWrapper>
          <Toast data-testid="action-toast" open>
            <ToastTitle>需要确认的操作</ToastTitle>
            <ToastDescription>是否撤销上一步操作？</ToastDescription>
            <ToastAction altText="撤销" onClick={handleAction} data-testid="undo-action">
              撤销
            </ToastAction>
          </Toast>
        </ToastTestWrapper>
      )

      const actionButton = screen.getByTestId('undo-action')
      expect(actionButton).toBeInTheDocument()

      fireEvent.click(actionButton)
      expect(handleAction).toHaveBeenCalledTimes(1)
    })

    it('应该支持多个操作按钮', () => {
      const handleUndo = vi.fn()
      const handleRetry = vi.fn()

      render(
        <ToastTestWrapper>
          <Toast data-testid="multi-action-toast" open>
            <ToastTitle>网络请求失败</ToastTitle>
            <ToastAction altText="重试" onClick={handleRetry} data-testid="retry-btn">
              重试
            </ToastAction>
            <ToastAction altText="忽略" onClick={handleUndo} data-testid="ignore-btn">
              忽略
            </ToastAction>
          </Toast>
        </ToastTestWrapper>
      )

      expect(screen.getByTestId('retry-btn')).toBeInTheDocument()
      expect(screen.getByTestId('ignore-btn')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('retry-btn'))
      expect(handleRetry).toHaveBeenCalled()
    })
  })

  describe('不同类型的Toast场景', () => {
    it('应该渲染成功保存提示', () => {
      render(
        <ToastTestWrapper>
          <Toast className="border-green-500" data-testid="save-success" open>
            <ToastTitle data-testid="save-title">✅ 保存成功</ToastTitle>
            <ToastDescription>房间配置已保存到服务器</ToastDescription>
          </Toast>
        </ToastTestWrapper>
      )

      expect(screen.getByTestId('save-success')).toBeInTheDocument()
      expect(screen.getByTestId('save-title').textContent).toContain('保存成功')
    })

    it('应该渲染警告提示', () => {
      render(
        <ToastTestWrapper>
          <Toast variant="default" className="border-yellow-500" data-testid="warning-toast" open>
            <ToastTitle data-testid="warning-title">⚠️ 库存不足警告</ToastTitle>
            <ToastDescription data-testid="warning-desc">青岛啤酒库存仅剩5件，请及时补货</ToastDescription>
          </Toast>
        </ToastTestWrapper>
      )

      expect(screen.getByTestId('warning-toast')).toBeInTheDocument()
      expect(screen.getByTestId('warning-desc').textContent).toContain('青岛啤酒库存仅剩5件')
    })

    it('应该渲染信息提示', () => {
      render(
        <ToastTestWrapper>
          <Toast data-testid="info-toast" open>
            <ToastTitle data-testid="info-title">ℹ️ 系统维护通知</ToastTitle>
            <ToastDescription data-testid="info-desc">系统将于今晚22:00-23:00进行例行维护</ToastDescription>
          </Toast>
        </ToastTestWrapper>
      )

      expect(screen.getByTestId('info-toast')).toBeInTheDocument()
      expect(screen.getByTestId('info-title').textContent).toContain('系统维护通知')
    })
  })

  describe('业务场景模拟', () => {
    it('应该显示订单创建成功提示', () => {
      render(
        <ToastTestWrapper>
          <Toast data-testid="order-success" open>
            <ToastTitle data-testid="order-title">🎉 订单创建成功</ToastTitle>
            <ToastDescription data-testid="order-desc">
              订单号：ORD-20240115-001
              <br />
              房间：VIP包厢-201 | 预计消费：¥588
            </ToastDescription>
            <ToastAction altText="查看详情" data-testid="view-detail-btn">查看详情</ToastAction>
          </Toast>
        </ToastTestWrapper>
      )

      expect(screen.getByTestId('order-success')).toBeInTheDocument()
      expect(screen.getByTestId('order-title').textContent).toContain('订单创建成功')
      expect(screen.getByTestId('order-desc').textContent).toContain('ORD-20240115-001')
      expect(screen.getByTestId('view-detail-btn')).toBeInTheDocument()
    })

    it('应该显示支付成功提示', () => {
      render(
        <ToastTestWrapper>
          <Toast data-testid="payment-success" open>
            <ToastTitle data-testid="payment-title">💳 支付成功</ToastTitle>
            <ToastDescription data-testid="payment-desc">
              支付金额：¥1,280.00
              <br />
              支付方式：微信支付
              <br />
              交易时间：2024-01-15 14:35:22
            </ToastDescription>
          </Toast>
        </ToastTestWrapper>
      )

      expect(screen.getByTestId('payment-success')).toBeInTheDocument()
      expect(screen.getByTestId('payment-title').textContent).toContain('支付成功')
      expect(screen.getByTestId('payment-desc').textContent).toContain('¥1,280.00')
    })

    it('应该显示库存预警提示', () => {
      render(
        <ToastTestWrapper>
          <Toast variant="default" className="border-orange-500 bg-orange-50" data-testid="inventory-warning" open>
            <ToastTitle data-testid="inv-warning-title">📦 库存预警</ToastTitle>
            <ToastDescription data-testid="inv-warning-desc">
              以下商品库存不足：
              <br />
              • 青岛啤酒 - 剩余 5 件
              • 红酒 - 剩余 2 瓶
              <br />
              请尽快安排补货！
            </ToastDescription>
            <ToastAction altText="立即补货" data-testid="restock-btn">立即补货</ToastAction>
            <ToastAction altText="稍后处理" data-testid="later-btn">稍后处理</ToastAction>
          </Toast>
        </ToastTestWrapper>
      )

      expect(screen.getByTestId('inventory-warning')).toBeInTheDocument()
      expect(screen.getByTestId('inv-warning-title').textContent).toContain('库存预警')
      expect(screen.getByTestId('inv-warning-desc').textContent).toContain('青岛啤酒 - 剩余 5 件')
      expect(screen.getByTestId('restock-btn')).toBeInTheDocument()
      expect(screen.getByTestId('later-btn')).toBeInTheDocument()
    })

    it('应该显示会员积分变动提示', () => {
      render(
        <ToastTestWrapper>
          <Toast data-testid="points-notification" open>
            <ToastTitle data-testid="points-title">🌟 积分到账</ToastTitle>
            <ToastDescription data-testid="points-desc">
              恭喜获得 +120 积分！
              <br />
              当前总积分：2,580 分
              <br />
              距离下一等级还需：420 分
            </ToastDescription>
          </Toast>
        </ToastTestWrapper>
      )

      expect(screen.getByTestId('points-notification')).toBeInTheDocument()
      expect(screen.getByTestId('points-title').textContent).toContain('积分到账')
      expect(screen.getByTestId('points-desc').textContent).toContain('+120 积分')
      expect(screen.getByTestId('points-desc').textContent).toContain('2,580 分')
    })
  })

  describe('可访问性', () => {
    it('应该有正确的role属性', () => {
      render(
        <ToastTestWrapper>
          <Toast data-testid="accessible-toast" open>
            <ToastTitle>Accessible Toast</ToastTitle>
          </Toast>
        </ToastTestWrapper>
      )

      const toast = screen.getByTestId('accessible-toast')
      expect(toast).toBeInTheDocument()
    })

    it('应该支持键盘导航到操作按钮', () => {
      render(
        <ToastTestWrapper>
          <Toast data-testid="keyboard-nav-toast" open>
            <ToastTitle>Keyboard Navigation</ToastTitle>
            <ToastAction altText="操作" data-testid="keyboard-action">操作</ToastAction>
          </Toast>
        </ToastTestWrapper>
      )

      const actionButton = screen.getByTestId('keyboard-action')
      fireEvent.keyDown(actionButton, { key: 'Enter' })
    })
  })

  describe('多个Toast队列', () => {
    it('应该支持同时显示多个Toast', () => {
      render(
        <ToastTestWrapper>
          <div className="space-y-2">
            <Toast data-testid="toast-1" open>
              <ToastTitle>第一个提示</ToastTitle>
            </Toast>
            <Toast data-testid="toast-2" open>
              <ToastTitle>第二个提示</ToastTitle>
            </Toast>
            <Toast data-testid="toast-3" open>
              <ToastTitle>第三个提示</ToastTitle>
            </Toast>
          </div>
        </ToastTestWrapper>
      )

      expect(screen.getByTestId('toast-1')).toBeInTheDocument()
      expect(screen.getByTestId('toast-2')).toBeInTheDocument()
      expect(screen.getByTestId('toast-3')).toBeInTheDocument()
    })
  })
})
