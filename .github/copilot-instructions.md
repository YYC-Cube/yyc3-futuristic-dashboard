# GitHub Copilot 指令 - 星云操作系统

## 项目概述

星云操作系统是一个企业级 AI 智能管理平台，基于 Next.js 14 App Router 构建。该平台提供实时数据分析、AI 智能洞察、权限管理、通知系统和高级数据可视化功能。

**项目特点:**
- 全平台响应式设计（桌面端和移动端）
- 完整中文支持
- 基于 RBAC 的多租户权限管理
- AI 驱动的数据分析和预测
- 实时协作和通知系统

## 技术栈

### 核心技术
- **框架**: Next.js 14 (App Router)
- **UI 库**: React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 3.4
- **组件库**: shadcn/ui + Radix UI
- **图标**: Lucide React
- **动画**: Framer Motion
- **图表**: Recharts
- **包管理器**: pnpm

### 开发工具
- **代码检查**: ESLint
- **类型检查**: TypeScript (strict mode)
- **构建工具**: Next.js build system
- **部署平台**: Vercel

## 代码规范和最佳实践

### TypeScript 规范
- **严格模式**: 始终使用 TypeScript 严格模式
- **类型注解**: 为所有函数、props 和复杂对象添加明确的类型注解
- **避免 any**: 禁止使用 `any` 类型，使用 `unknown` 或具体类型
- **接口优先**: 使用 `interface` 定义对象结构，使用 `type` 定义联合类型和工具类型
- **导入类型**: 使用 `import type` 导入仅用于类型的导入

**示例:**
```typescript
// ✅ 好的示例
interface UserProps {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

function getUser(id: string): Promise<UserProps> {
  // 实现
}

// ❌ 避免
function getUser(id: any): any {
  // 实现
}
```

### React 组件规范
- **函数组件**: 只使用函数组件，不使用类组件
- **Hooks**: 使用 React Hooks 管理状态和副作用
- **命名**: 组件名使用 PascalCase，文件名使用 kebab-case
- **Props 类型**: 为所有 props 定义 TypeScript 接口
- **默认导出**: 页面组件使用默认导出，可复用组件使用命名导出

**组件结构:**
```typescript
// components/feature-name/component-name.tsx
interface ComponentNameProps {
  title: string
  onAction: () => void
  isActive?: boolean
}

export function ComponentName({ 
  title, 
  onAction, 
  isActive = false 
}: ComponentNameProps) {
  return (
    <div>{/* 实现 */}</div>
  )
}
```

### 样式规范
- **Tailwind CSS**: 优先使用 Tailwind CSS 工具类
- **移动优先**: 使用移动优先的响应式设计方法
- **语义化类名**: 使用语义化的类名组合
- **避免内联样式**: 禁止使用 style 属性，除非是动态值
- **CSS 变量**: 使用 CSS 变量定义主题颜色（定义在 `app/globals.css`）

**示例:**
```tsx
// ✅ 好的示例
<div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
  {/* 内容 */}
</div>

// ❌ 避免
<div style={{ display: 'flex', padding: '16px', backgroundColor: '#0f172a' }}>
  {/* 内容 */}
</div>
```

### 性能优化
- **useMemo**: 使用 `useMemo` 缓存昂贵的计算结果
- **useCallback**: 使用 `useCallback` 缓存函数引用，避免不必要的重渲染
- **动态导入**: 使用 `next/dynamic` 进行代码分割
- **图片优化**: 使用 `next/image` 组件优化图片加载
- **服务器组件**: 优先使用 React Server Components

**示例:**
```typescript
// 缓存计算结果
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value)
}, [data])

// 缓存回调函数
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])
```

## 项目结构

