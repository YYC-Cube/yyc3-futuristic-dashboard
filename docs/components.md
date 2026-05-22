# YYC3 智慧商家管理系统 — 组件库文档

> **版本**：v2.0.0  
> **更新日期**：2026-05-22  
> **组件总数**：35+ | **基础 UI**: 25+ | **业务组件**: 10+

---

## 📋 目录

1. [概述](#1-概述)
2. [基础 UI 组件 (shadcn/ui)](#2-基础-ui 组件-shadcnui)
3. [业务组件](#3-业务组件)
4. [布局组件](#4-布局组件)
5. [通用组件](#5-通用组件)
6. [组件使用规范](#6-组件使用规范)
7. [主题与样式](#7-主题与样式)
8. [动态导入优化](#8-动态导入优化)

---

## 1. 概述

YYC3 组件库基于 **shadcn/ui + Radix UI + Tailwind CSS** 构建，提供无障碍访问、高度可定制的企业级组件。

### 1.1 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| shadcn/ui | latest | 基础 UI 组件 |
| Radix UI | latest | 无障碍原始组件 |
| Tailwind CSS | 3.4.x | 原子化样式 |
| Lucide React | 0.454+ | 图标库 |
| class-variance-authority | 0.7.x | 变体样式管理 |
| clsx + tailwind-merge | - | 类名合并工具 |

### 1.2 设计原则

- ✅ **可访问性** (A11y): 所有组件支持键盘导航和屏幕阅读器
- ✅ **暗色优先**: 默认深色主题，支持亮色切换
- ✅ **一致性**: 统一的设计语言和交互模式
- ✅ **可组合性**: 组件可灵活嵌套和扩展
- ✅ **TypeScript**: 完整的类型定义和 Props 约束

---

## 2. 基础 UI 组件 (shadcn/ui)

所有基础组件位于 `components/ui/` 目录，可通过 `@/components/ui/xxx` 导入。

### 2.1 表单组件

#### Button 按钮

```tsx
import { Button } from "@/components/ui/button"

// 基础用法
<Button>点击我</Button>

// 变体
<Button variant="default">默认</Button>
<Button variant="secondary">次要</Button>
<Button variant="destructive">危险</Button>
<Button variant="outline">轮廓</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="link">链接</Button>

// 尺寸
<Button size="sm">小</Button>
<Button size="default">中</Button>
<Button size="lg">大</Button>
<Button size="icon"><Icon /></Button>

// 状态
<Button disabled>禁用</Button>
<Button loading>加载中</Button>
```

**Props**:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}
```

---

#### Input 输入框

```tsx
import { Input } from "@/components/ui/input"

<Input placeholder="请输入..." />
<Input type="password" />
<Input disabled value="只读" />
<Input className="bg-slate-800" /> // 自定义样式
```

---

#### Select 选择器

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="选择选项" />
  </SelectTrigger>
  <SelectContent>
    <Item value="option1">选项 1</Item>
    <Item value="option2">选项 2</Item>
    <Item value="option3">选项 3</Item>
  </SelectContent>
</Select>
```

---

#### Switch 开关

```tsx
import { Switch } from "@/components/ui/switch"

<Switch checked={value} onCheckedChange={setValue} />
<Switch disabled />
```

---

### 2.2 数据展示

#### Card 卡片

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card className="bg-slate-900/50 border-slate-700/50">
  <CardHeader>
    <CardTitle className="text-slate-100">标题</CardTitle>
    <CardDescription className="text-slate-400">描述文字</CardDescription>
  </CardHeader>
  <CardContent>
    内容区域
  </CardContent>
  <CardFooter>
    底部操作区
  </CardFooter>
</Card>
```

---

#### Table 表格

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>姓名</TableHead>
      <TableHead>状态</TableHead>
      <TableHead className="text-right">操作</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell><Badge>{item.status}</Badge></TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm">编辑</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

#### Badge 徽标

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>默认</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="destructive">危险</Badge>
<Badge variant="outline">轮廓</Badge>

// 自定义样式
<Badge className="bg-cyan-600">自定义颜色</Badge>
```

---

### 2.3 反馈组件

#### Dialog 对话框

```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>打开对话框</Button>
  </DialogTrigger>
  <DialogContent className="bg-slate-900 border-slate-700">
    <DialogHeader>
      <DialogTitle>确认操作？</DialogTitle>
      <DialogDescription>此操作不可撤销</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
      <Button onClick={handleConfirm}>确认</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

#### Toast 提示

```tsx
import { useToast } from "@/hooks/use-toast"
import { toast } from "sonner"

// 方式 1: Hook
const { toast } = useToast()
toast({
  title: "操作成功",
  description: "数据已保存",
})

// 方式 2: 直接调用 (推荐)
toast.success("保存成功")
toast.error("操作失败")
toast.loading("正在处理...")
toast.promise(saveData(), {
  loading: '保存中...',
  success: '已保存',
  error: '保存失败',
})
```

---

#### Alert 警告

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert variant="default">
  <Info className="h-4 w-4" />
  <AlertTitle>提示</AlertTitle>
  <AlertDescription>这是一条提示信息</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>错误</AlertTitle>
  <AlertDescription>操作失败，请重试</AlertDescription>
</Alert>
```

---

### 2.4 导航组件

#### Tabs 标签页

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="tab1" className="w-full">
  <TabsList className="bg-slate-800">
    <TabsTrigger value="tab1">标签 1</TabsTrigger>
    <TabsTrigger value="tab2">标签 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">内容 1</TabsContent>
  <TabsContent value="tab2">内容 2</TabsContent>
</Tabs>
```

---

#### Breadcrumb 面包屑

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">首页</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/rooms">包厢管理</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>详情</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### 2.5 其他常用组件

| 组件 | 导入路径 | 用途 |
|------|---------|------|
| Avatar | `@/components/ui/avatar` | 用户头像 |
| Checkbox | `@/components/ui/checkbox` | 复选框 |
| DropdownMenu | `@/components/ui/dropdown-menu` | 下拉菜单 |
| Popover | `@/components/ui/popover` | 弹出框 |
| Tooltip | `@/components/ui/tooltip` | 工具提示 |
| Progress | `@/components/ui/progress` | 进度条 |
| Separator | `@/components/ui/separator` | 分隔线 |
| ScrollArea | `@/components/ui/scroll-area` | 滚动区域 |
| Calendar | `@/components/ui/calendar` | 日历选择器 |
| DateRangePicker | `@/components/ui/date-range-picker` | 日期范围选择 |

---

## 3. 业务组件

### 3.1 包厢管理组件

#### RoomStatusDashboard 包厢状态仪表板

**文件位置**: `components/room/room-status-dashboard.tsx`

```tsx
import RoomStatusDashboard from '@/components/room/room-status-dashboard'

<RoomStatusDashboard 
  rooms={rooms}
  onRoomClick={(room) => navigate(`/rooms/${room.id}`)}
  onStatusChange={(roomId, status) => updateRoomStatus(roomId, status)}
/>
```

**Props**:

```typescript
interface RoomStatusDashboardProps {
  rooms: Room[]
  onRoomClick?: (room: Room) => void
  onStatusChange?: (roomId: string, status: Room['status']) => void
  showStats?: boolean       // 是否显示统计信息 (默认 true)
  layout?: 'grid' | 'list'  // 布局模式 (默认 grid)
}
```

---

### 3.2 订单管理组件

#### POSInterface 点单收银界面

**文件位置**: `components/pos/pos-interface.tsx`

```tsx
import POSInterface from '@/components/pos/pos-interface'

<POSInterface
  roomId="room-001"
  products={products}
  onSubmitOrder={(order) => createOrder(order)}
  onCancel={() => navigate('/orders')}
/>
```

---

### 3.3 员工管理组件

#### AddEmployeeForm 添加员工表单

**文件位置**: `components/employee/add-employee-form.tsx`

```tsx
import AddEmployeeForm from '@/components/employee/add-employee-form'

<AddEmployeeForm
  onSubmit={(data) => createEmployee(data)}
  onCancel={() => navigate('/employees')}
/>
```

**特性**:

- 多步骤表单 (基本资料 → 权限设置 → 财务设置 → 高级设置)
- 可视化权限配置
- 实时表单验证

---

### 3.4 数据分析组件

#### AnalyticsDashboard 数据分析仪表板

**文件位置**: `components/reports/analytics-dashboard.tsx`

```tsx
import dynamic from 'next/dynamic'

const AnalyticsDashboard = dynamic(
  () => import('@/components/reports/analytics-dashboard'),
  { 
    loading: () => <PageLoader />,
    ssr: false 
  }
)

<AnalyticsDashboard
  dateRange={dateRange}
  metrics={['revenue', 'orders', 'customers']}
/>
```

**图表类型**:

- LineChart: 营收趋势
- BarChart: 商品销量排行
- PieChart: 分类占比
- AreaChart: 流量分析

---

## 4. 布局组件

### 4.1 OptimizedLayout 主布局

**文件位置**: `components/layout/optimized-layout.tsx`

```tsx
import OptimizedLayout from '@/components/layout/optimized-layout'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <OptimizedLayout>
            {children}
          </OptimizedLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**功能**:

- 侧边栏导航 (可折叠)
- 顶部栏 (用户信息、通知、搜索)
- 面包屑自动生成
- 响应式设计 (移动端自适应)

---

### 4.2 ErrorBoundary 错误边界

**文件位置**: `components/layout/error-boundary.tsx`

```tsx
import ErrorBoundary from '@/components/layout/error-boundary'

<ErrorBoundary
  fallback={<div>加载出错，请刷新页面</div>}
  onError={(error) => logError(error)}
>
  <MyComponent />
</ErrorBoundary>
```

---

### 4.3 PageLoader 页面加载器

**文件位置**: `components/layout/page-loader.tsx`

```tsx
import PageLoader from '@/components/layout/page-loader'

// 全局加载状态
{isLoading && <PageLoader text="正在加载数据..." />}

// 动态导入时使用
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <PageLoader />
})
```

---

## 5. 通用组件

### 5.1 BreadcrumbNav 面包屑导航

**文件位置**: `components/layout/breadcrumb-nav.tsx`

```tsx
import BreadcrumbNav from '@/components/layout/breadcrumb-nav'

// 自动根据当前路由生成面包屑
<BreadcrumbNav />

// 手动指定路径
<BreadcrumbNav items={[
  { label: '首页', href: '/' },
  { label: '员工', href: '/employees' },
  { label: '编辑', href: null }
]} />
```

---

### 5.2 StatusBadge 状态徽标

```tsx
function StatusBadge({ status }: { status: string }) {
  const config = {
    available: { label: '空闲', className: 'bg-green-600' },
    occupied: { label: '使用中', className: 'bg-red-600' },
    maintenance: { label: '维护中', className: 'bg-yellow-600' },
  }

  const { label, className } = config[status] || { label: status, className: 'bg-gray-600' }

  return <Badge className={className}>{label}</Badge>
}
```

---

## 6. 组件使用规范

### 6.1 命名约定

```
✅ 正确示例:
- components/room/room-card.tsx         # 单个组件: PascalCase
- components/ui/button.tsx              # 基础 UI: 小写
- components/layout/app-shell.tsx       # 布局: kebab-case

❌ 错误示例:
- components/RoomCard.tsx               # 不要放在根目录
- components/Button.tsx                 # 基础组件应在 ui/ 下
```

### 6.2 文件结构

每个组件目录应包含:

```
component-name/
├── component-name.tsx      # 主组件
├── component-name.test.tsx # 单元测试 (可选)
└── index.ts                # 导出文件 (可选)
```

### 6.3 Props 定义规范

```typescript
// ✅ 使用 interface 明确定义 Props
interface MyComponentProps {
  /** 必填属性 */
  title: string
  /** 可选属性 */
  subtitle?: string
  /** 回调函数 */
  onClick?: (id: string) => void
  /** 子元素 */
  children?: React.ReactNode
}

export function MyComponent({ title, subtitle, onClick, children }: MyComponentProps) {
  // ...
}
```

### 6.4 样式规范

```tsx
// ✅ 使用 Tailwind CSS 类名
<div className="flex items-center gap-4 p-4 bg-slate-900 rounded-lg border border-slate-700">

// ❌ 避免内联样式
<div style={{ display: 'flex', padding: '16px' }}>

// ✅ 条件类名使用 cn() 工具函数
import { cn } from '@/lib/utils'
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes'
)}>
```

---

## 7. 主题与样式

### 7.1 颜色系统

YYC3 采用 **暗色优先** 的设计语言：

```css
/* globals.css */

:root {
  /* 背景色 */
  --background: 222 47% 11%;      /* slate-950 */
  --foreground: 210 40% 98%;     /* slate-50 */
  
  /* 卡片背景 */
  --card: 222 47% 15%;           /* slate-900 */
  --card-foreground: 210 40%98%;
  
  /* 主色调 */
  --primary: 189 94% 43%;        /* cyan-500 */
  --primary-foreground: 0 0% 100%;
  
  /* 边框 */
  --border: 217 33% 17%;         /* slate-800 */
  --ring: 189 94% 43%;           /* cyan-500 */
  
  /* 语义色 */
  --destructive: 0 84% 60%;      /* red-500 */
  --success: 142 76% 36%;        /* green-500 */
  --warning: 38 92% 50%;         /* yellow-500 */
}
```

### 7.2 响应式断点

```css
/* Tailwind 默认断点 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板竖屏 */
lg: 1024px  /* 平板横屏/小笔记本 */
xl: 1280px  /* 桌面显示器 */
2xl: 1536px /* 大屏显示器 */
```

### 7.3 暗色/亮色切换

项目默认使用暗色主题，支持用户手动切换：

```tsx
'use client'
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
```

---

## 8. 动态导入优化

为提升首屏加载性能，重组件采用动态导入策略。

### 8.1 配置文件

**文件位置**: `components/lazy-components.tsx`

```typescript
import dynamic from 'next/dynamic'
import { PageLoader } from '@/components/layout/page-loader'

// 数据分析仪表板 (~48KB)
export const AnalyticsDashboard = dynamic(
  () => import('@/components/reports/analytics-dashboard').then(mod => mod.default),
  { 
    loading: () => <PageLoader text="加载分析数据..." />,
    ssr: false 
  }
)

// 复杂图表组件
export const HeavyChart = dynamic(
  () => import('@/components/charts/heavy-chart'),
  { loading: () => <PageLoader /> }
)
```

### 8.2 使用建议

| 组件大小 | 建议 | 方式 |
|---------|------|------|
| < 10KB | 直接导入 | `import` |
| 10-50KB | 按需动态导入 | `dynamic()` + `ssr: false` |
| > 50KB | 必须动态导入 | `dynamic()` + Loading 状态 |

---

## 📊 组件清单

### 基础 UI (25+)

| 组件 | 状态 | 文档 | 示例 |
|------|------|------|------|
| Button | ✅ | [查看](#button-按钮) | 变体/尺寸/状态 |
| Input | ✅ | [查看](#input-输入框) | 类型/禁用/自定义 |
| Select | ✅ | [查看](#select-选择器) | 受控/搜索/分组 |
| Card | ✅ | [查看](#card-卡片) | 头部/内容/底部 |
| Table | ✅ | [查看](#table-表格) | 排序/选择/分页 |
| Dialog | ✅ | [查看](#dialog-对话框) | 模态/确认/表单 |
| Toast | ✅ | [查看](#toast-提示) | Promise/自定义 |
| Tabs | ✅ | [查看](#tabs-标签页) | 垂直/动画 |
| Badge | ✅ | [查看](#badge-徽标) | 变体/点状 |
| Switch | ✅ | [查看](#switch-开关) | 受控/禁用 |
| ... | ... | ... | ... |

### 业务组件 (10+)

| 组件 | 用途 | 文件位置 | 大小 |
|------|------|---------|------|
| RoomStatusDashboard | 包厢状态总览 | `room/` | ~15KB |
| AddEmployeeForm | 员工添加表单 | `employee/` | ~25KB |
| POSInterface | 点单收银界面 | `pos/` | ~30KB |
| AnalyticsDashboard | 数据分析仪表板 | `reports/` | ~48KB ⚠️ |
| EmployeeProfile | 员工档案卡片 | `employee/` | ~12KB |
| OrderList | 订单列表 | `order/` | ~18KB |
| ... | ... | ... | ... |

---

## 🔗 相关文档

- **[架构设计](./architecture.md)** - 组件在整体架构中的定位
- **[API 接口文档](./api-reference.md)** - 后端接口与组件的数据交互
- **[部署运维指南](./deployment-ops.md)** - 生产环境组件性能优化
- **[开发指南](./development-guide.md)** - 新建组件的最佳实践

---

## 📝 更新日志

### v2.0.0 (2026-05-22)

#### ✅ 新增

- 完整的 25+ 基础 UI 组件文档
- 业务组件使用说明和 Props 定义
- 动态导入优化策略
- 主题系统和颜色变量文档
- 组件命名和使用规范

#### 🔧 改进

- 补充 TypeScript 类型定义
- 增加响应式设计最佳实践
- 完善无障碍访问 (A11y) 说明

---

> **维护说明**: 本文档随组件库更新同步维护  
> **贡献方式**: 通过 PR 提交新组件或改进建议  
> **审查周期**: 每月一次或重大版本发布时
