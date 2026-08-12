"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface EyebrowProps {
  children: ReactNode
  className?: string
  /** Render on a dark surface (e.g. the intro loader / dark sections). */
  tone?: "light" | "dark"
  /** Skip the entrance animation (parent already staggers it, or it's above the fold and must be instant). */
  animate?: boolean
  delay?: number
  /** Swap the dash accent for a small pulsing dot — reserved for genuine "live" status labels. */
  pulse?: boolean
}

/**
 * Small tracked-uppercase label with a short rule accent — plain text, no
 * pill/border/background. Deliberately restrained (not a badge) so it can
 * repeat across sections without reading as the same rounded chip everywhere.
 * Shared across Hero and later sections (HowItWorks, TaskCategories, etc.)
 */
export function Eyebrow({
  children,
  className,
  tone = "light",
  animate = true,
  delay = 0,
  pulse = false,
}: EyebrowProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em]",
        tone === "light" ? "text-primary" : "text-white/80",
        className
      )}
    >
      <span
        className={cn(
          "shrink-0 bg-primary",
          pulse ? "h-1.5 w-1.5 rounded-full animate-pulse" : "h-px w-5"
        )}
        aria-hidden="true"
      />
      {children}
    </span>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", bounce: 0, duration: 0.6, delay }}
      className="inline-block"
    >
      {content}
    </motion.div>
  )
}
