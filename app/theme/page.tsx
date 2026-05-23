'use client'

import { ThemeCustomizer } from '@/components/ui/theme-customizer'
import { GhostModeToggle } from '@/components/ui/ghost-mode-toggle'
import {
  Palette,
  ArrowLeft,
  Sparkles,
  Zap,
  Download,
  Upload,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ThemePage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
              "text-muted-foreground hover:text-foreground transition-colors"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          
          <GhostModeToggle variant="default" showLabel />
        </div>
        
        <div className="mt-6 text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <Palette className="h-8 w-8 text-primary" />
            YYC3 主题定制中心
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            打造专属于你的个性化界面，支持 12 种精选预设、自定义配色和导入导出
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {[
            { icon: Palette, label: '12种预设', desc: '精选配色方案' },
            { icon: Zap, label: '实时预览', desc: '所见即所得' },
            { icon: Download, label: '一键导出', desc: 'JSON配置文件' },
            { icon: Upload, label: '快速导入', desc: '恢复备份配置' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="p-3 rounded-lg bg-card border border-border/50 text-center space-y-1"
            >
              <feature.icon className="h-5 w-5 text-primary mx-auto" />
              <p className="text-xs font-semibold text-foreground">{feature.label}</p>
              <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <ThemeCustomizer />

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-border/50 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          💡 提示：选择预设后可立即生效，支持亮色/暗色模式切换
        </p>
        <p className="text-xs text-muted-foreground/50">
          Powered by YanYuCloudCube™ · Theme System v2.0
        </p>
      </div>
    </div>
  )
}
