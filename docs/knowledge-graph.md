# YYC3 智慧商家管理系统 — 技能知识图谱

> 版本：v1.0.0  
> 生成日期：2026-05-22  
> 知识库来源：`/Users/my/Downloads/YYC3-技能知识库`  
> 与项目关联度：深度对齐

---

## 一、知识库全景图谱

```
┌─────────────────────────────────────────────────────────────────┐
│                 YYC3 技能知识库 — 全景架构                        │
│                                                                 │
│  ┌──────────┐   ┌──────────────┐   ┌─────────────────────────┐ │
│  │  API 层   │   │ MCP 集成库    │   │   智谱 AI 开放平台        │ │
│  │  (NAS/    │   │              │   │                          │ │
│  │  DDNS)    │   │ YYC3-CN      │   │ 模型层                   │ │
│  │          │   │ Enhanced     │   │ ├── GLM-4.6 (旗舰)       │ │
│  │ 8 个文件  │   │ MCP Server   │   │ ├── GLM-4.5             │ │
│  └──────────┘   │ v2.1.0       │   │ ├── GLM-4.5V (视觉)     │ │
│                 │              │   │ ├── GLM-Z1 (推理)        │ │
│                 │ 20 个工具     │   │ ├── GLM-4.5-Flash (免费) │ │
│                 │ ├── 基础 5    │   │ └── Embedding-3 (向量)  │ │
│                 │ ├── 智能 9    │   │                          │ │
│                 │ └── 协同 6    │   │ API 层                   │ │
│                 └──────────────┘   │ ├── 对话补全 (同步/流式)  │ │
│                                    │ ├── Agent 智能体对话      │ │
│                                    │ ├── 文本嵌入              │ │
│                                    │ ├── 图像生成              │ │
│                                    │ ├── 语音 TTS/ASR          │ │
│                                    │ ├── 批处理 API            │ │
│                                    │ └── 实时 API (音视频)     │ │
│                                    │                          │ │
│                                    │ 场景层                    │ │
│                                    │ ├── 数据分析  ├── AI搜索   │ │
│                                    │ ├── 金融应用  ├── 翻译     │ │
│                                    │ ├── 办公提效  ├── 教育     │ │
│                                    │ └── GraphRAG  └── 创意    │ │
│                                    └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、高价值模型矩阵 — 与 YYC3 项目对齐

### 2.1 模型选型决策矩阵

| 模型 | 参数量 | 上下文 | 最大输出 | 适用场景 | YYC3 用途 | 定位 |
|------|--------|--------|---------|---------|----------|------|
| **GLM-4.6** | 355B/32B | 200K | 128K | 旗舰编码/推理 | AI 助手核心模型 | 🔴 必选 |
| **GLM-4.5** | - | 128K | 16K | 通用对话 | 日常业务问答 | 🟡 备选 |
| **GLM-4.5V** | - | 128K | 4K | 视觉理解 | 菜单 OCR / 报表识别 | 🔴 必选 |
| **GLM-4.5-Flash** | - | 128K | 16K | 免费高速 | 低频查询降级 | 🟢 免费 |
| **GLM-Z1** | - | 128K | 16K | 深度推理 | 复杂数据分析 | 🟡 高级 |
| **Embedding-3** | - | 8K | - | 文本向量化 | 会员画像 / 相似搜索 | 🔴 必选 |

### 2.2 YYC3 AI 助手推荐模型策略

```
用户请求
    │
    ├── 简单查询（包厢状态/商品价格）
    │   └── GLM-4.5-Flash（免费，响应快）
    │
    ├── 业务问答（经营建议/操作指导）
    │   └── GLM-4.6（旗舰，深度理解）
    │
    ├── 图像理解（菜单拍照/报表截图）
    │   └── GLM-4.5V（多模态视觉）
    │
    ├── 数据分析（趋势预测/异常检测）
    │   └── GLM-Z1（深度推理模式）
    │
    └── 语义搜索（会员匹配/商品推荐）
        └── Embedding-3（向量化 + 余弦相似度）
