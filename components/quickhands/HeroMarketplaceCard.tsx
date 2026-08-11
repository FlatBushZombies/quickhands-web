"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ClipboardList, UserSearch, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    icon: ClipboardList,
    title: "Post a task",
    description: "Tell us what you need.",
  },
  {
    icon: UserSearch,
    title: "Find a specialist",
    description: "Choose the right person.",
  },
  {
    icon: CheckCircle2,
    title: "Get it done",
    description: "Simple from start to finish.",
  },
] as const

const AUTO_ADVANCE_MS = 3400

interface HeroMarketplaceCardProps {
  className?: string
}

/**
 * Floating glass "trust card" near the hero visual. Cycles through the
 * three-step promise (post -> find -> get it done) on a timer, pausable on
 * hover/focus, with small dot controls for manual navigation.
 */
export function HeroMarketplaceCard({ className }: HeroMarketplaceCardProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (prefersReducedMotion || paused) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % STEPS.length)
    }, AUTO_ADVANCE_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [prefersReducedMotion, paused])

  const step = STEPS[index]
  const Icon = step.icon

  return (
    <motion.div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", bounce: 0, duration: 0.8, delay: 0.5 }}
      className={cn(
        "w-[260px] rounded-3xl border border-zinc-200 bg-white/92 p-5 shadow-[0_20px_50px_-15px_rgba(9,9,11,0.25)] backdrop-blur-xl sm:w-[280px]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          How QuickHands works
        </span>
        <span className="font-mono text-[10px] tabular-nums text-zinc-400">
          {index + 1}/{STEPS.length}
        </span>
      </div>

      <div className="mt-4 min-h-[92px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.title}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.45 }}
            className="flex items-start gap-3"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold text-zinc-950">{step.title}</p>
              <p className="mt-0.5 font-sans text-xs leading-relaxed text-zinc-500">
                {step.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-1.5" role="tablist" aria-label="How QuickHands works, steps">
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show step ${i + 1}: ${s.title}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-6 bg-primary" : "w-1.5 bg-zinc-200 hover:bg-zinc-300"
            )}
          />
        ))}
      </div>
    </motion.div>
  )
}
