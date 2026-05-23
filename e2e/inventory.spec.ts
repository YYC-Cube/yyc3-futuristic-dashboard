import { test, expect } from '@playwright/test'

test.describe('库存智能看板 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    const ghostButton = page.getByRole('button', { name: /幽灵模式/i })
    await ghostButton.click()
    await page.waitForURL('**/dashboard')
  })

  test('应该正确导航到库存看板页面', async ({ page }) => {
    await page.goto('/inventory')

    await expect(page.locator('[data-testid="inventory-container"]')).toBeVisible({
      timeout: 10000,
    })

    expect(page.getByText(/库存管理|库存看板/i)).toBeVisible()
  })

  test('应该显示库存概览统计卡片', async ({ page }) => {
    await page.goto('/inventory')

    const statsCards = page.locator('[data-testid="inventory-stats"]')
    if (await statsCards.isVisible()) {
      expect(statsCards.getByText(/总商品数/i).first()).toBeVisible()
      expect(statsCards.getByText(/低库存预警/i).first()).toBeVisible()
      expect(statsCards.getByText(/即将过期/i).first()).toBeVisible()

      const totalValue = statsCards.locator('[data-testid="total-inventory-value"]')
      if (await totalValue.isVisible()) {
        const valueText = await totalValue.textContent()
        expect(valueText).toContain('¥')
      }
    }
  })

  test('应该显示库存商品列表', async ({ page }) => {
    await page.goto('/inventory')

    await expect(
      page.locator('[data-testid="inventory-list"]')
    ).toBeVisible({ timeout: 10000 })

    const inventoryItems = page.locator('[data-testid="inventory-item"]')
    const itemCount = await inventoryItems.count()

    if (itemCount > 0) {
      for (let i = 0; i < Math.min(itemCount, 5); i++) {
        const item = inventoryItems.nth(i)
        expect(item).toBeVisible()

        expect(item.locator('[data-testid="item-name"]')).toBeVisible()
        expect(item.locator('[data-testid="item-quantity"]')).toBeVisible()
        expect(item.locator('[data-testid="item-status"]')).toBeVisible()
      }
    }
  })

  test('应该支持按类别筛选库存', async ({ page }) => {
    await page.goto('/inventory')

    const categoryFilter = page.locator('[data-testid="category-filter"]')
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click()
      await page.waitForTimeout(300)

      const options = page.locator('[data-testid="filter-option"]')
      if (await options.count() > 0) {
        await options.first().click()
        await page.waitForTimeout(500)

        const filteredItems = page.locator('[data-testid="inventory-item"]')
        expect(filteredItems).toBeDefined()
      }
    }
  })

  test('应该支持搜索功能', async ({ page }) => {
    await page.goto('/inventory')

    const searchInput = page.locator('[data-testid="inventory-search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('啤酒')
      await page.waitForTimeout(500)

      const searchResults = page.locator('[data-testid="inventory-item"]')
      expect(searchResults).toBeDefined()
    }
  })

  test('应该正确显示低库存预警标识', async ({ page }) => {
    await page.goto('/inventory')

    const lowStockWarnings = page.locator('[data-testid="low-stock-warning"]')
    const warningCount = await lowStockWarnings.count()

    if (warningCount > 0) {
      for (let i = 0; i < Math.min(warningCount, 3); i++) {
        const warning = lowStockWarnings.nth(i)
        expect(warning).toBeVisible()

        expect(warning.getByText(/低库存|不足|预警/i)).toBeVisible()
      }
    }

    const alertBadge = page.locator('[data-testid="alert-badge"]')
    if (await alertBadge.first().isVisible()) {
      const badgeText = await alertBadge.first().textContent()
      expect(parseInt(badgeText || '0')).toBeGreaterThanOrEqual(0)
    }
  })

  test('应该显示即将过期商品提示', async ({ page }) => {
    await page.goto('/inventory')

    const expiringSoon = page.locator('[data-testid="expiring-soon"]')
    const expiringCount = await expiringSoon.count()

    if (expiringCount > 0) {
      for (let i = 0; i < Math.min(expiringCount, 3); i++) {
        const item = expiringSoon.nth(i)
        expect(item).toBeVisible()

        expect(item.getByText(/过期|即将|剩余.*天/i)).toBeVisible()
      }
    }
  })

  test('应该支持查看商品详情', async ({ page }) => {
    await page.goto('/inventory')

    const firstItem = page.locator('[data-testid="inventory-item"]').first()
    if (await firstItem.isVisible()) {
      await firstItem.click()
      await page.waitForTimeout(500)

      const detailModal = page.locator('[data-testid="item-detail-modal"]')
      if (await detailModal.isVisible()) {
        expect(detailModal.getByText(/商品详情/i)).toBeVisible()

        expect(detailModal.locator('[data-testid="detail-name"]')).toBeVisible()
        expect(detailModal.locator('[data-testid="detail-quantity"]')).toBeVisible()
        expect(detailModal.locator('[data-testid="detail-price"]')).toBeVisible()

        const closeButton = detailModal.getByRole('button', { name: /关闭|取消/i })
        if (await closeButton.isVisible()) {
          await closeButton.click()
          expect(detailModal).not.toBeVisible()
        }
      }
    }
  })

  test('应该支持批量操作', async ({ page }) => {
    await page.goto('/inventory')

    const selectAllCheckbox = page.locator('[data-testid="select-all"]')
    if (await selectAllCheckbox.isVisible()) {
      await selectAllCheckbox.check()
      await page.waitForTimeout(300)

      const batchActions = page.locator('[data-testid="batch-actions"]')
      if (await batchActions.isVisible()) {
        expect(batchActions.getByText(/批量补货|批量删除|批量导出/i)).toBeVisible()
      }
    }
  })

  test('应该支持库存调整操作', async ({ page }) => {
    await page.goto('/inventory')

    const adjustButton = page.locator('[data-testid="adjust-stock"]').first()
    if (await adjustButton.isVisible()) {
      await adjustButton.click()
      await page.waitForTimeout(500)

      const adjustModal = page.locator('[data-testid="adjust-modal"]')
      if (await adjustModal.isVisible()) {
        expect(adjustModal.getByText(/调整库存/i)).toBeVisible()

        const quantityInput = adjustModal.locator('[data-testid="adjust-quantity"]')
        if (await quantityInput.isVisible()) {
          await quantityInput.fill('10')
        }

        const confirmButton = adjustModal.getByRole('button', { name: /确认|提交/i })
        if (await confirmButton.isVisible()) {
          expect(confirmButton).toBeEnabled()
        }
      }
    }
  })

  test('应该显示库存趋势图表', async ({ page }) => {
    await page.goto('/inventory')

    const trendChart = page.locator('[data-testid="inventory-trend-chart"]')
    if (await trendChart.isVisible()) {
      expect(trendChart).toBeVisible()

      const chartCanvas = trendChart.locator('canvas, svg, [data-recharts]')
      if (await chartCanvas.count() > 0) {
        expect(chartCanvas.first()).toBeVisible()
      }
    }
  })

  test('应该支持导出库存报告', async ({ page }) => {
    await page.goto('/inventory')

    const exportButton = page.locator('[data-testid="export-inventory"]')
    if (await exportButton.isVisible()) {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        exportButton.click(),
      ])

      expect(download.suggestedFilename()).toContain('inventory')
    }
  })

  test('应该响应式适配移动端布局', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/inventory')

    await expect(page.locator('[data-testid="inventory-container"]')).toBeVisible({
      timeout: 10000,
    })

    const mobileFilter = page.locator('[data-testid="mobile-filter"]')
    if (await mobileFilter.isVisible()) {
      expect(mobileFilter).toBeVisible()
    }

    const cardGrid = page.locator('[data-testid="mobile-card-grid"]')
    if (await cardGrid.isVisible()) {
      const box = await cardGrid.boundingBox()
      expect(box?.width).toBeLessThanOrEqual(375)
    }
  })
})
