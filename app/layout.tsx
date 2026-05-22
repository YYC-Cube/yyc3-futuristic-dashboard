import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { ErrorBoundary } from '@/components/common/error-boundary'
import AppShell from '@/components/common/app-shell'
import './globals.css'

export const metadata: Metadata = {
  title: 'YYC3 智慧商家管理系统',
  description: '面向KTV/娱乐场所的全栈数字化管理平台',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <AppShell>
              {children}
            </AppShell>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
