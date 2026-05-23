'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CommunityTheme {
  id: string
  name: string
  nameEn: string
  description: string
  author: string
  authorAvatar?: string
  emoji: string
  tags: string[]
  colors: {
    light: Record<string, string>
    dark: Record<string, string>
  }
  metadata: {
    downloads: number
    likes: number
    dislikes: number
    rating: number
    totalRatings: number
    createdAt: string
    updatedAt: string
    isFeatured: boolean
    category: 'popular' | 'new' | 'trending' | 'seasonal' | 'ai-recommended'
  }
  previewImages?: string[]
}

const EMPTY_THEMES: CommunityTheme[] = []

interface ThemeMarketState {
  themes: CommunityTheme[]
  userVotes: Record<string, 'up' | 'down' | null>
  searchQuery: string
  selectedCategory: string
  sortBy: 'popular' | 'newest' | 'rating' | 'downloads'
  loading: boolean
  error: string | null
}

interface ThemeMarketActions {
  fetchThemes: () => Promise<void>
  voteTheme: (themeId: string, voteType: 'up' | 'down') => void
  uploadTheme: (themeData: Omit<CommunityTheme, 'id' | 'metadata'>) => void
  setSearchQuery: (query: string) => void
  setCategory: (category: string) => void
  setSortBy: (sort: 'popular' | 'newest' | 'rating' | 'downloads') => void
  getFilteredThemes: () => CommunityTheme[]
  getFeaturedThemes: () => CommunityTheme[]
  getTrendingThemes: () => CommunityTheme[]
  reset: () => void

  getThemesSafe: () => CommunityTheme[]
  getThemeCount: () => number
  getThemeById: (id: string) => CommunityTheme | undefined
}

type ThemeMarketStore = ThemeMarketState & ThemeMarketActions

