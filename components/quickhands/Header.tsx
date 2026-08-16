"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClientLogin } from "@/components/ClientLogin"
import { PillButton } from "./PillButton"
import { PostTaskModal } from "./PostTaskModal"
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
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const harareTime = useHarareTime()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-40">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.7, delay: 0.15 }}
        className={cn(
          "w-full border-b transition-all duration-300",
          scrolled
            ? "border-zinc-200 bg-white/95 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-md"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-5 py-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:max-w-[1600px]">
          {/* Logo — same asset/treatment as the existing site header */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
            <div
              className={cn(
                "relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-3",
                scrolled
                  ? "border border-zinc-200/70 bg-zinc-50"
                  : "border border-white/30 bg-white/90 backdrop-blur-sm"
              )}
            >
              <Image src="/quickhands.png" alt="QuickHands" fill className="object-contain p-1" />
            </div>
            <span
              className={cn(
                "font-sans text-sm font-semibold tracking-tight transition-colors duration-200 group-hover:text-primary",
                scrolled ? "text-zinc-950" : "text-white"
              )}
            >
              QuickHands
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 font-sans lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-medium transition-colors duration-200",
                  scrolled ? "text-zinc-500 hover:text-zinc-950" : "text-white/80 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            {harareTime && (
              <span
                className={cn(
                  "hidden items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-[11px] font-medium transition-colors duration-300 xl:inline-flex",
                  scrolled
                    ? "border-zinc-200 bg-zinc-50 text-zinc-500"
                    : "border-white/25 bg-white/10 text-white/85 backdrop-blur-sm"
                )}
                aria-label={`Local time in Harare: ${harareTime}`}
              >
                <Clock className={cn("h-3 w-3", scrolled ? "text-zinc-400" : "text-white/60")} aria-hidden="true" />
                {harareTime} <span className={scrolled ? "text-zinc-400" : "text-white/60"}>Harare</span>
              </span>
            )}

            <ClientLogin>
              <button
                type="button"
                className={cn(
                  "hidden px-3 py-1.5 font-sans text-xs font-medium transition-colors duration-200 sm:inline-flex",
                  scrolled ? "text-zinc-500 hover:text-zinc-950" : "text-white/80 hover:text-white"
                )}
              >
                Sign in
              </button>
            </ClientLogin>

            <PostTaskModal>
              <PillButton size="sm" className="hidden sm:inline-flex">
                Post a Task
              </PillButton>
            </PostTaskModal>

            <button
              type="button"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-haspopup="true"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 active:scale-90 lg:hidden",
                scrolled
                  ? "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  : "border-white/30 bg-white/10 text-white hover:bg-white/20"
              )}
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
