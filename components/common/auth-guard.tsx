"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import PageLoader from "@/components/common/page-loader"

interface WithAuthProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: WithAuthProps) {
  const { isAuthenticated, loadFromStorage } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("yyc3_auth_token") : null
    if (!token && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return <PageLoader message="正在验证身份..." />
  }

  return <>{children}</>
}