// 模拟社区主题数据
const mockCommunityThemes: CommunityTheme[] = [
  {
    id: 'ct-001',
    name: '极光幻境',
    nameEn: 'Aurora Dreams',
    description: '北极光般的渐变色彩，神秘而梦幻',
    author: '设计师小王',
    emoji: '🌌',
    tags: ['渐变', '梦幻', '极光', '紫色'],
    colors: {
      light: {
        primary: '262 83% 58%',
        primaryForeground: '0 0% 100%',
        secondary: '270 40% 93%',
        accent: '280 60% 90%',
        background: '0 0% 98%',
      },
      dark: {
        primary: '270 70% 55%',
        primaryForeground: '0 0% 100%',
        secondary: '260 25% 12%',
        accent: '275 35% 15%',
        background: '260 20% 5%',
      },
    },
    metadata: {
      downloads: 12580,
      likes: 3420,
      dislikes: 45,
      rating: 4.8,
      totalRatings: 892,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-05-20T14:30:00Z',
      isFeatured: true,
      category: 'popular',
    },
    previewImages: ['/themes/aurora-1.png', '/themes/aurora-2.png'],
  },
  {
    id: 'ct-002',
    name: '赛博朋克2077',
    nameEn: 'Cyberpunk 2077',
    description: '未来霓虹风格，黄紫对比强烈',
    author: '科技极客',
    emoji: '🤖',
    tags: ['霓虹', '科幻', '赛博朋克', '黄色'],
    colors: {
      light: {
        primary: '45 95% 53%',
        primaryForeground: '0 0% 10%',
        secondary: '300 70% 85%',
        accent: '50 95% 92%',
        background: '0 0% 99%',
      },
      dark: {
        primary: '48 96% 89%',
        primaryForeground: '0 0% 8%',
        secondary: '295 65% 18%',
        accent: '45 30% 15%',
        background: '240 15% 3%',
      },
    },
    metadata: {
      downloads: 18920,
      likes: 5670,
      dislikes: 123,
      rating: 4.6,
      totalRatings: 1456,
      createdAt: '2025-02-20T08:00:00Z',
      updatedAt: '2025-06-01T16:45:00Z',
      isFeatured: true,
      category: 'trending',
    },
  },
  {
    id: 'ct-003',
    name: '樱花物语',
    nameEn: 'Sakura Story',
    description: '春日樱花粉嫩，温柔浪漫',
    author: '插画师Lily',
    emoji: '🌸',
    tags: ['粉色', '樱花', '春天', '浪漫'],
    colors: {
      light: {
        primary: '346 77% 50%',
        primaryForeground: '0 0% 100%',
        secondary: '340 60% 94%',
        accent: '350 75% 88%',
        background: '340 30% 99%',
      },
      dark: {
        primary: '346 75% 58%',
        primaryForeground: '0 0% 100%',
        secondary: '345 20% 13%',
        accent: '350 25% 11%',
        background: '340 15% 4%',
      },
    },
    metadata: {
      downloads: 9430,
      likes: 2890,
      dislikes: 67,
      rating: 4.7,
      totalRatings: 723,
      createdAt: '2025-03-10T12:00:00Z',
      updatedAt: '2025-04-15T09:20:00Z',
      isFeatured: false,
      category: 'seasonal',
    },
  },
  {
    id: 'ct-004',
    name: '深海探秘',
    nameEn: 'Deep Ocean Explorer',
    description: '深海蓝色调，沉稳深邃',
    author: '海洋学家',
    emoji: '🐋',
    tags: ['蓝色', '海洋', '深沉', '专业'],
    colors: {
      light: {
        primary: '217 91% 60%',
        primaryForeground: '0 0% 100%',
        secondary: '210 50% 93%',
        accent: '215 70% 86%',
        background: '210 40% 98%',
      },
      dark: {
        primary: '214 90% 52%',
        primaryForeground: '0 0% 100%',
        secondary: '215 28% 14%',
        accent: '212 35% 12%',
        background: '218 25% 4%',
      },
    },
    metadata: {
      downloads: 7650,
      likes: 2130,
      dislikes: 34,
      rating: 4.5,
      totalRatings: 512,
      createdAt: '2025-04-05T15:30:00Z',
      updatedAt: '2025-05-28T11:10:00Z',
      isFeatured: true,
      category: 'new',
    },
  },
  {
    id: 'ct-005',
    name: '森林晨曦',
    nameEn: 'Forest Dawn',
    description: '清晨森林的翠绿，清新自然',
    author: '环保主义者',
    emoji: '🌿',
    tags: ['绿色', '自然', '清新', '生态'],
    colors: {
      light: {
        primary: '142 76% 36%',
        primaryForeground: '0 0% 100%',
        secondary: '138 50% 92%',
        accent: '145 65% 84%',
        background: '140 30% 97%',
      },
      dark: {
        primary: '142 72% 49%',
        primaryForeground: '0 0% 100%',
        secondary: '140 22% 13%',
        accent: '143 30% 11%',
        background: '142 18% 4%',
      },
    },
    metadata: {
      downloads: 11200,
      likes: 3560,
      dislikes: 56,
      rating: 4.7,
      totalRatings: 834,
      createdAt: '2025-03-25T09:00:00Z',
      updatedAt: '2025-06-02T08:45:00Z',
      isFeatured: false,
      category: 'popular',
    },
  },
  {
    id: 'ct-006',
    name: '日落熔岩',
    nameEn: 'Sunset Lava',
    description: '火山熔岩般的橙红，热情奔放',
    author: '摄影师Alex',
    emoji: '🌋',
    tags: ['橙红', '火山', '热情', '活力'],
    colors: {
      light: {
        primary: '24 95% 53%',
        primaryForeground: '0 0% 100%',
        secondary: '30 70% 92%',
        accent: '20 90% 88%',
        background: '25 25% 98%',
      },
      dark: {
        primary: '24 95% 55%',
        primaryForeground: '0 0% 10%',
        secondary: '22 30% 14%',
        accent: '26 35% 12%',
        background: '24 20% 4%',
      },
    },
    metadata: {
      downloads: 6890,
      likes: 1980,
      dislikes: 89,
      rating: 4.3,
      totalRatings: 456,
      createdAt: '2025-05-01T14:00:00Z',
      updatedAt: '2025-06-05T17:30:00Z',
      isFeatured: false,
      category: 'trending',
    },
  },
]

