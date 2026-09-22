"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { AudienceTabs } from "@/components/quickhands/AudienceTabs"
import { PillButton } from "@/components/quickhands/PillButton"
import { MobileNav } from "@/components/quickhands/MobileNav"

const NAV_LINKS = [
  { label: "How It Works", href: "#how" },
  { label: "For Clients", href: "/" },
]

// Specialist-side identity (--specialist, blue) instead of the client-side
// --primary green used on the main landing nav — deliberately distinct so a
// visitor always has a color cue for which half of the product they're in.
// Structure/sizing otherwise mirrors components/quickhands/Header.tsx
// exactly (bar height, logo treatment, link style, mobile nav) so the two
// navs read as one system; the container stays 1200px here (not Header's
// 1800px) to match the rest of this page's content width.
const NAV_ITEM =
  "whitespace-nowrap rounded-[8px] px-3 py-2 font-sans text-sm font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-50 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-specialist/50 focus-visible:ring-offset-1"

export function ProfessionalsHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="fixed inset-x-0 top-0 z-40">
      {/* Audience switch — same opaque neutral strip as the client landing nav. */}
      <AudienceTabs containerClassName="max-w-[1200px] px-6" />

      {/* Solid white bar at all times, separated from the photo hero by a
          single hairline rather than a shadow — same treatment as Header. */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.7, delay: 0.15 }}
        className="w-full border-b border-[#ECECEC] bg-white"
      >
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-4 px-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex flex-shrink-0 items-center gap-2.5 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-specialist/50 focus-visible:ring-offset-2"
          >
            <span className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-[10px]">
              <Image src="/quickhands.png" alt="QuickHands" fill sizes="36px" className="scale-[1.4] object-cover" />
            </span>
            <span className="font-sans text-xl font-bold tracking-[-0.02em] text-zinc-950">
              Quickhands <span className="text-specialist">Africa</span>
            </span>
          </Link>

          {/* Primary navigation — sits right beside the brand */}
          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:ml-3 lg:flex xl:ml-10">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className={NAV_ITEM}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Utility + actions */}
          <div className="ml-auto flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <SignedOut>
              <Link href="/sign-in" className={cn(NAV_ITEM, "hidden sm:inline-flex")}>
                Sign in
              </Link>

              <PillButton
                href="/sign-up"
                variant="specialist"
                size="sm"
                className="hidden h-11 rounded-[10px] px-5 text-sm shadow-none hover:shadow-none sm:inline-flex"
              >
                Register
              </PillButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard" className={cn(NAV_ITEM, "hidden sm:inline-flex")}>
                Dashboard
              </Link>

              <PillButton
                href="/jobs"
                variant="specialist"
                size="sm"
                className="hidden h-11 rounded-[10px] px-5 text-sm shadow-none hover:shadow-none sm:inline-flex"
              >
                Browse Jobs
              </PillButton>

              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <button
              type="button"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-haspopup="true"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E8E8E8] text-zinc-800 transition-colors duration-200 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-specialist/50 focus-visible:ring-offset-1 active:scale-95 lg:hidden"
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

      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        links={NAV_LINKS}
        variant="specialist"
        brand={["Quickhands ", "Africa"]}
        signedOutCta={{ label: "Register", href: "/sign-up" }}
        signedInCta={{ label: "Browse Jobs", href: "/jobs" }}
      />
    </div>
  )
}
