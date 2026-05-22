import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"

type Role = "admin" | "manager" | "staff" | "guest"

interface Permission {
  resource: string
  action: "create" | "read" | "update" | "delete" | "*"
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    { resource: "*", action: "*" },
  ],
  manager: [
    { resource: "rooms", action: "read" },
    { resource: "rooms", action: "update" },
    { resource: "orders", action: "read" },
    { resource: "orders", action: "create" },
    { resource: "employees", action: "read" },
    { resource: "members", action: "read" },
    { resource: "products", action: "read" },
    { resource: "reports", action: "read" },
  ],
  staff: [
    { resource: "rooms", action: "read" },
    { resource: "orders", action: "read" },
    { resource: "orders", action: "create" },
    { resource: "products", action: "read" },
  ],
  guest: [
    { resource: "rooms", action: "read" },
  ],
}

const ROUTE_PERMISSION_MAP: Record<string, Permission> = {
  "/rooms": { resource: "rooms", action: "read" },
  "/employees": { resource: "employees", action: "read" },
  "/orders": { resource: "orders", action: "read" },
  "/pos": { resource: "orders", action: "create" },
  "/members": { resource: "members", action: "read" },
  "/products": { resource: "products", action: "read" },
  "/inventory": { resource: "inventory", action: "read" },
  "/reports": { resource: "reports", action: "read" },
  "/settings": { resource: "settings", action: "update" },
}

export function hasPermission(
  userRole: Role,
  requiredPermission: Permission
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || []

  return permissions.some((p) => {
    const resourceMatch = p.resource === "*" || p.resource === requiredPermission.resource
    const actionMatch = p.action === "*" || p.action === requiredPermission.action
    return resourceMatch && actionMatch
  })
}

export function getRoutePermission(pathname: string): Permission | null {
  const baseRoute = "/" + pathname.split("/")[1]
  return ROUTE_PERMISSION_MAP[baseRoute] || null
}

export async function checkAuthAndPermissions(request: Request) {
  const session = await auth()
  const pathname = new URL(request.url).pathname

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized", message: "请先登录" },
      { status: 401 }
    )
  }

  const userRole = (session.user as any).role as Role || "guest"
  const requiredPermission = getRoutePermission(pathname)

  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return NextResponse.json(
      {
        error: "Forbidden",
        message: `权限不足：需要 ${requiredPermission.resource}:${requiredPermission.action} 权限`,
      },
      { status: 403 }
    )
  }

  return null
}

export function createRBACMiddleware(requiredRoles?: Role[]) {
  return async (request: Request) => {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = (session.user as any).role as Role || "guest"
      
      if (!requiredRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }

    return NextResponse.next()
  }
}
