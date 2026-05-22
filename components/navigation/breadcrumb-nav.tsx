"use client"

import { ChevronRight, Users, BarChart3, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: any
}

interface BreadcrumbNavProps {
  leftItems: BreadcrumbItem[]
  rightItems: BreadcrumbItem[]
  currentUser?: {
    name: string
    role: string
    store: string
  }
}

export default function BreadcrumbNav({ leftItems, rightItems, currentUser }: BreadcrumbNavProps) {
  return (
    <div className="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-sm px-6 py-3">
      <div className="flex items-center justify-between">
        {/* 左侧：经营运维导航 */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-slate-400">
            <BarChart3 className="h-4 w-4 mr-1" />
            <span className="font-medium">经营运维</span>
          </div>
          {leftItems.length > 0 && <ChevronRight className="h-4 w-4 text-slate-500" />}
          <nav className="flex items-center space-x-2">
            {leftItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && <ChevronRight className="h-3 w-3 text-slate-500" />}
                <div className="flex items-center">
                  {item.icon && <item.icon className="h-3 w-3 mr-1 text-cyan-400" />}
                  <span
                    className={`text-sm ${
                      index === leftItems.length - 1
                        ? "text-cyan-400 font-medium"
                        : "text-slate-300 hover:text-slate-100 cursor-pointer"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* 中间：当前用户信息 */}
        {currentUser && (
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600/50">
              <Building className="h-3 w-3 mr-1" />
              {currentUser.store}
            </Badge>
            <div className="text-sm text-slate-400">
              <span className="text-slate-300">{currentUser.name}</span>
              <span className="mx-1">·</span>
              <span>{currentUser.role}</span>
            </div>
          </div>
        )}

        {/* 右侧：团队系统导航 */}
        <div className="flex items-center space-x-2">
          <nav className="flex items-center space-x-2">
            {rightItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && <ChevronRight className="h-3 w-3 text-slate-500" />}
                <div className="flex items-center">
                  {item.icon && <item.icon className="h-3 w-3 mr-1 text-purple-400" />}
                  <span
                    className={`text-sm ${
                      index === rightItems.length - 1
                        ? "text-purple-400 font-medium"
                        : "text-slate-300 hover:text-slate-100 cursor-pointer"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </nav>
          {rightItems.length > 0 && <ChevronRight className="h-4 w-4 text-slate-500" />}
          <div className="flex items-center text-sm text-slate-400">
            <span className="font-medium">团队系统</span>
            <Users className="h-4 w-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
