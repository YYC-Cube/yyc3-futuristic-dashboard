import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染输入框', () => {
      render(<Input placeholder="请输入..." />)
      const input = screen.getByPlaceholderText(/请输入.../)
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('flex', 'h-10', 'w-full')
    })

    it('应该支持默认值', () => {
      render(<Input defaultValue="初始值" />)
      expect(screen.getByDisplayValue('初始值')).toBeInTheDocument()
    })

    it('应该支持受控模式', () => {
      const handleChange = vi.fn()
      render(<Input value="受控值" onChange={handleChange} />)
      expect(screen.getByDisplayValue('受控值')).toBeInTheDocument()
    })
  })

  describe('类型支持', () => {
    it('应该渲染文本类型', () => {
      render(<Input type="text" />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('应该渲染密码类型', () => {
      render(<Input type="password" placeholder="密码" />)
      const input = screen.getByPlaceholderText(/密码/)
      expect(input).toHaveAttribute('type', 'password')
    })

    it('应该渲染邮箱类型', () => {
      render(<Input type="email" placeholder="邮箱" />)
      const input = screen.getByPlaceholderText(/邮箱/)
      expect(input).toHaveAttribute('type', 'email')
    })

    it('应该渲染数字类型', () => {
      render(<Input type="number" placeholder="数字" />)
      const input = screen.getByPlaceholderText(/数字/)
      expect(input).toHaveAttribute('type', 'number')
    })

    it('应该渲染搜索类型', () => {
      render(<Input type="search" placeholder="搜索" />)
      const input = screen.getByPlaceholderText(/搜索/)
      expect(input).toHaveAttribute('type', 'search')
    })
  })

  describe('交互行为', () => {
    it('应该在输入时触发onChange事件', () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} />)

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'test value' },
      })

      expect(handleChange).toHaveBeenCalled()
    })

    it('应该支持获取焦点', () => {
      const handleFocus = vi.fn()
      render(<Input onFocus={handleFocus} />)

      fireEvent.focus(screen.getByRole('textbox'))
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('应该支持失去焦点', () => {
      const handleBlur = vi.fn()
      render(<Input onBlur={handleBlur} />)

      fireEvent.blur(screen.getByRole('textbox'))
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('应该支持键盘事件', () => {
      const handleKeyDown = vi.fn()
      render(<Input onKeyDown={handleKeyDown} />)

      fireEvent.keyDown(screen.getByRole('textbox'), {
        key: 'Enter',
        code: 'Enter',
      })

      expect(handleKeyDown).toHaveBeenCalled()
    })
  })

  describe('状态控制', () => {
    it('应该支持禁用状态', () => {
      render(<Input disabled placeholder="禁用" />)
      expect(screen.getByPlaceholderText(/禁用/)).toBeDisabled()
    })

    it('应该支持只读状态', () => {
      render(<Input readOnly value="只读" />)
      expect(screen.getByDisplayValue('只读')).toHaveAttribute('readonly')
    })

    it('应该支持必填属性', () => {
      render(<Input required placeholder="必填" />)
      expect(screen.getByPlaceholderText(/必填/)).toBeRequired()
    })
  })

  describe('可访问性', () => {
    it('应该有正确的label关联', () => {
      render(
        <div>
          <label htmlFor="username">用户名</label>
          <Input id="username" />
        </div>
      )

      expect(screen.getByLabelText(/用户名/)).toBeInTheDocument()
    })

    it('应该支持aria-label', () => {
      render(<Input aria-label="搜索框" />)
      expect(screen.getByLabelText(/搜索框/)).toBeInTheDocument()
    })

    it('应该支持错误状态的aria描述', () => {
      render(
        <div>
          <Input aria-describedby="error-msg" aria-invalid="true" />
          <span id="error-msg">用户名不能为空</span>
        </div>
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby', 'error-msg')
    })
  })

  describe('样式和类名', () => {
    it('应该支持自定义className', () => {
      const { container } = render(
        <Input className="custom-input-class" data-testid="custom-input" />
      )
      const input = screen.getByTestId('custom-input')
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('custom-input-class')
    })

    it('应该支持文件上传类型', () => {
      const { container } = render(<Input type="file" data-testid="file-input" />)
      const fileInput = screen.getByTestId('file-input')
      expect(fileInput).toBeInTheDocument()
      expect(fileInput).toHaveAttribute('type', 'file')
    })
  })
})
