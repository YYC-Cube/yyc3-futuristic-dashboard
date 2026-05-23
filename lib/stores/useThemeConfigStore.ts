'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ThemeColors {
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  background: string
  foreground: string
  card: string
  cardForeground: string
  muted: string
  mutedForeground: string
  border: string
  ring: string
  destructive: string
  destructiveForeground: string
}

export interface ThemePreset {
  id: string
  name: string
  nameEn: string
  emoji: string
  description: string
  light: ThemeColors
  dark: ThemeColors
}

interface ThemeConfigState {
  activePresetId: string | null
  customColors: ThemeColors | null
  isDarkMode: boolean
}

interface ThemeConfigActions {
  setActivePreset: (presetId: string) => void
  setCustomColors: (colors: ThemeColors) => void
  toggleDarkMode: () => void
  setDarkMode: (isDark: boolean) => void
  exportTheme: () => string
  importTheme: (json: string) => boolean
  resetToDefault: () => void
  getCurrentColors: () => ThemeColors
  getCurrentColorsSafe: () => ThemeColors
}

type ThemeConfigStore = ThemeConfigState & ThemeConfigActions

const defaultLightColors: ThemeColors = {
  primary: '0 0% 9%',
  primaryForeground: '0 0% 98%',
  secondary: '0 0% 96.1%',
  secondaryForeground: '0 0% 9%',
  accent: '0 0% 96.1%',
  accentForeground: '0 0% 9%',
  background: '0 0% 100%',
  foreground: '0 0% 3.9%',
  card: '0 0% 100%',
  cardForeground: '0 0% 3.9%',
  muted: '0 0% 96.1%',
  mutedForeground: '0 0% 45.1%',
  border: '0 0% 89.8%',
  ring: '0 0% 3.9%',
  destructive: '0 84.2% 60.2%',
  destructiveForeground: '0 0% 98%',
}

const defaultDarkColors: ThemeColors = {
  primary: '0 0% 98%',
  primaryForeground: '0 0% 9%',
  secondary: '0 0% 14.9%',
  secondaryForeground: '0 0% 98%',
  accent: '0 0% 14.9%',
  accentForeground: '0 0% 98%',
  background: '0 0% 3.9%',
  foreground: '0 0% 98%',
  card: '0 0% 3.9%',
  cardForeground: '0 0% 98%',
  muted: '0 0% 14.9%',
  mutedForeground: '0 0% 63.9%',
  border: '0 0% 14.9%',
  ring: '0 0% 83.1%',
  destructive: '0 62.8% 30.6%',
  destructiveForeground: '0 0% 98%',
}

