"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRoomStore } from "@/lib/stores/useRoomStore"
import { useOrderStore } from "@/lib/stores/useOrderStore"
import {
  Home, ShoppingCart, Users, Package, BarChart3, Settings,
  ClipboardList, Warehouse, CreditCard, TrendingUp, Activity
} from "lucide-react"

interface NavCard {
  title: string
  description: string
  href: string
  icon: React.ElementType
  color: string
  badge?: string
}

const navCards: NavCard[] = [
  { title: "包厢管理", description: "实时查看包厢状态、开房结账", href: "/rooms", icon: Home, color: "from-green-500 to-emerald-600", badge: "核心" },
  { title: "点单收银", description: "商品浏览、购物车、快速支付", href: "/pos", icon: CreditCard, color: "from-cyan-500 to-blue-600", badge: "核心" },
  { title: "订单中心", description: "订单查询、状态跟踪、历史记录", href: "/orders", icon: ClipboardList, color: "from-orange-500 to-amber-600" },
  { title: "商品管理", description: "商品CRUD、分类管理、口味配置", href: "/products", icon: Package, color: "from-purple-500 to-violet-600" },
  { title: "会员管理", description: "会员信息、等级体系、充值积分", href: "/members", icon: Users, color: "from-pink-500 to-rose-600" },
  { title: "员工管理", description: "员工档案、权限配置、组别管理", href: "/employees", icon: ShoppingCart, color: "from-blue-500 to-indigo-600" },
  { title: "库存管理", description: "出入库管理、库存预警、仓库配置", href: "/inventory", icon: Warehouse, color: "from-yellow-500 to-orange-600" },
  { title: "报表分析", description: "营业数据、趋势图表、经营洞察", href: "/reports", icon: BarChart3, color: "from-teal-500 to-cyan-600" },
  { title: "系统设置", description: "门店配置、打印机、支付方式", href: "/settings", icon: Settings, color: "from-slate-500 to-gray-600" },
  { title: "主题定制", description: "12种预设、自定义配色、导入导出", href: "/theme", icon: TrendingUp, color: "from-violet-500 to-purple-600", badge: "新功能" },
  { title: "主题市场", description: "社区主题、AI推荐、动态壁纸", href: "/market", icon: Activity, color: "from-fuchsia-500 to-pink-600", badge: "热门" },
]

export default function HomePage() {
  const { rooms, fetchRooms, getRoomStats } = useRoomStore()
  const { orders, fetchOrders, getOrderCount } = useOrderStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetchRooms()
    fetchOrders()
  }, [fetchRooms, fetchOrders])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = getRoomStats()
  
  // 安全获取订单数量（使用辅助方法或可选链）
  const orderCount = getOrderCount ? getOrderCount() : (orders?.length ?? 0)

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            YYC3 智慧商家管理系统
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentTime.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
            {" "}
            {currentTime.toLocaleTimeString("zh-CN")}
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          <Activity className="h-3 w-3 mr-1" />
          系统运行中
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">空闲包厢</p>
                <p className="text-2xl font-bold text-green-500">{stats.available}</p>
              </div>
              <Home className="h-8 w-8 text-green-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">消费中</p>
                <p className="text-2xl font-bold text-orange-500">{stats.occupied}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总包厢数</p>
                <p className="text-2xl font-bold text-cyan-500">{stats.total}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日订单</p>
                <p className="text-2xl font-bold text-purple-500">{orderCount}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-purple-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">功能导航</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className="bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-200 cursor-pointer group h-full backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${card.color} bg-opacity-20`}>
                      <card.icon className="h-5 w-5 text-white" />
                    </div>
                    {card.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {card.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mt-3 group-hover:text-cyan-500 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Ghost Mode Indicator */}
      <div className="fixed bottom-4 left-4 z-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] text-muted-foreground">
          🌙 Ghost Mode · ⌘D 切换
        </div>
      </div>
    </div>
  )
}
