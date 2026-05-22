"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Play, Pause, Square, BrushIcon as Broom, ShoppingCart, Phone } from "lucide-react"

interface RoomModalData {
  id: string
  number: string
  type?: string
  status?: string
  capacity?: number
  currentGuests?: number
  startTime?: Date
  amount?: number
  unpaidAmount?: number
  features?: string[]
}

interface RoomDetailModalProps {
  room: RoomModalData | null
  isOpen: boolean
  onClose: () => void
  onAction: (action: string) => void
}

export default function RoomDetailModal({ room, isOpen, onClose, onAction }: RoomDetailModalProps) {
  if (!isOpen || !room) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-slate-900 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700">
          <CardTitle className="text-xl text-white">
            包厢 {room.number} - {room.features?.[0]}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="status">状态信息</TabsTrigger>
              <TabsTrigger value="operations">快速操作</TabsTrigger>
              <TabsTrigger value="orders">订单管理</TabsTrigger>
              <TabsTrigger value="settings">包厢设置</TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">基本信息</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">包厢号:</span>
                        <span className="text-white">{room.number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">包厢类型:</span>
                        <span className="text-white">{room.features?.[1] || "标准包"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">容纳人数:</span>
                        <span className="text-white">{room.capacity}人</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">当前状态:</span>
                        <Badge
                          className={`${
                            room.status === "available"
                              ? "bg-green-500"
                              : room.status === "occupied"
                                ? "bg-orange-500"
                                : room.status === "cleaning"
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                          }`}
                        >
                          {room.status === "available"
                            ? "空闲"
                            : room.status === "occupied"
                              ? "消费中"
                              : room.status === "cleaning"
                                ? "清洁中"
                                : "其他"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">消费信息</h3>
                    <div className="space-y-2 text-sm">
                      {room.startTime && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-400">开始时间:</span>
                            <span className="text-white">{room.startTime.toLocaleTimeString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">消费时长:</span>
                            <span className="text-white">
                              {Math.floor((Date.now() - room.startTime.getTime()) / (1000 * 60 * 60))}小时
                              {Math.floor(((Date.now() - room.startTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60))}
                              分钟
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">当前人数:</span>
                        <span className="text-white">{room.currentGuests || 0}人</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">消费金额:</span>
                        <span className="text-green-400">¥{room.amount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">未收款:</span>
                        <span className="text-red-400">¥{room.unpaidAmount || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="operations" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                  onClick={() => onAction("start")}
                >
                  <Play className="h-6 w-6 mb-2" />
                  开房
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700"
                  onClick={() => onAction("pause")}
                >
                  <Pause className="h-6 w-6 mb-2" />
                  暂停
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center bg-red-600 hover:bg-red-700"
                  onClick={() => onAction("checkout")}
                >
                  <Square className="h-6 w-6 mb-2" />
                  结账
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700"
                  onClick={() => onAction("clean")}
                >
                  <Broom className="h-6 w-6 mb-2" />
                  清扫
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700"
                  onClick={() => onAction("order")}
                >
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  点单
                </Button>

                <Button
                  className="h-20 flex flex-col items-center justify-center bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => onAction("call")}
                >
                  <Phone className="h-6 w-6 mb-2" />
                  呼叫
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">当前订单</h3>
                  <div className="text-slate-400 text-center py-8">暂无订单信息</div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">包厢设置</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">自动清扫</span>
                      <Button variant="outline" size="sm">
                        设置
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">价格策略</span>
                      <Button variant="outline" size="sm">
                        设置
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">服务配置</span>
                      <Button variant="outline" size="sm">
                        设置
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
