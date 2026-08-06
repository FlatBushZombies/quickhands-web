"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { LoginModal } from "./LoginModal"
import { SignupModal } from "./SignupModal"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ClientLogin } from "./ClientLogin"
import { cn } from "@/lib/utils"

export function Header() {
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
    { label: "For Professionals", href: "/professionals" },
  ]

  return (
    <>
      <div className="sticky top-5 z-50 px-4 sm:px-6">
        <header
          className={cn(
            "mx-auto w-full max-w-6xl transition-all duration-300 relative",
            "rounded-full backdrop-blur-md",
            scrolled
              ? "bg-white/90 border border-zinc-200/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] py-1"
              : "bg-white/75 border border-zinc-150/50 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)] py-2"
          )}
        >
          <nav className="flex items-center justify-between px-5">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-zinc-200/60 bg-zinc-50 shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Image
                  src="/quickhands.png"
                  alt="Quickhands"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-xs font-semibold tracking-tight transition-colors duration-200 group-hover:text-primary font-sans text-zinc-900">
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
                    "rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 px-3.5 py-1.5",
                    "transition-all duration-200 relative"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="w-px h-4 bg-zinc-200/60 mx-2" />

              <button
                onClick={() => setShowLogin(true)}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-950 px-3.5 py-1.5 rounded-full hover:bg-zinc-50 active:scale-[0.97] transition-all duration-200 cursor-pointer"
              >
                Sign in
              </button>

              <ClientLogin>
                <Button
                  size="sm"
                  className="rounded-full px-5 text-xs font-semibold bg-primary text-white hover:bg-primary-hover active:scale-[0.97] shadow-[0_4px_14px_rgba(38,192,141,0.25)] hover:shadow-[0_6px_20px_rgba(38,192,141,0.35)] transition-all duration-200 cursor-pointer border-0"
                >
                  Get Started
                </Button>
              </ClientLogin>
            </div>

            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden h-8 w-8 rounded-full border-zinc-200 hover:bg-zinc-50 active:scale-90 transition-transform duration-150"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex flex-col w-72 bg-white/95 backdrop-blur-xl border-r border-zinc-200"
                showClose={false}
              >
                {/* Sheet logo */}
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
                  <Button
                    variant="link"
                    className="w-full text-xs font-semibold text-zinc-500 hover:text-zinc-900"
                    onClick={() => setShowLogin(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full rounded-full text-xs font-semibold h-10 bg-primary text-white hover:bg-primary-hover shadow-sm"
                    onClick={() => setShowSignup(true)}
                  >
                    Get Started
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

          </nav>
        </header>
      </div>

      {/* Auth modals */}
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