"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { Wallet, CalendarClock, ShieldCheck } from "lucide-react"
import { Eyebrow } from "./Eyebrow"
import { PillButton } from "./PillButton"

const PERKS = [
  { icon: Wallet, label: "Set your own rate" },
  { icon: CalendarClock, label: "Work when you want" },
  { icon: ShieldCheck, label: "Get paid securely" },
]

/**
 * Back to white after the dark marketplace panel — a plain split layout
 * (copy + photo) rather than a card grid, so the page's rhythm reads as
 * light -> dark -> light rather than repeating either register twice in a
 * row. Makes the two-sided marketplace explicit: this is the "supply side."
 */
export function TaskerSection() {
  const prefersReducedMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 } },
  }

  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0, duration: prefersReducedMotion ? 0.3 : 0.7 },
    },
  }

  return (
    <section className="relative overflow-hidden bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10"
        >
          {/* Copy column */}
          <div className="flex flex-col items-start gap-6 lg:col-span-6">
            <motion.div variants={itemVariants}>
              <Eyebrow>For specialists</Eyebrow>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-zinc-950 md:text-5xl lg:text-6xl"
            >
              Turn your skills into extra income.
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="max-w-[440px] font-body text-[18px] font-normal leading-relaxed text-zinc-500"
            >
              Join QuickHands, offer your skills locally, and connect with
              people who need your help. Customers get things done — you earn
              by helping them do it.
            </motion.p>

            <motion.ul variants={itemVariants} className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              {PERKS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 font-sans text-xs font-medium text-zinc-500">
                  <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={itemVariants} className="mt-2">
              {/* Placeholder anchor — Phase C wires the real specialist signup flow. */}
              <PillButton href="#become-specialist" size="lg">
                Become a Specialist
              </PillButton>
            </motion.div>
          </div>

          {/* Visual column */}
          <motion.div variants={itemVariants} className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-[460px] lg:max-w-none">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-100 shadow-[0_30px_60px_-20px_rgba(9,9,11,0.2)] sm:aspect-[5/4] lg:aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/9607020/pexels-photo-9607020.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="A specialist kneeling on the floor, holding a wrench while making a repair"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Floating stat card — reuses the site's real, existing signup figure verbatim */}
              <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 px-4 py-3 shadow-[0_20px_40px_-15px_rgba(9,9,11,0.25)] backdrop-blur-xl sm:left-8">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="font-sans text-xs font-semibold text-zinc-900">
                  Join 2+ professionals
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
