'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Moon, Sun, Monitor, Palette, Info, Copy, Check, Sparkles, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export function GhostModeDevTools() {
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const { theme, setTheme, resolvedTheme, systemTheme, themes } = useTheme()

  React.useEffect(() => {
    setMounted(true)
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!mounted) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "inline-flex h-12 w-12 items-center justify-center rounded-full",
          "bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg",
          "hover:from-purple-500 hover:to-blue-500 hover:shadow-xl",
          "transition-all duration-300 hover:scale-110 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isOpen && "rotate-45"
        )}
        title="Ghost Mode DevTools (⌘⇧D)"
      >
        <Palette className="h-5 w-5" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className={cn(
          "fixed bottom-24 right-6 z-50 w-80 rounded-xl border bg-background shadow-2xl",
          "animate-in fade-in slide-in-from-bottom-5 duration-300"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-semibold">Ghost Mode</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Current Theme Info */}
            <div className="rounded-lg bg-muted/50 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Current Theme</span>
                <code 
                  className="cursor-pointer font-mono text-primary hover:underline"
                  onClick={() => copyToClipboard(theme || 'dark')}
                >
                  {copied ? (
                    <Check className="inline h-3 w-3 mr-1" />
                  ) : (
                    <Copy className="inline h-3 w-3 mr-1" />
                  )}
                  {theme || 'dark'}
                </code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Resolved</span>
                <code className="font-mono">{resolvedTheme}</code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">System</span>
                <code className="font-mono">{systemTheme}</code>
              </div>
            </div>

            {/* Theme Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Select Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'dark', 'system'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg p-3 text-xs font-medium transition-all",
                      theme === t
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {t === 'light' && <Sun className="h-4 w-4" />}
                    {t === 'dark' && <Moon className="h-4 w-4" />}
                    {t === 'system' && <Monitor className="h-4 w-4" />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Info className="h-3 w-3" />
                Shortcuts
              </label>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Toggle Dark/Light</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">⌘D</kbd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Toggle This Panel</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">⌘⇧D</kbd>
                </div>
              </div>
            </div>

            {/* CSS Variables Preview */}
            <details className="group">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                CSS Variables
              </summary>
              <div className="mt-2 max-h-40 overflow-auto rounded bg-muted/30 p-2">
                <pre className="text-[10px] font-mono leading-relaxed">
{`--background: ${getComputedStyle(document.documentElement).getPropertyValue('--background')}
--foreground: ${getComputedStyle(document.documentElement).getPropertyValue('--foreground')}`}
                </pre>
              </div>
            </details>

            {/* Theme Customizer Link */}
            <Link
              href="/theme"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-center gap-2 w-full rounded-lg",
                "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
                "py-3 px-4 text-sm font-medium shadow-md",
                "hover:from-purple-500 hover:to-blue-500 hover:shadow-lg transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              <Sparkles className="h-4 w-4" />
              主题定制中心
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Link>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default GhostModeDevTools
