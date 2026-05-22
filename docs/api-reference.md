# YYC3 智慧商家管理系统 — API 接口文档

> **版本**：v2.0.0  
> **更新日期**：2026-05-22  
> **Base URL**：`http://localhost:8080/api/v1` (开发环境)  
> **协议**：REST + WebSocket

---

## 📋 目录

1. [概述](#1-概述)
2. [统一响应格式](#2-统一响应格式)
3. [认证接口](#3-认证接口)
4. [包厢管理接口](#4-包厢管理接口)
5. [订单管理接口](#5-订单管理接口)
6. [员工管理接口](#6-员工管理接口)
7. [会员管理接口](#7-会员管理接口)
8. [商品与库存接口](#8-商品与库存接口)
9. [AI 对话接口](#9-ai-对话接口)
10. [WebSocket 实时通信](#10-websocket-实时通信)
11. [错误码说明](#11-错误码说明)
12. [TypeScript 类型定义](#12-typescript-类型定义)

---

## 1. 概述

YYC3 API 采用 RESTful 风格设计，所有接口返回统一的 `ApiResponse<T>` 格式。支持 Mock 模式（开发）和真实 HTTP 模式（生产）自动切换。

### 1.1 认证方式

- **方式**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`
- **获取**: 通过 `/login` 接口登录获取
- **有效期**: 24 小时 (可配置)

### 1.2 请求头

```http
Content-Type: application/json
Authorization: Bearer <token>
X-Request-ID: <uuid>
```

---

## 2. 统一响应格式

### 2.1 成功响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... },
  "timestamp": 1716384000000
}
```

### 2.2 错误响应

```json
{
  "code": 400,
  "message": "参数错误: 用户名不能为空",
  "data": null,
  "timestamp": 1716384000000
}
```

### 2.3 TypeScript 定义

```typescript
interface ApiResponse<T> {
  code: number          // 状态码: 200=成功, 4xx=客户端错误, 5xx=服务端错误
  message: string       // 人类可读消息
  data: T | null        // 业务数据负载
  timestamp: number     // Unix 时间戳 (毫秒)
}
```

---

## 3. 认证接口

### 3.1 用户登录

**POST** `/auth/login`

**请求体**:

```json
{
  "username": "admin",
  "password": "123456"
}
```

**成功响应 (200)**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "emp-001",
      "name": "王经理",
      "role": "manager",
      "avatar": null
    }
  },
  "timestamp": 1716384000000
}
```

**错误码**:

| Code | 说明 |
|------|------|
| 400 | 参数错误 (用户名/密码为空) |
| 401 | 认证失败 (用户名或密码错误) |
| 429 | 请求过于频繁 |

---

### 3.2 用户登出

**POST** `/auth/logout`

**请求头**: 需要 Authorization

**成功响应 (200)**:

```json
{
  "code": 200,
  "message": "登出成功",
  "data": null,
  "timestamp": 1716384000000
}
```

---

### 3.3 获取当前用户信息

**GET** `/auth/me`

**请求头**: 需要 Authorization

**成功响应 (200)**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "emp-001",
    "name": "王经理",
    "role": "manager",
    "avatar": null,
    "permissions": ["all"]
  },
  "timestamp": 1716384000000
}
```

---

## 4. 包厢管理接口

### 4.1 获取包厢列表

**GET** `/rooms`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| status | string | 否 | 包厢状态筛选 | `available`, `occupied`, `maintenance` |
| floor | number | 否 | 楼层筛选 | 1, 2, 3 |
| page | number | 否 | 页码 (默认 1) | 1 |
| pageSize | number | 否 | 每页数量 (默认 20) | 20 |

**成功响应 (200)**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rooms": [
      {
        "id": "room-001",
        "roomNumber": "101",
        "type": "VIP",
        "floor": 1,
        "capacity": 10,
        "status": "available",
        "hourlyRate": 288,
        "amenities": ["麦克风", "音响", "电视"]
      }
    ],
    "total": 30,
    "page": 1,
    "pageSize": 20
  },
  "timestamp": 1716384000000
}
```

---

### 4.2 创建包厢

**POST** `/rooms`

**请求体**:

```json
{
  "roomNumber": "201",
  "type": "VIP",
  "floor": 2,
  "capacity": 15,
  "hourlyRate": 388,
  "amenities": ["麦克风", "音响", "电视", "游戏机"]
}
```

**成功响应 (201)**:

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "room-new-001",
    "roomNumber": "201",
    "status": "available"
  },
  "timestamp": 1716384000000
}
```

---

### 4.3 更新包厢状态

**PATCH** `/rooms/:id/status`

**请求体**:

```json
{
  "status": "occupied"
}
```

**状态值枚举**:

- `available` - 空闲
- `occupied` - 使用中
- `reserved` - 已预订
- `maintenance` - 维护中

---

### 4.4 删除包厢

**DELETE** `/rooms/:id`

**成功响应 (200)**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "timestamp": 1716384000000
}
```

---

## 5. 订单管理接口

### 5.1 创建订单

**POST** `/orders`

**请求体**:

```json
{
  "roomId": "room-001",
  "items": [
    {
      "productId": "prod-001",
      "quantity": 2,
      "price": 88,
      "remark": "少糖"
    }
  ],
  "customerName": "张三",
  "customerPhone": "13800138000"
}
```

**成功响应 (201)**:

```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "id": "order-001",
    "orderNumber": "ORD20260522001",
    "roomId": "room-001",
    "status": "pending",
    "totalAmount": 176,
    "items": [...],
    "createdAt": "2026-05-22T10:00:00Z"
  },
  "timestamp": 1716384000000
}
```

---

### 5.2 获取订单列表

**GET** `/orders`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 订单状态筛选 |
| roomId | string | 否 | 包厢 ID |
| dateFrom | string | 否 | 开始日期 (YYYY-MM-DD) |
| dateTo | string | 否 | 结束日期 (YYYY-MM-DD) |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**订单状态枚举**:

- `pending` - 待确认
- `confirmed` - 已确认
- `preparing` - 制作中
- `ready` - 待送达/待取餐
- `completed` - 已完成
- `cancelled` - 已取消

---

### 5.3 更新订单状态

**PATCH** `/orders/:id/status`

**请求体**:

```json
{
  "status": "confirmed"
}
```

**状态流转规则**:

```
pending → confirmed → preparing → ready → completed
                                      ↘ cancelled (任意时刻可取消)
```

---

### 5.4 添加订单项

**POST** `/orders/:id/items`

**请求体**:

```json
{
  "productId": "prod-002",
  "quantity": 1,
  "price": 128,
  "remark": "加冰"
}
```

---

## 6. 员工管理接口

### 6.1 获取员工列表

**GET** `/employees`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| department | string | 否 | 部门筛选 |
| position | string | 否 | 职位筛选 |
| isActive | boolean | 否 | 在职状态 |
| keyword | string | 否 | 关键词搜索 (姓名/工号) |

**成功响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "employees": [
      {
        "id": "emp-001",
        "employeeNumber": "EMP001",
        "name": "王经理",
        "phone": "13700137000",
        "position": "manager",
        "department": "管理部",
        "role": "manager",
        "isActive": true,
        "permissions": ["all"],
        "avatar": null,
        "createdAt": "2023-01-15"
      }
    ],
    "total": 25
  },
  "timestamp": 1716384000000
}
```

---

### 6.2 创建员工

**POST** `/employees`

**请求体**:

```json
{
  "name": "李四",
  "phone": "13900139000",
  "position": "服务员",
  "department": "楼面部",
  "password": "initial_password_123",
  "permissions": ["room:view", "order:create"]
}
```

---

### 6.3 更新员工信息

**PUT** `/employees/:id`

**请求体** (支持部分更新):

```json
{
  "name": "李四 (已更名)",
  "position": "高级服务员",
  "role": "staff"
}
```

---

### 6.4 更新员工权限

**PATCH** `/employees/:id/permissions`

**请求体**:

```json
{
  "permissions": [
    "room:view",
    "room:update",
    "order:create",
    "order:cancel",
    "member:view"
  ]
}
```

---

## 7. 会员管理接口

### 7.1 获取会员列表

**GET** `/members`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| level | string | 否 | 会员等级 |
| isActive | boolean | 否 | 状态 |
| keyword | string | 否 | 手机号/姓名搜索 |

---

### 7.2 创建会员

**POST** `/members`

**请求体**:

```json
{
  "name": "张三",
  "phone": "13800138000",
  "gender": "男",
  "birthday": "1990-01-15",
  "initialPoints": 100
}
```

---

### 7.3 积分操作

**POST** `/members/:id/points`

**请求体**:

```json
{
  "action": "add",
  "points": 500,
  "reason": "消费赠送",
  "orderId": "order-001"
}
```

**action 枚举**:

- `add` - 增加积分
- `deduct` - 扣减积分

---

## 8. 商品与库存接口

### 8.1 商品分类

**GET** `/products/categories`

**响应结构**:

```json
{
  "code": 200,
  "data": {
    "categories": [
      {
        "id": "cat-001",
        "name": "酒水",
        "sortOrder": 1,
        "productsCount": 56
      },
      {
        "id": "cat-002",
        "name": "小吃",
        "sortOrder": 2,
        "productsCount": 32
      }
    ]
  }
}
```

---

### 8.2 商品列表

**GET** `/products`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| categoryId | string | 否 | 分类 ID |
| keyword | string | 否 | 名称搜索 |
| isAvailable | boolean | 否 | 是否上架 |
| page | number | 否 | 页码 |

---

### 8.3 库存查询

**GET** `/inventory`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| lowStock | boolean | 否 | 仅显示低库存 |
| categoryId | string | 否 | 分类筛选 |

**低库存定义**: 当前库存 < 安全库存阈值

---

### 8.4 库存入库

**POST** `/inventory/in`

**请求体**:

```json
{
  "productId": "prod-001",
  "quantity": 100,
  "unitPrice": 50,
  "supplier": "供应商A",
  "remark": "正常补货"
}
```

---

## 9. AI 对话接口

### 9.1 智能对话 (智谱 AI)

**POST** `/api/chat`

**注意**: 这是 Next.js API Route，路径为 `/api/chat`

**请求体**:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "今天 101 包厢的营业额是多少？"
    }
  ],
  "model": "glm-4.6",
  "stream": false
}
```

**成功响应 (非流式)**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "chatcmpl-xxx",
    "model": "glm-4.6",
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": "根据系统数据，今天 101 包厢的营业额为 ¥2,880 元，共接待 3 批客人..."
        }
      }
    ],
    "usage": {
      "prompt_tokens": 150,
      "completion_tokens": 80,
      "total_tokens": 230
    }
  },
  "timestamp": 1716384000000
}
```

