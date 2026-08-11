"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClientLogin } from "@/components/ClientLogin"
import { PillButton } from "./PillButton"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how" },
  // Placeholder anchor — Phase B builds the TaskCategories/marketplace section this points to.
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
  const [scrolled, setScrolled] = useState(false)
  const harareTime = useHarareTime()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-5">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.7, delay: 0.15 }}
        className={cn(
          "mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-full border px-4 py-2 backdrop-blur-md transition-all duration-300 sm:px-5",
          scrolled
            ? "border-zinc-200 bg-white/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]"
            : "border-zinc-200/70 bg-white/75 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)]"
        )}
      >
        {/* Logo — same asset/treatment as the existing site header */}
        <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-zinc-200/70 bg-zinc-50 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Image src="/quickhands.png" alt="QuickHands" fill className="object-contain p-1" />
          </div>
          <span className="font-sans text-sm font-semibold tracking-tight text-zinc-950 transition-colors duration-200 group-hover:text-primary">
            QuickHands
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-0.5 font-sans lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-500 transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-950"
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

          <ClientLogin>
            <button
              type="button"
              className="hidden rounded-full px-3 py-1.5 font-sans text-xs font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-950 sm:inline-flex"
            >
              Sign in
            </button>
          </ClientLogin>

          {/* Post a Task: placeholder for now — Phase C wires this to the real PostTaskModal. */}
          <PillButton size="sm" className="hidden sm:inline-flex">
            Post a Task
          </PillButton>

          {/* Mobile menu trigger — Phase C wires this to the real MobileNav overlay. */}
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="true"
            aria-expanded="false"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors duration-200 hover:bg-zinc-50 active:scale-90 lg:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </motion.header>
    </div>
  )
}
