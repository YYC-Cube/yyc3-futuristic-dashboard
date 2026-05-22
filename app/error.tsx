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
  }, [error])

  return (
    <html>
      <body className="bg-background text-foreground">
        <div className="flex items-center justify-center min-h-screen p-8">
          <Card className="bg-card/50 border-destructive/30 max-w-lg w-full backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-4">应用出现严重错误</h1>
              <p className="text-muted-foreground mb-2">
                {error.message || "发生了未知的应用级错误"}
              </p>
              <p className="text-muted-foreground/70 text-sm mb-6">
                错误标识: {error.digest || "N/A"}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={reset} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重试
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  返回首页
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const eventId = Sentry.lastEventId()
                    if (eventId) {
                      Sentry.showReportDialog({ eventId })
                    }
                  }}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  反馈问题
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
