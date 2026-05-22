"use client"

import { Badge } from "@/components/ui/badge"

interface StatusIndicatorProps {
  status: "online" | "offline" | "maintenance" | "warning"
  label: string
  showDot?: boolean
}

export default function StatusIndicator({ status, label, showDot = true }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          color: "bg-green-500/20 text-green-400 border-green-500/50",
          dotColor: "bg-green-500",
          text: "在线",
        }
      case "offline":
        return {
          color: "bg-red-500/20 text-red-400 border-red-500/50",
          dotColor: "bg-red-500",
          text: "离线",
        }
      case "maintenance":
        return {
          color: "bg-amber-500/20 text-amber-400 border-amber-500/50",
          dotColor: "bg-amber-500",
          text: "维护中",
        }
      case "warning":
        return {
          color: "bg-orange-500/20 text-orange-400 border-orange-500/50",
          dotColor: "bg-orange-500",
          text: "警告",
        }
      default:
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-500/50",
          dotColor: "bg-gray-500",
          text: "未知",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge variant="outline" className={config.color}>
      {showDot && <div className={`h-2 w-2 rounded-full ${config.dotColor} mr-2 animate-pulse`}></div>}
      {label || config.text}
    </Badge>
  )
}
