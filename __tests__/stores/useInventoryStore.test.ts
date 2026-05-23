import { describe, it, expect, beforeEach } from 'vitest'
import { useInventoryStore } from '@/lib/stores/useInventoryStore'

describe('useInventoryStore', () => {
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
      useInventoryStore.setState({ error: null })
      
      expect(useInventoryStore.getState().error).toBeNull()
    })
  })

  describe('alertSettings 更新', () => {
    it('应该能够更新预警阈值', () => {
      useInventoryStore.setState({
        alertSettings: {
          ...useInventoryStore.getState().alertSettings,
          lowStockThreshold: 20,
        }
      })

      expect(useInventoryStore.getState().alertSettings.lowStockThreshold).toBe(20)
    })

    it('应该能够更新临期天数', () => {
      useInventoryStore.setState({
        alertSettings: {
          ...useInventoryStore.getState().alertSettings,
          expiringSoonDays: 15,
        }
      })

      expect(useInventoryStore.getState().alertSettings.expiringSoonDays).toBe(15)
    })
  })
})
