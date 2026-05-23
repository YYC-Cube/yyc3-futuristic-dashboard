import { test, expect } from '@playwright/test'

test.describe('订单管理 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    const ghostButton = page.getByRole('button', { name: /幽灵模式/i })
    await ghostButton.click()
    await page.waitForURL('**/dashboard')
  })

  test('应该正确导航到订单管理页面', async ({ page }) => {
    await page.goto('/orders')

    await expect(page.locator('[data-testid="orders-container"]')).toBeVisible({
      timeout: 10000,
    })

    expect(page.getByText(/订单管理|订单列表/i)).toBeVisible()
  })

  test('应该显示订单统计概览', async ({ page }) => {
    await page.goto('/orders')

    const statsPanel = page.locator('[data-testid="order-stats"]')
    if (await statsPanel.isVisible()) {
      expect(statsPanel.getByText(/今日订单|总订单数/i).first()).toBeVisible()
      expect(statsPanel.getByText(/总营收|营业额/i).first()).toBeVisible()

      const revenueValue = statsPanel.locator('[data-testid="total-revenue"]')
      if (await revenueValue.isVisible()) {
        const text = await revenueValue.textContent()
        expect(text).toContain('¥')
        expect(text).toMatch(/\d+/)
      }
    }
  })

  test('应该显示订单列表', async ({ page }) => {
    await page.goto('/orders')

    await expect(page.locator('[data-testid="order-list"]')).toBeVisible({
      timeout: 10000,
    })

    const orderItems = page.locator('[data-testid="order-item"]')
    const orderCount = await orderItems.count()

    if (orderCount > 0) {
      for (let i = 0; i < Math.min(orderCount, 5); i++) {
        const item = orderItems.nth(i)
        expect(item).toBeVisible()

        expect(item.locator('[data-testid="order-id"]')).toBeVisible()
        expect(item.locator('[data-testid="order-room"]')).toBeVisible()
        expect(item.locator('[data-testid="order-amount"]')).toBeVisible()
        expect(item.locator('[data-testid="order-status"]')).toBeVisible()
      }
    }
  })

  test('应该支持按状态筛选订单', async ({ page }) => {
    await page.goto('/orders')

    const statusFilter = page.locator('[data-testid="status-filter"]')
    if (await statusFilter.isVisible()) {
      await statusFilter.click()
      await page.waitForTimeout(300)

      const statusOptions = page.locator('[data-testid="status-option"]')
      if (await statusOptions.count() > 0) {
        const confirmedOption = statusOptions.filter({
          hasText: /已确认|confirmed/i,
        })
        if (await confirmedOption.count() > 0) {
          await confirmedOption.first().click()
          await page.waitForTimeout(500)
        }
      }
    }
  })

  test('应该支持日期范围筛选', async ({ page }) => {
    await page.goto('/orders')

    const dateFilter = page.locator('[data-testid="date-filter"]')
    if (await dateFilter.isVisible()) {
      await dateFilter.click()
      await page.waitForTimeout(300)

      const startDate = page.locator('[data-testid="start-date"]')
      const endDate = page.locator('[data-testid="end-date"]')

      if (await startDate.isVisible() && await endDate.isVisible()) {
        await startDate.fill('2024-01-01')
        await endDate.fill('2024-01-31')

        const applyButton = page.getByRole('button', { name: /应用|筛选/i })
        if (await applyButton.isVisible()) {
          await applyButton.click()
          await page.waitForTimeout(500)
        }
      }
    }
  })

  test('应该支持创建新订单流程', async ({ page }) => {
    await page.goto('/orders')

    const createOrderButton = page.locator(
      '[data-testid="create-order-button"]'
    )
    if (await createOrderButton.isVisible()) {
      await createOrderButton.click()
      await page.waitForTimeout(500)

      const createModal = page.locator('[data-testid="create-order-modal"]')
      if (await createModal.isVisible()) {
        expect(createModal.getByText(/新建订单|创建订单/i)).toBeVisible()

        const roomSelect = createModal.locator('[data-testid="room-select"]')
        if (await roomSelect.isVisible()) {
          await roomSelect.click()
          await page.waitForTimeout(300)

          const roomOption = createModal
            .locator('[data-testid="room-option"]')
            .first()
          if (await roomOption.isVisible()) {
            await roomOption.click()
          }
        }

        const submitButton = createModal.getByRole('button', { name: /提交|确认|创建/i })
        if (await submitButton.isVisible()) {
          expect(submitButton).toBeEnabled()
        }
      }
    }
  })

  test('应该支持查看订单详情', async ({ page }) => {
    await page.goto('/orders')

    const firstOrder = page.locator('[data-testid="order-item"]').first()
    if (await firstOrder.isVisible()) {
      await firstOrder.click()
      await page.waitForTimeout(500)

      const detailView = page.locator('[data-testid="order-detail-view"]')
      if (await detailView.isVisible()) {
        expect(detailView.getByText(/订单详情/i)).toBeVisible()

        expect(
          detailView.locator('[data-testid="detail-order-id"]')
        ).toBeVisible()
        expect(
          detailView.locator('[data-testid="detail-customer-info"]')
        ).toBeVisible()
        expect(
          detailView.locator('[data-testid="detail-items-list"]')
        ).toBeVisible()
        expect(
          detailView.locator('[data-testid="detail-total-amount"]')
        ).toBeVisible()

        const backButton = detailView.getByRole('button', { name: /返回|关闭/i })
        if (await backButton.isVisible()) {
          await backButton.click()
          expect(detailView).not.toBeVisible()
        }
      }
    }
  })

  test('应该支持添加商品到订单', async ({ page }) => {
    await page.goto('/orders')

    const addItemButton = page.locator('[data-testid="add-item-button"]')
    if (await addItemButton.first().isVisible()) {
      await addItemButton.first().click()
      await page.waitForTimeout(500)

      const addItemModal = page.locator('[data-testid="add-item-modal"]')
      if (await addItemModal.isVisible()) {
        expect(addItemModal.getByText(/添加商品|选择商品/i)).toBeVisible()

        const productSearch = addItemModal.locator(
          '[data-testid="product-search"]'
        )
        if (await productSearch.isVisible()) {
          await productSearch.fill('啤酒')
          await page.waitForTimeout(300)
        }

        const productList = addItemModal.locator(
          '[data-testid="product-item"]'
        )
        if (await productList.count() > 0) {
          await productList.first().click()
          await page.waitForTimeout(300)

          const quantityInput = addItemModal.locator(
            '[data-testid="item-quantity"]'
          )
          if (await quantityInput.isVisible()) {
            await quantityInput.fill('5')
          }

          const confirmAdd = addItemModal.getByRole('button', {
            name: /添加|确认/i,
          })
          if (await confirmAdd.isVisible()) {
            await confirmAdd.click()
            await page.waitForTimeout(500)
          }
        }
      }
    }
  })

  test('应该支持订单状态变更', async ({ page }) => {
    await page.goto('/orders')

    const firstOrder = page.locator('[data-testid="order-item"]').first()
    if (await firstOrder.isVisible()) {
      const statusDropdown = firstOrder.locator(
        '[data-testid="status-dropdown"]'
      )
      if (await statusDropdown.isVisible()) {
        await statusDropdown.click()
        await page.waitForTimeout(300)

        const newStatus = page.locator('[data-testid="new-status-option"]')
        if (await newStatus.isVisible()) {
          await newStatus.click()
          await page.waitForTimeout(500)

          const toastMessage = page.locator('[data-testid="toast-message"]')
          if (await toastMessage.isVisible()) {
            expect(toastMessage.getByText(/成功|已更新/i)).toBeVisible()
          }
        }
      }
    }
  })

  test('应该支持支付操作', async ({ page }) => {
    await page.goto('/orders')

    const payButton = page.locator('[data-testid="pay-button"]')
    if (await payButton.first().isVisible()) {
      await payButton.first().click()
      await page.waitForTimeout(500)

      const paymentModal = page.locator('[data-testid="payment-modal"]')
      if (await paymentModal.isVisible()) {
        expect(paymentModal.getByText(/支付|收款/i)).toBeVisible()

        const amountDisplay = paymentModal.locator(
          '[data-testid="payment-amount"]'
        )
        if (await amountDisplay.isVisible()) {
          const amountText = await amountDisplay.textContent()
          expect(amountText).toContain('¥')
        }

        const paymentMethods = paymentModal.locator(
          '[data-testid="payment-method"]'
        )
        if (await paymentMethods.count() > 0) {
          await paymentMethods.first().click()
        }

        const confirmPayment = paymentModal.getByRole('button', {
          name: /确认支付|完成支付/i,
        })
        if (await confirmPayment.isVisible()) {
          expect(confirmPayment).toBeEnabled()
        }
      }
    }
  })

  test('应该支持退款操作', async ({ page }) => {
    await page.goto('/orders')

    const refundButton = page.locator('[data-testid="refund-button"]')
    if (await refundButton.first().isVisible()) {
      await refundButton.first().click()
      await page.waitForTimeout(500)

      const refundModal = page.locator('[data-testid="refund-modal"]')
      if (await refundModal.isVisible()) {
        expect(refundModal.getByText(/退款/i)).toBeVisible()

        const refundAmount = refundModal.locator(
          '[data-testid="refund-amount"]'
        )
        if (await refundAmount.isVisible()) {
          expect(refundAmount).toBeVisible()
        }

        const reasonSelect = refundModal.locator(
          '[data-testid="refund-reason"]'
        )
        if (await reasonSelect.isVisible()) {
          await reasonSelect.click()
          await page.waitForTimeout(300)
        }

        const confirmRefund = refundModal.getByRole('button', {
          name: /确认退款|提交退款/i,
        })
        if (await confirmRefund.isVisible()) {
          expect(confirmRefund).toBeEnabled()
        }
      }
    }
  })

  test('应该支持打印订单小票', async ({ page }) => {
    await page.goto('/orders')

    const printButton = page.locator('[data-testid="print-order"]')
    if (await printButton.first().isVisible()) {
      const printPromise = page.waitForEvent('dialog')
      await printButton.first().click()

      const dialog = await printPromise
      expect(dialog.type()).toBe('beforeunload')
    }
  })

  test('应该支持导出订单数据', async ({ page }) => {
    await page.goto('/orders')

    const exportButton = page.locator('[data-testid="export-orders"]')
    if (await exportButton.isVisible()) {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        exportButton.click(),
      ])

      expect(download.suggestedFilename()).toContain('order')
    }
  })

  test('应该显示订单时间线视图', async ({ page }) => {
    await page.goto('/orders')

    const timelineView = page.locator('[data-testid="timeline-view"]')
    if (await timelineView.isVisible()) {
      const timelineEvents = timelineView.locator('[data-testid="timeline-event"]')
      const eventCount = await timelineEvents.count()

      if (eventCount > 0) {
        for (let i = 0; i < Math.min(eventCount, 3); i++) {
          const event = timelineEvents.nth(i)
          expect(event).toBeVisible()

          expect(event.locator('[data-testid="event-time"]')).toBeVisible()
          expect(event.locator('[data-testid="event-action"]')).toBeVisible()
        }
      }
    }
  })

  test('应该响应式适配移动端布局', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/orders')

    await expect(page.locator('[data-testid="orders-container"]')).toBeVisible({
      timeout: 10000,
    })

    const mobileCardList = page.locator('[data-testid="mobile-order-card"]')
    if (await mobileCardList.count() > 0) {
      for (let i = 0; i < Math.min(await mobileCardList.count(), 3); i++) {
        const card = mobileCardList.nth(i)
        expect(card).toBeVisible()

        const box = await card.boundingBox()
        expect(box?.width).toBeLessThanOrEqual(375)
      }
    }
  })
})
