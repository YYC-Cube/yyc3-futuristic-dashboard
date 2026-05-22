"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ShoppingCart, Plus, Minus, X, CreditCard, Smartphone, Banknote } from "lucide-react"
import { useRoomStore } from "@/lib/stores/useRoomStore"
import { useOrderStore } from "@/lib/stores/useOrderStore"
import type { Product, OrderItem } from "@/lib/api/types"

interface POSSystemProps {
  roomId?: string
  onClose?: () => void
}

export default function POSSystem({ roomId, onClose }: POSSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<OrderItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const { selectedRoom } = useRoomStore()
  const { createOrder, addOrderItem } = useOrderStore()

  // 模拟商品数据
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "青岛啤酒",
        alias: "青岛啤酒330ml",
        unit: "瓶",
        originalPrice: 15,
        salePrice: 12,
        memberPrice: 10,
        categoryId: "beer",
        isGift: false,
        allowDiscount: true,
        isSaleProduct: true,
        isRecommended: true,
        isLowConsumption: true,
        showToConsumer: true,
        stock: 100,
        flavors: ["冰镇", "常温"],
      },
      {
        id: "2",
        name: "可口可乐",
        alias: "可口可乐330ml",
        unit: "瓶",
        originalPrice: 8,
        salePrice: 6,
        memberPrice: 5,
        categoryId: "drinks",
        isGift: false,
        allowDiscount: true,
        isSaleProduct: true,
        isRecommended: false,
        isLowConsumption: true,
        showToConsumer: true,
        stock: 200,
        flavors: ["冰镇", "常温"],
      },
      {
        id: "3",
        name: "薯片",
        alias: "乐事薯片",
        unit: "包",
        originalPrice: 12,
        salePrice: 10,
        memberPrice: 8,
        categoryId: "snacks",
        isGift: false,
        allowDiscount: true,
        isSaleProduct: true,
        isRecommended: false,
        isLowConsumption: false,
        showToConsumer: true,
        stock: 50,
      },
      {
        id: "4",
        name: "果盘",
        alias: "精美果盘",
        unit: "份",
        originalPrice: 68,
        salePrice: 58,
        memberPrice: 48,
        categoryId: "fruits",
        isGift: true,
        allowDiscount: false,
        isSaleProduct: true,
        isRecommended: true,
        isLowConsumption: true,
        showToConsumer: true,
        stock: 20,
      },
    ]
    setProducts(mockProducts)
  }, [])

  const categories = [
    { id: "all", name: "全部", count: products.length },
    { id: "beer", name: "啤酒", count: products.filter((p) => p.categoryId === "beer").length },
    { id: "drinks", name: "饮料", count: products.filter((p) => p.categoryId === "drinks").length },
    { id: "snacks", name: "小食", count: products.filter((p) => p.categoryId === "snacks").length },
    { id: "fruits", name: "果盘", count: products.filter((p) => p.categoryId === "fruits").length },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "全部" || product.categoryId === selectedCategory
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.alias?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item,
        ),
      )
    } else {
      const newItem: OrderItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.salePrice,
        totalPrice: product.salePrice,
        status: "pending",
      }
      setCart([...cart, newItem])
    }
  }

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== itemId))
    } else {
      setCart(
        cart.map((item) => (item.id === itemId ? { ...item, quantity, totalPrice: quantity * item.unitPrice } : item)),
      )
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0)
  }

  const handleCheckout = async (paymentMethod: string) => {
    if (!roomId || cart.length === 0) return

    setLoading(true)
    try {
      const orderData = {
        roomId,
        roomNumber: selectedRoom?.number || "",
        waiterId: "current-user-id", // 从用户状态获取
        waiterName: "当前用户", // 从用户状态获取
        orderType: "room_service" as const,
        status: "confirmed" as const,
        items: cart,
        subtotal: getCartTotal(),
        discount: 0,
        tax: 0,
        total: getCartTotal(),
        paymentStatus: "paid" as const,
        paymentMethod,
        notes: "",
      }

      await createOrder(orderData)
      setCart([])
      onClose?.()
    } catch (error) {
      // TODO: 添加用户提示
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-slate-900 text-white flex">
      {/* 左侧商品区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部搜索栏 */}
        <div className="bg-slate-800/50 border-b border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-cyan-400">点单收银</h1>
              {roomId && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">包厢: {selectedRoom?.number}</Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="搜索商品..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  <X className="h-4 w-4 mr-2" />
                  关闭
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="bg-slate-800/30 border-b border-slate-700/50 p-4">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.name
                    ? "bg-cyan-500 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* 商品网格 */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-slate-800/50 border-slate-700/50 cursor-pointer hover:bg-slate-700/50 transition-colors"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-slate-700/30 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-slate-500 text-sm">图片</span>
                  </div>

                  <h3 className="font-medium text-white mb-1 truncate">{product.name}</h3>
                  <p className="text-xs text-slate-400 mb-2 truncate">{product.alias}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-cyan-400">¥{product.salePrice}</span>
                      {product.memberPrice && (
                        <div className="text-xs text-green-400">会员价: ¥{product.memberPrice}</div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      {product.isRecommended && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">推荐</Badge>
                      )}
                      {product.isGift && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-xs">赠品</Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    库存: {product.stock} {product.unit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧购物车 */}
      <div className="w-96 bg-slate-800/50 border-l border-slate-700/50 flex flex-col">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">购物车</h2>
            <Badge className="bg-cyan-500 text-white">{cart.length} 项</Badge>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>购物车为空</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <Card key={item.id} className="bg-slate-700/30 border-slate-600/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white truncate flex-1">{item.productName}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 text-slate-400 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 border-slate-600"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 border-slate-600"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-slate-400">
                          ¥{item.unitPrice} × {item.quantity}
                        </div>
                        <div className="font-bold text-cyan-400">¥{item.totalPrice}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 结账区域 */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-700/50">
            <div className="mb-4">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>总计:</span>
                <span className="text-cyan-400">¥{getCartTotal()}</span>
              </div>
            </div>

            <Tabs defaultValue="cash" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="cash">现金</TabsTrigger>
                <TabsTrigger value="card">刷卡</TabsTrigger>
                <TabsTrigger value="mobile">扫码</TabsTrigger>
              </TabsList>

              <TabsContent value="cash" className="mt-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleCheckout("cash")}
                  disabled={loading}
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  现金支付
                </Button>
              </TabsContent>

              <TabsContent value="card" className="mt-4">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleCheckout("card")}
                  disabled={loading}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  刷卡支付
                </Button>
              </TabsContent>

              <TabsContent value="mobile" className="mt-4">
                <div className="space-y-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleCheckout("wechat")}
                    disabled={loading}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    微信支付
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleCheckout("alipay")}
                    disabled={loading}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    支付宝
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
