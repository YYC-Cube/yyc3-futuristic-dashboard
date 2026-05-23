'use client'

import { useEffect, useState, useMemo } from 'react'
import { useMultiStoreStore } from '@/lib/stores/useMultiStore'
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
import {
  Building2,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Phone,
  Clock,
  MoreHorizontal,
  Settings,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Pause,
  TrendingUp,
  Users,
  DollarSign,
  Activity
} from 'lucide-react'

function getStatusBadge(status: string) {
  const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
    active: { label: '运营中', variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
    inactive: { label: '已停业', variant: 'secondary', icon: <Pause className="h-3 w-3" /> },
    maintenance: { label: '维护中', variant: 'destructive', icon: <AlertCircle className="h-3 w-3" /> },
    pending: { label: '待开业', variant: 'outline', icon: <Clock className="h-3 w-3" /> },
  }

  const config = variants[status] || variants.pending
  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  )
}

export default function MultiStoreManagementPage() {
  const {
    stores,
    activeStoreId,
    loading,
    error,
    fetchStores,
    setActiveStore,
    getActiveStore,
    getStoresByStatus,
    getActiveStores,
    getDefaultStore,
  } = useMultiStoreStore()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  const filteredStores = useMemo(() => {
    let result = stores ?? []

    if (statusFilter !== 'all') {
      result = getStoresByStatus(statusFilter as any)
    }

    if (searchQuery) {
      result = result.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.location.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return result
  }, [stores, statusFilter, searchQuery, getStoresByStatus])

  const stats = useMemo(() => {
    const all = stores ?? []
    const active = all.filter(s => s.status === 'active').length
    const inactive = all.filter(s => s.status === 'inactive').length
    const maintenance = all.filter(s => s.status === 'maintenance').length
    
    return {
      total: all.length,
      active,
      inactive,
      maintenance,
      totalRevenue: all.reduce((sum, s) => sum + (s.stats?.monthRevenue || 0), 0),
      totalMembers: all.reduce((sum, s) => sum + (s.stats?.memberCount || 0), 0),
      avgOccupancy: Math.round(all.reduce((sum, s) => {
        const occupied = s.stats.occupiedRooms || 0
        const total = s.stats.totalRooms || 0
        return sum + (total > 0 ? (occupied / total) * 100 : 0)
      }, 0) / (all.length || 1)),
    }
  }, [stores])

  if (loading && stores.length === 0) {
    return <MultiStorePageSkeleton />
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            多门店管理
          </h1>
          <p className="text-muted-foreground mt-2">
            管理所有门店的运营状态、数据统计和配置设置
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchStores()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新增门店
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>新增门店</DialogTitle>
                <DialogDescription>
                  填写门店基本信息以创建新的经营网点
                </DialogDescription>
              </DialogHeader>
              <AddStoreForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总门店数</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              较上月 +{Math.floor(stats.total * 0.1)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">运营中</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <Progress value={(stats.active / (stats.total || 1)) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">月总收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{(stats.totalRevenue / 10000).toFixed(1)}万</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总会员数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              活跃率 78%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均入住率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgOccupancy}%</div>
            <Progress value={stats.avgOccupancy} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索门店名称、编码或城市..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">运营中</SelectItem>
              <SelectItem value="inactive">已停业</SelectItem>
              <SelectItem value="maintenance">维护中</SelectItem>
              <SelectItem value="pending">待开业</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center border rounded-md p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Store Content */}
      <Tabs defaultValue="stores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stores">
            门店列表 ({filteredStores.length})
          </TabsTrigger>
          <TabsTrigger value="map">
            地图视图
          </TabsTrigger>
          <TabsTrigger value="analytics">
            数据分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  isActive={store.id === activeStoreId}
                  onSelect={() => setActiveStore(store.id)}
                  onEdit={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>门店信息</TableHead>
                    <TableHead>编码</TableHead>
                    <TableHead>城市</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>月营收</TableHead>
                    <TableHead>入住率</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStores.map((store) => (
                    <StoreTableRow
                      key={store.id}
                      store={store}
                      isActive={store.id === activeStoreId}
                      onSelect={() => setActiveStore(store.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {filteredStores.length === 0 && (
            <Card className="py-12">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">未找到门店</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all'
                    ? '尝试调整搜索条件或筛选器'
                    : '点击上方按钮添加您的第一个门店'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加门店
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="map">
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">地图视图</h3>
              <p className="text-muted-foreground">
                即将支持：在地图上查看所有门店位置和实时状态
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">数据分析</h3>
              <p className="text-muted-foreground">
                即将支持：跨门店数据对比、趋势分析和报表导出
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

function StoreCard({
  store,
  isActive,
  onSelect,
  onEdit,
}: {
  store: import('@/lib/stores/useMultiStore').Store
  isActive: boolean
  onSelect: () => void
  onEdit: () => void
}) {
  return (
    <Card className={`relative transition-all hover:shadow-lg ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={store.logo} alt={store.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {store.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{store.name}</CardTitle>
              <CardDescription className="text-xs">{store.code} · {store.nameEn}</CardDescription>
            </div>
          </div>
          {getStatusBadge(store.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{store.location.city}, {store.location.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{store.contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{store.businessHours.open} - {store.businessHours.close}</span>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-primary">
              ¥{(store.stats.monthRevenue / 10000).toFixed(1)}万
            </div>
            <div className="text-xs text-muted-foreground">月营收</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {store.stats.totalRooms > 0 ? Math.round((store.stats.occupiedRooms / store.stats.totalRooms) * 100) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">入住率</div>
          </div>
          <div>
            <div className="text-lg font-bold">
              {store.stats.memberCount}
            </div>
            <div className="text-xs text-muted-foreground">会员</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={onSelect}
          >
            <Eye className="mr-2 h-4 w-4" />
            {isActive ? '当前门店' : '切换至此'}
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function StoreTableRow({
  store,
  isActive,
  onSelect,
}: {
  store: import('@/lib/stores/useMultiStore').Store
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <TableRow className={isActive ? 'bg-primary/5' : ''}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={store.logo} alt={store.name} />
            <AvatarFallback>{store.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{store.name}</div>
            <div className="text-xs text-muted-foreground">{store.location.address}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <code className="text-xs bg-muted px-2 py-1 rounded">{store.code}</code>
      </TableCell>
      <TableCell>{store.location.city}</TableCell>
      <TableCell>{getStatusBadge(store.status)}</TableCell>
      <TableCell className="font-medium">
        ¥{store.stats.monthRevenue.toLocaleString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Progress 
            value={store.stats.totalRooms > 0 ? Math.round((store.stats.occupiedRooms / store.stats.totalRooms) * 100) : 0} 
            className="w-16 h-2" 
          />
          <span className="text-sm">
            {store.stats.totalRooms > 0 ? Math.round((store.stats.occupiedRooms / store.stats.totalRooms) * 100) : 0}%
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={onSelect}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

function AddStoreForm({ onSuccess }: { onSuccess: () => void }) {
  const addStore = useMultiStoreStore(state => state.addStore)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
        await addStore({
          name: formData.get('name') as string,
          nameEn: formData.get('nameEn') as string,
          code: formData.get('code') as string,
          description: formData.get('description') as string,
          location: {
            city: formData.get('city') as string,
            address: formData.get('address') as string,
            province: '',
            postalCode: '',
            latitude: 0,
            longitude: 0,
          },
          contact: {
            phone: formData.get('phone') as string,
            email: '',
            managerName: '',
          },
          businessHours: {
            open: '10:00',
            close: '06:00',
            isOpen24Hours: false,
          },
          config: {
            currency: 'CNY',
            timezone: 'Asia/Shanghai',
            taxRate: 0.06,
            serviceChargeRate: 0.1,
            roomTypes: [],
            features: [],
          },
          status: 'pending',
          tags: [],
          isDefault: false,
          isHeadquarters: false,
        })
      onSuccess()
    } catch (err) {
      console.error('Failed to add store:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">门店名称 *</label>
          <Input name="name" placeholder="例如：YYC3 广州旗舰店" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">英文名称</label>
          <Input name="nameEn" placeholder="YYC3 Guangzhou Flagship" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">门店编码 *</label>
          <Input name="code" placeholder="GZ-001" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">联系电话 *</label>
          <Input name="phone" placeholder="020-8888-8888" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">所在城市 *</label>
        <Input name="city" placeholder="广州市" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">详细地址 *</label>
        <Input name="address" placeholder="天河区珠江新城XX路XX号" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">描述</label>
        <textarea
          name="description"
          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="简要描述该门店的特色和定位..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          取消
        </Button>
        <Button type="submit">
          创建门店
        </Button>
      </div>
    </form>
  )
}

function MultiStorePageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
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
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-3 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
              <Separator />
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, k) => (
                  <div key={k} className="space-y-1">
                    <Skeleton className="h-6 w-[50px] mx-auto" />
                    <Skeleton className="h-3 w-[40px] mx-auto" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-9" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
