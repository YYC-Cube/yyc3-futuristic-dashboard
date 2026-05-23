'use client'

import { ThemeMarketplace } from '@/components/ui/theme-marketplace'
import { GhostModeToggle } from '@/components/ui/ghost-mode-toggle'
import { ArrowLeft, Store, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          
          <GhostModeToggle variant="default" showLabel />
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">首页</Link>
          <span>/</span>
          <Store className="h-4 w-4" />
          <span className="text-foreground font-medium">主题市场</span>
        </div>
      </div>

      {/* Main Content */}
      <ThemeMarketplace />

      {/* Footer Stats */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">1,234+</div>
            <div className="text-sm text-muted-foreground">活跃创作者</div>
          </div>
          
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <Store className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">5,678+</div>
            <div className="text-sm text-muted-foreground">主题作品</div>
          </div>
          
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">89K+</div>
            <div className="text-sm text-muted-foreground">总下载量</div>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          💡 提示：上传您的原创主题，与全球开发者分享！
        </p>
        <p className="text-center text-xs text-muted-foreground/50 mt-2">
          Powered by YanYuCloudCube™ · Theme Marketplace v1.0
        </p>
      </div>
    </div>
  )
}
