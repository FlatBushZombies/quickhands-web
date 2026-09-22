"use client"

import { useCallback, useRef, useState } from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { LayoutGrid, Star, Users } from "lucide-react"
import { Eyebrow } from "./Eyebrow"

/**
 * All three figures are reused verbatim from components/HeroSection.tsx's
 * trust band ("48+" / Categories, "4.9★" / Avg rating, "Join 2+
 * professionals") — no new numbers are introduced. Each value string is
 * parsed only for the count-up animation below; the strings themselves
 * (what actually ships if JS/animation is off) are untouched.
 */
const STATS = [
  { value: "48+", label: "Categories", icon: LayoutGrid },
  { value: "4.9★", label: "Avg rating", icon: Star },
  { value: "2+", label: "Professionals", icon: Users },
] as const

/** "48+" -> {target:48, decimals:0, suffix:"+"} · "4.9★" -> {target:4.9, decimals:1, suffix:"★"}. */
function parseStatValue(raw: string) {
  const match = raw.match(/^([\d.]+)(.*)$/)
  if (!match) return { target: 0, decimals: 0, suffix: raw }
  const [, numeric, suffix] = match
  const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0
  return { target: Number.parseFloat(numeric), decimals, suffix }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.7 } },
}
const itemVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

interface StatItemProps {
  value: string
  label: string
  icon: typeof LayoutGrid
  reducedMotion: boolean
}

/**
 * One metric: icon chip, a number that counts up from 0 once it enters
 * view (skipped entirely under reduced motion — the final string renders
 * immediately), and its label. Hover state is desktop-only via `group`.
 */
function StatItem({ value, label, icon: Icon, reducedMotion }: StatItemProps) {
  const { target, decimals, suffix } = parseStatValue(value)
  // Always starts at the real value — matches server-rendered markup exactly
  // (no hydration mismatch) and means no-JS/pre-hydration visitors, or a
  // viewport-entry callback that never fires, still see the correct number
  // rather than a permanent "0". The count-up is layered on top of that: only
  // once the section genuinely scrolls into view does it drop to 0 and
  // animate back up, which reads as a flourish rather than a loading state.
  const [display, setDisplay] = useState(target)
  const startedRef = useRef(false)

  const startCountUp = useCallback(() => {
    if (startedRef.current || reducedMotion) return
    startedRef.current = true
    const duration = 1400
    setDisplay(0)
    const startTime = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(target * eased)
      if (progress < 1) requestAnimationFrame(tick)
      else setDisplay(target)
    }
    requestAnimationFrame(tick)
  }, [target, reducedMotion])

  return (
    <motion.div
      variants={reducedMotion ? itemVariantsReduced : itemVariants}
      onViewportEnter={startCountUp}
      className="group flex flex-col items-center gap-3 px-6 py-9 transition-colors duration-300 sm:py-0"
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-primary transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:shadow-[0_0_20px_-4px_rgba(20,168,0,0.5)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>

      <p
        className="font-heading text-6xl font-semibold leading-none tracking-[-0.03em] text-white transition-transform duration-300 ease-out tabular-nums group-hover:-translate-y-0.5 sm:text-7xl motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        aria-hidden={reducedMotion ? undefined : "true"}
      >
        {display.toFixed(decimals)}
        {suffix}
      </p>
      {/* Real, static value for assistive tech and no-JS — the count-up span above is decorative. */}
      {!reducedMotion && <span className="sr-only">{value}</span>}

      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">{label}</p>
    </motion.div>
  )
}

/**
 * A rounded near-black panel inside a light section — not full-bleed like
 * MarketplacePreview, so it reads as this page's second, calmer dark beat
 * rather than a repeat of the same effect. Together the two dark sections
 * bookend the lighter TaskCategories/TaskerSection scenes between them.
 */
export function Stats() {
  const prefersReducedMotion = Boolean(useReducedMotion())

  return (
    <section className="relative bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", bounce: 0, duration: 0.7 }}
          className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-zinc-950 px-8 py-16 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:px-14 sm:py-20"
        >
          {/* Soft atmosphere: one broad glow anchored top-center (echoes the
              eyebrow above) plus a second, quieter one low and off-axis so
              the panel reads as lit rather than flat, without the green
              ever becoming the dominant colour. */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(20,168,0,0.16)_0%,rgba(20,168,0,0.01)_70%,transparent_100%)] blur-[110px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-[-120px] right-[-60px] -z-0 h-[280px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(20,168,0,0.07)_0%,transparent_70%)] blur-[100px]"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center text-center">
            <Eyebrow tone="dark">QuickHands by the numbers</Eyebrow>

            <motion.div
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "visible"}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
              className="mt-14 grid w-full max-w-2xl grid-cols-1 divide-y divide-white/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {STATS.map((stat) => (
                <StatItem key={stat.label} {...stat} reducedMotion={prefersReducedMotion} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
