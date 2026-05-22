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
import { Switch } from "@/components/ui/switch"
import {
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Star,
  Upload,
  Download,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scan,
  Tag,
  TrendingUp,
  Warehouse,
  ImageIcon,
} from "lucide-react"
import type { Product } from "@/lib/api/types"

interface ProductCategory {
  id: string
  name: string
  displayOrder: number
  showToConsumer: boolean
  productCount: number
}

interface ProductFlavor {
  id: string
  name: string
  productIds: string[]
}

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState("products")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddFlavorOpen, setIsAddFlavorOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // 商品数据
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      barcode: "1234567890123",
      name: "青岛啤酒",
      alias: "青啤",
      unit: "瓶",
      originalPrice: 15.0,
      salePrice: 12.0,
      memberPrice: 10.0,
      categoryId: "beer",
      isGift: false,
      allowDiscount: true,
      isSaleProduct: true,
      isRecommended: true,
      isLowConsumption: true,
      showToConsumer: true,
      image: "/placeholder.svg?height=100&width=100&text=青岛啤酒",
      flavors: ["冰镇", "常温"],
      stock: 150,
    },
    {
      id: "2",
      barcode: "2345678901234",
      name: "茅台酒",
      alias: "茅台",
      unit: "瓶",
      originalPrice: 2800.0,
      salePrice: 2500.0,
      memberPrice: 2300.0,
      categoryId: "liquor",
      isGift: false,
      allowDiscount: false,
      isSaleProduct: true,
      isRecommended: true,
      isLowConsumption: true,
      showToConsumer: true,
      image: "/placeholder.svg?height=100&width=100&text=茅台酒",
      flavors: [],
      stock: 25,
    },
    {
      id: "3",
      barcode: "3456789012345",
      name: "果盘",
      alias: "水果拼盘",
      unit: "份",
      originalPrice: 88.0,
      salePrice: 68.0,
      memberPrice: 58.0,
      categoryId: "snacks",
      isGift: true,
      allowDiscount: true,
      isSaleProduct: true,
      isRecommended: false,
      isLowConsumption: false,
      showToConsumer: true,
      image: "/placeholder.svg?height=100&width=100&text=果盘",
      flavors: ["精装", "普通"],
      stock: 0,
    },
  ])

  // 商品分类数据
  const [categories, setCategories] = useState<ProductCategory[]>([
    { id: "beer", name: "啤酒类", displayOrder: 1, showToConsumer: true, productCount: 15 },
    { id: "liquor", name: "白酒类", displayOrder: 2, showToConsumer: true, productCount: 8 },
    { id: "wine", name: "红酒类", displayOrder: 3, showToConsumer: true, productCount: 12 },
    { id: "drinks", name: "饮料类", displayOrder: 4, showToConsumer: true, productCount: 25 },
    { id: "snacks", name: "小食类", displayOrder: 5, showToConsumer: true, productCount: 18 },
    { id: "fruits", name: "果盘类", displayOrder: 6, showToConsumer: true, productCount: 6 },
  ])

  // 商品口味数据
  const [flavors, setFlavors] = useState<ProductFlavor[]>([
    { id: "1", name: "冰镇", productIds: ["1", "4", "5"] },
    { id: "2", name: "常温", productIds: ["1", "2"] },
    { id: "3", name: "精装", productIds: ["3", "6"] },
    { id: "4", name: "普通", productIds: ["3", "7"] },
    { id: "5", name: "微辣", productIds: ["8", "9"] },
    { id: "6", name: "中辣", productIds: ["8", "9"] },
    { id: "7", name: "特辣", productIds: ["8", "9"] },
  ])

  // 新商品表单数据
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    alias: "",
    unit: "",
    originalPrice: 0,
    salePrice: 0,
    memberPrice: 0,
    categoryId: "",
    isGift: false,
    allowDiscount: true,
    isSaleProduct: true,
    isRecommended: false,
    isLowConsumption: true,
    showToConsumer: true,
    flavors: [],
  })

  // 过滤商品
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm)
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 获取分类名称
  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "未分类"
  }

  // 获取库存状态
  const getStockStatus = (stock = 0) => {
    if (stock === 0) return { status: "out", color: "text-red-400", bg: "bg-red-500/20", text: "缺货" }
    if (stock < 10) return { status: "low", color: "text-yellow-400", bg: "bg-yellow-500/20", text: "库存不足" }
    return { status: "normal", color: "text-green-400", bg: "bg-green-500/20", text: "库存充足" }
  }

  // 添加商品
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.salePrice) {
      const product: Product = {
        id: Date.now().toString(),
        barcode: newProduct.barcode || "",
        name: newProduct.name,
        alias: newProduct.alias || newProduct.name,
        unit: newProduct.unit || "个",
        originalPrice: newProduct.originalPrice || newProduct.salePrice || 0,
        salePrice: newProduct.salePrice || 0,
        memberPrice: newProduct.memberPrice || newProduct.salePrice || 0,
        categoryId: newProduct.categoryId || "",
        isGift: newProduct.isGift || false,
        allowDiscount: newProduct.allowDiscount !== false,
        isSaleProduct: newProduct.isSaleProduct !== false,
        isRecommended: newProduct.isRecommended || false,
        isLowConsumption: newProduct.isLowConsumption !== false,
        showToConsumer: newProduct.showToConsumer !== false,
        flavors: newProduct.flavors || [],
        stock: 0,
      }
      setProducts([...products, product])
      setNewProduct({
        name: "",
        alias: "",
        unit: "",
        originalPrice: 0,
        salePrice: 0,
        memberPrice: 0,
        categoryId: "",
        isGift: false,
        allowDiscount: true,
        isSaleProduct: true,
        isRecommended: false,
        isLowConsumption: true,
        showToConsumer: true,
        flavors: [],
      })
      setIsAddProductOpen(false)
    }
  }

  // 删除商品
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  // 统计数据
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.isSaleProduct).length,
    outOfStock: products.filter((p) => (p.stock || 0) === 0).length,
    lowStock: products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) < 10).length,
    totalValue: products.reduce((sum, p) => sum + p.salePrice * (p.stock || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              商品管理系统
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Download className="h-4 w-4 mr-2" />
                导出数据
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Upload className="h-4 w-4 mr-2" />
                批量导入
              </Button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{stats.totalProducts}</div>
                    <div className="text-sm text-slate-400">商品总数</div>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{stats.activeProducts}</div>
                    <div className="text-sm text-slate-400">在售商品</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
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
                    <div className="text-2xl font-bold text-purple-400">¥{stats.totalValue.toFixed(0)}</div>
                    <div className="text-sm text-slate-400">库存价值</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 主要内容区域 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/50 p-1 mb-6">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              商品列表
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <Tag className="h-4 w-4 mr-2" />
              商品分类
            </TabsTrigger>
            <TabsTrigger value="flavors" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <Star className="h-4 w-4 mr-2" />
              商品口味
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              销售分析
            </TabsTrigger>
          </TabsList>

          {/* 商品列表标签页 */}
          <TabsContent value="products" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5 text-cyan-500" />
                    商品列表管理
                  </CardTitle>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="h-4 w-4 mr-2" />
                        新增商品
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-slate-100">新增商品</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* 基本信息 */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-slate-200">基本信息</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-slate-300">商品名称 *</Label>
                              <Input
                                placeholder="请输入商品名称"
                                value={newProduct.name || ""}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="bg-slate-800/50 border-slate-600 text-slate-100"
                              />
                            </div>
                            <div>
                              <Label className="text-slate-300">商品别名</Label>
                              <Input
                                placeholder="请输入商品别名"
                                value={newProduct.alias || ""}
                                onChange={(e) => setNewProduct({ ...newProduct, alias: e.target.value })}
                                className="bg-slate-800/50 border-slate-600 text-slate-100"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-slate-300">条形码</Label>
                              <div className="flex space-x-2">
                                <Input
                                  placeholder="请输入或扫描条形码"
                                  value={newProduct.barcode || ""}
                                  onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                                  className="bg-slate-800/50 border-slate-600 text-slate-100"
                                />
                                <Button size="sm" variant="outline" className="border-slate-600">
                                  <Scan className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-slate-300">商品单位</Label>
                              <Select
                                value={newProduct.unit || ""}
                                onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                              >
                                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                                  <SelectValue placeholder="选择单位" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-600">
                                  <SelectItem value="个" className="text-slate-100">
                                    个
                                  </SelectItem>
                                  <SelectItem value="瓶" className="text-slate-100">
                                    瓶
                                  </SelectItem>
                                  <SelectItem value="份" className="text-slate-100">
                                    份
                                  </SelectItem>
                                  <SelectItem value="盒" className="text-slate-100">
                                    盒
                                  </SelectItem>
                                  <SelectItem value="包" className="text-slate-100">
                                    包
                                  </SelectItem>
                                  <SelectItem value="斤" className="text-slate-100">
                                    斤
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-slate-300">商品分类 *</Label>
                              <Select
                                value={newProduct.categoryId || ""}
                                onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                              >
                                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                                  <SelectValue placeholder="选择分类" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-600">
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id} className="text-slate-100">
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* 价格设置 */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-slate-200">价格设置</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-slate-300">原价</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={newProduct.originalPrice || ""}
                                onChange={(e) =>
                                  setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })
                                }
                                className="bg-slate-800/50 border-slate-600 text-slate-100"
                              />
                            </div>
                            <div>
                              <Label className="text-slate-300">优惠价 *</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={newProduct.salePrice || ""}
                                onChange={(e) => setNewProduct({ ...newProduct, salePrice: Number(e.target.value) })}
                                className="bg-slate-800/50 border-slate-600 text-slate-100"
                              />
                            </div>
                            <div>
                              <Label className="text-slate-300">会员价</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={newProduct.memberPrice || ""}
                                onChange={(e) => setNewProduct({ ...newProduct, memberPrice: Number(e.target.value) })}
                                className="bg-slate-800/50 border-slate-600 text-slate-100"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 商品属性 */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-slate-200">商品属性</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-slate-300">赠送商品</Label>
                              <Switch
                                checked={newProduct.isGift || false}
                                onCheckedChange={(checked) => setNewProduct({ ...newProduct, isGift: checked })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-slate-300">允许打折</Label>
                              <Switch
                                checked={newProduct.allowDiscount !== false}
                                onCheckedChange={(checked) => setNewProduct({ ...newProduct, allowDiscount: checked })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-slate-300">销售商品</Label>
                              <Switch
                                checked={newProduct.isSaleProduct !== false}
                                onCheckedChange={(checked) => setNewProduct({ ...newProduct, isSaleProduct: checked })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-slate-300">推荐商品</Label>
                              <Switch
                                checked={newProduct.isRecommended || false}
                                onCheckedChange={(checked) => setNewProduct({ ...newProduct, isRecommended: checked })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-slate-300">属于低消</Label>
                              <Switch
                                checked={newProduct.isLowConsumption !== false}
                                onCheckedChange={(checked) =>
                                  setNewProduct({ ...newProduct, isLowConsumption: checked })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-slate-300">消费者端显示</Label>
                              <Switch
                                checked={newProduct.showToConsumer !== false}
                                onCheckedChange={(checked) => setNewProduct({ ...newProduct, showToConsumer: checked })}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsAddProductOpen(false)}
                            className="border-slate-600 text-slate-300"
                          >
                            取消
                          </Button>
                          <Button onClick={handleAddProduct} className="bg-cyan-600 hover:bg-cyan-700">
                            确认添加
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* 搜索和筛选 */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="搜索商品名称、别名或条形码..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-slate-100">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all" className="text-slate-100">
                        全部分类
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-slate-100">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent>
                {/* 商品列表 */}
                <div className="space-y-4">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock)
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                            {product.image ? (
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <ImageIcon className="h-8 w-8 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-slate-200 font-medium">{product.name}</h3>
                              {product.alias && product.alias !== product.name && (
                                <span className="text-slate-400 text-sm">({product.alias})</span>
                              )}
                              {product.isRecommended && (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">推荐</Badge>
                              )}
                              {product.isGift && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">赠品</Badge>
                              )}
                              {!product.isSaleProduct && (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">停售</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-slate-400 text-sm">
                                分类: {getCategoryName(product.categoryId)}
                              </span>
                              <span className="text-slate-400 text-sm">条码: {product.barcode || "无"}</span>
                              <span className="text-slate-400 text-sm">单位: {product.unit}</span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-slate-300">
                                售价: <span className="text-cyan-400 font-medium">¥{product.salePrice}</span>
                              </span>
                              {product.memberPrice && product.memberPrice !== product.salePrice && (
                                <span className="text-slate-300">
                                  会员价: <span className="text-purple-400 font-medium">¥{product.memberPrice}</span>
                                </span>
                              )}
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-400 text-sm">库存:</span>
                                <Badge className={`${stockStatus.bg} ${stockStatus.color} border-0`}>
                                  {product.stock || 0} {product.unit}
                                </Badge>
                              </div>
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                          >
                            <Warehouse className="h-3 w-3 mr-1" />
                            库存
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            删除
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <div className="text-slate-400">暂无商品数据</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 商品分类标签页 */}
          <TabsContent value="categories" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-cyan-500" />
                    商品分类管理
                  </CardTitle>
                  <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="h-4 w-4 mr-2" />
                        新增分类
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-slate-100">新增商品分类</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-300">分类名称</Label>
                          <Input
                            placeholder="请输入分类名称"
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">显示顺序</Label>
                          <Input
                            type="number"
                            placeholder="数字越大显示越靠前"
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-300">消费者端显示</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsAddCategoryOpen(false)}
                            className="border-slate-600 text-slate-300"
                          >
                            取消
                          </Button>
                          <Button className="bg-cyan-600 hover:bg-cyan-700">确认添加</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                          <Tag className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-slate-200 font-medium">{category.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-slate-400 text-sm">显示顺序: {category.displayOrder}</span>
                            <span className="text-slate-400 text-sm">商品数量: {category.productCount}</span>
                            <Badge
                              className={
                                category.showToConsumer
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                            >
                              {category.showToConsumer ? "显示" : "隐藏"}
                            </Badge>
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 商品口味标签页 */}
          <TabsContent value="flavors" className="mt-0">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Star className="mr-2 h-5 w-5 text-cyan-500" />
                    商品口味管理
                  </CardTitle>
                  <Dialog open={isAddFlavorOpen} onOpenChange={setIsAddFlavorOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="h-4 w-4 mr-2" />
                        新增口味
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-slate-100">新增商品口味</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-300">口味名称</Label>
                          <Input
                            placeholder="请输入口味名称"
                            className="bg-slate-800/50 border-slate-600 text-slate-100"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsAddFlavorOpen(false)}
                            className="border-slate-600 text-slate-300"
                          >
                            取消
                          </Button>
                          <Button className="bg-cyan-600 hover:bg-cyan-700">确认添加</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flavors.map((flavor) => (
                    <div
                      key={flavor.id}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                          <Star className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="text-slate-200 font-medium">{flavor.name}</h3>
                          <div className="text-slate-400 text-sm mt-1">应用商品: {flavor.productIds.length} 个</div>
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 销售分析标签页 */}
          <TabsContent value="analytics" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-cyan-500" />
                    热销商品排行
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0
                                ? "bg-yellow-500/20 text-yellow-400"
                                : index === 1
                                  ? "bg-gray-500/20 text-gray-400"
                                  : index === 2
                                    ? "bg-orange-500/20 text-orange-400"
                                    : "bg-slate-700/50 text-slate-400"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-slate-200 font-medium">{product.name}</div>
                            <div className="text-slate-400 text-sm">¥{product.salePrice}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-medium">{Math.floor(Math.random() * 100) + 50}</div>
                          <div className="text-slate-400 text-sm">销量</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-cyan-500" />
                    分类销售占比
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.slice(0, 6).map((category, index) => {
                      const percentage = Math.floor(Math.random() * 30) + 10
                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-200">{category.name}</span>
                            <span className="text-cyan-400">{percentage}%</span>
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
