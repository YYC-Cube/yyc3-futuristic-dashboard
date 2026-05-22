# YYC3 智慧商家管理系统 — 开发规范文档

> 版本：v1.3.0  
> 更新日期：2026-05-22  
> 适用范围：全体前端开发者  
> 变更：新增认证规范、路由守卫规范、AI API Route 规范

---

## 1. 环境准备

### 1.1 必备工具

| 工具 | 最低版本 | 说明 |
|------|---------|------|
| Node.js | 18.x+ | JavaScript 运行时 |
| pnpm | 8.x+ | 包管理器 |
| VS Code | latest | 推荐 IDE |
| Git | 2.x+ | 版本控制 |

### 1.2 推荐 VS Code 插件

- ESLint
- Tailwind CSS IntelliSense
- TypeScript Import Sorter
- Prettier - Code formatter
- Error Lens

### 1.3 项目启动

```bash
# 克隆项目
git clone <repository-url>
cd yyc3-futuristic-dashboard

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务
pnpm start

# 代码检查
pnpm lint
```

### 1.4 环境变量

创建 `.env.local` 文件：

```env
# API 基础地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# WebSocket 地址
NEXT_PUBLIC_WS_URL=ws://localhost:8080/api/ws

# 环境
NEXT_PUBLIC_ENV=development
```

---

## 2. Git 工作流

### 2.1 分支策略

```
main                # 生产分支（保护）
├── develop         # 开发主分支
├── feature/xxx     # 功能分支
├── fix/xxx         # 修复分支
├── refactor/xxx    # 重构分支
└── release/x.x.x  # 发布分支
```

### 2.2 提交规范（Conventional Commits）

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 列表：**

| Type | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | `feat(pos): 添加购物车数量修改功能` |
| fix | 修复 Bug | `fix(room): 修复包厢状态不同步问题` |
| docs | 文档变更 | `docs: 更新 API 接口文档` |
| style | 样式调整 | `style(room): 调整包厢卡片间距` |
| refactor | 重构 | `refactor(api): 抽取 Service 层` |
| perf | 性能优化 | `perf(list): 实现虚拟滚动` |
| test | 测试 | `test(store): 添加 RoomStore 单元测试` |
| chore | 构建/工具 | `chore: 升级 Next.js 到 15.2.4` |

**Scope 列表：**

| Scope | 说明 |
|-------|------|
| pos | 点单收银模块 |
| room | 包厢管理模块 |
| order | 订单管理模块 |
| product | 商品管理模块 |
| member | 会员管理模块 |
| employee | 员工管理模块 |
| inventory | 库存管理模块 |
| report | 报表模块 |
| auth | 认证模块 |
| api | API 层 |
| store | 状态管理 |
| ui | UI 组件 |
| nav | 导航系统 |
| layout | 布局系统 |

### 2.3 Pull Request 流程

1. 从 `develop` 创建功能分支
2. 开发完成后提交 PR 到 `develop`
3. 至少 1 人 Code Review 通过
4. CI 检查通过（Lint + TypeCheck + Test）
5. Squash Merge 到 `develop`

---

## 3. 代码规范

### 3.1 TypeScript 规范

#### 3.1.1 禁止使用 any

```typescript
// ❌ 错误
const handleAction = (data: any) => { ... }
const room: any = rooms[0]

// ✅ 正确
interface ActionData {
  type: string
  payload: Record<string, unknown>
}
const handleAction = (data: ActionData) => { ... }
const room: Room = rooms[0]
```

#### 3.1.2 使用精确类型

```typescript
// ❌ 错误
type Status = string

// ✅ 正确
type RoomStatus = "available" | "occupied" | "cleaning" | "maintenance" | "reserved" | "checkout"
```

#### 3.1.3 泛型约束

```typescript
// ❌ 错误
function getFirstItem(items: any[]): any { ... }

// ✅ 正确
function getFirstItem<T>(items: T[]): T | undefined { ... }
```

#### 3.1.4 回调函数类型

```typescript
// ❌ 错误
onAction: (action: string) => void
// 使用 any 参数
onAction: (action: any) => void

// ✅ 正确
type RoomAction = "start" | "checkout" | "clean" | "order" | "pause"
onAction: (action: RoomAction) => void
```

### 3.2 React 组件规范

#### 3.2.1 组件结构顺序

