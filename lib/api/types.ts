// API 数据类型定义，基于后端文档
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: string
}

// 商品相关类型
export interface Product {
  id: string
  barcode?: string
  name: string
  alias?: string
  unit: string
  originalPrice: number
  salePrice: number
  memberPrice?: number
  categoryId: string
  isGift: boolean
  allowDiscount: boolean
  isSaleProduct: boolean
  isRecommended: boolean
  isLowConsumption: boolean
  showToConsumer: boolean
  image?: string
  flavors?: string[]
  stock?: number
}

// 包厢相关类型
export interface Room {
  id: string
  number: string
  type: "small" | "medium" | "large" | "vip" | "private"
  area: string
  capacity: number
  status: "available" | "occupied" | "cleaning" | "maintenance" | "reserved" | "checkout"
  currentGuests?: number
  startTime?: string
  endTime?: string
  amount?: number
  unpaidAmount?: number
  orderId?: string
  customerId?: string
  waiterId?: string
  features: string[]
  hourlyRate?: number
  memberHourlyRate?: number
  minimumConsumption?: number
  memberMinimumConsumption?: number
  createdAt?: string
  updatedAt?: string
}

// 订单相关类型
export interface Order {
  id: string
  roomId: string
  roomNumber: string
  customerId?: string
  customerName?: string
  waiterId: string
  waiterName: string
  orderType: "dine_in" | "takeout" | "delivery" | "room_service"
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  items: OrderItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentStatus: "unpaid" | "partial" | "paid" | "refunded"
  paymentMethod?: string
  createdAt: string
  updatedAt: string
  notes?: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  flavors?: string[]
  notes?: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "served"
}

// 员工相关类型
export interface Employee {
  id: string
  employeeNumber: string
  name: string
  phone: string
  position: string
  department: string
  permissions: string[]
  isActive: boolean
  role?: "admin" | "manager" | "staff"
  createdAt: string
  avatar?: string
  workShift?: string
}

// 会员相关类型
export interface Member {
  id: string
  memberNumber: string
  name: string
  phone: string
  level: string
  points: number
  balance: number
  totalConsumption: number
  lastVisit?: string
  birthday?: string
  gender?: "male" | "female"
  address?: string
  notes?: string
}

// 库存相关类型
export interface Inventory {
  productId: string
  warehouseId: string
  quantity: number
  minStock: number
  maxStock: number
  lastUpdated: string
}

// 报表相关类型
export interface SalesReport {
  date: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topProducts: Array<{
    productId: string
    productName: string
    quantity: number
    revenue: number
  }>
  hourlyBreakdown: Array<{
    hour: number
    revenue: number
    orders: number
  }>
}

export interface AuthUser {
  id: string
  name: string
  role: "admin" | "manager" | "staff"
  avatar?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface RoomUtilization {
  roomId: string
  roomNumber: string
  totalHours: number
  utilizationRate: number
  revenue: number
}

export interface SystemSettings {
  storeName: string
  storeAddress: string
  storePhone: string
  businessHours: {
    open: string
    close: string
  }
  printerEnabled: boolean
  autoCheckoutReminder: boolean
  checkoutReminderMinutes: number
}
