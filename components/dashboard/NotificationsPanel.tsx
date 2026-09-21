"use client"

import { Fragment, useEffect, useState } from "react"
import Link from "next/link"
import { Bell, MessageCircle, Star, Briefcase, CheckCircle2, XCircle } from "lucide-react"
import { useAppRole } from "@/components/app/AppRoleContext"
import { DateDivider, FeedSkeleton, dayBucket, timeAgo } from "@/components/app-shell/feed"
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
    return <FeedSkeleton />
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Notifications</p>
        </div>
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={() => {
              setNotifications((current) => current.map((n) => ({ ...n, read: true })))
              markAllNotificationsRead(clerkId)
            }}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-primary outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Nothing yet — you&apos;ll see updates here.</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => {
            const Icon = iconFor(notification)
            // Newest-first: a "Today" / "Earlier" divider where the day bucket changes.
            const bucket = dayBucket(notification.createdAt)
            const showDivider = index === 0 || bucket !== dayBucket(notifications[index - 1].createdAt)
            const content = (
              <div className={`flex items-start gap-3 rounded-[12px] px-3 py-3 transition-colors hover:bg-secondary/60 ${notification.read ? "" : "bg-primary/5"}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] text-foreground">{notification.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(notification.createdAt)}</p>
                </div>
                {!notification.read ? <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
              </div>
            )

            return (
              <Fragment key={notification.id}>
                {showDivider ? <DateDivider label={bucket} /> : null}
                <li className="border-b border-border/60 py-0.5 last:border-b-0">
                  {notification.conversationId ? (
                    <Link
                      href={`/messages/${notification.conversationId}`}
                      onClick={() => handleClick(notification)}
                      className="block rounded-[12px] outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="block w-full rounded-[12px] text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                      onClick={() => handleClick(notification)}
                    >
                      {content}
                    </button>
                  )}
                </li>
              </Fragment>
            )
          })}
        </ul>
      )}
    </div>
  )
}