**流式响应** (SSE):
当 `stream: true` 时，返回 Server-Sent Events 流：

```
data: {"choices":[{"delta":{"content":"根据"}}]}

data: {"choices":[{"delta":{"content":"系统"}}]}

data: [DONE]
```

---

### 9.2 支持的模型

| 模型 ID | 用途 | 最大 Token | 延迟 |
|---------|------|-----------|------|
| `glm-4.6` | 复杂对话、数据分析 | 128K | ~2s |
| `glm-4.5-flash` | 简单问答、免费降级 | 128K | ~0.5s |
| `glm-4.5v` | 图像理解 (OCR) | 4K | ~3s |
| `embedding-3` | 文本向量化 | 8K | ~0.3s |

---

## 10. WebSocket 实时通信

### 10.1 连接地址

```
ws://localhost:8080/api/ws
wss://your-domain.com/api/ws (生产环境)
```

### 10.2 连接认证

连接时需要在 Query 参数中传递 token：

```
ws://localhost:8080/api/ws?token=eyJhbGciOi...
```

### 10.3 消息格式

#### 客户端 → 服务端

```typescript
interface WSMessage {
  type: 'subscribe' | 'unsubscribe' | 'ping'
  channel?: string   // 订阅频道: 'rooms', 'orders', 'notifications'
  payload?: unknown
}
```

