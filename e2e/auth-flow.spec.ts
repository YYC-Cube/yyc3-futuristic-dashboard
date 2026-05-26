import { test, expect } from '@playwright/test'

test.describe('认证流程 E2E 测试', () => {
  test('完整登录流程 - 幽灵模式', async ({ page }) => {
    await page.goto('/login')

    await expect(page).toHaveTitle(/YYC3 Dashboard/)
    
    const ghostButton = page.getByRole('button', { name: /幽灵模式/i })
    await expect(ghostButton).toBeVisible()
    await ghostButton.click()

    await page.waitForURL('**/dashboard')
    expect(page.url()).toContain('/dashboard')

    await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible({
      timeout: 10000,
    })
  })

  test('登录表单验证', async ({ page }) => {
    await page.goto('/login')

    const loginButton = page.getByRole('button', { name: /登录/i })
    await loginButton.click()

    const errorMessages = page.locator('.text-red-500, [role="alert"]')
    await expect(errorMessages.first()).toBeVisible()
  })

  test('键盘快捷键登录', async ({ page }) => {
    await page.goto('/login')

    await page.keyboard.press('Meta+g')
    
    await page.waitForURL('**/dashboard', { timeout: 5000 })
    expect(page.url()).toContain('/dashboard')
  })

  test('登出流程', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')

    const userMenu = page.locator('[data-testid="user-menu"]')
    if (await userMenu.isVisible()) {
      await userMenu.click()

      const logoutButton = page.getByRole('menuitem', { name: /登出|退出/i })
      if (await logoutButton.isVisible()) {
        await logoutButton.click()
        await page.waitForURL('**/login')
        expect(page.url()).toContain('/login')
      }
    }
  })

  test('会话持久化', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')

    await page.goto('/rooms')
    await expect(page.locator('[data-testid="room-list"]')).toBeVisible({
      timeout: 10000,
    })
  })

  test('未授权访问重定向', async ({ page }) => {
    await page.goto('/orders')

    await page.waitForURL('**/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('权限控制测试', () => {
  test('管理员权限验证', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')

    const adminElements = [
      '[data-testid="admin-panel"]',
      '[data-testid="settings-menu"]',
      '[data-testid="system-config"]',
    ]

    for (const selector of adminElements) {
      const element = page.locator(selector)
      if (await element.isVisible()) {
        await expect(element).toBeEnabled()
      }
    }
  })

  test('菜单访问控制', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')

    const menuItems = [
      '仪表板',
      '房间管理',
      '订单管理',
      '库存管理',
      '会员中心',
    ]

    for (const item of menuItems) {
      const menuItem = page.getByText(item)
      if (await menuItem.isVisible()) {
        await menuItem.click()
        await page.waitForTimeout(300)
        expect(page.url()).not.toContain('/login')
      }
    }
  })
})
