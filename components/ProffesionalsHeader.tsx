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
      <div className="fixed inset-x-0 top-0 z-50 w-full">
        <header
          className={cn(
            "w-full border-b transition-all duration-300",
            scrolled
              ? "bg-white/95 border-zinc-200 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
              : "bg-transparent border-transparent"
          )}
        >
          <nav
            className={cn(
              "mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 transition-all duration-300",
              scrolled ? "py-3.5" : "py-5"
            )}
          >

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div
                className={cn(
                  "relative h-8 w-8 overflow-hidden rounded-full flex-shrink-0 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-3",
                  scrolled
                    ? "border border-zinc-200/60 bg-zinc-50"
                    : "border border-white/30 bg-white/90 backdrop-blur-sm"
                )}
              >
                <Image
                  src="/quickhands.png"
                  alt="Quickhands"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span
                className={cn(
                  "text-xs font-semibold tracking-tight transition-colors duration-200 group-hover:text-primary font-sans",
                  scrolled ? "text-zinc-900" : "text-white"
                )}
              >
                Quickhands Africa
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1.5 font-sans">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-xs font-medium px-3.5 py-1.5 transition-colors duration-200",
                    scrolled
                      ? "text-zinc-500 hover:text-zinc-900"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div
                className={cn(
                  "w-px h-4 mx-2 transition-colors duration-300",
                  scrolled ? "bg-zinc-200/60" : "bg-white/25"
                )}
              />

              <OnboardingModal>
                <Button
                  size="sm"
                  className="rounded-full px-5 text-xs font-semibold bg-primary text-white hover:bg-primary-hover active:scale-[0.97] shadow-[0_4px_14px_rgba(38,192,141,0.25)] hover:shadow-[0_6px_20px_rgba(38,192,141,0.35)] transition-all duration-200 cursor-pointer border-0"
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
                    className={cn(
                      "rounded-full h-8 w-8 transition-colors duration-300",
                      scrolled
                        ? "border-zinc-200 hover:bg-zinc-50 text-zinc-900"
                        : "border-white/40 bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="flex flex-col w-72 bg-white/95 backdrop-blur-xl border-r border-zinc-200"
                  showClose={false}
                >
                  {/* Logo */}
                  <div className="flex items-center gap-2.5 pt-2 pb-6 border-b border-zinc-200">
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

                  <div className="mt-auto space-y-2 border-t border-zinc-200 pt-4 font-sans">
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