#### 服务端 → 客户端

```typescript
interface WSServerMessage {
  type: 'update' | 'notification' | 'pong' | 'error'
  channel: string
  data: unknown
  timestamp: number
}
```

### 10.4 可订阅频道

| 频道名称 | 数据内容 | 更新频率 |
|---------|---------|---------|
| `rooms` | 包厢状态变更 | 实时 |
| `orders` | 订单状态变更 | 实时 |
| `notifications` | 系统通知 | 按需 |
| `analytics` | 实时统计数据 | 30s 间隔 |

### 10.5 使用示例

```typescript
// lib/websocket/manager.ts (已集成)
import { WebSocketManager } from '@/lib/websocket/manager'

const ws = new WebSocketManager({
  url: process.env.NEXT_PUBLIC_WS_URL!,
  token: authToken,
  reconnect: true,
  maxRetries: 5
})

// 订阅包厢状态更新
ws.subscribe('rooms', (data) => {
  console.log('Room update:', data)
})

// 发送心跳
ws.ping()
```

---

## 11. 错误码说明

### 11.1 HTTP 状态码

| Code | 类别 | 说明 |
|------|------|------|
| 200 | 成功 | 请求成功 |
| 201 | 成功 | 资源创建成功 |
| 400 | 客户端错误 | 请求参数错误 |
| 401 | 未授权 | Token 无效或过期 |
| 403 | 禁止访问 | 权限不足 |
| 404 | 未找到 | 资源不存在 |
| 422 | 无法处理 | 业务逻辑验证失败 |
| 429 | 请求过多 | 触发频率限制 |
| 500 | 服务端错误 | 内部服务器错误 |
| 503 | 服务不可用 | 服务过载或维护中 |

