"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { Eyebrow } from "./Eyebrow"

/**
 * All three figures are reused verbatim from components/HeroSection.tsx's
 * trust band ("48+" / Categories, "4.9★" / Avg rating, "Join 2+
 * professionals") — no new numbers are introduced.
 */
const STATS = [
  { value: "48+", label: "Categories" },
  { value: "4.9★", label: "Avg rating" },
  { value: "2+", label: "Professionals" },
] as const

/**
 * A rounded near-black panel inside a light section — not full-bleed like
 * MarketplacePreview, so it reads as this page's second, calmer dark beat
 * rather than a repeat of the same effect. Together the two dark sections
 * bookend the lighter TaskCategories/TaskerSection scenes between them.
 */
export function Stats() {
  const prefersReducedMotion = useReducedMotion()

  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0, duration: prefersReducedMotion ? 0.3 : 0.7 },
    },
  }

  return (
    <section className="relative bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", bounce: 0, duration: 0.7 }}
          className="relative overflow-hidden rounded-[32px] border border-zinc-900 bg-zinc-950 px-8 py-16 sm:px-14 sm:py-20"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(20,168,0,0.14)_0%,rgba(20,168,0,0.01)_70%,transparent_100%)] blur-[100px]"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center text-center">
            <Eyebrow tone="dark">QuickHands by the numbers</Eyebrow>

            <motion.div
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "visible"}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
              className="mt-12 grid w-full max-w-2xl grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="flex flex-col items-center gap-2 py-8 sm:py-0"
                >
                  <p className="font-serif text-6xl font-medium leading-none tracking-tight text-white sm:text-7xl">
                    {stat.value}
                  </p>
                  <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
