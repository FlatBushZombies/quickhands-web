"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { ShieldCheck, MapPin, MessageCircle, CalendarClock } from "lucide-react"
import { Eyebrow } from "./Eyebrow"
import { PillButton } from "./PillButton"
import { AnimatedLink } from "./AnimatedLink"
import { LiquidReveal } from "./LiquidReveal"
import { HeroMarketplaceCard } from "./HeroMarketplaceCard"

const TRUST_SIGNALS = [
  { icon: ShieldCheck, label: "Verified specialists" },
  { icon: MapPin, label: "Local professionals" },
  { icon: MessageCircle, label: "Secure communication" },
  { icon: CalendarClock, label: "Flexible scheduling" },
]

interface HeroProps {
  /**
   * Gates the entrance animation. Pass false while an IntroLoader is still
   * covering the screen, then flip to true once it slides away. Defaults to
   * true so Hero also works standalone (no loader in the tree).
   */
  ready?: boolean
}

export function Hero({ ready = true }: HeroProps) {
  const prefersReducedMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1, delayChildren: 0.05 },
    },
  }

  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0, duration: prefersReducedMotion ? 0.3 : 0.8 },
    },
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-white pb-20 pt-32 sm:pt-40 lg:pb-28 lg:pt-44"
      aria-label="Hero"
    >
      {/* Soft brand glow, matches the restrained-palette rule: green used only as accent */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(38,192,141,0.08)_0%,rgba(38,192,141,0.01)_70%,transparent_100%)] blur-[110px]"
        aria-hidden="true"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={ready ? "visible" : "hidden"}
        className="mx-auto grid w-full max-w-[1800px] grid-cols-1 items-center gap-14 px-5 sm:px-6 md:px-10 lg:grid-cols-12 lg:gap-10 lg:px-14 xl:px-20 2xl:max-w-[1600px]"
      >
        {/* Copy column */}
        <div className="flex flex-col items-start gap-6 lg:col-span-6 xl:col-span-5">
          <motion.div variants={itemVariants}>
            <Eyebrow animate={false}>Local task marketplace</Eyebrow>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-[clamp(2.75rem,4.2vw+1.4rem,5rem)] font-medium leading-[1.03] tracking-[-0.02em] text-zinc-950"
          >
            Get tasks done.
            <br />
            Find trusted help.
            <br />
            Right when you need it.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-[480px] font-sans text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            You need something done. Someone nearby can help. QuickHands connects
            you with reliable local specialists for cleaning, repairs, beauty,
            trades and everyday tasks — post what you need and hear back fast.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-3">
            {/* Post a Task: placeholder — Phase C wires this to the real PostTaskModal. */}
            <PillButton size="lg">Post a Task</PillButton>

            {/* Browse Tasks: placeholder anchor — Phase B builds the section this points to. */}
            <AnimatedLink href="#tasks">Browse Tasks</AnimatedLink>
          </motion.div>

          <motion.ul
            variants={itemVariants}
            className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-zinc-200 pt-6"
            aria-label="Why QuickHands"
          >
            {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 font-sans text-xs font-medium text-zinc-500">
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Visual column */}
        <motion.div
          variants={itemVariants}
          className="relative lg:col-span-6 lg:col-start-7 xl:col-span-7 xl:col-start-6"
        >
          <div className="relative mx-auto max-w-[480px] lg:max-w-none">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-100 shadow-[0_30px_60px_-20px_rgba(9,9,11,0.25)] sm:aspect-[3/4] lg:aspect-[4/5]">
              <LiquidReveal
                baseSrc="https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&w=1260&h=750&dpr=1"
                revealSrc="https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-6195125.jpg&fm=jpg"
                baseAlt="A specialist's hands installing pipe fittings during a home repair"
                revealAlt="A local cleaning team at work in a client's home"
                className="h-full w-full"
              />
            </div>

            <div className="relative z-10 -mt-14 flex justify-center px-4 lg:absolute lg:bottom-8 lg:-left-10 lg:mt-0 lg:block lg:px-0">
              <HeroMarketplaceCard />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
