"use client"

import { useEffect, useRef, useState } from "react"
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

export function NotificationBell() {
  const { clerkId } = useAppRole()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const data = await getMyNotifications(clerkId)
      if (!cancelled) setNotifications(data)
    }
    load()
    const interval = setInterval(load, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [clerkId])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleOpen = () => {
    setOpen((current) => !current)
  }

  const handleMarkAllRead = async () => {
    setNotifications((current) => current.map((n) => ({ ...n, read: true })))
    await markAllNotificationsRead(clerkId)
  }

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.read) {
      setNotifications((current) => current.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
      markNotificationRead(notification.id)
    }
    setOpen(false)
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            {unreadCount > 0 ? (
              <button type="button" onClick={handleMarkAllRead} className="text-xs font-medium text-primary hover:underline">
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
            ) : (
              notifications.map((notification) => {
                const Icon = iconFor(notification)
                const content = (
                  <div
                    className={`flex items-start gap-3 border-b border-border/50 px-4 py-3 last:border-0 ${
                      notification.read ? "" : "bg-primary/5"
                    }`}
                  >
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
                  <Link key={notification.id} href={`/messages/${notification.conversationId}`} onClick={() => handleNotificationClick(notification)}>
                    {content}
                  </Link>
                ) : (
                  <button key={notification.id} type="button" className="block w-full text-left" onClick={() => handleNotificationClick(notification)}>
                    {content}
                  </button>
                )
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
