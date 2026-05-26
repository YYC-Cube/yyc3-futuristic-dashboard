'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import logger from '../logger'

export interface InventoryItem {
  id: string
  storeId: string
  name: string
  nameEn?: string
  category: string
  sku: string
  barcode?: string
  unit: string
  currentStock: number
  minimumStock: number
  maximumStock: number
  reorderPoint: number
  reorderQuantity: number
  costPrice: number
  sellingPrice: number
  supplier: {
    id: string
    name: string
    contactPhone: string
    leadTimeDays: number
    minOrderQuantity: number
  }
  location: string
  expiryDate?: string
  batchNumber?: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired' | 'discontinued'
  lastRestockedAt: string
  lastCountedAt: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface StockAlert {
  id: string
  itemId: string
  storeId: string
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired' | 'overstock' | 'anomaly'
  severity: 'info' | 'warning' | 'critical'
  message: string
  currentValue: number
  thresholdValue: number
  suggestedAction: string
  isAcknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
  createdAt: string
  resolvedAt?: string
}

export interface StockMovement {
  id: string
  itemId: string
  storeId: string
  type: 'restock' | 'sale' | 'adjustment' | 'transfer_in' | 'transfer_out' | 'waste' | 'return'
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  referenceId?: string
  performedBy: string
  createdAt: string
}

export interface InventoryForecast {
  itemId: string
  storeId: string
  date: string
  predictedDemand: number
  confidenceLevel: number
  factors: string[]
  suggestedReorderQuantity: number
  estimatedCost: number
}

const EMPTY_ITEMS: InventoryItem[] = []
const EMPTY_ALERTS: StockAlert[] = []
const EMPTY_MOVEMENTS: StockMovement[] = []

interface InventoryState {
  items: InventoryItem[]
  alerts: StockAlert[]
  movements: StockMovement[]
  forecasts: InventoryForecast[]
  
  selectedItemId: string | null
  loading: boolean
  error: string | null
  lastFetched: number | null
  alertSettings: {
    lowStockThreshold: number
    expiringSoonDays: number
    anomalyDeviation: number
    enableAutoReorder: boolean
    notificationChannels: Array<'email' | 'sms' | 'webhook' | 'in_app'>
  }
}

interface InventoryActions {
  fetchInventory: (storeId?: string) => Promise<void>
  fetchAlerts: () => Promise<void>
  addItem: (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<InventoryItem>
  updateItem: (itemId: string, updates: Partial<InventoryItem>) => Promise<void>
  deleteItem: (itemId: string) => Promise<void>
  
  recordMovement: (
    itemId: string,
    type: StockMovement['type'],
    quantity: number,
    reason: string,
    metadata?: Partial<StockMovement>
  ) => Promise<void>
  
  checkStockLevels: () => Promise<void>
  generateForecast: (itemId: string, days?: number) => Promise<InventoryForecast[]>
  acknowledgeAlert: (alertId: string, userId: string) => void
  
  getItemById: (id: string) => InventoryItem | undefined
  getItemsByCategory: (category: string) => InventoryItem[]
  getLowStockItems: () => InventoryItem[]
  getExpiringItems: (daysThreshold?: number) => InventoryItem[]
  getCriticalAlerts: () => StockAlert[]
  getUnacknowledgedAlerts: () => StockAlert[]
  
  getItemsSafe: () => InventoryItem[]
  getItemCount: () => number
  getTotalValue: () => number
  
  setSelectedItem: (itemId: string | null) => void
  updateAlertSettings: (settings: Partial<InventoryState['alertSettings']>) => void
  clearError: () => void
  reset: () => void
}

type InventoryStore = InventoryState & InventoryActions

const STALE_TIME = 2 * 60 * 1000 // 2 minutes for real-time inventory

export const useInventoryStore = create<InventoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: EMPTY_ITEMS,
        alerts: EMPTY_ALERTS,
        movements: EMPTY_MOVEMENTS,
        forecasts: [],
        
        selectedItemId: null,
        loading: false,
        error: null,
        lastFetched: null,
        alertSettings: {
          lowStockThreshold: 20,
          expiringSoonDays: 30,
          anomalyDeviation: 0.3,
          enableAutoReorder: false,
          notificationChannels: ['in_app'],
        },

