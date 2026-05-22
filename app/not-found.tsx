"use client"

import { useEffect } from "react"
import Link from "next/link"
import * as Sentry from "@sentry/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  useEffect(() => {
    Sentry.captureMessage("Page Not Found", {
      level: "info",
      tags: {
        page: "not-found",
        url: typeof window !== "undefined" ? window.location.href : "",
      },
    })
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <Card className="bg-card/50 border-yellow-500/30 max-w-lg w-full backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="text-8xl font-bold text-yellow-500 mb-4">404</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">页面未找到</h1>
          <p className="text-muted-foreground mb-8">
            抱歉，您访问的页面不存在或已被移除。
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回上页
            </Button>
            <Link href="/rooms">
              <Button variant="ghost" className="text-yellow-500 hover:text-yellow-400">
                <Search className="h-4 w-4 mr-2" />
                浏览包厢
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
