"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Home, Clock, Star, TrendingUp } from "lucide-react"

interface BreadcrumbItem {
  id: string
  label: string
  path: string
  icon?: any
  isActive?: boolean
  metadata?: {
    lastVisited?: Date
    visitCount?: number
    avgTimeSpent?: number
  }
}

interface SmartBreadcrumbProps {
  items: BreadcrumbItem[]
  onNavigate?: (path: string) => void
  showMetadata?: boolean
}

export default function SmartBreadcrumb({ items, onNavigate, showMetadata = false }: SmartBreadcrumbProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟`
    return `${Math.floor(seconds / 3600)}小时`
  }

  return (
    <div className="flex items-center space-x-2 py-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate?.("/")}
        className="text-slate-400 hover:text-slate-100 p-1"
      >
        <Home className="h-4 w-4" />
      </Button>

      {items.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
          <ChevronRight className="h-3 w-3 text-slate-500" />

          <div
            className="relative"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.(item.path)}
              className={`text-sm ${
                item.isActive ? "text-cyan-400 font-medium" : "text-slate-300 hover:text-slate-100"
              }`}
            >
              {item.icon && <item.icon className="h-3 w-3 mr-1" />}
              {item.label}
            </Button>

            {/* 智能提示卡片 */}
            {showMetadata && hoveredItem === item.id && item.metadata && (
              <div className="absolute top-full left-0 mt-2 bg-slate-900/95 border border-slate-700/50 rounded-lg p-3 backdrop-blur-sm shadow-xl z-50 min-w-48">
                <div className="text-sm font-medium text-slate-100 mb-2">{item.label}</div>
                <div className="space-y-1 text-xs text-slate-400">
                  {item.metadata.lastVisited && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>上次访问: {item.metadata.lastVisited.toLocaleDateString()}</span>
                    </div>
                  )}
                  {item.metadata.visitCount && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>访问次数: {item.metadata.visitCount}</span>
                    </div>
                  )}
                  {item.metadata.avgTimeSpent && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>平均停留: {formatTimeSpent(item.metadata.avgTimeSpent)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
