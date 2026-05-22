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
      <body className="bg-slate-900 text-white">
        <div className="flex items-center justify-center min-h-screen p-8">
          <Card className="bg-slate-800/50 border-red-500/30 max-w-lg w-full">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">应用出现严重错误</h1>
              <p className="text-slate-400 mb-2">
                {error.message || "发生了未知的应用级错误"}
              </p>
              <p className="text-slate-500 text-sm mb-6">
                错误标识: {error.digest || "N/A"}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={reset}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重试
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-cyan-600 hover:bg-cyan-700"
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
                  className="text-red-400 hover:text-red-300"
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