```

---

## 三、YYC3-CN MCP Server — 工具能力图谱

### 3.1 工具全景（20 个工具）

```
YYC3-CN Enhanced MCP Server v2.1.0
│
├── 📱 基础分析工具 (5) ──── YYC3 项目已集成
│   ├── yyc3_ui_analysis          # 界面 UX 分析
│   ├── yyc3_code_review          # 代码审查
│   ├── yyc3_ai_prompt_optimizer  # Prompt 优化
│   ├── yyc3_feature_generator    # 功能设计生成
│   └── yyc3_localization_checker # 中文本地化检查
│
├── 🔧 智能编程工具 (9) ──── 与 YYC3 架构深度对齐
│   ├── yyc3_api_generator        # → 已有 api-reference.md
│   ├── yyc3_database_designer    # → 已有 types.ts 14 个接口
│   ├── yyc3_component_builder    # → 已有 80+ 组件
│   ├── yyc3_test_generator       # → 已有 24 个测试用例
│   ├── yyc3_deployment_config    # → 已有 deployment-ops.md
│   ├── yyc3_performance_analyzer # → 已有 lazy-components
│   ├── yyc3_documentation_builder# → 已有文档五件套
│   ├── yyc3_code_refactor        # → 已有 Service 层抽象
│   └── yyc3_code_review_enhanced # → 已有 ESLint 配置
│
└── 🤝 协同编程工具 (6) ──── 团队协作场景
    ├── yyc3_collaboration_workspace  # 工作空间管理
    ├── yyc3_realtime_collab          # 实时协同编辑
    ├── yyc3_code_review_session      # 代码审查会话
    ├── yyc3_team_coding              # 团队编程管理
    ├── yyc3_pair_programming         # 结对编程辅助
    └── yyc3_conflict_resolver        # 代码冲突解决
