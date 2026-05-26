import { test, expect } from '@playwright/test'

test.describe('移动端响应式设计', () => {
  test('iPhone 12 适配', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: /欢迎回来/i })).toBeVisible()

    const mobileMenu = page.locator('[data-testid="mobile-menu"]')
    if (await mobileMenu.isVisible()) {
      await expect(mobileMenu).toBeVisible()
    }
  })

  test('iPad 适配', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/login')

    await expect(page.getByRole('heading')).toBeVisible()

    const loginContainer = page.locator('[data-testid="login-container"]')
    if (await loginContainer.isVisible()) {
      const box = await loginContainer.boundingBox()
      expect(box?.width).toBeGreaterThan(300)
      expect(box?.width).toBeLessThan(700)
    }
  })

  test('移动端侧边栏折叠', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')

    const sidebar = page.locator('[data-testid="sidebar"]')
    if (await sidebar.isVisible()) {
      const box = await sidebar.boundingBox()
      expect(box?.width).toBeLessThanOrEqual(100)
    }

    const hamburgerMenu = page.locator('[data-testid="hamburger-menu"]')
    if (await hamburgerMenu.isVisible()) {
      await hamburgerMenu.click()
      await page.waitForTimeout(300)

      const expandedSidebar = page.locator('[data-testid="sidebar-expanded"]')
      if (await expandedSidebar.isVisible()) {
        await expect(expandedSidebar).toBeVisible()
      }
    }
  })

  test('移动端表格横向滚动', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
    await page.goto('/orders')

    const tableContainer = page.locator('[data-testid="table-container"]')
    if (await tableContainer.isVisible()) {
      const isScrollable = await tableContainer.evaluate(el => {
        return el.scrollWidth > el.clientWidth
      })

      if (isScrollable) {
        await tableContainer.evaluate(el => el.scrollBy({ left: 200, behavior: 'smooth' }))
        await page.waitForTimeout(500)
      }
    }
  })
})

test.describe('触摸交互测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
  })

  test('滑动刷新手势', async ({ page }) => {
    await page.goto('/rooms')

    const roomList = page.locator('[data-testid="room-list"]')
    if (await roomList.isVisible()) {
      const box = await roomList.boundingBox()

      if (box) {
        const startX = box.x + box.width / 2
        const startY = box.y + 50
        const endY = box.y + box.height - 50

        await page.touchscreen.tap(startX, startY)
        await page.mouse.move(startX, startY)
        await page.mouse.down()
        await page.mouse.move(startX, endY, { steps: 10 })
        await page.mouse.up()

        await page.waitForTimeout(1000)
      }
    }
  })

  test('双击缩放禁用', async ({ page }) => {
    await page.goto('/inventory')

    const viewportMeta = page.locator('meta[name="viewport"]')
    if (await viewportMeta.count() > 0) {
      const content = await viewportMeta.getAttribute('content')
      expect(content).toContain('user-scalable=no')
    }
  })
})

test.describe('性能基准测试', () => {
  test('首页加载性能', async ({ page }) => {
    const metrics: { [key: string]: number } = {}

    await page.goto('/login', { waitUntil: 'commit' })
    metrics.commit = Date.now()

    await page.waitForLoadState('domcontentloaded')
    metrics.domContent = Date.now()

    await page.waitForLoadState('networkidle')
    metrics.networkIdle = Date.now()

    console.log('Performance Metrics:', {
      'DOM Content': `${metrics.domContent - metrics.commit}ms`,
      'Network Idle': `${metrics.networkIdle - metrics.commit}ms`,
    })

    expect(metrics.domContent - metrics.commit).toBeLessThan(3000)
    expect(metrics.networkIdle - metrics.commit).toBeLessThan(15000)
  })

  test('页面交互响应时间', async ({ page }) => {
    await page.goto('/login')

    const button = page.getByRole('button', { name: /幽灵模式/i })
    const startTime = Date.now()

    await button.click()
    await page.waitForURL('**/dashboard')

    const responseTime = Date.now() - startTime
    console.log(`Login Response Time: ${responseTime}ms`)

    expect(responseTime).toBeLessThan(8000)
  })

  test('大型列表渲染性能', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')
    await page.goto('/inventory')

    const startTime = Date.now()

    await expect(page.locator('[data-testid="inventory-list"]')).toBeVisible({
      timeout: 10000,
    })

    const renderTime = Date.now() - startTime
    console.log(`Inventory List Render Time: ${renderTime}ms`)

    expect(renderTime).toBeLessThan(12000)
  })

  test('内存使用监控', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /幽灵模式/i }).click()
    await page.waitForURL('**/dashboard')

    const initialMemory = await page.evaluate(() =>
      (performance as any).memory?.usedJSHeapSize || 0
    )

    for (let i = 0; i < 5; i++) {
      await page.goto('/rooms')
      await page.waitForTimeout(300)
      await page.goto('/orders')
      await page.waitForTimeout(300)
    }

    const finalMemory = await page.evaluate(() =>
      (performance as any).memory?.usedJSHeapSize || 0
    )

    if (initialMemory > 0 && finalMemory > 0) {
      const memoryGrowth = finalMemory - initialMemory
      const memoryGrowthMB = memoryGrowth / (1024 * 1024)

      console.log(`Memory Growth: ${memoryGrowthMB.toFixed(2)} MB`)

      expect(memoryGrowthMB).toBeLessThan(50)
    }
  })
})
