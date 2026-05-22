# YYC3 智慧商家管理系统 — 部署运维文档

> 版本：v1.3.0  
> 更新日期：2026-05-22  
> 适用环境：开发 / 测试 / 生产  
> 变更：新增 Foundry 环境变量、认证系统部署说明

---

## 1. 环境说明

### 1.1 环境矩阵

| 环境 | 域名 | 用途 | 数据库 | 部署方式 |
|------|------|------|--------|---------|
| Development | localhost:3000 | 本地开发 | SQLite / Mock | pnpm dev |
| Staging | staging.yyc3.cn | 测试验证 | PostgreSQL (测试) | Docker |
| Production | app.yyc3.cn | 线上生产 | PostgreSQL (生产) | Docker + K8s |

### 1.2 服务器最低配置

| 环境 | CPU | 内存 | 磁盘 | 带宽 |
|------|-----|------|------|------|
| 开发 | 2核 | 4GB | 40GB SSD | 5Mbps |
| 测试 | 2核 | 4GB | 40GB SSD | 10Mbps |
| 生产 | 4核 | 8GB+ | 100GB SSD | 20Mbps+ |

---

## 1.5 构建要求（Phase 1 更新）

**重要：** 项目已启用严格的构建门禁：

| 配置项 | 状态 | 说明 |
|--------|------|------|
| `typescript.ignoreBuildErrors` | `false` | TS 类型错误将阻塞构建 |
| `eslint.ignoreDuringBuilds` | `false` | ESLint 错误将阻塞构建 |
| `images.unoptimized` | 已移除 | 启用 Next.js 图片优化 |

**部署前必须通过：**
```bash
pnpm lint          # ESLint 检查
pnpm build         # TypeScript + Next.js 构建
```

**环境变量配置：**

所有环境必须配置以下变量（参考 `.env.local`）：

| 变量 | 开发 | 测试 | 生产 |
|------|------|------|------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080/api/v1` | `https://staging-api.yyc3.cn/api/v1` | `https://api.yyc3.cn/api/v1` |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:8080/api/ws` | `wss://staging-api.yyc3.cn/api/ws` | `wss://api.yyc3.cn/api/ws` |
| `NEXT_PUBLIC_ENV` | `development` | `staging` | `production` |
| `FOUNDRY_AGENT_ENDPOINT` | 空 | Foundry Staging URL | Foundry Prod URL |
| `FOUNDRY_AGENT_API_KEY` | 空 | Staging Key | Prod Key |

---

## 2. Docker 部署

### 2.1 Dockerfile（多阶段构建）

```dockerfile
# 阶段1：依赖安装
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 阶段2：构建
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# 阶段3：运行
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 2.2 Docker Compose（开发环境）

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://backend:8080/api/v1
      - NEXT_PUBLIC_WS_URL=ws://backend:8080/api/ws
    depends_on:
      - backend
      - postgres
    restart: unless-stopped

  backend:
    image: yyc3-backend:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/yyc3
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=yyc3
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 2.3 Docker 常用命令

```bash
# 构建镜像
docker build -t yyc3-dashboard:latest .

# 启动全部服务
docker compose up -d

# 查看日志
docker compose logs -f app

# 重启服务
docker compose restart app

# 停止全部服务
docker compose down

# 清理资源
docker compose down -v --rmi all
```

---

## 3. Nginx 反向代理配置

### 3.1 生产环境 Nginx 配置

```nginx
upstream yyc3_frontend {
    server 127.0.0.1:3000;
}

