"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, MessageCircle, Star, Briefcase, CheckCircle2, XCircle } from "lucide-react"
import { useAppRole } from "@/components/app/AppRoleContext"
import { getMyNotifications, markAllNotificationsRead, markNotificationRead, type AppNotification } from "@/lib/notifications-api"

const POLL_INTERVAL_MS = 15000

function iconFor(notification: AppNotification) {
  const message = notification.message.toLowerCase()
  if (notification.type === "new_application" || message.includes("applied")) return Briefcase
  if (message.includes("accepted")) return CheckCircle2
  if (message.includes("rejected") || message.includes("declined")) return XCircle
  if (message.includes("review")) return Star
  if (notification.conversationId) return MessageCircle
  return Bell
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

export function NotificationsPanel() {
  const { clerkId } = useAppRole()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const data = await getMyNotifications(clerkId)
      if (!cancelled) {
        setNotifications(data.slice(0, 8))
        setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [clerkId])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleClick = (notification: AppNotification) => {
    if (notification.read) return
    setNotifications((current) => current.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
    markNotificationRead(notification.id)
  }

  if (loading) {
    return <div className="h-32 animate-pulse rounded-2xl bg-secondary" />
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">Notifications</p>
        </div>
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={() => {
              setNotifications((current) => current.map((n) => ({ ...n, read: true })))
              markAllNotificationsRead(clerkId)
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">Nothing yet — you&apos;ll see updates here.</p>
      ) : (
        <div>
          {notifications.map((notification) => {
            const Icon = iconFor(notification)
            const content = (
              <div className={`flex items-start gap-3 border-b border-border/50 px-5 py-3 last:border-0 ${notification.read ? "" : "bg-primary/5"}`}>
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{notification.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(notification.createdAt)}</p>
                </div>
                {!notification.read ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
              </div>
            )

            return notification.conversationId ? (
              <Link key={notification.id} href={`/messages/${notification.conversationId}`} onClick={() => handleClick(notification)}>
                {content}
              </Link>
            ) : (
              <button key={notification.id} type="button" className="block w-full text-left" onClick={() => handleClick(notification)}>
                {content}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
