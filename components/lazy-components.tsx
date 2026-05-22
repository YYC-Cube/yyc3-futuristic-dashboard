import dynamic from "next/dynamic"

export const LazyPOSSystem = dynamic(
  () => import("@/components/pos/pos-system"),
  { loading: () => <div className="p-8 text-center text-slate-400">正在加载收银系统...</div> }
)

export const LazyRoomStatusDashboard = dynamic(
  () => import("@/components/room/room-status-dashboard"),
  { loading: () => <div className="p-8 text-center text-slate-400">正在加载包厢面板...</div> }
)

export const LazyAnalyticsDashboard = dynamic(
  () => import("@/components/reports/analytics-dashboard"),
  { loading: () => <div className="p-8 text-center text-slate-400">正在加载分析面板...</div> }
)

export const LazyProductManagement = dynamic(
  () => import("@/components/product/product-management"),
  { loading: () => <div className="p-8 text-center text-slate-400">正在加载商品管理...</div> }
)

export const LazyMemberManagement = dynamic(
  () => import("@/components/member/member-management"),
  { loading: () => <div className="p-8 text-center text-slate-400">正在加载会员管理...</div> }
)

export const LazyInventoryManagement = dynamic(
  () => import("@/components/inventory/inventory-management"),
  { loading: () => <div className="p-8 text-center text-slate-400">正在加载库存管理...</div> }
)

export const LazySystemSettings = dynamic(
  () => import("@/components/settings/system-settings"),
  { loading: () => <div className="p-8 text-center text-slate-400">正在加载系统设置...</div> }
)
