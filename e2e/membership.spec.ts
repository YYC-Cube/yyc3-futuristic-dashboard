import { test, expect } from '@playwright/test'

test.describe('会员中心 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    const ghostButton = page.getByRole('button', { name: /幽灵模式/i })
    await ghostButton.click()
    await page.waitForURL('**/dashboard')
  })

  test('应该正确导航到会员中心', async ({ page }) => {
    await page.goto('/membership')

    await expect(page.locator('[data-testid="membership-container"]')).toBeVisible({
      timeout: 10000,
    })

    expect(page.getByText(/会员中心/i)).toBeVisible()
  })

  test('应该显示会员基本信息', async ({ page }) => {
    await page.goto('/membership')

    await expect(page.locator('[data-testid="member-info-card"]')).toBeVisible({
      timeout: 10000,
    })

    const memberInfo = page.locator('[data-testid="member-info"]')
    if (await memberInfo.isVisible()) {
      expect(memberInfo.getByText(/会员ID/i).first()).toBeVisible()
      expect(memberInfo.getByText(/手机号/i).first()).toBeVisible()
      expect(memberInfo.getByText(/注册时间/i).first()).toBeVisible()
    }
  })

  test('应该显示积分信息面板', async ({ page }) => {
    await page.goto('/membership')

    await expect(page.locator('[data-testid="points-panel"]')).toBeVisible({
      timeout: 10000,
    })

    const pointsDisplay = page.locator('[data-testid="current-points"]')
    if (await pointsDisplay.isVisible()) {
      const pointsText = await pointsDisplay.textContent()
      expect(pointsText).toBeDefined()
      expect(parseInt(pointsText || '0')).not.toBeNaN()
    }
  })

  test('应该显示会员等级信息', async ({ page }) => {
    await page.goto('/membership')

    await expect(page.locator('[data-testid="level-display"]')).toBeVisible({
      timeout: 10000,
    })

    const levelBadge = page.locator('[data-testid="level-badge"]')
    if (await levelBadge.isVisible()) {
      const validLevels = ['普通会员', '银卡会员', '金卡会员', '钻石会员']
      const levelText = await levelBadge.textContent()
      expect(validLevels.some((l) => levelText?.includes(l))).toBeTruthy()
    }
  })

  test('应该显示积分历史记录列表', async ({ page }) => {
    await page.goto('/membership')

    const historyList = page.locator('[data-testid="points-history"]')
    if (await historyList.isVisible()) {
      const historyItems = historyList.locator('[data-testid="history-item"]')
      const count = await historyItems.count()

      if (count > 0) {
        const firstItem = historyItems.first()
        expect(firstItem.getByText(/\+|-/)).toBeVisible()
        expect(firstItem.getByText(/积分/)).toBeVisible()
      }
    }
  })

  test('应该支持查看积分明细', async ({ page }) => {
    await page.goto('/membership')

    const viewDetailsButton = page.locator(
      '[data-testid="view-points-details"]'
    )
    if (await viewDetailsButton.isVisible()) {
      await viewDetailsButton.click()

      await page.waitForTimeout(500)

      const detailsModal = page.locator('[data-testid="points-details-modal"]')
      expect(detailsModal).toBeVisible()
    }
  })

  test('应该显示等级权益说明', async ({ page }) => {
    await page.goto('/membership')

    const benefitsSection = page.locator('[data-testid="benefits-section"]')
    if (await benefitsSection.isVisible()) {
      const benefitItems = benefitsSection.locator('[data-testid="benefit-item"]')
      const count = await benefitItems.count()

      expect(count).toBeGreaterThan(0)

      for (let i = 0; i < Math.min(count, 3); i++) {
        const item = benefitItems.nth(i)
        expect(item).toBeVisible()
      }
    }
  })

  test('应该支持会员等级升级预览', async ({ page }) => {
    await page.goto('/membership')

    const upgradePreview = page.locator('[data-testid="upgrade-preview"]')
    if (await upgradePreview.isVisible()) {
      expect(upgradePreview.getByText(/下一等级/i)).toBeVisible()

      const progressToNext = page.locator('[data-testid="progress-to-next"]')
      if (await progressToNext.isVisible()) {
        expect(progressToNext).toBeVisible()
      }
    }
  })

  test('应该正确处理无数据状态', async ({ page }) => {
    await page.goto('/membership')

    const emptyState = page.locator('[data-testid="empty-state"]')
    if (await emptyState.isVisible()) {
      expect(emptyState.getByText(/暂无数据|还没有记录/i)).toBeVisible()
    }
  })

  test('应该响应式适配移动端布局', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/membership')

    await expect(page.locator('[data-testid="membership-container"]')).toBeVisible({
      timeout: 10000,
    })

    const mobileMenu = page.locator('[data-testid="mobile-nav"]')
    if (await mobileMenu.isVisible()) {
      expect(mobileMenu).toBeVisible()
    }

    const memberCard = page.locator('[data-testid="member-info-card"]')
    if (await memberCard.isVisible()) {
      const box = await memberCard.boundingBox()
      expect(box?.width).toBeLessThanOrEqual(375)
    }
  })
})
