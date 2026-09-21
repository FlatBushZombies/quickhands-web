import {
  LayoutDashboard,
  MessageSquare,
  Search,
  Send,
  Settings,
  SquarePlus,
  UserSearch,
  type LucideIcon,
} from "lucide-react"
import type { AppRole } from "@/lib/user-api"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

/**
 * Same links, same order as the old AppHeader — plus one client-only
 * "Find specialists" entry at the top (a public page outside this shell).
 */
export function getNavItems(role: AppRole): NavItem[] {
  if (role === "client") {
    return [
      { href: "/specialists", label: "Find specialists", icon: UserSearch },
      { href: "/jobs", label: "Browse jobs", icon: Search },
      { href: "/post-job", label: "Post a job", icon: SquarePlus },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/messages", label: "Messages", icon: MessageSquare },
      { href: "/settings", label: "Settings", icon: Settings },
    ]
  }
  return [
    { href: "/jobs", label: "Browse jobs", icon: Search },
    { href: "/dashboard", label: "My applications", icon: Send },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ]
}

/** Identical to the pathname logic AppHeader used. */
export function isNavActive(pathname: string | null, href: string) {
  return pathname === href || Boolean(pathname?.startsWith(`${href}/`))
}

/** Routes inside the shell that aren't nav entries for every role. */
const FALLBACK_TITLES: Record<string, string> = {
  "/post-job": "Post a job",
}

export function getPaneTitle(pathname: string | null, role: AppRole) {
  const item = getNavItems(role).find((entry) => isNavActive(pathname, entry.href))
  if (item) return item.label
  const fallback = Object.entries(FALLBACK_TITLES).find(([href]) => isNavActive(pathname, href))
  return fallback ? fallback[1] : "QuickHands"
}

export function getPrimaryAction(role: AppRole) {
  return role === "client"
    ? { href: "/post-job", label: "Post a job" }
    : { href: "/jobs", label: "Browse jobs" }
}
