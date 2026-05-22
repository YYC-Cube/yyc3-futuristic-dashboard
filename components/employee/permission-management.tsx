"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Monitor,
  Search,
  Settings,
  Users,
  ShoppingBag,
  DollarSign,
  BarChart3,
  Home,
  Gift,
  Bell,
  Package,
  CreditCard,
  FileText,
  Music,
  Printer,
  AlertCircle,
  Grid,
  Star,
  MessageSquare,
  ClipboardList,
  Cpu,
  PenToolIcon as Tool,
  CheckSquare,
  Activity,
  Heart,
  Clock,
  Warehouse,
} from "lucide-react"

interface Permission {
  id: string
  name: string
  icon: any
  enabled: boolean
  category: string
}

export default function PermissionManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("张三 - 服务员")

  const [functionPermissions, setFunctionPermissions] = useState<Permission[]>([
    { id: "tasks", name: "我的任务", icon: Activity, enabled: true, category: "业务管理" },
    { id: "rooms", name: "包厢状态", icon: Home, enabled: true, category: "业务管理" },
    { id: "orders", name: "订单管理", icon: ClipboardList, enabled: true, category: "业务管理" },
    { id: "gifts", name: "商品赠送", icon: Gift, enabled: true, category: "业务管理" },
    { id: "employee-payment", name: "员工还款", icon: Users, enabled: true, category: "业务管理" },
    { id: "cashier", name: "收银交接", icon: DollarSign, enabled: true, category: "业务管理" },
    { id: "employee-mgmt", name: "员工管理", icon: Users, enabled: true, category: "业务管理" },
    { id: "data-cube", name: "数据魔方", icon: BarChart3, enabled: false, category: "业务管理" },
    { id: "call-service", name: "呼叫服务", icon: Bell, enabled: true, category: "业务管理" },
    { id: "storage-mgmt", name: "寄存管理", icon: Package, enabled: true, category: "业务管理" },
    { id: "notifications", name: "消息通知", icon: MessageSquare, enabled: true, category: "业务管理" },
    { id: "feedback", name: "意见管理", icon: MessageSquare, enabled: false, category: "业务管理" },
    { id: "product-mgmt", name: "商品管理", icon: ShoppingBag, enabled: true, category: "商品管理" },
    { id: "member-marketing", name: "会员营销", icon: Users, enabled: true, category: "营销管理" },
    { id: "store-mgmt", name: "门店管理", icon: Home, enabled: false, category: "门店管理" },
    { id: "bill-mgmt", name: "账单管理", icon: FileText, enabled: true, category: "财务管理" },
    { id: "operation-report", name: "运营日报", icon: BarChart3, enabled: true, category: "报表管理" },
    { id: "booking-mgmt", name: "预定管理", icon: Clock, enabled: true, category: "预定管理" },
    { id: "store-marketing", name: "门店营销", icon: Bell, enabled: true, category: "营销管理" },
  ])

  const [desktopPermissions, setDesktopPermissions] = useState<Permission[]>([
    { id: "sales", name: "销售", icon: DollarSign, enabled: true, category: "桌面版" },
    { id: "products", name: "商品", icon: ShoppingBag, enabled: true, category: "桌面版" },
    { id: "warehouse", name: "仓库", icon: Warehouse, enabled: true, category: "桌面版" },
    { id: "reports", name: "报表", icon: BarChart3, enabled: false, category: "桌面版" },
    { id: "employees", name: "员工", icon: Users, enabled: false, category: "桌面版" },
    { id: "settings", name: "设置", icon: Settings, enabled: false, category: "桌面版" },
    { id: "packages", name: "套账", icon: Package, enabled: true, category: "桌面版" },
  ])

  const [advancedPermissions, setAdvancedPermissions] = useState<Permission[]>([
    { id: "clear-stock", name: "沽清", icon: AlertCircle, enabled: false, category: "高级功能" },
    { id: "print-mgmt", name: "打印管理", icon: Printer, enabled: false, category: "高级功能" },
    { id: "artist-mgmt", name: "艺人管理", icon: Music, enabled: false, category: "高级功能" },
    { id: "gift-settings", name: "赠送设置", icon: Gift, enabled: false, category: "高级功能" },
    { id: "area-product", name: "区域商品管理", icon: Grid, enabled: false, category: "高级功能" },
    { id: "inventory", name: "库存盘点", icon: Package, enabled: false, category: "高级功能" },
    { id: "credit-payment", name: "挂账还款", icon: CreditCard, enabled: false, category: "高级功能" },
    { id: "lost-items", name: "客遗记录", icon: ClipboardList, enabled: false, category: "高级功能" },
    { id: "payment-methods", name: "支付方式", icon: CreditCard, enabled: true, category: "高级功能" },
    { id: "repair-mgmt", name: "报修管理", icon: Tool, enabled: false, category: "高级功能" },
    { id: "approval", name: "审批", icon: CheckSquare, enabled: false, category: "高级功能" },
    { id: "data-control", name: "数据总控台", icon: BarChart3, enabled: false, category: "高级功能" },
    { id: "system-log", name: "系统日志", icon: FileText, enabled: false, category: "高级功能" },
    { id: "smart-academy", name: "超嗨智慧学院", icon: Star, enabled: false, category: "高级功能" },
    { id: "smart-hardware", name: "智慧硬件", icon: Cpu, enabled: false, category: "高级功能" },
    { id: "self-service", name: "自助大厅", icon: Monitor, enabled: false, category: "高级功能" },
    { id: "personal-center", name: "个人中心", icon: Users, enabled: true, category: "高级功能" },
    { id: "service-mgmt", name: "服务生管理", icon: Heart, enabled: false, category: "高级功能" },
  ])

  const togglePermission = (
    permissions: Permission[],
    setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>,
    id: string,
  ) => {
    setPermissions(permissions.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)))
  }

  const toggleAllPermissions = (
    permissions: Permission[],
    setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>,
    enabled: boolean,
  ) => {
    setPermissions(permissions.map((p) => ({ ...p, enabled })))
  }

  const filteredFunctionPermissions = functionPermissions.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDesktopPermissions = desktopPermissions.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAdvancedPermissions = advancedPermissions.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const PermissionGrid = ({
    permissions,
    setPermissions,
    title,
  }: {
    permissions: Permission[]
    setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>
    title: string
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-200">{title}</h3>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleAllPermissions(permissions, setPermissions, true)}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            全选
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleAllPermissions(permissions, setPermissions, false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            全不选
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {permissions.map((permission) => (
          <Card
            key={permission.id}
            className={`bg-slate-800/50 border-slate-700/50 cursor-pointer transition-all hover:bg-slate-700/50 ${
              permission.enabled ? "ring-2 ring-cyan-500/50" : ""
            }`}
            onClick={() => togglePermission(permissions, setPermissions, permission.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`p-3 rounded-full ${
                    permission.enabled ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  <permission.icon className="h-6 w-6" />
                </div>
                <div className="text-sm font-medium text-slate-200">{permission.name}</div>
                <Switch
                  checked={permission.enabled}
                  onCheckedChange={() => togglePermission(permissions, setPermissions, permission.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              权限设置
            </h1>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50">
                当前员工: {selectedEmployee}
              </Badge>
              <Button className="bg-cyan-600 hover:bg-cyan-700">保存设置</Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="搜索权限功能..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* 权限设置标签页 */}
        <Tabs defaultValue="function" className="w-full">
          <TabsList className="bg-slate-800/50 p-1 mb-6">
            <TabsTrigger
              value="function"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <Shield className="h-4 w-4 mr-2" />
              功能权限
            </TabsTrigger>
            <TabsTrigger value="desktop" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <Monitor className="h-4 w-4 mr-2" />
              桌面版权限
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <Settings className="h-4 w-4 mr-2" />
              高级权限
            </TabsTrigger>
          </TabsList>

          <TabsContent value="function" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-cyan-500" />
                  功能权限 (选择前厅收银可见的功能模块)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PermissionGrid
                  permissions={filteredFunctionPermissions}
                  setPermissions={setFunctionPermissions}
                  title="业务功能权限"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="desktop" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <Monitor className="mr-2 h-5 w-5 text-cyan-500" />
                  智慧商家桌面版权限
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PermissionGrid
                  permissions={filteredDesktopPermissions}
                  setPermissions={setDesktopPermissions}
                  title="桌面版功能权限"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-cyan-500" />
                  高级功能权限
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PermissionGrid
                  permissions={filteredAdvancedPermissions}
                  setPermissions={setAdvancedPermissions}
                  title="高级功能权限"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 权限统计 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {functionPermissions.filter((p) => p.enabled).length}
                  </div>
                  <div className="text-sm text-slate-400">功能权限已启用</div>
                </div>
                <Shield className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {desktopPermissions.filter((p) => p.enabled).length}
                  </div>
                  <div className="text-sm text-slate-400">桌面版权限已启用</div>
                </div>
                <Monitor className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {advancedPermissions.filter((p) => p.enabled).length}
                  </div>
                  <div className="text-sm text-slate-400">高级权限已启用</div>
                </div>
                <Settings className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
