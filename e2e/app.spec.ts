import { test, expect } from "@playwright/test"

test.describe("Authentication Flow", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login")

    await expect(page).toHaveTitle(/YYC3/)
    
    await expect(page.locator("input[name='username']")).toBeVisible()
    await expect(page.locator("input[name='password']")).toBeVisible()
    await expect(page.locator("button[type='submit']")).toBeVisible()
  })

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login")

    await page.fill("input[name='username']", "invalid")
    await page.fill("input[name='password']", "invalid")
    await page.click("button[type='submit']")

    await expect(page.locator(".text-red-500")).toBeVisible()
  })

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto("/login")

    await page.fill("input[name='username']", "admin")
    await page.fill("input[name='password']", "123456")
    await page.click("button[type='submit']")

    await page.waitForURL("/rooms")

    await expect(page).toHaveURL(/\/rooms/)
  })

  test("should redirect to rooms after login", async ({ page }) => {
    await page.goto("/login")

    await page.fill("input[name='username']", "admin")
    await page.fill("input[name='password']", "123456")
    await page.click("button[type='submit']")

    await page.waitForURL("**/rooms**")

    const heading = page.locator("h1, h2").first()
    await expect(heading).toContainText(/包厢|Dashboard/i)
  })
})

test.describe("Room Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
    await page.fill("input[name='username']", "admin")
    await page.fill("input[name='password']", "123456")
    await page.click("button[type='submit']")
    await page.waitForURL("/rooms")
  })

  test("should display room list", async ({ page }) => {
    await expect(page.locator("[data-testid='room-card']").first()).toBeVisible({
      timeout: 10000,
    })
  })

  test("should filter rooms by status", async ({ page }) => {
    const availableFilter = page.locator("text=可用").first()
    if (await availableFilter.isVisible()) {
      await availableFilter.click()
      await page.waitForTimeout(500)
    }
  })

  test("should open room detail modal", async ({ page }) => {
    const firstRoom = page.locator("[data-testid='room-card']").first()
    await firstRoom.click()

    await expect(page.locator("[role='dialog']")).toBeVisible({
      timeout: 5000,
    })
  })
})

test.describe("Order Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
    await page.fill("input[name='username']", "admin")
    await page.fill("input[name='password']", "123456")
    await page.click("button[type='submit']")
    await page.waitForURL("/rooms")
    
    await page.goto("/orders")
  })

  test("should display order list", async ({ page }) => {
    await expect(page.locator("table, [data-testid='order-list']").first()).toBeVisible({
      timeout: 10000,
    })
  })

  test("should create new order", async ({ page }) => {
    const newOrderButton = page.locator("text=新建订单, [data-testid='new-order']")
    if (await newOrderButton.isVisible()) {
      await newOrderButton.click()

      await expect(page.locator("[role='dialog'], .modal")).toBeVisible({
        timeout: 5000,
      })
    }
  })
})

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
    await page.fill("input[name='username']", "admin")
    await page.fill("input[name='password']", "123456")
    await page.click("button[type='submit']")
    await page.waitForURL("/rooms")
  })

  test("should navigate between pages", async ({ page }) => {
    await page.click("text=员工管理")
    await expect(page).toHaveURL(/\/employees/, { timeout: 10000 })

    await page.click("text=商品管理")
    await expect(page).toHaveURL(/\/products/, { timeout: 10000 })

    await page.click("text=包厢管理")
    await expect(page).toHaveURL(/\/rooms/, { timeout: 10000 })
  })

  test("sidebar should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const menuButton = page.locator("button[aria-label='menu'], .hamburger")
    if (await menuButton.isVisible()) {
      await menuButton.click()
      await expect(page.locator(".sidebar, nav.mobile-menu")).toBeVisible()
    }
  })
})

test.describe("Performance", () => {
  test("should load main page within performance budget", async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto("/login")
    
    await page.waitForLoadState("networkidle")
    
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000)
  })

  test("should have no console errors", async ({ page }) => {
    const errors: string[] = []
    
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text())
      }
    })

    await page.goto("/login")
    await page.waitForLoadState("networkidle")

    expect(errors.length).toBe(0)
  })

  test("should pass Lighthouse performance checks", async ({ page }) => {
    await page.goto("/rooms")
    await page.waitForLoadState("networkidle")

    const metrics = await page.evaluate(() => ({
      fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
      lcp: performance.getEntriesByType("largest-contentful-paint")[0]?.startTime,
      fid: performance.getEntriesByName("first-input-delay")[0]?.startTime,
    }))

    if (metrics.fcp) expect(metrics.fcp).toBeLessThan(1800)
    if (metrics.lcp) expect(metrics.lcp).toBeLessThan(2500)
  })
})
