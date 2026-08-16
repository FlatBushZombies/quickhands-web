"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { ShieldCheck, MapPin, MessageCircle, CalendarClock } from "lucide-react"
import { Eyebrow } from "./Eyebrow"
import { PillButton } from "./PillButton"
import { AnimatedLink } from "./AnimatedLink"
import { HeroMarketplaceCard } from "./HeroMarketplaceCard"
import { Em } from "./Em"
import { PostTaskModal } from "./PostTaskModal"

const TRUST_SIGNALS = [
  { icon: ShieldCheck, label: "Verified specialists" },
  { icon: MapPin, label: "Local professionals" },
  { icon: MessageCircle, label: "Secure communication" },
  { icon: CalendarClock, label: "Flexible scheduling" },
]

const HERO_IMAGE =
  "https://images.pexels.com/photos/38524262/pexels-photo-38524262.jpeg?cs=srgb&dl=pexels-bulat843-1243575272-38524262.jpg&fm=jpg"

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

  const floatingCardVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", bounce: 0, duration: prefersReducedMotion ? 0.3 : 0.8, delay: 0.5 },
    },
  }

  return (
    <section className="relative w-full overflow-hidden bg-white" aria-label="Hero">
      {/* ══════════ Full-bleed cinematic panel ══════════
          Photo fills edge-to-edge with a bottom-heavy dark gradient for
          legibility — the same strategy Quickhandshero.tsx (the /professionals
          hero) already uses. Headline copy sits directly on the photo in
          light text; the floating marketplace card and trust-signal band
          below carry the secondary content so nothing from the original
          split layout is lost. */}
      <div className="relative isolate flex min-h-[680px] w-full items-end overflow-hidden sm:min-h-[720px] lg:min-h-[820px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt="A specialist installing an outdoor light fixture during a home repair"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />

        {/* Floating glass card — HeroMarketplaceCard repositioned clear of the
            headline block, echoing how Quickhandshero anchors its own
            floating stat cluster in the same top-right corner. */}
        <motion.div
          variants={floatingCardVariants}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          className="absolute right-6 top-24 z-10 hidden sm:top-28 sm:right-8 md:block"
        >
          <HeroMarketplaceCard />
        </motion.div>

        {/* Headline block */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          className="relative z-10 mx-auto flex w-full max-w-[1800px] flex-col items-start gap-6 px-5 pb-14 pt-40 sm:px-6 sm:pb-16 sm:pt-44 md:px-10 lg:px-14 lg:pb-20 xl:px-20 2xl:max-w-[1600px]"
        >
          <motion.div variants={itemVariants}>
            <Eyebrow animate={false} tone="dark">
              Local task marketplace
            </Eyebrow>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-heading text-[clamp(2.75rem,4.6vw+1.4rem,5.75rem)] font-bold leading-[1.03] tracking-[-0.02em] text-white"
          >
            Get tasks done.
            <br />
            Find <Em>trusted</Em> help.
            <br />
            Right when you need it.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-[480px] font-body text-[18px] font-normal leading-relaxed text-white/80"
          >
            You need something done. Someone nearby can help. QuickHands connects
            you with reliable local specialists for cleaning, repairs, beauty,
            trades and everyday tasks — post what you need and hear back fast.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-3">
            <PostTaskModal>
              <PillButton size="lg">Post a Task</PillButton>
            </PostTaskModal>

            <AnimatedLink href="#tasks" tone="dark">
              Browse Tasks
            </AnimatedLink>
          </motion.div>

          {/* Mobile-only static placement for the marketplace card — the
              floating version is hidden below md, so the "how it works"
              promise it carries isn't lost on small screens. */}
          <motion.div variants={itemVariants} className="pt-2 md:hidden">
            <HeroMarketplaceCard />
          </motion.div>
        </motion.div>
      </div>

      {/* ══════════ Secondary band — trust signals ══════════
          Mirrors Quickhandshero's feature band beneath its own full-bleed
          panel: the same four trust signals that used to sit under the
          headline now get their own calm, light-surface row. */}
      <div className="relative w-full border-b border-zinc-200 bg-white py-10 sm:py-12">
        <div className="mx-auto w-full max-w-[1800px] px-5 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:max-w-[1600px]">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3" aria-label="Why QuickHands">
            {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 font-sans text-xs font-medium text-zinc-500">
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
