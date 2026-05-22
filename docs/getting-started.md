# YYC3 智慧商家管理系统 — 快速入门指南

> **版本**：v2.0.0  
> **更新日期**：2026-05-22  
> **预计阅读时间**：30 分钟  
> **适用人群**：前端开发者、全栈开发者

---

## 📋 目录

1. [项目简介](#1-项目简介)
2. [快速开始](#2-快速开始)
3. [项目结构概览](#3-项目结构概览)
4. [核心概念](#4-核心概念)
5. [第一个功能开发](#5-第一个功能开发)
6. [常用命令](#6-常用命令)
7. [开发规范](#7-开发规范)
8. [常见问题](#8-常见问题)
9. [学习路径](#9-学习路径)

---

## 1. 项目简介

### 1.1 什么是 YYC3 智慧商家管理系统？

YYC3 是一套面向 **KTV/娱乐场所** 的全栈数字化管理平台，采用现代化技术栈构建：

```
┌─────────────────────────────────────────┐
│     YYC3 智慧商家管理系统 v2.0.0        │
├─────────────────────────────────────────┤
│  技术栈: Next.js + React + TypeScript   │
│  状态: ✅ 生产就绪 | TypeScript 0 错误   │
│  文档: 完整开发者文档五件套              │
└─────────────────────────────────────────┘
         ↓
┌──────────┬──────────┬──────────┐
│ 包厢管理  │ 点单收银  │ 订单管理  │
├──────────┼──────────┼──────────┤
│ 员工管理  │ 会员管理  │ 库存管理  │
├──────────┼──────────┼──────────┤
│ 营业报表  │ AI 助手  │ 系统设置  │
└──────────┴──────────┴──────────┘
```

### 1.2 核心特性

✅ **五高架构** - 高可用/高性能/高安全/高可扩展/高智能  
✅ **TypeScript 严格模式** - 100% 类型安全  
✅ **组件化设计** - 35+ 可复用组件  
✅ **实时通信** - WebSocket 集成  
✅ **AI 能力** - 智谱 AI / Microsoft Foundry  
✅ **测试覆盖** - Vitest 单元测试  

### 1.3 技术栈一览

| 类别 | 技术选型 | 版本 |
|------|---------|------|
| 框架 | Next.js (App Router) | 15.x |
| UI 库 | React | 19.x |
| 语言 | TypeScript (strict) | 5.x |
| 组件库 | shadcn/ui + Radix UI | latest |
| 样式 | Tailwind CSS | 3.4.x |
| 状态管理 | Zustand + devtools | latest |
| 表单验证 | react-hook-form + zod | 7.x / 3.x |
| 图表库 | Recharts | latest |
| 测试框架 | Vitest | 4.x |

---

## 2. 快速开始

### 2.1 前置要求

确保你的开发环境满足以下要求：

```bash
# 检查 Node.js 版本（需要 >= 18.x）
node --version
# 输出: v18.x.x 或更高

# 检查 pnpm 版本（需要 >= 8.x）
pnpm --version
# 输出: 8.x.x 或更高

# 如果没有安装 pnpm，执行：
corepack enable
corepack prepare pnpm@latest --activate
```

### 2.2 克隆与安装

```bash
# 1. 克隆仓库
git clone <your-repo-url> yyc3-dashboard
cd yyc3-dashboard

# 2. 安装依赖
corepack enable
pnpm install

# 3. 复制环境变量配置
cp .env.example .env.local

# 4. 启动开发服务器
pnpm dev
```

### 2.3 启动成功验证

打开浏览器访问：**<http://localhost:3000>**

你应该看到：

- ✅ YYC3 登录页面或仪表盘
- ✅ 控制台无报错信息
- ✅ 页面正常渲染

### 2.4 开发环境目录结构

```
yyc3-futuristic-dashboard/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── login/             # 登录页
│   ├── rooms/             # 包厢管理
│   ├── employees/         # 员工管理
│   └── ...
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   ├── employee/         # 业务组件
│   └── ...
├── lib/                   # 工具库和配置
│   ├── api/              # API 客户端
│   ├── stores/           # Zustand 状态管理
│   └── utils/            # 工具函数
├── docs/                  # 📚 开发者文档五件套
└── __tests__/            # 测试文件
```

---

## 3. 项目结构概览

### 3.1 核心目录说明

#### `/app` - 应用路由层

Next.js App Router 的核心，每个文件夹代表一个路由：

```
app/
├── layout.tsx           # 根布局（ThemeProvider, OptimizedLayout）
├── page.tsx             # 首页（重定向到 /rooms）
├── globals.css          # 全局样式
├── api/                 # API 路由
│   └── chat/route.ts    # AI 聊天接口
├── login/page.tsx       # 登录页面
├── rooms/page.tsx       # 包厢管理
├── employees/page.tsx   # 员工管理
├── orders/page.tsx      # 订单管理
└── settings/page.tsx    # 系统设置
```

**关键特性**:

- 使用 `layout.tsx` 共享布局
- 支持嵌套路由
- Server Components 默认启用

#### `/components` - 组件库

```
components/
├── ui/                  # shadcn/ui 基础组件（25+）
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── employee/            # 员工业务组件
│   ├── add-employee-form.tsx
│   └── employee-table.tsx
├── layout/              # 布局组件
│   ├── optimized-layout.tsx
│   └── sidebar-nav.tsx
└── lazy-components.tsx  # 动态导入优化
```

#### `/lib` - 核心逻辑层

```
lib/
├── api/                 # API 客户端
│   ├── client.ts        # 统一请求封装
│   ├── mock-data.ts     # Mock 数据
│   └── types.ts         # 类型定义
├── stores/              # Zustand Store
│   ├── useAuthStore.ts  # 认证状态
│   ├── useRoomStore.ts  # 包厢状态
│   └── useOrderStore.ts # 订单状态
├── websocket/           # WebSocket 通信
│   └── manager.ts
└── utils/               # 工具函数
    ├── cn.ts            # className 合并
    └── use-cache.ts     # 缓存 Hook
```

### 3.2 文件命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面组件 | PascalCase | `EmployeeTable.tsx` |
| UI 组件 | kebab-case | `button.tsx` |
| Hook | camelCase + use 前缀 | `useAuthStore.ts` |
| 工具函数 | camelCase | `formatDate.ts` |
| 类型定义 | camelCase | `apiTypes.ts` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL.ts` |

---

## 4. 核心概念

### 4.1 App Router 路由系统

Next.js 15 采用基于文件系统的路由：

```tsx
// app/rooms/page.tsx → http://localhost:3000/rooms
export default function RoomsPage() {
  return (
    <div>
      <h1>包厢管理</h1>
      {/* 页面内容 */}
    </div>
  )
}
```

**动态路由示例**:

```tsx
// app/employees/[id]/page.tsx → /employees/123
export default function EmployeeDetail({ params }: { params: { id: string } }) {
  return <div>员工 ID: {params.id}</div>
}
```

### 4.2 Zustand 状态管理

使用 Zustand 进行全局状态管理：

```typescript
// lib/stores/useRoomStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface RoomState {
  rooms: Room[]
  isLoading: boolean
  fetchRooms: () => Promise<void>
}

export const useRoomStore = create<RoomState>()(
  devtools(
    (set) => ({
      rooms: [],
      isLoading: false,
      fetchRooms: async () => {
        set({ isLoading: true })
        const rooms = await roomService.getAll()
        set({ rooms, isLoading: false })
      },
    }),
    { name: 'room-store' }
  )
)
```

**在组件中使用**:

```tsx
import { useRoomStore } from '@/lib/stores/useRoomStore'

function RoomList() {
  const { rooms, isLoading, fetchRooms } = useRoomStore()

  useEffect(() => {
    fetchRooms()
  }, [])

  if (isLoading) return <div>加载中...</div>

  return (
    <ul>
      {rooms.map(room => (
        <li key={room.id}>{room.name}</li>
      ))}
    </ul>
  )
}
```

### 4.3 API Client 架构

统一的 API 请求封装：

```typescript
// lib/api/client.ts
interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
  timestamp: number
}

class ApiClient {
  private baseUrl: string

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`)
    return response.json()
  }
}

export const apiClient = new ApiClient()
```

**使用示例**:

```typescript
import { apiClient } from '@/lib/api/client'

const { data } = await apiClient.get<Room[]>('/rooms')
```

### 4.4 shadcn/ui 组件使用

所有 UI 组件来自 shadcn/ui：

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>标题</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="请输入..." />
        <Button>提交</Button>
      </CardContent>
    </Card>
  )
}
```

### 4.5 表单处理

使用 react-hook-form + zod：

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, "姓名至少2个字符"),
  phone: z.regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
})

type FormData = z.infer<typeof formSchema>

function EmployeeForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("name")} />
      <Button type="submit">提交</Button>
    </form>
  )
}
```

---

## 5. 第一个功能开发

让我们通过一个实际例子来了解开发流程。

### 场景：添加"公告列表"页面

#### Step 1: 创建页面文件

创建 `app/announcements/page.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Announcement {
  id: string
  title: string
  content: string
  createdAt: string
  isActive: boolean
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: 从 API 获取数据
    setLoading(false)
  }, [])

  if (loading) return <div>加载中...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">公告管理</h1>
        <Button>发布公告</Button>
      </div>

      <div className="grid gap-4">
        {announcements.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>{item.title}</CardTitle>
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? '已发布' : '草稿'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p>{item.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                发布时间：{new Date(item.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

#### Step 2: 创建类型定义

在 `lib/api/types.ts` 中添加：

```typescript
export interface Announcement {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  authorId: string
}
```

#### Step 3: 创建 API 服务

在 `lib/api/services/` 下创建 `announcementService.ts`:

```typescript
import { apiClient } from '../client'
import type { Announcement } from '../types'

export const announcementService = {
  getAll: async (): Promise<Announcement[]> => {
    const res = await apiClient.get<Announcement[]>('/announcements')
    return res.data || []
  },

  create: async (data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> => {
    const res = await apiClient.post<Announcement>('/announcements', data)
    return res.data!
  },
}
```

#### Step 4: 更新页面使用真实数据

修改 `app/announcements/page.tsx`:

```tsx
import { useEffect } from 'react'
import { announcementService } from '@/lib/api/services/announcementService'
// ... 其他 import

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await announcementService.getAll()
        setAnnouncements(data)
      } catch (error) {
        console.error('获取公告失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ... 其余代码不变
}
```

#### Step 5: 添加导航链接

在侧边栏导航中添加入口（如果需要）。

完成！你现在可以访问 `http://localhost:3000/announcements` 查看新页面。

---

## 6. 常用命令

### 6.1 开发命令

```bash
# 启动开发服务器（热重载）
pnpm dev

# 构建生产版本
pnpm run build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 类型检查
npx tsc --noEmit
```

### 6.2 测试命令

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test useAuthStore.test.ts

# 测试覆盖率
pnpm test --coverage

# 监听模式
pnpm test --watch
```

### 6.3 代码质量

```bash
# ESLint 检查
pnpm lint

# 格式化代码
npx prettier --write .

# TypeScript 检查
npx tsc --noEmit
```

### 6.4 Git 工作流

```bash
# 创建功能分支
git checkout -b feature/announcement-list

# 提交代码
git add .
git commit -m("feat: 添加公告列表页面")

# 推送到远程
git push origin feature/announcement-list

# 创建 PR（在 GitHub 上操作）
```

---

## 7. 开发规范

### 7.1 代码风格

#### TypeScript 规范

```typescript
// ✅ 推荐：使用 interface 定义对象类型
interface User {
  id: string
  name: string
}

// ❌ 避免：使用 type alias 定义对象（除非需要联合类型）
type User = {
  id: string
  name: string
}

// ✅ 推荐：使用 const 断言
const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
} as const

// ✅ 推荐：使用 satisfies 运行时验证
const mockData = [
  { id: '1', name: 'Test' },
] satisfies User[]
```

#### React 组件规范

```tsx
// ✅ 推荐：函数式组件 + Hooks
function MyComponent({ title }: { title: string }) {
  const [count, setCount] = useState(0)

  return <div>{title}: {count}</div>
}

// ❌ 避免：类组件（除非必要）

// ✅ 推荐：解构 props
function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}

// ✅ 推荐：使用早返回模式
function LoadingWrapper({ loading, children }: Props) {
  if (loading) return <Spinner />
  if (error) return <ErrorDisplay error={error} />

  return <>{children}</>
}
```

#### 样式规范

```tsx
// ✅ 推荐：使用 Tailwind CSS 类名
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">

// ✅ 推荐：使用 cn() 工具合并类名
import { cn } from "@/lib/utils"
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>

// ❌ 避免：内联 style（除非动态值）
<div style={{ color: 'red' }}>

// ❌ 避免：自定义 CSS 文件（优先使用 Tailwind）
```

### 7.2 Git Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>
```

**Type 列表**:

| Type | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | `feat(announcement): 添加公告列表页面` |
| fix | Bug 修复 | `fix(login): 修复登录表单验证错误` |
| docs | 文档更新 | `docs(readme): 更新安装步骤` |
| style | 代码格式 | `style(button): 统一按钮样式` |
| refactor | 重构 | `refactor(store): 重构订单状态管理` |
| test | 测试相关 | `test(auth): 添加登录单元测试` |
| chore | 构建/工具 | `chore(deps): 升级依赖版本` |

### 7.3 文件组织规范

```
components/
├── ui/                    # 基础 UI 组件（shadcn/ui）
│   ├── button.tsx
│   └── button.tsx        # 组件 + 样式在同一文件
├── feature-name/          # 功能模块组件
│   ├── FeatureName.tsx    # 主组件
│   ├── FeatureNameItem.tsx # 子组件
│   ├── types.ts          # 类型定义
│   └── index.ts          # 导出入口
└── hooks/                # 自定义 Hooks（如需要）
    └── useFeatureName.ts
```

### 7.4 性能优化最佳实践

```tsx
// ✅ 推荐：使用 dynamic import 懒加载重组件
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})

// ✅ 推荐：使用 useMemo 缓存计算结果
const sortedData = useMemo(
  () => [...data].sort((a, b) => a.name.localeCompare(b.name)),
  [data]
)

// ✅ 推荐：使用 useCallback 缓存回调函数
const handleClick = useCallback((id: string) => {
  setSelectedId(id)
}, [])

// ❌ 避免：在 render 中创建新对象/数组
<div style={{ padding: 10 }}>  {/* 每次渲染都创建新对象 */}
```

---

## 8. 常见问题

### Q1: 如何添加新的 shadcn/ui 组件？

```bash
# 使用 CLI 添加组件
pnpm dlx shadcn@latest add component-name

# 例如添加 Table 组件
pnpm dlx shadcn@latest add table
```

### Q2: 如何调试 Zustand Store？

安装 Redux DevTools 扩展（支持 Zustand）：

```typescript
import { devtools } from 'zustand/middleware'

export const useStore = create<State>()(
  devtools(
    (set) => ({ ... }),
    { name: 'my-store' }  // 在 DevTools 中显示的名称
  )
)
```

### Q3: Mock 数据如何切换到真实 API？

项目已实现自动降级机制：

```typescript
// lib/api/client.ts 会自动尝试真实 API
// 如果失败则回退到 Mock 数据
// 只需配置 NEXT_PUBLIC_API_BASE_URL 即可切换
```

### Q4: 如何处理错误边界？

```tsx
import { ErrorBoundary } from '@/components/error-boundary'

<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

### Q5: 如何添加单元测试？

```typescript
// __tests__/stores/useMyStore.test.ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMyStore } from '@/lib/stores/useMyStore'

describe('useMyStore', () => {
  it('should update state correctly', () => {
    const { result } = renderHook(() => useMyStore())

    act(() => {
      result.current.updateValue('new value')
    })

    expect(result.current.value).toBe('new value')
  })
})
```

### Q6: 如何优化首屏加载速度？

1. ✅ 已实现：动态导入重组件
2. ✅ 已实现：Stale-Time 缓存
3. 可进一步优化：
   - 图片使用 WebP/AVIF 格式
   - 启用 ISR (Incremental Static Regeneration)
   - 使用 next/image 自动优化

### Q7: 如何配置暗色主题？

项目已内置暗色主题支持：

```tsx
// 在 layout.tsx 中已集成 ThemeProvider
// 用户可通过设置页面切换主题
```

自定义主题颜色（Tailwind 配置）：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // 自定义主色调
        }
      }
    }
  }
}
```

---

## 9. 学习路径

### 9.1 新人入门路线图（建议按顺序学习）

```
第 1 天: 环境搭建 & 项目运行
  ↓
第 2 天: 理解项目结构 & 路由系统
  ↓
第 3 天: 学习状态管理 (Zustand)
  ↓
第 4 天: 掌握组件库使用 (shadcn/ui)
  ↓
第 5 天: 了解 API 层 & 数据流
  ↓
第 6 天: 完成第一个功能开发
  ↓
第 7 天: 学习测试编写 & 代码审查
```

### 9.2 推荐学习资源

#### 必读文档（本项目）

1. **[快速入门指南]** ← 你正在阅读的文档
2. **[架构设计文档](./architecture.md)** - 理解整体架构
3. **[API 接口文档](./api-reference.md)** - 掌握 API 设计
4. **[组件库文档](./components.md)** - 学会使用组件
5. **[部署指南](./deployment-guide.md)** - 了解部署流程

#### 外部资源

| 主题 | 资源 | 链接 |
|------|------|------|
| Next.js | 官方文档 | <https://nextjs.org/docs> |
| React | 官方文档 | <https://react.dev> |
| TypeScript | 手册 | <https://www.typescriptlang.org/docs> |
| Tailwind CSS | 文档 | <https://tailwindcss.com/docs> |
| Zustand | GitHub | <https://github.com/pmndrs/zustand> |
| shadcn/ui | 组件库 | <https://ui.shadcn.com> |

### 9.3 进阶方向

掌握基础后，可以选择以下方向深入：

1. **性能优化专家**
   - 学习 Web Vitals 优化
   - 掌握 React Profiler
   - 研究 Bundle 分析

2. **全栈开发工程师**
   - 学习 Next.js Server Actions
   - 掌握数据库集成 (Prisma/Drizzle)
   - 了解认证授权 (NextAuth.js)

3. **测试工程师**
   - 深入 Vitest 高级用法
   - 学习 E2E 测试 (Playwright)
   - 掌握 TDD 开发模式

4. **DevOps 工程师**
   - 掌握 Docker 容器化
   - 学习 CI/CD 流水线
   - 了解 Kubernetes 编排

---

## 🎯 快速参考卡片

### 常用 Import 速查

```typescript
// 组件
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Hooks
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useRoomStore } from '@/lib/stores/useRoomStore'

// 工具
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// API
import { apiClient } from '@/lib/api/client'
import { roomService } from '@/lib/api/services/roomService'
```

### 常用代码片段

```tsx
// 加载状态
if (loading) return <Loader />

// 空状态
if (!data?.length) return <EmptyState message="暂无数据" />

// 错误状态
if (error) return <ErrorDisplay error={error} onRetry={() => refetch()} />

// 列表渲染
<ul>
  {items.map(item => (
    <ListItem key={item.id} item={item} />
  ))}
</ul>
```

---

## 📞 获取帮助

如果你在使用过程中遇到问题：

1. **查阅文档**: 首先查看本文档和其他四件套文档
2. **搜索 Issue**: 在 GitHub Issues 中搜索类似问题
3. **提问指南**: 创建新 Issue 时请提供：
   - 问题描述
   - 重现步骤
   - 期望行为 vs 实际行为
   - 截图/日志
4. **社区交流**: 参与技术讨论

---

## ✅ 入门检查清单

完成以下任务，恭喜你正式上手 YYC3 项目！

- [ ] 成功克隆并运行项目 (`pnpm dev`)
- [ ] 理解项目目录结构
- [ ] 能够创建新页面并访问
- [ ] 掌握 Zustand Store 的基本使用
- [ ] 能够使用 shadcn/ui 组件
- [ ] 理解 API Client 的工作方式
- [ ] 成功编写并通过一个单元测试
- [ ] 阅读完其他四件套文档

---

> **祝你开发愉快！** 🎉  
> 如有建议欢迎反馈，共同完善 YYC3 智慧商家管理系统！
