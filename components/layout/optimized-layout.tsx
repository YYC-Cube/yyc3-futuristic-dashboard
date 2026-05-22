"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  MessageSquare,
  Bot,
  Users,
  BarChart3,
  Settings,
  Bell,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
  Grid3X3,
  Layout,
} from "lucide-react"
import AIAssistant from "../chat/ai-assistant"
import DepartmentChannels from "../communication/department-channels"
import BreadcrumbNav from "../navigation/breadcrumb-nav"

interface OptimizedLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  rightPanel?: React.ReactNode
}

export default function OptimizedLayout({ children, sidebar, rightPanel }: OptimizedLayoutProps) {
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isAIMinimized, setIsAIMinimized] = useState(false)
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false)
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [layoutMode, setLayoutMode] = useState<"standard" | "focus" | "communication">("standard")

  const toggleAI = () => {
    if (isAIOpen && !isAIMinimized) {
      setIsAIMinimized(true)
    } else if (isAIMinimized) {
      setIsAIMinimized(false)
    } else {
      setIsAIOpen(true)
    }
  }

  const closeAI = () => {
    setIsAIOpen(false)
    setIsAIMinimized(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100">
      {/* 顶部工具栏 */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
              className="text-slate-400 hover:text-slate-100"
            >
              {leftSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant={layoutMode === "standard" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayoutMode("standard")}
                className="text-xs"
              >
                <Layout className="h-3 w-3 mr-1" />
                标准
              </Button>
              <Button
                variant={layoutMode === "focus" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayoutMode("focus")}
                className="text-xs"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                专注
              </Button>
              <Button
                variant={layoutMode === "communication" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayoutMode("communication")}
                className="text-xs"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                沟通
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={isCommunicationOpen ? "default" : "ghost"}
              size="icon"
              onClick={() => setIsCommunicationOpen(!isCommunicationOpen)}
              className="relative"
            >
              <Users className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
            </Button>

            <Button variant={isAIOpen ? "default" : "ghost"} size="icon" onClick={toggleAI} className="relative">
              <Bot className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-purple-500 rounded-full animate-pulse"></span>
            </Button>

            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pt-12 flex h-screen">
        {/* 左侧边栏 */}
        {!leftSidebarCollapsed && layoutMode !== "focus" && (
          <div className={`${layoutMode === "communication" ? "w-64" : "w-80"} transition-all duration-300`}>
            {sidebar}
          </div>
        )}

        {/* 中央内容区 */}
        <div className="flex-1 flex flex-col">
          {/* 面包屑导航 */}
          <BreadcrumbNav
            leftItems={[
              { label: "数据总览", icon: BarChart3 },
              { label: "实时监控", icon: BarChart3 },
            ]}
            rightItems={[
              { label: "员工管理", icon: Users },
              { label: "权限设置", icon: Settings },
            ]}
            currentUser={{
              name: "管理员",
              role: "系统管理员",
              store: "时代星光",
            }}
          />

          {/* 主内容 */}
          <div className="flex-1 overflow-auto">
            {layoutMode === "communication" ? (
              <div className="h-full">
                <DepartmentChannels />
              </div>
            ) : (
              <div className="p-6">{children}</div>
            )}
          </div>
        </div>

        {/* 右侧面板 */}
        {!rightPanelCollapsed && layoutMode === "standard" && rightPanel && (
          <div className="w-80 transition-all duration-300">{rightPanel}</div>
        )}

        {/* 通讯面板 */}
        {isCommunicationOpen && layoutMode !== "communication" && (
          <Card className="fixed right-4 top-16 w-96 h-[calc(100vh-80px)] bg-slate-900/95 border-slate-700/50 backdrop-blur-sm shadow-2xl z-30">
            <div className="h-full">
              <DepartmentChannels />
            </div>
          </Card>
        )}
      </div>

      {/* AI助手 */}
      {isAIOpen && (
        <AIAssistant
          isMinimized={isAIMinimized}
          onToggleMinimize={() => setIsAIMinimized(!isAIMinimized)}
          onClose={closeAI}
        />
      )}

      {/* 浮动操作按钮 */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col space-y-2">
        {layoutMode === "focus" && (
          <Button
            onClick={() => setLayoutMode("standard")}
            className="bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm"
          >
            <Layout className="h-4 w-4 mr-2" />
            退出专注模式
          </Button>
        )}
      </div>
    </div>
  )
}
