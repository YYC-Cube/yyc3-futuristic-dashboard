"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { User, DollarSign, Gift, Settings, ChevronRight, ChevronLeft, Check } from "lucide-react"

interface EmployeeFormData {
  // 基本资料
  name: string
  employeeId: string
  phone: string
  password: string
  position: string
  store: string
  group: string

  // 财务设置
  accountBalance: number
  creditLimit: number
  creditBalance: number
  tipSetting: number
  managerDiscount: boolean
  discountRange: { min: number; max: number }
  discountPassword: string
  roomCheckout: boolean

  // 权限设置
  managedProducts: string[]
  monthlyGiftLimit: number
  monthlyGiftBalance: number
  dailyGiftLimit: number
  dailyGiftBalance: number
  lowConsumptionGift: boolean
  giftPermission: boolean
  giftRules: string[]
  billGiftRatio: number

  // 高级设置
  managedArtistGroups: string[]
  managedEmployeeGroups: string[]
  assignablePositions: string[]
  paymentMethods: string[]
  modifyLowConsumption: boolean
  viewCustomerPerformance: boolean
  warehouseAccess: string[]
  mobileLogin: boolean
  dailyReportSMS: boolean
  loginTimeType: "24hours" | "business"
  loginStartTime: string
  loginEndTime: string
}

