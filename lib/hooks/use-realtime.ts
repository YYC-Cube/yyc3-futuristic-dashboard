"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { getWebSocketManager, type EventType } from "../websocket/manager"

interface UseWebSocketOptions {
  events?: EventType[]
  onMessage?: (type: string, payload: unknown) => void
  autoConnect?: boolean
}

export function useRealtime(options: UseWebSocketOptions = {}) {
  const { events = [], onMessage, autoConnect = true } = options
  const [connected, setConnected] = useState(false)
  const cleanupRef = useRef<Array<() => void>>([])

  useEffect(() => {
    const ws = getWebSocketManager()
    if (!ws) return

    if (autoConnect) {
      ws.connect()
    }

    const unsubConnect = ws.on("connection_status", (data) => {
      const status = data as { status: string }
      setConnected(status.status === "connected")
    })

    cleanupRef.current.push(unsubConnect)

    if (onMessage) {
      events.forEach((eventType) => {
        const unsub = ws.on(eventType, (payload) => {
          onMessage(eventType, payload)
        })
        cleanupRef.current.push(unsub)
      })
    }

    return () => {
      cleanupRef.current.forEach((fn) => fn())
      cleanupRef.current = []
    }
  }, [autoConnect, events, onMessage])

  const send = useCallback((type: string, payload: unknown) => {
    const ws = getWebSocketManager()
    ws?.send(type, payload)
  }, [])

  const disconnect = useCallback(() => {
    const ws = getWebSocketManager()
    ws?.disconnect()
  }, [])

  return { connected, send, disconnect }
}
