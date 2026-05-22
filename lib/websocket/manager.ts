type MessageHandler = (data: unknown) => void

type EventType = "room_status" | "order_update" | "notification" | "inventory_alert"

interface WSMessage {
  type: EventType
  payload: unknown
  timestamp: string
}

interface WebSocketManagerOptions {
  url: string
  token?: string
  reconnectInterval?: number
  maxRetries?: number
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private url: string
  private token: string | null = null
  private reconnectInterval: number
  private maxRetries: number
  private retryCount = 0
  private listeners: Map<string, Set<MessageHandler>> = new Map()
  private isConnected = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  constructor(options: WebSocketManagerOptions) {
    this.url = options.url
    this.token = options.token || null
    this.reconnectInterval = options.reconnectInterval || 3000
    this.maxRetries = options.maxRetries || 10
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return

    try {
      const wsUrl = this.token
        ? `${this.url}?token=${this.token}`
        : this.url
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        this.isConnected = true
        this.retryCount = 0
        this.emit("connection_status", { status: "connected" })
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data)
          this.emit(message.type, message.payload)
        } catch {}
      }

      this.ws.onclose = () => {
        this.isConnected = false
        this.emit("connection_status", { status: "disconnected" })
        this.attemptReconnect()
      }

      this.ws.onerror = () => {
        this.isConnected = false
        this.emit("connection_status", { status: "error" })
      }
    } catch {
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.retryCount >= this.maxRetries) return
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)

    this.reconnectTimer = setTimeout(() => {
      this.retryCount++
      this.connect()
    }, this.reconnectInterval * Math.min(this.retryCount + 1, 5))
  }

  private emit(type: string, data: unknown) {
    const handlers = this.listeners.get(type)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type)!.add(handler)
    return () => this.off(type, handler)
  }

  off(type: string, handler: MessageHandler) {
    this.listeners.get(type)?.delete(handler)
  }

  send(type: string, payload: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload, timestamp: new Date().toISOString() }))
    }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.retryCount = this.maxRetries
    this.ws?.close()
    this.ws = null
    this.isConnected = false
  }

  getConnectionStatus() {
    return this.isConnected
  }
}

let wsInstance: WebSocketManager | null = null

export function getWebSocketManager(): WebSocketManager | null {
  if (typeof window === "undefined") return null

  if (!wsInstance) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/api/ws"
    const token = typeof window !== "undefined" ? localStorage.getItem("yyc3_auth_token") : null

    wsInstance = new WebSocketManager({
      url: wsUrl,
      token: token || undefined,
      reconnectInterval: 3000,
      maxRetries: 10,
    })
  }

  return wsInstance
}

export type { WebSocketManager, EventType, WSMessage }
