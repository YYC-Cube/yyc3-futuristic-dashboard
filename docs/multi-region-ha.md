# YYC3 智慧商家管理系统 - 多区域高可用架构

> **版本**: v1.0.0  
> **更新日期**: 2026-05-22  
> **架构模式**: Active-Passive (主备) + Active-Active (多活)

---

## 📋 目录

1. [架构概述](#1-架构概述)
2. [区域部署策略](#2-区域部署策略)
3. [数据同步方案](#3-数据同步方案)
4. [故障切换机制](#4-故障切换机制)
5. [DNS 全局负载均衡](#5-dns-全局负载均衡)
6. [监控与告警](#6-监控与告警)
7. [灾难恢复流程](#7-灾难恢复流程)

---

## 1. 架构概述

### 1.1 设计目标

| 目标 | 指标 | 实现方式 |
|------|------|---------|
| **RPO** (Recovery Point Objective) | < 5 分钟 | 数据库实时复制 + 增量备份 |
| **RTO** (Recovery Time Objective) | < 15 分钟 | 自动故障切换 + 预热实例 |
| **可用性** | 99.99% (年度) | 多区域冗余 + 自动扩缩容 |
| **数据一致性** | 最终一致性 | 异步复制 + 冲突解决 |

### 1.2 架构图

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   Global CDN    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │  亚太区域     │ │  美东区域     │ │  欧洲区域     │
     │  (Primary)   │ │  (Secondary) │ │  (Tertiary)  │
     │  Tokyo       │ │  Virginia    │ │  Frankfurt   │
     ├──────────────┤ ├──────────────┤ ├──────────────┤
     │ ALB + WAF    │ │ ALB + WAF    │ │ ALB + WAF    │
     │ EC2 Auto     │ │ EC2 Auto     │ │ EC2 Auto     │
     │ Scaling      │ │ Scaling      │ │ Scaling      │
     ├──────────────┤ ├──────────────┤ ├──────────────┤
     │ RDS Primary  │ │ RDS Read     │ │ RDS Read     │
     │ (Multi-AZ)  │ │ Replica      │ │ Replica      │
     ├──────────────┤ ├──────────────┤ ├──────────────┤
     │ ElastiCache  │ │ ElastiCache  │ │ ElastiCache  │
     │ (Cluster)   │ │ (Replica)    │ │ (Replica)    │
     └──────────────┘ └──────────────┘ └──────────────┘
              │              │              │
              └──────────────┴──────────────┘
                             │
                    ┌────────┴────────┐
                    │   S3 Cross-     │
                    │   Region        │
                    │   Replication   │
                    └─────────────────┘
```

---

## 2. 区域部署策略

### 2.1 区域选择

| 角色 | AWS 区域 | 用途 | 延迟目标 |
|------|---------|------|---------|
| **Primary** | ap-northeast-1 (Tokyo) | 主服务亚太用户 | < 50ms |
| **Secondary** | us-east-1 (Virginia) | 服务美洲用户 + 灾备 | < 100ms |
| **Tertiary** | eu-central-1 (Frankfurt) | 服务欧洲用户 | < 80ms |

### 2.2 实例配置

#### Primary Region (Production)
```yaml
AutoScalingGroup:
  MinSize: 3
  MaxSize: 10
  DesiredCapacity: 5
  
InstanceType:
  - c6i.xlarge (4 vCPU, 8 GB RAM)
  - c6i.2xlarge (8 vCPU, 16 GB RAM) # 高峰期自动扩展

Database:
  Engine: PostgreSQL 15
  Instance: db.r6g.xlarge (Multi-AZ)
  Storage: 1000 GB gp3 (IOPS: 12000)
  
Cache:
  Engine: Redis 7 (Cluster Mode)
  Node: cache.r6g.large (3 shards, 2 replicas each)
```

#### Secondary/Tertiary Regions (DR)
```yaml
AutoScalingGroup:
  MinSize: 1
  MaxSize: 5
  DesiredCapacity: 2  # 低配运行，节省成本
  
InstanceType:
  - c6i.large (2 vCPU, 4 GB RAM)

Database:
  Type: Read Replica (异步复制)
  Instance: db.r6g.large
  
Cache:
  Type: Replication Group (单向同步)
```

### 2.3 成本优化策略

| 策略 | 实现 | 节省比例 |
|------|------|---------|
| **Reserved Instances** | 1 年期预留（Primary） | ~30% |
| **Spot Instances** | 处理非关键任务（报表生成） | ~70% |
| **Auto Scaling** | 按需动态调整 | ~25% |
| **S3 Intelligent-Tiering** | 自动存储分层 | ~20% |

---

## 3. 数据同步方案

### 3.1 数据库复制

#### PostgreSQL 逻辑复制配置

```sql
-- Primary 节点配置
ALTER SYSTEM SET wal_level = logical;
ALTER SYSTEM SET max_replication_slots = 10;
ALTER SYSTEM SET max_wal_senders = 10;

-- 创建发布
CREATE PUBLICATION yyc3_publication FOR ALL TABLES;

-- Secondary 节点订阅
CREATE SUBSCRIPTION yyc3_subscription
CONNECTION 'host=primary-db.example.com dbname=yyc3 user=replicator password=xxx'
PUBLICATION yyc3_publication
WITH (copy_data = true, create_slot = true);
```

#### 复制延迟监控

```bash
# 检查复制状态
SELECT 
  client_addr,
  state,
  sent_lsn,
  write_lsn,
  flush_lsn,
  replay_lgn,
  EXTRACT(EPOCH FROM (now() - replay_timestamp))::int AS lag_seconds
FROM pg_stat_replication;
```

### 3.2 缓存同步

#### Redis Cross-Region Replication

```bash
# 配置 Global Datastore (AWS)
aws elasticache create-global-replication-group \
  --global-replication-group-id-suffix yyc3 \
  --primary-replication-group-id primary-cache \
  --replication-group-id secondary-cache \
  --region us-east-1
```

#### 应用层缓存失效策略

```typescript
// lib/cache/invalidation.ts
export class CacheInvalidationService {
  private snsClient: SNSClient;

  async invalidateCache(keyPattern: string, region?: string) {
    const message = {
      action: 'invalidate',
      pattern: keyPattern,
      timestamp: Date.now(),
      sourceRegion: process.env.AWS_REGION!,
    };

    // 发布到 SNS Topic，所有区域订阅
    await this.snsClient.send(new PublishCommand({
      TopicArn: process.env.CACHE_INVALIDATION_TOPIC_ARN!,
      Message: JSON.stringify(message),
    }));
  }

  async handleInvalidation(message: CacheInvalidationMessage) {
    if (message.sourceRegion === process.env.AWS_REGION) return; // 忽略自身消息

    const redis = this.getRedisClient();
    const keys = await redis.keys(message.pattern);
    
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Cache] Invalidated ${keys.length} keys in ${process.env.AWS_REGION}`);
    }
  }
}
```

### 3.3 文件存储同步

#### S3 Cross-Region Replication (CRR)

```json
{
  "Role": "arn:aws:iam::account-id:role/CRR-Role",
  "Rules": [
    {
      "Status": "Enabled",
      "Priority": 1,
      "Filter": {},
      "Destination": {
        "Bucket": "arn:aws:s3:::yyc3-backup-us-east",
        "StorageClass": "STANDARD"
      },
      "DeleteMarkerReplication": { "Status": "Disabled" }
    }
  ]
}
```

---

## 4. 故障切换机制

### 4.1 自动故障检测

#### Route 53 Health Checks

```bash
# 创建端点健康检查
aws route53 create-health-check \
  --caller-reference yyc3-tokyo-health-check \
  --health-check-config \
    IPAddress=10.0.1.10,Port=3000,Type=HTTPS,\
    ResourcePath=/api/health,RequestInterval=30,\
    FailureThreshold=3,MeasureLatency=true
```

#### CloudWatch 告警规则

```yaml
# cloudwatch-alarms.yaml
- AlarmName: yyc3-primary-unhealthy
  MetricName: UnHealthyHostCount
  Namespace: AWS/ApplicationELB
  Statistic: Maximum
  Period: 60
  EvaluationPeriods: 2
  Threshold: 0
  ComparisonOperator: GreaterThanThreshold
  Dimensions:
    - Name: TargetGroup
      Value: yyc3-tg
  AlarmActions:
    - arn:aws:sns:region:account:yyc3-alerts
  OKActions:
    - arn:aws:lambda:region:account:failover-to-secondary
```

### 4.2 DNS 故障切换

#### Route 53 Failover Routing Policy

```bash
# Primary 记录 (Failover: PRIMARY)
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '
  {
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "dashboard.yyc3.com.",
        "Type": "A",
        "SetIdentifier": "tokyo-primary",
        "Failover": "PRIMARY",
        "TTL": 60,
        "ResourceRecords": [{"Value": "ALB-DNS-NAME"}],
        "HealthCheckId": "HEALTH-CHECK-ID"
      }
    }]
  }'

# Secondary 记录 (Failover: SECONDARY)
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '
  {
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "dashboard.yyc3.com.",
        "Type": "A",
        "SetIdentifier": "us-east-secondary",
        "Failover": "SECONDARY",
        "TTL": 60,
        "ResourceRecords": [{"Value": "ALB-DNS-NAME"}],
        "HealthCheckId": "HEALTH-CHECK-ID"
      }
    }]
  }'
```

### 4.3 Lambda 自动故障切换函数

```typescript
// lambda/failover-handler.ts
import { Route53Client, ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route53';
import { RDSClient, PromoteReadReplicaCommand } from '@aws-sdk/client-rds';

const route53 = new Route53Client();
const rds = new RDSClient();

exports.handler = async (event: any) => {
  console.log('Received failover event:', JSON.stringify(event));

  try {
    if (event.detail.state.value === 'ALARM') {
      console.log('Initiating failover to secondary region...');

      // 1. 提升 Secondary DB 为 Primary
      await rds.send(new PromoteReadReplicaCommand({
        DBInstanceIdentifier: 'yyc3-db-secondary',
      }));

      // 2. 更新 DNS 指向 Secondary
      await route53.send(new ChangeResourceRecordSetsCommand({
        HostedZoneId: process.env.HOSTED_ZONE_ID!,
        ChangeBatch: {
          Changes: [{
            Action: 'UPSERT',
            ResourceRecordSet: {
              Name: 'dashboard.yyc3.com.',
              Type: 'CNAME',
              TTL: 30,
              ResourceRecords: [{ Value: 'secondary-alb-xxxx.us-east-1.elb.amazonaws.com' }],
            },
          }],
        },
      }));

      // 3. 发送通知
      await sendSlackNotification('🚨 Failover completed to US-East region');

      return { statusCode: 200, body: 'Failover successful' };
    }
  } catch (error) {
    console.error('Failover failed:', error);
    await sendSlackNotification(`❌ Failover failed: ${error.message}`);
    throw error;
  }
};
```

---

## 5. DNS 全局负载均衡

### 5.1 GeoDNS 配置

```bash
# 基于地理位置的路由
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '
  {
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "global.yyc3.com.",
        "Type": "A",
        "GeoLocation": {
          "ContinentCode": "AS",
          "CountryCode": "JP",
          "SubdivisionCode": "13"  # Tokyo
        },
        "TTL": 60,
        "ResourceRecords": [{"Value": "TOKYO-ALB-IP"}]
      }
    }, {
      "Action": "CREATE", 
      "ResourceRecordSet": {
        "Name": "global.yyc3.com.",
        "Type": "A",
        "GeoLocation": {
          "ContinentCode": "NA",
          "CountryCode": "US"
        },
        "TTL": 60,
        "ResourceRecords": [{"Value": "US-EAST-ALB-IP"}]
      }
    }, {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "global.yyc3.com.",
        "Type": "A",
        "GeoLocation": {
          "ContinentCode": "EU"
        },
        "TTL": 60,
        "ResourceRecords": [{"Value": "FRANKFURT-ALB-IP"}]
      }
    }]
  }'
```

### 5.2 延迟路由 (Latency-Based Routing)

```bash
# 最优延迟路由
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '
  {
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "low-latency.yyc3.com.",
        "Type": "A",
        "RoutingPolicy": "latency",
        "SetIdentifiers": ["tokyo-lr", "useast-lr", "frankfurt-lr"],
        "Records": [
          {"Region": "ap-northeast-1", "Value": "TOKYO-IP"},
          {"Region": "us-east-1", "Value": "USEAST-IP"},
          {"Region": "eu-central-1", "Value": "FRANKFURT-IP"}
        ],
        "HealthCheckId": "GLOBAL-HEALTH-CHECK"
      }
    }]
  }'
```

---

## 6. 监控与告警

### 6.1 多区域监控仪表板 (Grafana)

```json
{
  "dashboard": {
    "title": "YYC3 Multi-Region Monitoring",
    "panels": [
      {
        "title": "Regional Latency",
        "type": "graph",
        "targets": [
          {"expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{region='tokyo'}[5m]))", "legendFormat": "Tokyo p95"},
          {"expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{region='useast'}[5m]))", "legendFormat": "US-East p95"}
        ]
      },
      {
        "title": "Replication Lag",
        "type": "gauge",
        "targets": [
          {"expr": "pg_stat_replication_replay_lag_seconds", "legendFormat": "DB Replication Lag"}
        ]
      },
      {
        "title": "Cross-Region Traffic Cost",
        "type": "stat",
        "targets": [
          {"expr": "aws_billing_estimated_charges{service='AWSDataTransfer'}", "legendFormat": "Data Transfer ($)"}
        ]
      }
    ]
  }
}
```

### 6.2 关键指标告警

| 指标 | 阈值 | 严重级别 | 响应时间 |
|------|------|---------|---------|
| **P95 延迟** > 500ms | Critical | 5 分钟 | 立即处理 |
| **错误率** > 1% | Warning | 10 分钟 | 排查原因 |
| **DB 复制延迟** > 60s | Critical | 2 分钟 | 检查网络 |
| **缓存命中率** < 90% | Warning | 15 分钟 | 优化策略 |
| **跨区域流量** > $100/天 | Info | 每日 | 成本审查 |

### 6.3 Slack/PagerDuty 集成

```typescript
// lib/monitoring/alerts.ts
import * as Sentry from "@sentry/nextjs";

interface AlertPayload {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  region: string;
  metric?: string;
  value?: number;
}

export async function sendAlert(alert: AlertPayload) {
  // 1. Sentry 事件
  Sentry.captureMessage(`[${alert.severity.toUpperCase()}] ${alert.title}`, {
    level: alert.severity === 'critical' ? 'error' : 'warning',
    extra: alert,
  });

  // 2. Slack Webhook
  if (process.env.SLACK_WEBHOOK_URL) {
    const slackEmoji = {
      critical: ':red_circle:',
      warning: ':warning:',
      info: ':information_source:',
    };

    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${slackEmoji[alert.severity]} *[${alert.severity.toUpperCase()}]* ${alert.title}`,
        attachments: [{
          color: alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'good',
          fields: [
            { title: 'Region', value: alert.region, short: true },
            { title: 'Metric', value: alert.metric || 'N/A', short: true },
            { title: 'Value', value: String(alert.value || 'N/A'), short: true },
            { title: 'Message', value: alert.message, short: false },
          ],
          ts: Math.floor(Date.now() / 1000),
        }],
      }),
    });
  }

  // 3. PagerDuty (仅 Critical)
  if (alert.severity === 'critical' && process.env.PAGERDUTY_INTEGRATION_KEY) {
    await fetch(`https://events.pagerduty.com/v2/enqueue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routing_key: process.env.PAGERDUTY_INTEGRATION_KEY,
        event_action: 'trigger',
        payload: {
          summary: `[YYC3] ${alert.title}`,
          severity: 'critical',
          source: 'yyc3-dashboard',
          custom_details: alert,
        },
      }),
    });
  }
}
```

---

## 7. 灾难恢复流程

### 7.1 DR 演练计划

| 频率 | 类型 | 范围 | 目标 |
|------|------|------|------|
| **每月** | 桌面演练 | 文档审查 | 验证流程完整性 |
| **每季度** | 模拟故障 | 单区域 | RTO < 15 分钟 |
| **每年** | 全面演练 | 全局故障 | RTO < 30 分钟 |

### 7.2 恢复步骤清单

#### 场景：Primary Region 完全故障

```markdown
## 灾难恢复执行清单

### Phase 1: 检测与评估 (0-5 分钟)
- [ ] 收到 CloudWatch/Sentry 告警
- [ ] 确认 Primary Region 不可用
- [ ] 通知 on-call 团队
- [ ] 启动事故响应频道 (#incident-yyc3)

### Phase 2: 切换执行 (5-15 分钟)
- [ ] 登录 AWS Console (Secondary Region)
- [ ] 执行 Lambda 函数: promote-db-and-update-dns
- [ ] 验证 Secondary DB 提升成功
- [ ] 确认 DNS 已更新 (TTL 60s)
- [ ] 测试应用可访问性

### Phase 3: 验证 (15-20 分钟)
- [ ] 执行冒烟测试 (Smoke Test)
- [ ] 验证核心功能正常:
  - [ ] 用户登录
  - [ ] 包厢查询
  - [ ] 点单功能
  - [ ] 订单创建
- [ ] 检查数据库数据完整性
- [ ] 监控系统性能指标

### Phase 4: 通信 (20-30 分钟)
- [ ] 更新 Status Page (status.yyc3.com)
- [ ] 发送客户通知邮件
- [ ] 发布内部事故报告
- [ ] 安排 Post-Mortem 会议

### Phase 5: 恢复 (根据情况)
- [ ] 修复 Primary Region 问题
- [ ] 设置反向复制 (Secondary → Primary)
- [ ] 切换回 Primary (维护窗口期间)
- [ ] 更新文档和 Runbook
```

### 7.3 备份验证脚本

```bash
#!/bin/bash
# scripts/verify-backup.sh

set -e

echo "🔄 Starting backup verification..."

# 1. 检查数据库备份
BACKUP_ID=$(aws rds describe-db-snapshots \
  --db-instance-identifier yyc3-db-primary \
  --query 'max_by(SnapshotCreateTime, &SnapshotCreateTime).DBSnapshotIdentifier' \
  --output text)

if [ -z "$BACKUP_ID" ]; then
  echo "❌ No recent backup found!"
  exit 1
fi

echo "✅ Latest backup: $BACKUP_ID"

# 2. 从快照恢复测试实例
echo "🔄 Creating test instance from backup..."
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier yyc3-db-verify \
  --db-snapshot-identifier "$BACKUP_ID" \
  --db-instance-class db.t3.micro \
  --no-multi-az > /dev/null

echo "⏳ Waiting for restore to complete..."
aws rds wait db-instance-available \
  --db-instance-identifier yyc3-db-verify

# 3. 运行数据完整性检查
echo "🔍 Running integrity checks..."
PGPASSWORD=$(get-password-from-secrets-manager) psql \
  -h $(aws rds describe-db-instances --db-instance-identifier yyc3-db-verify \
    --query 'DBInstances[0].Endpoint.Address' --output text) \
  -U admin -d yyc3 -c "
    SELECT 
      COUNT(*) AS total_orders,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_orders,
      MAX(created_at) AS latest_order
    FROM orders;
  "

# 4. 清理测试实例
echo "🧹 Cleaning up test instance..."
aws rds delete-db-instance \
  --db-instance-identifier yyc3-db-verify \
  --skip-final-snapshot \
  --no-delete-automated-backups > /dev/null

echo "✅ Backup verification completed successfully!"
```

---

## 📊 成本估算

| 组件 | 月成本 (USD) | 备注 |
|------|-------------|------|
| **EC2 (3 regions)** | $800-1500 | Auto Scaling 动态调整 |
| **RDS (Multi-AZ + 2 Replicas)** | $1200-2000 | 根据存储使用量 |
| **ElastiCache (Cluster)** | $400-600 | 3 分片集群 |
| **ALB + WAF** | $200-300 | 按请求计费 |
| **Route 53 + CloudFront** | $50-100 | 流量相关 |
| **S3 + Glacier** | $100-200 | 备份存储 |
| **CloudWatch + SNS** | $50-100 | 监控告警 |
| **总计** | **$2800-4800** | 生产环境预估 |

---

## 🔒 安全考虑

1. **加密传输**: TLS 1.3 强制启用
2. **静态加密**: KMS 管理的加密密钥
3. **VPC 隔离**: 私有子网 + Security Groups
4. **IAM 最小权限**: 角色基于任务分配
5. **审计日志**: CloudTrail 全局启用
6. **合规性**: SOC 2 / ISO 27001 / GDPR

---

> **最后更新**: 2026-05-22  
> **维护团队**: DevOps / SRE Team  
> **审核周期**: 季度
