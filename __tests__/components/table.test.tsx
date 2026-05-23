import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const mockTableData = [
  { id: 1, name: '房间101', status: '可用', type: '标准间', price: 288 },
  { id: 2, name: '房间102', status: '占用', type: '豪华间', price: 588 },
  { id: 3, name: '房间103', status: '清洁中', type: '标准间', price: 288 },
]

function SimpleTable({ data }: { data: typeof mockTableData }) {
  return (
    <table data-testid="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>名称</th>
          <th>状态</th>
          <th>类型</th>
          <th>价格</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} data-testid={`row-${row.id}`}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.status}</td>
            <td>{row.type}</td>
            <td data-testid={`price-${row.id}`}>¥{row.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

describe('Table组件测试', () => {
  describe('基础渲染', () => {
    it('应该正确渲染表格数据', () => {
      render(<SimpleTable data={mockTableData} />)

      expect(screen.getByTestId('table')).toBeInTheDocument()
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBe(4)
    })

    it('应该渲染表头', () => {
      render(<SimpleTable data={mockTableData} />)

      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('名称')).toBeInTheDocument()
      expect(screen.getByText('状态')).toBeInTheDocument()
      expect(screen.getByText('类型')).toBeInTheDocument()
      expect(screen.getByText('价格')).toBeInTheDocument()
    })

    it('应该渲染所有数据行', () => {
      render(<SimpleTable data={mockTableData} />)

      expect(screen.getByTestId('row-1')).toBeInTheDocument()
      expect(screen.getByTestId('row-2')).toBeInTheDocument()
      expect(screen.getByTestId('row-3')).toBeInTheDocument()

      expect(screen.getByText('房间101')).toBeInTheDocument()
      expect(screen.getByText('房间102')).toBeInTheDocument()
      expect(screen.getByText('房间103')).toBeInTheDocument()
    })
  })

  describe('数据展示', () => {
    it('应该正确显示房间状态', () => {
      render(<SimpleTable data={mockTableData} />)

      expect(screen.getByText('可用')).toBeInTheDocument()
      expect(screen.getByText('占用')).toBeInTheDocument()
      expect(screen.getByText('清洁中')).toBeInTheDocument()
    })

    it('应该正确显示价格格式（使用data-testid定位）', () => {
      render(<SimpleTable data={mockTableData} />)

      const price1 = screen.getByTestId('price-1')
      const price2 = screen.getByTestId('price-2')

      expect(price1).toBeInTheDocument()
      expect(price1).toHaveTextContent('¥288')
      expect(price2).toBeInTheDocument()
      expect(price2).toHaveTextContent('¥588')
    })

    it('应该正确显示房间类型', () => {
      render(<SimpleTable data={mockTableData} />)

      const standardRooms = screen.getAllByText('标准间')
      expect(standardRooms.length).toBeGreaterThanOrEqual(2)
      expect(screen.getByText('豪华间')).toBeInTheDocument()
    })
  })

  describe('空数据处理', () => {
    it('应该处理空数据数组', () => {
      render(<SimpleTable data={[]} />)

      expect(screen.getByTestId('table')).toBeInTheDocument()
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBe(1)
    })

    it('应该在无数据时显示表头', () => {
      render(<SimpleTable data={[]} />)

      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('名称')).toBeInTheDocument()
    })
  })

  describe('可访问性', () => {
    it('应该有正确的table角色', () => {
      render(<SimpleTable data={mockTableData} />)

      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('应该有正确的行和单元格结构', () => {
      render(<SimpleTable data={mockTableData} />)

      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(0)

      const firstDataRow = screen.getByTestId('row-1')
      const cells = firstDataRow.querySelectorAll('td')
      expect(cells.length).toBe(5)
    })
  })

  describe('交互场景模拟', () => {
    it('应该支持行点击事件（通过data-testid）', () => {
      const handleRowClick = vi.fn()

      render(
        <div onClick={() => handleRowClick('row-1')}>
          <SimpleTable data={[mockTableData[0]]} />
        </div>
      )

      fireEvent.click(screen.getByTestId('row-1'))
      expect(handleRowClick).toHaveBeenCalledWith('row-1')
    })

    it('应该支持数据筛选后的重新渲染', () => {
      const { rerender } = render(<SimpleTable data={mockTableData} />)

      let rows = screen.getAllByRole('row')
      expect(rows.length).toBe(4)

      const filteredData = mockTableData.filter((item) => item.status === '可用')
      rerender(<SimpleTable data={filteredData} />)

      rows = screen.getAllByRole('row')
      expect(rows.length).toBe(2)
      expect(screen.getByText('房间101')).toBeInTheDocument()
      expect(screen.queryByText('房间102')).not.toBeInTheDocument()
    })
  })

  describe('性能相关', () => {
    it('应该高效渲染大量数据', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `房间${100 + i}`,
        status: i % 3 === 0 ? '可用' : i % 3 === 1 ? '占用' : '清洁中',
        type: i % 2 === 0 ? '标准间' : '豪华间',
        price: i % 2 === 0 ? 288 : 588,
      }))

      const startTime = performance.now()
      render(<SimpleTable data={largeData} />)
      const endTime = performance.now()

      const rows = screen.getAllByRole('row')
      expect(rows.length).toBe(101)
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
})
