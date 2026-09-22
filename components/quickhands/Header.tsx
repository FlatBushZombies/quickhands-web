"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { PillButton } from "./PillButton"
import { MobileNav } from "./MobileNav"
import { AudienceTabs } from "./AudienceTabs"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Tasks", href: "#tasks" },
  { label: "Become a Specialist", href: "/professionals" },
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

// Shared by every text link in the bar so the whole navigation reads as one
// system: same size, weight, radius and hover, one neutral colour.
const NAV_ITEM =
  "whitespace-nowrap rounded-[8px] px-3 py-2 font-sans text-sm font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-50 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1"

/**
 * Clerk's default avatar is a generated orange initial, which reads as a
 * stray accent next to the brand green. When the user has no photo of their
 * own, rotate that generated image's hue into the brand green (the white
 * initial is unaffected); real photos are left untouched. Either way the
 * avatar gets the same hairline ring as the rest of the bar's borders.
 */
function HeaderUserButton() {
  const { user } = useUser()
  const usesDefaultAvatar = user ? !user.hasImage : false

  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          userButtonAvatarBox: cn(
            "!h-9 !w-9 !shadow-[0_0_0_1px_#E8E8E8]",
            usesDefaultAvatar && "[&_img]:hue-rotate-[85deg] [&_img]:saturate-[0.85]"
          ),
        },
      }}
    />
  )
}

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const harareTime = useHarareTime()

  return (
    <div className="fixed inset-x-0 top-0 z-40">
      {/* Audience switch — the client / professional mode toggle, on an
          opaque neutral strip so the photo hero never shows through it. */}
      <AudienceTabs containerClassName="max-w-[1800px] px-5 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:max-w-[1600px]" />

      {/* Solid white bar at all times, separated from the photo hero by a
          single hairline rather than a shadow. */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.7, delay: 0.15 }}
        className="w-full border-b border-[#ECECEC] bg-white"
      >
        <div className="mx-auto flex h-16 w-full max-w-[1800px] items-center gap-4 px-5 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:max-w-[1600px]">
          {/* Brand */}
          <Link
            href="/"
            className="flex flex-shrink-0 items-center gap-2.5 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            {/* The source icon sits on a dark glow; scaling it inside a
                clipped square shows just the icon itself. */}
            <span className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-[10px]">
              <Image src="/quickhands.png" alt="QuickHands" fill sizes="36px" className="scale-[1.4] object-cover" />
            </span>
            <span className="font-sans text-xl font-bold tracking-[-0.02em] text-zinc-950">QuickHands</span>
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
            {harareTime && (
              <>
                <span
                  className="hidden items-center gap-1.5 font-sans text-xs text-zinc-500 xl:inline-flex"
                  aria-label={`Local time in Harare: ${harareTime}`}
                >
                  <span className="font-medium tabular-nums text-zinc-600">{harareTime}</span>
                  <span>Harare</span>
                </span>
                <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-[#E8E8E8] xl:block" />
              </>
            )}

            <SignedOut>
              <Link href="/sign-in" className={cn(NAV_ITEM, "hidden sm:inline-flex")}>
                Sign in
              </Link>

              <PillButton
                href="/sign-up"
                size="sm"
                className="hidden h-11 rounded-[10px] px-5 text-sm shadow-none hover:shadow-none sm:inline-flex"
              >
                Post a Task
              </PillButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard" className={cn(NAV_ITEM, "hidden sm:inline-flex")}>
                Dashboard
              </Link>

              <PillButton
                href="/post-job"
                size="sm"
                className="hidden h-11 rounded-[10px] px-5 text-sm shadow-none hover:shadow-none sm:inline-flex"
              >
                Post a Task
              </PillButton>

              <HeaderUserButton />
            </SignedIn>

            <button
              type="button"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-haspopup="true"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E8E8E8] text-zinc-800 transition-colors duration-200 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 active:scale-95 lg:hidden"
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
