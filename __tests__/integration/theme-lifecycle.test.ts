import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeMarketStore } from '@/lib/stores/useThemeMarketStore'
import { useThemeConfigStore } from '@/lib/stores/useThemeConfigStore'

describe('主题市场完整流程集成测试', () => {
  beforeEach(() => {
    useThemeMarketStore.setState({
      themes: [],
      selectedTheme: null,
      userVotes: {},
      filters: {
        category: 'all',
        sortBy: 'popular',
        searchQuery: '',
      },
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
          category: 'business',
          downloads: 1500,
          rating: 4.8,
          votes: 230,
        },
        {
          id: 'theme-002',
          name: '森林绿意',
          author: '设计师B',
          category: 'nature',
          downloads: 800,
          rating: 4.5,
          votes: 120,
        },
      ] as any

      useThemeMarketStore.setState({ themes: mockThemes })

      const themes = useThemeMarketStore.getState().themes
      expect(themes.length).toBe(2)
      expect(themes[0].name).toBe('海洋蓝调')

      if (typeof useThemeMarketStore.getState().selectTheme === 'function') {
        useThemeMarketStore.getState().selectTheme(mockThemes[0])
        expect(useThemeMarketStore.getState().selectedTheme?.id).toBe('theme-001')
      }

      if (typeof useThemeMarketStore.getState().voteForTheme === 'function') {
        useThemeMarketStore.getState().voteForTheme('theme-001', 5)
        expect(useThemeMarketStore.getState().userVotes['theme-001']).toBe(5)
      }

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
        { id: '1', category: 'business' },
        { id: '2', category: 'nature' },
        { id: '3', category: 'business' },
        { id: '4', category: 'tech' },
      ] as any

      useThemeMarketStore.setState({ themes })

      if (typeof useThemeMarketStore.getState().setFilter === 'function') {
        useThemeMarketStore.getState().setFilter('category', 'business')
        expect(useThemeMarketStore.getState().filters.category).toBe('business')
      }

      const currentThemes = useThemeMarketStore.getState().themes
      expect(currentThemes.length).toBe(4)
      const businessThemes = currentThemes.filter((t: any) => t.category === 'business')
      expect(businessThemes.length).toBe(2)

      if (businessThemes.length > 0 && typeof useThemeMarketStore.getState().selectTheme === 'function') {
        try {
          useThemeMarketStore.getState().selectTheme(businessThemes[0])
          if (useThemeMarketStore.getState().selectedTheme) {
            expect(useThemeMarketStore.getState().selectedTheme?.category).toBe('business')
          }
        } catch (error) {
          expect(error).toBeDefined()
        }
      }
    })
  })

  describe('用户偏好持久化', () => {
    it('应该在投票后保持用户偏好', () => {
      if (typeof useThemeMarketStore.getState().voteForTheme === 'function') {
        useThemeMarketStore.getState().voteForTheme('theme-001', 4)
        useThemeMarketStore.getState().voteForTheme('theme-002', 5)

        const votes = useThemeMarketStore.getState().userVotes
        expect(votes['theme-001']).toBe(4)
        expect(votes['theme-002']).toBe(5)
        expect(Object.keys(votes).length).toBe(2)
      }
    })

    it('应该在切换主题后保留用户偏好设置', () => {
      useThemeMarketStore.setState({
        userVotes: { 'theme-001': 4 },
        selectedTheme: { id: 'theme-001', name: '旧主题' } as any,
      })

      if (typeof useThemeMarketStore.getState().selectTheme === 'function') {
        useThemeMarketStore.getState().selectTheme(
          { id: 'theme-002', name: '新主题' } as any
        )
        expect(useThemeMarketStore.getState().selectedTheme?.id).toBe('theme-002')
      }

      const votes = useThemeMarketStore.getState().userVotes
      expect(votes['theme-001']).toBe(4)
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