export default function AddEmployeeForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    employeeId: "",
    phone: "",
    password: "",
    position: "",
    store: "时代星光",
    group: "",
    accountBalance: 0,
    creditLimit: 0,
    creditBalance: 0,
    tipSetting: 0,
    managerDiscount: false,
    discountRange: { min: 0, max: 0 },
    discountPassword: "",
    roomCheckout: false,
    managedProducts: [],
    monthlyGiftLimit: 0,
    monthlyGiftBalance: 0,
    dailyGiftLimit: 0,
    dailyGiftBalance: 0,
    lowConsumptionGift: false,
    giftPermission: false,
    giftRules: [],
    billGiftRatio: 0,
    managedArtistGroups: [],
    managedEmployeeGroups: [],
    assignablePositions: [],
    paymentMethods: [],
    modifyLowConsumption: false,
    viewCustomerPerformance: false,
    warehouseAccess: [],
    mobileLogin: true,
    dailyReportSMS: false,
    loginTimeType: "24hours",
    loginStartTime: "",
    loginEndTime: "",
  })

  const steps = [
    { id: 0, title: "基本资料", icon: User },
    { id: 1, title: "权限设置", icon: Gift },
    { id: 2, title: "财务设置", icon: DollarSign },
    { id: 3, title: "高级设置", icon: Settings },
  ]

  const positions = ["服务员", "收银员", "经理", "主管", "总监"]
  const groups = ["楼面部", "助理部", "销售部", "前厅部", "资源部", "出品部", "财务部"]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // TODO: 处理表单提交逻辑
  }

  const updateFormData = (field: string, value: string | number | boolean | Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    index <= currentStep ? "bg-cyan-500 border-cyan-500 text-white" : "border-slate-600 text-slate-400"
                  }`}
                >
                  {index < currentStep ? <Check className="h-6 w-6" /> : <step.icon className="h-6 w-6" />}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${index <= currentStep ? "text-cyan-400" : "text-slate-400"}`}>
                    步骤 {index + 1}
                  </div>
                  <div className={`text-xs ${index <= currentStep ? "text-slate-200" : "text-slate-500"}`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && <ChevronRight className="h-5 w-5 text-slate-600 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* 表单内容 */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center">
              {(() => {
                const Icon = steps[currentStep].icon
                return Icon ? <Icon className="mr-2 h-5 w-5 text-cyan-500" /> : null
              })()}
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 步骤 1: 基本资料 */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">
                      姓名 *
                    </Label>
                    <Input
                      id="name"
                      placeholder="请输入员工姓名"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeId" className="text-slate-300">
                      工号 *
                    </Label>
                    <Input
                      id="employeeId"
                      placeholder="请输入员工工号"
                      value={formData.employeeId}
                      onChange={(e) => updateFormData("employeeId", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-slate-300">
                      手机号 *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="请输入手机号码"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-slate-300">
                      登录密码 *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="请输入密码"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-300">职务 *</Label>
                    <Select value={formData.position} onValueChange={(value) => updateFormData("position", value)}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                        <SelectValue placeholder="请选择职务名称" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {positions.map((position) => (
                          <SelectItem key={position} value={position} className="text-slate-100">
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300">服务门店</Label>
                    <Select value={formData.store} onValueChange={(value) => updateFormData("store", value)}>
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
                  </div>
                  <div>
                    <Label className="text-slate-300">所在组别</Label>
                    <Select value={formData.group} onValueChange={(value) => updateFormData("group", value)}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                        <SelectValue placeholder="请选择所在组别" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {groups.map((group) => (
                          <SelectItem key={group} value={group} className="text-slate-100">
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* 步骤 2: 权限设置 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">月赠送额度</Label>
                    <Input
                      type="number"
                      placeholder="设置商品月赠送额度"
                      value={formData.monthlyGiftLimit}
                      onChange={(e) => updateFormData("monthlyGiftLimit", Number(e.target.value))}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">月赠送余额</Label>
                    <Input
                      type="number"
                      value={formData.monthlyGiftBalance}
                      onChange={(e) => updateFormData("monthlyGiftBalance", Number(e.target.value))}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">日赠送额度</Label>
                    <Input
                      type="number"
                      placeholder="设置商品日赠送额度"
                      value={formData.dailyGiftLimit}
                      onChange={(e) => updateFormData("dailyGiftLimit", Number(e.target.value))}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">日赠送余额</Label>
                    <Input
                      type="number"
                      value={formData.dailyGiftBalance}
                      onChange={(e) => updateFormData("dailyGiftBalance", Number(e.target.value))}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">满减低消开启日赠送</Label>
                    <Switch
                      checked={formData.lowConsumptionGift}
                      onCheckedChange={(checked) => updateFormData("lowConsumptionGift", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">商品赠送权限仅限本人预定的包厢</Label>
                    <Switch
                      checked={formData.giftPermission}
                      onCheckedChange={(checked) => updateFormData("giftPermission", checked)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">账单赠送比例 (%)</Label>
                  <Input
                    type="number"
                    placeholder="请设置账单消费赠送比例"
                    value={formData.billGiftRatio}
                    onChange={(e) => updateFormData("billGiftRatio", Number(e.target.value))}
                    className="bg-slate-800/50 border-slate-600 text-slate-100"
                  />
                </div>
              </div>
            )}

            {/* 步骤 3: 财务设置 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-300">员工账户余额</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.accountBalance}
                      onChange={(e) => updateFormData("accountBalance", Number(e.target.value))}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">挂账额度</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.creditLimit}
                      onChange={(e) => updateFormData("creditLimit", Number(e.target.value))}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">挂账余额</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.creditBalance}
                      onChange={(e) => updateFormData("creditBalance", Number(e.target.value))}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">小费设置</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.tipSetting}
                    onChange={(e) => updateFormData("tipSetting", Number(e.target.value))}
                    className="bg-slate-800/50 border-slate-600 text-slate-100"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">经理账单打折</Label>
                    <Switch
                      checked={formData.managerDiscount}
                      onCheckedChange={(checked) => updateFormData("managerDiscount", checked)}
                    />
                  </div>

                  {formData.managerDiscount && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-300">折扣范围 - 最低 (%)</Label>
                        <Input
                          type="number"
                          value={formData.discountRange.min}
                          onChange={(e) =>
                            updateFormData("discountRange", {
                              ...formData.discountRange,
                              min: Number(e.target.value),
                            })
                          }
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">折扣范围 - 最高 (%)</Label>
                        <Input
                          type="number"
                          value={formData.discountRange.max}
                          onChange={(e) =>
                            updateFormData("discountRange", {
                              ...formData.discountRange,
                              max: Number(e.target.value),
                            })
                          }
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">打折密码</Label>
                        <Input
                          type="password"
                          placeholder="请设置经理账单打折密码"
                          value={formData.discountPassword}
                          onChange={(e) => updateFormData("discountPassword", e.target.value)}
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">包厢后买单</Label>
                    <Switch
                      checked={formData.roomCheckout}
                      onCheckedChange={(checked) => updateFormData("roomCheckout", checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 步骤 4: 高级设置 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">计时开房时修改低消金额</Label>
                    <Switch
                      checked={formData.modifyLowConsumption}
                      onCheckedChange={(checked) => updateFormData("modifyLowConsumption", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">查看散客订台业绩</Label>
                    <Switch
                      checked={formData.viewCustomerPerformance}
                      onCheckedChange={(checked) => updateFormData("viewCustomerPerformance", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">允许在移动设备登录</Label>
                    <Switch
                      checked={formData.mobileLogin}
                      onCheckedChange={(checked) => updateFormData("mobileLogin", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">接收运营日报短信</Label>
                    <Switch
                      checked={formData.dailyReportSMS}
                      onCheckedChange={(checked) => updateFormData("dailyReportSMS", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-300">登录时间设置</Label>
                  <div className="flex space-x-4">
                    <Button
                      variant={formData.loginTimeType === "24hours" ? "default" : "outline"}
                      onClick={() => updateFormData("loginTimeType", "24hours")}
                      className="flex-1"
                    >
                      24小时
                    </Button>
                    <Button
                      variant={formData.loginTimeType === "business" ? "default" : "outline"}
                      onClick={() => updateFormData("loginTimeType", "business")}
                      className="flex-1"
                    >
                      按营业时间
                    </Button>
                  </div>

                  {formData.loginTimeType === "business" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">开始时间</Label>
                        <Input
                          type="time"
                          value={formData.loginStartTime}
                          onChange={(e) => updateFormData("loginStartTime", e.target.value)}
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">结束时间</Label>
                        <Input
                          type="time"
                          value={formData.loginEndTime}
                          onChange={(e) => updateFormData("loginEndTime", e.target.value)}
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 导航按钮 */}
            <div className="flex justify-between pt-6 border-t border-slate-700/50">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                上一步
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button onClick={handleSubmit} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Check className="h-4 w-4 mr-2" />
                  完成创建
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  下一步
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
