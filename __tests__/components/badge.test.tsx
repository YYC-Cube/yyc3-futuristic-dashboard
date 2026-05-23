import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Badge } from '@/components/ui/badge'

describe('Badge组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染文本', () => {
      render(<Badge>可用</Badge>)
      expect(screen.getByText('可用')).toBeInTheDocument()
    })

    it('应该支持自定义className', () => {
      const { container } = render(<Badge className="custom-badge">Custom</Badge>)
      const badge = container.querySelector('.custom-badge')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('变体支持', () => {
    it('应该渲染默认变体', () => {
      const { container } = render(<Badge>Default</Badge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('inline-flex', 'rounded-full')
    })

    it('应该渲染secondary变体', () => {
      render(<Badge variant="secondary">Secondary</Badge>)
      expect(screen.getByText('Secondary')).toBeInTheDocument()
    })

    it('应该渲染destructive变体', () => {
      render(<Badge variant="destructive">Destructive</Badge>)
      expect(screen.getByText('Destructive')).toBeInTheDocument()
    })

    it('应该渲染outline变体', () => {
      render(<Badge variant="outline">Outline</Badge>)
      expect(screen.getByText('Outline')).toBeInTheDocument()
    })
  })

  describe('业务场景应用', () => {
    it('应该显示房间状态标签', () => {
      const RoomStatusBadge = ({ status }: { status: string }) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
          available: 'default',
          occupied: 'secondary',
          maintenance: 'destructive',
          cleaning: 'outline',
        }

        return <Badge variant={variants[status] || 'default'}>{status}</Badge>
      }

      render(
        <div data-testid="room-statuses">
          <RoomStatusBadge status="available" />
          <RoomStatusBadge status="occupied" />
          <RoomStatusBadge status="maintenance" />
          <RoomStatusBadge status="cleaning" />
        </div>
      )

      expect(screen.getByText('available')).toBeInTheDocument()
      expect(screen.getByText('occupied')).toBeInTheDocument()
    })
  })
})
