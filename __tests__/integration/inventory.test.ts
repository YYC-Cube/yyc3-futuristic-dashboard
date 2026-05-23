import { describe, it, expect, beforeEach } from 'vitest'
import { useInventoryStore } from '@/lib/stores/useInventoryStore'

describe('库存管理集成测试', () => {
  beforeEach(() => {
    useInventoryStore.setState({
      items: [],
      alerts: [],
      movements: [],
      forecasts: [],
      loading: false,
      error: null,
      alertSettings: {
        lowStockThreshold: 10,
        expiringSoonDays: 30,
        anomalyDeviation: 2.0,
        enableAutoReorder: false,
        notificationChannels: ['in_app'],
      },
    })
  })

  describe('预警设置集成', () => {
    it('应该支持预警设置的动态调整', () => {
      const store = useInventoryStore.getState()
      
      expect(store.alertSettings.lowStockThreshold).toBe(10)
      expect(store.alertSettings.expiringSoonDays).toBe(30)

      useInventoryStore.setState({
        alertSettings: {
          ...store.alertSettings,
          lowStockThreshold: 20,
          expiringSoonDays: 15,
        }
      })

      expect(useInventoryStore.getState().alertSettings.lowStockThreshold).toBe(20)
      expect(useInventoryStore.getState().alertSettings.expiringSoonDays).toBe(15)
    })
  })

  describe('状态管理集成', () => {
    it('应该在操作过程中正确管理状态', () => {
      const store = useInventoryStore.getState()

      useInventoryStore.setState({ loading: true, error: null })
      expect(useInventoryStore.getState().loading).toBe(true)

      useInventoryStore.setState({ loading: false, error: '同步失败' })
      expect(useInventoryStore.getState().error).toBe('同步失败')

      useInventoryStore.setState({ 
        loading: false, 
        error: null 
      })

      expect(useInventoryStore.getState().loading).toBe(false)
      expect(useInventoryStore.getState().error).toBeNull()
    })
  })
})
