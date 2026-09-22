"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { MapPin, Clock, Star, ClipboardCheck, Sparkles } from "lucide-react"
import { Eyebrow } from "./Eyebrow"

const SPECIALISTS = [
  {
    name: "Tapiwa N.",
    category: "Furniture Assembly & Handyman",
    rating: "4.9",
    completed: "62 tasks completed",
    availability: "Available today",
    photo: "https://images.pexels.com/photos/19379640/pexels-photo-19379640.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    name: "Rudo M.",
    category: "Handyman & Installations",
    rating: "5.0",
    completed: "34 tasks completed",
    availability: "Available tomorrow",
    photo: "https://images.pexels.com/photos/11440539/pexels-photo-11440539.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    name: "Blessing K.",
    category: "General Repairs",
    rating: "4.8",
    completed: "128 tasks completed",
    availability: "Available today",
    photo: "https://images.pexels.com/photos/5984158/pexels-photo-5984158.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
] as const

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.7 } },
}
const itemVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

/**
 * The vertical bridge between the task card and the specialist stack
 * (desktop only — the grid row it lives in stretches to the taller
 * column's height, so this always spans task-top to specialists-bottom).
 * A static gradient line carries the "connection" at rest; the small
 * travelling dot is a separate, self-looping animation layered on top so it
 * can keep pulsing after the entrance is done, without fighting the
 * viewport-triggered stagger everything else uses.
 */
function MatchConnector({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      variants={reducedMotion ? itemVariantsReduced : itemVariants}
      className="relative hidden h-full min-h-[220px] items-stretch justify-center lg:col-span-2 lg:flex"
      aria-hidden="true"
    >
      <div className="relative w-px self-stretch bg-gradient-to-b from-white/5 via-white/15 to-white/5">
        {!reducedMotion && (
          <motion.span
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(20,168,0,0.55)]"
            animate={{ top: ["8%", "92%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
          />
        )}
      </div>
      <span className="absolute top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full border border-primary/25 bg-zinc-950 px-2.5 py-1.5 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
        <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
        Match
      </span>
    </motion.div>
  )
}

/** Compact, decorative equivalent of MatchConnector for the stacked mobile layout. */
function MobileMatchIndicator() {
  return (
    <div className="flex items-center justify-center gap-2.5 py-1 lg:hidden">
      <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-white/15" />
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
        <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
        Matched
      </span>
      <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-white/15" />
    </div>
  )
}

/**
 * Full-bleed near-black panel — the boldest visual beat on the page.
 * Demonstrates the marketplace mechanic directly (a posted task matched to
 * real specialist profiles) instead of describing it in prose. Breaks the
 * white-on-white rhythm of the sections around it on purpose.
 */
export function MarketplacePreview() {
  const prefersReducedMotion = Boolean(useReducedMotion())

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-28 lg:py-36" aria-label="How the marketplace works">
      {/* Soft brand glow on the task side, a second quieter one on the
          specialist side — the background now supports both halves of the
          story instead of lighting only one corner. */}
      <div
        className="pointer-events-none absolute -left-20 top-10 -z-0 h-[460px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(20,168,0,0.14)_0%,rgba(20,168,0,0.01)_70%,transparent_100%)] blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 -z-0 h-[420px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(20,168,0,0.08)_0%,transparent_70%)] blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="mb-10 max-w-xl lg:mb-14">
          <Eyebrow tone="dark">See it in action</Eyebrow>
          <h2 className="mt-3 font-heading text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-5xl lg:text-6xl">
            Post a task. Meet your match.
          </h2>
          <p className="mt-4 max-w-md font-body text-[15px] font-normal leading-relaxed text-zinc-400">
            Here's what it looks like — a real task, matched with real local
            specialists ready to help.
          </p>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-0"
        >
          {/* Task card — the origin point. self-start keeps it at its
              natural height even though the row stretches for the connector. */}
          <motion.div
            variants={prefersReducedMotion ? itemVariantsReduced : itemVariants}
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset] sm:p-7 lg:col-span-5 lg:self-start"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="flex items-center gap-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse" aria-hidden="true" />
                  Task posted
                </span>
              </span>
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-zinc-500">2 min ago</span>
            </div>

            <h3 className="mt-5 font-heading text-[28px] font-bold leading-[1.1] text-white sm:text-3xl">
              Need help assembling furniture
            </h3>
            <p className="mt-2.5 max-w-[42ch] font-body text-[15px] font-normal leading-relaxed text-zinc-400">
              Two wardrobes and a bed frame, flat-pack, everything's already in
              the boxes.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5">
              <span className="flex items-center gap-1.5 font-sans text-xs text-zinc-300">
                <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Harare
              </span>
              <span className="flex items-center gap-1.5 font-sans text-xs text-zinc-300">
                <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Tomorrow
              </span>
            </div>
          </motion.div>

          <MatchConnector reducedMotion={prefersReducedMotion} />
          <MobileMatchIndicator />

          {/* Specialist cards — the result. */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {SPECIALISTS.map((specialist) => (
              <motion.div
                key={specialist.name}
                variants={prefersReducedMotion ? itemVariantsReduced : itemVariants}
                className="flex flex-col gap-3 rounded-[22px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-4 transition-colors duration-200 hover:border-primary/30 hover:bg-white/[0.07] sm:flex-row sm:items-center sm:gap-4 sm:p-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={specialist.photo}
                    alt={specialist.name}
                    className="h-14 w-14 shrink-0 rounded-full border-2 border-white/10 object-cover"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-sans text-[15px] font-semibold text-white">
                        {specialist.name}
                      </p>
                      <span className="flex shrink-0 items-center gap-1 font-sans text-[11px] font-medium text-zinc-300">
                        <Star className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
                        {specialist.rating}
                      </span>
                    </div>
                    <p className="truncate font-sans text-xs text-zinc-400">{specialist.category}</p>
                    <p className="mt-0.5 font-sans text-[11px] text-zinc-500">{specialist.completed}</p>
                  </div>
                </div>

                <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-sans text-[10px] font-medium text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {specialist.availability}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
