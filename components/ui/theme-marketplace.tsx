'use client'

import * as React from 'react'
import { useThemeMarketStore, type CommunityTheme } from '@/lib/stores/useThemeMarketStore'
import { useThemeConfigStore } from '@/lib/stores/useThemeConfigStore'
import { useTheme } from 'next-themes'
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Download,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Eye,
  Heart,
  Zap,
  Crown,
  Sparkles,
  Calendar,
  ChevronDown,
  Grid3X3,
  List,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeCustomizer } from './theme-customizer'
import { AIRecommendationEngine } from './ai-recommendation-engine'
import { DynamicWallpaper } from './dynamic-wallpaper'

interface ThemeMarketplaceProps {
  className?: string
}

export function ThemeMarketplace({ className }: ThemeMarketplaceProps) {
  const [mounted, setMounted] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [showUploadModal, setShowUploadModal] = React.useState(false)
  const [selectedTheme, setSelectedTheme] = React.useState<CommunityTheme | null>(null)
  const [activeTab, setActiveTab] = React.useState<'market' | 'ai' | 'wallpaper'>('market')

  const { theme, setTheme: setNextTheme } = useTheme()
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    setSearchQuery,
    setCategory,
    setSortBy,
    getFilteredThemes,
    getFeaturedThemes,
    getTrendingThemes,
    voteTheme,
  } = useThemeMarketStore()

  const { setActivePreset, isDarkMode } = useThemeConfigStore()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const filteredThemes = getFilteredThemes()
  const featuredThemes = getFeaturedThemes()
  const trendingThemes = getTrendingThemes()

  // Helper functions (defined inside component to access state)
  const handleThemeSelect = (theme: CommunityTheme) => {
    setSelectedTheme(theme)
  }

  const applyCommunityTheme = (theme: CommunityTheme) => {
    alert(`✨ 已应用主题：${theme.name}\n\n在实际应用中，这将更新全局CSS变量并持久化保存。`)
    setSelectedTheme(null)
  }

  return (
    <div className={cn("w-full max-w-7xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            🏪 YYC3 主题市场
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-normal">
              Community
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            发现、分享、下载社区精选主题 · 共 {filteredThemes.length} 款主题
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Share2 className="h-4 w-4" />
          上传主题
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
        {[
          { id: 'market', label: '主题市场', icon: Grid3X3 },
          { id: 'ai', label: 'AI 推荐', icon: Sparkles },
          { id: 'wallpaper', label: '动态壁纸', icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'market' && (
        <>
          {/* Featured Section */}
          {featuredThemes.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-semibold text-foreground">精选推荐</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredThemes.slice(0, 3).map((theme) => (
                  <FeaturedThemeCard
                    key={theme.id}
                    theme={theme}
                    onSelect={() => handleThemeSelect(theme)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Search and Filters */}
          <div className="space-y-4 p-4 bg-card border border-border rounded-xl">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索主题名称、作者、标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-md border border-border bg-background text-sm"
                >
                  <option value="all">全部分类</option>
                  <option value="popular">热门</option>
                  <option value="new">最新</option>
                  <option value="trending">趋势</option>
                  <option value="seasonal">季节</option>
                  <option value="渐变">渐变</option>
                  <option value="霓虹">霓虹</option>
                  <option value="粉色">粉色</option>
                  <option value="蓝色">蓝色</option>
                  <option value="绿色">绿色</option>
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-1.5 rounded-md border border-border bg-background text-sm"
                >
                  <option value="popular">最受欢迎</option>
                  <option value="newest">最新发布</option>
                  <option value="rating">评分最高</option>
                  <option value="downloads">下载最多</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="ml-auto flex gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'grid' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'list' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Themes Grid/List */}
          {filteredThemes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">😢 没有找到匹配的主题</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                尝试调整搜索关键词或筛选条件
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  onSelect={() => handleThemeSelect(theme)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredThemes.map((theme) => (
                <ThemeListItem
                  key={theme.id}
                  theme={theme}
                  onSelect={() => handleThemeSelect(theme)}
                />
              ))}
            </div>
          )}

          {/* Trending Section */}
          <section className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-foreground">🔥 热门趋势</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingThemes.map((theme, index) => (
                <div
                  key={theme.id}
                  className="relative p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => handleThemeSelect(theme)}
                >
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    #{index + 1}
                  </div>
                  
                  <div className="pl-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{theme.emoji}</span>
                      <h3 className="font-semibold text-foreground">{theme.name}</h3>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      {Object.values(theme.colors.dark).slice(0, 4).map((color, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-lg shadow-sm"
                          style={{ backgroundColor: `hsl(${color})` }}
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>by {theme.author}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {theme.metadata.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {theme.metadata.downloads.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* AI Recommendation Tab */}
      {activeTab === 'ai' && (
        <AIRecommendationEngine
          onRecommendationSelect={(rec) => {
            // AI recommendation selected
          }}
        />
      )}

      {/* Dynamic Wallpaper Tab */}
      {activeTab === 'wallpaper' && (
        <div className="space-y-4">
          <DynamicWallpaper enabled presetId="daily-cycle">
            <div className="p-8 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-bold text-inherit mb-2">动态壁纸演示</h3>
              <p className="text-sm opacity-75">
                背景会根据当前时间自动调整，请查看右上角状态指示器
              </p>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {['dawn', 'morning', 'noon', 'afternoon', 'sunset', 'evening', 'night'].map((period) => (
                  <button
                    key={period}
                    className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-inherit text-sm font-medium"
                  >
                    {getTimePeriodEmoji(period)} {getPeriodLabel(period)}
                  </button>
                ))}
              </div>
            </div>
          </DynamicWallpaper>
          
          <div className="p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50">
            <h4 className="font-semibold text-foreground mb-2">📋 动态壁纸功能说明</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ **时间感知**: 自动识别日出/日午/日落/深夜等7个时段</li>
              <li>✅ **天气联动**: 根据当地天气（晴/阴/雨/雪/暴风雨）调整配色</li>
              <li>✅ **节日特殊**: 在元旦/情人节/国庆/圣诞等节日自动切换特殊主题</li>
              <li>✅ **平滑过渡**: 所有切换均带有1秒渐变动画效果</li>
              <li>⚠️ **注意**: 天气功能需要接入真实天气API（当前为模拟数据）</li>
            </ul>
          </div>
        </div>
      )}

      {/* Theme Detail Modal */}
      {selectedTheme && (
        <ThemeDetailModal
          theme={selectedTheme}
          onClose={() => setSelectedTheme(null)}
          onApply={() => applyCommunityTheme(selectedTheme)}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  )
}

// Theme Card Component
function ThemeCard({ theme, onSelect }: { theme: CommunityTheme; onSelect: () => void }) {
  const { userVotes, voteTheme } = useThemeMarketStore()
  const userVote = userVotes[theme.id]

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg"
      onClick={onSelect}
    >
      {/* Preview Colors */}
      <div className="h-32 bg-gradient-to-br from-background to-muted p-4 flex items-end gap-1">
        {Object.values(theme.colors.dark).slice(0, 5).map((color, i) => (
          <div
            key={i}
            className="flex-1 h-12 rounded-t-lg shadow-md transform group-hover:scale-105 transition-transform"
            style={{ backgroundColor: `hsl(${color})` }}
          />
        ))}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{theme.emoji}</span>
            <div>
              <h3 className="font-semibold text-foreground line-clamp-1">{theme.name}</h3>
              <p className="text-xs text-muted-foreground">by {theme.author}</p>
            </div>
          </div>
          
          {theme.metadata.isFeatured && (
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {theme.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {(theme.metadata.downloads / 1000).toFixed(1)}k
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {theme.metadata.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                voteTheme(theme.id, 'up')
              }}
              className={cn(
                "p-1 rounded transition-colors",
                userVote === 'up' ? "text-green-500 bg-green-500/10" : "hover:bg-accent text-muted-foreground"
              )}
            >
              <ThumbsUp className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                voteTheme(theme.id, 'down')
              }}
              className={cn(
                "p-1 rounded transition-colors",
                userVote === 'down' ? "text-red-500 bg-red-500/10" : "hover:bg-accent text-muted-foreground"
              )}
            >
              <ThumbsDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Featured Theme Card (Larger)
function FeaturedThemeCard({ theme, onSelect }: { theme: CommunityTheme; onSelect: () => void }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 cursor-pointer group hover:shadow-2xl transition-all duration-300"
      onClick={onSelect}
    >
      <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-yellow-500 text-white text-[10px] font-bold flex items-center gap-1">
        <Crown className="h-3 w-3" />
        精选
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{theme.emoji}</span>
          <div>
            <h3 className="text-xl font-bold text-foreground">{theme.name}</h3>
            <p className="text-sm text-muted-foreground">{theme.description}</p>
          </div>
        </div>

        {/* Color Palette */}
        <div className="flex gap-2 mb-4">
          {Object.values(theme.colors.dark).slice(0, 6).map((color, i) => (
            <div
              key={i}
              className="flex-1 h-16 rounded-lg shadow-lg transform group-hover:scale-105 transition-transform"
              style={{ backgroundColor: `hsl(${color})` }}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">by {theme.author}</span>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-400" />
              {theme.metadata.likes.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {(theme.metadata.downloads / 1000).toFixed(1)}k 下载
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// List Item Component
function ThemeListItem({ theme, onSelect }: { theme: CommunityTheme; onSelect: () => void }) {
  const { userVotes, voteTheme } = useThemeMarketStore()
  const userVote = userVotes[theme.id]

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer"
      onClick={onSelect}
    >
      {/* Color Swatches */}
      <div className="flex gap-1 flex-shrink-0">
        {Object.values(theme.colors.dark).slice(0, 4).map((color, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-lg shadow"
            style={{ backgroundColor: `hsl(${color})` }}
          />
        ))}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{theme.emoji}</span>
          <h3 className="font-semibold text-foreground truncate">{theme.name}</h3>
          {theme.metadata.isFeatured && <Crown className="h-4 w-4 text-yellow-500" />}
        </div>
        <p className="text-sm text-muted-foreground truncate">{theme.description}</p>
        <div className="flex gap-1 mt-1">
          {theme.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded bg-accent text-accent-foreground text-[10px]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
        <span>by {theme.author}</span>
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4" />{theme.metadata.rating}
        </span>
        <span className="flex items-center gap-1">
          <Download className="h-4 w-4" />{(theme.metadata.downloads / 1000).toFixed(1)}k
        </span>
        
        <div className="flex gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              voteTheme(theme.id, 'up')
            }}
            className={cn(
              "p-1.5 rounded",
              userVote === 'up' ? "text-green-500 bg-green-500/10" : "hover:bg-accent"
            )}
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              voteTheme(theme.id, 'down')
            }}
            className={cn(
              "p-1.5 rounded",
              userVote === 'down' ? "text-red-500 bg-red-500/10" : "hover:bg-accent"
            )}
          >
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Detail Modal
function ThemeDetailModal({ 
  theme, 
  onClose, 
  onApply 
}: { 
  theme: CommunityTheme
  onClose: () => void
  onApply: () => void 
}) {
  const [previewMode, setPreviewMode] = React.useState<'light' | 'dark'>('dark')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header Image */}
        <div className="h-48 bg-gradient-to-br p-8 flex items-end gap-2" 
             style={{ background: `linear-gradient(135deg, hsl(${theme.colors.dark.primary}), hsl(${theme.colors.dark.accent}))` }}>
          <span className="text-6xl">{theme.emoji}</span>
          <div className="text-white">
            <h2 className="text-3xl font-bold">{theme.name}</h2>
            <p className="opacity-90">{theme.nameEn}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>by {theme.author}</span>
              <span>•</span>
              <span>{theme.metadata.createdAt.split('T')[0]}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode(previewMode === 'dark' ? 'light' : 'dark')}
                className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                {previewMode === 'dark' ? '🌞 亮色预览' : '🌙 暗色预览'}
              </button>
              <button
                onClick={onApply}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                应用此主题
              </button>
            </div>
          </div>

          {/* Color Palette Display */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">配色方案</h3>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(previewMode === 'dark' ? theme.colors.dark : theme.colors.light).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div
                    className="aspect-square rounded-xl shadow-lg mb-2"
                    style={{ backgroundColor: `hsl(${value})` }}
                  />
                  <p className="text-xs font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Tags */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">描述</h3>
            <p className="text-sm text-muted-foreground">{theme.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {theme.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{theme.metadata.downloads.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">下载量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{theme.metadata.likes.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">点赞数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{theme.metadata.rating}</div>
              <div className="text-xs text-muted-foreground">平均评分</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{theme.metadata.totalRatings}</div>
              <div className="text-xs text-muted-foreground">评价数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Upload Modal
function UploadModal({ onClose }: { onClose: () => void }) {
  const { uploadTheme } = useThemeMarketStore()
  const [formData, setFormData] = React.useState({
    name: '',
    nameEn: '',
    description: '',
    author: '匿名用户',
    emoji: '🎨',
    tags: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    uploadTheme({
      ...formData,
      colors: {
        light: {
          primary: '217 91% 60%',
          secondary: '214 95% 93%',
          accent: '210 100% 94%',
          background: '0 0% 100%',
          foreground: '222 47% 11%',
          card: '0 0% 100%',
          cardForeground: '222 47% 11%',
          muted: '210 40% 96%',
          mutedForeground: '215 16% 47%',
          border: '214 32% 91%',
          ring: '224 76% 48%',
          destructive: '0 84% 60%',
          destructiveForeground: '0 0% 98%',
        },
        dark: {
          primary: '217 91% 60%',
          secondaryForeground: '0 0% 98%',
          secondary: '220 15% 18%',
          accent: '217 33% 17%',
          accentForeground: '217 91% 70%',
          background: '222 47% 4%',
          foreground: '210 11% 95%',
          card: '224 40% 8%',
          cardForeground: '210 11% 95%',
          muted: '213 15% 17%',
          mutedForeground: '215 16% 57%',
          border: '216 19% 18%',
          ring: '217 91% 60%',
          destructive: '0 63% 31%',
          destructiveForeground: '0 0% 98%',
        },
      },
    })
    
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">📤 上传主题</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-accent transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">主题名称 *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例如：极光幻境"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">英文名称</label>
            <input
              type="text"
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              placeholder="例如：Aurora Dreams"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">描述 *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="简要描述您的主题风格和适用场景..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">图标 Emoji</label>
              <input
                type="text"
                maxLength={2}
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none text-center text-2xl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">作者名称</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">标签（用逗号分隔）</label>
            <input
              type="text"
              placeholder="例如：渐变, 梦幻, 科技"
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              提交审核
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function getTimePeriodEmoji(period: string): string {
  const emojis: Record<string, string> = {
    dawn: '🌅',
    morning: '☀️',
    noon: '🌞',
    afternoon: '⛅',
    sunset: '🌇',
    evening: '🌆',
    night: '🌙',
  }
  return emojis[period] || '🕐'
}

function getPeriodLabel(period: string): string {
  const labels: Record<string, string> = {
    dawn: '日出',
    morning: '上午',
    noon: '中午',
    afternoon: '下午',
    sunset: '傍晚',
    evening: '晚上',
    night: '深夜',
  }
  return labels[period] || period
}

export default ThemeMarketplace
