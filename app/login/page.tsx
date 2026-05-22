"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GhostModeToggle } from "@/components/ui/ghost-mode-toggle"

export default function LoginPage() {
  const router = useRouter()
  const { login, loading, error, clearError } = useAuthStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    const success = await login(username, password)
    if (success) {
      router.replace("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <GhostModeToggle variant="minimal" />
      </div>

      <Card className="w-full max-w-md backdrop-blur-sm border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg">
              Y³
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            YYC3 智慧商家管理系统
          </CardTitle>
          <p className="text-muted-foreground text-sm">请登录以继续操作</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">用户名</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">密码</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
              />
            </div>
            {error && (
              <p className="text-destructive text-sm text-center">{error}
</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>

          {/* Developer Info */}
          <div className="mt-6 pt-6 border-t border-border/50 text-center space-y-1">
            <p className="text-xs text-muted-foreground">
              🌙 幽灵模式已启用 · 按 ⌘D 切换主题
            </p>
            <p className="text-[10px] text-muted-foreground/50">
              Powered by YanYuCloudCube™
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
