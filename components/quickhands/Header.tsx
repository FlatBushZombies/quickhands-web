"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { PillButton } from "./PillButton"
import { MobileNav } from "./MobileNav"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Tasks", href: "#tasks" },
  { label: "Become a Specialist", href: "/professionals" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#footer" },
]

function useHarareTime() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Harare",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      )
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [])

  return time
}

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const harareTime = useHarareTime()

  return (
    <div className="fixed inset-x-0 top-0 z-40">
      {/* Solid, opaque bar at all times — kept clearly distinct from
          whatever sits underneath it (a photo hero on this page) rather
          than blending into it while unscrolled. */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.7, delay: 0.15 }}
        className="w-full border-b border-zinc-200 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
      >
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-5 py-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:max-w-[1600px]">
          {/* Logo */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-zinc-200/70 bg-zinc-50 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Image src="/quickhands.png" alt="QuickHands" fill className="object-contain p-1" />
            </div>
            <span className="font-sans text-sm font-semibold tracking-tight text-zinc-950 transition-colors duration-200 group-hover:text-primary">
              QuickHands
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 font-sans lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            {harareTime && (
              <span
                className="hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-sans text-[11px] font-medium text-zinc-500 xl:inline-flex"
                aria-label={`Local time in Harare: ${harareTime}`}
              >
                <Clock className="h-3 w-3 text-zinc-400" aria-hidden="true" />
                {harareTime} <span className="text-zinc-400">Harare</span>
              </span>
            )}

            <SignedOut>
              <Link
                href="/sign-in"
                className="hidden px-3 py-1.5 font-sans text-xs font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-950 sm:inline-flex"
              >
                Sign in
              </Link>

              <PillButton href="/sign-up" size="sm" className="hidden sm:inline-flex">
                Post a Task
              </PillButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="hidden px-3 py-1.5 font-sans text-xs font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-950 sm:inline-flex"
              >
                Dashboard
              </Link>

              <PillButton href="/post-job" size="sm" className="hidden sm:inline-flex">
                Post a Task
              </PillButton>

              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <button
              type="button"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-haspopup="true"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors duration-200 hover:bg-zinc-50 active:scale-90 lg:hidden"
            >
              {mobileNavOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} links={NAV_LINKS} />
    </div>
  )
}
