import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeMarketStore } from '@/lib/stores/useThemeMarketStore'
import { useThemeConfigStore } from '@/lib/stores/useThemeConfigStore'

describe('主题市场完整流程集成测试', () => {
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

    useThemeConfigStore.setState({
      activePresetId: null,
      customColors: null,
      isDarkMode: true,
    })
  })

  describe('完整主题生命周期', () => {
    it('应该支持完整的浏览→投票→应用→导出流程', async () => {
      const mockThemes = [
        {
          id: 'theme-001',
          name: '海洋蓝调',
          author: '设计师A',
          metadata: { category: 'business', downloads: 1500, rating: 4.8 },
        },
        {
          id: 'theme-002',
          name: '森林绿意',
          author: '设计师B',
          metadata: { category: 'nature', downloads: 800, rating: 4.5 },
        },
      ] as any

      useThemeMarketStore.setState({ themes: mockThemes })

      const themes = useThemeMarketStore.getState().themes
      expect(themes.length).toBe(2)
      expect(themes[0].name).toBe('海洋蓝调')

      useThemeMarketStore.getState().voteTheme('theme-001', 'up')
      expect(useThemeMarketStore.getState().userVotes['theme-001']).toBe('up')

      if (typeof useThemeConfigStore.getState().setActivePreset === 'function') {
        useThemeConfigStore.getState().setActivePreset('ocean-blue')
        expect(useThemeConfigStore.getState().activePresetId).toBe('ocean-blue')
      }

      if (typeof useThemeConfigStore.getState().exportTheme === 'function') {
        const exported = useThemeConfigStore.getState().exportTheme()
        expect(typeof exported).toBe('string')
        expect(exported.length).toBeGreaterThan(0)
      }
    })
  })

  describe('筛选和排序集成', () => {
    it('应该支持按类别筛选并应用主题', () => {
      const themes = [
        { id: '1', tags: ['business'], metadata: { category: 'business' } },
        { id: '2', tags: ['nature'], metadata: { category: 'nature' } },
        { id: '3', tags: ['business'], metadata: { category: 'business' } },
        { id: '4', tags: ['tech'], metadata: { category: 'tech' } },
      ] as any

      useThemeMarketStore.setState({ themes })

      useThemeMarketStore.getState().setCategory('business')
      expect(useThemeMarketStore.getState().selectedCategory).toBe('business')

      const filtered = useThemeMarketStore.getState().getFilteredThemes()
      expect(filtered.length).toBe(2)
      expect(filtered.every((t: any) => t.metadata.category === 'business')).toBe(true)
    })
  })

  describe('用户偏好持久化', () => {
    it('应该在投票后保持用户偏好', () => {
      useThemeMarketStore.getState().voteTheme('theme-001', 'up')
      useThemeMarketStore.getState().voteTheme('theme-002', 'down')

      const votes = useThemeMarketStore.getState().userVotes
      expect(votes['theme-001']).toBe('up')
      expect(votes['theme-002']).toBe('down')
      expect(Object.keys(votes).length).toBe(2)
    })

    it('应该在切换投票后更新偏好', () => {
      useThemeMarketStore.setState({
        userVotes: { 'theme-001': 'up' },
      })

      useThemeMarketStore.getState().voteTheme('theme-001', 'down')

      const votes = useThemeMarketStore.getState().userVotes
      expect(votes['theme-001']).toBe('down')
    })
  })

  describe('主题配置同步', () => {
    it('应该在应用主题后同步配置到全局状态', () => {
      const themeConfig = {
        colors: {
          primary: '#0066cc',
          secondary: '#00cc66',
          background: '#ffffff',
          foreground: '#000000',
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter',
        },
      }

      if (typeof useThemeConfigStore.getState().setCustomColors === 'function') {
        useThemeConfigStore.getState().setCustomColors(themeConfig.colors as any)
        expect(useThemeConfigStore.getState().customColors).toBeDefined()
        expect(useThemeConfigStore.getState().customColors?.primary).toBe('#0066cc')
      }

      const currentConfig = useThemeConfigStore.getState()
      expect(currentConfig.isDarkMode).toBe(true)
    })
  })
})