upstream yyc3_backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name app.yyc3.cn;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.yyc3.cn;

    ssl_certificate /etc/nginx/ssl/app.yyc3.cn.pem;
    ssl_certificate_key /etc/nginx/ssl/app.yyc3.cn.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;" always;

    # 前端
    location / {
        proxy_pass http://yyc3_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://yyc3_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 请求体大小限制
        client_max_body_size 10m;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket
    location /api/ws {
        proxy_pass http://yyc3_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400s;
    }

    # 静态资源缓存
    location /_next/static {
        proxy_pass http://yyc3_frontend;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # 图片缓存
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://yyc3_frontend;
        expires 30d;
        add_header Cache-Control "public";
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
}
```

---

## 4. CI/CD 流水线

### 4.1 GitHub Actions 配置

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [develop]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'

jobs:
  lint-and-typecheck:
    name: Lint & TypeCheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: npx tsc --noEmit

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test -- --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .next/

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Staging
        run: |
          echo "Deploying to staging environment..."
          # docker build and push to staging registry
          # kubectl apply -f k8s/staging/

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: |
          echo "Deploying to production environment..."
          # docker build and push to production registry
          # kubectl apply -f k8s/production/
```

---

## 5. 监控与告警

### 5.1 应用监控

| 监控项 | 工具 | 告警阈值 |
|--------|------|---------|
| 错误追踪 | Sentry | 错误率 > 1% |
| 性能指标 | Web Vitals | LCP > 2.5s / FID > 100ms / CLS > 0.1 |
| 服务可用性 | Uptime Robot | 可用率 < 99.9% |
| 服务器资源 | Prometheus + Grafana | CPU > 80% / 内存 > 85% |
| 日志聚合 | ELK / Loki | ERROR 级别日志 |

### 5.2 关键业务指标

| 指标 | 监控方式 | 告警条件 |
|------|---------|---------|
| API 响应时间 | APM | P99 > 3s |
| 订单创建成功率 | 业务日志 | 成功率 < 95% |
| 支付成功率 | 业务日志 | 成功率 < 99% |
| WebSocket 连接数 | 服务端指标 | 连接数突降 50%+ |
| 库存预警数 | 业务数据 | 预警商品 > 10 |

### 5.3 Sentry 配置

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

---

## 6. 备份与恢复

### 6.1 数据库备份策略

| 备份类型 | 频率 | 保留期 | 存储位置 |
|---------|------|--------|---------|
| 全量备份 | 每日 02:00 | 30 天 | OSS/S3 |
| 增量备份 | 每小时 | 7 天 | OSS/S3 |
| 日志备份 | 实时 | 90 天 | 日志服务 |

### 6.2 备份脚本

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="yyc3"

# PostgreSQL 全量备份
docker exec postgres pg_dump -U postgres $DB_NAME | gzip > $BACKUP_DIR/db_${DATE}.sql.gz

# 上传到 OSS
# aliyun oss cp $BACKUP_DIR/db_${DATE}.sql.gz oss://yyc3-backups/db/

# 清理 30 天前的备份
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_${DATE}.sql.gz"
```

---

## 7. 故障处理

### 7.1 常见故障及处理

| 故障现象 | 可能原因 | 处理步骤 |
|---------|---------|---------|
| 页面白屏 | 构建失败 / CDN 故障 | 1. 检查构建日志 2. 回滚版本 3. 清除 CDN 缓存 |
| API 502 | 后端服务宕机 | 1. 检查容器状态 2. 重启服务 3. 检查数据库连接 |
| 登录失败 | Token 服务异常 | 1. 检查认证服务 2. 清除 Redis 缓存 3. 检查密钥配置 |
| 数据不同步 | WebSocket 断连 | 1. 检查 WS 服务状态 2. 重连测试 3. 检查网络策略 |
| 页面加载慢 | 资源未缓存 / API 慢 | 1. 检查 CDN 命中率 2. 分析慢查询 3. 优化图片资源 |

### 7.2 应急联系

| 角色 | 职责 | 联系方式 |
|------|------|---------|
| 前端负责人 | 前端问题排查与修复 | - |
| 后端负责人 | API 问题排查与修复 | - |
| 运维工程师 | 服务器/网络问题处理 | - |
| 产品经理 | 业务决策与优先级 | - |

---

## 8. 版本发布

### 8.1 版本号规范（Semantic Versioning）

```
MAJOR.MINOR.PATCH

MAJOR: 不兼容的 API 变更
MINOR: 向后兼容的功能新增
PATCH: 向后兼容的问题修复
```

### 8.2 发布流程

```
1. 创建 release 分支: release/vX.Y.Z
2. 更新 CHANGELOG.md
3. 更新 package.json 版本号
4. 执行全量测试
5. 合并到 main 和 develop
6. 打 Tag: vX.Y.Z
7. 触发 CI/CD 自动部署
8. 发布 Release Notes
```

### 8.3 回滚方案

```bash
# 查看历史版本
docker images | grep yyc3-dashboard

# 回滚到上一版本
docker compose down
docker tag yyc3-dashboard:previous yyc3-dashboard:latest
docker compose up -d

# 或通过 K8s 回滚
kubectl rollout undo deployment/yyc3-dashboard -n yyc3
```
