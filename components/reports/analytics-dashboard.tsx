"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  Calendar,
  Download,
  PieChart,
  Activity,
  Target,
  Clock,
  Star,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
} from "recharts"

interface SalesData {
  date: string
  revenue: number
  orders: number
  customers: number
  averageOrder: number
}

interface ProductSales {
  name: string
  sales: number
  revenue: number
  profit: number
  category: string
}

interface RoomUtilization {
  roomNumber: string
  roomType: string
  utilizationRate: number
  revenue: number
  sessions: number
  averageDuration: number
}

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("today")
  const [isLoading, setIsLoading] = useState(false)

  // 模拟销售数据
  const [salesData, setSalesData] = useState<SalesData[]>([
    { date: "2024-01-01", revenue: 15680, orders: 45, customers: 38, averageOrder: 348.4 },
    { date: "2024-01-02", revenue: 18920, orders: 52, customers: 44, averageOrder: 363.8 },
    { date: "2024-01-03", revenue: 22150, orders: 58, customers: 51, averageOrder: 381.9 },
    { date: "2024-01-04", revenue: 19800, orders: 48, customers: 42, averageOrder: 412.5 },
    { date: "2024-01-05", revenue: 25600, orders: 65, customers: 58, averageOrder: 393.8 },
    { date: "2024-01-06", revenue: 28900, orders: 72, customers: 64, averageOrder: 401.4 },
    { date: "2024-01-07", revenue: 31200, orders: 78, customers: 69, averageOrder: 400.0 },
  ])

  // 商品销售数据
  const [productSales, setProductSales] = useState<ProductSales[]>([
    { name: "青岛啤酒", sales: 156, revenue: 2340, profit: 1170, category: "酒水" },
    { name: "茅台酒", sales: 8, revenue: 20000, profit: 2400, category: "酒水" },
    { name: "果盘", sales: 45, revenue: 3060, profit: 1530, category: "小食" },
    { name: "KTV套餐A", sales: 23, revenue: 6900, profit: 2070, category: "套餐" },
    { name: "红酒", sales: 12, revenue: 3600, profit: 1080, category: "酒水" },
  ])

  // 包厢利用率数据
  const [roomData, setRoomData] = useState<RoomUtilization[]>([
    { roomNumber: "101", roomType: "小包", utilizationRate: 85.5, revenue: 2580, sessions: 12, averageDuration: 3.2 },
    { roomNumber: "201", roomType: "中包", utilizationRate: 92.3, revenue: 4200, sessions: 15, averageDuration: 3.8 },
    { roomNumber: "301", roomType: "大包", utilizationRate: 78.9, revenue: 5680, sessions: 8, averageDuration: 4.5 },
    { roomNumber: "VIP1", roomType: "VIP包", utilizationRate: 95.2, revenue: 8900, sessions: 6, averageDuration: 5.2 },
  ])

  // 分类销售数据
  const categoryData = [
    { name: "酒水", value: 45680, color: "#0088FE" },
    { name: "小食", value: 18920, color: "#00C49F" },
    { name: "套餐", value: 25600, color: "#FFBB28" },
    { name: "其他", value: 8900, color: "#FF8042" },
  ]

  // 时段分析数据
  const hourlyData = [
    { hour: "10:00", revenue: 1200, orders: 3 },
    { hour: "12:00", revenue: 2800, orders: 8 },
    { hour: "14:00", revenue: 3200, orders: 9 },
    { hour: "16:00", revenue: 2600, orders: 7 },
    { hour: "18:00", revenue: 4500, orders: 12 },
    { hour: "20:00", revenue: 6800, orders: 18 },
    { hour: "22:00", revenue: 5200, orders: 14 },
    { hour: "24:00", revenue: 3100, orders: 8 },
  ]

  // 统计数据
  const stats = {
    todayRevenue: 31200,
    todayOrders: 78,
    todayCustomers: 69,
    averageOrderValue: 400.0,
    monthlyRevenue: 156800,
    monthlyGrowth: 12.5,
    topProduct: "茅台酒",
    bestRoom: "VIP1",
    peakHour: "20:00-22:00",
    customerSatisfaction: 4.8,
  }

  const refreshData = async () => {
    setIsLoading(true)
    // 模拟数据刷新
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              数据分析中心
            </h1>
            <div className="flex items-center space-x-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-slate-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="today" className="text-slate-100">
                    今天
                  </SelectItem>
                  <SelectItem value="week" className="text-slate-100">
                    本周
                  </SelectItem>
                  <SelectItem value="month" className="text-slate-100">
                    本月
                  </SelectItem>
                  <SelectItem value="quarter" className="text-slate-100">
                    本季度
                  </SelectItem>
                  <SelectItem value="year" className="text-slate-100">
                    本年
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={isLoading}
                className="border-slate-600 text-slate-300"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                刷新数据
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Download className="h-4 w-4 mr-2" />
                导出报表
              </Button>
            </div>
          </div>

          {/* 核心指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">¥{stats.todayRevenue.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">今日营业额</div>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+{stats.monthlyGrowth}%</span>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{stats.todayOrders}</div>
                    <div className="text-sm text-slate-400">今日订单</div>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+8.2%</span>
                    </div>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{stats.todayCustomers}</div>
                    <div className="text-sm text-slate-400">今日客流</div>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+5.8%</span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">¥{stats.averageOrderValue}</div>
                    <div className="text-sm text-slate-400">客单价</div>
                    <div className="flex items-center mt-2">
                      <ArrowDownRight className="h-4 w-4 text-red-400 mr-1" />
                      <span className="text-red-400 text-sm">-2.1%</span>
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 主要内容区域 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/50 p-1 mb-6">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              总览
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <TrendingUp className="h-4 w-4 mr-2" />
              销售分析
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              商品分析
            </TabsTrigger>
            <TabsTrigger value="rooms" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <Activity className="h-4 w-4 mr-2" />
              包厢分析
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <Users className="h-4 w-4 mr-2" />
              客户分析
            </TabsTrigger>
          </TabsList>

          {/* 总览标签页 */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* 营业额趋势 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-cyan-500" />
                    营业额趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#06B6D4" fill="url(#colorRevenue)" />
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* 分类销售占比 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <PieChart className="mr-2 h-5 w-5 text-cyan-500" />
                    分类销售占比
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* 时段分析 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-cyan-500" />
                  时段营业分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F3F4F6",
                      }}
                    />
                    <Bar dataKey="revenue" fill="#06B6D4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 销售分析标签页 */}
          <TabsContent value="sales" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-lg">月度营业额</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">¥{stats.monthlyRevenue.toLocaleString()}</div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">较上月增长 {stats.monthlyGrowth}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-lg">热销商品</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.topProduct}</div>
                  <div className="text-slate-400 text-sm">销售额占比 32.8%</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-lg">客户满意度</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2">
                    <div className="text-2xl font-bold text-orange-400 mr-2">{stats.customerSatisfaction}</div>
                    <Star className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="text-slate-400 text-sm">基于 156 条评价</div>
                </CardContent>
              </Card>
            </div>

            {/* 销售趋势详细图表 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-cyan-500" />
                  销售趋势详细分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F3F4F6",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#06B6D4" name="营业额" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#10B981" name="订单数" strokeWidth={2} />
                    <Line type="monotone" dataKey="customers" stroke="#F59E0B" name="客户数" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 商品分析标签页 */}
          <TabsContent value="products" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-cyan-500" />
                  商品销售排行
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productSales.map((product, index) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0
                              ? "bg-yellow-500/20 text-yellow-400"
                              : index === 1
                                ? "bg-gray-500/20 text-gray-400"
                                : index === 2
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-slate-700/50 text-slate-400"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-slate-200 font-medium">{product.name}</div>
                          <div className="text-slate-400 text-sm">{product.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-medium">销量: {product.sales}</div>
                        <div className="text-green-400 text-sm">营收: ¥{product.revenue}</div>
                        <div className="text-purple-400 text-sm">利润: ¥{product.profit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 包厢分析标签页 */}
          <TabsContent value="rooms" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                  包厢利用率分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roomData.map((room) => (
                    <div key={room.roomNumber} className="p-4 bg-slate-800/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-slate-200 font-medium">{room.roomNumber}</div>
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{room.roomType}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-medium">{room.utilizationRate}%</div>
                          <div className="text-slate-400 text-sm">利用率</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-green-400 font-medium">¥{room.revenue}</div>
                          <div className="text-slate-400">营收</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-400 font-medium">{room.sessions}</div>
                          <div className="text-slate-400">场次</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-medium">{room.averageDuration}h</div>
                          <div className="text-slate-400">平均时长</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${room.utilizationRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 客户分析标签页 */}
          <TabsContent value="customers" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-cyan-500" />
                    客户构成分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200">新客户</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-700/50 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "35%" }} />
                        </div>
                        <span className="text-green-400 text-sm">35%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200">老客户</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-700/50 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }} />
                        </div>
                        <span className="text-blue-400 text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200">VIP客户</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-700/50 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "15%" }} />
                        </div>
                        <span className="text-purple-400 text-sm">15%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Star className="mr-2 h-5 w-5 text-cyan-500" />
                    客户价值分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">¥{stats.averageOrderValue}</div>
                      <div className="text-slate-400">平均客单价</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-green-400 font-medium">2.3次</div>
                        <div className="text-slate-400">平均复购</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-medium">¥1,280</div>
                        <div className="text-slate-400">客户终身价值</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
