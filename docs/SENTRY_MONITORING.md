# YYC3 Dashboard 监控告警集成方案

## 🎯 概述

本文档描述YYC3 Dashboard的Sentry错误追踪与监控告警系统的完整配置和使用指南。

## 📊 当前集成状态

### ✅ 已完成的集成

- [x] Sentry SDK安装（@sentry/nextjs）
- [x] 客户端错误追踪（sentry.client.config.ts）
- [x] 服务端错误追踪（sentry.server.config.ts）
- [x] 404页面错误捕获
- [x] 全局错误边界组件
- [x] 性能监控基础配置

### 🔧 配置详情

#### 客户端配置（sentry.client.config.ts）

```typescript
// 已启用功能：
- 错误追踪（Error Tracking）
- 性能监控（Performance Monitoring）
- 会话回放（Session Replay，10%采样）
- 错误回放（Error Replay，100%采样）
- 浏览器性能追踪

// 采样率配置：
- tracesSampleRate: 1.0 (100%性能追踪)
- replaysSessionSampleRate: 0.1 (10%会话回放)
- replaysOnErrorSampleRate: 1.0 (100%错误回放)
```

#### 服务端配置（sentry.server.config.ts）

```typescript
// 已启用功能：
- API错误追踪
- HTTP请求监控
- 服务器端性能追踪

// 集成模块：
- httpIntegration: HTTP请求面包屑
```

## 🚨 告警规则配置

### 关键告警规则

#### 1. 错误率突增检测
```yaml
alert_rule_name: "错误率突增"
trigger_condition:
  metric: "error_count"
  threshold: "50% increase in 5 minutes"
severity: critical
notification_channels:
  - email: devops@yyc3.com
  - slack: #yyc3-alerts
response_actions:
  - 自动创建GitHub Issue
  - 发送紧急通知给on-call工程师
```

#### 2. 性能退化告警
```yaml
alert_rule_name: "页面加载时间超标"
trigger_condition:
  metric: "lcp (Largest Contentful Paint)"
  threshold: "> 4.0 seconds for 3+ consecutive checks"
severity: warning
notification_channels:
  - slack: #yyc3-performance
  - email: frontend-team@yyc3.com
```

#### 3. API失败率告警
```yaml
alert_rule_name: "API端点高失败率"
trigger_condition:
  metric: "api_error_rate"
  threshold: "> 1% for any endpoint"
severity: critical
notification_channels:
  - pagerduty: yyc3-oncall
  - slack: #yyc3-api-alerts
```

## 📈 自定义监控指标

### 业务指标定义

#### 1. 用户操作成功率
```typescript
// 在关键操作中添加自定义指标
import * as Sentry from "@sentry/nextjs"

export function trackUserAction(actionName: string, success: boolean, metadata?: Record<string, any>) {
  Sentry.addBreadcrumb({
    category: 'user.action',
    message: `${actionName}: ${success ? 'success' : 'failed'}`,
    level: success ? 'info' : 'error',
    data: metadata,
  })
  
  if (!success) {
    Sentry.captureMessage(`User action failed: ${actionName}`, {
      level: 'warning',
      extra: metadata,
    })
  }
}

// 使用示例
trackUserAction('order_create', true, { orderId: '123', amount: 99.9 })
trackUserAction('payment_process', false, { reason: 'timeout' })
```

#### 2. 页面停留时间
```typescript
export function trackPageEngagement(pageName: string) {
  const startTime = Date.now()
  
  return () => {
    const duration = Date.now() - startTime
    
    Sentry.metrics.increment('page.engagement_time', duration / 1000, {
      tags: { page: pageName },
      unit: 'second',
    })
    
    if (duration < 5000) {
      // 用户快速离开，可能表示问题
      Sentry.captureMessage(`Quick page exit: ${pageName}`, {
        level: 'info',
        extra: { duration_ms: duration },
      })
    }
  }
}
```

#### 3. 功能使用统计
```typescript
export function trackFeatureUsage(featureName: string, variant?: string) {
  Sentry.metrics.increment('feature.usage', 1, {
    tags: { 
      feature: featureName,
      variant: variant || 'default',
    },
  })
  
  // 记录到面包屑以便调试
  Sentry.addBreadcrumb({
    category: 'feature',
    message: `Feature used: ${featureName}`,
    data: { variant },
  })
}
```

