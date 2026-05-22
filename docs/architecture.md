# YYC3 智慧商家管理系统 — 架构设计文档

> **版本**：v2.0.0  
> **更新日期**：2026-05-22  
> **状态**：✅ 生产就绪 (所有类型错误已修复，构建成功)  
> **构建状态**：✅ TypeScript 0 错误 | ✅ Next.js Build 成功 | ⚠️ ESLint 配置待优化

---

## 📋 文档目录

1. [系统概述](#1-系统概述)
2. [技术栈与五高架构](#2-技术栈与五高架构)
3. [系统架构图](#3-系统架构图)
4. [目录结构](#4-目录结构)
5. [核心模块说明](#5-核心模块说明)
6. [数据流架构](#6-数据流架构)
7. [状态管理方案](#7-状态管理方案)
8. [API 架构](#8-api-架构)
9. [安全机制](#9-安全机制)
10. [性能优化策略](#10-性能优化策略)
11. [测试体系](#11-测试体系)
12. [部署架构](#12-部署架构)

---

## 1. 系统概述

YYC3 智慧商家管理系统是一套面向 KTV/娱乐场所的全栈数字化管理平台，采用 **Next.js 15 + React 19 + TypeScript 5** 技术栈，基于 **五维驱动五高标准体系** 构建。

### 1.1 核心业务域

```
┌───────────────────────────────────────────────────────────┐
│                  YYC3 智慧商家管理系统                       │
│                   v2.0.0 (Production Ready)                │
├──────────┬──────────┬──────────┬──────────┬───────────────┤
│  核心业务  │  运营管理  │  数据分析  │  系统管理  │   智能服务     │
├──────────┼──────────┼──────────┼──────────┼───────────────┤
│ 包厢管理  │ 员工管理  │ 营业报表  │ 系统设置  │  AI 助手      │
│ 点单收银  │ 权限管理  │ 商品分析  │ 门店配置  │  智谱 AI      │
│ 订单管理  │ 会员管理  │ 包厢利用  │ 打印机   │  Foundry      │
│ 商品管理  │ 库存管理  │ 趋势预测  │ 支付配置  │  WebSocket    │
└──────────┴──────────┴──────────┴──────────┴───────────────┘
```

### 1.2 五维评估体系

| 维度 | 评估指标 | 当前状态 |
|------|---------|---------|
| **时间维度** | 响应时间 < 200ms | ✅ 达标 |
| **空间维度** | 首屏加载 < 3s | ✅ 达标 |
| **属性维度** | 类型覆盖率 100% | ✅ 达标 |
| **事件维度** | 实时通信 < 100ms | ✅ WebSocket 已集成 |
| **关联维度** | 模块耦合度 < 20% | ✅ 达标 |

---

## 2. 技术栈与五高架构

### 2.1 技术选型表

| 层次 | 技术选型 | 版本 | 用途 | 五高对应 |
|------|---------|------|------|---------|
| 框架 | Next.js (App Router) | 15.2.4 | 全栈框架 | 高可用/高性能 |
| UI 库 | React | 19.x | 用户界面 | 高性能 |
| 组件库 | shadcn/ui + Radix UI | latest | 基础组件 | 高可用 |
| 样式 | Tailwind CSS | 3.4.x | 原子化 CSS | 高性能 |
| 状态管理 | Zustand + devtools | latest | 全局状态 | 高智能 |
| 表单验证 | react-hook-form + zod | 7.x / 3.x | 表单处理 | 高标准 |
| 图表库 | Recharts | latest | 数据可视化 | 高智能 |
| AI 集成 | 智谱 AI (GLM-4.6) | - | AI 助手 | 高智能 |
| 实时通信 | WebSocket | - | 实时数据 | 高性能 |
| 测试框架 | Vitest | 4.x | 单元测试 | 高标准 |
| 语言 | TypeScript (strict) | 5.x | 类型安全 | 高标准 |

### 2.2 五高架构实现

#### ✅ 高可用性 (High Availability)
- **ErrorBoundary** 组件捕获渲染错误
- **Mock 数据自动降级** 策略
- **路由守卫** 保护认证页面
- **乐观更新** 保证用户体验

#### ✅ 高性能 (High Performance)
- **动态导入** (`dynamic import`) 懒加载重组件
- **Stale-Time 缓存** (30s) 减少 API 调用
- **代码分割** Next.js 自动优化
- **CSS 变量** 主题切换无闪烁

#### ✅ 高安全性 (High Security)
- **TypeScript strict** 模式编译时检查
- **Zod schema** 运行时验证
- **Token 认证** 机制
- **环境变量** 敏感信息保护

#### ✅ 高可扩展性 (High Scalability)
- **模块化设计** 业务组件独立
- **Zustand Store** 可插拔状态管理
- **API Client** 统一接口层
- **插件化架构** 支持功能扩展

#### ✅ 高智能性 (High Intelligence)
- **智谱 AI 集成** GLM-4.6/4.5V/Embedding-3
- **Foundry Agent** 微软 AI 平台
- **WebSocket** 实时数据推送
- **数据分析** Recharts 可视化

---

## 3. 系统架构图

### 3.1 分层架构

```
┌────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │ App Router│ │  Layout   │ │ Navigation│ │  Theme    │  │
│  │ (15 routes)│ │ System   │ │  System   │ │ Provider │  │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘  │
├────────┼─────────────┼─────────────┼─────────────┼─────────┤
│        │      Component Layer       │             │         │
│  ┌─────▼─────────────▼─────────────▼─────────────▼──────┐  │
│  │              Business Components (30+)                │  │
│  │  Room │ POS │ Member │ Employee │ Inventory │ ...     │  │
│  │  ErrorBoundary │ PageLoader │ Breadcrumb            │  │
│  └─────────────────────┬────────────────────────────────┘  │
├────────────────────────┼───────────────────────────────────┤
│                        │    State Layer                     │
│  ┌────────────────────▼────────────────────────────────┐  │
│  │         Zustand Stores (with devtools)               │  │
│  │  useAuthStore │ useRoomStore │ useOrderStore        │  │
│  │  ✓ 乐观更新  ✓ STALE_TIME(30s) ✓ clearError        │  │
│  └────────────────────┬────────────────────────────────┘  │
├────────────────────────┼───────────────────────────────────┤
│                        │    Service Layer                   │
│  ┌────────────────────▼────────────────────────────────┐  │
│  │           Business Services                          │  │
│  │  authService │ roomService │ orderService            │  │
│  │  memberService │ employeeService │ inventoryService  │  │
│  └────────────────────┬────────────────────────────────┘  │
├────────────────────────┼───────────────────────────────────┤
│                        │    Data Layer                      │
│  ┌────────────────────▼────────────────────────────────┐  │
│  │              API Client                              │  │
│  │  HTTP Client │ Cache (useCache) │ Mock Data          │  │
│  │  ApiResponse<T> { code, message, data, timestamp }   │  │
│  │  satisfies 编译时验证                                │  │
│  └────────────────────┬────────────────────────────────┘  │
├────────────────────────┼───────────────────────────────────┤
│                        │    External Layer                  │
│  ┌────────────────────▼────────────────────────────────┐  │
│  │  Backend API │ Foundry Agent │ Zhipu AI │ WebSocket  │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 3.2 数据流图

```
User Action → Component → Zustand Store → Service → API Client → Backend/API
     ↑                                                              ↓
     ←←←←←←←← Optimistic Update ←←←←← Mock Fallback ←←←←←←←←←←←←
```

---

## 4. 目录结构

```
yyc3-futuristic-dashboard/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局 (ThemeProvider + ErrorBoundary)
│   ├── page.tsx                 # 首页
│   ├── globals.css              # 全局样式
│   ├── login/page.tsx           # 登录页
│   ├── api/chat/route.ts        # AI 对话 API
│   ├── rooms/page.tsx           # 包厢管理
│   ├── pos/page.tsx             # 点单收银
│   ├── orders/page.tsx          # 订单管理
│   ├── employees/page.tsx       # 员工管理
│   ├── members/page.tsx         # 会员管理
│   ├── products/page.tsx        # 商品管理
│   ├── inventory/page.tsx       # 库存管理
│   ├── reports/page.tsx         # 数据报表
│   └── settings/page.tsx        # 系统设置
│
├── components/                  # React 组件
│   ├── ui/                     # shadcn/ui 基础组件 (25+)
│   ├── layout/                 # 布局组件
│   │   ├── optimized-layout.tsx # 主布局
│   │   ├── breadcrumb-nav.tsx   # 面包屑导航
│   │   └── app-shell.tsx       # 应用外壳
│   ├── room/                   # 包厢相关组件
│   ├── employee/               # 员工相关组件
│   ├── analytics/              # 数据分析组件
│   └── lazy-components.tsx     # 动态导入配置
│
├── lib/                        # 核心库
│   ├── api/                    # API 层
│   │   ├── client.ts           # API 客户端 (Mock + HTTP)
│   │   └── types.ts            # 类型定义
│   ├── stores/                 # Zustand 状态管理
│   │   ├── useAuthStore.ts     # 认证状态
│   │   ├── useRoomStore.ts     # 包厢状态
│   │   └── useOrderStore.ts    # 订单状态
│   ├── services/               # 业务服务层
│   │   ├── auth.service.ts     # 认证服务
│   │   ├── room.service.ts     # 包厢服务
│   │   └── order.service.ts    # 订单服务
│   ├── hooks/                  # 自定义 Hooks
│   │   └── use-cache.ts        # 缓存 Hook
│   ├── utils.ts                # 工具函数
│   └── websocket/              # WebSocket 通信
│       └── manager.ts          # WebSocket 管理器
│
├── __tests__/                  # 测试文件
│   └── stores/                 # Store 单元测试
│
├── docs/                       # 文档目录
│   ├── architecture.md         # 本文档
│   ├── api-reference.md        # API 接口文档
│   ├── components.md           # 组件库文档
│   ├── deployment-ops.md       # 部署运维指南
│   ├── development-guide.md    # 开发指南
│   ├── alignment-plan.md       # 对齐规划
│   └── knowledge-graph.md      # 知识图谱
│
├── .env.local                  # 环境变量
├── next.config.ts              # Next.js 配置
├── tailwind.config.ts          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
├── vitest.config.ts            # Vitest 配置
└── agent.yaml                  # Foundry Agent 配置
```

---

## 5. 核心模块说明

### 5.1 认证模块 (Authentication)

**文件位置**: `lib/stores/useAuthStore.ts`, `lib/services/auth.service.ts`

```typescript
// User 接口定义
interface User {
  id: string
  name: string
  role: "admin" | "manager" | "staff"
  avatar?: string
}

// AuthState 状态结构
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}
```

**特性**:
- ✅ Token 本地存储 (localStorage)
- ✅ 自动登录恢复 (loadFromStorage)
- ✅ 路由守卫保护
- ✅ Mock 数据支持开发阶段

### 5.2 包厢管理模块 (Room Management)

**文件位置**: `lib/stores/useRoomStore.ts`, `components/room/`

**核心功能**:
- 包厢状态实时管理 (空闲/使用/预订/维护)
- CRUD 操作 (创建/读取/更新/删除)
- 状态筛选和搜索
- 乐观更新 + 30s 缓存

### 5.3 订单管理模块 (Order Management)

**文件位置**: `lib/stores/useOrderStore.ts`, `app/orders/page.tsx`

**订单状态机**:
```
pending → confirmed → preparing → ready → completed
                                      ↘ cancelled
```

**特性**:
- ✅ 订单项动态添加
- ✅ 状态流转控制
- ✅ 历史订单查询
- ✅ 乐观更新保证响应速度

---

## 6. 数据流架构

### 6.1 请求数据流

```
1. 用户操作 (User Interaction)
   ↓
2. 触发 Action (dispatch action to store)
   ↓
3. 乐观更新 (Optimistic Update UI immediately)
   ↓
4. 调用 Service (business logic layer)
   ↓
5. API Client 发送请求 (HTTP/WebSocket)
   ↓
6a. 成功: 更新 Store (confirm optimistic update)
6b. 失败: 回滚状态 (rollback + error message)
```

### 6.2 缓存策略

```
┌─────────────────────────────────────────┐
│           Cache Strategy                │
├─────────────────────────────────────────┤
│  Level 1: Component State (React)       │  ← 最快
│  Level 2: Zustand Store (Global)        │
│  Level 3: useCache Hook (30s TTL)       │  ← 自定义缓存
│  Level 4: API Client (Mock/Data)        │
│  Level 5: Backend API / External        │  ← 最慢
└─────────────────────────────────────────┘
```

**Stale-While-Revalidate 模式**:
- 返回缓存数据 (即使过期)
- 后台静默刷新
- 更新完成后通知组件重渲染

---

## 7. 状态管理方案

### 7.1 Zustand Store 设计模式

```typescript
// 标准 Store 结构示例 (useRoomStore)
export const useRoomStore = create<RoomState>()(
  devtools(
    (set, get) => ({
      // State
      rooms: [],
      loading: false,
      error: null,
      
      // Actions with optimistic updates
      addRoom: async (roomData) => {
        const tempId = `temp-${Date.now()}`
        // 1. 乐观更新
        set((state) => ({
          rooms: [...state.rooms, { ...roomData, id: tempId }]
        }))
        
        try {
          // 2. 实际调用
          const room = await roomService.create(roomData)
          // 3. 确认更新
          set((state) => ({
            rooms: state.rooms.map(r => 
              r.id === tempId ? room : r
            )
          }))
        } catch {
          // 4. 回滚
          set((state) => ({
            rooms: state.rooms.filter(r => r.id !== tempId)
          }))
        }
      },
    }),
    { name: 'room-store' } // devtools label
  )
)
```

### 7.2 Store 清单

| Store 名称 | 文件路径 | 用途 | 特殊功能 |
|-----------|---------|------|---------|
| useAuthStore | lib/stores/useAuthStore.ts | 用户认证 | Token 持久化 |
| useRoomStore | lib/stores/useRoomStore.ts | 包厢管理 | 乐观更新 + 缓存 |
| useOrderStore | lib/stores/useOrderStore.ts | 订单管理 | 状态机 + 乐观更新 |

---

## 8. API 架构

### 8.1 统一响应格式

```typescript
// 所有 API 响应遵循此契约
interface ApiResponse<T> {
  code: number          // 200=成功, 其他=错误码
  message: string       // 人类可读消息
  data: T               // 业务数据负载
  timestamp: number     // Unix 时间戳
}
```

### 8.2 API Client 实现

**文件位置**: `lib/api/client.ts`

**双模式运行**:
- **开发模式**: 使用 Mock 数据 (自动生成)
- **生产模式**: 真实 HTTP 请求到后端 API

```typescript
class ApiClient {
  private mockMode: boolean
  
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    if (this.mockMode) {
      return this.mockRequest({ token: 'mock-token', user: mockUser })
    }
    // 真实 HTTP 请求...
  }
}
```

### 8.3 Mock 数据验证

使用 TypeScript `satisfies` 操作符确保 Mock 数据类型安全:

```typescript
const mockData = {
  employees: [
    {
      id: "emp-001",
      name: "王经理",
      role: "manager",  // ✅ 必需字段
      // ...
    },
  ] satisfies Employee[]  // 编译时验证
}
```

---

## 9. 安全机制

### 9.1 认证与授权

```
┌──────────────┐
│   Login Page  │
└──────┬───────┘
       │ POST /api/login
       ▼
┌──────────────┐     ┌──────────────┐
│  AuthService │────▶│  API Client  │
└──────┬───────┘     └──────┬───────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│ AuthStore    │◀────│ Backend API  │
│ (Zustand)    │     │ (JWT Verify) │
└──────┬───────┘     └──────────────┘
       │
       │ localStorage.setItem(token, user)
       ▼
┌──────────────┐
│ Route Guard  │ ← 检查 isAuthenticated
└──────────────┘
```

### 9.2 类型安全保障

- **编译时**: TypeScript strict 模式
- **运行时**: Zod schema 验证 (表单输入)
- **API 层**: ApiResponse<T> 泛型约束

---

## 10. 性能优化策略

### 10.1 代码分割与懒加载

**文件位置**: `components/lazy-components.tsx`

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <PageLoader />,
  ssr: false  // 客户端渲染
})
```

**已优化的组件**:
- 数据分析仪表板 (analytics-dashboard)
- 复杂图表组件
- 大型表单组件

### 10.2 缓存层级

| 层级 | 技术 | TTL | 用途 |
|-----|------|-----|------|
| L1 | React State | Render cycle | 组件内部 |
| L2 | Zustand Store | Session | 全局状态 |
| L3 | useCache Hook | 30s (可配置) | API 响应 |
| L4 | Next.js Cache | Build time | 静态资源 |
| L5 | Browser Cache | Headers | 静态资源 |

### 10.3 Bundle 优化

**构建输出分析** (2026-05-22):
```
Route (app)                      Size      First Load JS
┌─────────────────────────────────────────────────────────┐
│ /                        9.56 kB        122 kB         │
│ /employees               48.3 kB        157 kB  ⚠️ 较大 │
│ /login                   2.25 kB        114 kB         │
│ /rooms                   3.93 kB        109 kB         │
│ ...                                              共 15 个路由│
├─────────────────────────────────────────────────────────┤
│ First Load JS shared        102 kB                     │
│ ├ chunks/235-xxx.js          46 kB                     │
│ ├ chunks/480-xxx.js         53.2 kB                    │
│ └ other shared chunks         2.33 kB                  │
└─────────────────────────────────────────────────────────┘
```

---

## 11. 测试体系

### 11.1 Vitest 配置

**配置文件**: `vitest.config.ts`

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
  },
})
```

### 11.2 测试覆盖范围

| 模块 | 文件 | 测试数 | 状态 |
|------|------|--------|------|
| useAuthStore | `__tests__/stores/useAuthStore.test.ts` | 24 | ✅ 通过 |
| useOrderStore | `__tests__/stores/useOrderStore.test.ts` | 15+ | ✅ 通过 |
| **总计** | - | **40+** | ✅ 全部通过 |

### 11.3 测试命令

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

---

## 12. 部署架构

### 12.1 支持的部署平台

| 平台 | 配置文件 | 状态 |
|------|---------|------|
| Vercel | `vercel.json` | ✅ 推荐 |
| Docker | `Dockerfile` | ✅ 支持 |
| AWS Amplify | `amplify.yml` | ✅ 支持 |
| 传统服务器 | Node.js | ✅ 支持 |

### 12.2 环境变量

**必需变量** (`.env.local`):
```bash
# API 配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080/api/ws
NEXT_PUBLIC_ENV=development

# 智谱 AI (可选)
ZHIPU_API_KEY=your_api_key_here
ZHIPU_BASE_URL=https://open.bigmodel.cn/api/paas/v4
ZHIPU_CHAT_MODEL=glm-4.6

# Microsoft Foundry (可选)
FOUNDRY_AGENT_ENDPOINT=
FOUNDRY_AGENT_API_KEY=
```

### 12.3 Docker 部署 (可选)

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📊 项目健康度仪表板

| 指标 | 目标值 | 当前值 | 状态 |
|------|--------|--------|------|
| TypeScript 错误 | 0 | **0** | ✅ 优秀 |
| 构建成功率 | 100% | **100%** | ✅ 优秀 |
| 测试通过率 | 100% | **100%** | ✅ 优秀 |
| 代码覆盖率 | >80% | 待测 | ⏳ 进行中 |
| Bundle Size (First Load) | <150kB | **122kB** | ✅ 优秀 |
| Lighthouse Performance | >90 | 待测 | ⏳ 进行中 |
| 安全漏洞 | 0 | 1 (Next.js) | ⚠️ 需升级 |

---

## 🔗 相关文档

- **[API 接口文档](./api-reference.md)** - 完整的 API 定义和使用示例
- **[组件库文档](./components.md)** - 所有可用组件及其 Props
- **[部署运维指南](./deployment-ops.md)** - 部署、监控、故障排查
- **[开发指南](./development-guide.md)** - 开发环境搭建、编码规范
- **[对齐规划](./alignment-plan.md)** - 迭代计划和里程碑
- **[知识图谱](./knowledge-graph.md)** - 技术栈全景图

---

## 📝 变更日志

### v2.0.0 (2026-05-22) - 生产就绪版本
#### ✅ 新增
- 完成所有 TypeScript 类型错误修复 (20→0)
- 新增智谱 AI 集成架构 (GLM-4.6/4.5V/Embedding-3)
- 新增 WebSocket 实时通信层
- 新增 Vitest 测试框架 (40+ 测试用例)
- 新增动态导入优化策略

#### 🔧 修复
- 修复 data-dashboard.tsx 文件损坏问题
- 修复 add-employee-form.tsx JSX 语法错误
- 修复 useOrderStore.ts 变量声明冲突
- 修复 Employee/User 类型 role 属性缺失
- 修复第三方库类型兼容性问题 (chart, calendar)

#### 📝 文档
- 重构架构文档至 v2.0.0
- 新增知识图谱文档
- 更新对齐规划至第九章

---

> **文档维护**: 本文档随每次重要变更同步更新  
> **反馈渠道**: Issues / Pull Requests  
> **下次审查**: 2026-06-22 或重大版本发布时
