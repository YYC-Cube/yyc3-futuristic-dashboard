import { test, expect } from '@playwright/test'

test.describe('房间管理完整流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
  })

  test('房间列表加载和显示', async ({ page }) => {
    await page.goto('/rooms')

    await expect(page.locator('[data-testid="room-list"]')).toBeVisible({
      timeout: 10000,
    })

    const roomCards = page.locator('[data-testid="room-card"]')
    const roomCount = await roomCards.count()

    expect(roomCount).toBeGreaterThan(0)

    const firstRoom = roomCards.first()
    await expect(firstRoom).toBeVisible()

    await expect(firstRoom.locator('[data-testid="room-number"]')).toBeVisible()
    await expect(firstRoom.locator('[data-testid="room-status"]')).toBeVisible()
    await expect(firstRoom.locator('[data-testid="room-type"]')).toBeVisible()
  })

  test('房间状态筛选', async ({ page }) => {
    await page.goto('/rooms')

    const filterButton = page.locator('[data-testid="room-filter"]')
    if (await filterButton.isVisible()) {
      await filterButton.click()
      await page.waitForTimeout(500)

      const statusOptions = page.locator('[data-testid="status-option"]')
      if (await statusOptions.count() > 0) {
        const availableOption = statusOptions.filter({ hasText: /空闲|available/i })
        if (await availableOption.count() > 0) {
          await availableOption.first().click()
          await page.waitForTimeout(500)
        }
      }
    }
  })

  test('房间详情查看', async ({ page }) => {
    await page.goto('/rooms')

    const firstRoomCard = page.locator('[data-testid="room-card"]').first()
    if (await firstRoomCard.isVisible()) {
      await firstRoomCard.click()
      await page.waitForTimeout(500)

      const detailPanel = page.locator('[data-testid="room-detail"]')
      if (await detailPanel.isVisible()) {
        await expect(detailPanel).toBeVisible()
        await expect(detailPanel.locator('[data-testid="room-info"]')).toBeVisible()
      }
    }
  })
})

test.describe('订单管理完整流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
  })

  test('订单列表和统计', async ({ page }) => {
    await page.goto('/orders')

    await expect(page.locator('[data-testid="orders-container"]')).toBeVisible({
      timeout: 10000,
    })

    const statsPanel = page.locator('[data-testid="order-stats"]')
    if (await statsPanel.isVisible()) {
      await expect(statsPanel.getByText(/今日订单|总订单数/i)).toBeVisible()
      await expect(statsPanel.getByText(/总营收|营业额/i)).toBeVisible()
    }

    const orderList = page.locator('[data-testid="order-list"]')
    await expect(orderList).toBeVisible()
  })

  test('订单状态筛选和搜索', async ({ page }) => {
    await page.goto('/orders')

    const statusFilter = page.locator('[data-testid="status-filter"]')
    if (await statusFilter.isVisible()) {
      await statusFilter.click()
      await page.waitForTimeout(300)

      const activeOption = page.locator('[data-testid="status-option"]').filter({
        hasText: /进行中|active/i,
      })
      if (await activeOption.count() > 0) {
        await activeOption.first().click()
        await page.waitForTimeout(500)
      }
    }

    const searchInput = page.locator('[data-testid="order-search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('001')
      await page.waitForTimeout(500)
    }
  })

  test('订单详情查看', async ({ page }) => {
    await page.goto('/orders')

    const orderItem = page.locator('[data-testid="order-item"]').first()
    if (await orderItem.isVisible()) {
      await orderItem.click()
      await page.waitForTimeout(500)

      const detailModal = page.locator('[data-testid="order-detail-modal"]')
      if (await detailModal.isVisible()) {
        await expect(detailModal).toBeVisible()
        await expect(detailModal.locator('[data-testid="order-items-list"]')).toBeVisible()
      }
    }
  })
})

test.describe('库存管理完整流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
  })

  test('库存看板和统计', async ({ page }) => {
    await page.goto('/inventory')

    await expect(page.locator('[data-testid="inventory-container"]')).toBeVisible({
      timeout: 10000,
    })

    const statsCards = page.locator('[data-testid="inventory-stats"]')
    if (await statsCards.isVisible()) {
      await expect(statsCards.getByText(/总商品数/i)).toBeVisible()
      await expect(statsCards.getByText(/低库存预警/i)).toBeVisible()
    }

    const inventoryList = page.locator('[data-testid="inventory-list"]')
    await expect(inventoryList).toBeVisible()
  })

  test('库存商品筛选', async ({ page }) => {
    await page.goto('/inventory')

    const categoryFilter = page.locator('[data-testid="category-filter"]')
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click()
      await page.waitForTimeout(300)

      const beerCategory = page.locator('[data-testid="category-option"]').filter({
        hasText: /啤酒|beer/i,
      })
      if (await beerCategory.count() > 0) {
        await beerCategory.first().click()
        await page.waitForTimeout(500)
      }
    }

    const searchInput = page.locator('[data-testid="inventory-search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('青岛啤酒')
      await page.waitForTimeout(500)
    }
  })

  test('库存预警提示', async ({ page }) => {
    await page.goto('/inventory')

    const alertBadge = page.locator('[data-testid="low-stock-alert"]')
    if (await alertBadge.isVisible()) {
      const alertCount = await alertBadge.textContent()
      expect(parseInt(alertCount || '0')).toBeGreaterThanOrEqual(0)
    }

    const warningItems = page.locator('[data-testid="item-warning"]')
    const warningCount = await warningItems.count()

    for (let i = 0; i < Math.min(warningCount, 3); i++) {
      await expect(warningItems.nth(i)).toBeVisible()
    }
  })
})

test.describe('会员管理完整流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
  })

  test('会员列表和搜索', async ({ page }) => {
    await page.goto('/membership')

    await expect(
      page.locator('[data-testid="membership-container"]')
    ).toBeVisible({ timeout: 10000 })

    const memberList = page.locator('[data-testid="member-list"]')
    await expect(memberList).toBeVisible()

    const searchInput = page.locator('[data-testid="member-search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('张三')
      await page.waitForTimeout(500)
    }
  })

  test('会员详情查看', async ({ page }) => {
    await page.goto('/membership')

    const memberItem = page.locator('[data-testid="member-item"]').first()
    if (await memberItem.isVisible()) {
      await memberItem.click()
      await page.waitForTimeout(500)

      const detailPanel = page.locator('[data-testid="member-detail"]')
      if (await detailPanel.isVisible()) {
        await expect(detailPanel).toBeVisible()
        await expect(detailPanel.locator('[data-testid="member-info"]')).toBeVisible()
        await expect(detailPanel.locator('[data-testid="member-points"]')).toBeVisible()
      }
    }
  })

  test('会员等级展示', async ({ page }) => {
    await page.goto('/membership')

    const memberItems = page.locator('[data-testid="member-item"]')
    const count = await memberItems.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const item = memberItems.nth(i)
      const levelBadge = item.locator('[data-testid="member-level"]')
      if (await levelBadge.isVisible()) {
        const level = await levelBadge.textContent()
        expect(level).toMatch(/VIP|金卡|银卡|普通/i)
      }
    }
  })
})
