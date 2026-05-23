import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Button } from '@/components/ui/button'

describe('Button组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染按钮文本', () => {
      render(<Button>点击我</Button>)
      expect(screen.getByRole('button', { name: /点击我/ })).toBeInTheDocument()
    })

    it('应该支持自定义className', () => {
      const { container } = render(
        <Button className="custom-class">Custom</Button>
      )
      const button = container.querySelector('.custom-class')
      expect(button).toBeInTheDocument()
    })
  })

  describe('变体支持', () => {
    it('应该渲染默认变体', () => {
      const { container } = render(<Button>Default</Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
    })

    it('应该渲染destructive变体', () => {
      const { container } = render(<Button variant="destructive">Delete</Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    it('应该渲染outline变体', () => {
      const { container } = render(<Button variant="outline">Outline</Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    it('应该渲染secondary变体', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    it('应该渲染ghost变体', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    it('应该渲染link变体', () => {
      const { container } = render(<Button variant="link">Link</Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('尺寸支持', () => {
    it('应该渲染默认尺寸', () => {
      const { container } = render(<Button size="default">Default Size</Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    it('应该渲染sm尺寸', () => {
      const { container } = render(<Button size="sm">Small</Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    it('应该渲染lg尺寸', () => {
      const { container } = render(<Button size="lg">Large</Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    it('应该渲染icon尺寸', () => {
      const { container } = render(<Button size="icon"><span>🔍</span></Button>)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('交互行为', () => {
    it('应该在点击时触发onClick事件', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click Me</Button>)

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('应该在禁用状态时不响应点击', () => {
      const handleClick = vi.fn()
      render(<Button disabled onClick={handleClick}>Disabled</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()

      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('应该支持多次点击', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Multi Click</Button>)

      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('可访问性', () => {
    it('应该有正确的role属性', () => {
      render(<Button>Accessible Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('应该支持aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>)
      expect(screen.getByLabelText(/Close dialog/)).toBeInTheDocument()
    })

    it('应该支持disabled状态的可访问性', () => {
      render(<Button disabled>Disabled Button</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('子元素支持', () => {
    it('应该支持图标和文本混合', () => {
      render(
        <Button>
          <span data-testid="icon">🚀</span>
          <span>Launch</span>
        </Button>
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('Launch')).toBeInTheDocument()
    })

    it('应该支持纯图标按钮', () => {
      render(
        <Button size="icon" aria-label="Settings">
          ⚙️
        </Button>
      )

      expect(screen.getByLabelText(/Settings/)).toBeInTheDocument()
    })
  })
})
