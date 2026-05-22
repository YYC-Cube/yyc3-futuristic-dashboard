"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Warehouse,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  BarChart3,
  Users,
  Building,
  Truck,
  ClipboardList,
  Calendar,
  DollarSign,
} from "lucide-react"

interface InventoryItem {
  id: string
  productId: string
  productName: string
  warehouseId: string
  warehouseName: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  costPrice: number
  totalValue: number
  lastUpdated: string
  status: "normal" | "low" | "out" | "excess"
}

interface WarehouseItem {
  id: string
  name: string
  type: "main" | "storage" | "wine_storage"
  location: string
  manager: string
  capacity: number
  currentUtilization: number
}

interface StockTransaction {
  id: string
  type: "in" | "out" | "transfer" | "adjustment"
  productName: string
  quantity: number
  warehouse: string
  operator: string
  reason: string
  date: string
  cost?: number
}

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("inventory")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isStockInOpen, setIsStockInOpen] = useState(false)
  const [isStockOutOpen, setIsStockOutOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  // 库存数据
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      productId: "1",
      productName: "青岛啤酒",
      warehouseId: "main",
      warehouseName: "主仓库",
      currentStock: 150,
      minStock: 50,
      maxStock: 300,
      unit: "瓶",
      costPrice: 8.5,
      totalValue: 1275,
      lastUpdated: "2024-01-15 14:30",
      status: "normal",
    },
    {
      id: "2",
      productId: "2",
      productName: "茅台酒",
      warehouseId: "wine",
      warehouseName: "酒水仓库",
      currentStock: 8,
      minStock: 10,
      maxStock: 50,
      unit: "瓶",
      costPrice: 2200,
      totalValue: 17600,
      lastUpdated: "2024-01-15 10:15",
      status: "low",
    },
    {
      id: "3",
      productId: "3",
      productName: "果盘",
      warehouseId: "main",
      warehouseName: "主仓库",
      currentStock: 0,
      minStock: 5,
      maxStock: 20,
      unit: "份",
      costPrice: 45,
      totalValue: 0,
      lastUpdated: "2024-01-14 16:20",
      status: "out",
    },
  ])

  // 仓库数据
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([
    {
      id: "main",
      name: "主仓库",
      type: "main",
      location: "一楼后厨",
      manager: "张三",
      capacity: 1000,
      currentUtilization: 65,
    },
    {
      id: "wine",
      name: "酒水仓库",
      type: "wine_storage",
      location: "地下室",
      manager: "李四",
      capacity: 500,
      currentUtilization: 45,
    },
    {
      id: "storage",
      name: "备用仓库",
      type: "storage",
      location: "二楼储物间",
      manager: "王五",
      capacity: 300,
      currentUtilization: 20,
    },
  ])

  // 出入库记录
  const [transactions, setTransactions] = useState<StockTransaction[]>([
    {
      id: "1",
      type: "in",
      productName: "青岛啤酒",
      quantity: 100,
      warehouse: "主仓库",
      operator: "张三",
      reason: "采购入库",
      date: "2024-01-15 09:30",
      cost: 850,
    },
    {
      id: "2",
      type: "out",
      productName: "茅台酒",
      quantity: 2,
      warehouse: "酒水仓库",
      operator: "李四",
      reason: "销售出库",
      date: "2024-01-15 14:20",
    },
    {
      id: "3",
      type: "transfer",
      productName: "果盘",
      quantity: 10,
      warehouse: "主仓库 → 备用仓库",
      operator: "王五",
      reason: "库存调拨",
      date: "2024-01-14 11:15",
    },
  ])

  // 过滤库存数据
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWarehouse = selectedWarehouse === "all" || item.warehouseId === selectedWarehouse
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    return matchesSearch && matchesWarehouse && matchesStatus
  })

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "low":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "out":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "excess":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case "normal":
        return "正常"
      case "low":
        return "库存不足"
      case "out":
        return "缺货"
      case "excess":
        return "库存过多"
      default:
        return "未知"
    }
  }

  // 获取交易类型图标和颜色
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "in":
        return { icon: TrendingUp, color: "text-green-400" }
      case "out":
        return { icon: TrendingDown, color: "text-red-400" }
      case "transfer":
        return { icon: Truck, color: "text-blue-400" }
      case "adjustment":
        return { icon: Edit, color: "text-yellow-400" }
      default:
        return { icon: FileText, color: "text-gray-400" }
    }
  }

  // 统计数据
  const stats = {
    totalProducts: inventory.length,
    normalStock: inventory.filter((item) => item.status === "normal").length,
    lowStock: inventory.filter((item) => item.status === "low").length,
    outOfStock: inventory.filter((item) => item.status === "out").length,
    totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
    totalWarehouses: warehouses.length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              库存管理系统
            </h1>
            <div className="flex items-center space-x-4">
              <Dialog open={isStockInOpen} onOpenChange={setIsStockInOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    入库
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-slate-100">商品入库</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">商品名称</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                          <SelectValue placeholder="选择商品" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="beer" className="text-slate-100">
                            青岛啤酒
                          </SelectItem>
                          <SelectItem value="wine" className="text-slate-100">
                            茅台酒
                          </SelectItem>
                          <SelectItem value="fruit" className="text-slate-100">
                            果盘
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">入库数量</Label>
                        <Input
                          type="number"
                          placeholder="请输入数量"
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">单价</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="请输入单价"
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-300">目标仓库</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                          <SelectValue placeholder="选择仓库" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {warehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id} className="text-slate-100">
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">备注</Label>
                      <Textarea
                        placeholder="请输入备注信息"
                        className="bg-slate-800/50 border-slate-600 text-slate-100"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsStockInOpen(false)}
                        className="border-slate-600 text-slate-300"
                      >
                        取消
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">确认入库</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isStockOutOpen} onOpenChange={setIsStockOutOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    出库
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-slate-100">商品出库</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">商品名称</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                          <SelectValue placeholder="选择商品" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="beer" className="text-slate-100">
                            青岛啤酒
                          </SelectItem>
                          <SelectItem value="wine" className="text-slate-100">
                            茅台酒
                          </SelectItem>
                          <SelectItem value="fruit" className="text-slate-100">
                            果盘
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">出库数量</Label>
                        <Input
                          type="number"
                          placeholder="请输入数量"
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">当前库存</Label>
                        <Input value="150 瓶" disabled className="bg-slate-800/50 border-slate-600 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-300">出库仓库</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                          <SelectValue placeholder="选择仓库" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {warehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id} className="text-slate-100">
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-3 সৌম0">出库原因</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                          <SelectValue placeholder="选择出库原因" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="sale" className="text-slate-100">
                            销售出库
                          </SelectItem>
                          <SelectItem value="damage" className="text-slate-100">
                            损坏报废
                          </SelectItem>
                          <SelectItem value="transfer" className="text-slate-100">
                            调拨出库
                          </SelectItem>
                          <SelectItem value="return" className="text-slate-100">
                            退货出库
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">备注</Label>
                      <Textarea
                        placeholder="请输入备注信息"
                        className="bg-slate-800/50 border-slate-600 text-slate-100"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsStockOutOpen(false)}
                        className="border-slate-600 text-slate-300"
                      >
                        取消
                      </Button>
                      <Button className="bg-red-600 hover:bg-red-700">确认出库</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Truck className="h-4 w-4 mr-2" />
                    调拨
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-slate-100">库存调拨</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">商品名称</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                          <SelectValue placeholder="选择商品" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="beer" className="text-slate-100">
                            青岛啤酒
                          </SelectItem>
                          <SelectItem value="wine" className="text-slate-100">
                            茅台酒
                          </SelectItem>
                          <SelectItem value="fruit" className="text-slate-100">
                            果盘
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">源仓库</Label>
                        <Select>
                          <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                            <SelectValue placeholder="选择源仓库" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            {warehouses.map((warehouse) => (
                              <SelectItem key={warehouse.id} value={warehouse.id} className="text-slate-100">
                                {warehouse.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300">目标仓库</Label>
                        <Select>
                          <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                            <SelectValue placeholder="选择目标仓库" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            {warehouses.map((warehouse) => (
                              <SelectItem key={warehouse.id} value={warehouse.id} className="text-slate-100">
                                {warehouse.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-300">调拨数量</Label>
                      <Input
                        type="number"
                        placeholder="请输入调拨数量"
                        className="bg-slate-800/50 border-slate-600 text-slate-100"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">调拨原因</Label>
                      <Textarea
                        placeholder="请输入调拨原因"
                        className="bg-slate-800/50 border-slate-600 text-slate-100"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsTransferOpen(false)}
                        className="border-slate-600 text-slate-300"
                      >
                        取消
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">确认调拨</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{stats.totalProducts}</div>
                    <div className="text-sm text-slate-400">商品种类</div>
                  </div>
                  <Package className="h-8 w-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{stats.normalStock}</div>
                    <div className="text-sm text-slate-400">库存正常</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.lowStock}</div>
                    <div className="text-sm text-slate-400">库存不足</div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-400">{stats.outOfStock}</div>
                    <div className="text-sm text-slate-400">缺货商品</div>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">¥{stats.totalValue.toFixed(0)}</div>
                    <div className="text-sm text-slate-400">库存价值</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{stats.totalWarehouses}</div>
                    <div className="text-sm text-slate-400">仓库数量</div>
                  </div>
                  <Warehouse className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 主要内容区域 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/50 p-1 mb-6">
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <Package className="h-4 w-4 mr-2" />
              库存列表
            </TabsTrigger>
            <TabsTrigger
              value="warehouses"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <Warehouse className="h-4 w-4 mr-2" />
              仓库管理
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <FileText className="h-4 w-4 mr-2" />
              出入库记录
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <BarChart3 className="h-4 w-4 mr-2" />
              库存报表
            </TabsTrigger>
          </TabsList>

          {/* 库存列表标签页 */}
          <TabsContent value="inventory" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Package className="mr-2 h-5 w-5 text-cyan-500" />
                    库存管理
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" className="border-slate-600 text-slate-300">
                      <Download className="h-4 w-4 mr-2" />
                      导出库存
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      库存盘点
                    </Button>
                  </div>
                </div>

                {/* 搜索和筛选 */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="搜索商品名称..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                    <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-slate-100">
                      <Warehouse className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all" className="text-slate-100">
                        全部仓库
                      </SelectItem>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id} className="text-slate-100">
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-slate-100">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all" className="text-slate-100">
                        全部状态
                      </SelectItem>
                      <SelectItem value="normal" className="text-slate-100">
                        库存正常
                      </SelectItem>
                      <SelectItem value="low" className="text-slate-100">
                        库存不足
                      </SelectItem>
                      <SelectItem value="out" className="text-slate-100">
                        缺货
                      </SelectItem>
                      <SelectItem value="excess" className="text-slate-100">
                        库存过多
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent>
                {/* 库存列表 */}
                <div className="space-y-4">
                  {filteredInventory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-slate-200 font-medium">{item.productName}</h3>
                            <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-slate-400 text-sm">仓库: {item.warehouseName}</span>
                            <span className="text-slate-400 text-sm">单价: ¥{item.costPrice}</span>
                            <span className="text-slate-400 text-sm">更新: {item.lastUpdated}</span>
                          </div>
                          <div className="flex items-center space-x-6 mt-2">
                            <div className="text-center">
                              <div className="text-lg font-bold text-cyan-400">{item.currentStock}</div>
                              <div className="text-xs text-slate-400">当前库存</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-yellow-400">{item.minStock}</div>
                              <div className="text-xs text-slate-400">最低库存</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-blue-400">{item.maxStock}</div>
                              <div className="text-xs text-slate-400">最高库存</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-purple-400">¥{item.totalValue}</div>
                              <div className="text-xs text-slate-400">库存价值</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          入库
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <TrendingDown className="h-3 w-3 mr-1" />
                          出库
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          调整
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredInventory.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <div className="text-slate-400">暂无库存数据</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 仓库管理标签页 */}
          <TabsContent value="warehouses" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Warehouse className="mr-2 h-5 w-5 text-cyan-500" />
                    仓库管理
                  </CardTitle>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Plus className="h-4 w-4 mr-2" />
                    新增仓库
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {warehouses.map((warehouse) => (
                    <Card key={warehouse.id} className="bg-slate-800/30 border-slate-700/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-slate-200 text-lg">{warehouse.name}</CardTitle>
                          <Badge
                            className={
                              warehouse.type === "main"
                                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                                : warehouse.type === "wine_storage"
                                  ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            }
                          >
                            {warehouse.type === "main"
                              ? "主仓库"
                              : warehouse.type === "wine_storage"
                                ? "酒水仓库"
                                : "备用仓库"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-300 text-sm">{warehouse.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-300 text-sm">负责人: {warehouse.manager}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-sm">容量利用率</span>
                              <span className="text-cyan-400 text-sm">{warehouse.currentUtilization}%</span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${warehouse.currentUtilization}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-slate-400 text-sm">
                              {Math.floor((warehouse.capacity * warehouse.currentUtilization) / 100)} /{" "}
                              {warehouse.capacity}
                            </span>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 出入库记录标签页 */}
          <TabsContent value="transactions" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-cyan-500" />
                    出入库记录
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <Select>
                      <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-slate-100">
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="选择时间范围" />
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
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="border-slate-600 text-slate-300">
                      <Download className="h-4 w-4 mr-2" />
                      导出记录
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => {
                    const { icon: Icon, color } = getTransactionIcon(transaction.type)
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              transaction.type === "in"
                                ? "bg-green-500/20"
                                : transaction.type === "out"
                                  ? "bg-red-500/20"
                                  : transaction.type === "transfer"
                                    ? "bg-blue-500/20"
                                    : "bg-yellow-500/20"
                            }`}
                          >
                            <Icon className={`h-6 w-6 ${color}`} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-slate-200 font-medium">{transaction.productName}</h3>
                              <Badge
                                className={
                                  transaction.type === "in"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : transaction.type === "out"
                                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                                      : transaction.type === "transfer"
                                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                }
                              >
                                {transaction.type === "in"
                                  ? "入库"
                                  : transaction.type === "out"
                                    ? "出库"
                                    : transaction.type === "transfer"
                                      ? "调拨"
                                      : "调整"}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-slate-400 text-sm">数量: {transaction.quantity}</span>
                              <span className="text-slate-400 text-sm">仓库: {transaction.warehouse}</span>
                              <span className="text-slate-400 text-sm">操作员: {transaction.operator}</span>
                              {transaction.cost && (
                                <span className="text-slate-400 text-sm">金额: ¥{transaction.cost}</span>
                              )}
                            </div>
                            <div className="text-slate-400 text-sm mt-1">
                              原因: {transaction.reason} | 时间: {transaction.date}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 库存报表标签页 */}
          <TabsContent value="reports" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-cyan-500" />
                    库存状态分布
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200">库存正常</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-700/50 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "70%" }} />
                        </div>
                        <span className="text-green-400 text-sm">{stats.normalStock}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200">库存不足</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-700/50 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "20%" }} />
                        </div>
                        <span className="text-yellow-400 text-sm">{stats.lowStock}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200">缺货商品</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-700/50 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "10%" }} />
                        </div>
                        <span className="text-red-400 text-sm">{stats.outOfStock}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-cyan-500" />
                    库存价值分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400">¥{stats.totalValue.toFixed(0)}</div>
                      <div className="text-slate-400">总库存价值</div>
                    </div>
                    <div className="space-y-3">
                      {warehouses.map((warehouse) => {
                        const warehouseValue = inventory
                          .filter((item) => item.warehouseId === warehouse.id)
                          .reduce((sum, item) => sum + item.totalValue, 0)
                        const percentage = stats.totalValue > 0 ? (warehouseValue / stats.totalValue) * 100 : 0
                        return (
                          <div key={warehouse.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-200 text-sm">{warehouse.name}</span>
                              <span className="text-cyan-400 text-sm">¥{warehouseValue.toFixed(0)}</span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
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
