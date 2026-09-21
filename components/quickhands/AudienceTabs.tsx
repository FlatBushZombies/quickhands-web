"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AudienceTabsProps {
  /** Classes for the outer strip — background/border/tone. */
  className?: string
  /** Classes for the inner row — max-width + horizontal padding, matched to
   * whichever header renders this so the tabs line up with the logo below. */
  containerClassName?: string
}

const TABS = [
  { label: "For Clients", href: "/" },
  { label: "For Professionals", href: "/professionals" },
] as const

/**
 * Thin utility row shared by the landing and professionals navbars — the
 * grey.co-style audience switch (structure only; QuickHands' own green
 * marks the active tab, not their blue). Active state is derived from the
 * route via usePathname rather than local state, so each half of the site
 * always announces itself correctly regardless of which header renders it.
 */
export function AudienceTabs({ className, containerClassName }: AudienceTabsProps) {
  const pathname = usePathname()

  // "For Clients" also owns the client-facing specialist search.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/specialists") : pathname.startsWith(href)

  return (
    <div className={cn("w-full border-b", className)}>
      <div className={cn("mx-auto flex h-9 w-full items-center gap-5", containerClassName)}>
        {TABS.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative inline-flex h-full items-center font-sans text-[11px] font-semibold transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:rounded-sm",
                // Active state is carried by the green underline below, not by
                // green text at this size — text-primary at 11px on a near-white
                // strip lands around 3:1, short of the 4.5:1 body-text floor.
                // Zinc-900 keeps the label legible; the underline still does the
                // green signalling the brief asked for.
                active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {tab.label}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-primary transition-opacity duration-200",
                  active ? "opacity-100" : "opacity-0"
                )}
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
