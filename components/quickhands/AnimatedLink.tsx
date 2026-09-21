"use client"

import type { MouseEvent, ReactNode } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedLinkProps {
  href: string
  children: ReactNode
  className?: string
  tone?: "light" | "dark"
  /** Called instead of navigating (e.g. smooth-scroll to an in-page anchor). */
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

/**
 * Text link with an arrow that nudges forward on hover/focus.
 * Used for secondary CTAs ("Browse Tasks", "Learn how it works", nav-adjacent links).
 */
export function AnimatedLink({ href, children, className, tone = "light", onClick }: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-sm font-sans text-xs font-semibold transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        tone === "light"
          ? "text-zinc-600 hover:text-zinc-950 focus-visible:ring-primary/50 focus-visible:ring-offset-white"
          : "text-white/80 hover:text-white focus-visible:ring-white/70 focus-visible:ring-offset-black/40",
        className
      )}
    >
      <span className="relative">
        {children}
        <span
          className={cn(
            "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100",
            tone === "light" ? "bg-zinc-950" : "bg-white"
          )}
          aria-hidden="true"
        />
      </span>
      <ChevronRight
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  )
}
