import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'

function SimpleCounter() {
  const [count, setCount] = React.useState(0)

  return (
    <div data-testid="counter">
      <span data-testid="count">{count}</span>
      <button data-testid="increment-btn" onClick={() => setCount(count + 1)}>Increment</button>
      <button data-testid="decrement-btn" onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  )
}

function HeavyComponent({ itemCount = 1000 }: { itemCount?: number }) {
  const items = Array.from({ length: itemCount }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random() * 100,
  }))

  return (
    <div data-testid="heavy-component">
      {items.map((item) => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          {item.name}: {item.value.toFixed(2)}
        </div>
      ))}
    </div>
  )
}

describe('性能测试套件', () => {
  describe('组件渲染时间', () => {
    it('应该快速渲染简单组件', () => {
      const startTime = performance.now()

      const { container } = render(<SimpleCounter />)
      const endTime = performance.now()

      expect(container).toBeInTheDocument()
      expect(endTime - startTime).toBeLessThan(200)
    })

    it('应该高效渲染中等复杂度组件', () => {
      const startTime = performance.now()

      render(<HeavyComponent itemCount={500} />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(1000)
    })

    it('应该在合理时间内渲染大量数据', () => {
      const startTime = performance.now()

      render(<HeavyComponent itemCount={2000} />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(3000)
    })

    it('应该处理空数据渲染（边界情况）', () => {
      const startTime = performance.now()

      const { container } = render(<HeavyComponent itemCount={0} />)
      const endTime = performance.now()

      expect(container).toBeInTheDocument()
      expect(endTime - startTime).toBeLessThan(200)
      expect(container.querySelector('[data-testid="heavy-component"]')).toBeInTheDocument()
    })

    it('应该处理极大数量渲染（极端值）', () => {
      const startTime = performance.now()

      render(<HeavyComponent itemCount={5000} />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(5000)
    })
  })

  describe('组件更新性能', () => {
    it('应该支持单次点击更新', () => {
      const { getByTestId, getByText } = render(<SimpleCounter />)

      expect(getByTestId('count').textContent).toBe('0')

      fireEvent.click(getByText('Increment'))

      expect(getByTestId('count').textContent).toBe('1')
    })

    it('应该支持多次连续点击更新', () => {
      const { getByTestId, getByText } = render(<SimpleCounter />)

      for (let i = 0; i < 5; i++) {
        fireEvent.click(getByText('Increment'))
      }

      expect(getByTestId('count').textContent).toBe('5')
    })

    it('应该支持增减操作混合使用', () => {
      const { getByTestId, getByText } = render(<SimpleCounter />)

      fireEvent.click(getByText('Increment'))
      fireEvent.click(getByText('Increment'))
      fireEvent.click(getByText('Decrement'))

      expect(getByTestId('count').textContent).toBe('1')
    })

    it('应该处理边界情况：负数计数', () => {
      const { getByTestId, getByText } = render(<SimpleCounter />)

      fireEvent.click(getByText('Decrement'))
      fireEvent.click(getByText('Decrement'))
      fireEvent.click(getByText('Decrement'))

      expect(getByTestId('count').textContent).toBe('-3')
    })
  })

  describe('内存使用效率', () => {
    it('应该在渲染后正确清理DOM元素', () => {
      const { unmount, container } = render(<HeavyComponent itemCount={500} />)

      const elementCountBefore = container.querySelectorAll('*').length
      expect(elementCountBefore).toBeGreaterThan(500)

      unmount()

      const elementCountAfter = document.querySelectorAll('[data-testid="heavy-component"]').length
      expect(elementCountAfter).toBe(0)
    })

    it('应该处理空组件的卸载', () => {
      const { unmount, container, asFragment } = render(<HeavyComponent itemCount={0} />)

      expect(container).toBeInTheDocument()
      expect(asFragment()).toBeDefined()

      unmount()

      const heavyComponent = document.querySelector('[data-testid="heavy-component"]')
      expect(heavyComponent).toBeNull()
    })
  })

  describe('响应式性能', () => {
    it('应该支持条件渲染的高效切换', () => {
      function ConditionalComponent({ showHeavy }: { showHeavy: boolean }) {
        return (
          <div data-testid="conditional">
            {showHeavy ? <HeavyComponent itemCount={100} /> : <span>Light</span>}
          </div>
        )
      }

      const { rerender, getByTestId } = render(
        <ConditionalComponent showHeavy={false} />
      )

      expect(getByTestId('conditional').textContent).toContain('Light')

      const switchStartTime = performance.now()
      rerender(<ConditionalComponent showHeavy={true} />)
      const switchEndTime = performance.now()

      expect(switchEndTime - switchStartTime).toBeLessThan(500)
    })

    it('应该处理频繁的条件切换', () => {
      function ToggleComponent({ visible }: { visible: boolean }) {
        return visible ? <div data-testid="visible">Visible</div> : null
      }

      const { rerender, queryByTestId } = render(<ToggleComponent visible={false} />)

      expect(queryByTestId('visible')).toBeNull()

      for (let i = 0; i < 10; i++) {
        rerender(<ToggleComponent visible={i % 2 === 0} />)
      }

      expect(queryByTestId('visible')).toBeNull()
    })
  })

  describe('输入验证和边界情况', () => {
    it('应该处理undefined itemCount参数', () => {
      const { container } = render(<HeavyComponent />)
      expect(container).toBeInTheDocument()
      expect(container.querySelectorAll('[data-testid^="item-"]').length).toBe(1000)
    })

    it('应该处理负数itemCount参数（边界情况）', () => {
      const { container } = render(<HeavyComponent itemCount={-5} />)
      expect(container).toBeInTheDocument()
    })

    it('应该处理超大itemCount参数（压力测试）', () => {
      const startTime = performance.now()

      const { container } = render(<HeavyComponent itemCount={10000} />)
      const endTime = performance.now()

      expect(container).toBeInTheDocument()
      expect(endTime - startTime).toBeLessThan(10000)
    })

    it('应该处理组件多次挂载/卸载', () => {
      const { unmount, rerender } = render(<SimpleCounter />)

      for (let i = 0; i < 5; i++) {
        rerender(<SimpleCounter key={i} />)
      }

      unmount()

      expect(document.querySelector('[data-testid="counter"]')).toBeNull()
    })
  })
})
