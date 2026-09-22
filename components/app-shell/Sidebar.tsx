"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { Briefcase, PanelLeftClose, PanelLeftOpen, Plus, Search, Send } from "lucide-react"
import { useAppRole } from "@/components/app/AppRoleContext"
import { getNavItems, getPrimaryAction, isNavActive } from "@/components/app-shell/nav"
import { SCROLL_THIN, getRoleStyles } from "@/components/app-shell/role-styles"

export function Sidebar({
  variant,
  listOpen,
  onToggleList,
  onNavigate,
}: {
  variant: "desktop" | "drawer"
  listOpen?: boolean
  onToggleList?: () => void
  onNavigate?: () => void
}) {
  const { appRole } = useAppRole()
  const { user } = useUser()
  const pathname = usePathname()
  const role = getRoleStyles(appRole)
  const isClient = appRole === "client"

  const navItems = getNavItems(appRole)
  const action = getPrimaryAction(appRole)
  const ActionIcon = isClient ? Plus : Search
  const AccountIcon = isClient ? Briefcase : Send

  const displayName = user?.fullName || user?.firstName || user?.username || "Your account"
  const email = user?.primaryEmailAddress?.emailAddress ?? ""

  return (
    <div className="flex h-full min-h-0 w-full flex-col px-1">
      {/* Wordmark + list-panel toggle — h-[60px] to align with the list
          panel's and pane header's own 60px header band, so all three
          columns' top sections line up on the same horizontal line. */}
      <div className="flex h-[60px] shrink-0 items-center justify-between gap-2 border-b border-border">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={`flex min-w-0 items-center gap-3 rounded-[12px] outline-none ${role.focus}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/quickhands.png" alt="" className="h-10 w-10 shrink-0 rounded-[12px] border border-border bg-card object-cover" />
          <span className="truncate text-[19px] font-medium tracking-tight text-foreground">QuickHands</span>
        </Link>
        {variant === "desktop" && onToggleList ? (
          <button
            type="button"
            onClick={onToggleList}
            aria-expanded={listOpen}
            aria-controls="app-list-panel"
            aria-label={listOpen ? "Hide jobs and messages panel" : "Show jobs and messages panel"}
            title={listOpen ? "Hide jobs and messages" : "Show jobs and messages"}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-border bg-card text-muted-foreground outline-none transition-colors hover:text-foreground ${role.focus}`}
          >
            {listOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      {/* Account card — informational only, roles aren't switchable */}
      <div className="mt-3 flex shrink-0 items-center gap-3 rounded-[12px] border border-border bg-card p-2.5 shadow-sm">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${role.tile}`}>
          <AccountIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{isClient ? "Client account" : "Specialist account"}</p>
          <p className="truncate text-[13px] text-muted-foreground">{displayName}</p>
        </div>
      </div>

      <p id="app-main-menu-label" className="mt-5 shrink-0 px-1 text-xs text-muted-foreground">
        Main menu
      </p>
      <div className="mb-2 mt-2 h-px shrink-0 bg-border" />

      <nav aria-label="Main" className={`min-h-0 flex-1 overflow-y-auto ${SCROLL_THIN}`}>
        <ul className="flex flex-col gap-px">
          {navItems.map((item) => {
            const active = isNavActive(pathname, item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 items-center gap-3 rounded-[10px] border px-3 text-[15px] outline-none transition-colors lg:h-10 ${role.focus} ${
                    active
                      ? `${role.activeItem} font-medium text-foreground`
                      : "border-transparent text-muted-foreground hover:bg-card/70 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? role.text : ""}`} strokeWidth={1.75} />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Primary action + user card */}
      <div className="mt-3 shrink-0">
        <Link
          href={action.href}
          onClick={onNavigate}
          className={`flex h-11 w-full items-center justify-center gap-2 rounded-[12px] text-[13px] font-medium outline-none transition-colors lg:h-10 ${role.solid} ${role.focus} focus-visible:ring-offset-2 focus-visible:ring-offset-secondary`}
        >
          <ActionIcon className="h-4 w-4" />
          {action.label}
        </Link>

        <div className="my-3 h-px bg-border" />

        <div className="flex items-center gap-3 rounded-[12px] border border-border bg-card p-2.5 shadow-sm">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonBox: "shrink-0",
                userButtonAvatarBox: "h-10 w-10 rounded-[12px]!",
                avatarBox: "h-10 w-10 rounded-[12px]!",
                userButtonTrigger: "rounded-[12px]!",
                avatarImage: "rounded-[12px]!",
              },
            }}
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium text-foreground">{displayName}</p>
            {email ? <p className="truncate text-xs text-muted-foreground">{email}</p> : null}
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-muted-foreground">© 2026 QuickHands</p>
      </div>
    </div>
  )
}
