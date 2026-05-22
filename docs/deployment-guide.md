# YYC3 智慧商家管理系统 — 部署指南

> **版本**：v2.0.0  
> **更新日期**：2026-05-22  
> **适用环境**：Production / Staging / Development  
> **部署状态**：✅ 生产就绪

---

## 📋 文档目录

1. [部署概览](#1-部署概览)
2. [部署前准备](#2-部署前准备)
3. [环境变量配置](#3-环境变量配置)
4. [Vercel 部署（推荐）](#4-vercel-部署推荐)
5. [Docker 部署](#5-docker-部署)
6. [传统服务器部署](#6-传统服务器部署)
7. [CI/CD 自动化部署](#7-cicd-自动化部署)
8. [性能优化配置](#8-性能优化配置)
9. [监控与日志](#9-监控与日志)
10. [故障排查指南](#10-故障排查指南)

---

## 1. 部署概览

### 1.1 支持的部署平台

| 平台 | 推荐度 | 配置复杂度 | 适用场景 |
|------|--------|-----------|---------|
| **Vercel** | ⭐⭐⭐⭐⭐ | 低 | 快速上线、自动扩缩容 |
| **Docker** | ⭐⭐⭐⭐ | 中 | 自托管、私有云部署 |
| **AWS Amplify** | ⭐⭐⭐⭐ | 中 | AWS 生态集成 |
| **传统 Node.js** | ⭐⭐⭐ | 高 | 完全控制、定制化需求 |

### 1.2 系统要求

#### 最低要求
- **CPU**: 2 核
- **内存**: 4 GB RAM
- **存储**: 20 GB SSD
- **Node.js**: >= 18.x
- **pnpm**: >= 8.x

#### 推荐配置（生产环境）
- **CPU**: 4 核+
- **内存**: 8 GB RAM+
- **存储**: 50 GB NVMe SSD
- **Node.js**: 18 LTS
- **带宽**: 100 Mbps+

---

## 2. 部署前准备

### 2.1 代码准备

```bash
# 克隆代码仓库
git clone <your-repo-url> yyc3-dashboard
cd yyc3-dashboard

# 安装依赖
corepack enable
pnpm install

# 复制环境变量模板
cp .env.example .env.local

# 本地构建测试
pnpm run build
```

### 2.2 依赖检查清单

```bash
# 检查 Node.js 版本
node --version  # 应该 >= 18.x

# 检查 pnpm 版本
pnpm --version  # 应该 >= 8.x

# 检查依赖完整性
pnpm run build  # 构建成功即可
```

### 2.3 数据库准备（如需要）

```sql
-- 创建数据库（示例）
CREATE DATABASE yyc3_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'yyc3_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON yyc3_dashboard.* TO 'yyc3_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. 环境变量配置

### 3.1 必需环境变量

创建 `.env.local` 文件：

```bash
# ===========================================
# YYC3 智慧商家管理系统 - 环境变量配置
# ===========================================

# --- 基础配置 ---
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080/api/ws
NEXT_PUBLIC_ENV=production

# --- 智谱 AI 配置 (可选) ---
ZHIPU_API_KEY=your_api_key_here
ZHIPU_BASE_URL=https://open.bigmodel.cn/api/paas/v4
ZHIPU_CHAT_MODEL=glm-4.6

# --- Microsoft Foundry 配置 (可选) ---
FOUNDRY_AGENT_ENDPOINT=
FOUNDRY_AGENT_API_KEY=

# --- 安全配置 ---
JWT_SECRET=your_jwt_secret_here_at_least_32_chars
SESSION_SECRET=your_session_secret_here
```

### 3.2 环境变量说明

| 变量名 | 必需 | 说明 | 示例值 |
|--------|------|------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | API 基础地址 | `https://api.yourdomain.com/v1` |
| `NEXT_PUBLIC_WS_URL` | ✅ | WebSocket 地址 | `wss://ws.yourdomain.com` |
| `NEXT_PUBLIC_ENV` | ✅ | 运行环境 | `production` / `staging` / `development` |
| `ZHIPU_API_KEY` | ❌ | 智谱 AI API Key | `xxx.xxx.xxx` |
| `FOUNDRY_AGENT_ENDPOINT` | ❌ | Foundry Agent 端点 | `https://...` |

### 3.3 不同环境的配置示例

#### Development (.env.development)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080/api/ws
NEXT_PUBLIC_ENV=development
```

#### Staging (.env.staging)
```bash
NEXT_PUBLIC_API_BASE_URL=https://staging-api.yourdomain.com/v1
NEXT_PUBLIC_WS_URL=wss://staging-ws.yourdomain.com
NEXT_PUBLIC_ENV=staging
```

#### Production (.env.production)
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/v1
NEXT_PUBLIC_WS_URL=wss://ws.yourdomain.com
NEXT_PUBLIC_ENV=production
```

---

## 4. Vercel 部署（推荐）

### 4.1 为什么选择 Vercel？

✅ **零配置部署** - 自动检测 Next.js 项目  
✅ **全球 CDN** - 边缘节点加速  
✅ **自动 HTTPS** - 免费证书  
✅ **自动扩缩容** - 按需分配资源  
✅ **预览部署** - 每个 PR 自动预览  

### 4.2 通过 Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel 账户
vercel login

# 首次部署（交互式）
vercel

# 生产环境部署
vercel --prod
```

### 4.3 通过 GitHub 集成部署

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. 配置环境变量：
   ```
   NEXT_PUBLIC_API_BASE_URL = https://api.yourdomain.com/v1
   NEXT_PUBLIC_WS_URL = wss://ws.yourdomain.com
   NEXT_PUBLIC_ENV = production
   ZHIPU_API_KEY = your_api_key
   ```
5. 点击 "Deploy"

### 4.4 Vercel 配置文件 (vercel.json)

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["hnd1"],  // 东京区域
  "env": {
    "NEXT_PUBLIC_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

### 4.5 自定义域名配置

```bash
# 添加自定义域名
vercel domains add yourdomain.com

# 配置 DNS 记录
# A 记录: 76.76.21.21
# CNAME: cname.vercel-dns.com
```

---

## 5. Docker 部署

### 5.1 Dockerfile（多阶段构建）

项目已包含优化的 Dockerfile：

```dockerfile
# ===========================================
# Stage 1: 依赖安装
# ===========================================
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

# ===========================================
# Stage 2: 构建
# ===========================================
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ===========================================
# Stage 3: 运行时
# ===========================================
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### 5.2 Docker Compose 编排

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  # 主应用服务
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: yyc3-dashboard
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL:-http://localhost:8080/api/v1}
      - NEXT_PUBLIC_WS_URL=${WS_URL:-ws://localhost:8080/api/ws}
      - NEXT_PUBLIC_ENV=${ENVIRONMENT:-production}
      - ZHIPU_API_KEY=${ZHIPU_API_KEY:-}
    restart: unless-stopped
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
  
  # Nginx 反向代理（可选）
  nginx:
    image: nginx:alpine
    container_name: yyc3-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - yyc3-network

networks:
  yyc3-network:
    driver: bridge
```

### 5.3 Nginx 配置 (nginx.conf)

```nginx
events {
    worker_connections 1024;
}

http {
    upstream nextjs_app {
        server app:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com;

        # 重定向到 HTTPS
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate     /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Gzip 压缩
        gzip on;
        gzip_types text/plain application/json application/javascript text/css;

        location / {
            proxy_pass http://nextjs_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_cache_bypass $http_upgrade;
        }

        # WebSocket 支持
        location /ws {
            proxy_pass http://nextjs_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_read_timeout 86400;
        }
    }
}
```

### 5.4 Docker 部署命令

```bash
# 构建镜像
docker build -t yyc3-dashboard:v2.0.0 .

# 使用 Docker Compose 启动
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down

# 更新部署
docker-compose pull
docker-compose up -d --build
```

---

## 6. 传统服务器部署

### 6.1 服务器初始化

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
corepack enable
corepack prepare pnpm@latest --activate

# 安装 PM2 进程管理器
sudo npm install -g pm2

# 安装 Nginx
sudo apt install nginx -y
```

### 6.2 应用部署

```bash
# 创建应用目录
sudo mkdir -p /var/www/yyc3-dashboard
cd /var/www/yyc3-dashboard

# 上传代码（或 git clone）
git clone <your-repo-url> .

# 安装依赖
pnpm install --production=false

# 构建
pnpm run build

# 配置环境变量
cp .env.production .env.local
nano .env.local  # 编辑配置
```

### 6.3 PM2 进程管理

创建 ecosystem.config.js：

```javascript
module.exports = {
  apps: [{
    name: 'yyc3-dashboard',
    script: './node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/yyc3-dashboard',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',  // 根据 CPU 核心数自动设置
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    error_log: '/var/log/yyc3/error.log',
    out_log: '/var/log/yyc3/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
```

启动应用：

```bash
# 使用 PM2 启动
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status

# 查看日志
pm2 logs yyc3-dashboard

# 重启应用
pm2 restart yyc3-dashboard
```

### 6.4 Nginx 反向代理

```bash
# 创建站点配置
sudo nano /etc/nginx/sites-available/yyc3-dashboard
```

配置内容：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用站点：

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/yyc3-dashboard /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 7. CI/CD 自动化部署

### 7.1 GitHub Actions 工作流

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # Job 1: 测试
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install pnpm
        run: corepack enable && corepack prepare pnpm@latest --activate
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build project
        run: pnpm run build

  # Job 2: 部署到 Vercel
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 7.2 GitLab CI/CD

创建 `.gitlab-ci.yml`：

```yaml
stages:
  - test
  - build
  - deploy

variables:
  PNPM_VERSION: "8"

test:
  stage: test
  image: node:18-alpine
  before_script:
    - corepack enable
    - corepack prepare pnpm@$PNPM_VERSION --activate
  script:
    - pnpm install
    - pnpm test
    - pnpm run build

deploy_production:
  stage: deploy
  image: docker:latest
  services:
    - docker:dind
  only:
    - main
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

---

## 8. 性能优化配置

### 8.1 Next.js 配置优化

在 `next.config.js` 中添加：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用压缩
  compress: true,

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // 实验性功能
  experimental: {
    // 启用 Server Components
    serverComponentsExternalPackages: [],
  },

  // Headers 安全配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // 忽略 ESLint 错误（生产构建）
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
```

### 8.2 缓存策略配置

```javascript
// 在 API 路由中设置缓存
export async function GET(request: Request) {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}
```

### 8.3 CDN 配置建议

| 资源类型 | 缓存时间 | 策略 |
|---------|---------|------|
| 静态资源 (JS/CSS) | 1 年 | 内容哈希缓存 |
| 图片资源 | 1 年 | 内容哈希缓存 |
| 字体文件 | 1 年 | 永久缓存 |
| HTML 页面 | 不缓存 | 实时更新 |
| API 响应 | 60 秒 | stale-while-revalidate |

---

## 9. 监控与日志

### 9.1 应用监控

推荐使用以下监控工具：

| 工具 | 用途 | 价格 |
|------|------|------|
| **Vercel Analytics** | 性能分析 | 免费 |
| **Sentry** | 错误追踪 | 免费/付费 |
| **LogRocket** | 用户行为录制 | 付费 |
| **Datadog** | 全栈监控 | 付费 |

### 9.2 日志配置

创建 `lib/logger.ts`：

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

export default logger;
```

使用示例：

```typescript
import logger from '@/lib/logger';

// 信息日志
logger.info({ userId: '123' }, '用户登录成功');

// 错误日志
logger.error({ err: error }, 'API 请求失败');

// 性能日志
logger.info({ duration: 150 }, 'API 响应时间');
```

### 9.3 健康检查端点

创建 `app/api/health/route.ts`：

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NEXT_PUBLIC_ENV,
  };

  return NextResponse.json(healthStatus, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}
```

访问 `https://yourdomain.com/api/health` 检查健康状态。

---

## 10. 故障排查指南

### 10.1 常见问题及解决方案

#### 问题 1: 构建失败 - 内存不足

**症状**: `JavaScript heap out of memory`

**解决方案**:
```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 问题 2: 环境变量未生效

**症状**: `NEXT_PUBLIC_*` 变量读取为 undefined

**解决方案**:
1. 确保变量名以 `NEXT_PUBLIC_` 开头（客户端可用）
2. 重新构建项目（环境变量在编译时注入）
3. 检查 `.env.local` 是否在根目录

#### 问题 3: WebSocket 连接失败

**症状**: `WebSocket connection failed`

**解决方案**:
1. 检查 `NEXT_PUBLIC_WS_URL` 配置
2. 确保 Nginx/反向代理支持 WebSocket 升级
3. 检查防火墙规则

#### 问题 4: 首屏加载慢

**症状**: FCP > 3 秒

**解决方案**:
1. 启用动态导入（已完成）
2. 检查图片大小和格式
3. 启用 CDN 加速
4. 检查 API 响应时间

#### 问题 5: TypeScript 类型错误

**症状**: `tsc --noEmit` 报错

**解决方案**:
```bash
# 清除缓存并重新安装
rm -rf .next node_modules
pnpm install
pnpm run build
```

### 10.2 性能问题诊断命令

```bash
# 查看 Node.js 进程内存使用
node -e "console.log(process.memoryUsage())"

# 分析 bundle 大小
npx @next/bundle-analyzer

# Lighthouse 性能测试
npx lighthouse https://yourdomain.com --view

# 查看 PM2 进程状态
pm2 monit
```

### 10.3 回滚策略

```bash
# Vercel 回滚
vercel rollback [deployment-url]

# Docker 回滚
docker-compose down
docker run -d -p 3000:3000 yyc3-dashboard:v1.0.0

# PM2 回滚
pm2 reload ycc3-dashboard --update-env
```

---

## 📊 部署检查清单

### 部署前检查

- [ ] 代码已通过所有测试 (`pnpm test`)
- [ ] TypeScript 类型检查通过 (`npx tsc --noEmit`)
- [ ] 构建成功 (`pnpm run build`)
- [ ] 环境变量已正确配置
- [ ] 数据库迁移已完成
- [ ] SSL 证书已申请（生产环境）
- [ ] DNS 解析已配置

### 部署后验证

- [ ] 应用正常启动（HTTP 200）
- [ ] 健康检查端点正常 (`/api/health`)
- [ ] 所有页面可正常访问
- [ ] WebSocket 连接正常
- [ ] AI 功能正常工作（如已配置）
- [ ] 日志输出正常
- [ ] 性能指标达标（Lighthouse > 90）

---

## 📞 技术支持

如遇到部署问题，请按以下顺序排查：

1. **查看文档**: 本部署指南 + [架构设计文档](./architecture.md)
2. **检查日志**: `/var/log/yyc3/` 或 Docker logs
3. **社区支持**: GitHub Issues
4. **紧急联系**: 技术负责人

---

> **文档维护**: 本文档随版本迭代持续更新，最后更新于 2026-05-22  
> **反馈渠道**: 如有问题或建议，请提交 Issue 或 PR
