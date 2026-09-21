import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EmProps {
  children: ReactNode
  className?: string
}

/**
 * Inline headline accent — renders a word or short phrase in the brand green
 * at the heaviest weight within an otherwise semibold headline (the "Real
 * European employers" move from the Worrki reference). Previously swapped to
 * a second, italic serif family (Instrument Serif via --font-accent); that
 * was a second family with no role Satoshi at font-bold + color couldn't
 * perform, so the accent now stays in Satoshi (--font-heading) and carries
 * the emphasis on weight + color alone, matching the one-family system.
 * Reserved for one or two headline moments across the whole page — not a
 * formula to repeat on every heading.
 */
export function Em({ children, className }: EmProps) {
  return (
    <span className={cn("font-heading font-bold text-primary", className)}>
      {children}
    </span>
  )
}
