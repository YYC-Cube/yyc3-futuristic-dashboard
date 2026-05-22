'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GhostModeToggleProps {
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'compact' | 'minimal'
}

export function GhostModeToggle({ 
  className,
  showLabel = false,
  variant = 'default'
}: GhostModeToggleProps) {
  const [mounted, setMounted] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = (newTheme: string) => {
    if (newTheme === theme) return
    
    document.documentElement.classList.add('theme-transitioning')
    setIsAnimating(true)
    
    setTheme(newTheme)
    
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
      setIsAnimating(false)
    }, 300)
  }

  if (!mounted) {
    return (
      <div className={cn(
        "h-10 w-10 rounded-lg border border-input bg-background animate-pulse",
        className
      )} />
    )
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => toggleTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-lg",
          "border border-input bg-background text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "transition-all duration-200 hover:scale-105 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isAnimating && "scale-110 rotate-12",
          className
        )}
        title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
      >
        <Sun 
          className={cn(
            "h-4 w-4 transition-all duration-300",
            resolvedTheme === 'dark' ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )} 
        />
        <Moon 
          className={cn(
            "absolute h-4 w-4 transition-all duration-300",
            resolvedTheme === 'dark' ? "-rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          )} 
        />
      </button>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground">
          🌙 幽灵模式
        </span>
      )}
      
      <div className={cn(
        "relative flex items-center gap-1 rounded-lg bg-muted/50 p-1.5 backdrop-blur-sm",
        variant === 'compact' && "p-1"
      )}>
        {/* Glow effect for dark mode */}
        {resolvedTheme === 'dark' && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 blur-md -z-10" />
        )}
        
        <button
          onClick={() => toggleTheme('light')}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md",
            "text-sm font-medium transition-all duration-200",
            theme === 'light'
              ? "bg-background text-foreground shadow-sm scale-110"
              : "text-muted-foreground hover:text-foreground hover:scale-105"
          )}
          title="☀️ Light Mode"
        >
          <Sun className="h-4 w-4" />
        </button>

        <button
          onClick={() => toggleTheme('dark')}
          className={cn(
            "inline-flex relative h-8 w-8 items-center justify-center rounded-md",
            "text-sm font-medium transition-all duration-200",
            theme === 'dark'
              ? "bg-background text-foreground shadow-sm scale-110"
              : "text-muted-foreground hover:text-foreground hover:scale-105"
          )}
          title="🌙 Dark Mode (Ghost Mode)"
        >
          <Moon className="h-4 w-4" />
          {theme === 'dark' && (
            <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-purple-400 animate-pulse" />
          )}
        </button>

        {variant !== 'compact' && (
          <button
            onClick={() => toggleTheme('system')}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md",
              "text-sm font-medium transition-all duration-200",
              theme === 'system'
                ? "bg-background text-foreground shadow-sm scale-110"
                : "text-muted-foreground hover:text-foreground hover:scale-105"
            )}
            title="🖥️ System"
          >
            <Monitor className="h-4 w-4" />
          </button>
        )}

        {/* Keyboard shortcut hint */}
        <div className="hidden md:flex items-center ml-1 px-1.5 py-0.5 rounded bg-background/50">
          <kbd className="text-[10px] font-mono text-muted-foreground">⌘D</kbd>
        </div>
      </div>
    </div>
  )
}

export default GhostModeToggle