```tsx
// 1. "use client" 指令（仅客户端组件）
"use client"

// 2. 类型导入
import type { ReactNode } from "react"

// 3. 外部库导入
import { useState } from "react"
import { Button } from "@/components/ui/button"

// 4. 内部模块导入
import { cn } from "@/lib/utils"
import { useRoomStore } from "@/lib/stores/useRoomStore"

// 5. 类型定义
interface MyComponentProps {
  children: ReactNode
  className?: string
}

// 6. 组件实现
export default function MyComponent({ children, className }: MyComponentProps) {
  // Hooks
  const [state, setState] = useState(false)
  const store = useRoomStore()

  // 事件处理函数
  const handleClick = () => { ... }

  // 渲染
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  )
}
```

#### 3.2.2 命名规范

```typescript
// 组件：PascalCase
export default function RoomStatusDashboard() { ... }

// Props 接口：组件名 + Props
interface RoomStatusDashboardProps { ... }

// 事件处理函数：handle + 动作
const handleClick = () => { ... }
const handleRoomClick = (room: Room) => { ... }

// 回调 Props：on + 动作
onClose?: () => void
onRoomClick?: (room: Room) => void

// 布尔状态：is/has/can + 描述
const [isLoading, setIsLoading] = useState(false)
const [hasError, setHasError] = useState(false)

// 数据状态：名词
const [rooms, setRooms] = useState<Room[]>([])
const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
```

#### 3.2.3 性能优化

```tsx
// 使用 React.memo 避免不必要渲染
const RoomCard = React.memo(function RoomCard({ room, onClick }: RoomCardProps) {
  return <Card onClick={() => onClick(room)}>...</Card>
})

// 使用 useMemo 缓存计算结果
const filteredRooms = useMemo(
  () => rooms.filter(room => room.status === selectedStatus),
  [rooms, selectedStatus]
)

// 使用 useCallback 缓存回调
const handleRoomClick = useCallback((room: Room) => {
  setSelectedRoom(room)
}, [])

// 大列表使用 VirtualScroll
<VirtualScroll
  items={rooms}
  itemHeight={80}
  containerHeight={600}
  renderItem={(room) => <RoomCard key={room.id} room={room} />}
/>
```

### 3.3 样式规范

#### 3.3.1 Tailwind CSS 使用

```tsx
// 使用 cn() 合并条件样式
import { cn } from "@/lib/utils"

<div className={cn(
  "rounded-lg p-4 transition-colors",
  isActive && "bg-cyan-500 text-white",
  isDisabled && "opacity-50 cursor-not-allowed",
  className
)} />
```

#### 3.3.2 暗色主题色板

```
背景层级：
  bg-slate-900     # 最深背景（页面底色）
  bg-slate-800     # 卡片/面板背景
  bg-slate-800/50  # 半透明背景
  bg-slate-700     # 悬浮/激活状态

文字层级：
  text-white       # 主要文字
  text-slate-100   # 次要文字
  text-slate-300   # 辅助文字
  text-slate-400   # 次要辅助
  text-slate-500   # 最淡文字

边框层级：
  border-slate-700/50  # 主要边框
  border-slate-600     # 强调边框

功能色：
  text-cyan-400 / bg-cyan-500     # 品牌色/主操作
  text-green-400 / bg-green-500   # 成功/空闲
  text-orange-400 / bg-orange-500 # 警告/消费中
  text-red-400 / bg-red-500       # 危险/紧急
  text-blue-400 / bg-blue-500     # 信息/清洁中
  text-purple-400 / bg-purple-500 # 特殊/VIP
```

### 3.4 状态管理规范

#### 3.4.1 Store 结构模板

```typescript
import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface XxxStore {
  // 状态
  items: Xxx[]
  selectedItem: Xxx | null
  loading: boolean
  error: string | null

  // Actions
  fetchItems: () => Promise<void>
  createItem: (data: CreateXxxDto) => Promise<void>
  updateItem: (id: string, data: UpdateXxxDto) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  setSelectedItem: (item: Xxx | null) => void

  // Computed
  getItemsByStatus: (status: string) => Xxx[]
  getStats: () => XxxStats
}

export const useXxxStore = create<XxxStore>()(
  devtools(
    (set, get) => ({
      items: [],
      selectedItem: null,
      loading: false,
      error: null,

      fetchItems: async () => {
        set({ loading: true, error: null })
        try {
          const response = await xxxService.getItems()
          if (response.code === 200) {
            set({ items: response.data, loading: false })
          } else {
            set({ error: response.message, loading: false })
          }
        } catch (error) {
          set({ error: "获取数据失败", loading: false })
        }
      },

      // ... 其他方法
    }),
    { name: "XxxStore" }
  )
)
```

