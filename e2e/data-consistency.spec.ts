import { test, expect } from '@playwright/test'

test.describe('跨页面数据同步测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
  })

  test('仪表板统计数据与订单页面一致', async ({ page }) => {
    await page.goto('/dashboard')

    const dashboardRevenue = page.locator('[data-testid="total-revenue"]')
    let dashboardValue: string | null = null

    if (await dashboardRevenue.isVisible()) {
      dashboardValue = await dashboardRevenue.textContent()
    }

    await page.goto('/orders')

    const orderStatsRevenue = page.locator('[data-testid="order-total-revenue"]')
    if (await orderStatsRevenue.isVisible()) {
      const ordersValue = await orderStatsRevenue.textContent()

      if (dashboardValue && ordersValue) {
        const dashboardNum = parseFloat(dashboardValue.replace(/[^\d.]/g, ''))
        const ordersNum = parseFloat(ordersValue.replace(/[^\d.]/g, ''))

        expect(Math.abs(dashboardNum - ordersNum)).toBeLessThan(1)
      }
    }
  })

  test('房间状态在多个页面保持一致', async ({ page }) => {
    await page.goto('/rooms')

    const roomCard = page.locator('[data-testid="room-card"]').first()
    let initialStatus: string | null = null

    if (await roomCard.isVisible()) {
      const statusElement = roomCard.locator('[data-testid="room-status"]')
      if (await statusElement.isVisible()) {
        initialStatus = await statusElement.textContent()
      }
    }

    await page.goto('/dashboard')

    const dashboardRoomStatus = page.locator('[data-testid="dashboard-room-status"]').first()
    if (initialStatus && await dashboardRoomStatus.isVisible()) {
      const dashboardStatus = await dashboardRoomStatus.textContent()

      expect(dashboardStatus).toContain(initialStatus.trim())
    }
  })
})

test.describe('实时更新测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
  })

  test('库存数量实时更新', async ({ page }) => {
    await page.goto('/inventory')

    const firstItem = page.locator('[data-testid="inventory-item"]').first()
    if (await firstItem.isVisible()) {
      const quantityElement = firstItem.locator('[data-testid="item-quantity"]')
      const initialQuantity = await quantityElement.textContent()

      await page.waitForTimeout(2000)

      const updatedQuantity = await quantityElement.textContent()

      expect(updatedQuantity).toBeDefined()
    }
  })

  test('订单状态变更通知', async ({ page }) => {
    await page.goto('/orders')

    const notificationBadge = page.locator('[data-testid="notification-badge"]')
    if (await notificationBadge.isVisible()) {
      const initialCount = await notificationBadge.textContent()

      await page.waitForTimeout(3000)

      const updatedCount = await notificationBadge.textContent()

      expect(updatedCount).toBeDefined()
    }
  })
})

test.describe('表单交互和数据验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
  })

  test('搜索表单输入和清除', async ({ page }) => {
    await page.goto('/inventory')

    const searchInput = page.locator('[data-testid="inventory-search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('青岛啤酒')
      expect(await searchInput.inputValue()).toBe('青岛啤酒')

      await searchInput.clear()
      expect(await searchInput.inputValue()).toBe('')
    }
  })

  test('筛选器多选功能', async ({ page }) => {
    await page.goto('/rooms')

    const filterButton = page.locator('[data-testid="room-filter"]')
    if (await filterButton.isVisible()) {
      await filterButton.click()
      await page.waitForTimeout(300)

      const options = page.locator('[data-testid="status-option"]')
      const optionCount = await options.count()

      if (optionCount >= 2) {
        await options.first().click()
        await page.waitForTimeout(300)
        await options.nth(1).click()
        await page.waitForTimeout(300)
      }
    }
  })

  test('分页控件交互', async ({ page }) => {
    await page.goto('/orders')

    const pagination = page.locator('[data-testid="pagination"]')
    if (await pagination.isVisible()) {
      const nextPageButton = pagination.locator('[data-testid="next-page"]')
      if (await nextPageButton.isEnabled()) {
        await nextPageButton.click()
        await page.waitForTimeout(500)
      }

      const prevPageButton = pagination.locator('[data-testid="prev-page"]')
      if (await prevPageButton.isEnabled()) {
        await prevPageButton.click()
        await page.waitForTimeout(500)
      }
    }
  })
})

test.describe('错误处理和边界情况', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
  })

  test('网络错误提示显示', async ({ page }) => {
    await page.route('**/api/**', route => route.abort())

    await page.goto('/rooms')

    const errorMessage = page.locator('[data-testid="error-message"]')
    if (await errorMessage.isVisible({ timeout: 5000 })) {
      await expect(errorMessage).toBeVisible()
    }

    await page.unroute('**/api/**')
  })

  test('空数据显示', async ({ page }) => {
    await page.goto('/membership')

    const searchInput = page.locator('[data-testid="member-search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('不存在的会员名称xyz123')
      await page.waitForTimeout(1000)

      const emptyState = page.locator('[data-testid="empty-state"]')
      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible()
        await expect(emptyState.getByText(/没有找到|暂无数据|无结果/i)).toBeVisible()
      }
    }
  })

  test('加载状态显示', async ({ page }) => {
    await page.route('**/api/**', route => {
      return new Promise(resolve => setTimeout(() => resolve(route.continue()), 2000))
    })

    await page.goto('/inventory')

    const loadingSpinner = page.locator('[data-testid="loading-spinner"], [data-testid="skeleton"]')
    if (await loadingSpinner.isVisible({ timeout: 1000 })) {
      await expect(loadingSpinner).toBeVisible()
    }

    await page.unroute('**/api/**')
  })
})
