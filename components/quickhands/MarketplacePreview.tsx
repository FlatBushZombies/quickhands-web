"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { MapPin, Clock, Star, CheckCircle2 } from "lucide-react"
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

/**
 * Full-bleed near-black panel — the boldest visual beat on the page.
 * Demonstrates the marketplace mechanic directly (a posted task matched to
 * real specialist profiles) instead of describing it in prose. Breaks the
 * white-on-white rhythm of the sections around it on purpose.
 */
export function MarketplacePreview() {
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
    <section className="relative overflow-hidden bg-zinc-950 py-28 lg:py-36" aria-label="How the marketplace works">
      {/* Soft brand glow, same restrained-accent language as Hero */}
      <div
        className="pointer-events-none absolute right-0 top-0 -z-0 h-[500px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(38,192,141,0.14)_0%,rgba(38,192,141,0.01)_70%,transparent_100%)] blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="mb-16 max-w-xl">
          <Eyebrow tone="dark">See it in action</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
            Post a task. Meet your match.
          </h2>
          <p className="mt-5 max-w-md font-sans text-sm font-light leading-relaxed text-zinc-400">
            Here's what it looks like — a real task, matched with real local
            specialists ready to help.
          </p>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start"
        >
          {/* Task card */}
          <motion.div
            variants={itemVariants}
            className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm lg:col-span-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                Task posted
              </span>
              <span className="font-mono text-[10px] tabular-nums text-zinc-500">2 min ago</span>
            </div>

            <h3 className="mt-4 font-sans text-lg font-bold text-white">
              Need help assembling furniture
            </h3>
            <p className="mt-2 font-sans text-[13px] leading-relaxed text-zinc-400">
              Two wardrobes and a bed frame, flat-pack, everything's already in
              the boxes.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5">
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

          {/* Connector arrow, desktop only */}
          <motion.div
            variants={itemVariants}
            className="hidden items-center justify-center lg:col-span-1 lg:flex"
            aria-hidden="true"
          >
            <div className="h-px w-full bg-gradient-to-r from-white/20 to-white/5" />
          </motion.div>

          {/* Specialist cards */}
          <div className="flex flex-col gap-4 lg:col-span-6">
            {SPECIALISTS.map((specialist) => (
              <motion.div
                key={specialist.name}
                variants={itemVariants}
                className="flex items-center gap-4 rounded-[20px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-colors duration-200 hover:border-primary/30 hover:bg-white/[0.06] sm:p-5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={specialist.photo}
                  alt={specialist.name}
                  className="h-12 w-12 shrink-0 rounded-full border border-white/15 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-sans text-sm font-semibold text-white">
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

                <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-sans text-[10px] font-medium text-primary sm:flex">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
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
