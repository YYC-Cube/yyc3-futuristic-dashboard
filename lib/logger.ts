enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  module: string
  message: string
  data?: Record<string, unknown>
  error?: Error
}

class Logger {
  private static instance: Logger
  private logLevel: LogLevel
  private isProduction: boolean

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.logLevel = this.isProduction ? LogLevel.WARN : LogLevel.DEBUG
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(entry: LogEntry): string {
    const levelEmoji = {
      [LogLevel.DEBUG]: '🔍',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌',
    }

    const prefix = `[${entry.timestamp}] ${levelEmoji[entry.level]} [${entry.module}]`

    if (entry.data) {
      return `${prefix} ${entry.message} ${JSON.stringify(entry.data)}`
    }

    if (entry.error) {
      return `${prefix} ${entry.message}\n${entry.error.stack || entry.error.message}`
    }

    return `${prefix} ${entry.message}`
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
  }

  private sendToSentry(level: LogLevel, entry: LogEntry): void {
    if (typeof window !== 'undefined' && window.Sentry) {
      const sentryLevel = {
        [LogLevel.DEBUG]: 'debug' as const,
        [LogLevel.INFO]: 'info' as const,
        [LogLevel.WARN]: 'warning' as const,
        [LogLevel.ERROR]: 'error' as const,
      }

      const context = {
        tags: {
          module: entry.module,
          environment: process.env.NODE_ENV,
        },
        extra: {
          timestamp: entry.timestamp,
          ...entry.data,
        },
        level: sentryLevel[level],
      }

      if (entry.error) {
        window.Sentry.captureException(entry.error, context)
      } else {
        window.Sentry.captureMessage(entry.message, context)
      }
    }
  }

  debug(module: string, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      module,
      message,
      data,
    }

    console.debug(this.formatMessage(entry))
    
    if (this.isProduction) {
      this.sendToSentry(LogLevel.DEBUG, entry)
    }
  }

  info(module: string, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      module,
      message,
      data,
    }

    console.info(this.formatMessage(entry))
    
    if (this.isProduction) {
      this.sendToSentry(LogLevel.INFO, entry)
    }
  }

  warn(module: string, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      module,
      message,
      data,
    }

    console.warn(this.formatMessage(entry))
    
    if (this.isProduction) {
      this.sendToSentry(LogLevel.WARN, entry)
    }
  }

  error(module: string, message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return

    const errorObj = error instanceof Error ? error : error ? new Error(String(error)) : undefined

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      module,
      message,
      error: errorObj,
      data,
    }

    console.error(this.formatMessage(entry))
    
    if (this.isProduction) {
      this.sendToSentry(LogLevel.ERROR, entry)
    }
  }
}

export const logger = Logger.getInstance()

export default logger
