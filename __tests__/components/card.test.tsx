import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

describe('Card组件系统', () => {
  describe('Card基础容器', () => {
    it('应该正确渲染Card容器', () => {
      const { container } = render(
        <Card data-testid="card-container">
          <span>Card Content</span>
        </Card>
      )

      expect(screen.getByTestId('card-container')).toBeInTheDocument()
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    it('应该支持自定义className', () => {
      const { container } = render(
        <Card className="custom-card-class">Content</Card>
      )

      const card = container.querySelector('.custom-card-class')
      expect(card).toBeInTheDocument()
    })

    it('应该支持点击事件', () => {
      const handleClick = vi.fn()

      render(<Card onClick={handleClick}>Clickable Card</Card>)

      fireEvent.click(screen.getByText('Clickable Card'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('CardHeader', () => {
    it('应该正确渲染头部区域', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Body</CardContent>
        </Card>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Body')).toBeInTheDocument()
    })

    it('应该支持多个子元素', () => {
      render(
        <Card>
          <CardHeader>
            <div>Element 1</div>
            <div>Element 2</div>
            <div>Element 3</div>
          </CardHeader>
        </Card>
      )

      expect(screen.getByText('Element 1')).toBeInTheDocument()
      expect(screen.getByText('Element 2')).toBeInTheDocument()
      expect(screen.getByText('Element 3')).toBeInTheDocument()
    })

    it('应该支持自定义样式类', () => {
      const { container } = render(
        <Card>
          <CardHeader className="header-custom">Header</CardHeader>
        </Card>
      )

      const header = container.querySelector('.header-custom')
      expect(header).toBeInTheDocument()
    })
  })

  describe('CardTitle', () => {
    it('应该正确渲染标题文本', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>房间管理概览</CardTitle>
          </CardHeader>
        </Card>
      )

      const title = screen.getByText(/房间管理概览/i)
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('text-2xl', 'font-semibold')
    })

    it('应该支持多行标题', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle data-testid="multiline-title">
              第一行标题
              <br />
              第二行副标题
            </CardTitle>
          </CardHeader>
        </Card>
      )

      const titleElement = screen.getByTestId('multiline-title')
      expect(titleElement).toBeInTheDocument()
      expect(titleElement.textContent).toContain('第一行标题')
      expect(titleElement.textContent).toContain('第二行副标题')
    })

    it('应该支持自定义样式类', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle className="custom-title-class" data-testid="custom-title">
              Custom Title
            </CardTitle>
          </CardHeader>
        </Card>
      )

      const title = screen.getByTestId('custom-title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('custom-title-class')
    })
  })

  describe('CardDescription', () => {
    it('应该正确渲染描述文本', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>这是卡片的详细描述信息</CardDescription>
          </CardHeader>
        </Card>
      )

      expect(screen.getByText('这是卡片的详细描述信息')).toBeInTheDocument()
    })

    it('应该有正确的样式类', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardDescription data-testid="desc-element">Semantic Description</CardDescription>
          </CardHeader>
        </Card>
      )

      const description = screen.getByTestId('desc-element')
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('应该正确渲染内容区域', () => {
      render(
        <Card>
          <CardContent>
            <p>主要内容区域</p>
            <ul>
              <li>列表项1</li>
              <li>列表项2</li>
            </ul>
          </CardContent>
        </Card>
      )

      expect(screen.getByText('主要内容区域')).toBeInTheDocument()
      expect(screen.getByText('列表项1')).toBeInTheDocument()
      expect(screen.getByText('列表项2')).toBeInTheDocument()
    })

    it('应该支持复杂嵌套结构', () => {
      render(
        <Card>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>Column 1</div>
              <div>Column 2</div>
            </div>
            <button>Action Button</button>
          </CardContent>
        </Card>
      )

      expect(screen.getByText('Column 1')).toBeInTheDocument()
      expect(screen.getByText('Column 2')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Action Button/ })).toBeInTheDocument()
    })
  })

  describe('CardFooter', () => {
    it('应该正确渲染底部操作区', () => {
      render(
        <Card>
          <CardContent>Main Content</CardContent>
          <CardFooter>
            <button>取消</button>
            <button>确认</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByRole('button', { name: /取消/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /确认/ })).toBeInTheDocument()
    })

    it('应该支持flex布局对齐', () => {
      const { container } = render(
        <Card>
          <CardFooter className="justify-between">
            <span>Left Action</span>
            <span>Right Action</span>
          </CardFooter>
        </Card>
      )

      const footer = container.querySelector('.justify-between')
      expect(footer).toBeInTheDocument()
    })
  })

  describe('完整卡片组合场景', () => {
    it('应该渲染完整的统计卡片', () => {
      render(
        <Card data-testid="stats-card">
          <CardHeader>
            <CardTitle>今日营收</CardTitle>
            <CardDescription>截至当前时间</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="revenue-value">
              ¥12,580
            </div>
            <p className="text-sm text-green-600">+12.5% 较昨日</p>
          </CardContent>
          <CardFooter>
            <button>查看详情</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByTestId('stats-card')).toBeInTheDocument()
      expect(screen.getByText('今日营收')).toBeInTheDocument()
      expect(screen.getByTestId('revenue-value')).toHaveTextContent('¥12,580')
      expect(screen.getByText('+12.5% 较昨日')).toBeInTheDocument()
    })

    it('应该渲染表单卡片', () => {
      const handleSubmit = vi.fn((e) => e.preventDefault())

      render(
        <Card>
          <CardHeader>
            <CardTitle>添加新房间</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <input placeholder="房间号" data-testid="room-number" />
              <select data-testid="room-type">
                <option value="standard">标准间</option>
                <option value="vip">VIP包厢</option>
              </select>
              <button type="submit" data-testid="submit-btn">提交</button>
            </form>
          </CardContent>
        </Card>
      )

      fireEvent.change(screen.getByTestId('room-number'), {
        target: { value: '301' },
      })
      fireEvent.submit(screen.getByTestId('submit-btn'))

      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    it('应该渲染列表卡片', () => {
      const items = [
        { id: 1, name: '青岛啤酒', price: 12 },
        { id: 2, name: '果盘', price: 58 },
        { id: 3, name: '红酒', price: 288 },
      ]

      render(
        <Card>
          <CardHeader>
            <CardTitle>热销商品</CardTitle>
          </CardHeader>
          <CardContent>
            <ul data-testid="product-list">
              {items.map((item) => (
                <li key={item.id} data-testid={`product-${item.id}`}>
                  {item.name} - ¥{item.price}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )

      items.forEach((item) => {
        expect(screen.getByTestId(`product-${item.id}`)).toBeInTheDocument()
        expect(screen.getByText(`${item.name} - ¥${item.price}`)).toBeInTheDocument()
      })
    })
  })

  describe('可访问性', () => {
    it('应该支持aria-label', () => {
      render(
        <Card aria-label="统计概览卡片">
          <CardContent>Stats Content</CardContent>
        </Card>
      )

      expect(screen.getByLabelText(/统计概览卡片/i)).toBeInTheDocument()
    })

    it('应该支持role属性', () => {
      render(
        <Card role="article">
          <CardContent>Article Content</CardContent>
        </Card>
      )

      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('应该支持键盘导航到可交互元素', () => {
      render(
        <Card>
          <CardFooter>
            <button tabIndex={0}>Focusable Button</button>
          </CardFooter>
        </Card>
      )

      const button = screen.getByRole('button')

      button.focus()
      expect(button).toHaveFocus()
    })
  })

  describe('响应式和布局', () => {
    it('应该支持网格布局中的多个卡片', () => {
      render(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="card-grid">
          {[1, 2, 3].map((i) => (
            <Card key={i} data-testid={`card-${i}`}>
              <CardHeader>
                <CardTitle>Card {i}</CardTitle>
              </CardHeader>
              <CardContent>Content {i}</CardContent>
            </Card>
          ))}
        </div>
      )

      expect(screen.getByTestId('card-grid')).toBeInTheDocument()
      for (let i = 1; i <= 3; i++) {
        expect(screen.getByTestId(`card-${i}`)).toBeInTheDocument()
        expect(screen.getByText(`Card ${i}`)).toBeInTheDocument()
      }
    })
  })
})
