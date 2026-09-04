"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion"
import { X } from "lucide-react"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { PillButton } from "./PillButton"

interface NavLink {
  label: string
  href: string
}

interface MobileNavProps {
  open: boolean
  onClose: () => void
  links: readonly NavLink[]
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

/**
 * Full-screen mobile nav overlay. Body-scroll-locked and focus-trapped while
 * open, closes on Escape, and staggers each link in with a numbered
 * editorial treatment that echoes HowItWorks' large serif numerals.
 */
export function MobileNav({ open, onClose, links }: MobileNavProps) {
  const prefersReducedMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  // Body scroll lock while open.
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Escape-to-close + focus trap.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== "Tab") return

      const panel = panelRef.current
      if (!panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  // Move focus into the panel on open.
  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(
      () => {
        panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus()
      },
      prefersReducedMotion ? 0 : 320
    )
    return () => window.clearTimeout(id)
  }, [open, prefersReducedMotion])

  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.06, delayChildren: prefersReducedMotion ? 0 : 0.15 },
    },
  }

  const itemVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0, duration: prefersReducedMotion ? 0.2 : 0.55 },
    },
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.3 }}
          className="fixed inset-0 z-[45] flex flex-col bg-white lg:hidden"
        >
          <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
            <span className="font-sans text-sm font-semibold tracking-tight text-zinc-950">
              Quick<span className="text-primary">Hands</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors duration-200 hover:bg-zinc-50 active:scale-90"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <motion.nav
            aria-label="Mobile"
            initial="hidden"
            animate="visible"
            variants={listVariants}
            className="flex flex-1 flex-col justify-center gap-0.5 px-5 sm:px-6"
          >
            {links.map((link, i) => (
              <motion.div key={link.label} variants={itemVariants} className="border-b border-zinc-100">
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="font-mono text-[11px] tabular-nums text-zinc-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-3xl leading-none tracking-tight text-zinc-950 transition-colors duration-200 group-hover:text-primary sm:text-4xl">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3 px-5 pb-8 pt-4 sm:px-6"
          >
            <SignedOut>
              <Link
                href="/sign-in"
                onClick={onClose}
                className="w-full py-2.5 text-center font-sans text-sm font-semibold text-zinc-600 transition-colors duration-200 hover:text-zinc-950"
              >
                Sign in
              </Link>
              <PillButton href="/sign-up" size="lg" className="w-full">
                Post a Task
              </PillButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="w-full py-2.5 text-center font-sans text-sm font-semibold text-zinc-600 transition-colors duration-200 hover:text-zinc-950"
              >
                Dashboard
              </Link>
              <PillButton href="/post-job" size="lg" className="w-full">
                Post a Task
              </PillButton>
              <div className="flex justify-center pt-1">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
