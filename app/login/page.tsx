"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GhostModeToggle } from "@/components/ui/ghost-mode-toggle"
import { 
  Ghost, 
  Zap, 
  Eye, 
  EyeOff,
  KeyRound,
  User,
  AlertTriangle,
  Sparkles
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, ghostModeLogin, loading, error, clearError } = useAuthStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)
  const [ghostHovered, setGhostHovered] = useState(false)

  // 检测是否为开发环境
  useEffect(() => {
    const checkDevEnvironment = () => {
      const isDev = process.env.NODE_ENV === 'development' || 
                    window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.port === '20307'
      
      setIsDevMode(isDev)
    }
    
    checkDevEnvironment()
  }, [])

  // 键盘快捷键：⌘G 或 Ctrl+G 快速进入幽灵模式
  useEffect(() => {
    if (!isDevMode) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault()
        handleGhostModeLogin()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDevMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    const success = await login(username, password)
    if (success) {
      router.replace("/")
    }
  }

  const handleGhostModeLogin = () => {
    ghostModeLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated Background Effect for Ghost Mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <GhostModeToggle variant="minimal" />
      </div>

      {/* Ghost Mode Badge - Top Left */}
      {isDevMode && (
        <div className="absolute top-4 left-4 z-10">
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-primary/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <Ghost className="h-3 w-3 animate-pulse" />
              <span>DEV MODE</span>
              <Sparkles className="h-3 w-3 animate-spin" />
            </div>
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <Card className="w-full max-w-md backdrop-blur-sm border-border/50 shadow-xl relative z-10">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="flex items-center justify-center gap-3">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary via-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/25 hover:scale-110 transition-transform duration-300">
              Y³
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            YYC3 智慧商家管理系统
          </CardTitle>
          <p className="text-muted-foreground text-sm">请登录以继续操作</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Standard Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                用户名
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
                className="pl-9"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                密码
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  required
                  className="pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full font-medium" 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  登录中...
                </>
              ) : (
                "登录系统"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">
                开发者工具
              </span>
            </div>
          </div>

          {/* Ghost Mode Quick Access Button */}
          {isDevMode && (
            <button
              onClick={handleGhostModeLogin}
              onMouseEnter={() => setGhostHovered(true)}
              onMouseLeave={() => setGhostHovered(false)}
              className={`
                w-full group relative overflow-hidden rounded-xl p-4
                transition-all duration-300 transform hover:scale-[1.02]
                ${ghostHovered ? 'shadow-2xl shadow-purple-500/25' : 'shadow-lg'}
              `}
              style={{
                background: ghostHovered 
                  ? 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)'
                  : 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                border: `2px solid ${ghostHovered ? 'transparent' : 'rgba(124, 58, 237, 0.3)'}`,
              }}
            >
              {/* Animated Background on Hover */}
              {ghostHovered && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
              )}
              
              <div className="relative flex items-center justify-between">
                <div className={`flex items-center gap-3 ${ghostHovered ? 'text-white' : 'text-foreground'}`}>
                  <div className={`
                    h-12 w-12 rounded-xl flex items-center justify-center
                    transition-all duration-300
                    ${ghostHovered 
                      ? 'bg-white/20 backdrop-blur-sm scale-110 rotate-6' 
                      : 'bg-primary/10'
                    }
                  `}>
                    <Ghost className={`h-6 w-6 ${ghostHovered ? 'animate-bounce' : ''}`} />
                  </div>
                  
                  <div className="text-left">
                    <div className={`font-bold text-base flex items-center gap-2`}>
                      👻 幽灵模式
                      <Zap className={`h-4 w-4 ${ghostHovered ? 'text-yellow-300' : 'text-primary'}`} />
                    </div>
                    <p className={`text-xs mt-0.5 opacity-90`}>
                      一键进入系统 · 跳过验证
                    </p>
                  </div>
                </div>

                <div className={`
                  px-3 py-1.5 rounded-lg text-xs font-bold
                  transition-all duration-300
                  ${ghostHovered 
                    ? 'bg-white/20 text-white' 
                    : 'bg-primary/20 text-primary'
                  }
                `}>
                  ⌘G
                </div>
              </div>

              {/* Feature Tags */}
              <div className={`flex flex-wrap gap-2 mt-3 pt-3 border-t ${ghostHovered ? 'border-white/20' : 'border-border/50'}`}>
                {[
                  { icon: '⚡', label: '即时进入', color: ghostHovered },
                  { icon: '🔑', label: 'Admin权限', color: ghostHovered },
                  { icon: '🛡️', label: '仅开发', color: ghostHovered },
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className={`
                      px-2 py-1 rounded-md text-[10px] font-medium
                      ${tag.color ? 'bg-white/15 text-white' : 'bg-accent text-accent-foreground'}
                    `}
                  >
                    {tag.icon} {tag.label}
                  </span>
                ))}
              </div>
            </button>
          )}

          {/* Developer Info Footer */}
          <div className="mt-6 pt-4 border-t border-border/50 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              🌙 幽灵模式已启用 · 按 ⌘D 切换主题
            </p>
            
            {isDevMode && (
              <p className="text-[11px] text-primary/70 font-medium">
                💡 提示：使用幽灵模式可快速跳过登录流程进行开发调试
              </p>
            )}
            
            <p className="text-[10px] text-muted-foreground/40">
              Powered by YanYuCloudCube™ v2.0
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcut Hint (Bottom Right) */}
      {isDevMode && (
        <div className="fixed bottom-4 right-4 z-20 opacity-60 hover:opacity-100 transition-opacity">
          <kbd className="px-2 py-1 rounded bg-card border border-border shadow-sm text-xs text-muted-foreground">
            ⌘G 快速进入
          </kbd>
        </div>
      )}
    </div>
  )
}
