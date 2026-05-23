import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeMarketStore } from '@/lib/stores/useThemeMarketStore'

describe('useThemeMarketStore', () => {
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

  describe('初始状态', () => {
    it('应该有正确的默认值', () => {
      const state = useThemeMarketStore.getState()
      
      expect(state.searchQuery).toBe('')
      expect(state.selectedCategory).toBe('all')
      expect(state.sortBy).toBe('popular')
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('setSearchQuery', () => {
    it('应该更新搜索关键词', () => {
      useThemeMarketStore.getState().setSearchQuery('极光')
      const state = useThemeMarketStore.getState()

      expect(state.searchQuery).toBe('极光')
    })
  })

  describe('setCategory', () => {
    it('应该更新选中分类', () => {
      useThemeMarketStore.getState().setCategory('trending')
      const state = useThemeMarketStore.getState()

      expect(state.selectedCategory).toBe('trending')
    })
  })

  describe('setSortBy', () => {
    it('应该更新排序方式', () => {
      useThemeMarketStore.getState().setSortBy('rating')
      const state = useThemeMarketStore.getState()

      expect(state.sortBy).toBe('rating')
    })
  })

  describe('voteTheme', () => {
    it('应该能够点赞主题', () => {
      const themeId = 'ct-001'
      
      useThemeMarketStore.getState().voteTheme(themeId, 'up')
      const state = useThemeMarketStore.getState()

      expect(state.userVotes[themeId]).toBe('up')
    })

    it('应该能够踩主题', () => {
      const themeId = 'ct-002'
      
      useThemeMarketStore.getState().voteTheme(themeId, 'down')
      const state = useThemeMarketStore.getState()

      expect(state.userVotes[themeId]).toBe('down')
    })

    it('应该能够更改投票', () => {
      const themeId = 'ct-001'
      
      useThemeMarketStore.getState().voteTheme(themeId, 'up')
      useThemeMarketStore.getState().voteTheme(themeId, 'down')
      const state = useThemeMarketStore.getState()

      expect(state.userVotes[themeId]).toBe('down')
    })
  })

  describe('uploadTheme', () => {
    it('应该添加新主题到列表', () => {
      const initialCount = useThemeMarketStore.getState().themes.length

      useThemeMarketStore.getState().uploadTheme({
        name: '测试主题',
        nameEn: 'Test Theme',
        description: '这是一个测试主题',
        author: '测试作者',
        emoji: '🧪',
        tags: ['测试'],
        colors: {
          light: { primary: '0 0% 0%' },
          dark: { primary: '0 0% 100%' },
        },
      })

      const state = useThemeMarketStore.getState()
      expect(state.themes.length).toBeGreaterThan(initialCount)
    })
  })
})
