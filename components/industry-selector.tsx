"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllIndustries, type IndustryType } from "@/lib/industry-adapter"
import { Building2, Server, Factory, DollarSign, Heart, Zap, ShoppingCart, Truck } from "lucide-react"

const iconMap = {
  Building2,
  Server,
  Factory,
  DollarSign,
  Heart,
  Zap,
  ShoppingCart,
  Truck,
}

interface IndustrySelectorProps {
  currentIndustry: IndustryType
  onIndustryChange: (industry: IndustryType) => void
}

export function IndustrySelector({ currentIndustry, onIndustryChange }: IndustrySelectorProps) {
  const industries = getAllIndustries()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50"
      >
        <Building2 className="mr-2 h-4 w-4" />
        切换行业场景
      </Button>

      {isOpen && (
        <Card className="absolute top-12 left-0 z-50 w-[600px] bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100">选择行业场景</CardTitle>
            <CardDescription>系统将根据所选行业自动调整监控指标和 AI 模型</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {industries.map((industry) => {
                const Icon = iconMap[industry.icon as keyof typeof iconMap] || Building2
                const isActive = industry.id === currentIndustry

                return (
                  <Button
                    key={industry.id}
                    variant="outline"
                    className={`h-auto p-4 flex flex-col items-start space-y-2 ${
                      isActive
                        ? "bg-cyan-500/20 border-cyan-500/50 hover:bg-cyan-500/30"
                        : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50"
                    }`}
                    onClick={() => {
                      onIndustryChange(industry.id)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className={`h-5 w-5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                      {isActive && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">当前</Badge>
                      )}
                    </div>
                    <div className="text-left w-full">
                      <div className="font-medium text-slate-100">{industry.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{industry.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
