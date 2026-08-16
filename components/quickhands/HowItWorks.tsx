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
    chip: "New task",
    image:
      "https://images.pexels.com/photos/6260134/pexels-photo-6260134.jpeg?cs=srgb&dl=pexels-rdne-6260134.jpg&fm=jpg",
    imageAlt: "A person typing a task description into a phone",
  },
  {
    n: "02",
    label: "Match",
    title: "Find people who can help",
    description: "We surface nearby specialists who do exactly this kind of work, ready to take it on.",
    icon: Users,
    chip: "Nearby specialists",
    image:
      "https://images.pexels.com/photos/7283717/pexels-photo-7283717.jpeg?cs=srgb&dl=pexels-karola-g-7283717.jpg&fm=jpg",
    imageAlt: "Hands browsing a laptop, searching for the right specialist",
  },
  {
    n: "03",
    label: "Agree",
    title: "Choose the right person",
    description: "Compare profiles, ratings and pricing, message directly, and agree on the details.",
    icon: Handshake,
    chip: "Deal confirmed",
    image:
      "https://images.pexels.com/photos/7578896/pexels-photo-7578896.jpeg?cs=srgb&dl=pexels-kindelmedia-7578896.jpg&fm=jpg",
    imageAlt: "Two people shaking hands to confirm an agreement outside a home",
  },
  {
    n: "04",
    label: "Done",
    title: "Get the task completed",
    description: "Your specialist gets to work. Approve it and pay securely once you're happy.",
    icon: CheckCircle2,
    chip: "Task complete",
    image:
      "https://images.pexels.com/photos/13432295/pexels-photo-13432295.jpeg?cs=srgb&dl=pexels-mizunokozuki-13432295.jpg&fm=jpg",
    imageAlt: "People relaxing together at home after a task is finished",
  },
] as const

/**
 * Photo-card "How We Work" pattern — one cinematic photo per step with a
 * single floating glass-morphism chip in a corner, and a plain unbordered
 * caption underneath (bold title + one description line). Deliberately not
 * the icon-in-a-circle-above-text card formula, and not the editorial
 * numbered-sequence this section used previously.
 */
export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion()

  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0, duration: prefersReducedMotion ? 0.3 : 0.7 },
    },
  }

  return (
    <section id="how-it-works" className="relative scroll-mt-28 overflow-hidden bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-tight text-zinc-950 md:text-5xl lg:text-6xl">
              Four steps. No friction.
            </h2>
          </div>
          <p className="max-w-xs font-sans text-sm font-light leading-relaxed text-zinc-500">
            QuickHands strips out the back-and-forth. Post once, meet the right
            specialist, get it done.
          </p>
        </div>

        {/* Photo cards */}
        <motion.ol
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.12 }}
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-5"
        >
          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <motion.li key={step.label} variants={itemVariants} className="flex flex-col">
                {/* Cinematic photo, unbordered — the floating chip is the
                    only piece of UI chrome touching it, matching the
                    reference's image-led, card-container-free style. */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0"
                    aria-hidden="true"
                  />

                  {/* Floating glass chip — decorative, echoes the step's own
                      icon and label. No fabricated stats; purely
                      illustrative texture per the reference's own chips. */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-2 font-sans text-[11px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {step.chip}
                  </div>
                </div>

                {/* Plain editorial caption — no icon-circle, no border or
                    shadow container around the photo+caption block. */}
                <div className="mt-5">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    {step.label}
                  </p>
                  <h3 className="mt-2 font-sans text-base font-bold text-zinc-950">{step.title}</h3>
                  <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-zinc-500">{step.description}</p>
                </div>
              </motion.li>
            )
          })}
        </motion.ol>
      </div>
    </section>
  )
}
