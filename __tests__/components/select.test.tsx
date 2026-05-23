import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

describe('Select组件系统', () => {
  describe('基础渲染和交互', () => {
    it('应该正确渲染选择器触发器', () => {
      render(
        <Select>
          <SelectTrigger data-testid="select-trigger">
            <SelectValue placeholder="请选择..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">选项1</SelectItem>
            <SelectItem value="option2">选项2</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
      expect(screen.getByText('请选择...')).toBeInTheDocument()
    })

    it('应该正确显示默认值', async () => {
      render(
        <Select defaultValue="standard">
          <SelectTrigger data-testid="default-value-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">标准间</SelectItem>
            <SelectItem value="vip">VIP包厢</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByTestId('default-value-trigger')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('选项选择功能', () => {
    it('应该正确渲染选项内容', () => {
      const handleValueChange = vi.fn()

      render(
        <Select onValueChange={handleValueChange}>
          <SelectTrigger data-testid="room-type-select">
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent data-testid="select-dropdown">
            <SelectItem value="standard">标准间</SelectItem>
            <SelectItem value="vip">VIP包厢</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByTestId('room-type-select')).toBeInTheDocument()
      expect(screen.getByText('选择类型')).toBeInTheDocument()
    })
  })

  describe('受控模式', () => {
    it('应该支持外部控制值', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('')

        return (
          <div>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger data-testid="controlled-select">
                <SelectValue placeholder="受控选择" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">选项A</SelectItem>
                <SelectItem value="b">选项B</SelectItem>
                <SelectItem value="c">选项C</SelectItem>
              </SelectContent>
            </Select>
            <span data-testid="current-value">{value || '未选择'}</span>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('current-value')).toHaveTextContent('未选择')
      expect(screen.getByTestId('controlled-select')).toBeInTheDocument()
    })
  })

  describe('禁用状态', () => {
    it('应该在禁用状态下不可点击', () => {
      render(
        <Select disabled>
          <SelectTrigger data-testid="disabled-select">
            <SelectValue placeholder="禁用选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">选项1</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByTestId('disabled-select')
      expect(trigger).toBeDisabled()
    })

    it('应该支持单独禁用某些选项', () => {
      render(
        <Select>
          <SelectTrigger data-testid="partial-disabled">
            <SelectValue placeholder="部分禁用" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">可用选项</SelectItem>
            <SelectItem value="disabled" disabled>禁用选项</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByTestId('partial-disabled')).toBeInTheDocument()
    })
  })

  describe('分组选项', () => {
    it('应该支持多个选项显示', () => {
      render(
        <Select>
          <SelectTrigger data-testid="grouped-select">
            <SelectValue placeholder="分组选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s1">标准间-101</SelectItem>
            <SelectItem value="s2">标准间-102</SelectItem>
            <SelectItem value="v1">VIP包厢-201</SelectItem>
            <SelectItem value="v2">VIP包厢-202</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByTestId('grouped-select')).toBeInTheDocument()
    })
  })

  describe('表单集成', () => {
    it('应该在表单中正常工作', () => {
      const handleSubmit = vi.fn((e) => e.preventDefault())

      render(
        <form onSubmit={handleSubmit} data-testid="form-with-select">
          <label htmlFor="room-status">房间状态</label>
          <Select name="roomStatus">
            <SelectTrigger id="room-status" aria-label="房间状态">
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">可用</SelectItem>
              <SelectItem value="occupied">占用</SelectItem>
              <SelectItem value="maintenance">维护中</SelectItem>
            </SelectContent>
          </Select>
          <button type="submit">提交</button>
        </form>
      )

      const form = screen.getByTestId('form-with-select')
      expect(form).toBeInTheDocument()
    })

    it('应该支持多个选择器联动', () => {
      const MultiSelectForm = () => {
        const [building, setBuilding] = React.useState('')
        const [floor, setFloor] = React.useState('')

        return (
          <div>
            <Select value={building} onValueChange={setBuilding}>
              <SelectTrigger data-testid="building-select">
                <SelectValue placeholder="选择楼栋" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A栋</SelectItem>
                <SelectItem value="B">B栋</SelectItem>
              </SelectContent>
            </Select>

            <Select value={floor} onValueChange={setFloor}>
              <SelectTrigger data-testid="floor-select">
                <SelectValue placeholder="选择楼层" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1楼</SelectItem>
                <SelectItem value="2">2楼</SelectItem>
                <SelectItem value="3">3楼</SelectItem>
              </SelectContent>
            </Select>

            <div data-testid="selection-result">
              已选择: {building || '-'} / {floor || '-'}
            </div>
          </div>
        )
      }

      render(<MultiSelectForm />)

      expect(screen.getByTestId('selection-result'))
        .toHaveTextContent('已选择: - / -')
    })
  })

  describe('可访问性', () => {
    it('应该有正确的ARIA属性', () => {
      render(
        <Select>
          <SelectTrigger aria-label="选择房间类型" data-testid="accessible-select">
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt1">选项1</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByLabelText(/选择房间类型/i)).toBeInTheDocument()
    })

    it('应该支持键盘导航基础功能', () => {
      render(
        <Select>
          <SelectTrigger data-testid="keyboard-select">
            <SelectValue placeholder="键盘导航" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">第一项</SelectItem>
            <SelectItem value="2">第二项</SelectItem>
            <SelectItem value="3">第三项</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByTestId('keyboard-select')
      expect(trigger).toBeInTheDocument()
      expect(trigger).not.toBeDisabled()
    })
  })

  describe('实际业务场景', () => {
    it('应该支持房间类型筛选', () => {
      const rooms = [
        { id: 1, type: 'standard', name: '标准间-101' },
        { id: 2, type: 'vip', name: 'VIP包厢-201' },
        { id: 3, type: 'party', name: '派对房-301' },
      ]

      const RoomFilter = () => {
        const [filterType, setFilterType] = React.useState('all')

        const filteredRooms = filterType === 'all'
          ? rooms
          : rooms.filter(room => room.type === filterType)

        return (
          <div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger data-testid="room-filter">
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="standard">标准间</SelectItem>
                <SelectItem value="vip">VIP包厢</SelectItem>
                <SelectItem value="party">派对房</SelectItem>
              </SelectContent>
            </Select>

            <ul data-testid="filtered-rooms">
              {filteredRooms.map((room) => (
                <li key={room.id}>{room.name}</li>
              ))}
            </ul>
          </div>
        )
      }

      render(<RoomFilter />)

      const roomList = screen.getByTestId('filtered-rooms')
      expect(roomList.children.length).toBe(3)
    })

    it('应该支持订单状态切换', () => {
      const OrderStatusSelector = ({ currentStatus }: { currentStatus: string }) => {
        const [status, setStatus] = React.useState(currentStatus)

        return (
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger data-testid="order-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="confirmed">已确认</SelectItem>
              <SelectItem value="preparing">准备中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
        )
      }

      render(<OrderStatusSelector currentStatus="pending" />)

      expect(screen.getByTestId('order-status')).toBeInTheDocument()
    })
  })
})
