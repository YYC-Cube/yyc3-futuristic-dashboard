'use client'

import * as React from 'react'
import { useThemeConfigStore, themePresets, type ThemePreset } from '@/lib/stores/useThemeConfigStore'
import { useTheme } from 'next-themes'
import {
  Palette,
  Download,
  Upload,
  RotateCcw,
  Check,
  Copy,
  Sun,
  Moon,
  Sparkles,
  Eye,
  EyeOff,
  Grid3X3,
  Type,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeCustomizerProps {
  className?: string
}

export function ThemeCustomizer({ className }: ThemeCustomizerProps) {
  const [mounted, setMounted] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'presets' | 'custom' | 'export'>('presets')
  const [copied, setCopied] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(true)
  
  const { theme, setTheme } = useTheme()
  const {
    activePresetId,
    customColors,
    isDarkMode,
    setActivePreset,
    toggleDarkMode,
    exportTheme,
    importTheme,
    resetToDefault,
  } = useThemeConfigStore()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleExport = () => {
    const json = exportTheme()
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
    
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yyc3-theme-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (importTheme(content)) {
        alert('✅ 主题导入成功！')
      } else {
        alert('❌ 无效的主题配置文件')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className={cn(
      "w-full max-w-4xl mx-auto space-y-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            主题定制中心
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            选择预设或自定义配色方案
          </p>
        </div>
        
        {/* Preview Toggle */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            showPreview 
              ? "bg-primary/10 text-primary" 
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          预览
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
        {[
          { id: 'presets', label: '主题预设', icon: Grid3X3 },
          { id: 'custom', label: '自定义颜色', icon: Type },
          { id: 'export', label: '导入导出', icon: Layers },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
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

      {/* Content */}
      <div className="space-y-6">
        {/* Presets Tab */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {themePresets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  isActive={activePresetId === preset.id && !customColors}
                  isDark={isDarkMode}
                  onSelect={() => {
                    setActivePreset(preset.id)
                    applyPreset(preset, isDarkMode)
                  }}
                />
              ))}
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 pt-4 border-t border-border/50">
              <button
                onClick={() => {
                  resetToDefault()
                  if (theme !== 'dark') setTheme('dark')
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-accent text-sm font-medium transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                重置默认
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-accent text-sm font-medium transition-colors"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                切换{isDarkMode ? '亮色' : '暗色'}
              </button>
            </div>
          </div>
        )}

        {/* Custom Tab */}
        {activeTab === 'custom' && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              自定义颜色功能开发中... 🚧
            </p>
            <p className="text-xs text-muted-foreground/70">
              即将支持：HSL 颜色选择器、实时预览、智能推荐配色
            </p>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Export Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  导出主题配置
                </h3>
                <p className="text-sm text-muted-foreground">
                  将当前主题保存为 JSON 文件，便于分享和备份
                </p>
                <button
                  onClick={handleExport}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      已复制到剪贴板并下载
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      导出配置文件
                    </>
                  )}
                </button>
              </div>

              {/* Import Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  导入主题配置
                </h3>
                <p className="text-sm text-muted-foreground">
                  从 JSON 文件恢复之前保存的主题配置
                </p>
                <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  选择配置文件
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Current Config Preview */}
            <details className="pt-4 border-t border-border/50">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                查看当前配置 JSON
              </summary>
              <pre className="mt-3 p-4 bg-background rounded-lg overflow-auto max-h-64 text-xs font-mono text-muted-foreground">
                {exportTheme()}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* Live Preview Panel */}
      {showPreview && (
        <LivePreviewPanel presetId={activePresetId} isDark={isDarkMode} />
      )}
    </div>
  )
}

interface PresetCardProps {
  preset: ThemePreset
  isActive: boolean
  isDark: boolean
  onSelect: () => void
}

function PresetCard({ preset, isActive, isDark, onSelect }: PresetCardProps) {
  const colors = isDark ? preset.dark : preset.light
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative group p-4 rounded-xl border-2 transition-all duration-200 text-left",
        "hover:scale-[1.02] hover:shadow-lg",
        isActive
          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
          : "border-border hover:border-primary/50 bg-card"
      )}
    >
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-2 right-2">
          <Check className="h-4 w-4 text-primary" />
        </div>
      )}

      {/* Color Swatches */}
      <div className="flex gap-1 mb-3">
        {[
          colors.primary,
          colors.secondary,
          colors.accent,
          colors.background,
          colors.foreground,
        ].map((color, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border border-border/50 shadow-sm"
            style={{ backgroundColor: `hsl(${color})` }}
          />
        ))}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{preset.emoji}</span>
          <span className="font-semibold text-foreground">{preset.name}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {preset.description}
        </p>
      </div>

      {/* Hover Sparkle */}
      {isActive && (
        <Sparkles className="absolute top-2 left-2 h-3 w-3 text-primary animate-pulse" />
      )}
    </button>
  )
}

function LivePreviewPanel({ presetId, isDark }: { presetId: string | null; isDark: boolean }) {
  const preset = presetId ? getPresetById(presetId) : null
  
  return (
    <div className={cn(
      "rounded-xl border border-border/50 p-6 backdrop-blur-sm transition-all duration-300",
      isDark ? "bg-card/50" : "bg-background"
    )}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">实时预览</span>
        {preset && (
          <span className="text-xs text-muted-foreground ml-auto">
            当前: {preset.emoji} {preset.name}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Button Preview */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">按钮样式</span>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              主要按钮
            </button>
            <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium">
              次要按钮
            </button>
          </div>
        </div>

        {/* Card Preview */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">卡片样式</span>
          <div className="p-3 rounded-lg bg-card border border-border">
            <div className="h-2 w-16 rounded bg-primary mb-2" />
            <div className="h-2 w-full rounded bg-muted mb-1" />
            <div className="h-2 w-3/4 rounded bg-muted" />
          </div>
        </div>

        {/* Text Preview */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">文字样式</span>
          <div className="space-y-1 text-sm">
            <p className="text-foreground font-medium">主要文字</p>
            <p className="text-muted-foreground">次要文字</p>
            <p className="text-xs text-muted-foreground/70">辅助说明文字</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getPresetById(id: string) {
  return themePresets.find((p) => p.id === id)
}

function applyPreset(preset: ThemePreset, isDark: boolean) {
  const root = document.documentElement
  const colors = isDark ? preset.dark : preset.light
  
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVar, value)
  })
}

export default ThemeCustomizer
