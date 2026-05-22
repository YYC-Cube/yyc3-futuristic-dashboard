"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Activity,
  BarChart3,
  Users,
  ShoppingBag,
  Home,
  CreditCard,
  Gift,
  Bell,
  Settings,
  Shield,
  Database,
  FileText,
  Package,
  MessageSquare,
  Monitor,
  Cpu,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  QrCode,
  Heart,
  Award,
  Key,
  Tags,
  Warehouse,
  Ticket,
  Send,
  UserPlus,
  Brush,
  Wallet,
  DollarSign,
  ClipboardList,
  Grid3X3,
  PenToolIcon as Tool,
  CheckSquare,
  Zap,
  RefreshCw,
  Download,
  HardDrive,
  TrendingUp,
  Target,
  PieChart,
  BarChart,
  TrendingDown,
  Eye,
  Plus,
  Upload,
  Mail,
  Calendar,
  User,
  Building,
  Image,
  Hash,
  Percent,
  List,
  Calculator,
} from "lucide-react"

// 大数据驱动的功能分类系统
interface NavigationItem {
  id: string
  label: string
  icon: any
  path?: string
  children?: NavigationItem[]
  badge?: string | number
  priority: "high" | "medium" | "low"
  category: string
  usage: number // 使用频率统计
  lastAccessed?: Date
  isNew?: boolean
  isHot?: boolean
  permissions?: string[]
}

