"use client"

import { usePathname } from "next/navigation"
import { useAppRole } from "@/components/app/AppRoleContext"
import { NotificationBell } from "@/components/app/NotificationBell"
import { getPaneTitle } from "@/components/app-shell/nav"
import { useShellData } from "@/components/app-shell/ShellData"

/**
 * Meta line under the pane title, built only from data the shell already
 * holds (dot-separated, muted). Empty until that data has loaded.
 */
function useMeta(pathname: string | null): string[] {
  const { appRole } = useAppRole()
  const { jobs, jobsState, conversations, conversationsState } = useShellData()
  const parts: string[] = []

  if (pathname === "/dashboard" && jobsState === "ready" && jobs.length > 0) {
    if (appRole === "client") {
      parts.push(`${jobs.length} job${jobs.length === 1 ? "" : "s"}`)
      const pending = jobs.reduce((sum, job) => sum + (job.pending ?? 0), 0)
      if (pending > 0) parts.push(`${pending} pending`)
    } else {
      parts.push(`${jobs.length} application${jobs.length === 1 ? "" : "s"}`)
    }
  }

  if (pathname?.startsWith("/messages") && conversationsState === "ready" && conversations.length > 0) {
    parts.push(`${conversations.length} conversation${conversations.length === 1 ? "" : "s"}`)
    const unread = conversations.reduce((sum, conversation) => sum + conversation.unreadCount, 0)
    if (unread > 0) parts.push(`${unread} unread`)
  }

  return parts
}

export function PaneHeader() {
  const { appRole } = useAppRole()
  const pathname = usePathname()
  const title = getPaneTitle(pathname, appRole)
  const meta = useMeta(pathname)

  return (
    // z-20 so the notification dropdown (absolute, z-50 inside this stacking
    // context) paints above the scrolling body below it.
    <header className="relative z-20 flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-border px-5">
      <div className="min-w-0">
        {/* Not an <h1>: each page keeps its own heading. */}
        <p className="truncate text-[19px] font-medium leading-tight text-foreground">{title}</p>
        {meta.length > 0 ? (
          <p className="truncate text-xs text-muted-foreground">
            {meta.map((part, index) => (
              <span key={part}>
                {index > 0 ? <span aria-hidden="true"> • </span> : null}
                {part}
              </span>
            ))}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <NotificationBell />
      </div>
    </header>
  )
}
