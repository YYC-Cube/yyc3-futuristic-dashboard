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
})