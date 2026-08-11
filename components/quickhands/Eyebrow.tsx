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
}

/**
 * Small uppercase label pill with a soft dot indicator.
 * Shared across Hero and later sections (HowItWorks, TaskCategories, etc.)
 */
export function Eyebrow({
  children,
  className,
  tone = "light",
  animate = true,
  delay = 0,
}: EyebrowProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] shadow-sm",
        tone === "light"
          ? "border-primary/15 bg-primary/5 text-primary"
          : "border-white/15 bg-white/8 text-white/90 backdrop-blur-sm",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          tone === "light" ? "bg-primary" : "bg-primary"
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
