"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Plus, Edit, Trash2, UserPlus, Search, Building, MoreHorizontal } from "lucide-react"

interface EmployeeGroup {
  id: string
  store: string
  name: string
  memberCount: number
  description?: string
}

interface Employee {
  id: string
  name: string
  position: string
  groupId: string
}

export default function GroupManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStore, setSelectedStore] = useState("时代星光")
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false)
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<EmployeeGroup | null>(null)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")

  const [groups, setGroups] = useState<EmployeeGroup[]>([
    { id: "1", store: "时代星光", name: "楼面部", memberCount: 9, description: "负责包厢服务和客户接待" },
    { id: "2", store: "时代星光", name: "助理部", memberCount: 19, description: "协助各部门日常运营工作" },
    { id: "3", store: "时代星光", name: "销售部", memberCount: 10, description: "负责客户开发和维护" },
    { id: "4", store: "时代星光", name: "前厅部", memberCount: 1, description: "前台接待和客户服务" },
    { id: "5", store: "时代星光", name: "资源部", memberCount: 3, description: "人力资源和行政管理" },
    { id: "6", store: "时代星光", name: "出品部", memberCount: 2, description: "产品制作和质量控制" },
    { id: "7", store: "时代星光", name: "财务部", memberCount: 1, description: "财务管理和会计核算" },
    { id: "8", store: "时代星光", name: "总监级", memberCount: 0, description: "高级管理层" },
    { id: "9", store: "时代星光", name: "副总级", memberCount: 5, description: "副总经理级别管理" },
    { id: "10", store: "时代星光", name: "GM", memberCount: 1, description: "总经理" },
  ])

  const stores = ["时代星光", "皇家国际", "丽都国际", "钱柜KTV"]

  const filteredGroups = groups.filter(
    (group) => group.store === selectedStore && group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: EmployeeGroup = {
        id: Date.now().toString(),
        store: selectedStore,
        name: newGroupName.trim(),
        memberCount: 0,
        description: newGroupDescription.trim(),
      }
      setGroups([...groups, newGroup])
      setNewGroupName("")
      setNewGroupDescription("")
      setIsAddGroupOpen(false)
    }
  }

  const handleEditGroup = () => {
    if (editingGroup && newGroupName.trim()) {
      setGroups(
        groups.map((group) =>
          group.id === editingGroup.id
            ? { ...group, name: newGroupName.trim(), description: newGroupDescription.trim() }
            : group,
        ),
      )
      setEditingGroup(null)
      setNewGroupName("")
      setNewGroupDescription("")
      setIsEditGroupOpen(false)
    }
  }

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter((group) => group.id !== groupId))
  }

  const openEditDialog = (group: EmployeeGroup) => {
    setEditingGroup(group)
    setNewGroupName(group.name)
    setNewGroupDescription(group.description || "")
    setIsEditGroupOpen(true)
  }

  const getTotalMembers = () => {
    return filteredGroups.reduce((total, group) => total + group.memberCount, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              员工组别管理
            </h1>
            <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  <Plus className="h-4 w-4 mr-2" />
                  新增组别
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-slate-100">新增员工组别</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">组别名称</Label>
                    <Input
                      placeholder="请输入组别名称"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">组别描述</Label>
                    <Input
                      placeholder="请输入组别描述"
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddGroupOpen(false)}
                      className="border-slate-600 text-slate-300"
                    >
                      取消
                    </Button>
                    <Button onClick={handleAddGroup} className="bg-cyan-600 hover:bg-cyan-700">
                      确认添加
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="搜索组别名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100"
              />
            </div>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-slate-100">
                <Building className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {stores.map((store) => (
                  <SelectItem key={store} value={store} className="text-slate-100">
                    {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{filteredGroups.length}</div>
                  <div className="text-sm text-slate-400">组别总数</div>
                </div>
                <Users className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-400">{getTotalMembers()}</div>
                  <div className="text-sm text-slate-400">员工总数</div>
                </div>
                <UserPlus className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(getTotalMembers() / filteredGroups.length) || 0}
                  </div>
                  <div className="text-sm text-slate-400">平均人数</div>
                </div>
                <MoreHorizontal className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-400">{selectedStore}</div>
                  <div className="text-sm text-slate-400">当前门店</div>
                </div>
                <Building className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 组别列表 */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center">
              <Users className="mr-2 h-5 w-5 text-cyan-500" />
              {selectedStore} - 员工组别列表
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 表格头部 */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-800/50 rounded-lg mb-4 text-sm font-medium text-slate-300">
              <div className="col-span-2">门店</div>
              <div className="col-span-2">组别名称</div>
              <div className="col-span-1">数量</div>
              <div className="col-span-4">描述</div>
              <div className="col-span-3">操作</div>
            </div>

            {/* 表格内容 */}
            <div className="space-y-2">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className="grid grid-cols-12 gap-4 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors"
                >
                  <div className="col-span-2 text-slate-200">{group.store}</div>
                  <div className="col-span-2 text-slate-200 font-medium">{group.name}</div>
                  <div className="col-span-1">
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                      {group.memberCount} 人
                    </Badge>
                  </div>
                  <div className="col-span-4 text-slate-400 text-sm">{group.description}</div>
                  <div className="col-span-3 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(group)}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      修改
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteGroup(group.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      删除
                    </Button>
                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                      <UserPlus className="h-3 w-3 mr-1" />
                      员工增减
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <div className="text-slate-400">暂无组别数据</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 编辑组别对话框 */}
        <Dialog open={isEditGroupOpen} onOpenChange={setIsEditGroupOpen}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-100">编辑员工组别</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">组别名称</Label>
                <Input
                  placeholder="请输入组别名称"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <Label className="text-slate-300">组别描述</Label>
                <Input
                  placeholder="请输入组别描述"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-slate-100"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditGroupOpen(false)}
                  className="border-slate-600 text-slate-300"
                >
                  取消
                </Button>
                <Button onClick={handleEditGroup} className="bg-cyan-600 hover:bg-cyan-700">
                  确认修改
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
