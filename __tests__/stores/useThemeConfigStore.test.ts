import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeConfigStore } from '@/lib/stores/useThemeConfigStore'

describe('useThemeConfigStore', () => {
  beforeEach(() => {
    useThemeConfigStore.setState({
      activePresetId: null,
      customColors: null,
      isDarkMode: true,
    })
  })

  describe('初始状态', () => {
    it('应该有正确的默认值', () => {
      const state = useThemeConfigStore.getState()

      expect(state.activePresetId).toBeNull()
      expect(state.customColors).toBeNull()
      expect(state.isDarkMode).toBe(true)
    })
  })

  describe('setActivePreset', () => {
    it('应该设置活跃的主题预设ID', () => {
      useThemeConfigStore.getState().setActivePreset('ocean-blue')

      const state = useThemeConfigStore.getState()
      expect(state.activePresetId).toBe('ocean-blue')
      expect(state.customColors).toBeNull()
    })

    it('应该清除自定义颜色当设置预设时', () => {
      useThemeConfigStore.setState({
        customColors: { primary: 'test' } as any,
        activePresetId: 'old-preset',
      })

      useThemeConfigStore.getState().setActivePreset('new-preset')

      const state = useThemeConfigStore.getState()
      expect(state.activePresetId).toBe('new-preset')
      expect(state.customColors).toBeNull()
    })
  })

  describe('setCustomColors', () => {
    it('应该设置自定义颜色', () => {
      const customColors = {
        primary: '210 100% 50%',
        background: '0 0% 0%',
        foreground: '0 0% 100%',
      } as any

      useThemeConfigStore.getState().setCustomColors(customColors)

      const state = useThemeConfigStore.getState()
      expect(state.customColors).toEqual(customColors)
      expect(state.activePresetId).toBeNull()
    })
  })

  describe('toggleDarkMode', () => {
    it('应该切换暗黑模式状态', () => {
      expect(useThemeConfigStore.getState().isDarkMode).toBe(true)

      useThemeConfigStore.getState().toggleDarkMode()
      expect(useThemeConfigStore.getState().isDarkMode).toBe(false)

      useThemeConfigStore.getState().toggleDarkMode()
      expect(useThemeConfigStore.getState().isDarkMode).toBe(true)
    })
  })

  describe('setDarkMode', () => {
    it('应该设置为暗黑模式', () => {
      useThemeConfigStore.getState().setDarkMode(true)
      expect(useThemeConfigStore.getState().isDarkMode).toBe(true)
    })

    it('应该设置为亮色模式', () => {
      useThemeConfigStore.getState().setDarkMode(false)
      expect(useThemeConfigStore.getState().isDarkMode).toBe(false)
    })
  })

  describe('exportTheme', () => {
    it('应该导出有效的JSON配置', () => {
      const exported = useThemeConfigStore.getState().exportTheme()

      expect(typeof exported).toBe('string')

      const parsed = JSON.parse(exported)
      expect(parsed.version).toBe('1.0')
      expect(parsed.timestamp).toBeDefined()
      expect(parsed.exportedBy).toBe('YYC3 Dashboard')
    })

    it('应该包含当前状态信息', () => {
      useThemeConfigStore.setState({
        activePresetId: 'ocean-blue',
        isDarkMode: false,
      })

      const exported = useThemeConfigStore.getState().exportTheme()
      const parsed = JSON.parse(exported)

      expect(parsed.presetId).toBe('ocean-blue')
      expect(parsed.isDarkMode).toBe(false)
    })
  })

  describe('importTheme', () => {
    it('应该成功导入有效的主题配置', () => {
      const config = JSON.stringify({
        version: '1.0',
        presetId: 'ocean-blue',
        isDarkMode: false,
      })

      const result = useThemeConfigStore.getState().importTheme(config)

      expect(result).toBe(true)
      expect(useThemeConfigStore.getState().activePresetId).toBe('ocean-blue')
      expect(useThemeConfigStore.getState().isDarkMode).toBe(false)
    })

    it('应该拒绝无效的JSON', () => {
      const result = useThemeConfigStore.getState().importTheme('invalid json')
      expect(result).toBe(false)
    })

    it('应该拒绝缺少version的配置', () => {
      const config = JSON.stringify({ presetId: 'test' })
      const result = useThemeConfigStore.getState().importTheme(config)
      expect(result).toBe(false)
    })
  })

  describe('resetToDefault', () => {
    it('应该重置所有状态到默认值', () => {
      useThemeConfigStore.setState({
        activePresetId: 'custom-theme',
        customColors: { primary: 'custom' } as any,
        isDarkMode: false,
      })

      useThemeConfigStore.getState().resetToDefault()

      const state = useThemeConfigStore.getState()
      expect(state.activePresetId).toBeNull()
      expect(state.customColors).toBeNull()
      expect(state.isDarkMode).toBe(true)
    })
  })

  describe('getCurrentColors', () => {
    it('应该返回自定义颜色如果存在', () => {
      const customColors = { primary: 'custom-primary' } as any
      useThemeConfigStore.setState({ customColors })

      const colors = useThemeConfigStore.getState().getCurrentColors()
      expect(colors.primary).toBe('custom-primary')
    })

    it('应该返回暗黑模式默认颜色', () => {
      useThemeConfigStore.setState({
        customColors: null,
        isDarkMode: true,
      })

      const colors = useThemeConfigStore.getState().getCurrentColors()
      expect(colors.primary).toBeDefined()
      expect(colors.background).toBeDefined()
    })
  })

  describe('getCurrentColorsSafe', () => {
    it('应该安全返回当前颜色', () => {
      const colors = useThemeConfigStore.getState().getCurrentColorsSafe()
      expect(colors).toBeDefined()
      expect(colors.primary).toBeDefined()
      expect(colors.background).toBeDefined()
    })
  })

  describe('完整工作流程', () => {
    it('应该支持完整的主题切换流程', () => {
      useThemeConfigStore.getState().resetToDefault()

      useThemeConfigStore.getState().setActivePreset('ocean-blue')
      expect(useThemeConfigStore.getState().activePresetId).toBe('ocean-blue')

      useThemeConfigStore.getState().toggleDarkMode()
      expect(useThemeConfigStore.getState().isDarkMode).toBe(false)

      const colors = useThemeConfigStore.getState().getCurrentColors()
      expect(colors).toBeDefined()

      const exported = useThemeConfigStore.getState().exportTheme()
      expect(exported).toContain('ocean-blue')

      useThemeConfigStore.getState().resetToDefault()
      expect(useThemeConfigStore.getState().activePresetId).toBeNull()
    })
  })
})
