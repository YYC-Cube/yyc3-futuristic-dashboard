#!/bin/bash

set -e

echo "🎭 YYC3 Dashboard E2E测试套件"
echo "================================="
echo ""

echo "📋 检查Playwright环境..."
if ! command -v npx &> /dev/null; then
    echo "❌ npx未安装"
    exit 1
fi

echo "🔧 安装浏览器..."
npx playwright install chromium || { echo "❌ 浏览器安装失败"; exit 1; }
echo ""

echo "🧪 运行基础E2E测试..."
START_TIME=$(date +%s)

npx playwright test --project=chromium --reporter=list 2>&1 | tail -30

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
echo ""
echo "⏱️ E2E执行时间: ${DURATION}秒"
echo ""

echo "🖼️ 运行视觉回归测试（如果配置了）..."
if [ -f "e2e/visual-regression.spec.ts" ]; then
    echo "发现视觉回归测试文件"
    echo "💡 运行命令: npx playwright test --project=visual-regression-chromium"
fi
echo ""

echo "📊 测试报告位置:"
echo "   - HTML: playwright-report/index.html"
echo "   - JSON: test-results/results.json"
echo "   - 截图: test-results/ (如果失败)"
echo ""

echo "✨ E2E测试准备完成！"