// 基于大数据分析的功能分类
const navigationData: NavigationItem[] = [
  {
    id: "core-business",
    label: "核心业务",
    icon: Activity,
    priority: "high",
    category: "primary",
    usage: 95,
    children: [
      {
        id: "pos-system",
        label: "点单收银",
        icon: CreditCard,
        path: "/pos",
        priority: "high",
        category: "business",
        usage: 90,
        badge: "热门",
        isHot: true,
        children: [
          {
            id: "quick-order",
            label: "快速点单",
            icon: Zap,
            path: "/pos/quick",
            priority: "high",
            category: "business",
            usage: 85,
          },
          {
            id: "scan-order",
            label: "扫码点单",
            icon: QrCode,
            path: "/pos/scan",
            priority: "high",
            category: "business",
            usage: 80,
          },
          {
            id: "table-service",
            label: "桌台服务",
            icon: Home,
            path: "/pos/table",
            priority: "high",
            category: "business",
            usage: 75,
          },
          {
            id: "payment-methods",
            label: "支付方式",
            icon: Wallet,
            path: "/pos/payment",
            priority: "medium",
            category: "business",
            usage: 70,
          },
        ],
      },
      {
        id: "room-status",
        label: "包厢管理",
        icon: Home,
        path: "/rooms",
        priority: "high",
        category: "business",
        usage: 88,
        children: [
          {
            id: "room-overview",
            label: "包厢总览",
            icon: Grid3X3,
            path: "/rooms/overview",
            priority: "high",
            category: "business",
            usage: 85,
          },
          {
            id: "room-booking",
            label: "预订管理",
            icon: Calendar,
            path: "/rooms/booking",
            priority: "high",
            category: "business",
            usage: 80,
          },
          {
            id: "room-service",
            label: "客房服务",
            icon: Bell,
            path: "/rooms/service",
            priority: "medium",
            category: "business",
            usage: 75,
          },
          {
            id: "room-cleaning",
            label: "清洁状态",
            icon: Brush,
            path: "/rooms/cleaning",
            priority: "medium",
            category: "business",
            usage: 60,
          },
        ],
      },
      {
        id: "order-management",
        label: "订单中心",
        icon: ClipboardList,
        path: "/orders",
        priority: "high",
        category: "business",
        usage: 85,
        children: [
          {
            id: "order-list",
            label: "订单列表",
            icon: List,
            path: "/orders/list",
            priority: "high",
            category: "business",
            usage: 80,
          },
          {
            id: "order-tracking",
            label: "订单跟踪",
            icon: TrendingUp,
            path: "/orders/tracking",
            priority: "high",
            category: "business",
            usage: 75,
          },
          {
            id: "order-history",
            label: "历史订单",
            icon: Clock,
            path: "/orders/history",
            priority: "medium",
            category: "business",
            usage: 65,
          },
          {
            id: "order-analytics",
            label: "订单分析",
            icon: BarChart,
            path: "/orders/analytics",
            priority: "medium",
            category: "business",
            usage: 55,
          },
        ],
      },
      {
        id: "task-center",
        label: "任务中心",
        icon: CheckSquare,
        path: "/tasks",
        priority: "high",
        category: "business",
        usage: 82,
        badge: 12,
        children: [
          {
            id: "my-tasks",
            label: "我的任务",
            icon: User,
            path: "/tasks/my",
            priority: "high",
            category: "business",
            usage: 80,
          },
          {
            id: "team-tasks",
            label: "团队任务",
            icon: Users,
            path: "/tasks/team",
            priority: "high",
            category: "business",
            usage: 75,
          },
          {
            id: "urgent-tasks",
            label: "紧急任务",
            icon: AlertTriangle,
            path: "/tasks/urgent",
            priority: "high",
            category: "business",
            usage: 70,
          },
          {
            id: "completed-tasks",
            label: "已完成",
            icon: CheckCircle,
            path: "/tasks/completed",
            priority: "low",
            category: "business",
            usage: 40,
          },
        ],
      },
    ],
  },
  {
    id: "staff-management",
    label: "人员管理",
    icon: Users,
    priority: "high",
    category: "management",
    usage: 78,
    children: [
      {
        id: "employee-management",
        label: "员工管理",
        icon: UserPlus,
        path: "/staff/employees",
        priority: "high",
        category: "management",
        usage: 75,
        children: [
          {
            id: "add-employee",
            label: "添加员工",
            icon: Plus,
            path: "/staff/employees/add",
            priority: "high",
            category: "management",
            usage: 70,
          },
          {
            id: "employee-list",
            label: "员工列表",
            icon: List,
            path: "/staff/employees/list",
            priority: "high",
            category: "management",
            usage: 80,
          },
          {
            id: "employee-profile",
            label: "员工档案",
            icon: User,
            path: "/staff/employees/profile",
            priority: "medium",
            category: "management",
            usage: 65,
          },
          {
            id: "employee-performance",
            label: "绩效考核",
            icon: Award,
            path: "/staff/employees/performance",
            priority: "medium",
            category: "management",
            usage: 55,
          },
        ],
      },
      {
        id: "permissions",
        label: "权限管理",
        icon: Shield,
        path: "/staff/permissions",
        priority: "high",
        category: "management",
        usage: 70,
        children: [
          {
            id: "role-permissions",
            label: "角色权限",
            icon: Key,
            path: "/staff/permissions/roles",
            priority: "high",
            category: "management",
            usage: 65,
          },
          {
            id: "function-permissions",
            label: "功能权限",
            icon: Settings,
            path: "/staff/permissions/functions",
            priority: "high",
            category: "management",
            usage: 60,
          },
          {
            id: "data-permissions",
            label: "数据权限",
            icon: Database,
            path: "/staff/permissions/data",
            priority: "medium",
            category: "management",
            usage: 50,
          },
        ],
      },
      {
        id: "groups",
        label: "组织架构",
        icon: Building,
        path: "/staff/groups",
        priority: "medium",
        category: "management",
        usage: 65,
        children: [
          {
            id: "departments",
            label: "部门管理",
            icon: Building,
            path: "/staff/groups/departments",
            priority: "medium",
            category: "management",
            usage: 60,
          },
          {
            id: "teams",
            label: "团队管理",
            icon: Users,
            path: "/staff/groups/teams",
            priority: "medium",
            category: "management",
            usage: 55,
          },
          {
            id: "positions",
            label: "职位管理",
            icon: Award,
            path: "/staff/groups/positions",
            priority: "low",
            category: "management",
            usage: 45,
          },
        ],
      },
      {
        id: "attendance",
        label: "考勤管理",
        icon: Clock,
        path: "/staff/attendance",
        priority: "medium",
        category: "management",
        usage: 60,
        children: [
          {
            id: "check-in",
            label: "签到签退",
            icon: CheckCircle,
            path: "/staff/attendance/checkin",
            priority: "high",
            category: "management",
            usage: 70,
          },
          {
            id: "schedule",
            label: "排班管理",
            icon: Calendar,
            path: "/staff/attendance/schedule",
            priority: "medium",
            category: "management",
            usage: 55,
          },
          {
            id: "overtime",
            label: "加班管理",
            icon: Clock,
            path: "/staff/attendance/overtime",
            priority: "low",
            category: "management",
            usage: 40,
          },
        ],
      },
    ],
  },
  {
    id: "product-management",
    label: "商品管理",
    icon: ShoppingBag,
    priority: "high",
    category: "inventory",
    usage: 72,
    children: [
      {
        id: "product-catalog",
        label: "商品目录",
        icon: Package,
        path: "/products/catalog",
        priority: "high",
        category: "inventory",
        usage: 70,
        children: [
          {
            id: "product-list",
            label: "商品列表",
            icon: List,
            path: "/products/catalog/list",
            priority: "high",
            category: "inventory",
            usage: 75,
          },
          {
            id: "product-categories",
            label: "商品分类",
            icon: Tags,
            path: "/products/catalog/categories",
            priority: "medium",
            category: "inventory",
            usage: 60,
          },
          {
            id: "product-brands",
            label: "品牌管理",
            icon: Star,
            path: "/products/catalog/brands",
            priority: "low",
            category: "inventory",
            usage: 45,
          },
        ],
      },
      {
        id: "inventory",
        label: "库存管理",
        icon: Warehouse,
        path: "/products/inventory",
        priority: "high",
        category: "inventory",
        usage: 68,
        children: [
          {
            id: "stock-overview",
            label: "库存总览",
            icon: Eye,
            path: "/products/inventory/overview",
            priority: "high",
            category: "inventory",
            usage: 70,
          },
          {
            id: "stock-in",
            label: "入库管理",
            icon: Upload,
            path: "/products/inventory/in",
            priority: "medium",
            category: "inventory",
            usage: 55,
          },
          {
            id: "stock-out",
            label: "出库管理",
            icon: Download,
            path: "/products/inventory/out",
            priority: "medium",
            category: "inventory",
            usage: 55,
          },
          {
            id: "stock-alert",
            label: "库存预警",
            icon: AlertTriangle,
            path: "/products/inventory/alert",
            priority: "high",
            category: "inventory",
            usage: 65,
          },
        ],
      },
      {
        id: "pricing",
        label: "价格管理",
        icon: DollarSign,
        path: "/products/pricing",
        priority: "medium",
        category: "inventory",
        usage: 55,
        children: [
          {
            id: "price-list",
            label: "价格表",
            icon: List,
            path: "/products/pricing/list",
            priority: "medium",
            category: "inventory",
            usage: 60,
          },
          {
            id: "promotions",
            label: "促销活动",
            icon: Gift,
            path: "/products/pricing/promotions",
            priority: "medium",
            category: "inventory",
            usage: 50,
          },
          {
            id: "discounts",
            label: "折扣管理",
            icon: Percent,
            path: "/products/pricing/discounts",
            priority: "low",
            category: "inventory",
            usage: 40,
          },
        ],
      },
    ],
  },
  {
    id: "member-marketing",
    label: "会员营销",
    icon: Heart,
    priority: "medium",
    category: "marketing",
    usage: 65,
    children: [
      {
        id: "member-management",
        label: "会员管理",
        icon: Users,
        path: "/members/management",
        priority: "medium",
        category: "marketing",
        usage: 60,
        children: [
          {
            id: "member-list",
            label: "会员列表",
            icon: List,
            path: "/members/management/list",
            priority: "medium",
            category: "marketing",
            usage: 65,
          },
          {
            id: "member-levels",
            label: "会员等级",
            icon: Star,
            path: "/members/management/levels",
            priority: "low",
            category: "marketing",
            usage: 45,
          },
          {
            id: "member-points",
            label: "积分管理",
            icon: Award,
            path: "/members/management/points",
            priority: "medium",
            category: "marketing",
            usage: 50,
          },
        ],
      },
      {
        id: "marketing-campaigns",
        label: "营销活动",
        icon: Ticket,
        path: "/members/campaigns",
        priority: "medium",
        category: "marketing",
        usage: 58,
        children: [
          {
            id: "coupons",
            label: "优惠券",
            icon: Gift,
            path: "/members/campaigns/coupons",
            priority: "medium",
            category: "marketing",
            usage: 60,
          },
          {
            id: "events",
            label: "活动管理",
            icon: Calendar,
            path: "/members/campaigns/events",
            priority: "medium",
            category: "marketing",
            usage: 55,
          },
          {
            id: "notifications",
            label: "消息推送",
            icon: Send,
            path: "/members/campaigns/notifications",
            priority: "low",
            category: "marketing",
            usage: 40,
          },
        ],
      },
    ],
  },
  {
    id: "data-analytics",
    label: "数据分析",
    icon: BarChart3,
    priority: "high",
    category: "analytics",
    usage: 70,
    children: [
      {
        id: "business-intelligence",
        label: "商业智能",
        icon: TrendingUp,
        path: "/analytics/bi",
        priority: "high",
        category: "analytics",
        usage: 65,
        children: [
          {
            id: "sales-dashboard",
            label: "销售仪表板",
            icon: BarChart,
            path: "/analytics/bi/sales",
            priority: "high",
            category: "analytics",
            usage: 70,
          },
          {
            id: "customer-analytics",
            label: "客户分析",
            icon: Users,
            path: "/analytics/bi/customers",
            priority: "medium",
            category: "analytics",
            usage: 55,
          },
          {
            id: "product-analytics",
            label: "商品分析",
            icon: Package,
            path: "/analytics/bi/products",
            priority: "medium",
            category: "analytics",
            usage: 50,
          },
        ],
      },
      {
        id: "reports",
        label: "报表中心",
        icon: FileText,
        path: "/analytics/reports",
        priority: "medium",
        category: "analytics",
        usage: 60,
        children: [
          {
            id: "daily-reports",
            label: "日报表",
            icon: Calendar,
            path: "/analytics/reports/daily",
            priority: "high",
            category: "analytics",
            usage: 65,
          },
          {
            id: "monthly-reports",
            label: "月报表",
            icon: Calendar,
            path: "/analytics/reports/monthly",
            priority: "medium",
            category: "analytics",
            usage: 50,
          },
          {
            id: "custom-reports",
            label: "自定义报表",
            icon: Settings,
            path: "/analytics/reports/custom",
            priority: "low",
            category: "analytics",
            usage: 35,
          },
        ],
      },
      {
        id: "real-time-monitoring",
        label: "实时监控",
        icon: Monitor,
        path: "/analytics/monitoring",
        priority: "high",
        category: "analytics",
        usage: 68,
        children: [
          {
            id: "live-dashboard",
            label: "实时大屏",
            icon: Monitor,
            path: "/analytics/monitoring/live",
            priority: "high",
            category: "analytics",
            usage: 70,
          },
          {
            id: "alerts",
            label: "预警系统",
            icon: AlertTriangle,
            path: "/analytics/monitoring/alerts",
            priority: "high",
            category: "analytics",
            usage: 65,
          },
          {
            id: "kpi-tracking",
            label: "KPI追踪",
            icon: Target,
            path: "/analytics/monitoring/kpi",
            priority: "medium",
            category: "analytics",
            usage: 55,
          },
        ],
      },
    ],
  },
  {
    id: "communication",
    label: "沟通协作",
    icon: MessageSquare,
    priority: "medium",
    category: "collaboration",
    usage: 62,
    children: [
      {
        id: "team-chat",
        label: "团队聊天",
        icon: MessageSquare,
        path: "/communication/chat",
        priority: "medium",
        category: "collaboration",
        usage: 60,
        badge: 5,
        children: [
          {
            id: "department-channels",
            label: "部门频道",
            icon: Hash,
            path: "/communication/chat/departments",
            priority: "medium",
            category: "collaboration",
            usage: 65,
          },
          {
            id: "private-messages",
            label: "私人消息",
            icon: Mail,
            path: "/communication/chat/private",
            priority: "medium",
            category: "collaboration",
            usage: 55,
          },
          {
            id: "group-chats",
            label: "群组聊天",
            icon: Users,
            path: "/communication/chat/groups",
            priority: "low",
            category: "collaboration",
            usage: 45,
          },
        ],
      },
      {
        id: "ai-assistant",
        label: "AI助手",
        icon: Cpu,
        path: "/communication/ai",
        priority: "medium",
        category: "collaboration",
        usage: 58,
        isNew: true,
        children: [
          {
            id: "business-queries",
            label: "业务查询",
            icon: Search,
            path: "/communication/ai/queries",
            priority: "medium",
            category: "collaboration",
            usage: 60,
          },
          {
            id: "data-analysis",
            label: "数据分析",
            icon: BarChart,
            path: "/communication/ai/analysis",
            priority: "medium",
            category: "collaboration",
            usage: 55,
          },
          {
            id: "recommendations",
            label: "智能建议",
            icon: Star,
            path: "/communication/ai/recommendations",
            priority: "low",
            category: "collaboration",
            usage: 40,
          },
        ],
      },
      {
        id: "notifications",
        label: "通知中心",
        icon: Bell,
        path: "/communication/notifications",
        priority: "medium",
        category: "collaboration",
        usage: 55,
        badge: 8,
        children: [
          {
            id: "system-notifications",
            label: "系统通知",
            icon: Settings,
            path: "/communication/notifications/system",
            priority: "medium",
            category: "collaboration",
            usage: 60,
          },
          {
            id: "business-alerts",
            label: "业务提醒",
            icon: AlertTriangle,
            path: "/communication/notifications/business",
            priority: "high",
            category: "collaboration",
            usage: 65,
          },
          {
            id: "personal-reminders",
            label: "个人提醒",
            icon: User,
            path: "/communication/notifications/personal",
            priority: "low",
            category: "collaboration",
            usage: 40,
          },
        ],
      },
    ],
  },
  {
    id: "financial-management",
    label: "财务管理",
    icon: DollarSign,
    priority: "high",
    category: "finance",
    usage: 68,
    children: [
      {
        id: "cashier-operations",
        label: "收银操作",
        icon: CreditCard,
        path: "/finance/cashier",
        priority: "high",
        category: "finance",
        usage: 70,
        children: [
          {
            id: "shift-handover",
            label: "交接班",
            icon: RefreshCw,
            path: "/finance/cashier/handover",
            priority: "high",
            category: "finance",
            usage: 75,
          },
          {
            id: "daily-settlement",
            label: "日结算",
            icon: Calculator,
            path: "/finance/cashier/settlement",
            priority: "high",
            category: "finance",
            usage: 70,
          },
          {
            id: "payment-records",
            label: "支付记录",
            icon: FileText,
            path: "/finance/cashier/records",
            priority: "medium",
            category: "finance",
            usage: 60,
          },
        ],
      },
      {
        id: "accounts-management",
        label: "账务管理",
        icon: Wallet,
        path: "/finance/accounts",
        priority: "medium",
        category: "finance",
        usage: 58,
        children: [
          {
            id: "employee-accounts",
            label: "员工账户",
            icon: Users,
            path: "/finance/accounts/employees",
            priority: "medium",
            category: "finance",
            usage: 60,
          },
          {
            id: "credit-management",
            label: "挂账管理",
            icon: CreditCard,
            path: "/finance/accounts/credit",
            priority: "medium",
            category: "finance",
            usage: 55,
          },
          {
            id: "debt-collection",
            label: "催收管理",
            icon: AlertTriangle,
            path: "/finance/accounts/collection",
            priority: "low",
            category: "finance",
            usage: 40,
          },
        ],
      },
      {
        id: "financial-reports",
        label: "财务报表",
        icon: FileText,
        path: "/finance/reports",
        priority: "medium",
        category: "finance",
        usage: 55,
        children: [
          {
            id: "revenue-reports",
            label: "营收报表",
            icon: TrendingUp,
            path: "/finance/reports/revenue",
            priority: "high",
            category: "finance",
            usage: 65,
          },
          {
            id: "expense-reports",
            label: "支出报表",
            icon: TrendingDown,
            path: "/finance/reports/expenses",
            priority: "medium",
            category: "finance",
            usage: 50,
          },
          {
            id: "profit-analysis",
            label: "利润分析",
            icon: PieChart,
            path: "/finance/reports/profit",
            priority: "medium",
            category: "finance",
            usage: 45,
          },
        ],
      },
    ],
  },
  {
    id: "system-management",
    label: "系统管理",
    icon: Settings,
    priority: "low",
    category: "system",
    usage: 45,
    children: [
      {
        id: "system-settings",
        label: "系统设置",
        icon: Settings,
        path: "/system/settings",
        priority: "low",
        category: "system",
        usage: 40,
        children: [
          {
            id: "general-settings",
            label: "基础设置",
            icon: Settings,
            path: "/system/settings/general",
            priority: "low",
            category: "system",
            usage: 45,
          },
          {
            id: "security-settings",
            label: "安全设置",
            icon: Shield,
            path: "/system/settings/security",
            priority: "medium",
            category: "system",
            usage: 50,
          },
          {
            id: "backup-settings",
            label: "备份设置",
            icon: Database,
            path: "/system/settings/backup",
            priority: "low",
            category: "system",
            usage: 35,
          },
        ],
      },
      {
        id: "system-monitoring",
        label: "系统监控",
        icon: Monitor,
        path: "/system/monitoring",
        priority: "medium",
        category: "system",
        usage: 48,
        children: [
          {
            id: "performance-monitoring",
            label: "性能监控",
            icon: Activity,
            path: "/system/monitoring/performance",
            priority: "medium",
            category: "system",
            usage: 50,
          },
          {
            id: "error-logs",
            label: "错误日志",
            icon: AlertTriangle,
            path: "/system/monitoring/errors",
            priority: "medium",
            category: "system",
            usage: 45,
          },
          {
            id: "audit-logs",
            label: "审计日志",
            icon: FileText,
            path: "/system/monitoring/audit",
            priority: "low",
            category: "system",
            usage: 35,
          },
        ],
      },
      {
        id: "maintenance",
        label: "系统维护",
        icon: Tool,
        path: "/system/maintenance",
        priority: "low",
        category: "system",
        usage: 35,
        children: [
          {
            id: "database-maintenance",
            label: "数据库维护",
            icon: Database,
            path: "/system/maintenance/database",
            priority: "low",
            category: "system",
            usage: 30,
          },
          {
            id: "cache-management",
            label: "缓存管理",
            icon: HardDrive,
            path: "/system/maintenance/cache",
            priority: "low",
            category: "system",
            usage: 25,
          },
          {
            id: "system-updates",
            label: "系统更新",
            icon: Download,
            path: "/system/maintenance/updates",
            priority: "medium",
            category: "system",
            usage: 40,
          },
        ],
      },
    ],
  },
]

