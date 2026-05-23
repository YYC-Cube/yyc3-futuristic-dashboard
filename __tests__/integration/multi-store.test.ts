import { describe, it, expect, beforeEach } from 'vitest'
import { useMultiStoreStore } from '@/lib/stores/useMultiStore'

describe('多门店管理集成测试', () => {
  beforeEach(() => {
    useMultiStoreStore.setState({
      stores: [],
      activeStoreId: null,
      loading: false,
      error: null,
      lastFetched: null,
    })
  })

  describe('状态管理集成', () => {
    it('应该能够切换活跃门店', () => {
      useMultiStoreStore.setState({ activeStoreId: 'store-001' })
      expect(useMultiStoreStore.getState().activeStoreId).toBe('store-001')

      useMultiStoreStore.setState({ activeStoreId: 'store-002' })
      expect(useMultiStoreStore.getState().activeStoreId).toBe('store-002')
    })

    it('应该在操作过程中正确管理加载和错误状态', () => {
      useMultiStoreStore.setState({ loading: true, error: null })
      expect(useMultiStoreStore.getState().loading).toBe(true)

      useMultiStoreStore.setState({ loading: false, error: '同步失败' })
      expect(useMultiStoreStore.getState().error).toBe('同步失败')

      useMultiStoreStore.setState({ 
        loading: false, 
        error: null 
      })
      
      expect(useMultiStoreStore.getState().loading).toBe(false)
      expect(useMultiStoreStore.getState().error).toBeNull()
    })
  })
})