        fetchInventory: async (storeId?: string) => {
          const now = Date.now()
          const { lastFetched, loading } = get()
          if (loading) return
          if (lastFetched && now - lastFetched < STALE_TIME) return

          set({ loading: true, error: null })
          try {
            // TODO: Replace with actual API call
            // const response = await inventoryService.getItems(storeId)
            
            await new Promise(resolve => setTimeout(resolve, 400))
            logger.info('Inventory', 'Items fetched successfully')
            
            const mockItems = getMockInventoryItems(storeId)
            set({ 
              items: mockItems, 
              loading: false, 
              lastFetched: now 
            })
            
            // Auto-check stock levels after fetching
            await get().checkStockLevels()
          } catch (err) {
            logger.error('Inventory', 'Fetch failed', err)
            set({ 
              error: "获取库存数据失败", 
              loading: false,
              items: EMPTY_ITEMS,
            })
          }
        },

        fetchAlerts: async () => {
          set({ loading: true, error: null })
          try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 300))
            logger.info('Inventory', 'Alerts fetched successfully')
            set({ loading: false })
          } catch (err) {
            logger.error('Inventory', 'Fetch alerts failed', err)
            set({ error: "获取预警信息失败", loading: false })
          }
        },

        addItem: async (itemData): Promise<InventoryItem> => {
          set({ loading: true, error: null })
          try {
            const newItem: InventoryItem = {
              ...itemData,
              id: `inv-${Date.now()}`,
              status: itemData.currentStock > 0 ? 'in_stock' : 'out_of_stock',
              lastRestockedAt: new Date().toISOString(),
              lastCountedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            set(state => ({
              items: [...state.items, newItem],
              loading: false,
            }))

            console.log(`✅ [Inventory] Item created: ${newItem.name}`)
            
            // Check if this item triggers any alerts
            await get().checkStockLevels()
            
            return newItem
          } catch (err) {
            logger.error('Inventory', 'Create item failed', err)
            set({ error: "添加库存失败", loading: false })
            throw err
          }
        },

        updateItem: async (itemId: string, updates: Partial<InventoryItem>) => {
          set({ loading: true, error: null })
          try {
            set(state => ({
              items: state.items.map(item =>
                item.id === itemId
                  ? { ...item, ...updates, updatedAt: new Date().toISOString() }
                  : item
              ),
              loading: false,
            }))
            console.log(`✅ [Inventory] Item updated: ${itemId}`)
            
            // Re-check stock levels after update
            await get().checkStockLevels()
          } catch (err) {
            logger.error('Inventory', 'Update item failed', err)
            set({ error: "更新库存失败", loading: false })
            throw err
          }
        },

        deleteItem: async (itemId: string) => {
          set({ loading: true, error: null })
          try {
            set(state => ({
              items: state.items.filter(item => item.id !== itemId),
              selectedItemId: state.selectedItemId === itemId ? null : state.selectedItemId,
              loading: false,
            }))
            console.log(`✅ [Inventory] Item deleted: ${itemId}`)
          } catch (err) {
            logger.error('Inventory', 'Delete item failed', err)
            set({ error: "删除库存失败", loading: false })
            throw err
          }
        },

        recordMovement: async (itemId, type, quantity, reason, metadata = {}) => {
          const item = get().items.find(i => i.id === itemId)
          if (!item) {
            console.error(`❌ [Inventory] Item ${itemId} not found`)
            return
          }

          const previousStock = item.currentStock
          let newStock = previousStock

          switch (type) {
            case 'restock':
            case 'transfer_in':
            case 'return':
              newStock += quantity
              break
            case 'sale':
            case 'transfer_out':
            case 'waste':
              newStock -= quantity
              break
            case 'adjustment':
              newStock = quantity
              break
          }

          const movement: StockMovement = {
            id: `movement-${Date.now()}`,
            itemId,
            storeId: item.storeId,
            type,
            quantity,
            previousStock,
            newStock,
            reason,
            performedBy: 'current-user',
            createdAt: new Date().toISOString(),
            ...metadata,
          }

          await get().updateItem(itemId, { currentStock: newStock })

          set(state => ({
            movements: [movement, ...state.movements].slice(0, 1000), // Keep last 1000 movements
          }))

          console.log(`📊 [Inventory] Movement recorded: ${type} ${quantity} units of ${item.name}`)

          // Check stock levels after movement
          await get().checkStockLevels()
        },

        checkStockLevels: async () => {
          const { items, alertSettings } = get()
          const newAlerts: StockAlert[] = []

          items.forEach(item => {
            // Low stock warning
            if (item.currentStock <= item.reorderPoint && item.currentStock > 0) {
              newAlerts.push({
                id: `alert-low-${item.id}`,
                itemId: item.id,
                storeId: item.storeId,
                type: 'low_stock',
                severity: 'warning',
                message: `${item.name} 库存不足，当前${item.currentStock}${item.unit}，建议补货`,
                currentValue: item.currentStock,
                thresholdValue: item.reorderPoint,
                suggestedAction: `建议采购 ${item.reorderQuantity}${item.unit}`,
                isAcknowledged: false,
                createdAt: new Date().toISOString(),
              })
            }

            // Out of stock critical
            if (item.currentStock <= 0 && item.status !== 'discontinued') {
              newAlerts.push({
                id: `alert-out-${item.id}`,
                itemId: item.id,
                storeId: item.storeId,
                type: 'out_of_stock',
                severity: 'critical',
                message: `${item.name} 已售罄，请立即补货！`,
                currentValue: 0,
                thresholdValue: 0,
                suggestedAction: `紧急采购 ${item.reorderQuantity}${item.unit}`,
                isAcknowledged: false,
                createdAt: new Date().toISOString(),
              })
            }

            // Expiring soon
            if (item.expiryDate) {
              const daysUntilExpiry = Math.ceil(
                (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
              
              if (daysUntilExpiry > 0 && daysUntilExpiry <= alertSettings.expiringSoonDays) {
                newAlerts.push({
                  id: `alert-exp-${item.id}`,
                  itemId: item.id,
                  storeId: item.storeId,
                  type: 'expiring_soon',
                  severity: daysUntilExpiry <= 7 ? 'critical' : 'warning',
                  message: `${item.name} 将在 ${daysUntilExpiry} 天后过期（${item.expiryDate}）`,
                  currentValue: daysUntilExpiry,
                  thresholdValue: alertSettings.expiringSoonDays,
                  suggestedAction: daysUntilExpiry <= 7 ? '立即促销或报废处理' : '考虑促销活动',
                  isAcknowledged: false,
                  createdAt: new Date().toISOString(),
                })
              } else if (daysUntilExpiry <= 0) {
                newAlerts.push({
                  id: `alert-expired-${item.id}`,
                  itemId: item.id,
                  storeId: item.storeId,
                  type: 'expired',
                  severity: 'critical',
                  message: `${item.name} 已过期（${item.expiryDate}），请立即处理！`,
                  currentValue: daysUntilExpiry,
                  thresholdValue: 0,
                  suggestedAction: '立即隔离并报废处理',
                  isAcknowledged: false,
                  createdAt: new Date().toISOString(),
                })
              }
            }

            // Overstock warning
            if (item.maximumStock > 0 && item.currentStock >= item.maximumStock) {
              newAlerts.push({
                id: `alert-over-${item.id}`,
                itemId: item.id,
                storeId: item.storeId,
                type: 'overstock',
                severity: 'warning',
                message: `${item.name} 库存过多（${item.currentStock}/${item.maximumStock}）`,
                currentValue: item.currentStock,
                thresholdValue: item.maximumStock,
                suggestedAction: '暂停采购或开展促销活动',
                isAcknowledged: false,
                createdAt: new Date().toISOString(),
              })
            }
          })

          // Merge with existing alerts, keeping unacknowledged ones and adding new ones
          set(state => ({
            alerts: [
              ...state.alerts.filter(a => !a.isAcknowledged),
              ...newAlerts.filter(newAlert => 
                !state.alerts.some(existingAlert => existingAlert.itemId === newAlert.itemId && existingAlert.type === newAlert.type)
              ),
            ],
          }))

          const criticalCount = newAlerts.filter(a => a.severity === 'critical').length
          if (criticalCount > 0) {
            console.warn(`⚠️ [Inventory] ${criticalCount} critical alerts generated!`)
          }
        },

        generateForecast: async (itemId: string, days = 30): Promise<InventoryForecast[]> => {
          const item = get().getItemById(itemId)
          if (!item) return []

          try {
            // Simple forecasting algorithm (can be replaced with ML model)
            const forecasts: InventoryForecast[] = []
            const baseDemand = Math.max(1, Math.floor(Math.random() * 10))
            
            for (let i = 1; i <= days; i++) {
              const date = new Date()
              date.setDate(date.getDate() + i)
              
              // Simulate demand with some randomness and trends
              const dayOfWeek = date.getDay()
              const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.5 : 1
              const randomFactor = 0.8 + Math.random() * 0.4
              const predictedDemand = Math.round(baseDemand * weekendMultiplier * randomFactor)
              
              forecasts.push({
                itemId,
                storeId: item.storeId,
                date: date.toISOString().split('T')[0],
                predictedDemand,
                confidenceLevel: 0.7 + Math.random() * 0.2,
                factors: ['历史销售', '季节性', '周末效应'],
                suggestedReorderQuantity: Math.max(0, predictedDemand - item.currentStock),
                estimatedCost: Math.max(0, predictedDemand - item.currentStock) * item.costPrice,
              })
            }

            set(state => ({ forecasts }))
            console.log(`📈 [Inventory] Forecast generated for ${item.name}: ${days} days`)

            return forecasts
          } catch (err) {
            logger.error('Inventory', 'Forecast generation failed', err)
            return []
          }
        },

        acknowledgeAlert: (alertId: string, userId: string) => {
          set(state => ({
            alerts: state.alerts.map(alert =>
              alert.id === alertId
                ? {
                    ...alert,
                    isAcknowledged: true,
                    acknowledgedBy: userId,
                    acknowledgedAt: new Date().toISOString(),
                  }
                : alert
            ),
          }))
          console.log(`✅ [Inventory] Alert ${alertId} acknowledged by ${userId}`)
        },

        getItemById: (id: string) => {
          return (get().items ?? EMPTY_ITEMS).find(item => item.id === id)
        },

        getItemsByCategory: (category: string) => {
          return (get().items ?? EMPTY_ITEMS).filter(item => item.category === category)
        },

        getLowStockItems: () => {
          return (get().items ?? EMPTY_ITEMS).filter(item => 
            item.status === 'low_stock' || item.currentStock <= item.reorderPoint
          )
        },

        getExpiringItems: (daysThreshold = 30) => {
          const thresholdDate = new Date()
          thresholdDate.setDate(thresholdDate.getDate() + daysThreshold)
          
          return (get().items ?? EMPTY_ITEMS).filter(item =>
            item.expiryDate && new Date(item.expiryDate) <= thresholdDate
          )
        },

        getCriticalAlerts: () => {
          return (get().alerts ?? EMPTY_ALERTS).filter(alert => 
            alert.severity === 'critical' && !alert.isAcknowledged
          )
        },

        getUnacknowledgedAlerts: () => {
          return (get().alerts ?? EMPTY_ALERTS).filter(alert => !alert.isAcknowledged)
        },

        getItemsSafe: () => get().items ?? EMPTY_ITEMS,

        getItemCount: () => (get().items ?? EMPTY_ITEMS).length,

        getTotalValue: () => {
          return (get().items ?? EMPTY_ITEMS).reduce((total, item) => 
            total + (item.currentStock * item.costPrice), 0
          )
        },

        setSelectedItem: (itemId: string | null) => set({ selectedItemId: itemId }),

        updateAlertSettings: (settings) => {
          set(state => ({
            alertSettings: { ...state.alertSettings, ...settings },
          }))
          console.log('⚙️ [Inventory] Alert settings updated')
        },

        clearError: () => set({ error: null }),

        reset: () => set({
          items: EMPTY_ITEMS,
          alerts: EMPTY_ALERTS,
          movements: EMPTY_MOVEMENTS,
          forecasts: [],
          selectedItemId: null,
          loading: false,
          error: null,
          lastFetched: null,
        }),
      }),
      {
        name: 'inventory-settings',
        partialize: (state) => ({
          alertSettings: state.alertSettings,
        }),
      }
    ),
    { name: 'InventoryStore' }
  )
)

