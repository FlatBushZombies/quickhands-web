"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Hash, Plus, Search, Settings, SquarePen, type LucideIcon } from "lucide-react"
import { useAppRole } from "@/components/app/AppRoleContext"
import { Avatar } from "@/components/app-shell/Avatar"
import { SCROLL_THIN, getRoleStyles } from "@/components/app-shell/role-styles"
import { useShellData, type ShellLoadState } from "@/components/app-shell/ShellData"
import type { ApplicationStatus } from "@/lib/applications-api"

const STATUS_DOT: Record<ApplicationStatus, string> = {
  pending: "bg-muted-foreground/60",
  accepted: "bg-primary",
  rejected: "bg-destructive",
  completed: "bg-primary",
}

function CountBadge({ count, label }: { count: number; label: string }) {
  return (
    <span
      className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-[6px] bg-destructive px-1 text-[11px] font-bold text-white"
      aria-label={label}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}

function RowSkeleton() {
  return (
    <div className="space-y-1 px-2 pb-2" aria-hidden="true">
      {[0, 1, 2].map((key) => (
        <div key={key} className="h-8 animate-pulse rounded-[8px] bg-secondary motion-reduce:animate-none" />
      ))}
    </div>
  )
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  const { appRole } = useAppRole()
  const role = getRoleStyles(appRole)

  return (
    <section className="border-b border-border last:border-b-0">
      <h2 className="m-0">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls={`${id}-body`}
          className={`flex w-full items-center justify-between px-4 py-3 text-base font-medium text-foreground outline-none ${role.focus} focus-visible:ring-inset`}
        >
          {title}
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform motion-reduce:transition-none ${open ? "" : "-rotate-90"}`}
          />
        </button>
      </h2>
      <div id={`${id}-body`} hidden={!open} className="px-2 pb-3">
        {children}
      </div>
    </section>
  )
}

function Quiet({ children }: { children: React.ReactNode }) {
  return <p className="px-2 py-1.5 text-[13px] text-muted-foreground">{children}</p>
}

function stateMessage(state: ShellLoadState, empty: string) {
  return state === "error" ? "Couldn't load right now." : empty
}

export function ListPanel() {
  const { appRole } = useAppRole()
  const role = getRoleStyles(appRole)
  const pathname = usePathname()
  const { jobs, jobsState, conversations, conversationsState } = useShellData()
  const isClient = appRole === "client"

  const toolbar: { href: string; label: string; icon: LucideIcon }[] = isClient
    ? [
        { href: "/post-job", label: "Post a job", icon: SquarePen },
        { href: "/specialists", label: "Find specialists", icon: Search },
      ]
    : [
        { href: "/jobs", label: "Browse jobs", icon: Search },
        { href: "/settings", label: "Settings", icon: Settings },
      ]

  const rowBase = "group flex h-8 items-center gap-2 rounded-[8px] border px-2 text-sm outline-none transition-colors"

  return (
    <div className="flex h-full min-h-0 w-[260px] flex-col rounded-[20px] border border-border bg-card">
      <div className="flex h-[60px] shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <p className="truncate text-[17px] font-medium text-foreground">Jobs &amp; messages</p>
        <div className="flex shrink-0 items-center gap-0.5">
          {toolbar.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              className={`flex h-8 w-8 items-center justify-center rounded-[10px] text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground ${role.focus}`}
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>

      <div className={`min-h-0 flex-1 overflow-y-auto rounded-b-[19px] ${SCROLL_THIN}`}>
        <Section id="shell-jobs" title={isClient ? "Jobs" : "Applications"}>
          {jobsState === "loading" ? (
            <RowSkeleton />
          ) : jobs.length === 0 ? (
            <Quiet>{stateMessage(jobsState, isClient ? "No jobs posted yet." : "No applications yet.")}</Quiet>
          ) : (
            <ul className="flex flex-col gap-px">
              {jobs.map((job) => (
                <li key={job.id}>
                  <Link
                    href="/dashboard"
                    className={`${rowBase} border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground ${role.focus}`}
                  >
                    <Hash className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                    <span className="min-w-0 flex-1 truncate">{job.title}</span>
                    {job.pending && job.pending > 0 ? (
                      <CountBadge count={job.pending} label={`${job.pending} pending applicant${job.pending === 1 ? "" : "s"}`} />
                    ) : null}
                    {job.status ? (
                      <span className="flex shrink-0 items-center gap-1 text-[11px] capitalize text-muted-foreground">
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[job.status]}`} aria-hidden="true" />
                        {job.status}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={isClient ? "/post-job" : "/jobs"}
            className={`${rowBase} mt-1 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground ${role.focus}`}
          >
            <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{isClient ? "Post a job" : "Browse jobs"}</span>
          </Link>
        </Section>

        <Section id="shell-messages" title="Messages">
          {conversationsState === "loading" ? (
            <RowSkeleton />
          ) : conversations.length === 0 ? (
            <Quiet>{stateMessage(conversationsState, "No conversations yet.")}</Quiet>
          ) : (
            <ul className="flex flex-col gap-px">
              {conversations.map((conversation) => {
                const href = `/messages/${conversation.conversationId}`
                const active = pathname === href
                return (
                  <li key={conversation.conversationId}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`${rowBase} ${role.focus} ${
                        active
                          ? `${role.activeItem} font-medium text-foreground`
                          : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Avatar name={conversation.otherUser.displayName} imageUrl={conversation.otherUser.imageUrl} size="sm" />
                      <span className="min-w-0 flex-1 truncate">{conversation.otherUser.displayName}</span>
                      {conversation.unreadCount > 0 ? (
                        <CountBadge
                          count={conversation.unreadCount}
                          label={`${conversation.unreadCount} unread message${conversation.unreadCount === 1 ? "" : "s"}`}
                        />
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Section>
      </div>
    </div>
  )
}
