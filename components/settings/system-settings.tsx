"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Store,
  Printer,
  Wifi,
  Shield,
  Database,
  Bell,
  Clock,
  DollarSign,
  Users,
  CreditCard,
  Monitor,
  Smartphone,
  Save,
  RefreshCw,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
} from "lucide-react"

interface StoreSettings {
  name: string
  address: string
  phone: string
  email: string
  businessHours: {
    open: string
    close: string
  }
  currency: string
  timezone: string
  language: string
}

interface PrinterSettings {
  id: string
  name: string
  type: "receipt" | "kitchen" | "bar" | "report"
  ip: string
  port: number
  isDefault: boolean
  isActive: boolean
}

interface PaymentSettings {
  cash: boolean
  card: boolean
  wechat: boolean
  alipay: boolean
  memberCard: boolean
  credit: boolean
}

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("store")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  // 门店设置
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: "智慧商家KTV",
    address: "北京市朝阳区建国路88号",
    phone: "010-12345678",
    email: "contact@smartbusiness.com",
    businessHours: {
      open: "10:00",
      close: "02:00",
    },
    currency: "CNY",
    timezone: "Asia/Shanghai",
    language: "zh-CN",
  })

  // 打印机设置
  const [printers, setPrinters] = useState<PrinterSettings[]>([
    {
      id: "printer-001",
      name: "前台收银打印机",
      type: "receipt",
      ip: "192.168.1.100",
      port: 9100,
      isDefault: true,
      isActive: true,
    },
    {
      id: "printer-002",
      name: "厨房打印机",
      type: "kitchen",
      ip: "192.168.1.101",
      port: 9100,
      isDefault: false,
      isActive: true,
    },
    {
      id: "printer-003",
      name: "酒水吧打印机",
      type: "bar",
      ip: "192.168.1.102",
      port: 9100,
      isDefault: false,
      isActive: false,
    },
  ])

  // 支付设置
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    cash: true,
    card: true,
    wechat: true,
    alipay: true,
    memberCard: true,
    credit: false,
  })

  // 系统设置
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupTime: "02:00",
    dataRetention: 365,
    enableNotifications: true,
    enableSMS: false,
    enableEmail: true,
    debugMode: false,
    maintenanceMode: false,
  })

  // 保存设置
  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus("idle")

    try {
      // 模拟保存操作
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  // 获取打印机类型标签
  const getPrinterTypeLabel = (type: string) => {
    switch (type) {
      case "receipt":
        return "收银"
      case "kitchen":
        return "厨房"
      case "bar":
        return "酒水"
      case "report":
        return "报表"
      default:
        return "其他"
    }
  }

  // 获取打印机类型颜色
  const getPrinterTypeColor = (type: string) => {
    switch (type) {
      case "receipt":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "kitchen":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "bar":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "report":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              系统设置
            </h1>
            <div className="flex items-center space-x-4">
              {saveStatus === "success" && (
                <div className="flex items-center text-green-400">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  保存成功
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center text-red-400">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  保存失败
                </div>
              )}
              <Button onClick={handleSave} disabled={isSaving} className="bg-cyan-600 hover:bg-cyan-700">
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    保存设置
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/50 p-1 mb-6">
            <TabsTrigger value="store" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <Store className="h-4 w-4 mr-2" />
              门店设置
            </TabsTrigger>
            <TabsTrigger
              value="printers"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <Printer className="h-4 w-4 mr-2" />
              打印设置
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <CreditCard className="h-4 w-4 mr-2" />
              支付设置
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <Settings className="h-4 w-4 mr-2" />
              系统设置
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <Shield className="h-4 w-4 mr-2" />
              安全设置
            </TabsTrigger>
          </TabsList>

          {/* 门店设置标签页 */}
          <TabsContent value="store" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Store className="mr-2 h-5 w-5 text-cyan-500" />
                    基本信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">门店名称</Label>
                    <Input
                      value={storeSettings.name}
                      onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">门店地址</Label>
                    <Textarea
                      value={storeSettings.address}
                      onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">联系电话</Label>
                      <Input
                        value={storeSettings.phone}
                        onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                        className="bg-slate-800/50 border-slate-600 text-slate-100"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">邮箱地址</Label>
                      <Input
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                        className="bg-slate-800/50 border-slate-600 text-slate-100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-cyan-500" />
                    营业时间
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">开始营业</Label>
                      <Input
                        type="time"
                        value={storeSettings.businessHours.open}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            businessHours: { ...storeSettings.businessHours, open: e.target.value },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-slate-100"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">结束营业</Label>
                      <Input
                        type="time"
                        value={storeSettings.businessHours.close}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            businessHours: { ...storeSettings.businessHours, close: e.target.value },
                          })
                        }
                        className="bg-slate-800/50 border-slate-600 text-slate-100"
                      />
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">货币单位</Label>
                      <Select
                        value={storeSettings.currency}
                        onValueChange={(value) => setStoreSettings({ ...storeSettings, currency: value })}
                      >
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="CNY" className="text-slate-100">
                            人民币 (CNY)
                          </SelectItem>
                          <SelectItem value="USD" className="text-slate-100">
                            美元 (USD)
                          </SelectItem>
                          <SelectItem value="EUR" className="text-slate-100">
                            欧元 (EUR)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">时区</Label>
                      <Select
                        value={storeSettings.timezone}
                        onValueChange={(value) => setStoreSettings({ ...storeSettings, timezone: value })}
                      >
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="Asia/Shanghai" className="text-slate-100">
                            北京时间 (UTC+8)
                          </SelectItem>
                          <SelectItem value="Asia/Tokyo" className="text-slate-100">
                            东京时间 (UTC+9)
                          </SelectItem>
                          <SelectItem value="America/New_York" className="text-slate-100">
                            纽约时间 (UTC-5)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">系统语言</Label>
                      <Select
                        value={storeSettings.language}
                        onValueChange={(value) => setStoreSettings({ ...storeSettings, language: value })}
                      >
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="zh-CN" className="text-slate-100">
                            简体中文
                          </SelectItem>
                          <SelectItem value="zh-TW" className="text-slate-100">
                            繁体中文
                          </SelectItem>
                          <SelectItem value="en-US" className="text-slate-100">
                            English
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 打印设置标签页 */}
          <TabsContent value="printers" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Printer className="mr-2 h-5 w-5 text-cyan-500" />
                    打印机管理
                  </CardTitle>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Printer className="h-4 w-4 mr-2" />
                    添加打印机
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {printers.map((printer) => (
                    <div key={printer.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                          <Printer className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-slate-200 font-medium">{printer.name}</h3>
                            <Badge className={getPrinterTypeColor(printer.type)}>
                              {getPrinterTypeLabel(printer.type)}
                            </Badge>
                            {printer.isDefault && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">默认</Badge>
                            )}
                            <Badge
                              className={
                                printer.isActive
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                            >
                              {printer.isActive ? "在线" : "离线"}
                            </Badge>
                          </div>
                          <div className="text-slate-400 text-sm mt-1">
                            IP: {printer.ip}:{printer.port}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400">
                          测试打印
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-500/50 text-green-400">
                          编辑
                        </Button>
                        <Switch checked={printer.isActive} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 支付设置标签页 */}
          <TabsContent value="payment" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-cyan-500" />
                    支付方式配置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="text-slate-200 font-medium">现金支付</div>
                        <div className="text-slate-400 text-sm">传统现金收款</div>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.cash}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, cash: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-slate-200 font-medium">银行卡支付</div>
                        <div className="text-slate-400 text-sm">POS机刷卡支付</div>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.card}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, card: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-slate-200 font-medium">微信支付</div>
                        <div className="text-slate-400 text-sm">微信扫码支付</div>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.wechat}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, wechat: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-slate-200 font-medium">支付宝</div>
                        <div className="text-slate-400 text-sm">支付宝扫码支付</div>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.alipay}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, alipay: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="text-slate-200 font-medium">会员卡支付</div>
                        <div className="text-slate-400 text-sm">会员余额支付</div>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.memberCard}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, memberCard: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="text-slate-200 font-medium">挂账支付</div>
                        <div className="text-slate-400 text-sm">企业客户挂账</div>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.credit}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, credit: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-cyan-500" />
                    支付配置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">微信商户号</Label>
                    <Input placeholder="请输入微信商户号" className="bg-slate-800/50 border-slate-600 text-slate-100" />
                  </div>
                  <div>
                    <Label className="text-slate-300">支付宝应用ID</Label>
                    <Input
                      placeholder="请输入支付宝应用ID"
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">支付超时时间（分钟）</Label>
                    <Input
                      type="number"
                      defaultValue="15"
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">自动确认支付</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">支付成功语音提示</Label>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 系统设置标签页 */}
          <TabsContent value="system" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Database className="mr-2 h-5 w-5 text-cyan-500" />
                    数据管理
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">自动备份</div>
                      <div className="text-slate-400 text-sm">每日自动备份数据</div>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoBackup: checked })}
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">备份时间</Label>
                    <Input
                      type="time"
                      value={systemSettings.backupTime}
                      onChange={(e) => setSystemSettings({ ...systemSettings, backupTime: e.target.value })}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">数据保留天数</Label>
                    <Input
                      type="number"
                      value={systemSettings.dataRetention}
                      onChange={(e) => setSystemSettings({ ...systemSettings, dataRetention: Number(e.target.value) })}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div className="flex justify-between space-x-2">
                    <Button variant="outline" className="flex-1 border-blue-500/50 text-blue-400">
                      <Download className="h-4 w-4 mr-2" />
                      手动备份
                    </Button>
                    <Button variant="outline" className="flex-1 border-green-500/50 text-green-400">
                      <Upload className="h-4 w-4 mr-2" />
                      恢复数据
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-cyan-500" />
                    通知设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">系统通知</div>
                      <div className="text-slate-400 text-sm">启用系统消息通知</div>
                    </div>
                    <Switch
                      checked={systemSettings.enableNotifications}
                      onCheckedChange={(checked) =>
                        setSystemSettings({ ...systemSettings, enableNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">短信通知</div>
                      <div className="text-slate-400 text-sm">重要事件短信提醒</div>
                    </div>
                    <Switch
                      checked={systemSettings.enableSMS}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, enableSMS: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">邮件通知</div>
                      <div className="text-slate-400 text-sm">报表和异常邮件通知</div>
                    </div>
                    <Switch
                      checked={systemSettings.enableEmail}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, enableEmail: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Monitor className="mr-2 h-5 w-5 text-cyan-500" />
                    系统状态
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">调试模式</div>
                      <div className="text-slate-400 text-sm">开启详细日志记录</div>
                    </div>
                    <Switch
                      checked={systemSettings.debugMode}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, debugMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">维护模式</div>
                      <div className="text-slate-400 text-sm">系统维护时启用</div>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, maintenanceMode: checked })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">系统版本</span>
                      <span className="text-cyan-400">v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">数据库版本</span>
                      <span className="text-green-400">MySQL 8.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">最后更新</span>
                      <span className="text-purple-400">2024-01-15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Wifi className="mr-2 h-5 w-5 text-cyan-500" />
                    网络设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">WiFi名称</Label>
                    <Input
                      defaultValue="SmartBusiness_Guest"
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">WiFi密码</Label>
                    <Input
                      type="password"
                      defaultValue="12345678"
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">API服务器地址</Label>
                    <Input
                      defaultValue="https://api.smartbusiness.com"
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">启用HTTPS</Label>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 安全设置标签页 */}
          <TabsContent value="security" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-cyan-500" />
                    访问控制
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">强制密码策略</div>
                      <div className="text-slate-400 text-sm">要求复杂密码</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">双因素认证</div>
                      <div className="text-slate-400 text-sm">管理员登录需要验证码</div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">自动锁屏</div>
                      <div className="text-slate-400 text-sm">闲置时自动锁定</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <Label className="text-slate-300">锁屏时间（分钟）</Label>
                    <Input
                      type="number"
                      defaultValue="30"
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">密码有效期（天）</Label>
                    <Input
                      type="number"
                      defaultValue="90"
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <Info className="mr-2 h-5 w-5 text-cyan-500" />
                    操作日志
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">记录用户操作</div>
                      <div className="text-slate-400 text-sm">记录所有用户操作</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">记录登录日志</div>
                      <div className="text-slate-400 text-sm">记录登录和登出</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <Label className="text-slate-300">日志保留天数</Label>
                    <Input
                      type="number"
                      defaultValue="180"
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>

                  <Button variant="outline" className="w-full border-blue-500/50 text-blue-400">
                    <Eye className="h-4 w-4 mr-2" />
                    查看操作日志
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm col-span-full">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                    安全警告
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <div className="text-yellow-400 font-medium mb-2">重要安全提醒</div>
                        <ul className="text-slate-300 text-sm space-y-1">
                          <li>• 请定期更换管理员密码，建议使用强密码</li>
                          <li>• 启用双因素认证以提高账户安全性</li>
                          <li>• 定期检查操作日志，发现异常及时处理</li>
                          <li>• 不要在公共网络环境下进行敏感操作</li>
                          <li>• 及时更新系统版本，修复安全漏洞</li>
                        </ul>
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
