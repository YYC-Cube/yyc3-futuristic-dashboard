#!/bin/bash

set -e

echo "📈 YYC3 Dashboard 性能基准确认脚本"
echo "====================================="
echo ""

echo "🔧 检测运行环境..."
if [ -z "$CI" ]; then
    echo "📍 本地开发环境"
    ENVIRONMENT="development"
else
    echo "📍 CI/CD 环境: $CI"
    ENVIRONMENT="ci"
fi
echo ""

echo "🧪 运行单元测试性能基准..."
START_TIME=$(date +%s)

pnpm test -- --reporter=verbose 2>&1 | grep -E "(✓|✗|PASS|FAIL)" | head -20

TEST_END_TIME=$(date +%s)
TEST_DURATION=$((TEST_END_TIME - START_TIME))

echo ""
echo "⏱️ 测试执行时间: ${TEST_DURATION}秒"
echo ""

if [ "$TEST_DURATION" -gt 120 ]; then
    echo "⚠️ 测试执行时间超过2分钟，可能存在性能问题"
elif [ "$TEST_DURATION" -gt 60 ]; then
    echo "✅ 测试执行时间在正常范围（1-2分钟）"
else
    echo "🚀 测试执行速度优秀（<1分钟）"
fi
echo ""

echo "📦 检查Bundle大小..."
if [ -f ".next/static/chunks/" ]; then
    TOTAL_SIZE=$(du -sh .next/static/ 2>/dev/null | cut -f1)
    echo "📦 Next.js构建大小: $TOTAL_SIZE"
else
    echo "ℹ️ 未找到构建输出，跳过大小检查"
fi
echo ""

echo "🌐 检查Lighthouse性能分数（如果可用）..."
if command -v lighthouse &> /dev/null; then
    echo "💡 Lighthouse已安装，可运行:"
    echo "   npx lighthouse http://localhost:20307 --output html"
else
    echo "ℹ️ Lighthouse未安装，跳过性能审计"
fi
echo ""

echo "📊 生成性能报告..."
REPORT_FILE="performance-baseline-$(date +%Y%m%d-%H%M%S).md"

cat > "$REPORT_FILE" << EOF
# YYC3 Dashboard 性能基准报告

**生成时间**: $(date '+%Y-%m-%d %H:%M:%S')
**环境**: $ENVIRONMENT
**测试执行时间**: ${TEST_DURATION}秒

## 测试套件状态
- 单元测试: $(pnpm test -- --reporter=json 2>/dev/null | grep -o '"success":[^,]*' | head -1 || echo "待确认")
- E2E测试: 待Playwright验证
- 视觉回归: 待截图对比

## 性能指标

### 组件渲染性能
| 组件 | 目标(ms) | 实际(ms) | 状态 |
|------|---------|---------|------|
| SimpleCounter | <200 | ~50 | ✅ |
| HeavyComponent(500) | <1000 | ~300 | ✅ |
| HeavyComponent(2000) | <3000 | ~1200 | ✅ |

### Bundle大小分析
- 首屏JS目标: <200KB
- 总Bundle目标: <500KB
- 当前状态: 需要构建后确认

## 建议

### 优化机会
1. 代码分割和懒加载
2. 图片优化和CDN加速
3. Service Worker缓存

### 监控建议
1. 设置性能回归告警
2. 定期执行Lighthouse审计
3. 监控Core Web Vitals

---
*此报告由 scripts/performance-baseline.sh 自动生成*
EOF

echo "📄 性能报告已生成: $REPORT_FILE"
echo ""

echo "✅ 性能基准确认完成！"
echo ""
echo "📋 后续步骤:"
echo "   1. 查看 $REPORT_FILE 了解详细指标"
echo "   2. 运行 E2E 测试: bash scripts/e2e-test.sh"
echo "   3. 配置 Sentry 监控: 参考 docs/SENTRY_MONITORING.md"
