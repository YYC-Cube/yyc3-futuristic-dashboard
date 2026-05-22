"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface PageLoaderProps {
  message?: string
}

export default function PageLoader({ message = "加载中..." }: PageLoaderProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-8 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="text-slate-400 text-sm">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
