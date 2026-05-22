"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Shield,
  DollarSign,
  Clock,
  Settings,
} from "lucide-react"

interface Employee {
  id: string
  name: string
  employeeId: string
  phone: string
  email: string
  position: string
  department: string
  store: string
  hireDate: string
  status: "active" | "inactive" | "suspended"
  avatar?: string
  permissions: {
    functionPermissions: string[]
    desktopPermissions: string[]
    advancedPermissions: string[]
  }
  financialInfo: {
    accountBalance: number
    creditLimit: number
    creditBalance: number
    tipSetting: number
    monthlyGiftLimit: number
    dailyGiftLimit: number
  }
  workInfo: {
    loginTimeType: "24hours" | "business"
    mobileLogin: boolean
    dailyReportSMS: boolean
    lastLogin?: string
    totalWorkDays: number
  }
}

export default function EmployeeProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>({
    id: "1",
    name: "张三",
    employeeId: "EMP001",
    phone: "13800138000",
    email: "zhangsan@example.com",
    position: "服务员",
    department: "楼面部",
    store: "时代星光",
    hireDate: "2023-01-15",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    permissions: {
      functionPermissions: ["我的任务", "包厢状态", "订单管理", "商品赠送"],
      desktopPermissions: ["销售", "商品", "仓库"],
      advancedPermissions: ["支付方式", "个人中心"],
    },
    financialInfo: {
      accountBalance: 1500.0,
      creditLimit: 5000.0,
      creditBalance: 2300.0,
      tipSetting: 100.0,
      monthlyGiftLimit: 1000.0,
      dailyGiftLimit: 200.0,
    },
    workInfo: {
      loginTimeType: "24hours",
      mobileLogin: true,
      dailyReportSMS: false,
      lastLogin: "2024-01-15 14:30:25",
      totalWorkDays: 365,
    },
  })

  const [editedEmployee, setEditedEmployee] = useState<Employee>(selectedEmployee)

  const employees = [
    { id: "1", name: "张三", position: "服务员", department: "楼面部" },
    { id: "2", name: "李四", position: "收银员", department: "前厅部" },
    { id: "3", name: "王五", position: "经理", department: "销售部" },
    { id: "4", name: "赵六", position: "主管", department: "助理部" },
  ]

  const handleSave = () => {
    setSelectedEmployee(editedEmployee)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedEmployee(selectedEmployee)
    setIsEditing(false)
  }

  const updateField = (field: string, value: any) => {
    setEditedEmployee((prev) => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (parent: string, field: string, value: unknown) => {
    setEditedEmployee((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent as keyof Employee] as Record<string, unknown>), [field]: value },
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
      case "suspended":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "在职"
      case "inactive":
        return "离职"
      case "suspended":
        return "停职"
      default:
        return "未知"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              员工档案管理
            </h1>
            <div className="flex items-center space-x-4">
              <Select
                value={selectedEmployee.id}
                onValueChange={(value) => {
                  const employee = employees.find((e) => e.id === value)
                  if (employee) {
                    // TODO: 从API获取完整的员工信息
                  }
                }}
              >
                <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id} className="text-slate-100">
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isEditing ? (
                <div className="flex space-x-2">
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    保存
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="border-slate-600 text-slate-300">
                    <X className="h-4 w-4 mr-2" />
                    取消
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-cyan-600 hover:bg-cyan-700">
                  <Edit className="h-4 w-4 mr-2" />
                  编辑资料
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：基本信息卡片 */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={selectedEmployee.avatar || "/placeholder.svg"} alt={selectedEmployee.name} />
                  <AvatarFallback className="bg-slate-700 text-cyan-500 text-2xl">
                    {selectedEmployee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-slate-100">{selectedEmployee.name}</CardTitle>
                <div className="flex justify-center">
                  <Badge className={getStatusColor(selectedEmployee.status)}>
                    {getStatusText(selectedEmployee.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Briefcase className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-slate-400">职位：</span>
                    <span className="text-slate-200 ml-1">{selectedEmployee.position}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-slate-400">工号：</span>
                    <span className="text-slate-200 ml-1">{selectedEmployee.employeeId}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-slate-400">门店：</span>
                    <span className="text-slate-200 ml-1">{selectedEmployee.store}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-slate-400">入职：</span>
                    <span className="text-slate-200 ml-1">{selectedEmployee.hireDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-slate-400">电话：</span>
                    <span className="text-slate-200 ml-1">{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-slate-400">邮箱：</span>
                    <span className="text-slate-200 ml-1">{selectedEmployee.email}</span>
                  </div>
                </div>

                {/* 快速统计 */}
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-cyan-400">{selectedEmployee.workInfo.totalWorkDays}</div>
                      <div className="text-xs text-slate-400">工作天数</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-400">
                        {selectedEmployee.permissions.functionPermissions.length}
                      </div>
                      <div className="text-xs text-slate-400">功能权限</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：详细信息标签页 */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="bg-slate-800/50 p-1 mb-6">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                >
                  <User className="h-4 w-4 mr-2" />
                  基本信息
                </TabsTrigger>
                <TabsTrigger
                  value="permissions"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  权限设置
                </TabsTrigger>
                <TabsTrigger
                  value="financial"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  财务信息
                </TabsTrigger>
                <TabsTrigger
                  value="work"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  工作设置
                </TabsTrigger>
              </TabsList>

              {/* 基本信息 */}
              <TabsContent value="basic" className="mt-0">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center">
                      <User className="mr-2 h-5 w-5 text-cyan-500" />
                      基本信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">姓名</Label>
                        {isEditing ? (
                          <Input
                            value={editedEmployee.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            {selectedEmployee.name}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-300">工号</Label>
                        {isEditing ? (
                          <Input
                            value={editedEmployee.employeeId}
                            onChange={(e) => updateField("employeeId", e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            {selectedEmployee.employeeId}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">手机号</Label>
                        {isEditing ? (
                          <Input
                            value={editedEmployee.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            {selectedEmployee.phone}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-300">邮箱</Label>
                        {isEditing ? (
                          <Input
                            value={editedEmployee.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            {selectedEmployee.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-300">职位</Label>
                        {isEditing ? (
                          <Select
                            value={editedEmployee.position}
                            onValueChange={(value) => updateField("position", value)}
                          >
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="服务员" className="text-slate-100">
                                服务员
                              </SelectItem>
                              <SelectItem value="收银员" className="text-slate-100">
                                收银员
                              </SelectItem>
                              <SelectItem value="经理" className="text-slate-100">
                                经理
                              </SelectItem>
                              <SelectItem value="主管" className="text-slate-100">
                                主管
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            {selectedEmployee.position}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-300">部门</Label>
                        {isEditing ? (
                          <Select
                            value={editedEmployee.department}
                            onValueChange={(value) => updateField("department", value)}
                          >
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="楼面部" className="text-slate-100">
                                楼面部
                              </SelectItem>
                              <SelectItem value="前厅部" className="text-slate-100">
                                前厅部
                              </SelectItem>
                              <SelectItem value="销售部" className="text-slate-100">
                                销售部
                              </SelectItem>
                              <SelectItem value="助理部" className="text-slate-100">
                                助理部
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            {selectedEmployee.department}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-300">门店</Label>
                        {isEditing ? (
                          <Select value={editedEmployee.store} onValueChange={(value) => updateField("store", value)}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="时代星光" className="text-slate-100">
                                时代星光
                              </SelectItem>
                              <SelectItem value="皇家国际" className="text-slate-100">
                                皇家国际
                              </SelectItem>
                              <SelectItem value="丽都国际" className="text-slate-100">
                                丽都国际
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            {selectedEmployee.store}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">入职日期</Label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editedEmployee.hireDate}
                            onChange={(e) => updateField("hireDate", e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            {selectedEmployee.hireDate}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-300">状态</Label>
                        {isEditing ? (
                          <Select value={editedEmployee.status} onValueChange={(value) => updateField("status", value)}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="active" className="text-slate-100">
                                在职
                              </SelectItem>
                              <SelectItem value="inactive" className="text-slate-100">
                                离职
                              </SelectItem>
                              <SelectItem value="suspended" className="text-slate-100">
                                停职
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50">
                            <Badge className={getStatusColor(selectedEmployee.status)}>
                              {getStatusText(selectedEmployee.status)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 权限设置 */}
              <TabsContent value="permissions" className="mt-0">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-cyan-500" />
                      权限设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-slate-300 text-base font-medium">功能权限</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedEmployee.permissions.functionPermissions.map((permission, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300 text-base font-medium">桌面版权限</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedEmployee.permissions.desktopPermissions.map((permission, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-purple-500/10 text-purple-400 border-purple-500/30"
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300 text-base font-medium">高级权限</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedEmployee.permissions.advancedPermissions.map((permission, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-500/10 text-blue-400 border-blue-500/30"
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-4 border-t border-slate-700/50">
                        <Button className="bg-cyan-600 hover:bg-cyan-700">
                          <Settings className="h-4 w-4 mr-2" />
                          修改权限设置
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 财务信息 */}
              <TabsContent value="financial" className="mt-0">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-cyan-500" />
                      财务信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">账户余额</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editedEmployee.financialInfo.accountBalance}
                            onChange={(e) =>
                              updateNestedField("financialInfo", "accountBalance", Number(e.target.value))
                            }
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            ¥{selectedEmployee.financialInfo.accountBalance.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-300">挂账额度</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editedEmployee.financialInfo.creditLimit}
                            onChange={(e) => updateNestedField("financialInfo", "creditLimit", Number(e.target.value))}
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            ¥{selectedEmployee.financialInfo.creditLimit.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">挂账余额</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editedEmployee.financialInfo.creditBalance}
                            onChange={(e) =>
                              updateNestedField("financialInfo", "creditBalance", Number(e.target.value))
                            }
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            ¥{selectedEmployee.financialInfo.creditBalance.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-300">小费设置</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editedEmployee.financialInfo.tipSetting}
                            onChange={(e) => updateNestedField("financialInfo", "tipSetting", Number(e.target.value))}
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            ¥{selectedEmployee.financialInfo.tipSetting.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">月赠送额度</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editedEmployee.financialInfo.monthlyGiftLimit}
                            onChange={(e) =>
                              updateNestedField("financialInfo", "monthlyGiftLimit", Number(e.target.value))
                            }
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            ¥{selectedEmployee.financialInfo.monthlyGiftLimit.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-300">日赠送额度</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editedEmployee.financialInfo.dailyGiftLimit}
                            onChange={(e) =>
                              updateNestedField("financialInfo", "dailyGiftLimit", Number(e.target.value))
                            }
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            ¥{selectedEmployee.financialInfo.dailyGiftLimit.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 工作设置 */}
              <TabsContent value="work" className="mt-0">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-cyan-500" />
                      工作设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-300">允许移动设备登录</Label>
                          {isEditing ? (
                            <Switch
                              checked={editedEmployee.workInfo.mobileLogin}
                              onCheckedChange={(checked) => updateNestedField("workInfo", "mobileLogin", checked)}
                            />
                          ) : (
                            <Badge
                              className={
                                selectedEmployee.workInfo.mobileLogin
                                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                                  : "bg-red-500/20 text-red-400 border-red-500/50"
                              }
                            >
                              {selectedEmployee.workInfo.mobileLogin ? "允许" : "禁止"}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-slate-300">接收运营日报短信</Label>
                          {isEditing ? (
                            <Switch
                              checked={editedEmployee.workInfo.dailyReportSMS}
                              onCheckedChange={(checked) => updateNestedField("workInfo", "dailyReportSMS", checked)}
                            />
                          ) : (
                            <Badge
                              className={
                                selectedEmployee.workInfo.dailyReportSMS
                                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                                  : "bg-red-500/20 text-red-400 border-red-500/50"
                              }
                            >
                              {selectedEmployee.workInfo.dailyReportSMS ? "接收" : "不接收"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-300">登录时间类型</Label>
                          {isEditing ? (
                            <Select
                              value={editedEmployee.workInfo.loginTimeType}
                              onValueChange={(value) => updateNestedField("workInfo", "loginTimeType", value)}
                            >
                              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-600">
                                <SelectItem value="24hours" className="text-slate-100">
                                  24小时
                                </SelectItem>
                                <SelectItem value="business" className="text-slate-100">
                                  按营业时间
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                              {selectedEmployee.workInfo.loginTimeType === "24hours" ? "24小时" : "按营业时间"}
                            </div>
                          )}
                        </div>

                        <div>
                          <Label className="text-slate-300">最后登录时间</Label>
                          <div className="p-2 bg-slate-800/30 rounded border border-slate-700/50 text-slate-200">
                            {selectedEmployee.workInfo.lastLogin || "从未登录"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400">
                            {selectedEmployee.workInfo.totalWorkDays}
                          </div>
                          <div className="text-sm text-slate-400">总工作天数</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">
                            {selectedEmployee.permissions.functionPermissions.length +
                              selectedEmployee.permissions.desktopPermissions.length +
                              selectedEmployee.permissions.advancedPermissions.length}
                          </div>
                          <div className="text-sm text-slate-400">总权限数量</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            ¥
                            {(
                              selectedEmployee.financialInfo.accountBalance +
                              selectedEmployee.financialInfo.creditBalance
                            ).toFixed(0)}
                          </div>
                          <div className="text-sm text-slate-400">总可用金额</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
