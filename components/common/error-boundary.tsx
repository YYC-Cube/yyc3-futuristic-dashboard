"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Bug } from "lucide-react"
import * as Sentry from "@sentry/react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  eventId: string | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, eventId: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        component: "ErrorBoundary",
        environment: process.env.NEXT_PUBLIC_ENV || "development",
      },
      extra: {
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
    })

    this.setState({ eventId })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    console.error("[ErrorBoundary]", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, eventId: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReportFeedback = () => {
    if (this.state.eventId) {
      Sentry.showReportDialog({
        eventId: this.state.eventId,
        title: "发现问题",
        subtitle: "我们的团队已收到此错误报告",
        labelName: "姓名",
        labelEmail: "邮箱",
        labelComments: "发生了什么？请描述您遇到的问题",
        labelSubmit: "提交反馈",
        labelClose: "关闭",
        errorGeneric: "提交时发生未知错误，请稍后重试",
        errorFormEntry: "请填写所有必填字段",
        successMessage: "感谢您的反馈！我们会尽快处理。",
      })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <Card className="bg-slate-800/50 border-red-500/30 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">页面出现错误</h2>
              <p className="text-slate-400 text-sm mb-2">
                {this.state.error?.message || "发生了未知错误"}
              </p>
              <p className="text-slate-500 text-xs mb-6">
                错误ID: {this.state.eventId || "N/A"}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button variant="outline" onClick={this.handleReset} className="border-slate-600 text-slate-300">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重试
                </Button>
                <Button onClick={this.handleReload} className="bg-cyan-600 hover:bg-cyan-700">
                  刷新页面
                </Button>
                {this.state.eventId && (
                  <Button variant="ghost" onClick={this.handleReportFeedback} className="text-red-400 hover:text-red-300">
                    <Bug className="h-4 w-4 mr-2" />
                    反馈问题
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export function withSentry<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: { componentName?: string }
): React.FC<P> {
  const displayName = options?.componentName || WrappedComponent.displayName || WrappedComponent.name || "Component"

  const ComponentWithSentry = (props: P) => {
    return (
      <Sentry.ErrorBoundary
        fallback={<ErrorFallback componentName={displayName} />}
        beforeCapture={(scope) => {
          scope.setTag("component", displayName)
          scope.setLevel("error")
        }}
      >
        <WrappedComponent {...props} />
      </Sentry.ErrorBoundary>
    )
  }

  ComponentWithSentry.displayName = `withSentry(${displayName})`

  return ComponentWithSentry
}

function ErrorFallback({ componentName }: { componentName: string }) {
  return (
    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
      <p className="text-red-400 text-sm">
        组件 <strong>{componentName}</strong> 渲染出错，错误已自动上报至 Sentry。
      </p>
    </div>
  )
}
