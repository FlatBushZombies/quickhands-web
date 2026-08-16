"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { Eyebrow } from "./Eyebrow"
import { PillButton } from "./PillButton"
import { PostTaskModal } from "./PostTaskModal"
import { Em } from "./Em"

/**
 * Full-bleed cinematic CTA band — the same photo + dark-overlay + eyebrow +
 * headline + CTA composition used on the Hero sections (the Worrki
 * reference's own "Become a Partner" moment). Sits between Stats (white
 * section holding a near-black rounded panel) and ClientFAQ (plain white),
 * so a photo beat here still reads as a deliberate rhythm change rather than
 * a repeat of the near-black Stats/MarketplacePreview panels around it.
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
    <section className="relative w-full overflow-hidden" aria-label="Ready when you are">
      <div className="relative isolate flex min-h-[480px] w-full items-center justify-center overflow-hidden sm:min-h-[560px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/4963436/pexels-photo-4963436.jpeg?cs=srgb&dl=pexels-ketut-subiyanto-4963436.jpg&fm=jpg"
          alt="A close-up handshake sealing an agreement between a client and a specialist"
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
        {/* Vignette overlay — darker at the edges, keeps centered white text
            legible anywhere on the photo. */}
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.8)_100%)]"
          aria-hidden="true"
        />

        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 } } }}
          className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center"
        >
          <motion.div variants={itemVariants}>
            <Eyebrow tone="dark" pulse animate={false}>
              Ready when you are
            </Eyebrow>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="font-serif text-4xl font-medium leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Got something to do?
            <br />
            Let&rsquo;s get it <Em>done</Em>.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="max-w-md font-sans text-sm leading-relaxed text-white/80"
          >
            Post it, meet a nearby specialist, and get it handled — QuickHands
            makes finding trusted local help simple.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <PostTaskModal>
              <PillButton size="lg">Post a Task</PillButton>
            </PostTaskModal>
            <PillButton href="/professionals" variant="dark" size="lg" showArrow>
              Become a Specialist
            </PillButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
