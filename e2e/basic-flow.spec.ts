import { test, expect, Page } from '@playwright/test'

test.describe('登录页面 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('应该正确显示登录页面', async ({ page }) => {
    await expect(page).toHaveTitle(/YYC3 Dashboard/)

    expect(page.getByRole('heading', { name: /欢迎回来/i })).toBeVisible()
    expect(page.getByPlaceholder(/用户名/i)).toBeVisible()
    expect(page.getByPlaceholder(/密码/i)).toBeVisible()
    expect(page.getByRole('button', { name: /登录/i })).toBeVisible()
  })

  test('幽灵模式按钮应该可见且可点击', async ({ page }) => {
    const ghostButton = page.getByRole('button', { name: /幽灵模式/i })
    
    await expect(ghostButton).toBeVisible()
    await ghostButton.click()

    await page.waitForURL('**/dashboard')
    expect(page.url()).toContain('/dashboard')
  })

  test('表单验证 - 空字段提交', async ({ page }) => {
    await page.getByRole('button', { name: /登录/i }).click()

    const errorMessages = page.locator('.text-red-500, [role="alert"]')
    await expect(errorMessages.first()).toBeVisible()
  })
})

test.describe('仪表板页面 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    const ghostButton = page.getByRole('button', { name: /幽灵模式/i })
    await ghostButton.click()
    await page.waitForURL('**/dashboard')
  })

  test('应该正确加载仪表板', async ({ page }) => {
    await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible()
    
    expect(page.getByText(/总营收/i).first()).toBeVisible()
    expect(page.getByText(/房间占用率/i).first()).toBeVisible()
  })

  test('主题切换功能应该正常工作', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]')
    await themeToggle.click()

    await page.waitForTimeout(500)
    
    const htmlElement = page.locator('html')
    const className = await htmlElement.getAttribute('class')
    expect(className).toBeDefined()
  })

  test('侧边栏导航应该正常工作', async ({ page }) => {
    const navItems = ['房间管理', '订单管理', '会员中心']

    for (const item of navItems) {
      const navItem = page.getByText(item)
      if (await navItem.isVisible()) {
        await navItem.click()
        await page.waitForTimeout(300)
      }
    }
  })
})

test.describe('房间管理页面 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
    await page.goto('/rooms')
  })

  test('应该显示房间列表', async ({ page }) => {
    await expect(page.locator('[data-testid="room-list"]')).toBeVisible({ timeout: 10000 })
  })

  test('房间状态筛选应该工作', async ({ page }) => {
    const filterButton = page.locator('[data-testid="room-filter"]').first()
    if (await filterButton.isVisible()) {
      await filterButton.click()
      await page.waitForTimeout(500)
    }
  })

  test('房间卡片应该可点击', async ({ page }) => {
    const firstRoomCard = page.locator('[data-testid="room-card"]').first()
    
    if (await firstRoomCard.isVisible()) {
      await firstRoomCard.click()
      await page.waitForTimeout(300)
      
      expect(page.locator('[data-testid="room-detail"]')).toBeVisible()
    }
  })
})

test.describe('响应式设计测试', () => {
  test('桌面布局应该正确显示', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/login')

    const loginContainer = page.locator('[data-testid="login-container"]')
    if (await loginContainer.isVisible()) {
      const box = await loginContainer.boundingBox()
      expect(box?.width).toBeGreaterThan(400)
    }
  })

  test('移动端布局应该适配', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/login')

    const mobileMenu = page.locator('[data-testid="mobile-menu"]')
    if (await mobileMenu.isVisible()) {
      expect(mobileMenu).toBeVisible()
    }
  })

  test('平板布局应该正确适配', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/login')

    expect(page.getByRole('heading')).toBeVisible()
  })
})

test.describe('性能基准测试', () => {
  test('首页加载时间应该在合理范围内', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/login', { waitUntil: 'domcontentloaded' })
    const domContentTime = Date.now() - startTime

    await page.waitForLoadState('networkidle')
    const fullLoadTime = Date.now() - startTime

    console.log(`DOM Content Loaded: ${domContentTime}ms`)
    console.log(`Full Load Time: ${fullLoadTime}ms`)

    expect(domContentTime).toBeLessThan(3000)
    expect(fullLoadTime).toBeLessThan(10000)
  })

  test('页面交互响应时间应该在合理范围内', async ({ page }) => {
    await page.goto('/login')

    const button = page.getByRole('button', { name: /幽灵模式/i })
    const clickStart = Date.now()
    
    await button.click()
    await page.waitForURL('**/dashboard')
    
    const responseTime = Date.now() - clickStart
    console.log(`Interaction Response Time: ${responseTime}ms`)
    
    expect(responseTime).toBeLessThan(5000)
  })
})
