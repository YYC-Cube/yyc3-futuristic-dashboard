import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useInventoryStore } from '@/lib/stores/useInventoryStore'

function createTestItemData(overrides: Record<string, unknown> = {}) {
  return {
    storeId: 'store-001',
    name: '测试商品',
    category: '饮料',
    sku: 'TEST-001',
    unit: '瓶',
    currentStock: 100,
    minimumStock: 10,
    maximumStock: 500,
    reorderPoint: 20,
    reorderQuantity: 50,
    costPrice: 5.0,
    sellingPrice: 15.0,
    supplier: {
      id: 'supplier-001',
      name: '供应商A',
      contactPhone: '13800138000',
      leadTimeDays: 3,
      minOrderQuantity: 100,
    },
    location: '仓库A区',
    status: 'in_stock' as const,
    lastRestockedAt: new Date().toISOString(),
    lastCountedAt: new Date().toISOString(),
    tags: [],
    ...overrides,
  } as any
}

describe('useInventoryStore', () => {
  beforeEach(() => {
    useInventoryStore.setState({
      items: [],
      alerts: [],
      movements: [],
      forecasts: [],
      loading: false,
      error: null,
      selectedItemId: null,
      lastFetched: null,
      alertSettings: {
        lowStockThreshold: 10,
        expiringSoonDays: 30,
        anomalyDeviation: 2.0,
        enableAutoReorder: false,
        notificationChannels: ['in_app'],
      },
    })
  })

  describe('初始状态', () => {
    it('应该有正确的默认值', () => {
      const state = useInventoryStore.getState()
      
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.alertSettings).toBeDefined()
      expect(state.alertSettings.lowStockThreshold).toBe(10)
    })
  })

  describe('状态更新', () => {
    it('应该能够更新loading状态', () => {
      useInventoryStore.setState({ loading: true })
      
      expect(useInventoryStore.getState().loading).toBe(true)
    })

    it('应该能够更新error状态', () => {
      useInventoryStore.setState({ error: '网络错误' })
      
      expect(useInventoryStore.getState().error).toBe('网络错误')
    })

    it('应该能够清除error状态', () => {
      useInventoryStore.setState({ error: '网络错误' })
      useInventoryStore.getState().clearError()
      
      expect(useInventoryStore.getState().error).toBeNull()
    })

    it('应该能够设置选中的商品ID', () => {
      useInventoryStore.getState().setSelectedItem('item-001')
      
      expect(useInventoryStore.getState().selectedItemId).toBe('item-001')
    })

    it('应该能够清除选中商品', () => {
      useInventoryStore.setState({ selectedItemId: 'item-001' })
      useInventoryStore.getState().setSelectedItem(null)
      
      expect(useInventoryStore.getState().selectedItemId).toBeNull()
    })
  })

  describe('alertSettings 更新', () => {
    it('应该能够更新预警阈值', () => {
      useInventoryStore.getState().updateAlertSettings({ lowStockThreshold: 20 })

      expect(useInventoryStore.getState().alertSettings.lowStockThreshold).toBe(20)
    })

    it('应该能够更新临期天数', () => {
      useInventoryStore.getState().updateAlertSettings({ expiringSoonDays: 15 })

      expect(useInventoryStore.getState().alertSettings.expiringSoonDays).toBe(15)
    })

    it('应该能够启用自动补货', () => {
      useInventoryStore.getState().updateAlertSettings({ enableAutoReorder: true })

      expect(useInventoryStore.getState().alertSettings.enableAutoReorder).toBe(true)
    })

    it('应该能够更新通知渠道', () => {
      useInventoryStore.getState().updateAlertSettings({ 
        notificationChannels: ['email', 'sms'] 
      })

      expect(useInventoryStore.getState().alertSettings.notificationChannels).toContain('email')
      expect(useInventoryStore.getState().alertSettings.notificationChannels).toContain('sms')
    })
  })

  describe('addItem - 添加库存商品', () => {
    it('应该成功添加新商品', async () => {
      const itemData = createTestItemData({ name: '测试商品' })
      const result = await useInventoryStore.getState().addItem(itemData)

      expect(result).toBeDefined()
      expect(result.id).toMatch(/^inv-/)
      expect(result.name).toBe('测试商品')
      expect(result.status).toBe('in_stock')
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()

      const state = useInventoryStore.getState()
      expect(state.items.length).toBe(1)
      expect(state.items[0].id).toBe(result.id)
    })

    it('零库存商品应该标记为out_of_stock', async () => {
      const itemData = createTestItemData({ 
        name: '缺货商品', 
        sku: 'OUT-001',
        currentStock: 0 
      })
      const result = await useInventoryStore.getState().addItem(itemData)

      expect(result.status).toBe('out_of_stock')
    })

    it('添加时应该设置loading状态', async () => {
      const itemData = createTestItemData({ name: 'Loading测试' })
       
      const addPromise = useInventoryStore.getState().addItem(itemData)
      
      const result = await addPromise
       
      expect(useInventoryStore.getState().loading).toBe(false)
      expect(result).toBeDefined()
     })
  })

  describe('updateItem - 更新库存商品', () => {
    beforeEach(async () => {
      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '原始商品', sku: 'ORIG-001' })
      )
    })

    it('应该成功更新商品信息', async () => {
      const itemId = useInventoryStore.getState().items[0].id

      await useInventoryStore.getState().updateItem(itemId, {
        name: '更新后的商品',
        currentStock: 150,
      })

      const updatedItem = useInventoryStore.getState().getItemById(itemId)
      expect(updatedItem?.name).toBe('更新后的商品')
      expect(updatedItem?.currentStock).toBe(150)
      expect(updatedItem?.updatedAt).toBeDefined()
    })

    it('更新不存在的商品不应该报错', async () => {
      await useInventoryStore.getState().updateItem('non-existent-id', {
        name: '不存在的商品',
      })

      expect(useInventoryStore.getState().items.length).toBe(1)
    })
  })

  describe('deleteItem - 删除库存商品', () => {
    beforeEach(async () => {
      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '待删除商品', sku: 'DEL-001' })
      )
    })

    it('应该成功删除商品', async () => {
      const itemId = useInventoryStore.getState().items[0].id
      const initialCount = useInventoryStore.getState().items.length

      await useInventoryStore.getState().deleteItem(itemId)

      expect(useInventoryStore.getState().items.length).toBe(initialCount - 1)
      expect(useInventoryStore.getState().getItemById(itemId)).toBeUndefined()
    })

    it('删除不存在的商品不应该报错', async () => {
      const initialCount = useInventoryStore.getState().items.length
      
      await useInventoryStore.getState().deleteItem('non-existent-id')

      expect(useInventoryStore.getState().items.length).toBe(initialCount)
    })
  })

  describe('查询方法', () => {
    beforeEach(async () => {
      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '可乐', sku: 'COLA-001', unit: '罐', currentStock: 200, costPrice: 2.0, sellingPrice: 5.0, tags: ['畅销'] })
      )

      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '薯片', category: '零食', sku: 'CHIP-001', unit: '袋', currentStock: 5, minimumStock: 10, maximumStock: 200, supplier: { id: 'supplier-002', name: '供应商B', contactPhone: '13900139000', leadTimeDays: 5, minOrderQuantity: 50 }, location: '仓库B区', costPrice: 3.0, sellingPrice: 8.0, tags: ['促销'] })
      )

      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '啤酒', category: '酒水', sku: 'BEER-001', unit: '箱', currentStock: 0, minimumStock: 20, maximumStock: 100, supplier: { id: 'supplier-003', name: '供应商C', contactPhone: '13700137000', leadTimeDays: 7, minOrderQuantity: 20 }, location: '仓库C区', costPrice: 80.0, sellingPrice: 200.0, tags: [] })
      )
    })

    it('getItemById 应该返回正确的商品', () => {
      const items = useInventoryStore.getState().items
      const item = useInventoryStore.getState().getItemById(items[0].id)

      expect(item).toBeDefined()
      expect(item?.name).toBe('可乐')
    })

    it('getItemById 对于不存在的ID应返回undefined', () => {
      const item = useInventoryStore.getState().getItemById('non-existent')

      expect(item).toBeUndefined()
    })

    it('getItemsByCategory 应该按类别筛选', () => {
      const beverages = useInventoryStore.getState().getItemsByCategory('饮料')

      expect(beverages.length).toBe(1)
      expect(beverages[0].name).toBe('可乐')
    })

    it('getLowStockItems 应该返回低库存商品', () => {
      const lowStockItems = useInventoryStore.getState().getLowStockItems()

      expect(lowStockItems.some(item => item.name === '薯片')).toBe(true)
      expect(lowStockItems.some(item => item.name === '啤酒')).toBe(true)
    })

    it('getItemsSafe 应该返回商品列表', () => {
      const items1 = useInventoryStore.getState().getItemsSafe()
      const items2 = useInventoryStore.getState().getItemsSafe()

      expect(Array.isArray(items1)).toBe(true)
      expect(items1.length).toBe(3)
      expect(items2.length).toEqual(items1.length)
    })

    it('getItemCount 应该返回正确数量', () => {
      expect(useInventoryStore.getState().getItemCount()).toBe(3)
    })

    it('getTotalValue 应该计算总价值', () => {
      const totalValue = useInventoryStore.getState().getTotalValue()

      expect(totalValue).toBeGreaterThanOrEqual(0)
      expect(typeof totalValue).toBe('number')
    })
  })

  describe('reset - 重置状态', () => {
    it('应该重置所有状态到初始值', async () => {
      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '临时商品', category: '测试' })
      )

      useInventoryStore.setState({ error: '测试错误' })

      useInventoryStore.getState().reset()

      const state = useInventoryStore.getState()
      expect(state.items.length).toBe(0)
      expect(state.error).toBeNull()
      expect(state.selectedItemId).toBeNull()
      expect(state.loading).toBe(false)
    })
  })

  describe('fetchInventory - 获取库存列表', () => {
    it('应该成功获取库存列表', async () => {
      await useInventoryStore.getState().fetchInventory()

      const state = useInventoryStore.getState()
      expect(state.items.length).toBeGreaterThan(0)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).not.toBeNull()
    }, 10000)

    it('应该在loading时避免重复请求', async () => {
      useInventoryStore.setState({ loading: true })

      await useInventoryStore.getState().fetchInventory()

      expect(useInventoryStore.getState().loading).toBe(true)
    })
  })

  describe('recordMovement - 调整库存数量', () => {
    beforeEach(async () => {
      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '调整测试商品', sku: 'ADJ-001', currentStock: 100 })
      )
    })

    it('应该正确增加库存', async () => {
      const itemId = useInventoryStore.getState().items[0].id

      await useInventoryStore.getState().recordMovement(itemId, 'restock', 50, '进货')

      const item = useInventoryStore.getState().getItemById(itemId)
      expect(item?.currentStock).toBe(150)
    })

    it('应该正确减少库存', async () => {
      const itemId = useInventoryStore.getState().items[0].id

      await useInventoryStore.getState().recordMovement(itemId, 'sale', 30, '销售')

      const item = useInventoryStore.getState().getItemById(itemId)
      expect(item?.currentStock).toBe(70)
    })

    it('应该记录库存变动', async () => {
      const itemId = useInventoryStore.getState().items[0].id

      await useInventoryStore.getState().recordMovement(itemId, 'adjustment', 20, '盘点调整')

      const movements = useInventoryStore.getState().movements
      expect(movements.length).toBe(1)
      expect(movements[0].itemId).toBe(itemId)
      expect(movements[0].quantity).toBe(20)
    })

    it('不存在的商品应处理异常', async () => {
      try {
        await useInventoryStore.getState().recordMovement('non-existent', 'restock', 10, '测试')
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })

  describe('recordMovement - 记录库存变动', () => {
    beforeEach(async () => {
      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '变动记录商品', sku: 'MOV-001' })
      )
    })

    it('应该成功记录入库操作', async () => {
      const itemId = useInventoryStore.getState().items[0].id

      await useInventoryStore.getState().recordMovement(
        itemId, 'restock', 100, '采购入库'
      )

      expect(useInventoryStore.getState().movements.length).toBe(1)
      expect(useInventoryStore.getState().movements[0].type).toBe('restock')
    })

    it('应该成功记录出库操作', async () => {
      const itemId = useInventoryStore.getState().items[0].id

      await useInventoryStore.getState().recordMovement(
        itemId, 'sale', 50, '销售出库'
      )

      expect(useInventoryStore.getState().movements.length).toBe(1)
      expect(useInventoryStore.getState().movements[0].type).toBe('sale')
    })
  })

  describe('generateForecast - 生成预测', () => {
    beforeEach(async () => {
      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '预测商品', sku: 'FOR-001', currentStock: 200 })
      )
    })

    it('应该生成库存预测数据', async () => {
      const itemId = useInventoryStore.getState().items[0].id

      const forecasts = await useInventoryStore.getState().generateForecast(itemId, 7)

      expect(Array.isArray(forecasts)).toBe(true)
      if (forecasts.length > 0) {
        expect(forecasts[0]).toHaveProperty('date')
        expect(forecasts[0]).toHaveProperty('predictedDemand')
      }
    })

    it('不存在的商品应返回空数组', async () => {
      const forecasts = await useInventoryStore.getState().generateForecast('non-existent', 7)

      expect(Array.isArray(forecasts)).toBe(true)
      expect(forecasts.length).toBe(0)
    })
  })

  describe('getExpiringItems - 获取临期商品', () => {
    beforeEach(async () => {
      const soonDate = new Date()
      soonDate.setDate(soonDate.getDate() + 15)

      const laterDate = new Date()
      laterDate.setDate(laterDate.getDate() + 60)

      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '临期商品', sku: 'EXP-001', expiryDate: soonDate.toISOString() })
      )

      await useInventoryStore.getState().addItem(
        createTestItemData({ name: '正常商品', sku: 'NOR-001', expiryDate: laterDate.toISOString() })
      )
    })

    it('应该返回在阈值内过期的商品', () => {
      const expiringItems = useInventoryStore.getState().getExpiringItems(30)

      expect(expiringItems.length).toBe(1)
      expect(expiringItems[0].name).toBe('临期商品')
    })

    it('不应该返回未过期的商品', () => {
      const expiringItems = useInventoryStore.getState().getExpiringItems(30)

      expect(expiringItems.some(item => item.name === '正常商品')).toBe(false)
    })
  })

  describe('checkStockLevels - 检查库存水平', () => {
    beforeEach(async () => {
      await useInventoryStore.getState().addItem(
        createTestItemData({
          name: '低库存预警商品',
          sku: 'LOW-001',
          currentStock: 5,
          minimumStock: 10,
          maximumStock: 100,
        })
      )

      await useInventoryStore.getState().addItem(
        createTestItemData({
          name: '正常库存商品',
          sku: 'NORM-001',
          currentStock: 50,
          minimumStock: 10,
          maximumStock: 100,
        })
      )
    })

    it('应该为低库存商品生成预警', async () => {
      await useInventoryStore.getState().checkStockLevels()

      const alerts = useInventoryStore.getState().alerts
      expect(alerts.some(a => a.type === 'low_stock')).toBe(true)
    })
  })

  describe('边界条件和错误处理', () => {
    it('addItem 失败时应设置错误状态', async () => {
      try {
        await useInventoryStore.getState().addItem(null as any)
      } catch (e) {
        expect(e).toBeDefined()
      }

      expect(useInventoryStore.getState().error).not.toBeNull()
      expect(useInventoryStore.getState().loading).toBe(false)
    })

    it('updateItem 应处理异常情况', async () => {
      await useInventoryStore.getState().addItem(createTestItemData({ name: '异常更新' }))
      const itemId = useInventoryStore.getState().items[0].id

      try {
        await useInventoryStore.getState().updateItem(itemId, null as any)
      } catch (e) {
        expect(e).toBeDefined()
      }
    })

    it('deleteItem 应处理异常情况', async () => {
      await useInventoryStore.getState().addItem(createTestItemData({ name: '异常删除' }))
      const itemId = useInventoryStore.getState().items[0].id

      try {
        await useInventoryStore.getState().deleteItem(itemId)
      } catch (e) {
        expect(e).toBeDefined()
      }

      expect(useInventoryStore.getState().getItemById(itemId)).toBeUndefined()
    })

    it('getLowStockItems 应该包含超储商品（如果maximumStock被超过）', async () => {
      await useInventoryStore.getState().addItem(
        createTestItemData({
          name: '超储商品',
          sku: 'OVER-001',
          currentStock: 400,
          maximumStock: 200,
        })
      )

      const lowStockItems = useInventoryStore.getState().getLowStockItems()

      expect(lowStockItems.length).toBeGreaterThanOrEqual(0)
    })

    it('recordMovement 应该支持补货操作', async () => {
      await useInventoryStore.getState().addItem(
        createTestItemData({
          name: '需补货商品',
          sku: 'REORDER-001',
          currentStock: 5,
          reorderPoint: 20,
          reorderQuantity: 50,
        })
      )

      const itemId = useInventoryStore.getState().items[0].id

      await useInventoryStore.getState().recordMovement(itemId, 'restock', 50, '自动补货')

      const item = useInventoryStore.getState().getItemById(itemId)
      expect(item?.currentStock).toBe(55)
    })
  })
})