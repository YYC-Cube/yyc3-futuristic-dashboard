"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/react"
import { usePathname, useSearchParams } from "next/navigation"

export function PerformanceMonitor() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const startTimestamp = performance.now()

      return () => {
        const endTimestamp = performance.now()
        const duration = endTimestamp - startTimestamp

        if (duration > 1000) {
          Sentry.addBreadcrumb({
            category: "performance",
            message: `Slow page render: ${pathname}`,
            level: "warning",
            data: {
              pathname,
              duration: Math.round(duration),
              searchParams: searchParams?.toString(),
            },
          })
        }
      }
    }
  }, [pathname, searchParams])

  return null
}

export function trackPerformance(metricName: string, value: number, unit: string = "ms") {
  Sentry.metrics.distribution(metricName, value, { unit })
}

export function trackUserAction(actionName: string, metadata?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    category: "user.action",
    message: actionName,
    level: "info",
    data: metadata,
  })

  if (metadata?.error) {
    Sentry.captureException(metadata.error as Error, {
      tags: { userAction: actionName },
    })
  }
}

export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  return function TrackedComponent(props: P) {
    const startTime = performance.now()

    useEffect(() => {
      const endTime = performance.now()
      const duration = endTime - startTime

      trackPerformance(`component.render.${componentName}`, duration)

      if (duration > 500) {
        console.warn(
          `[Performance] ${componentName} rendered in ${Math.round(duration)}ms`
        )
      }
    })

    return <WrappedComponent {...props} />
  }
}
