// API 客户端，包含模拟数据用于开发和演示
import type { ApiResponse, Employee, Room, Order, OrderItem, Product, Member, Inventory, SalesReport } from "@/lib/api/types"

const mockData = {
  rooms: [
    {
      id: "room-001",
      number: "101",
      type: "vip" as const,
      area: "VIP区",
      status: "available" as const,
      capacity: 8,
      hourlyRate: 200,
      memberHourlyRate: 168,
      minimumConsumption: 500,
      memberMinimumConsumption: 400,
      features: ["KTV", "投影", "酒柜"],
      orderId: undefined,
      customerId: undefined,
      waiterId: undefined,
    },
    {
      id: "room-002",
      number: "201",
      type: "medium" as const,
      area: "中包区",
      status: "occupied" as const,
      capacity: 6,
      hourlyRate: 150,
      memberHourlyRate: 128,
      minimumConsumption: 300,
      memberMinimumConsumption: 250,
      features: ["KTV", "投影"],
      currentGuests: 4,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      amount: 380,
      unpaidAmount: 380,
      orderId: "order-001",
      customerId: "member-001",
      waiterId: "emp-001",
    },
  ] satisfies Room[],

  products: [
    {
      id: "prod-001",
      barcode: "123456789",
      name: "青岛啤酒",
      alias: "青啤",
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
      image: "/placeholder.svg?height=100&width=100&text=青岛啤酒",
      flavors: ["冰镇", "常温"],
      stock: 100,
    },
    {
      id: "prod-002",
      barcode: "987654321",
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
      image: "/placeholder.svg?height=100&width=100&text=果盘",
      stock: 50,
    },
  ] satisfies Product[],

  members: [
    {
      id: "member-001",
      memberNumber: "M001",
      name: "张三",
      phone: "13800138000",
      level: "VIP",
      points: 1500,
      balance: 500,
      totalConsumption: 5000,
      lastVisit: "2024-12-08",
    },
    {
      id: "member-002",
      memberNumber: "M002",
      name: "李四",
      phone: "13900139000",
      level: "Gold",
      points: 800,
      balance: 200,
      totalConsumption: 2000,
      lastVisit: "2024-12-07",
    },
  ] satisfies Member[],

  employees: [
    {
      id: "emp-001",
      employeeNumber: "EMP001",
      name: "王经理",
      phone: "13700137000",
      position: "manager",
      department: "管理部",
      isActive: true,
      permissions: ["all"],
      role: "manager" as const,
      createdAt: "2023-01-15",
    },
  ] satisfies Employee[],
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private isClient: boolean

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.isClient = typeof window !== "undefined"

    if (this.isClient) {
      try {
        this.token = localStorage.getItem("yyc3_auth_token")
      } catch {
        this.token = null
      }
    }
  }

  private async mockRequest<T>(data: T, delay = 500): Promise<ApiResponse<T>> {
    await new Promise((resolve) => setTimeout(resolve, delay))

    return {
      code: 200,
      message: "操作成功",
      data,
      timestamp: new Date().toISOString(),
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // 在开发环境中使用模拟数据
    if (process.env.NODE_ENV === "development" || !this.baseUrl.startsWith("http")) {
      return this.handleMockRequest<T>(endpoint, options)
    }

    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (response.status === 401) {
        this.handleUnauthorized()
        return this.handleMockRequest<T>(endpoint, options)
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      // 降级到模拟数据
      return this.handleMockRequest<T>(endpoint, options)
    }
  }

  private handleUnauthorized() {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("yyc3_auth_token")
        localStorage.removeItem("yyc3_auth_user")
      } catch {}
      window.location.href = "/login"
    }
  }

  private async handleMockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // 根据端点返回相应的模拟数据
    if (endpoint === "/rooms") {
      return this.mockRequest(mockData.rooms as T)
    }

    if (endpoint.startsWith("/rooms/")) {
      const roomId = endpoint.split("/")[2]
      const room = mockData.rooms.find((r) => r.id === roomId)
      return this.mockRequest(room as T)
    }

    if (endpoint === "/products") {
      return this.mockRequest({ products: mockData.products, total: mockData.products.length } as T)
    }

    if (endpoint === "/members") {
      return this.mockRequest({ members: mockData.members, total: mockData.members.length } as T)
    }

    if (endpoint === "/employees") {
      return this.mockRequest(mockData.employees as T)
    }

    if (endpoint === "/inventory") {
      const inventory = mockData.products.map((p) => ({
        id: `inv-${p.id}`,
        productId: p.id,
        productName: p.name,
        warehouseId: "warehouse-001",
        warehouseName: "主仓库",
        quantity: p.stock,
        minStock: 10,
        maxStock: 200,
        lastUpdated: new Date().toISOString(),
      }))
      return this.mockRequest(inventory as T)
    }

    // 默认返回成功响应
    return this.mockRequest({ success: true } as T)
  }

  // 认证相关
  async login(username: string, password: string) {
    const mockToken = "mock-jwt-token-" + Date.now()
    const mockUser = mockData.employees[0]

    if (this.isClient) {
      try {
        localStorage.setItem("yyc3_auth_token", mockToken)
      } catch (error) {
        // token save failed
      }
    }

    this.token = mockToken

    return this.mockRequest({ token: mockToken, user: mockUser })
  }

  async logout() {
    if (this.isClient) {
      try {
        localStorage.removeItem("yyc3_auth_token")
      } catch (error) {
        // token remove failed
      }
    }
    this.token = null
    return this.mockRequest({ success: true })
  }

  // 包厢管理 API
  async getRooms(): Promise<ApiResponse<Room[]>> {
    return this.request("/rooms")
  }

  async getRoomById(id: string): Promise<ApiResponse<Room>> {
    return this.request(`/rooms/${id}`)
  }

  async updateRoomStatus(id: string, status: string, data?: Record<string, unknown>): Promise<ApiResponse<Room>> {
    return this.request(`/rooms/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, ...data }),
    })
  }

  async startRoom(roomId: string, customerId?: string, packageId?: string): Promise<ApiResponse<Order>> {
    const mockOrder: Order = {
      id: `order-${Date.now()}`,
      roomId,
      roomNumber: "",
      customerId,
      customerName: undefined,
      waiterId: "emp-001",
      waiterName: "王经理",
      orderType: "room_service",
      status: "confirmed",
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      paymentStatus: "unpaid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return this.mockRequest(mockOrder)
  }

  async checkoutRoom(roomId: string): Promise<ApiResponse<{ orderId: string; total: number }>> {
    return this.mockRequest({ orderId: `order-${Date.now()}`, total: 299.5 })
  }

  // 订单管理 API
  async getOrders(params?: Record<string, unknown>): Promise<ApiResponse<{ orders: Order[]; total: number }>> {
    return this.request("/orders")
  }

  async createOrder(orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  async updateOrder(id: string, orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    })
  }

  async addOrderItem(orderId: string, item: Omit<OrderItem, "id">): Promise<ApiResponse<OrderItem>> {
    return this.request(`/orders/${orderId}/items`, {
      method: "POST",
      body: JSON.stringify(item),
    })
  }

  // 商品管理 API
  async getProducts(params?: Record<string, unknown>): Promise<ApiResponse<{ products: Product[]; total: number }>> {
    return this.request("/products")
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData: Omit<Product, "id">): Promise<ApiResponse<Product>> {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  }

  // 员工管理 API
  async getEmployees(): Promise<ApiResponse<Employee[]>> {
    return this.request("/employees")
  }

  async createEmployee(employeeData: Omit<Employee, "id">): Promise<ApiResponse<Employee>> {
    return this.request("/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    })
  }

  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<ApiResponse<Employee>> {
    return this.request(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
    })
  }

  // 会员管理 API
  async getMembers(params?: Record<string, unknown>): Promise<ApiResponse<{ members: Member[]; total: number }>> {
    return this.request("/members")
  }

  async getMemberByPhone(phone: string): Promise<ApiResponse<Member | null>> {
    const member = mockData.members.find((m) => m.phone === phone) ?? null
    return this.mockRequest(member)
  }

  // 库存管理 API
  async getInventory(warehouseId?: string): Promise<ApiResponse<Inventory[]>> {
    return this.request("/inventory")
  }

  async updateInventory(productId: string, warehouseId: string, quantity: number): Promise<ApiResponse<Inventory>> {
    return this.request("/inventory/update", {
      method: "POST",
      body: JSON.stringify({ productId, warehouseId, quantity }),
    })
  }

  // 报表 API
  async getSalesReport(startDate: string, endDate: string): Promise<ApiResponse<SalesReport>> {
    const mockReport: SalesReport = {
      date: startDate,
      totalRevenue: 15680.5,
      totalOrders: 45,
      averageOrderValue: 348.5,
      topProducts: [
        { productId: "prod-001", productName: "青岛啤酒", quantity: 156, revenue: 1872 },
        { productId: "prod-002", productName: "果盘", quantity: 45, revenue: 2610 },
      ],
      hourlyBreakdown: Array.from({ length: 14 }, (_, i) => ({
        hour: i + 10,
        revenue: Math.floor(Math.random() * 2000 + 500),
        orders: Math.floor(Math.random() * 10 + 2),
      })),
    }
    return this.mockRequest(mockReport)
  }

  async getRoomUtilizationReport(startDate: string, endDate: string): Promise<ApiResponse<{ totalRooms: number; occupancyRate: number; averageSessionDuration: number }>> {
    return this.mockRequest({
      totalRooms: mockData.rooms.length,
      occupancyRate: 75.5,
      averageSessionDuration: 3.2,
    })
  }

  async getSettings(): Promise<ApiResponse<{ storeName: string; currency: string; timezone: string; language: string }>> {
    return this.mockRequest({
      storeName: "智慧商家KTV",
      currency: "CNY",
      timezone: "Asia/Shanghai",
      language: "zh-CN",
    })
  }

  async updateSettings(settings: Record<string, unknown>): Promise<ApiResponse<{ success: boolean }>> {
    return this.request("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    })
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL || "mock://localhost")

export default ApiClient
