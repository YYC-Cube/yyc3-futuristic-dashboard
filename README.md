# ![星云操作系统徽标](public/github.png)  
# 星云操作系统 - 企业级 AI 智能管理平台

<p align="center">
  <img src="public/github.png" alt="星云操作系统 Logo" width="120" />
</p>

<p align="center">
  <strong>星云操作系统 - 企业级 AI 智能管理平台</strong><br/>
  <em>万象归元于云枢，深栈智启新纪元。</em>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-blue?logo=next.js" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2-blue?logo=react" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/TailwindCSS-3.3-blue?logo=tailwindcss" /></a>
  <a href="https://github.com/shadcn/ui"><img src="https://img.shields.io/badge/shadcn/ui-组件库-blueviolet" /></a>
  <a href="https://github.com/YYC-Cube/yyc3-Futuristic-Dashboard"><img src="https://img.shields.io/github/stars/YYC-Cube/yyc3-Futuristic-Dashboard?style=social" /></a>
</p>

<p align="center">
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/部署-Vercel-black?logo=vercel" /></a>
  <img src="https://img.shields.io/badge/环境变量-已配置-green" />
  <img src="https://img.shields.io/badge/权限系统-RBAC-orange" />
  <img src="https://img.shields.io/badge/AI引擎-已集成-brightgreen" />
  <img src="https://img.shields.io/badge/响应式-移动端支持-blue" />
  <img src="https://img.shields.io/badge/语言-中文支持-red" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>
</p>

---

## 📦 项目特性

### 🔧 核心功能

- **AI 智能分析引擎**：实时数据预测、异常检测、智能建议
- **多租户权限管理**：基于 RBAC 的细粒度权限控制系统
- **高级数据可视化**：5 种专业图表组件（折线图、热力图、径向图、区域图、仪表盘）
- **实时协作通知**：通知中心、活动流、团队在线状态
- **全平台响应式**：完美适配桌面端和移动端
- **完整中文支持**：所有界面和提示均为中文

---

## 🧱 技术栈

| 技术 | 说明 |
|------|------|
| Next.js 16 | App Router 架构 |
| React 19.2 | 最新 UI 框架 |
| TypeScript 5.0 | 类型安全 |
| Tailwind CSS 3.3 | 原子化样式 |
| shadcn/ui | 现代组件库 |
| Lucide React | 图标系统 |
| Framer Motion | 动画支持（可选） |

---

## 📁 项目结构

```bash
├── app/                 # 页面结构
│   ├── layout.tsx       # 全局布局
│   ├── page.tsx         # 仪表板主页
│   └── ...              # 功能页面
├── components/          # UI 组件
├── lib/                 # 核心逻辑
├── hooks/               # 自定义 Hook
├── dashboard.tsx        # 主仪表板
└── public/              # 静态资源
```

---

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

访问：[http://localhost:3000](http://localhost:3000)

### 构建生产环境

```bash
pnpm build
pnpm start
```

---

## 🔍 功能模块详解

### 1️⃣ AI 智能分析引擎

位置：`lib/ai-engine.ts`, `hooks/use-ai-analysis.ts`, `components/ai-insights-panel.tsx`

功能：
- 时间序列预测（移动平均）
- 异常检测（Z-score）
- 趋势分析（线性回归）
- 智能建议生成

使用示例：
```ts
const { predictions, anomalies, recommendations, runAnalysis } = useAIAnalysis()
runAnalysis({ cpu: 42, memory: 68, network: 92, security: 75 })
```

---

### 2️⃣ 权限管理系统

位置：`lib/auth/`, `components/auth/`

角色层级：
- super_admin / admin / manager / operator / viewer

权限类型：
- view:dashboard / manage:users / execute:commands 等

使用示例：
```ts
{hasPermission('manage:users') && <UserManagementPanel />}
<PermissionGate permission="view:analytics"><AnalyticsContent /></PermissionGate>
```

---

### 3️⃣ 高级数据可视化

位置：`components/charts/`

图表类型：
- 折线图 / 热力图 / 径向图 / 区域图 / 实时仪表盘

使用示例：
```ts
<RealTimeGauge value={cpuUsage} max={100} label="CPU" color="cyan" size="medium" />
```

---

### 4️⃣ 实时通知系统

位置：`lib/notifications/`, `components/notifications/`

通知类型：info / success / warning / error / system  
优先级：low / medium / high / urgent

使用示例：
```ts
addNotification({ title: '系统更新', message: '新版本已准备好安装', type: 'info', priority: 'medium' })
```

---

### 5️⃣ 移动端适配

位置：`components/mobile/`, `hooks/use-mobile.ts`

组件：
- MobileNav / MobileBottomNav / MobileMetricCard / MobileStatsGrid

使用示例：
```ts
const isMobile = useMobile()
{isMobile ? <MobileView /> : <DesktopView />}
```

---

## 🧭 页面路由权限表

| 路由 | 页面 | 权限要求 |
|------|------|----------|
| `/` | 主仪表板 | view:dashboard |
| `/analytics` | 数据分析 | view:analytics |
| `/data-center` | 数据中心 | view:data |
| `/network` | 网络监控 | view:network |
| `/security` | 安全防护 | view:security |
| `/console` | 系统控制台 | execute:commands |
| `/communications` | 通讯中心 | 无 |
| `/settings` | 系统设置 | manage:settings |

---

## ⚙️ 自定义配置

### 修改主题颜色

编辑 `app/globals.css` 中的 CSS 变量：

```css
:root {
  --background: 0 0% 0%;
  --foreground: 210 40% 98%;
  --primary: 189 94% 43%;
  --primary-foreground: 0 0% 100%;
}
```

### 添加新的权限

1. 修改 `lib/auth/types.ts`
2. 更新 `lib/auth/permissions.ts`
3. 使用 `PermissionGate` 控制访问

---

## 🧪 性能优化

- 使用 React Server Components 减少 JS 体积
- 图表组件使用 Canvas API 提升渲染性能
- 移动端使用专用组件
- 使用 `useCallback` / `useMemo` 优化重渲染
- 懒加载非关键组件

---

## 🌐 浏览器支持

- Chrome / Firefox / Safari / Edge（最新版本）

---

## 🤝 贡献指南

1. Fork 仓库：[YYC-Cube/yyc3-Futuristic-Dashboard](https://github.com/YYC-Cube/yyc3-Futuristic-Dashboard.git)  
2. 创建分支  
3. 提交更改  
4. 开启 Pull Request

---

## 📜 许可证

本项目采用 [MIT License](LICENSE)。

---

## 📮 技术支持

- 提交 Issue
- 联系邮箱：admin@0379.email
- 查看项目文档

---

## 🕘 更新日志

### v1.0.0 (2025-01-25)

- 初始版本发布
- 完整的 AI 智能分析引擎
- 多租户权限管理系统
- 5种高级数据可视化组件
- 实时协作与通知系统
- 全平台响应式支持
- 完整中文本地化

---

**星云操作系统** - 打造下一代企业级智能管理平台
