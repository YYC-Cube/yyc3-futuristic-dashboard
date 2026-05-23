'use client'

import { useEffect, useState, useMemo } from 'react'
import { useMembershipStore } from '@/lib/stores/useMembershipStore'
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
  Users,
  Crown,
  Star,
  Gem,
  Trophy,
  Search,
  Plus,
  Gift,
  TrendingUp,
  Clock,
  Award,
  Target,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  CalendarDays,
  Phone,
  MapPin
} from 'lucide-react'

export default function MembershipCenterPage() {
  const {
    members,
    transactions,
    redemptionItems,
    tiers,
    loading,
    error,
    selectedMember,
    fetchMembers,
    setSelectedMember,
    getMembersSafe,
    getActiveMemberCount,
    getTopMembers,
    calculateTierProgress,
    getMembersByTier,
    getTransactionsByMember,
  } = useMembershipStore()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedRedemption, setSelectedRedemption] = useState<import('@/lib/stores/useMembershipStore').RedemptionItem | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const filteredMembers = useMemo(() => {
    let result = getMembersSafe()

    if (tierFilter !== 'all') {
      result = getMembersByTier(tierFilter)
    }

    if (searchQuery) {
      result = result.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.includes(searchQuery)
      )
    }

    return result
  }, [members, tierFilter, searchQuery, getMembersSafe, getMembersByTier])

  const stats = useMemo(() => {
    const all = members ?? []
    const activeCount = all.filter(m => m.status === 'active').length
    const totalPoints = all.reduce((sum, m) => sum + m.points, 0)
    const totalSpent = all.reduce((sum, m) => sum + m.totalSpent, 0)
    const avgVisit = Math.round(all.reduce((sum, m) => sum + m.visitCount, 0) / (all.length || 1))

    return {
      total: all.length,
      active: activeCount,
      totalPoints,
      totalSpent,
      avgVisit,
      topMember: all.sort((a, b) => b.points - a.points)[0],
    }
  }, [members])

  const getTierIcon = (iconName: string) => {
    switch (iconName) {
      case 'crown': return <Crown className="h-5 w-5" />
      case 'star': return <Star className="h-5 w-5" />
      case 'gem': return <Gem className="h-5 w-5" />
      case 'trophy': return <Trophy className="h-5 w-5" />
      default: return <Award className="h-5 w-5" />
    }
  }

  if (loading && members.length === 0) {
    return <MembershipPageSkeleton />
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            会员中心
          </h1>
          <p className="text-muted-foreground mt-2">
            管理会员体系、积分规则、兑换商城和等级权益
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => fetchMembers()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加会员
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>添加新会员</DialogTitle>
                <DialogDescription>录入会员基本信息以开启会员服务</DialogDescription>
              </DialogHeader>
              <AddMemberForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总会员数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">活跃 {stats.active}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总积分池</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {(stats.totalPoints / 10000).toFixed(1)}万
            </div>
            <p className="text-xs text-muted-foreground">人均 {(stats.totalPoints / (stats.total || 1)).toFixed(0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">累计消费</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{(stats.totalSpent / 10000).toFixed(1)}万
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +18.2%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均到店</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.avgVisit}次</div>
            <p className="text-xs text-muted-foreground">人均访问频次</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">可兑换商品</CardTitle>
            <Gift className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{redemptionItems.filter(r => r.isActive).length}</div>
            <p className="text-xs text-muted-foreground">积分商城商品</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">积分王</CardTitle>
            <Crown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{stats.topMember?.name || '-'}</div>
            <p className="text-xs text-muted-foreground">
              {stats.topMember ? `${stats.topMember.points.toLocaleString()}分` : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tier System Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            五级会员等级体系
          </CardTitle>
          <CardDescription>清晰展示各等级的权益和升级条件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tiers.map((tier, index) => (
              <div key={tier.id} className="relative">
                <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: tier.color }}
                  >
                    {getTierIcon(tier.icon)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{tier.name}</h3>
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        Lv.{tiers.length - index}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{tier.nameEn}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>{tier.minPoints.toLocaleString()} 分起</span>
                      <span>·</span>
                      <span>折扣率 {Math.round(tier.discountRate * 100)}%</span>
                      <span>·</span>
                      <span>{getMembersByTier(tier.id).length} 人</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {tier.benefits.slice(0, 4).map((benefit, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                      {tier.benefits.length > 4 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-xs cursor-pointer">
                                +{tier.benefits.length - 4}项
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="max-w-xs">
                                {tier.benefits.slice(4).map((b, i) => (
                                  <div key={i}>• {b}</div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < tiers.length - 1 && (
                  <div className="absolute left-[3.75rem] top-full h-4 w-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">
            会员列表 ({filteredMembers.length})
          </TabsTrigger>
          <TabsTrigger value="transactions">
            积分流水 ({transactions.length})
          </TabsTrigger>
          <TabsTrigger value="redemption">
            兑换商城 ({redemptionItems.filter(r => r.isActive).length})
          </TabsTrigger>
          <TabsTrigger value="ranking">
            排行榜 (TOP10)
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索姓名或手机号..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="等级筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部等级</SelectItem>
                  {tiers.map(tier => (
                    <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
                  ))}
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

          {/* Member Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMembers.map((member) => {
                const progress = calculateTierProgress(member)
                const currentTier = tiers.find(t => t.id === member.tierId)

                return (
                  <Card key={member.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback style={{ backgroundColor: currentTier?.color }}>
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{member.name}</CardTitle>
                            <CardDescription className="text-xs">{member.phone}</CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          style={{ borderColor: currentTier?.color, color: currentTier?.color }}
                        >
                          {currentTier?.name}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">当前积分</span>
                          <span className="font-semibold text-primary">{member.points.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">累计消费</span>
                          <span>¥{member.totalSpent.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">到店次数</span>
                          <span>{member.visitCount}次</span>
                        </div>
                      </div>

                      {progress.next && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>距离 {progress.next.name}</span>
                              <span>{progress.progress}%</span>
                            </div>
                            <Progress value={progress.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground text-center">
                              还需 {(progress.next.minPoints - member.points).toLocaleString()} 分升级
                            </div>
                          </div>
                        </>
                      )}

                      <Separator />

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedMember(member)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          详情
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>会员信息</TableHead>
                    <TableHead>等级</TableHead>
                    <TableHead>积分</TableHead>
                    <TableHead>消费额</TableHead>
                    <TableHead>到店次数</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => {
                    const currentTier = tiers.find(t => t.id === member.tierId)

                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" style={{ color: currentTier?.color }}>
                            {currentTier?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {member.points.toLocaleString()}
                        </TableCell>
                        <TableCell>¥{member.totalSpent.toLocaleString()}</TableCell>
                        <TableCell>{member.visitCount}次</TableCell>
                        <TableCell>
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                            {member.status === 'active' ? '正常' : member.status === 'inactive' ? '停用' : '黑名单'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedMember(member)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          )}

          {filteredMembers.length === 0 && (
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title="未找到会员"
              description={searchQuery || tierFilter !== 'all' ? '尝试调整筛选条件' : '点击上方按钮添加第一个会员'}
              action={!searchQuery && tierFilter === 'all' ? () => setIsAddDialogOpen(true) : undefined}
              actionLabel="添加会员"
            />
          )}
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                积分变动记录
              </CardTitle>
              <CardDescription>查看所有会员的积分获取、消耗和过期记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 20).map((tx) => {
                  const member = members.find(m => m.id === tx.memberId)
                  const typeConfig = {
                    earn: { label: '获得', icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
                    redeem: { label: '消耗', icon: ArrowDownRight, color: 'text-red-600', bg: 'bg-red-50' },
                    expire: { label: '过期', icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50' },
                    adjust: { label: '调整', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
                  }

                  const config = typeConfig[tx.type]
                  const Icon = config.icon

                  return (
                    <div key={tx.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">{member?.name || '未知会员'}</span>
                          <Badge variant="outline" className="text-xs">{config.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{tx.description}</p>
                      </div>

                      <div className="text-right">
                        <div className={`font-semibold ${config.color}`}>
                          {tx.type === 'earn' ? '+' : '-'}{tx.points.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          余额 {tx.balanceAfter.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {transactions.length === 0 && (
                  <EmptyState
                    icon={<Clock className="h-12 w-12" />}
                    title="暂无积分记录"
                    description="会员的积分变动将显示在这里"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redemption Tab */}
        <TabsContent value="redemption">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {redemptionItems.filter(item => item.isActive).map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gift className="h-16 w-16 text-purple-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 backdrop-blur-sm">
                      {item.category === 'room_discount' ? '房费优惠' :
                       item.category === 'product' ? '实物商品' :
                       item.category === 'service' ? '增值服务' :
                       item.category === 'gift' ? '礼品' : '优惠券'}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">{item.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg text-yellow-600">{item.pointsCost.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">积分</span>
                    </div>
                    {item.stock !== undefined && item.stock > 0 && (
                      <Badge variant="outline" className="text-xs">
                        库存 {item.stock}
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-green-600 font-medium">
                    价值 ¥{item.value.toLocaleString()}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setSelectedRedemption(item)}
                    disabled={item.stock !== undefined && item.stock <= 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {item.stock !== undefined && item.stock <= 0 ? '已售罄' : '立即兑换'}
                  </Button>
                </CardContent>
              </Card>
            ))}

            {redemptionItems.filter(item => item.isActive).length === 0 && (
              <Card className="col-span-full py-12">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <Gift className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">暂无兑换商品</h3>
                  <p className="text-muted-foreground">管理员正在准备丰富的兑换商品，敬请期待</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Ranking Tab */}
        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                积分排行榜 TOP10
              </CardTitle>
              <CardDescription>展示积分最高的前10位会员</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTopMembers(10).map((member, index) => {
                  const tier = tiers.find(t => t.id === member.tierId)
                  const medals = ['🥇', '🥈', '🥉']

                  return (
                    <div
                      key={member.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : ''
                      }`}
                    >
                      <div className="text-2xl font-bold w-8 text-center">
                        {medals[index] || `#${index + 1}`}
                      </div>

                      <Avatar className="h-11 w-11">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback style={{ backgroundColor: tier?.color }}>
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{member.name}</span>
                          <Badge variant="outline" style={{ color: tier?.color, fontSize: '0.7rem' }}>
                            {tier?.name}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          消费 ¥{member.totalSpent.toLocaleString()} · 到店 {member.visitCount}次
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-yellow-600">
                          {member.points.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">积分</div>
                      </div>
                    </div>
                  )
                })}

                {members.length === 0 && (
                  <EmptyState
                    icon={<Trophy className="h-12 w-12" />}
                    title="暂无排行数据"
                    description="会员数据将在这里展示排名"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 flex items-center gap-2 text-destructive">
          <Target className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Redemption Detail Dialog */}
      <Dialog open={!!selectedRedemption} onOpenChange={() => setSelectedRedemption(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedRedemption?.name}</DialogTitle>
            <DialogDescription>{selectedRedemption?.description}</DialogDescription>
          </DialogHeader>
          
          {selectedRedemption && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">所需积分</div>
                  <div className="text-xl font-bold text-yellow-600">
                    {selectedRedemption.pointsCost.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">商品价值</div>
                  <div className="text-xl font-bold text-green-600">
                    ¥{selectedRedemption.value.toLocaleString()}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium">适用等级</div>
                <div className="flex flex-wrap gap-2">
                  {selectedRedemption.memberTierIds?.map(tierId => {
                    const tier = tiers.find(t => t.id === tierId)
                    return (
                      <Badge key={tierId} variant="outline" style={{ color: tier?.color }}>
                        {tier?.name}
                      </Badge>
                    )
                  }) || <Badge variant="secondary">全部等级</Badge>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">有效期</div>
                <div className="text-sm text-muted-foreground">
                  {selectedRedemption.validFrom ? new Date(selectedRedemption.validFrom).toLocaleDateString('zh-CN') : '-'} 至{' '}
                  {selectedRedemption.validTo ? new Date(selectedRedemption.validTo).toLocaleDateString('zh-CN') : '-'}
                </div>
              </div>

              <Button className="w-full" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                确认兑换
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddMemberForm({ onSuccess }: { onSuccess: () => void }) {
  const addMember = useMembershipStore(state => state.addMember)
  const tiers = useMembershipStore(state => state.tiers)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      await addMember({
        storeId: 'store-001',
        phone: formData.get('phone') as string,
        name: formData.get('name') as string,
        gender: formData.get('gender') as 'male' | 'female',
        birthday: formData.get('birthday') as string,
        tierId: formData.get('tierId') as string,
        points: 0,
        totalPointsEarned: 0,
        totalSpent: 0,
        visitCount: 0,
        lastVisitAt: new Date().toISOString(),
        status: 'active',
        preferences: {},
        tags: [],
      })
      onSuccess()
    } catch (err) {
      console.error('Failed to add member:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">姓名 *</label>
          <Input name="name" placeholder="请输入姓名" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">手机号 *</label>
          <Input name="phone" placeholder="请输入手机号" required pattern="[0-9]{11}" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">性别</label>
          <Select name="gender" defaultValue="">
            <SelectTrigger>
              <SelectValue placeholder="选择性别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">保密</SelectItem>
              <SelectItem value="male">男</SelectItem>
              <SelectItem value="female">女</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">初始等级</label>
          <Select name="tierId" defaultValue={tiers[tiers.length - 1]?.id}>
            <SelectTrigger>
              <SelectValue placeholder="选择等级" />
            </SelectTrigger>
            <SelectContent>
              {tiers.map(tier => (
                <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">生日</label>
        <Input name="birthday" type="date" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          取消
        </Button>
        <Button type="submit">
          添加会员
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

function MembershipPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
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

      <Card>
        <CardHeader><Skeleton className="h-6 w-[200px]" /></CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
              <Separator />
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
