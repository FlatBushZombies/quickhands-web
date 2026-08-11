"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { ClipboardList, Users, Handshake, CheckCircle2 } from "lucide-react"
import { Eyebrow } from "./Eyebrow"

const STEPS = [
  {
    n: "01",
    label: "Post",
    title: "Post what you need done",
    description: "Describe the task, add a location and timing. Takes less than two minutes.",
    icon: ClipboardList,
  },
  {
    n: "02",
    label: "Match",
    title: "Find people who can help",
    description: "We surface nearby specialists who do exactly this kind of work, ready to take it on.",
    icon: Users,
  },
  {
    n: "03",
    label: "Agree",
    title: "Choose the right person",
    description: "Compare profiles, ratings and pricing, message directly, and agree on the details.",
    icon: Handshake,
  },
  {
    n: "04",
    label: "Done",
    title: "Get the task completed",
    description: "Your specialist gets to work. Approve it and pay securely once you're happy.",
    icon: CheckCircle2,
  },
] as const

/**
 * Editorial numbered-sequence layout — deliberately NOT a card grid. Large
 * faint serif numerals sit behind a connecting rule that threads through
 * icon markers, reading like a magazine process spread rather than the
 * bento/photo-card treatments used by the sections on either side of it.
 */
export function HowItWorks() {
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
    <section id="how-it-works" className="relative overflow-hidden bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-20 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-tight text-zinc-950 md:text-5xl lg:text-6xl">
              Four steps. <span className="italic text-primary">No friction.</span>
            </h2>
          </div>
          <p className="max-w-xs font-sans text-sm font-light leading-relaxed text-zinc-500">
            QuickHands strips out the back-and-forth. Post once, meet the right
            specialist, get it done.
          </p>
        </div>

        {/* Sequence */}
        <div className="relative">
          {/* connecting rule — horizontal on desktop, vertical on mobile */}
          <div
            className="absolute left-0 right-0 top-[27px] hidden h-px bg-zinc-200 lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-2 left-[27px] top-2 w-px bg-zinc-200 lg:hidden"
            aria-hidden="true"
          />

          <motion.ol
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8"
          >
            {STEPS.map((step) => {
              const Icon = step.icon
              return (
                <motion.li
                  key={step.n}
                  variants={itemVariants}
                  className="relative flex items-start gap-5 lg:flex-col lg:items-start lg:gap-0"
                >
                  <span className="relative z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-primary shadow-[0_4px_16px_-4px_rgba(9,9,11,0.1)] lg:mb-8">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <div className="pt-0.5 lg:pr-4">
                    <span
                      className="block font-serif text-6xl italic leading-none text-zinc-100 select-none lg:text-7xl"
                      aria-hidden="true"
                    >
                      {step.n}
                    </span>
                    <p className="-mt-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-primary lg:mt-2">
                      {step.label}
                    </p>
                    <h3 className="mt-3 font-sans text-base font-bold text-zinc-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[240px] font-sans text-[13px] leading-relaxed text-zinc-500">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              )
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
