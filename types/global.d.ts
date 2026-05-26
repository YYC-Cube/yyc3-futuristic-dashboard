interface Window {
  Sentry?: {
    captureException: (error: Error, context?: Record<string, unknown>) => string
    captureMessage: (message: string, context?: Record<string, unknown>) => string
    addBreadcrumb: (breadcrumb: Record<string, unknown>) => void
    metrics: {
      distribution: (name: string, value: number, options?: { unit?: string }) => void
    }
  }
}
