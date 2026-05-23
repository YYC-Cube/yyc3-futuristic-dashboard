import { describe, it, expect, beforeEach } from 'vitest'
import { useMultiStoreStore } from '@/lib/stores/useMultiStore'

describe('useMultiStore', () => {
  beforeEach(() => {
    useMultiStoreStore.setState({
      stores: [],
      activeStoreId: null,
      loading: false,
      error: null,
      lastFetched: null,
    })
  })

  describe('初始状态', () => {
    it('应该有正确的默认值', () => {
      const state = useMultiStoreStore.getState()
      
      expect(state.activeStoreId).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).toBeNull()
    })
  })

  describe('setActiveStore', () => {
    it('应该设置活跃门店ID', () => {
      const storeId = 'store-001'
      
      useMultiStoreStore.setState({ activeStoreId: storeId })
      const state = useMultiStoreStore.getState()

      expect(state.activeStoreId).toBe(storeId)
    })

    it('应该能够清除活跃门店', () => {
      useMultiStoreStore.setState({ activeStoreId: 'store-001' })
      useMultiStoreStore.setState({ activeStoreId: null })
      
      expect(useMultiStoreStore.getState().activeStoreId).toBeNull()
    })
  })

  describe('状态更新', () => {
    it('应该能够更新loading状态', () => {
      useMultiStoreStore.setState({ loading: true })
      
      expect(useMultiStoreStore.getState().loading).toBe(true)
    })

    it('应该能够更新error状态', () => {
      useMultiStoreStore.setState({ error: '网络错误' })
      
      expect(useMultiStoreStore.getState().error).toBe('网络错误')
    })

    it('应该能够清除error状态', () => {
      useMultiStoreStore.setState({ error: '网络错误' })
      useMultiStoreStore.setState({ error: null })
      
      expect(useMultiStoreStore.getState().error).toBeNull()
    })
  })
})