// 顶部面包屑导航数据
const breadcrumbCategories = [
  { id: "business", label: "业务运营", icon: Activity, color: "cyan" },
  { id: "management", label: "人员管理", icon: Users, color: "purple" },
  { id: "inventory", label: "商品库存", icon: Package, color: "blue" },
  { id: "marketing", label: "会员营销", icon: Heart, color: "pink" },
  { id: "analytics", label: "数据分析", icon: BarChart3, color: "green" },
  { id: "collaboration", label: "沟通协作", icon: MessageSquare, color: "orange" },
  { id: "finance", label: "财务管理", icon: DollarSign, color: "yellow" },
  { id: "system", label: "系统管理", icon: Settings, color: "gray" },
]

// 底部快捷菜单数据
const bottomMenuItems = [
  { id: "dashboard", label: "仪表板", icon: BarChart3, path: "/dashboard", isActive: true },
  { id: "pos", label: "收银", icon: CreditCard, path: "/pos", badge: "热门" },
  { id: "rooms", label: "包厢", icon: Home, path: "/rooms", badge: 3 },
  { id: "tasks", label: "任务", icon: CheckSquare, path: "/tasks", badge: 12 },
  { id: "chat", label: "沟通", icon: MessageSquare, path: "/chat", badge: 5 },
  { id: "more", label: "更多", icon: Grid3X3, path: "/more" },
]