```

### 3.2 工具 ↔ YYC3 项目映射

| MCP 工具 | 项目对应 | 对齐状态 | 高价值度 |
|----------|---------|---------|---------|
| `yyc3_api_generator` | `lib/services/*.service.ts` + `docs/api-reference.md` | ✅ 已对齐 | ⭐⭐⭐⭐⭐ |
| `yyc3_database_designer` | `lib/api/types.ts` (14 接口) | ✅ 已对齐 | ⭐⭐⭐⭐⭐ |
| `yyc3_component_builder` | `components/` (80+ 组件) | ✅ 已对齐 | ⭐⭐⭐⭐⭐ |
| `yyc3_test_generator` | `__tests__/` (4 文件 / 24 用例) | ✅ 已对齐 | ⭐⭐⭐⭐ |
| `yyc3_performance_analyzer` | `lazy-components.tsx` + Store 优化 | ✅ 已对齐 | ⭐⭐⭐⭐ |
| `yyc3_code_refactor` | Service 层抽象 + Mock 重写 | ✅ 已对齐 | ⭐⭐⭐⭐⭐ |
| `yyc3_deployment_config` | `docs/deployment-ops.md` | ✅ 已对齐 | ⭐⭐⭐ |
| `yyc3_ai_prompt_optimizer` | `agent.yaml` System Prompt | ✅ 已对齐 | ⭐⭐⭐⭐⭐ |
| `yyc3_localization_checker` | 全中文 UI + `lang="zh-CN"` | ✅ 已对齐 | ⭐⭐⭐⭐ |
| `yyc3_ui_analysis` | 暗色主题 + 响应式布局 | ✅ 已对齐 | ⭐⭐⭐ |

---

## 四、智谱 AI API 能力矩阵 — 与 YYC3 集成路径

### 4.1 API 端点与 YYC3 集成映射

```
智谱 AI API                          YYC3 集成点
─────────────────                    ─────────────────
POST /v4/chat/completions       →   app/api/chat/route.ts (已实现)
POST /v4/agents                 →   AI 助手升级路径 (Agent API)
POST /v4/embeddings             →   会员画像 / 商品推荐 (新增)
POST /v4/images/generations     →   商品图片生成 (新增)
POST /v4/tts                    →   语音播报提醒 (新增)
POST /v4/asr                    →   语音点单 (新增)
POST /v4/batches                →   批量数据分析 (新增)
WebSocket 实时 API               →   lib/websocket/manager.ts (已实现)
```

### 4.2 认证体系对齐

```
智谱 AI:  Authorization: Bearer YOUR_API_KEY
YYC3 系统: Authorization: Bearer <jwt_token>

→ API Route 层统一转发，前端无需暴露 API Key
→ .env.local 配置 ZHIPU_API_KEY（服务端变量，非 NEXT_PUBLIC）
```

---

## 五、高价值集成路径 — 优先级排序

### 5.1 P0 — 立即可集成（已有基础设施）

| # | 集成项 | 使用 API | 预期效果 | 依赖 |
|---|--------|---------|---------|------|
| 1 | **AI 业务助手** | GLM-4.6 对话补全 | 自然语言查询包厢/订单/报表 | API Key |
| 2 | **智能降级策略** | GLM-4.5-Flash | 免费/低频场景节省成本 | API Key |
| 3 | **中文 Prompt 优化** | Prompt 工程 | 提升助手回复质量 | 已就绪 |

### 5.2 P1 — 短期可集成（1-2 周）

| # | 集成项 | 使用 API | 预期效果 | 依赖 |
|---|--------|---------|---------|------|
| 4 | **语义搜索** | Embedding-3 | 会员画像匹配、商品智能推荐 | 向量数据库 |
| 5 | **菜单 OCR** | GLM-4.5V 视觉理解 | 拍照识别菜单，自动录入商品 | 前端摄像头 |
| 6 | **Agent 智能体** | Agent API | 预置翻译/数据分析智能体 | agent_id |

### 5.3 P2 — 中期规划（1-2 月）

| # | 集成项 | 使用 API | 预期效果 | 依赖 |
|---|--------|---------|---------|------|
| 7 | **语音点单** | ASR + TTS | 语音录入订单，语音播报提醒 | 麦克风权限 |
| 8 | **批量报表** | 批处理 API | 离线生成月度/季度分析报告 | 定时任务 |
| 9 | **GraphRAG** | 知识图谱 + 向量检索 | 构建业务知识库，支持复杂推理 | 图数据库 |
| 10 | **视频监控** | 实时 API | 包厢状态视频流 AI 分析 | 摄像头 |

---

## 六、知识库 → YYC3 架构融合图

```
┌──────────────────────────────────────────────────────────────┐
│                     YYC3 前端应用 (Next.js 15)                │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ AI 助手组件  │  │ 语义搜索    │  │ 图像识别    │            │
│  │ chat/       │  │ 搜索栏     │  │ 拍照上传    │            │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘            │
│         │               │               │                    │
├─────────┼───────────────┼───────────────┼────────────────────┤
│         │        Next.js API Routes (BFF 层)                │
│         │               │               │                    │
│  ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼─────┐            │
│  │/api/chat   │  │/api/embed  │  │/api/vision │            │
│  │route.ts    │  │route.ts    │  │route.ts    │            │
│  │✅ 已创建    │  │📌 待创建    │  │📌 待创建    │            │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘            │
│         │               │               │                    │
├─────────┼───────────────┼───────────────┼────────────────────┤
│         │        智谱 AI API (统一认证)                      │
│         │               │               │                    │
│  ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼─────┐            │
│  │ GLM-4.6    │  │ Embedding-3│  │ GLM-4.5V   │            │
│  │ 对话补全    │  │ 文本嵌入    │  │ 视觉理解    │            │
│  │ 200K ctx   │  │ 8K ctx     │  │ 128K ctx   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  YYC3-CN MCP Server (20 工具)                          │ │
│  │  基础分析(5) + 智能编程(9) + 协同编程(6)                  │ │
│  │  → 已在当前开发环境集成，可直接调用                        │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 七、环境变量扩展

在现有 `.env.local` 基础上新增智谱 AI 配置：

```bash
# 现有配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080/api/ws
NEXT_PUBLIC_ENV=development
FOUNDRY_AGENT_ENDPOINT=
FOUNDRY_AGENT_API_KEY=

# 新增：智谱 AI 集成（服务端变量，不暴露给前端）
ZHIPU_API_KEY=                          # 智谱 AI API Key
ZHIPU_BASE_URL=https://open.bigmodel.cn/api/paas/v4
ZHIPU_CHAT_MODEL=glm-4.6                # 默认对话模型
ZHIPU_VISION_MODEL=glm-4.5v             # 视觉理解模型
ZHIPU_EMBEDDING_MODEL=embedding-3        # 文本嵌入模型
ZHIPU_FLASH_MODEL=glm-4.5-flash         # 免费降级模型
```

---

## 八、知识库统计

| 维度 | 数量 |
|------|------|
| 知识库文件总数 | 120+ |
| 模型介绍文档 | 15 |
| API 端点文档 | 30+ |
| 场景案例 | 12 |
| 创意实践 | 7 |
| 开发工具指南 | 16 |
| MCP 工具 | 20 |
| 与 YYC3 项目高价值对齐点 | 10 |

---

> 📋 本文档基于 `/Users/my/Downloads/YYC3-技能知识库` 深度检索生成，与 YYC3 项目实际架构对齐。