### 11.2 业务错误码

| Code | Message | 说明 | 解决方案 |
|------|---------|------|---------|
| 1001 | 用户名或密码错误 | 登录失败 | 检查凭据 |
| 1002 | Token 已过期 | 需要重新登录 | 重新登录 |
| 1003 | 账户已被禁用 | 无权访问 | 联系管理员 |
| 2001 | 包厢不存在 | 操作目标无效 | 检查包厢 ID |
| 2002 | 包厢状态冲突 | 当前状态不允许此操作 | 刷新页面重试 |
| 3001 | 订单不存在 | 操作目标无效 | 检查订单号 |
| 3002 | 订单状态流转非法 | 不符合业务规则 | 检查当前状态 |
| 3003 | 库存不足 | 商品库存不够 | 补货或选择替代品 |
| 4001 | 员工工号重复 | 唯一性约束 | 使用其他工号 |
| 4002 | 权限不足 | 缺少必要权限 | 联系管理员授权 |
| 5001 | 会员已存在 | 手机号已被注册 | 直接登录或找回密码 |

---

## 12. TypeScript 类型定义

### 12.1 核心类型

```typescript
// lib/api/types.ts

// 员工
export interface Employee {
  id: string
  employeeNumber: string
  name: string
  phone: string
  position: string
  department: string
  permissions: string[]
  isActive: boolean
  role?: "admin" | "manager" | "staff"
  createdAt: string
  avatar?: string
  workShift?: string
}

// 包厢
export interface Room {
  id: string
  roomNumber: string
  type: string
  floor: number
  capacity: number
  status: "available" | "occupied" | "reserved" | "maintenance"
  hourlyRate: number
  amenities: string[]
}

// 订单
export interface Order {
  id: string
  orderNumber: string
  roomId: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  items: OrderItem[]
  totalAmount: number
  customerName?: string
  customerPhone?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  remark?: string
}

// 会员
export interface Member {
  id: string
  name: string
  phone: string
  gender?: string
  birthday?: string
  level: string
  points: number
  balance: number
  isActive: boolean
  createdAt: string
}

// 商品
export interface Product {
  id: string
  name: string
  categoryId: string
  price: number
  cost: number
  unit: string
  isAvailable: boolean
  imageUrl?: string
  description?: string
}

// API 响应
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}
```

### 12.2 使用示例

```typescript
// 在组件中使用 API
import { apiClient } from '@/lib/api/client'
import type { Employee, ApiResponse } from '@/lib/api/types'

const fetchEmployees = async () => {
  const response: ApiResponse<Employee[]> = await apiClient.get('/employees')
  
  if (response.code === 200) {
    const employees = response.data
    console.log(`获取到 ${employees.length} 名员工`)
  } else {
    console.error('获取失败:', response.message)
  }
}
```

---

## 🔗 相关文档

- **[架构设计](./architecture.md)** - 系统整体架构和模块说明
- **[组件库文档](./components.md)** - 前端组件使用指南
- **[部署运维指南](./deployment-ops.md)** - 部署配置和环境变量
- **[开发指南](./development-guide.md)** - 开发环境搭建和编码规范

---

## 📝 变更日志

### v2.0.0 (2026-05-22)

#### ✅ 新增

- AI 对话接口 (`POST /api/chat`) - 智谱 AI 集成
- WebSocket 实时通信接口文档
- 流式响应支持 (SSE)
- 多模型支持 (GLM-4.6/Flash/4.5V/Embedding-3)

#### 🔧 更新

- 所有接口统一使用 `ApiResponse<T>` 格式
- 新增 Employee.role 字段
- 完善错误码体系 (业务错误码 1001-5002)
- 补充 TypeScript 类型定义

#### 📝 文档

- 完整的请求/响应示例
- WebSocket 订阅频道说明
- 错误码速查表

---

> **文档维护**: 本文档随 API 变更同步更新  
> **Mock 数据**: 开发环境自动启用，详见 `lib/api/client.ts`  
> **下次审查**: 2026-06-22 或 API 版本升级时
