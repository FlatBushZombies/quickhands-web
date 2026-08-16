import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EmProps {
  children: ReactNode
  className?: string
}

/**
 * Inline editorial accent — renders a word or short phrase in a high-contrast
 * display italic (Instrument Serif, via --font-accent) within an otherwise
 * upright headline (the "Real European employers" move from the Worrki
 * reference). Reserved for one or two headline moments across the whole page
 * — not a formula to repeat on every heading.
 */
export function Em({ children, className }: EmProps) {
  return (
    <span className={cn("font-accent italic text-primary", className)}>
      {children}
    </span>
  )
}
