"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Menu } from "lucide-react"
import { useAppRole } from "@/components/app/AppRoleContext"
import { NotificationBell } from "@/components/app/NotificationBell"
import { getRoleStyles } from "@/components/app-shell/role-styles"

/** Compact top bar below `lg`: hamburger (opens the sidebar drawer), logo, bell, account. */
export function MobileTopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { appRole } = useAppRole()
  const role = getRoleStyles(appRole)

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-2 lg:hidden">
      <div className="flex min-w-0 items-center gap-1">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className={`flex h-11 w-11 items-center justify-center rounded-[12px] text-foreground outline-none transition-colors hover:bg-secondary ${role.focus}`}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className={`flex min-w-0 items-center gap-2 rounded-[12px] py-1 pr-2 outline-none ${role.focus}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/quickhands.png" alt="" className="h-8 w-8 shrink-0 rounded-[10px] object-cover" />
          <span className="truncate text-[17px] font-medium tracking-tight text-foreground">QuickHands</span>
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <NotificationBell />
        <div className="flex h-11 w-11 items-center justify-center">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
