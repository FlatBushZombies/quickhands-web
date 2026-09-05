"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { useAppRole } from "@/components/app/AppRoleContext"

export function AppHeader() {
  const { appRole } = useAppRole()
  const pathname = usePathname()

  const navLinks =
    appRole === "client"
      ? [
          { href: "/jobs", label: "Browse jobs" },
          { href: "/post-job", label: "Post a job" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/messages", label: "Messages" },
          { href: "/settings", label: "Settings" },
        ]
      : [
          { href: "/jobs", label: "Browse jobs" },
          { href: "/dashboard", label: "My applications" },
          { href: "/messages", label: "Messages" },
          { href: "/settings", label: "Settings" },
        ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
          <img src="/quickhands.png" alt="" className="h-7 w-7 rounded-md" />
          quickhands
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Mobile nav — simple wrapped row under the header bar */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 sm:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