export default function NavigationSystem() {
  const pathname = usePathname()
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["core-business"])
  const [activeCategory, setActiveCategory] = useState("business")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPath, setCurrentPath] = useState("/dashboard")

  // 搜索功能
  const searchItems = (items: NavigationItem[], term: string): NavigationItem[] => {
    if (!term) return items

    return items.reduce((acc: NavigationItem[], item) => {
      const matchesSearch = item.label.toLowerCase().includes(term.toLowerCase())
      const filteredChildren = item.children ? searchItems(item.children, term) : []

      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({
          ...item,
          children: filteredChildren.length > 0 ? filteredChildren : item.children,
        })
      }

      return acc
    }, [])
  }

  // 切换展开状态
  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  // 渲染导航项
  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0
    const isActive = currentPath === item.path

    return (
      <div key={item.id} className="w-full">
        <Collapsible open={isExpanded} onOpenChange={() => hasChildren && toggleExpanded(item.id)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start h-auto py-2 px-3 ${level > 0 ? `ml-${level * 4}` : ""} ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-500"
                  : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/50"
              }`}
              onClick={() => item.path && setCurrentPath(item.path)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Image className={`h-4 w-4 ${leftSidebarCollapsed ? "mx-auto" : ""}`} />
                  {!leftSidebarCollapsed && (
                    <>
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.isNew && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">新</Badge>
                      )}
                      {item.isHot && <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">热</Badge>}
                      {typeof item.badge === "number" && item.badge > 0 && (
                        <Badge className="bg-cyan-500 text-white text-xs">{item.badge}</Badge>
                      )}
                      {typeof item.badge === "string" && (
                        <Badge variant="outline" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
                {!leftSidebarCollapsed && hasChildren && (
                  <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>

          {hasChildren && (
            <CollapsibleContent className="space-y-1">
              {item.children?.map((child) => renderNavigationItem(child, level + 1))}
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    )
  }

  const filteredNavigation = searchTerm ? searchItems(navigationData, searchTerm) : navigationData

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black to-slate-900">
      {/* 顶部面包屑导航 */}
      <div className="h-16 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 flex items-center px-4">
        <div className="flex items-center space-x-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            className="text-slate-400 hover:text-slate-100"
          >
            {leftSidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>

          <div className="flex items-center space-x-1">
            {breadcrumbCategories.map((category, index) => (
              <div key={category.id} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 text-slate-500 mx-1" />}
                <Button
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={`text-xs ${
                    activeCategory === category.id
                      ? `bg-${category.color}-500/20 text-${category.color}-400 border-${category.color}-500/50`
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  <category.icon className="h-3 w-3 mr-1" />
                  {category.label}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索功能..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-64"
            />
          </div>

          <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600">
            智慧商家系统 v2.0
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 左侧伸缩式导航栏 */}
        <div
          className={`${leftSidebarCollapsed ? "w-16" : "w-80"} transition-all duration-300 bg-slate-900/50 border-r border-slate-700/50 backdrop-blur-sm`}
        >
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">{filteredNavigation.map((item) => renderNavigationItem(item))}</div>
          </ScrollArea>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 内容区域 */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
                智慧商家管理系统
              </h1>

              {/* 功能使用统计 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {navigationData.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Image className="h-8 w-8 text-cyan-500" />
                      <Badge variant="outline" className="text-xs">
                        {item.usage}% 使用率
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-1">{item.label}</h3>
                    <p className="text-sm text-slate-400">{item.children?.length || 0} 个子功能</p>
                    <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${item.usage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 快速访问 */}
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-slate-100 mb-4">快速访问</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {navigationData
                    .flatMap((item) => item.children || [])
                    .filter((item) => item.usage > 70)
                    .slice(0, 12)
                    .map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        className="h-auto py-4 px-4 border-slate-600 bg-slate-800/30 hover:bg-slate-700/50 flex flex-col items-center space-y-2"
                        onClick={() => item.path && setCurrentPath(item.path)}
                      >
                        <Image className="h-6 w-6 text-cyan-500" />
                        <span className="text-xs text-center">{item.label}</span>
                        {item.badge && <Badge className="bg-cyan-500 text-white text-xs">{item.badge}</Badge>}
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部菜单 */}
      <div className="h-16 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 flex items-center justify-center">
        <div className="flex items-center space-x-1 max-w-md">
          {bottomMenuItems.map((item) => (
            <Button
              key={item.id}
              variant={item.isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentPath(item.path)}
              className={`flex flex-col items-center space-y-1 h-12 px-3 relative ${
                item.isActive ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs">{item.label}</span>
              {item.badge && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-4 w-4 p-0 flex items-center justify-center">
                  {typeof item.badge === "number" && item.badge > 99 ? "99+" : item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