### 目录组织
```
├── app/                      # Next.js App Router 页面
│   ├── layout.tsx           # 根布局（包含 AuthProvider）
│   ├── page.tsx             # 主页（仪表板）
│   ├── analytics/           # 数据分析页面
│   ├── console/             # 系统控制台
│   ├── data-center/         # 数据中心
│   ├── network/             # 网络监控
│   ├── security/            # 安全防护
│   └── settings/            # 系统设置
├── components/              # 可复用组件
│   ├── ai-insights-panel.tsx
│   ├── auth/               # 权限管理组件
│   ├── charts/             # 图表组件
│   ├── collaboration/      # 协作组件
│   ├── mobile/             # 移动端专用组件
│   ├── notifications/      # 通知中心
│   └── ui/                 # 基础 UI 组件（shadcn/ui）
├── lib/                    # 业务逻辑和工具
│   ├── ai-engine.ts        # AI 分析引擎
│   ├── auth/               # 权限管理逻辑
│   ├── notifications/      # 通知系统
│   ├── chart-data-generator.ts
│   └── utils.ts
├── hooks/                  # 自定义 Hooks
│   ├── use-ai-analysis.ts
│   ├── use-mobile.ts
│   └── use-notifications.ts
└── public/                 # 静态资源
```

### 文件命名规范
- **页面**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **组件**: `component-name.tsx` (kebab-case)
- **工具函数**: `utils.ts`, `helpers.ts`
- **类型定义**: `types.ts`
- **测试文件**: `component-name.test.tsx`

## 核心功能模块

### 1. 权限管理系统
**位置**: `lib/auth/`, `components/auth/`

**角色层级** (从高到低):
- `super_admin` - 超级管理员
- `admin` - 管理员
- `manager` - 经理
- `operator` - 操作员
- `viewer` - 查看者

**使用方式:**
```typescript
// 在组件中使用
import { useAuth } from '@/lib/auth/auth-context'
import { PermissionGate } from '@/components/auth/permission-gate'

const { user, hasPermission } = useAuth()

// 条件渲染
{hasPermission('manage:users') && <UserManagementPanel />}

// 权限门控组件
<PermissionGate permission="view:analytics">
  <AnalyticsContent />
</PermissionGate>
```

### 2. AI 智能分析
**位置**: `lib/ai-engine.ts`, `hooks/use-ai-analysis.ts`

**功能:**
- 时间序列预测（移动平均算法）
- 异常检测（Z-score 统计方法）
- 趋势分析（线性回归）
- 智能建议生成

### 3. 通知系统
**位置**: `lib/notifications/`, `components/notifications/`

**通知类型**: `info`, `success`, `warning`, `error`, `system`  
**优先级**: `low`, `medium`, `high`, `urgent`

### 4. 数据可视化
**位置**: `components/charts/`

**图表类型:**
- 高级折线图（带渐变填充）
- 热力图（24小时活动分析）
- 径向进度图（多指标环形展示）
- 区域对比图
- 实时仪表盘

## 状态管理

### 全局状态
- **AuthContext**: 用户认证和权限信息（`lib/auth/auth-context.tsx`）
- **NotificationManager**: 通知系统状态（`lib/notifications/notification-manager.ts`）

### 本地状态
- 使用 `useState` 管理组件内部状态
- 使用 `useRef` 存储 DOM 引用和可变值
- 使用 `useCallback` 缓存函数
- 使用 `useMemo` 缓存计算结果

### Context 使用
```typescript
// 使用全局 Context
const { user, tenant, hasPermission } = useAuth()
const { notifications, addNotification } = useNotifications()
const { predictions, runAnalysis } = useAIAnalysis()
```

## Git 工作流和分支策略

### 分支策略
- **主分支**: `main` - 生产环境代码，受保护
- **开发分支**: 所有功能分支和修复分支最终合并到 `main`
- **分支命名**:
  - `feature/` - 新功能 (例: `feature/add-notification-panel`)
  - `fix/` - Bug 修复 (例: `fix/authentication-error`)
  - `docs/` - 文档更新 (例: `docs/update-readme`)
  - `refactor/` - 代码重构 (例: `refactor/auth-module`)
  - `test/` - 测试相关 (例: `test/add-unit-tests`)
  - `chore/` - 构建/工具相关 (例: `chore/update-dependencies`)

