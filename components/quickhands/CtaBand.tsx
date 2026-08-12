"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { Eyebrow } from "./Eyebrow"
import { PillButton } from "./PillButton"
import { PostTaskModal } from "./PostTaskModal"

/**
 * New CTA band, sits between Stats (a white section holding a near-black
 * rounded panel) and ClientFAQ (plain white). Goes light — primary-tinted —
 * on purpose, so the page doesn't stack three dark beats in a row.
 */
export function CtaBand() {
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
    <section className="relative overflow-hidden bg-[var(--primary-light)] py-24 lg:py-32">
      <motion.div
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 } } }}
        className="mx-auto flex max-w-[1200px] flex-col items-start gap-10 px-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-xl">
          <motion.div variants={itemVariants}>
            <Eyebrow>Ready when you are</Eyebrow>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-tight text-zinc-950 md:text-5xl lg:text-6xl"
          >
            Got something to do?
            <br />
            Let&rsquo;s get it done.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-5 max-w-md font-sans text-sm leading-relaxed text-zinc-600"
          >
            Post it, meet a nearby specialist, and get it handled — QuickHands
            makes finding trusted local help simple.
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="flex flex-shrink-0 flex-wrap items-center gap-4">
          <PostTaskModal>
            <PillButton size="lg">Post a Task</PillButton>
          </PostTaskModal>
          <PillButton href="/professionals" variant="outline" size="lg" showArrow>
            Become a Specialist
          </PillButton>
        </motion.div>
      </motion.div>
    </section>
  )
}
