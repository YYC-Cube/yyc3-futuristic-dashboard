import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeMarketStore } from '@/lib/stores/useThemeMarketStore'

describe('主题市场集成测试', () => {
  beforeEach(() => {
    useThemeMarketStore.setState({
      themes: [],
      userVotes: {},
      searchQuery: '',
      selectedCategory: 'all',
      sortBy: 'popular',
      loading: false,
      error: null,
    })
  })

  describe('状态管理集成', () => {
    it('应该能够更新搜索状态', () => {
      useThemeMarketStore.setState({ searchQuery: '极光' })
      expect(useThemeMarketStore.getState().searchQuery).toBe('极光')
    })

    it('应该能够更新分类筛选', () => {
      useThemeMarketStore.setState({ selectedCategory: 'trending' })
      expect(useThemeMarketStore.getState().selectedCategory).toBe('trending')
    })

    it('应该能够更新排序方式', () => {
      useThemeMarketStore.setState({ sortBy: 'rating' })
      expect(useThemeMarketStore.getState().sortBy).toBe('rating')
    })

    it('应该能够管理投票状态', () => {
      useThemeMarketStore.setState({
        userVotes: { 'ct-001': 'up' }
      })
      
      expect(useThemeMarketStore.getState().userVotes['ct-001']).toBe('up')
    })

    it('应该在操作过程中正确管理加载和错误状态', () => {
      useThemeMarketStore.setState({ loading: true, error: null })
      expect(useThemeMarketStore.getState().loading).toBe(true)

      useThemeMarketStore.setState({ loading: false, error: '网络错误' })
      expect(useThemeMarketStore.getState().error).toBe('网络错误')

      useThemeMarketStore.setState({ 
        loading: false, 
        error: null 
      })

      expect(useThemeMarketStore.getState().loading).toBe(false)
      expect(useThemeMarketStore.getState().error).toBeNull()
    })
  })
})