### 3.5 API 调用规范

```typescript
// ❌ 错误：直接在组件中调用 fetch
const response = await fetch("/api/rooms")

// ✅ 正确：通过 API Client 调用
const response = await apiClient.getRooms()

// ❌ 错误：忽略错误处理
const rooms = await apiClient.getRooms()

// ✅ 正确：完整错误处理
try {
  const response = await apiClient.getRooms()
  if (response.code === 200) {
    setRooms(response.data)
  } else {
    toast({ title: "获取失败", description: response.message, variant: "destructive" })
  }
} catch (error) {
  toast({ title: "网络错误", description: "请检查网络连接", variant: "destructive" })
}
```

---

## 4. 测试规范

### 4.1 测试分层

```
E2E Tests (Playwright)          # 关键业务流程
  └── Integration Tests          # 组件 + Store + API 集成
      └── Unit Tests (Vitest)    # 函数 / Store / Service 单元测试
```

### 4.2 测试命名

```typescript
describe("useRoomStore", () => {
  describe("fetchRooms", () => {
    it("should fetch rooms successfully", async () => { ... })
    it("should handle network error", async () => { ... })
    it("should set loading state during fetch", async () => { ... })
  })
})
```

### 4.3 测试覆盖率要求

| 模块 | 最低覆盖率 |
|------|-----------|
| Store | 80% |
| Service | 80% |
| API Client | 70% |
| 组件 | 50% |
| 工具函数 | 90% |

---

## 5. Code Review 清单

### 5.1 必查项

- [ ] 无 `any` 类型
- [ ] 无 `console.log/warn/error`
- [ ] 无硬编码数据（应使用 Mock 或 API）
- [ ] 所有 Props 有类型定义
- [ ] 错误处理完整（try/catch + 用户提示）
- [ ] Loading 状态处理
- [ ] 组件支持 `className` 覆盖

### 5.2 性能检查

- [ ] 无不必要的重渲染（React.memo / useMemo / useCallback）
- [ ] 大列表使用虚拟滚动
- [ ] 图片使用 Next.js Image 组件
- [ ] 动态导入（dynamic import）非首屏组件

### 5.3 安全检查

- [ ] 无敏感信息硬编码
- [ ] 用户输入经过验证（zod schema）
- [ ] 无 XSS 风险（避免 dangerouslySetInnerHTML）
- [ ] API 调用携带认证 Token

---

## 6. Phase 2 新增规范

### 6.1 Store 开发规范

**必须遵循：**
- 使用 `devtools` 中间件，name 为 PascalCase（如 `{ name: "RoomStore" }`）
- 添加 `lastFetched: number | null` 字段 + `STALE_TIME = 30_000` 防重复请求
- 添加 `clearError()` 方法统一错误清除
- 乐观更新模式：先 set 乐观数据 → 请求成功确认 → 失败回滚
- `fetchXxx()` 开头检查 `if (loading) return` 和 `if (lastFetched && now - lastFetched < STALE_TIME) return`
- 写操作成功后 `set({ lastFetched: null })` 使缓存失效

### 6.2 路由页面规范

**新增模块页面必须：**
1. 在 `app/xxx/page.tsx` 创建路由文件
2. 使用 `"use client"` 指令
3. 用 `ErrorBoundary` 包裹主组件
4. 用 `PageLoader` 处理 loading 状态
5. 在首页 `navCards` 数组中添加导航卡片

**模板：**
```tsx
"use client"
import BusinessComponent from "@/components/xxx/business-component"
import { ErrorBoundary } from "@/components/common/error-boundary"
import PageLoader from "@/components/common/page-loader"

export default function XxxPage() {
  return (
    <ErrorBoundary>
      <BusinessComponent />
    </ErrorBoundary>
  )
}
```

### 6.3 Mock 数据规范

- 使用 `satisfies Type` 而非 `as Type`
- Mock 数据字段必须完全匹配 types.ts 定义
- API 响应格式统一为 `{ code: 200, message, data, timestamp }`
- 所有 Mock 数据放在 `lib/api/client.ts` 的 `mockData` 对象中

### 6.4 Code Review 清单（Phase 2 更新）

在原有清单基础上新增：
- [ ] Store 使用 devtools 中间件
- [ ] Store 有 lastFetched + STALE_TIME
- [ ] 写操作使 lastFetched 失效
- [ ] 路由页面有 ErrorBoundary 包裹
- [ ] 新路由已在首页 navCards 注册
- [ ] Mock 数据使用 satisfies 而非 as