## 🔍 错误分类和处理

### 错误级别定义

| 级别 | 描述 | 示例 | 处理方式 |
|------|------|------|---------|
| **fatal** | 应用完全不可用 | 白屏、路由崩溃 | 立即告警 + 自动回滚 |
| **error** | 功能无法使用 | API调用失败、组件崩溃 | 创建Issue + 通知团队 |
| **warning** | 功能降级但可用 | 部分数据加载失败 | 记录日志 + 监控趋势 |
| **info** | 正常业务事件 | 用户操作、页面访问 | 仅记录用于分析 |
| **debug** | 调试信息 | 开发环境详细信息 | 开发环境记录 |

### 常见错误处理模式

#### 1. API错误包装器
```typescript
async function withErrorTracking<T>(
  apiCall: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await apiCall()
  } catch (error) {
    Sentry.captureException(error, {
      tags: { 
        type: 'api_error',
        context,
      },
      extra: {
        timestamp: new Date().toISOString(),
        url: window.location.href,
      },
    })
    
    // 根据错误类型返回用户友好的消息
    if (error instanceof NetworkError) {
      throw new UserFacingError('网络连接失败，请检查网络')
    } else if (error instanceof AuthError) {
      throw new UserFacingError('登录已过期，请重新登录')
    }
    
    throw error
  }
}
```

#### 2. 组件错误边界增强
```typescript
class MonitoredErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        error_boundary: this.props.name || 'unknown',
      },
    })
    
    // 可选：上报到自定义后端
    reportToCustomService(error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />
    }
    
    return this.props.children
  }
}
```

## 📱 移动端和跨平台监控

### React Native扩展（如果需要）
```typescript
// 如果未来有移动端应用
import * as Sentry from "@sentry/react-native"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
  
  integrations: [
    new Sentry.ReactNativeTracing({
      tracingOrigins: ['localhost', /^\/api/],
    }),
  ],
})
```

## 🔧 开发和调试工具

### 本地开发Sentry配置

```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN="your-dsn-here"
NEXT_PUBLIC_ENV="development"
# 在开发环境也启用Sentry（可选）
NODE_ENV="development"

# 启用详细日志
SENTRY_LOG_LEVEL=debug
```

### Sentry DevTools
```bash
# 安装Sentry DevTools浏览器扩展
# 或者在代码中启用调试模式

if (process.env.NODE_ENV === 'development') {
  Sentry.showReportDialog({ 
    eventId: lastEventId,
    title: '开发模式错误报告',
  })
}
```

## 📊 报表和可视化

### 推荐的Dashboard面板

#### 1. 错误概览面板
- 错误数量趋势图（24小时/7天/30天）
- 未解决错误列表
- 错误分布（按类型/页面/用户）

#### 2. 性能监控面板
- 页面加载时间趋势
- Core Web Vitals分数
- API响应时间分布
- 用户满意度（Apdex）

#### 3. 业务影响面板
- 受影响用户数
- 错误导致的转化损失
- 关键路径成功率

## 🔄 持续改进流程

### 每周审查任务

1. **错误回顾会议**（每周一）
   - 审查新出现的错误
   - 确定优先级修复项
   - 分配责任人

2. **性能趋势分析**（每周三）
   - 检查Core Web Vitals变化
   - 识别性能退化原因
   - 制定优化计划

3. **告警规则调优**（每周五）
   - 回顾误报情况
   - 调整阈值
   - 优化通知策略

## 📚 相关文档

- [Sentry官方文档](https://docs.sentry.io/)
- [Next.js集成指南](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [性能监控最佳实践](https://docs.sentry.io/product/performance/)
- [错误追踪最佳实践](https://docs.sentry.io/product/error-monitoring/best-practices/)

## 🎯 下一步行动项

### 高优先级（本周完成）
- [ ] 配置生产环境DSN
- [ ] 设置初始告警规则
- [ ] 团队成员接收通知配置

### 中优先级（本月完成）
- [ ] 实施自定义业务指标
- [ ] 建立错误分类体系
- [ ] 创建监控Dashboard

### 低优先级（下季度）
- [ ] 集成性能预算系统
- [ ] 实施自动化错误修复建议
- [ ] 建立错误预测模型