function getMockInventoryItems(storeId?: string): InventoryItem[] {
  const baseStoreId = storeId || 'store-001'
  
  return [
    {
      id: 'inv-001',
      storeId: baseStoreId,
      name: '百威啤酒',
      nameEn: 'Budweiser Beer',
      category: '酒水',
      sku: 'BEER-BUD-500ML',
      barcode: '6901234567890',
      unit: '瓶',
      currentStock: 45,
      minimumStock: 20,
      maximumStock: 200,
      reorderPoint: 50,
      reorderQuantity: 100,
      costPrice: 8.5,
      sellingPrice: 25,
      supplier: {
        id: 'sup-001',
        name: '广州酒类批发公司',
        contactPhone: '020-8888-6666',
        leadTimeDays: 2,
        minOrderQuantity: 50,
      },
      location: 'A区冷库-01',
      status: 'low_stock',
      lastRestockedAt: '2026-05-20T09:00:00Z',
      lastCountedAt: '2026-05-22T18:00:00Z',
      tags: ['热销', '进口'],
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2026-05-23T08:30:00Z',
    },
    {
      id: 'inv-002',
      storeId: baseStoreId,
      name: '薯片(大包)',
      nameEn: 'Potato Chips (Large)',
      category: '零食',
      sku: 'SNACK-CHIP-LG',
      unit: '包',
      currentStock: 120,
      minimumStock: 30,
      maximumStock: 300,
      reorderPoint: 40,
      reorderQuantity: 80,
      costPrice: 12,
      sellingPrice: 28,
      supplier: {
        id: 'sup-002',
        name: '深圳食品贸易公司',
        contactPhone: '0755-7777-8888',
        leadTimeDays: 3,
        minOrderQuantity: 20,
      },
      location: 'C区货架-15',
      status: 'in_stock',
      lastRestockedAt: '2026-05-18T14:00:00Z',
      lastCountedAt: '2026-05-21T16:00:00Z',
      tags: ['畅销', '休闲'],
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2026-05-22T11:20:00Z',
      expiryDate: '2026-08-15T23:59:59Z',
    },
    {
      id: 'inv-003',
      storeId: baseStoreId,
      name: '果盘拼盘',
      nameEn: 'Fruit Platter',
      category: '果盘',
      sku: 'FRUIT-PLATTER-MIX',
      unit: '份',
      currentStock: 0,
      minimumStock: 10,
      maximumStock: 50,
      reorderPoint: 15,
      reorderQuantity: 20,
      costPrice: 35,
      sellingPrice: 88,
      supplier: {
        id: 'sup-003',
        name: '本地水果批发市场',
        contactPhone: '138-0000-9999',
        leadTimeDays: 1,
        minOrderQuantity: 10,
      },
      location: '厨房冷柜-03',
      status: 'out_of_stock',
      lastRestockedAt: '2026-05-19T07:00:00Z',
      lastCountedAt: '2026-05-23T06:30:00Z',
      tags: ['新鲜', '每日补货'],
      createdAt: '2024-03-10T06:00:00Z',
      updatedAt: '2026-05-23T06:45:00Z',
      expiryDate: '2026-05-24T23:59:59Z',
    },
    {
      id: 'inv-004',
      storeId: baseStoreId,
      name: '可乐(2L)',
      nameEn: 'Coke 2L',
      category: '饮料',
      sku: 'DRINK-COKE-2L',
      unit: '瓶',
      currentStock: 250,
      minimumStock: 50,
      maximumStock: 400,
      reorderPoint: 80,
      reorderQuantity: 120,
      costPrice: 6,
      sellingPrice: 18,
      supplier: {
        id: 'sup-001',
        name: '广州酒类批发公司',
        contactPhone: '020-8888-6666',
        leadTimeDays: 2,
        minOrderQuantity: 24,
      },
      location: 'A区常温-05',
      status: 'in_stock',
      lastRestockedAt: '2026-05-21T11:00:00Z',
      lastCountedAt: '2026-05-22T17:00:00Z',
      tags: ['必备', '高周转'],
      createdAt: '2024-01-20T09:00:00Z',
      updatedAt: '2026-05-21T13:30:00Z',
    },
  ]
}

export type { InventoryState, InventoryActions }
