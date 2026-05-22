"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Edit,
  Search,
  Filter,
  Star,
  Gift,
  CreditCard,
  Phone,
  Calendar,
  TrendingUp,
  DollarSign,
  Award,
  Heart,
  Crown,
  Zap,
  Target,
  MessageSquare,
  Cake,
  UserPlus,
  History,
  BarChart3,
} from "lucide-react"
import type { Member } from "@/lib/api/types"

interface MemberLevel {
  id: string
  name: string
  icon: any
  color: string
  minConsumption: number
  discount: number
  pointsRatio: number
  benefits: string[]
}

interface MemberActivity {
  id: string
  memberId: string
  type: "consumption" | "recharge" | "points_earn" | "points_redeem" | "upgrade"
  amount: number
  points?: number
  description: string
  date: string
}

export default function MemberManagement() {
  const [activeTab, setActiveTab] = useState("members")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isRechargeOpen, setIsRechargeOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // 会员等级配置
  const [memberLevels, setMemberLevels] = useState<MemberLevel[]>([
    {
      id: "bronze",
      name: "青铜会员",
      icon: Award,
      color: "text-orange-400",
      minConsumption: 0,
      discount: 95,
      pointsRatio: 1,
      benefits: ["积分累积", "生日优惠"],
    },
    {
      id: "silver",
      name: "白银会员",
      icon: Star,
      color: "text-gray-400",
      minConsumption: 1000,
      discount: 90,
      pointsRatio: 1.2,
      benefits: ["积分累积", "生日优惠", "专属客服"],
    },
    {
      id: "gold",
      name: "黄金会员",
      icon: Crown,
      color: "text-yellow-400",
      minConsumption: 5000,
      discount: 85,
      pointsRatio: 1.5,
      benefits: ["积分累积", "生日优惠", "专属客服", "免费停车"],
    },
    {
      id: "platinum",
      name: "铂金会员",
      icon: Zap,
      color: "text-purple-400",
      minConsumption: 10000,
      discount: 80,
      pointsRatio: 2,
      benefits: ["积分累积", "生日优惠", "专属客服", "免费停车", "优先预订"],
    },
    {
      id: "diamond",
      name: "钻石会员",
      icon: Heart,
      color: "text-cyan-400",
      minConsumption: 20000,
      discount: 75,
      pointsRatio: 3,
      benefits: ["积分累积", "生日优惠", "专属客服", "免费停车", "优先预订", "专属包厢"],
    },
  ])

  // 会员数据
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      memberNumber: "M001",
      name: "张三",
      phone: "13800138000",
      level: "gold",
      points: 2580,
      balance: 1500.0,
      totalConsumption: 8500.0,
      lastVisit: "2024-01-15",
      birthday: "1990-05-20",
      gender: "male",
      address: "北京市朝阳区",
      notes: "VIP客户，喜欢包厢K歌",
    },
    {
      id: "2",
      memberNumber: "M002",
      name: "李四",
      phone: "13900139000",
      level: "silver",
      points: 1200,
      balance: 800.0,
      totalConsumption: 3200.0,
      lastVisit: "2024-01-14",
      birthday: "1985-08-15",
      gender: "female",
      address: "北京市海淀区",
      notes: "经常带朋友聚会",
    },
    {
      id: "3",
      memberNumber: "M003",
      name: "王五",
      phone: "13700137000",
      level: "platinum",
      points: 5800,
      balance: 3200.0,
      totalConsumption: 15800.0,
      lastVisit: "2024-01-16",
      birthday: "1988-12-03",
      gender: "male",
      address: "北京市西城区",
      notes: "企业客户，经常举办商务活动",
    },
  ])

  // 会员活动记录
  const [activities, setActivities] = useState<MemberActivity[]>([
    {
      id: "1",
      memberId: "1",
      type: "consumption",
      amount: 680,
      points: 68,
      description: "包厢消费",
      date: "2024-01-15 20:30",
    },
    {
      id: "2",
      memberId: "1",
      type: "recharge",
      amount: 1000,
      description: "账户充值",
      date: "2024-01-15 19:45",
    },
    {
      id: "3",
      memberId: "2",
      type: "points_redeem",
      amount: 0,
      points: -500,
      description: "积分兑换饮料",
      date: "2024-01-14 21:15",
    },
  ])

  // 过滤会员数据
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "all" || member.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  // 获取会员等级信息
  const getMemberLevel = (levelId: string) => {
    return memberLevels.find((level) => level.id === levelId) || memberLevels[0]
  }

  // 统计数据
  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter((m) => {
      const lastVisit = new Date(m.lastVisit || "")
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return lastVisit > thirtyDaysAgo
    }).length,
    totalBalance: members.reduce((sum, m) => sum + m.balance, 0),
    totalPoints: members.reduce((sum, m) => sum + m.points, 0),
    totalConsumption: members.reduce((sum, m) => sum + m.totalConsumption, 0),
    averageConsumption:
      members.length > 0 ? members.reduce((sum, m) => sum + m.totalConsumption, 0) / members.length : 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              会员营销系统
            </h1>
            <div className="flex items-center space-x-4">
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    新增会员
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-slate-100">新增会员</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">会员姓名 *</Label>
                        <Input
                          placeholder="请输入会员姓名"
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">手机号码 *</Label>
                        <Input
                          placeholder="请输入手机号码"
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">性别</Label>
                        <Select>
                          <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                            <SelectValue placeholder="选择性别" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="male" className="text-slate-100">
                              男
                            </SelectItem>
                            <SelectItem value="female" className="text-slate-100">
                              女
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300">生日</Label>
                        <Input type="date" className="bg-slate-800/50 border-slate-600 text-slate-100" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-300">地址</Label>
                      <Input placeholder="请输入地址" className="bg-slate-800/50 border-slate-600 text-slate-100" />
                    </div>
                    <div>
                      <Label className="text-slate-300">备注</Label>
                      <Input placeholder="请输入备注信息" className="bg-slate-800/50 border-slate-600 text-slate-100" />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddMemberOpen(false)}
                        className="border-slate-600 text-slate-300"
                      >
                        取消
                      </Button>
                      <Button className="bg-cyan-600 hover:bg-cyan-700">确认添加</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Gift className="h-4 w-4 mr-2" />
                营销活动
              </Button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{stats.totalMembers}</div>
                    <div className="text-sm text-slate-400">会员总数</div>
                  </div>
                  <Users className="h-8 w-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{stats.activeMembers}</div>
                    <div className="text-sm text-slate-400">活跃会员</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">¥{stats.totalBalance.toFixed(0)}</div>
                    <div className="text-sm text-slate-400">余额总计</div>
                  </div>
                  <CreditCard className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.totalPoints.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">积分总计</div>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">¥{stats.totalConsumption.toFixed(0)}</div>
                    <div className="text-sm text-slate-400">消费总额</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">¥{stats.averageConsumption.toFixed(0)}</div>
                    <div className="text-sm text-slate-400">人均消费</div>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 主要内容区域 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/50 p-1 mb-6">
            <TabsTrigger value="members" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <Users className="h-4 w-4 mr-2" />
              会员列表
            </TabsTrigger>
            <TabsTrigger value="levels" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <Crown className="h-4 w-4 mr-2" />
              等级管理
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <History className="h-4 w-4 mr-2" />
              活动记录
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              数据分析
            </TabsTrigger>
          </TabsList>

          {/* 会员列表标签页 */}
          <TabsContent value="members" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-cyan-500" />
                    会员列表管理
                  </CardTitle>
                </div>

                {/* 搜索和筛选 */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="搜索会员姓名、手机号或会员号..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-slate-100">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all" className="text-slate-100">
                        全部等级
                      </SelectItem>
                      {memberLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id} className="text-slate-100">
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent>
                {/* 会员列表 */}
                <div className="space-y-4">
                  {filteredMembers.map((member) => {
                    const level = getMemberLevel(member.level)
                    const LevelIcon = level.icon
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${member.name.charAt(0)}`} />
                            <AvatarFallback className="bg-slate-700 text-cyan-500 text-xl">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-slate-200 font-medium">{member.name}</h3>
                              <Badge
                                className={`bg-${level.color.split("-")[1]}-500/20 ${level.color} border-${level.color.split("-")[1]}-500/30`}
                              >
                                <LevelIcon className="h-3 w-3 mr-1" />
                                {level.name}
                              </Badge>
                              {member.gender && (
                                <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                                  {member.gender === "male" ? "男" : "女"}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-slate-400 text-sm flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {member.phone}
                              </span>
                              <span className="text-slate-400 text-sm">会员号: {member.memberNumber}</span>
                              {member.lastVisit && (
                                <span className="text-slate-400 text-sm flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  最后消费: {member.lastVisit}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-6 mt-2">
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-400">¥{member.balance.toFixed(0)}</div>
                                <div className="text-xs text-slate-400">余额</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-yellow-400">{member.points}</div>
                                <div className="text-xs text-slate-400">积分</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-cyan-400">
                                  ¥{member.totalConsumption.toFixed(0)}
                                </div>
                                <div className="text-xs text-slate-400">总消费</div>
                              </div>
                              {member.birthday && (
                                <div className="text-center">
                                  <div className="text-sm text-orange-400 flex items-center">
                                    <Cake className="h-3 w-3 mr-1" />
                                    {member.birthday}
                                  </div>
                                  <div className="text-xs text-slate-400">生日</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Dialog open={isRechargeOpen} onOpenChange={setIsRechargeOpen}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedMember(member)}
                                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                              >
                                <CreditCard className="h-3 w-3 mr-1" />
                                充值
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-slate-100">会员充值</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-4 p-4 bg-slate-800/30 rounded-lg">
                                  <Avatar>
                                    <AvatarFallback className="bg-slate-700 text-cyan-500">
                                      {selectedMember?.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-slate-200 font-medium">{selectedMember?.name}</div>
                                    <div className="text-slate-400 text-sm">
                                      当前余额: ¥{selectedMember?.balance.toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-slate-300">充值金额</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="请输入充值金额"
                                    className="bg-slate-800/50 border-slate-600 text-slate-100"
                                  />
                                </div>
                                <div>
                                  <Label className="text-slate-300">支付方式</Label>
                                  <Select>
                                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                                      <SelectValue placeholder="选择支付方式" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600">
                                      <SelectItem value="cash" className="text-slate-100">
                                        现金
                                      </SelectItem>
                                      <SelectItem value="card" className="text-slate-100">
                                        刷卡
                                      </SelectItem>
                                      <SelectItem value="wechat" className="text-slate-100">
                                        微信支付
                                      </SelectItem>
                                      <SelectItem value="alipay" className="text-slate-100">
                                        支付宝
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsRechargeOpen(false)}
                                    className="border-slate-600 text-slate-300"
                                  >
                                    取消
                                  </Button>
                                  <Button className="bg-green-600 hover:bg-green-700">确认充值</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            编辑
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            消息
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {filteredMembers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <div className="text-slate-400">暂无会员数据</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 等级管理标签页 */}
          <TabsContent value="levels" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <Crown className="mr-2 h-5 w-5 text-cyan-500" />
                  会员等级管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {memberLevels.map((level) => {
                    const LevelIcon = level.icon
                    const memberCount = members.filter((m) => m.level === level.id).length
                    return (
                      <Card key={level.id} className="bg-slate-800/30 border-slate-700/50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                  level.id === "bronze"
                                    ? "bg-orange-500/20"
                                    : level.id === "silver"
                                      ? "bg-gray-500/20"
                                      : level.id === "gold"
                                        ? "bg-yellow-500/20"
                                        : level.id === "platinum"
                                          ? "bg-purple-500/20"
                                          : "bg-cyan-500/20"
                                }`}
                              >
                                <LevelIcon className={`h-8 w-8 ${level.color}`} />
                              </div>
                              <div>
                                <h3 className="text-slate-200 font-medium text-lg">{level.name}</h3>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-slate-400 text-sm">最低消费: ¥{level.minConsumption}</span>
                                  <span className="text-slate-400 text-sm">折扣: {level.discount}%</span>
                                  <span className="text-slate-400 text-sm">积分倍率: {level.pointsRatio}x</span>
                                  <span className="text-slate-400 text-sm">会员数: {memberCount}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {level.benefits.map((benefit, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="bg-slate-700/50 text-slate-300 border-slate-600"
                                    >
                                      {benefit}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                编辑
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 活动记录标签页 */}
          <TabsContent value="activities" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <History className="mr-2 h-5 w-5 text-cyan-500" />
                  会员活动记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => {
                    const member = members.find((m) => m.id === activity.memberId)
                    const getActivityIcon = (type: string) => {
                      switch (type) {
                        case "consumption":
                          return { icon: DollarSign, color: "text-green-400", bg: "bg-green-500/20" }
                        case "recharge":
                          return { icon: CreditCard, color: "text-blue-400", bg: "bg-blue-500/20" }
                        case "points_earn":
                          return { icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/20" }
                        case "points_redeem":
                          return { icon: Gift, color: "text-purple-400", bg: "bg-purple-500/20" }
                        case "upgrade":
                          return { icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/20" }
                        default:
                          return { icon: History, color: "text-gray-400", bg: "bg-gray-500/20" }
                      }
                    }
                    const { icon: Icon, color, bg } = getActivityIcon(activity.type)

                    return (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg}`}>
                            <Icon className={`h-6 w-6 ${color}`} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-slate-200 font-medium">{member?.name}</h3>
                              <Badge
                                className={
                                  activity.type === "consumption"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : activity.type === "recharge"
                                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                      : activity.type === "points_earn"
                                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                        : activity.type === "points_redeem"
                                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                          : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                                }
                              >
                                {activity.type === "consumption"
                                  ? "消费"
                                  : activity.type === "recharge"
                                    ? "充值"
                                    : activity.type === "points_earn"
                                      ? "积分获得"
                                      : activity.type === "points_redeem"
                                        ? "积分兑换"
                                        : "等级升级"}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              {activity.amount > 0 && (
                                <span className="text-slate-400 text-sm">金额: ¥{activity.amount}</span>
                              )}
                              {activity.points && (
                                <span className="text-slate-400 text-sm">
                                  积分: {activity.points > 0 ? "+" : ""}
                                  {activity.points}
                                </span>
                              )}
                              <span className="text-slate-400 text-sm">时间: {activity.date}</span>
                            </div>
                            <div className="text-slate-300 text-sm mt-1">{activity.description}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 数据分析标签页 */}
          <TabsContent value="analytics" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Crown className="mr-2 h-5 w-5 text-cyan-500" />
                    会员等级分布
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {memberLevels.map((level) => {
                      const memberCount = members.filter((m) => m.level === level.id).length
                      const percentage = members.length > 0 ? (memberCount / members.length) * 100 : 0
                      const LevelIcon = level.icon
                      return (
                        <div key={level.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <LevelIcon className={`h-4 w-4 ${level.color}`} />
                              <span className="text-slate-200">{level.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-400 text-sm">{memberCount}人</span>
                              <span className="text-cyan-400">{percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-700/50 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-cyan-500" />
                    消费趋势分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400">¥{stats.averageConsumption.toFixed(0)}</div>
                      <div className="text-slate-400">人均消费金额</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">本月新增会员</span>
                        <span className="text-green-400">+{Math.floor(Math.random() * 20) + 10}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">活跃会员比例</span>
                        <span className="text-cyan-400">
                          {((stats.activeMembers / stats.totalMembers) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">平均充值金额</span>
                        <span className="text-purple-400">¥{(stats.totalBalance / stats.totalMembers).toFixed(0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">积分使用率</span>
                        <span className="text-yellow-400">{Math.floor(Math.random() * 30) + 60}%</span>
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
