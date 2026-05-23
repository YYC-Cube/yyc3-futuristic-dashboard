"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Error:", error)
    
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      try {
        Sentry.captureException(error, {
          contexts: {
            nextjs: {
              digest: error.digest,
            },
          },
          tags: {
            page: "global-error",
            environment: process.env.NEXT_PUBLIC_ENV || "development",
          },
        })
      } catch (sentryError) {
        console.warn("Sentry reporting failed:", sentryError)
      }
    }
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-background">
      <Card className="bg-card/50 border-destructive/30 max-w-lg w-full backdrop-blur-sm shadow-xl">
        <CardContent className="p-12 text-center space-y-6">
          {/* Error Icon */}
          <div className="relative inline-block">
            <AlertTriangle className="h-20 w-20 text-destructive mx-auto animate-pulse" />
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              应用出现严重错误 ⚠️
            </h1>
            <p className="text-muted-foreground text-sm">
              Global Application Error
            </p>
          </div>

          {/* Error Message */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-left">
            <p className="text-destructive font-mono text-sm break-all">
              {error.message || "发生了未知的应用级错误"}
            </p>
            {error.digest && (
              <p className="text-muted-foreground text-xs mt-2 font-mono">
                Error ID: <span className="text-primary">{error.digest}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <Button 
              onClick={reset} 
              variant="outline" 
              size="lg"
              className="min-w-[140px]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              重试加载
            </Button>
            
            <Button
              onClick={() => (window.location.href = "/")}
              size="lg"
              className="min-w-[140px] bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg transition-shadow"
            >
              <Home className="h-4 w-4 mr-2" />
              返回首页
            </Button>
            
            {typeof window !== 'undefined' && typeof Sentry !== 'undefined' && (
              <Button
                variant="ghost"
                onClick={() => {
                  const eventId = (Sentry as any)?.lastEventId?.()
                  if (eventId) {
                    ;(Sentry as any)?.showReportDialog?.({ eventId })
                  } else {
                    alert("无法获取错误报告ID")
                  }
                }}
                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 min-w-[140px]"
              >
                <Bug className="h-4 w-4 mr-2" />
                反馈问题
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-muted-foreground text-xs">
              💡 如果问题持续存在，请尝试清除浏览器缓存或联系技术支持
            </p>
            <p className="text-muted-foreground/50 text-[10px] mt-2">
              Powered by YanYuCloudCube™ · Error Boundary v2.0
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
