"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { fetchWithRetry } from "@/lib/fetch-client"

export interface ServerMessage {
  id: string
  conversationId: string
  senderId: string
  senderName?: string
  text: string
  createdAt: string
  clientMessageId?: string
}

interface SendMessageInput {
  tag?: string
  note?: string
  label?: string
  clientMessageId?: string
}

interface Options {
  serverUrl: string
  apiBaseUrl: string
  getToken: () => Promise<string | null>
  conversationId: string
  enabled?: boolean
}

// Guards against NEXT_PUBLIC_API_URL ever accidentally pointing at a
// Vercel-hosted host — Vercel serverless can't hold WebSocket sessions.
// serverUrl here is always the Express API on Render, not Vercel, so this
// is a no-op today; kept for parity with the mobile hook this is ported
// from (freelance-app/hooks/useMessagingSocket.ts) and as a tripwire.
function isUnsupportedSocketHost(serverUrl: string) {
  return /(^|:\/\/)[^/]*vercel\.app(\/|$)/i.test(serverUrl)
}

/**
 * Direct port of freelance-app/hooks/useMessagingSocket.ts for the browser.
 * The native hook wraps getToken() in waitForClerkToken to paper over a
 * native session-restore race — Clerk's web SDK has no equivalent race
 * once useUser().isLoaded is true, so callers just need to not mount this
 * until Clerk has loaded (no polling wrapper needed here).
 */
export function useMessagingSocket({ serverUrl, apiBaseUrl, getToken, conversationId, enabled = true }: Options) {
  const socketRef = useRef<Socket | null>(null)
  const getTokenRef = useRef(getToken)
  const [connected, setConnected] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [messages, setMessages] = useState<ServerMessage[]>([])
  const [lastError, setLastError] = useState<string | null>(null)
  const realtimeEnabled = enabled && !isUnsupportedSocketHost(serverUrl)

  useEffect(() => {
    getTokenRef.current = getToken
  }, [getToken])

  const appendMessage = useCallback((incoming: ServerMessage) => {
    setMessages((prev) => {
      const exists = prev.some(
        (message) =>
          message.id === incoming.id ||
          (!!incoming.clientMessageId && incoming.clientMessageId === message.clientMessageId)
      )
      if (exists) return prev
      return [...prev, incoming].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    })
  }, [])

  useEffect(() => {
    if (!enabled || !conversationId) return

    let cancelled = false
    let socket: Socket | null = null
    const baseApiUrl = apiBaseUrl.replace(/\/$/, "").replace(/\/api\/?$/, "")

    ;(async () => {
      const token = await getTokenRef.current()
      if (!token || cancelled) {
        setLastError("Not signed in")
        setLoadingHistory(false)
        return
      }

      try {
        const response = await fetchWithRetry(
          `${baseApiUrl}/api/messaging/conversations/${encodeURIComponent(conversationId)}/messages`,
          { headers: { Authorization: `Bearer ${token}` } },
          { retries: 1, timeoutMs: 8000, retryDelayMs: 2000 }
        )
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load messages")
        }
        if (!cancelled) {
          setMessages(data.messages || [])
        }
      } catch (error) {
        if (!cancelled) {
          setLastError(error instanceof Error ? error.message : "Failed to load messages")
        }
      } finally {
        if (!cancelled) {
          setLoadingHistory(false)
        }
      }

      if (realtimeEnabled) {
        socket = io(serverUrl, {
          auth: { token },
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
        })

        socketRef.current = socket

        socket.on("connect", () => {
          setConnected(true)
          setLastError(null)
          socket!.emit("join_conversation", { conversationId }, (err: unknown) => {
            if (err) setLastError(JSON.stringify(err))
          })
        })

        socket.on("disconnect", () => setConnected(false))
        socket.on("connect_error", (error: Error) => setLastError(error.message))
        socket.on("message", (message: ServerMessage) => appendMessage(message))
      } else if (!cancelled) {
        setConnected(false)
      }
    })()

    return () => {
      cancelled = true
      if (socket) {
        socket.emit("leave_conversation", { conversationId })
        socket.removeAllListeners()
        socket.close()
      }
      socketRef.current = null
      setConnected(false)
    }
  }, [apiBaseUrl, appendMessage, conversationId, enabled, realtimeEnabled, serverUrl])

  // Safety-net polling whenever the socket isn't actively connected —
  // browsers throttle background-tab WebSockets at least as aggressively
  // as native apps, so this stays relevant on web too.
  useEffect(() => {
    if (!enabled || !conversationId || connected) return

    let cancelled = false
    const baseApiUrl = apiBaseUrl.replace(/\/$/, "").replace(/\/api\/?$/, "")

    const pollMessages = async () => {
      const token = await getTokenRef.current()
      if (!token || cancelled) return

      try {
        const response = await fetchWithRetry(
          `${baseApiUrl}/api/messaging/conversations/${encodeURIComponent(conversationId)}/messages`,
          { headers: { Authorization: `Bearer ${token}` } },
          { retries: 0, timeoutMs: 6000 }
        )
        const data = await response.json()
        if (!cancelled && response.ok && data.success && Array.isArray(data.messages)) {
          data.messages.forEach(appendMessage)
        }
      } catch {
        // Transient network error — the next interval tick will retry.
      }
    }

    const intervalId = setInterval(pollMessages, 4000)
    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [apiBaseUrl, appendMessage, connected, conversationId, enabled])

  const sendMessage = useCallback(
    async ({ tag, note, label, clientMessageId }: SendMessageInput) => {
      const trimmedTag = tag?.trim() || ""
      const trimmedNote = note?.trim() || ""
      const trimmedLabel = label?.trim() || ""
      if (!trimmedTag && !trimmedLabel) return

      const resolvedToken = await getTokenRef.current()
      if (!resolvedToken) {
        setLastError("Not signed in")
        return
      }

      const baseApiUrl = apiBaseUrl.replace(/\/$/, "").replace(/\/api\/?$/, "")
      const payload = {
        ...(trimmedTag ? { tag: trimmedTag } : {}),
        ...(trimmedNote ? { note: trimmedNote } : {}),
        ...(trimmedLabel ? { label: trimmedLabel } : {}),
        ...(clientMessageId ? { clientMessageId } : {}),
      }

      const sendViaHttp = async () => {
        const response = await fetchWithRetry(
          `${baseApiUrl}/api/messaging/conversations/${encodeURIComponent(conversationId)}/messages`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${resolvedToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
          { retries: 1, timeoutMs: 10000, retryDelayMs: 2000 }
        )
        const data = await response.json()
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to send message")
        }
        appendMessage(data.message)
      }

      const socket = socketRef.current
      if (!socket?.connected) {
        await sendViaHttp()
        return
      }

      try {
        await new Promise<void>((resolve, reject) => {
          socket.emit("send_message", { conversationId, ...payload }, (err: unknown) => {
            if (err) {
              reject(new Error(typeof err === "string" ? err : JSON.stringify(err)))
              return
            }
            resolve()
          })
        })
      } catch (error) {
        try {
          await sendViaHttp()
        } catch (fallbackError) {
          setLastError(
            fallbackError instanceof Error
              ? fallbackError.message
              : error instanceof Error
                ? error.message
                : "Failed to send message"
          )
        }
      }
    },
    [apiBaseUrl, appendMessage, conversationId]
  )

  return { connected, realtimeEnabled, loadingHistory, messages, sendMessage, lastError }
}
