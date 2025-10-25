import type { Permission, UserRole } from "./types"

// ✅ 权限标签映射（用于 UI 显示）
export const PermissionLabels: Record<Permission, string> = {
  "view:dashboard": "查看仪表板",
  "view:analytics": "查看数据分析",
  "view:data": "查看数据中心",
  "view:network": "查看网络监控",
  "view:security": "查看安全防护",
  "view:insights": "查看 AI 洞察",
  "manage:users": "管理用户",
  "manage:roles": "管理角色",
  "manage:settings": "管理系统设置",
  "manage:resources": "管理资源",
  "execute:commands": "执行系统命令",
  "export:data": "导出数据",
}

// ✅ 角色权限映射（用于默认权限配置）
export const RolePermissionMap: Record<UserRole, Permission[]> = {
  super_admin: [
    "view:dashboard",
    "view:analytics",
    "view:data",
    "view:network",
    "view:security",
    "view:insights",
    "manage:users",
    "manage:roles",
    "manage:settings",
    "manage:resources",
    "execute:commands",
    "export:data",
  ],
  admin: [
    "view:dashboard",
    "view:analytics",
    "view:data",
    "view:network",
    "view:security",
    "manage:users",
    "manage:roles",
    "manage:settings",
    "export:data",
  ],
  manager: [
    "view:dashboard",
    "view:data",
    "view:network",
    "view:security",
    "manage:resources",
  ],
  operator: [
    "view:dashboard",
    "view:data",
    "view:network",
    "execute:commands",
  ],
  viewer: ["view:dashboard", "view:data"],
}
