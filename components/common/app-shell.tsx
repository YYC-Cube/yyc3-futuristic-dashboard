"use client"

import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/common/auth-guard"

const PUBLIC_ROUTES = ["/login"]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  if (isPublic) {
    return <>{children}</>
  }

  return <AuthGuard>{children}</AuthGuard>
}
