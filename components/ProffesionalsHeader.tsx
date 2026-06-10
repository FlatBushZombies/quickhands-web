"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { LoginModal } from "./LoginModal"
import { SignupModal } from "./SignupModal"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { OnboardingModal } from "./OnboardingModal"
import { cn } from "@/lib/utils"

export function ProfessionalsHeader() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const links = [
    { label: "How It Works", href: "#how" },
    { label: "For Clients", href: "/" },
  ]

  return (
    <>
      <div className="sticky top-4 z-50 px-4 sm:px-6">
        <header
          className={cn(
            "mx-auto w-full max-w-6xl transition-all duration-300 relative",
            "rounded-full backdrop-blur-xl",
            "bg-white/85",
            scrolled
              ? "shadow-sm border border-zinc-200/80 py-1"
              : "shadow-[0_2px_15px_-4px_rgba(0,0,0,0.04)] border border-zinc-100 py-1.5"
          )}
        >
          <nav className="flex items-center justify-between px-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-zinc-100 bg-zinc-50 shadow-sm flex-shrink-0">
                <Image
                  src="/quickhands.png"
                  alt="Quickhands"
                  fill
                  className="object-contain p-1 transition-transform duration-200 group-hover:scale-110"
                />
              </div>
              <span className="text-xs font-semibold tracking-tight transition group-hover:opacity-80 font-sans text-zinc-900">
                Quickhands Africa
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 font-sans">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "rounded-full text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
                    "transition-all duration-200 relative"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="w-px h-4 bg-zinc-100 mx-1.5" />

              <OnboardingModal>
                <Button
                  size="sm"
                  className="rounded-full px-5 text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
                >
                  Register
                </Button>
              </OnboardingModal>
            </div>

            {/* Mobile menu */}
            <div className="flex items-center gap-2 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-zinc-200 hover:bg-zinc-50 h-8 w-8"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="flex flex-col w-72 bg-white/95 backdrop-blur-xl border-r border-zinc-100"
                  showClose={false}
                >
                  {/* Logo */}
                  <div className="flex items-center gap-2.5 pt-2 pb-6 border-b border-zinc-100">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-zinc-150 bg-zinc-50 shadow-sm flex-shrink-0">
                      <Image
                        src="/quickhands.png"
                        alt="Quickhands"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <span className="text-[13px] font-semibold tracking-tight text-zinc-900 font-sans">
                      Quickhands Africa
                    </span>
                  </div>

                  <div className="pt-6 space-y-2 font-sans">
                    {links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={buttonVariants({
                          variant: "ghost",
                          className:
                            "w-full justify-start rounded-full text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
                        })}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto space-y-2 border-t border-zinc-100 pt-4 font-sans">
                    <OnboardingModal>
                      <Button className="w-full rounded-full text-xs font-semibold h-10 bg-primary text-white hover:bg-primary-hover shadow-sm">
                        Register
                      </Button>
                    </OnboardingModal>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

          </nav>
        </header>
      </div>

      <LoginModal
        open={showLogin}
        onOpenChange={setShowLogin}
        onSignupClick={() => {
          setShowLogin(false)
          setShowSignup(true)
        }}
      />
      <SignupModal
        open={showSignup}
        onOpenChange={setShowSignup}
        onLoginClick={() => {
          setShowSignup(false)
          setShowLogin(true)
        }}
      />
    </>
  )
}