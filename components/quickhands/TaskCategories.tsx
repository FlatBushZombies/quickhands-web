"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Eyebrow } from "./Eyebrow"

const CATEGORIES = [
  {
    title: "Home & Repairs",
    tagline: "Handymen, electricians, plumbers, installers and general repairs.",
    tags: ["Handyman", "Electrician", "Plumbing", "Installations"],
    image: "https://images.pexels.com/photos/5691544/pexels-photo-5691544.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A specialist drilling a window frame during a home repair",
  },
  {
    title: "Moving & Delivery",
    tagline: "Moving help, pickups, deliveries, errands and local transport.",
    tags: ["Moving help", "Pickups", "Deliveries", "Errands"],
    image: "https://images.pexels.com/photos/5025669/pexels-photo-5025669.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A specialist carrying moving boxes beside a delivery van",
  },
  {
    title: "Cleaning",
    tagline: "Home, office, deep cleans and recurring visits.",
    tags: ["Home cleaning", "Office cleaning", "Deep clean", "Recurring"],
    image: "https://images.pexels.com/photos/7641484/pexels-photo-7641484.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A cleaning specialist mopping the floor of a home",
  },
  {
    title: "Personal & Other Tasks",
    tagline: "Beauty, tutoring, gardening, admin help and everyday assistance.",
    tags: ["Beauty", "Tutoring", "Gardening", "Admin help"],
    image: "https://images.pexels.com/photos/6502822/pexels-photo-6502822.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A tutor helping a student during a lesson",
  },
] as const

/**
 * Premium, photography-forward category grid. Every card carries a real
 * photo (not an icon-in-a-box), with subcategory tags that reveal on
 * hover/focus — a more interactive, editorial treatment than a standard
 * SaaS feature-card grid.
 */
export function TaskCategories() {
  const prefersReducedMotion = useReducedMotion()

  const cardVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0, duration: prefersReducedMotion ? 0.3 : 0.7 },
    },
  }

  return (
    <section id="tasks" className="relative scroll-mt-28 bg-[var(--primary-light)] py-28 lg:py-36">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-14 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <Eyebrow>Popular tasks</Eyebrow>
            <h2 className="mt-4 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-zinc-950 md:text-5xl lg:text-6xl">
              What can you get done?
            </h2>
          </div>
          <p className="max-w-xs font-body text-[15px] font-normal leading-relaxed text-zinc-500">
            From a leaky tap to a full house move, browse the kinds of tasks
            people get done on QuickHands every day.
          </p>
        </div>

        {/* Category grid */}
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {CATEGORIES.map((category) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-zinc-200 shadow-sm transition-shadow duration-300 hover:shadow-[0_30px_60px_-20px_rgba(9,9,11,0.3)] sm:aspect-[16/11]"
              tabIndex={0}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] group-focus-within:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-transparent transition-opacity duration-300" />

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 text-left sm:p-7">
                <h3 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {category.title}
                </h3>
                <p className="max-w-sm font-body text-[15px] font-normal leading-relaxed text-white/75">
                  {category.tagline}
                </p>

                {/* Tag chips — reveal on hover/focus for an interactive feel */}
                <div className="flex flex-wrap gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                  {category.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-sans text-[10px] font-medium text-white/90 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <span className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
