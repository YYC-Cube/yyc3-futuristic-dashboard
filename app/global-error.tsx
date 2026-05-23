"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug,
  Terminal,
  Shield
} from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("🚨 Global Error (Root Level):", error)
    
    // Sentry 错误上报（带安全检查）
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      try {
        if (typeof Sentry !== 'undefined' && Sentry.captureException) {
          Sentry.captureException(error, {
            contexts: {
              nextjs: {
                digest: error.digest,
                errorType: 'root-level',
              },
            },
            tags: {
              page: "global-error",
              environment: process.env.NEXT_PUBLIC_ENV || "development",
              severity: "critical",
            },
            level: "error" as const,
          })
        }
      } catch (sentryError) {
        console.warn("⚠️ Sentry reporting failed:", sentryError)
      }
    }
  }, [error])

  return (
    <html lang="zh-CN">
      <body className="bg-background text-foreground antialiased">
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-destructive/5 via-background to-destructive/5">
          {/* Background Effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-destructive/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-destructive/5 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          {/* Main Error Card */}
          <Card className="w-full max-w-2xl backdrop-blur-sm border-destructive/30 shadow-2xl relative z-10">
            <CardContent className="p-8 md:p-12 space-y-8">
              
              {/* Header Section */}
              <div className="text-center space-y-4">
                {/* Icon with Badge */}
                <div className="relative inline-block">
                  <div className="relative">
                    <AlertTriangle className="h-24 w-24 text-destructive mx-auto animate-pulse" />
                    <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-ping" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-8 w-8 bg-destructive rounded-full flex items-center justify-center border-4 border-background shadow-lg">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    应用发生严重错误 💥
                  </h1>
                  <p className="text-muted-foreground text-base">
                    Root-Level Global Application Error
                  </p>
                </div>
              </div>

              {/* Error Details Box */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-t-lg bg-destructive/10 border border-b-0 border-destructive/20">
                  <Terminal className="h-4 w-4 text-destructive" />
                  <span className="text-xs font-semibold text-destructive uppercase tracking-wider">
                    错误详情
                  </span>
                </div>
                
                <div className="bg-card border border-destructive/20 rounded-b-lg p-6 space-y-4">
                  {/* Error Message */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                      Message
                    </label>
                    <p className="text-destructive font-mono text-sm break-all leading-relaxed bg-destructive/5 p-3 rounded-md border border-destructive/10">
                      {error.message || "发生了未知的根级别错误"}
                    </p>
                  </div>

                  {/* Error Digest/ID */}
                  {error.digest && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                        Error ID
                      </label>
                      <code className="block text-primary font-mono text-xs bg-primary/5 p-3 rounded-md border border-primary/10 break-all">
                        {error.digest}
                      </code>
                    </div>
                  )}

                  {/* Stack Trace Preview */}
                  {error.stack && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                        Stack Trace (Preview)
                      </label>
                      <pre className="text-muted-foreground font-mono text-[11px] leading-relaxed bg-muted/50 p-3 rounded-md border border-border/50 max-h-32 overflow-y-auto whitespace-pre-wrap">
                        {error.stack.split('\n').slice(0, 10).join('\n')}
                        {error.stack.split('\n').length > 10 && '\n...'}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  onClick={reset} 
                  variant="outline" 
                  size="lg"
                  className="min-w-[160px] font-medium hover:bg-accent transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重试加载
                </Button>
                
                <Button
                  onClick={() => (window.location.href = "/")}
                  size="lg"
                  className="min-w-[160px] font-medium bg-gradient-to-r from-primary to-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all"
                >
                  <Home className="h-4 w-4 mr-2" />
                  返回首页
                </Button>
                
                {/* Sentry Feedback Button (Conditional) */}
                {typeof window !== 'undefined' && typeof Sentry !== 'undefined' && (Sentry as any)?.lastEventId && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const eventId = (Sentry as any).lastEventId()
                      if (eventId) {
                        ;(Sentry as any).showReportDialog({ eventId })
                      } else {
                        alert("无法获取错误报告ID")
                      }
                    }}
                    className="min-w-[160px] font-medium text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-colors"
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    反馈问题
                  </Button>
                )}
              </div>

              {/* Security Notice */}
              <div className="pt-6 border-t border-border/50 space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      🔒 安全提示
                    </p>
                    <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                      <li>此错误已被自动记录用于诊断</li>
                      <li>请勿在公开场合分享 Error ID</li>
                      <li>如需帮助请联系技术支持团队</li>
                    </ul>
                  </div>
                </div>

                {/* Help Text */}
                <div className="text-center space-y-2 pt-2">
                  <p className="text-muted-foreground text-sm">
                    💡 如果问题持续存在，请尝试以下操作：
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground/70">
                    <kbd className="px-2 py-1 rounded bg-card border border-border shadow-sm">清除浏览器缓存</kbd>
                    <span>·</span>
                    <kbd className="px-2 py-1 rounded bg-card border border-border shadow-sm">禁用浏览器扩展</kbd>
                    <span>·</span>
                    <kbd className="px-2 py-1 rounded bg-card border border-border shadow-sm">更换浏览器</kbd>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-border/50 text-center space-y-1">
                  <p className="text-[11px] text-muted-foreground/50">
                    Powered by YanYuCloudCube™ · Global Error Boundary v2.0
                  </p>
                  <p className="text-[10px] text-muted-foreground/30">
                    Environment: {process.env.NEXT_PUBLIC_ENV || 'development'} · Timestamp: {new Date().toISOString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
