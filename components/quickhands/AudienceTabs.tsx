"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AudienceTabsProps {
  /** Extra classes for the outer strip. */
  className?: string
  /** Classes for the inner row — max-width + horizontal padding, matched to
   * whichever header renders this so the switch lines up with the logo below. */
  containerClassName?: string
}

const TABS = [
  { label: "For Clients", href: "/" },
  { label: "For Professionals", href: "/professionals" },
] as const

/**
 * The client / professional mode switch shared by both navbars. A compact
 * segmented control on an opaque neutral strip (never translucent — the
 * navbar sits over a photo hero and the picture must not bleed through).
 * The active mode is the raised white segment with darker text, so it reads
 * at a glance without leaning on colour or an underline. Active state comes
 * from the route via usePathname, so each half of the site always announces
 * itself correctly regardless of which header renders it.
 */
export function AudienceTabs({ className, containerClassName }: AudienceTabsProps) {
  const pathname = usePathname()

  // "For Clients" also owns the client-facing specialist search.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/specialists") : pathname.startsWith(href)

  return (
    <div className={cn("w-full border-b border-[#ECECEC] bg-zinc-50", className)}>
      <div className={cn("mx-auto flex h-11 w-full items-center", containerClassName)}>
        <nav aria-label="Audience" className="inline-flex items-center rounded-[10px] bg-zinc-100 p-0.5">
          {TABS.map((tab) => {
            const active = isActive(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-7 items-center rounded-[8px] px-3.5 font-sans text-[13px] font-medium transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1",
                  active
                    ? "bg-white text-zinc-950 shadow-[0_0_0_1px_#E8E8E8,0_1px_2px_rgba(0,0,0,0.05)]"
                    : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
