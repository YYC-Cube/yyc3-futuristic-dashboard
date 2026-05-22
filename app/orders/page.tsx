"use client"

import { LazyAnalyticsDashboard } from "@/components/lazy-components"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">订单中心</h1>
      </div>
      <LazyAnalyticsDashboard />
    </div>
  )
}