export const useThemeConfigStore = create<ThemeConfigStore>()(
  persist(
    (set, get) => ({
      activePresetId: null,
      customColors: null,
      isDarkMode: true,

      setActivePreset: (presetId) =>
        set({ activePresetId: presetId, customColors: null }),

      setCustomColors: (colors) =>
        set({ customColors: colors, activePresetId: null }),

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

      setDarkMode: (isDark) =>
        set({ isDarkMode: isDark }),

      exportTheme: () => {
        const state = get()
        return JSON.stringify({
          version: '1.0',
          timestamp: new Date().toISOString(),
          presetId: state.activePresetId,
          customColors: state.customColors,
          isDarkMode: state.isDarkMode,
          exportedBy: 'YYC3 Dashboard',
        }, null, 2)
      },

      importTheme: (json) => {
        try {
          const config = JSON.parse(json)
          if (config.version && (config.presetId || config.customColors)) {
            set({
              activePresetId: config.presetId || null,
              customColors: config.customColors || null,
              isDarkMode: config.isDarkMode ?? get().isDarkMode,
            })
            return true
          }
          return false
        } catch {
          return false
        }
      },

      resetToDefault: () =>
        set({
          activePresetId: null,
          customColors: null,
          isDarkMode: true,
        }),

      getCurrentColors: () => {
        const state = get()
        if (state.customColors) return state.customColors
        return state.isDarkMode ? defaultDarkColors : defaultLightColors
      },

      getCurrentColorsSafe: () => {
        try {
          const state = get()
          if (state.customColors) return state.customColors
          return state.isDarkMode ? defaultDarkColors : defaultLightColors
        } catch (err) {
          console.error("❌ [ThemeConfigStore] getCurrentColorsSafe failed:", err)
          return defaultDarkColors
        }
      },
    }),
    {
      name: 'yyc3-theme-config',
      partialize: (state) => ({
        activePresetId: state.activePresetId,
        customColors: state.customColors,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
)

export type { ThemeConfigState, ThemeConfigActions }

export const themePresets: ThemePreset[] = [
  {
    id: 'default',
    name: '默认黑白',
    nameEn: 'Default Monochrome',
    emoji: '⚫',
    description: '经典黑白配色，专业简洁',
    light: defaultLightColors,
    dark: defaultDarkColors,
  },
  {
    id: 'ocean-blue',
    name: '海洋蓝',
    nameEn: 'Ocean Blue',
    emoji: '🌊',
    description: '清新海洋蓝色系，宁静致远',
    light: {
      ...defaultLightColors,
      primary: '217 91% 60%',
      primaryForeground: '0 0% 100%',
      accent: '214 95% 93%',
      accentForeground: '217 91% 60%',
      ring: '217 91% 50%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '217 91% 60%',
      primaryForeground: '0 0% 10%',
      secondary: '220 15% 18%',
      secondaryForeground: '0 0% 95%',
      accent: '217 33% 17%',
      accentForeground: '217 91% 70%',
      ring: '224 71% 55%',
    },
  },
  {
    id: 'forest-green',
    name: '森林绿',
    nameEn: 'Forest Green',
    emoji: '🌲',
    description: '自然森林绿色系，生机盎然',
    light: {
      ...defaultLightColors,
      primary: '142 76% 36%',
      primaryForeground: '0 0% 100%',
      accent: '138 76% 87%',
      accentForeground: '142 76% 30%',
      ring: '142 76% 40%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '142 72% 49%',
      primaryForeground: '0 0% 10%',
      secondary: '142 15% 16%',
      secondaryForeground: '0 0% 95%',
      accent: '142 20% 14%',
      accentForeground: '142 72% 60%',
      ring: '142 71% 45%',
    },
  },
  {
    id: 'royal-purple',
    name: '皇家紫',
    nameEn: 'Royal Purple',
    emoji: '👑',
    description: '高贵皇家紫色系，典雅奢华',
    light: {
      ...defaultLightColors,
      primary: '262 83% 58%',
      primaryForeground: '0 0% 100%',
      accent: '270 100% 94%',
      accentForeground: '262 83% 50%',
      ring: '262 83% 50%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '263 70% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '263 20% 15%',
      secondaryForeground: '0 0% 95%',
      accent: '263 25% 12%',
      accentForeground: '263 70% 65%',
      ring: '263 70% 50%',
    },
  },
  {
    id: 'sunset-orange',
    name: '夕阳橙',
    nameEn: 'Sunset Orange',
    emoji: '🌅',
    description: '温暖夕阳橙色系，活力四射',
    light: {
      ...defaultLightColors,
      primary: '24 95% 53%',
      primaryForeground: '0 0% 100%',
      accent: '24 100% 94%',
      accentForeground: '24 95% 45%',
      ring: '24 95% 45%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '24 95% 53%',
      primaryForeground: '0 0% 10%',
      secondary: '24 15% 16%',
      secondaryForeground: '0 0% 95%',
      accent: '24 20% 13%',
      accentForeground: '24 90% 60%',
      ring: '24 95% 50%',
    },
  },
  {
    id: 'cherry-pink',
    name: '樱花粉',
    nameEn: 'Cherry Pink',
    emoji: '🌸',
    description: '浪漫樱花粉色系，温柔甜美',
    light: {
      ...defaultLightColors,
      primary: '346 77% 50%',
      primaryForeground: '0 0% 100%',
      accent: '342 100% 94%',
      accentForeground: '346 75% 42%',
      ring: '346 77% 45%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '346 75% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '346 15% 15%',
      secondaryForeground: '0 0% 95%',
      accent: '346 20% 12%',
      accentForeground: '346 75% 62%',
      ring: '346 77% 50%',
    },
  },
  {
    id: 'cyber-cyan',
    name: '赛博青',
    nameEn: 'Cyber Cyan',
    emoji: '💎',
    description: '科技赛博青色系，未来感十足',
    light: {
      ...defaultLightColors,
      primary: '186 92% 44%',
      primaryForeground: '0 0% 100%',
      accent: '185 95% 93%',
      accentForeground: '186 90% 38%',
      ring: '186 92% 38%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '187 92% 48%',
      primaryForeground: '0 0% 10%',
      secondary: '188 15% 16%',
      secondaryForeground: '0 0% 95%',
      accent: '188 22% 13%',
      accentForeground: '187 88% 58%',
      ring: '187 85% 50%',
    },
  },
  {
    id: 'golden-yellow',
    name: '黄金金',
    nameEn: 'Golden Yellow',
    emoji: '✨',
    description: '璀璨黄金色系，尊贵华丽',
    light: {
      ...defaultLightColors,
      primary: '45 93% 47%',
      primaryForeground: '0 0% 10%',
      accent: '48 100% 94%',
      accentForeground: '45 90% 40%',
      ring: '45 93% 42%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '48 96% 53%',
      primaryForeground: '0 0% 10%',
      secondary: '48 15% 16%',
      secondaryForeground: '0 0% 95%',
      accent: '48 20% 13%',
      accentForeground: '48 92% 58%',
      ring: '48 93% 50%',
    },
  },
  {
    id: 'rose-red',
    name: '玫瑰红',
    nameEn: 'Rose Red',
    emoji: '🌹',
    description: '热情玫瑰红色系，魅力无限',
    light: {
      ...defaultLightColors,
      primary: '351 89% 52%',
      primaryForeground: '0 0% 100%',
      accent: '350 100% 94%',
      accentForeground: '350 86% 45%',
      ring: '351 89% 48%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '349 85% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '350 15% 15%',
      secondaryForeground: '0 0% 95%',
      accent: '350 20% 12%',
      accentForeground: '349 82% 60%',
      ring: '349 89% 50%',
    },
  },
  {
    id: 'mint-teal',
    name: '薄荷青',
    nameEn: 'Mint Teal',
    emoji: '🍃',
    description: '清新薄荷青色系，清爽怡人',
    light: {
      ...defaultLightColors,
      primary: '175 84% 40%',
      primaryForeground: '0 0% 100%',
      accent: '172 100% 93%',
      accentForeground: '175 80% 35%',
      ring: '175 84% 38%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '174 80% 48%',
      primaryForeground: '0 0% 10%',
      secondary: '176 15% 15%',
      secondaryForeground: '0 0% 95%',
      accent: '176 20% 12%',
      accentForeground: '174 78% 56%',
      ring: '174 82% 50%',
    },
  },
  {
    id: 'lavender',
    name: '薰衣草',
    nameEn: 'Lavender',
    emoji: '💜',
    description: '优雅薰衣草色系，浪漫温馨',
    light: {
      ...defaultLightColors,
      primary: '271 81% 56%',
      primaryForeground: '0 0% 100%',
      accent: '270 100% 94%',
      accentForeground: '271 78% 46%',
      ring: '271 81% 50%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '270 78% 54%',
      primaryForeground: '0 0% 100%',
      secondary: '271 15% 15%',
      secondaryForeground: '0 0% 95%',
      accent: '271 20% 12%',
      accentForeground: '271 76% 60%',
      ring: '271 81% 50%',
    },
  },
  {
    id: 'midnight-navy',
    name: '午夜海军蓝',
    nameEn: 'Midnight Navy',
    emoji: '🌙',
    description: '深邃午夜蓝色系，沉稳大气',
    light: {
      ...defaultLightColors,
      primary: '222 47% 40%',
      primaryForeground: '0 0% 100%',
      accent: '221 60% 93%',
      accentForeground: '222 45% 35%',
      ring: '222 47% 38%',
    },
    dark: {
      ...defaultDarkColors,
      primary: '223 55% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '224 15% 14%',
      secondaryForeground: '0 0% 95%',
      accent: '224 20% 11%',
      accentForeground: '224 52% 58%',
      ring: '224 63% 50%',
    },
  },
]

export function getPresetById(id: string): ThemePreset | undefined {
  return themePresets.find((p) => p.id === id)
}