### 提交信息规范 (Conventional Commits)
```
<type>: <description>

[optional body]

[optional footer]
```

**类型**:
- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式（不影响功能）
- `refactor:` - 重构（不改变功能）
- `test:` - 测试相关
- `chore:` - 构建过程或辅助工具的变动

**示例:**
```
feat: 添加 AI 智能分析面板

- 实现时间序列预测功能
- 添加异常检测算法
- 集成趋势分析展示

Closes #123
```

### 合并策略
- 所有分支合并至 `main`
- 使用 Pull Request 进行代码审查
- 合并前必须通过 CI 检查
- 要求至少一个审查者批准

## 安全最佳实践

### 1. 权限验证
- 前端进行 UI 级别的权限检查（UX）
- 敏感操作必须在后端验证权限
- 使用 `AuthGuard` 保护路由
- 使用 `PermissionGate` 保护组件

### 2. XSS 防护
- 依赖 React 自动转义
- 避免使用 `dangerouslySetInnerHTML`
- 验证和清理用户输入

### 3. 数据处理
- 敏感数据不存储在客户端
- 使用环境变量管理配置
- API 密钥不提交到版本控制

## 测试策略

### 运行测试
```bash
pnpm lint           # 运行 ESLint
pnpm typecheck      # TypeScript 类型检查
pnpm validate:permissions  # 验证权限配置
pnpm build          # 构建检查
pnpm ci             # 完整 CI 检查
```

### 测试要求
- 为核心业务逻辑（`lib/` 下）添加单元测试
- 为复杂组件添加组件测试
- 关键用户流程需要 E2E 测试

## 开发工作流

### 添加新页面
1. 在 `app/` 下创建新目录
2. 添加 `page.tsx`（必需）
3. 可选添加 `layout.tsx`, `loading.tsx`, `error.tsx`
4. 在导航中添加路由链接
5. 配置相应的权限要求

### 添加新组件
1. 在 `components/<feature>/` 下创建组件文件
2. 定义 TypeScript 接口
3. 实现组件逻辑
4. 添加必要的测试
5. 在需要的地方导入使用

### 集成新的数据源
1. 在 `lib/` 下创建服务模块
2. 定义类型和接口
3. 实现数据获取逻辑
4. 创建自定义 Hook（如需要）
5. 在组件中使用

## 常用命令

```bash
# 开发
pnpm dev            # 启动开发服务器 (http://localhost:3000)

# 构建
pnpm build          # 构建生产版本
pnpm start          # 启动生产服务器

# 代码质量
pnpm lint           # 运行 ESLint
pnpm typecheck      # TypeScript 类型检查

# CI 检查
pnpm ci             # 运行完整的 CI 流程

# 依赖管理
pnpm install        # 安装依赖
pnpm add <package>  # 添加新依赖
```

## 注意事项

### 移动端适配
- 使用 `hooks/use-mobile.ts` 检测移动设备
- 提供移动端专用组件（`components/mobile/`）
- 测试移动端布局和交互

### 国际化准备
- 当前为完整中文支持
- 预留国际化扩展能力
- 文本内容集中管理

### 性能考虑
- 图表组件使用 Canvas API 高性能渲染
- 长列表考虑虚拟化
- 使用 React Server Components 减少客户端 JavaScript
- 懒加载非关键组件

## 参考文档

- [README.md](../README.md) - 项目介绍和快速开始
- [ARCHITECTURE.md](../ARCHITECTURE.md) - 架构设计文档
- [CONTRIBUTING.md](../CONTRIBUTING.md) - 贡献指南
- [API.md](../API.md) - API 文档
- [SECURITY.md](../SECURITY.md) - 安全策略

---

**重要**: 在开发过程中，始终遵循这些指令，保持代码质量和一致性。如有疑问，请参考相关文档或咨询团队成员。
