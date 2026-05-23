'use client'

import { useEffect, useState, useMemo } from 'react'
import { useInventoryStore } from '@/lib/stores/useInventoryStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  BarChart3,
  Bell,
  BellRing,
  ShoppingCart,
  Truck,
  CalendarDays,
  Warehouse,
  Activity,
  Target,
  Zap,
  AlertCircle,
  PackageCheck,
  PackageX,
  Timer,
  Layers
} from 'lucide-react'

export default function InventoryDashboardPage() {
  const {
    items,
    alerts,
    movements,
    forecasts,
    loading,
    error,
    alertSettings,
    fetchInventory,
    fetchAlerts,
    checkStockLevels,
    addItem,
    recordMovement,
  } = useInventoryStore()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<import('@/lib/stores/useInventoryStore').InventoryItem | null>(null)

  useEffect(() => {
    fetchInventory()
    fetchAlerts()
  }, [fetchInventory, fetchAlerts])

  useEffect(() => {
    checkStockLevels()
  }, [checkStockLevels])

  const filteredItems = useMemo(() => {
    let result = items ?? []

    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter)
    }

    if (searchQuery) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode?.includes(searchQuery) ||
        item.supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return result
  }, [items, categoryFilter, statusFilter, searchQuery])

  const stats = useMemo(() => {
    const all = items ?? []
    const totalValue = all.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0)
    const retailValue = all.reduce((sum, item) => sum + (item.currentStock * item.sellingPrice), 0)
    
    const statusCounts = {
      in_stock: all.filter(i => i.status === 'in_stock').length,
      low_stock: all.filter(i => i.status === 'low_stock').length,
      out_of_stock: all.filter(i => i.status === 'out_of_stock').length,
      expired: all.filter(i => i.status === 'expired').length,
    }

    const activeAlerts = alerts.filter(a => !a.isAcknowledged).length
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.isAcknowledged).length

    return {
      total: all.length,
      totalValue,
      retailValue,
      profitMargin: totalValue > 0 ? ((retailValue - totalValue) / totalValue * 100).toFixed(1) : 0,
      ...statusCounts,
      activeAlerts,
      criticalAlerts,
    }
  }, [items, alerts])

  const categories = useMemo(() => {
    const cats = new Set(items?.map(item => item.category))
    return Array.from(cats).sort()
  }, [items])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      in_stock: { label: '正常', variant: 'default', icon: <PackageCheck className="h-3 w-3" /> },
      low_stock: { label: '偏低', variant: 'secondary', icon: <AlertTriangle className="h-3 w-3" /> },
      out_of_stock: { label: '缺货', variant: 'destructive', icon: <PackageX className="h-3 w-3" /> },
      expired: { label: '已过期', variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
      discontinued: { label: '停用', variant: 'outline', icon: <Layers className="h-3 w-3" /> },
    }

    const config = variants[status] || variants.in_stock
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default: return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'restock': return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'sale': return <ArrowDownRight className="h-4 w-4 text-red-600" />
      case 'adjustment': return <Activity className="h-4 w-4 text-blue-600" />
      case 'transfer_in': return <Package className="h-4 w-4 text-purple-600" />
      case 'transfer_out': return <Truck className="h-4 w-4 text-orange-600" />
      case 'waste': return <XCircle className="h-4 w-4 text-gray-600" />
      case 'return': return <RefreshCw className="h-4 w-4 text-teal-600" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (loading && items.length === 0) {
    return <InventoryPageSkeleton />
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Warehouse className="h-8 w-8 text-primary" />
            库存智能看板
          </h1>
          <p className="text-muted-foreground mt-2">
            实时监控库存状态、智能预警和需求预测分析
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              fetchInventory()
              checkStockLevels()
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加商品
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>添加新商品</DialogTitle>
                <DialogDescription>录入商品信息以加入库存管理系统</DialogDescription>
              </DialogHeader>
              <AddItemForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SKU总数</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">在库商品种类</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">库存总值</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{(stats.totalValue / 10000).toFixed(1)}万
            </div>
            <p className="text-xs text-muted-foreground">
              零售价 ¥{(stats.retailValue / 10000).toFixed(1)}万 · 利润率 {stats.profitMargin}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃预警</CardTitle>
            <BellRing className={`h-4 w-4 ${stats.criticalAlerts > 0 ? 'text-red-500' : 'text-yellow-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.criticalAlerts > 0 ? 'text-red-600' : 'text-yellow-600'}`}>
              {stats.activeAlerts}
            </div>
            <p className="text-xs text-destructive">
              {stats.criticalAlerts > 0 ? `${stats.criticalAlerts} 个紧急` : `${alerts.filter(a => a.severity === 'warning').length} 个警告`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">缺货商品</CardTitle>
            <PackageX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.out_of_stock}</div>
            <Progress 
              value={(stats.out_of_stock / (stats.total || 1)) * 100} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">低库存</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.low_stock}</div>
            <p className="text-xs text-muted-foreground">需要关注补货</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">
            商品库存 ({filteredItems.length})
          </TabsTrigger>
          <TabsTrigger value="alerts">
            预警中心 ({alerts.filter(a => !a.isAcknowledged).length})
          </TabsTrigger>
          <TabsTrigger value="movements">
            变动记录 ({movements.length})
          </TabsTrigger>
          <TabsTrigger value="forecast">
            需求预测
          </TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索商品名称/SKU/条码..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="in_stock">正常</SelectItem>
                  <SelectItem value="low_stock">偏低</SelectItem>
                  <SelectItem value="out_of_stock">缺货</SelectItem>
                  <SelectItem value="expired">过期</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center border rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                网格
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                列表
              </Button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <InventoryCard
                  key={item.id}
                  item={item}
                  onView={() => setSelectedItem(item)}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>商品信息</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>当前库存</TableHead>
                    <TableHead>成本价</TableHead>
                    <TableHead>售价</TableHead>
                    <TableHead>供应商</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        {item.barcode && (
                          <div className="text-xs text-muted-foreground">{item.barcode}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{item.sku}</code>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            item.currentStock <= 0 ? 'text-red-600' :
                            item.currentStock <= item.reorderPoint ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {item.currentStock.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">{item.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell>¥{item.costPrice.toFixed(2)}</TableCell>
                      <TableCell>¥{item.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell>{item.supplier.name}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedItem(item)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {filteredItems.length === 0 && (
            <EmptyState
              icon={<Package className="h-12 w-12" />}
              title="未找到商品"
              description={
                searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? '尝试调整筛选条件或搜索关键词'
                  : '点击上方按钮添加第一个商品到库存'
              }
              action={!searchQuery && categoryFilter === 'all' && statusFilter === 'all' ? () => setIsAddDialogOpen(true) : undefined}
              actionLabel="添加商品"
            />
          )}
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <div className="space-y-4">
            {/* Alert Summary */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className={`${alerts.filter(a => a.type === 'out_of_stock' && !a.isAcknowledged).length > 0 ? 'border-red-200 bg-red-50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {alerts.filter(a => a.type === 'out_of_stock' && !a.isAcknowledged).length}
                      </div>
                      <div className="text-sm text-muted-foreground">缺货预警</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${alerts.filter(a => a.type === 'low_stock' && !a.isAcknowledged).length > 0 ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {alerts.filter(a => a.type === 'low_stock' && !a.isAcknowledged).length}
                      </div>
                      <div className="text-sm text-muted-foreground">低库存警告</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${alerts.filter(a => a.type.includes('expir') && !a.isAcknowledged).length > 0 ? 'border-orange-200 bg-orange-50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Timer className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {alerts.filter(a => a.type.includes('expir') && !a.isAcknowledged).length}
                      </div>
                      <div className="text-sm text-muted-foreground">临期/过期</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {alerts.filter(a => a.type === 'overstock' && !a.isAcknowledged).length}
                      </div>
                      <div className="text-sm text-muted-foreground">积压预警</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  预警列表
                </CardTitle>
                <CardDescription>所有未处理的库存预警，按严重程度排序</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts
                    .filter(a => !a.isAcknowledged)
                    .sort((a, b) => {
                      const severityOrder = { critical: 0, warning: 1, info: 2 }
                      return severityOrder[a.severity] - severityOrder[b.severity]
                    })
                    .map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border ${
                          alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
                          alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="mt-1">
                          {getAlertIcon(alert.severity)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{alert.message.split(' ')[0]}</span>
                            <Badge
                              variant={
                                alert.severity === 'critical' ? 'destructive' :
                                alert.severity === 'warning' ? 'secondary' : 'outline'
                              }
                              className="text-xs"
                            >
                              {alert.severity === 'critical' ? '紧急' : alert.severity === 'warning' ? '警告' : '提示'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {alert.type === 'low_stock' ? '低库存' :
                               alert.type === 'out_of_stock' ? '缺货' :
                               alert.type === 'expiring_soon' ? '临期' :
                               alert.type === 'expired' ? '过期' :
                               alert.type === 'overstock' ? '积压' : '异常'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>当前值: {alert.currentValue}</span>
                            <span>阈值: {alert.thresholdValue}</span>
                            <span>{new Date(alert.createdAt).toLocaleString('zh-CN')}</span>
                          </div>

                          <div className="mt-2 p-2 bg-white/60 rounded border text-sm">
                            <span className="font-medium">建议操作：</span>
                            <span className="ml-1 text-green-700">{alert.suggestedAction}</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => {
                            // Acknowledge alert logic would go here
                          }}
                        >
                          处理
                        </Button>
                      </div>
                    ))}

                  {alerts.filter(a => !a.isAcknowledged).length === 0 && (
                    <EmptyState
                      icon={<CheckCircle2 className="h-12 w-12" />}
                      title="暂无预警"
                      description="所有库存指标正常，系统运行良好"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Movements Tab */}
        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                库存变动记录
              </CardTitle>
              <CardDescription>查看所有商品的入库、销售、调拨等变动历史</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {movements.slice(0, 30).map((movement) => {
                  const item = items.find(i => i.id === movement.itemId)

                  return (
                    <div
                      key={movement.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getMovementIcon(movement.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">{item?.name || movement.itemId}</span>
                          <Badge variant="outline" className="text-xs">
                            {movement.type === 'restock' ? '入库' :
                             movement.type === 'sale' ? '销售' :
                             movement.type === 'adjustment' ? '调整' :
                             movement.type === 'transfer_in' ? '调入' :
                             movement.type === 'transfer_out' ? '调出' :
                             movement.type === 'waste' ? '报损' : '退货'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">{movement.reason}</p>
                        
                        <div className="text-xs text-muted-foreground mt-1">
                          操作人：{movement.performedBy} · {new Date(movement.createdAt).toLocaleString('zh-CN')}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-semibold text-lg ${
                          ['restock', 'transfer_in', 'return'].includes(movement.type) ? 'text-green-600' :
                          ['sale', 'transfer_out', 'waste'].includes(movement.type) ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {['restock', 'transfer_in', 'return'].includes(movement.type) ? '+' : '-'}
                          {movement.quantity.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {movement.previousStock} → {movement.newStock}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {movements.length === 0 && (
                  <EmptyState
                    icon={<Activity className="h-12 w-12" />}
                    title="暂无变动记录"
                    description="商品的入库、销售等操作记录将显示在这里"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecast Tab */}
        <TabsContent value="forecast">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Forecast Chart Placeholder */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  30天需求预测趋势
                </CardTitle>
                <CardDescription>基于历史数据智能预测未来30天的商品需求量</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                  <div className="text-center space-y-2">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-semibold">需求预测图表</h3>
                    <p className="text-muted-foreground max-w-md">
                      即将支持：集成图表库展示各商品的30天需求预测曲线，
                      标注建议补货点和安全库存线
                    </p>
                    <Button variant="outline" disabled>
                      <Zap className="mr-2 h-4 w-4" />
                      启用AI预测引擎
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Items Need Reorder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  建议补货清单
                </CardTitle>
                <CardDescription>根据预测数据自动生成的补货建议</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items
                    .filter(item => item.currentStock <= item.reorderPoint)
                    .sort((a, b) => (a.currentStock / a.reorderPoint) - (b.currentStock / b.reorderPoint))
                    .slice(0, 8)
                    .map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            当前 {item.currentStock}{item.unit} / 安全点 {item.reorderPoint}{item.unit}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-orange-600">
                            +{item.reorderQuantity}{item.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ¥{(item.reorderQuantity * item.costPrice).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}

                  {items.filter(i => i.currentStock <= i.reorderPoint).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      <p>所有商品库存充足，无需补货</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Expiring Soon Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  临期商品提醒
                </CardTitle>
                <CardDescription>即将过期的商品需要及时处理</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items
                    .filter(item => item.expiryDate)
                    .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime())
                    .slice(0, 6)
                    .map((item) => {
                      const daysUntilExpiry = Math.ceil(
                        (new Date(item.expiryDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                      )

                      return (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              到期日：{new Date(item.expiryDate!).toLocaleDateString('zh-CN')}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className={`font-semibold ${
                              daysUntilExpiry <= 7 ? 'text-red-600' :
                              daysUntilExpiry <= 30 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {daysUntilExpiry > 0 ? `${daysUntilExpiry}天后` : '已过期'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              库存 {item.currentStock}{item.unit}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                  {!items.some(i => i.expiryDate) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Timer className="h-12 w-12 mx-auto mb-2" />
                      <p>暂无临期商品</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 flex items-center gap-2 text-destructive">
          <Target className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>SKU: {selectedItem?.sku}</DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">分类</div>
                  <div className="font-medium">{selectedItem.category}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">条码</div>
                  <div className="font-medium">{selectedItem.barcode || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">单位</div>
                  <div className="font-medium">{selectedItem.unit}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">存放位置</div>
                  <div className="font-medium">{selectedItem.location}</div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">成本价</div>
                  <div className="text-xl font-bold">¥{selectedItem.costPrice.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">售价</div>
                  <div className="text-xl font-bold text-green-600">¥{selectedItem.sellingPrice.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">毛利率</div>
                  <div className="text-xl font-bold text-blue-600">
                    {(((selectedItem.sellingPrice - selectedItem.costPrice) / selectedItem.costPrice) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">当前库存</span>
                  <span className="font-semibold text-lg">{selectedItem.currentStock} {selectedItem.unit}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">最低库存</span>
                  <span>{selectedItem.minimumStock} {selectedItem.unit}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">最高库存</span>
                  <span>{selectedItem.maximumStock} {selectedItem.unit}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">再订货点</span>
                  <span className="text-orange-600 font-medium">{selectedItem.reorderPoint} {selectedItem.unit}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">建议订购量</span>
                  <span className="text-green-600 font-medium">{selectedItem.reorderQuantity} {selectedItem.unit}</span>
                </div>

                <Progress 
                  value={(selectedItem.currentStock / selectedItem.maximumStock) * 100} 
                  className="h-3 mt-2"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium">供应商信息</div>
                <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">供应商名称</span>
                    <span className="font-medium">{selectedItem.supplier.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">联系电话</span>
                    <span>{selectedItem.supplier.contactPhone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">交货周期</span>
                    <span>{selectedItem.supplier.leadTimeDays} 天</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">最小起订量</span>
                    <span>{selectedItem.supplier.minOrderQuantity} {selectedItem.unit}</span>
                  </div>
                </div>
              </div>

              {selectedItem.expiryDate && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm font-medium">有效期信息</div>
                    <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">到期日期</span>
                        <span>{new Date(selectedItem.expiryDate).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">批次号</span>
                        <span>{selectedItem.batchNumber || '-'}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  编辑商品
                </Button>
                <Button className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  记录变动
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InventoryCard({
  item,
  onView,
}: {
  item: import('@/lib/stores/useInventoryStore').InventoryItem
  onView: () => void
}) {
  const stockPercentage = (item.currentStock / item.maximumStock) * 100
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      in_stock: { label: '正常', variant: 'default', icon: <PackageCheck className="h-3 w-3" /> },
      low_stock: { label: '偏低', variant: 'secondary', icon: <AlertTriangle className="h-3 w-3" /> },
      out_of_stock: { label: '缺货', variant: 'destructive', icon: <PackageX className="h-3 w-3" /> },
      expired: { label: '已过期', variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
      discontinued: { label: '停用', variant: 'outline', icon: <Layers className="h-3 w-3" /> },
    }

    const config = variants[status] || variants.in_stock
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {config.label}
      </Badge>
    )
  }
  
  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={onView}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
            <CardDescription className="text-xs">{item.sku}</CardDescription>
          </div>
          {getStatusBadge(item.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className={`text-2xl font-bold ${
              item.currentStock <= 0 ? 'text-red-600' :
              item.currentStock <= item.reorderPoint ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {item.currentStock.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">{item.unit}</span>
          </div>
          
          <Progress 
            value={Math.min(stockPercentage, 100)} 
            className={`h-2 ${
              stockPercentage <= 20 ? '[&>div]:bg-red-500' :
              stockPercentage <= 40 ? '[&>div]:bg-yellow-500' :
              '[&>div]:bg-green-500'
            }`}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>安全点 {item.reorderPoint}</span>
            <span>上限 {item.maximumStock}</span>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground">成本价</div>
            <div className="font-medium">¥{item.costPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">售价</div>
            <div className="font-medium text-green-600">¥{item.sellingPrice.toFixed(2)}</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground line-clamp-1">
          📍 {item.location} · 🏭 {item.supplier.name}
        </div>

        {item.expiryDate && (
          <div className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded inline-block">
            ⏰ {new Date(item.expiryDate).toLocaleDateString('zh-CN')} 到期
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AddItemForm({ onSuccess }: { onSuccess: () => void }) {
  const addItem = useInventoryStore(state => state.addItem)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      await addItem({
        storeId: 'store-001',
        name: formData.get('name') as string,
        nameEn: formData.get('nameEn') as string,
        category: formData.get('category') as string,
        sku: formData.get('sku') as string,
        barcode: formData.get('barcode') as string || undefined,
        unit: formData.get('unit') as string,
        currentStock: parseInt(formData.get('currentStock') as string),
        minimumStock: parseInt(formData.get('minimumStock') as string),
        maximumStock: parseInt(formData.get('maximumStock') as string),
        reorderPoint: parseInt(formData.get('reorderPoint') as string),
        reorderQuantity: parseInt(formData.get('reorderQuantity') as string),
        costPrice: parseFloat(formData.get('costPrice') as string),
        sellingPrice: parseFloat(formData.get('sellingPrice') as string),
        supplier: {
          id: 'supplier-' + Date.now(),
          name: formData.get('supplierName') as string,
          contactPhone: formData.get('supplierPhone') as string,
          leadTimeDays: parseInt(formData.get('leadTimeDays') as string) || 7,
          minOrderQuantity: parseInt(formData.get('minOrderQuantity') as string) || 1,
        },
        location: formData.get('location') as string,
        expiryDate: formData.get('expiryDate') as string || undefined,
        batchNumber: formData.get('batchNumber') as string || undefined,
        status: 'in_stock',
        tags: [],
        lastRestockedAt: new Date().toISOString(),
        lastCountedAt: new Date().toISOString(),
      })
      onSuccess()
    } catch (err) {
      console.error('Failed to add item:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">商品名称 *</label>
          <Input name="name" placeholder="请输入商品名称" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">英文名称</label>
          <Input name="nameEn" placeholder="Product Name" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">SKU *</label>
          <Input name="sku" placeholder="SKU-001" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">条码</label>
          <Input name="barcode" placeholder="69xxxxxxxxxx" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">分类 *</label>
          <Input name="category" placeholder="酒水/食品/日用品" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">单位 *</label>
          <Input name="unit" placeholder="瓶/箱/个" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">存放位置</label>
          <Input name="location" placeholder="A区-01货架" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">当前库存 *</label>
          <Input type="number" name="currentStock" defaultValue="0" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">最低库存</label>
          <Input type="number" name="minimumStock" defaultValue="10" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">最高库存</label>
          <Input type="number" name="maximumStock" defaultValue="500" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">再订货点</label>
          <Input type="number" name="reorderPoint" defaultValue="50" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">建议订购量</label>
          <Input type="number" name="reorderQuantity" defaultValue="100" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">到期日期</label>
          <Input type="date" name="expiryDate" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">成本价 *</label>
          <Input type="number" step="0.01" name="costPrice" placeholder="0.00" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">售价 *</label>
          <Input type="number" step="0.01" name="sellingPrice" placeholder="0.00" required />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <label className="text-sm font-medium">供应商信息</label>
        <div className="grid grid-cols-2 gap-4">
          <Input name="supplierName" placeholder="供应商名称" />
          <Input name="supplierPhone" placeholder="联系电话" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Input type="number" name="leadTimeDays" placeholder="交货天数 (天)" defaultValue="7" />
          <Input type="number" name="minOrderQuantity" placeholder="最小起订量" defaultValue="1" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          取消
        </Button>
        <Button type="submit">
          添加商品
        </Button>
      </div>
    </form>
  )
}

function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: () => void
  actionLabel?: string
}) {
  return (
    <Card className="py-12">
      <CardContent className="flex flex-col items-center justify-center text-center">
        <div className="text-muted-foreground mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-md">{description}</p>
        {action && actionLabel && (
          <Button onClick={action}>
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function InventoryPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[80px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px] mb-2" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-[140px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
                <Skeleton className="h-6 w-[60px]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-2 w-full" />
              <div className="grid grid-cols-2 gap-2">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-3 w-[50px]" />
                    <Skeleton className="h-4 w-[70px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