export const useThemeMarketStore = create<ThemeMarketStore>()(
  persist(
    (set, get) => ({
      themes: mockCommunityThemes,
      userVotes: {},
      searchQuery: '',
      selectedCategory: 'all',
      sortBy: 'popular',
      loading: false,
      error: null,

      fetchThemes: async () => {
        set({ loading: true, error: null })
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500))
          console.log('📦 [ThemeMarket] Themes fetched successfully')
          set({ loading: false })
        } catch (err) {
          console.error('❌ [ThemeMarket] Fetch themes failed:', err)
          set({ error: "获取主题列表失败", loading: false, themes: EMPTY_THEMES })
        }
      },

      voteTheme: (themeId: string, voteType: 'up' | 'down') => {
        const { userVotes, themes } = get()
        const previousVote = userVotes[themeId]
        
        if (previousVote === voteType) {
          // 取消投票
          const newVotes = { ...userVotes, [themeId]: null }
          const updatedThemes = themes.map(t => {
            if (t.id === themeId) {
              return {
                ...t,
                metadata: {
                  ...t.metadata,
                  likes: voteType === 'up' ? t.metadata.likes - 1 : t.metadata.likes,
                  dislikes: voteType === 'down' ? t.metadata.dislikes - 1 : t.metadata.dislikes,
                }
              }
            }
            return t
          })
          set({ userVotes: newVotes, themes: updatedThemes })
        } else {
          // 新投票或更改投票
          const newVotes = { ...userVotes, [themeId]: voteType }
          const updatedThemes = themes.map(t => {
            if (t.id === themeId) {
              let newLikes = t.metadata.likes
              let newDislikes = t.metadata.dislikes
              
              if (previousVote === 'up') newLikes--
              else if (previousVote === 'down') newDislikes--
              
              if (voteType === 'up') newLikes++
              else newDislikes++
              
              return {
                ...t,
                metadata: {
                  ...t.metadata,
                  likes: newLikes,
                  dislikes: newDislikes,
                }
              }
            }
            return t
          })
          set({ userVotes: newVotes, themes: updatedThemes })
        }
      },

      uploadTheme: (themeData) => {
        const newTheme: CommunityTheme = {
          ...themeData,
          id: `ct-${Date.now()}`,
          metadata: {
            downloads: 0,
            likes: 0,
            dislikes: 0,
            rating: 0,
            totalRatings: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFeatured: false,
            category: 'new',
          },
        }
        
        set(state => ({
          themes: [newTheme, ...state.themes]
        }))
        
        alert('✅ 主题上传成功！等待审核后将在市场展示。')
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setCategory: (category) => set({ selectedCategory: category }),
      
      setSortBy: (sort) => set({ sortBy: sort }),

      getFilteredThemes: () => {
        const { themes, searchQuery, selectedCategory, sortBy } = get()
        
        let filtered = [...themes]
        
        // 搜索过滤
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.nameEn.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query) ||
            t.tags.some(tag => tag.toLowerCase().includes(query)) ||
            t.author.toLowerCase().includes(query)
          )
        }
        
        // 分类过滤
        if (selectedCategory !== 'all') {
          filtered = filtered.filter(t => 
            t.metadata.category === selectedCategory || 
            t.tags.includes(selectedCategory)
          )
        }
        
        // 排序
        switch (sortBy) {
          case 'popular':
            filtered.sort((a, b) => b.metadata.likes - a.metadata.likes)
            break
          case 'newest':
            filtered.sort((a, b) => 
              new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
            )
            break
          case 'rating':
            filtered.sort((a, b) => b.metadata.rating - a.metadata.rating)
            break
          case 'downloads':
            filtered.sort((a, b) => b.metadata.downloads - a.metadata.downloads)
            break
        }
        
        return filtered
      },

      getFeaturedThemes: () => {
        return get().themes.filter(t => t.metadata.isFeatured)
      },

      getTrendingThemes: () => {
        const safeThemes = get().themes ?? EMPTY_THEMES
        return [...safeThemes]
          .sort((a, b) => {
            const aScore = a.metadata.likes * 0.6 + a.metadata.downloads * 0.0001 * 0.4
            const bScore = b.metadata.likes * 0.6 + b.metadata.downloads * 0.0001 * 0.4
            return bScore - aScore
          })
          .slice(0, 6)
      },

      reset: () => set({
        themes: mockCommunityThemes,
        userVotes: {},
        searchQuery: '',
        selectedCategory: 'all',
        sortBy: 'popular',
        loading: false,
        error: null,
      }),

      getThemesSafe: () => get().themes ?? EMPTY_THEMES,

      getThemeCount: () => (get().themes ?? EMPTY_THEMES).length,

      getThemeById: (id: string) => (get().themes ?? EMPTY_THEMES).find(theme => theme.id === id),
    }),
    {
      name: 'yyc3-theme-market',
      partialize: (state) => ({
        userVotes: state.userVotes,
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
        sortBy: state.sortBy,
      }),
    }
  )
)

export type { ThemeMarketState, ThemeMarketActions }
