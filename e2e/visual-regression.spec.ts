import { test, expect } from '@playwright/test'

test.describe('视觉回归测试 @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('首页整体布局截图', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('导航栏组件', async ({ page }) => {
    const navbar = page.locator('nav')
    await expect(navbar).toHaveScreenshot('navbar.png', {
      animations: 'disabled',
    })
  })

  test('侧边栏组件', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]')
    if (await sidebar.count() > 0) {
      await expect(sidebar).toHaveScreenshot('sidebar.png', {
        animations: 'disabled',
      })
    }
  })

  test('卡片组件样式', async ({ page }) => {
    const cards = page.locator('[data-testid="room-card"]').first()
    if (await cards.count() > 0) {
      await expect(cards).toHaveScreenshot('card-component.png', {
        animations: 'disabled',
      })
    }
  })

  test('表格数据展示', async ({ page }) => {
    await page.goto('/rooms')
    await page.waitForLoadState('networkidle')

    const table = page.locator('table').first()
    if (await table.count() > 0) {
      await expect(table).toHaveScreenshot('table-data.png', {
        animations: 'disabled',
      })
    }
  })

  test('表单元素状态', async ({ page }) => {
    await page.goto('/orders/new')
    await page.waitForLoadState('networkidle')

    const form = page.locator('form').first()
    if (await form.count() > 0) {
      await expect(form).toHaveScreenshot('form-default.png', {
        animations: 'disabled',
      })
    }
  })

  test('对话框/弹窗组件', async ({ page }) => {
    const dialogTrigger = page.locator('[data-testid="dialog-trigger"]')
    if (await dialogTrigger.count() > 0) {
      await dialogTrigger.click()
      await page.waitForTimeout(500)

      const dialog = page.locator('[role="dialog"]')
      if (await dialog.count() > 0) {
        await expect(dialog).toHaveScreenshot('dialog-open.png', {
          animations: 'disabled',
        })
      }
    }
  })

  test('按钮交互状态', async ({ page }) => {
    const button = page.locator('button').first()
    if (await button.count() > 0) {
      await expect(button).toHaveScreenshot('button-default.png', {
        animations: 'disabled',
      })

      await button.hover()
      await expect(button).toHaveScreenshot('button-hover.png', {
        animations: 'disabled',
      })
    }
  })

  test('移动端响应式布局', async ({ page, isMobile }) => {
    test.skip(!isMobile, '仅移动端设备运行')

    await expect(page).toHaveScreenshot('mobile-layout.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('暗色模式主题', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]')
    if (await themeToggle.count() > 0) {
      await themeToggle.click()
      await page.waitForTimeout(300)

      await expect(page).toHaveScreenshot('dark-mode.png', {
        fullPage: true,
        animations: 'disabled',
      })
    }
  })

  test('加载状态和骨架屏', async ({ page }) => {
    await page.route('**/api/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], total: 0 }),
      })
    )

    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    const skeleton = page.locator('[data-testid="skeleton"]')
    if (await skeleton.count() > 0) {
      await expect(skeleton.first()).toHaveScreenshot('loading-skeleton.png', {
        animations: 'disabled',
      })
    }

    await page.unroute('**/api/**')
  })

  test('空状态页面', async ({ page }) => {
    await page.goto('/orders?status=empty')
    await page.waitForLoadState('networkidle')

    const emptyState = page.locator('[data-testid="empty-state"]')
    if (await emptyState.count() > 0) {
      await expect(emptyState).toHaveScreenshot('empty-state.png', {
        animations: 'disabled',
      })
    }
  })

  test('错误状态页面', async ({ page }) => {
    await page.route('**/api/error', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: '服务器内部错误' }),
      })
    )

    await page.goto('/error-test')
    await page.waitForLoadState('networkidle')

    const errorState = page.locator('[data-testid="error-state"]')
    if (await errorState.count() > 0) {
      await expect(errorState).toHaveScreenshot('error-state.png', {
        animations: 'disabled',
      })
    }

    await page.unroute('**/api/error')
  })

  test('Toast通知消息', async ({ page }) => {
    const toastTrigger = page.locator('[data-testid="show-toast"]')
    if (await toastTrigger.count() > 0) {
      await toastTrigger.click()
      await page.waitForTimeout(500)

      const toast = page.locator('[data-testid="toast"]')
      if (await toast.count() > 0) {
        await expect(toast).toHaveScreenshot('toast-notification.png', {
          animations: 'disabled',
        })
      }
    }
  })
})
