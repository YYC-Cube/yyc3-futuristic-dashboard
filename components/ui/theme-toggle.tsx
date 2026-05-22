'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault()
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [theme, setTheme])

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-md border border-input bg-background animate-pulse" />
    )
  }

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
      <button
        onClick={() => setTheme('light')}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-medium transition-all ${
          theme === 'light'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Light Mode (☀️)"
      >
        <Sun className="h-4 w-4" />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-medium transition-all ${
          theme === 'dark'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Dark Mode (🌙)"
      >
        <Moon className="h-4 w-4" />
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-medium transition-all ${
          theme === 'system'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="System (🖥️)"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  )
}
