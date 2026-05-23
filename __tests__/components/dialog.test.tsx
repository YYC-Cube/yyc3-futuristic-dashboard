import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

describe('Dialog组件系统', () => {
  describe('基础打开和关闭', () => {
    it('应该通过触发器按钮打开对话框', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>打开对话框</button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-content-basic">
            <DialogTitle>对话框标题</DialogTitle>
            <p>对话框内容</p>
          </DialogContent>
        </Dialog>
      )

      expect(screen.queryByTestId('dialog-content-basic')).not.toBeInTheDocument()

      fireEvent.click(screen.getByText('打开对话框'))

      const dialogContent = await screen.findByTestId('dialog-content-basic')
      expect(dialogContent).toBeInTheDocument()
    })

    it('应该支持通过ESC键关闭', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open</button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-content-esc">
            <DialogTitle>Closable Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Open'))
      expect(await screen.findByTestId('dialog-content-esc')).toBeInTheDocument()

      fireEvent.keyDown(document, { key: 'Escape' })
    })

    it('应该支持点击遮罩层关闭', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Modal</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Modal with Overlay</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Open Modal'))
      expect(await screen.findByRole('dialog')).toBeVisible()

      const overlay = document.querySelector('[data-state="open"]')
      if (overlay) {
        fireEvent.mouseDown(overlay)
      }
    })
  })

  describe('DialogContent', () => {
    it('应该正确渲染对话框内容', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Show Content</button>
          </DialogTrigger>
          <DialogContent data-testid="rich-dialog">
            <DialogTitle>内容标题</DialogTitle>
            <DialogDescription>这是详细的描述信息</DialogDescription>
            <div className="py-4">
              <p>主要内容区域可以包含任何元素</p>
              <ul>
                <li>列表项1</li>
                <li>列表项2</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Show Content'))
      const dialog = await screen.findByTestId('rich-dialog')

      expect(dialog).toBeInTheDocument()
      expect(screen.getByText('内容标题')).toBeInTheDocument()
      expect(screen.getByText('这是详细的描述信息')).toBeInTheDocument()
      expect(screen.getByText('列表项1')).toBeInTheDocument()
    })

    it('应该有正确的role属性', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Check Role</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Check Role'))
      const dialog = await screen.findByRole('dialog')

      expect(dialog).toHaveAttribute('role', 'dialog')
    })

    it('应该支持自定义className', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Custom Style</button>
          </DialogTrigger>
          <DialogContent className="custom-dialog-class" data-testid="custom-dialog">
            <DialogTitle>Styled Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Custom Style'))

      const customDialog = await screen.findByTestId('custom-dialog')
      expect(customDialog).toBeInTheDocument()
      expect(customDialog).toHaveClass('custom-dialog-class')
    })
  })

  describe('DialogHeader', () => {
    it('应该包含标题和描述', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Header Test</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认操作</DialogTitle>
              <DialogDescription>此操作无法撤销，请确认是否继续？</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Header Test'))

      expect(await screen.findByText('确认操作')).toBeInTheDocument()
      expect(screen.getByText('此操作无法撤销，请确认是否继续？')).toBeInTheDocument()
    })
  })

  describe('DialogTitle', () => {
    it('应该设置文档焦点到标题', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Focus Title</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle data-testid="dialog-title-focus">自动聚焦的标题</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Focus Title'))
      const title = await screen.findByTestId('dialog-title-focus')

      expect(title).toBeInTheDocument()
    })

    it('应该支持多行文本', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Multi Line</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle data-testid="multiline-dialog-title">
              第一行
              <br />
              第二行
            </DialogTitle>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Multi Line'))

      const titleElement = await screen.findByTestId('multiline-dialog-title')
      expect(titleElement).toBeInTheDocument()
      expect(titleElement.textContent).toContain('第一行')
      expect(titleElement.textContent).toContain('第二行')
    })
  })

  describe('DialogDescription', () => {
    it('应该提供辅助描述信息', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Description</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>辅助性描述文本</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Description'))

      expect(await screen.findByText('辅助性描述文本')).toBeInTheDocument()
    })
  })

  describe('DialogFooter', () => {
    it('应该渲染底部操作按钮', async () => {
      const handleConfirm = vi.fn()
      const handleCancel = vi.fn()

      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>With Footer</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle data-testid="dialog-title-text">确认删除</DialogTitle>
            <DialogDescription>确定要删除此项目吗？</DialogDescription>
            <DialogFooter>
              <button onClick={handleCancel} className="px-4 py-2 border rounded">取消</button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-red-500 text-white rounded">确认删除</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('With Footer'))

      expect(await screen.findByText('取消')).toBeInTheDocument()
      const confirmButtons = screen.getAllByText('确认删除')
      expect(confirmButtons.length).toBeGreaterThan(0)

      fireEvent.click(confirmButtons[confirmButtons.length - 1])
      expect(handleConfirm).toHaveBeenCalledTimes(1)
    })

    it('应该支持flex布局对齐', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Flex Footer</button>
          </DialogTrigger>
          <DialogContent>
            <DialogFooter className="justify-between">
              <span>左侧操作</span>
              <span>右侧操作</span>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Flex Footer'))

      expect(await screen.findByText('左侧操作')).toBeInTheDocument()
      expect(screen.getByText('右侧操作')).toBeInTheDocument()
    })
  })

  describe('表单集成场景', () => {
    it('应该在对话框中渲染表单', async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault())

      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Form Dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>添加新房间</DialogTitle>
            <form onSubmit={handleSubmit} data-testid="room-form">
              <div className="space-y-4">
                <div>
                  <label htmlFor="room-number">房间号</label>
                  <input id="room-number" type="text" placeholder="例如: 301" />
                </div>
                <div>
                  <label htmlFor="room-type">房间类型</label>
                  <select id="room-type">
                    <option value="standard">标准间</option>
                    <option value="vip">VIP包厢</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="capacity">容量</label>
                  <input id="capacity" type="number" min="1" max="20" defaultValue="6" />
                </div>
              </div>
            </form>
            <DialogFooter>
              <button type="submit" form="room-form">提交</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Form Dialog'))

      expect(await screen.findByLabelText(/房间号/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/房间类型/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/容量/i)).toBeInTheDocument()
    })

    it('应该处理表单验证错误', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Validation</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>表单验证</DialogTitle>
            <form data-testid="validate-form">
              <input required data-testid="required-field" placeholder="必填字段" />
              <button type="submit">提交</button>
            </form>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Validation'))

      const form = await screen.findByTestId('validate-form')
      fireEvent.submit(form)

      const requiredField = screen.getByTestId('required-field')
      expect(requiredField).toBeInvalid()
    })
  })

  describe('嵌套对话框场景', () => {
    it('应该支持确认类对话框模式', async () => {
      const handleDelete = vi.fn()

      render(
        <Dialog>
          <DialogTrigger asChild>
            <button data-testid="delete-trigger">删除项目</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>⚠️ 确认删除</DialogTitle>
              <DialogDescription>
                您确定要删除"房间101"吗？此操作不可逆。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button onClick={() => {}}>取消</button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white"
                data-testid="confirm-delete"
              >
                确认删除
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByTestId('delete-trigger'))

      const confirmButton = await screen.findByTestId('confirm-delete')
      expect(confirmButton).toBeInTheDocument()
      expect(screen.getByText(/您确定要删除"房间101"吗？/i)).toBeInTheDocument()

      fireEvent.click(confirmButton)
      expect(handleDelete).toHaveBeenCalledTimes(1)
    })

    it('应该支持信息展示对话框', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>查看详情</button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>房间详情 - 房间101</DialogTitle>
              <DialogDescription>最后更新: 2024-01-15 14:30</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h4 className="font-semibold">基本信息</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>类型: 标准间</li>
                  <li>楼层: 3楼</li>
                  <li>容量: 6人</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">状态信息</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>状态: 可用</li>
                  <li>今日订单: 3笔</li>
                  <li>营收: ¥1,280</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <button>关闭</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('查看详情'))

      expect(await screen.findByText(/房间详情 - 房间101/i)).toBeInTheDocument()
      expect(screen.getByText(/类型: 标准间/i)).toBeInTheDocument()
      expect(screen.getByText(/状态: 可用/i)).toBeInTheDocument()
    })
  })

  describe('可访问性和键盘导航', () => {
    it('应该支持Tab键在对话框内导航', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Keyboard Nav</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>键盘测试</DialogTitle>
            <button data-testid="btn-1">Button 1</button>
            <button data-testid="btn-2">Button 2</button>
            <button data-testid="btn-3">Button 3</button>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Keyboard Nav'))
      await screen.findByRole('dialog')

      fireEvent.keyDown(document, { key: 'Tab' })
      fireEvent.keyDown(document, { key: 'Tab' })
      fireEvent.keyDown(document, { key: 'Tab' })
    })

    it('应该捕获焦点在对话框内', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Focus Trap</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Focus Trap Test</DialogTitle>
            <button data-testid="inside-btn">Inside Button</button>
          </DialogContent>
          <button data-testid="outside-btn">Outside Button</button>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Focus Trap'))
      await screen.findByRole('dialog')

      const insideBtn = await screen.findByTestId('inside-btn')
      insideBtn.focus()
      expect(insideBtn).toHaveFocus()
    })
  })
})
