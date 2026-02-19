"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { useState } from "react"
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

  const links = [
    { label: "Find Work", href: "#jobs" },
    { label: "Find Talent", href: "#talent" },
    { label: "How It Works", href: "#how" },
    { label: "For Clients", href: "/" },
  ]

  return (
    <>
      <header
        className={cn(
          "sticky top-6 z-50",
          "mx-auto w-full max-w-6xl",
          "rounded-2xl border bg-background/80 backdrop-blur-xl",
          "shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
        )}
      >
        <nav className="flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border bg-muted">
              <Image
                src="/quickhands.png"
                alt="Quickhands"
                fill
                className="object-contain p-1 transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Quickhands
            </span>
          </Link>

          {/* Desktop nav + primary action */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "rounded-xl",
                })}
              >
                {link.label}
              </Link>
            ))}

            <OnboardingModal>
              <Button size="sm" className="ml-2 rounded-xl px-5">
                Register
              </Button>
            </OnboardingModal>
          </div>

          {/* Mobile menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex flex-col bg-background/90 backdrop-blur-xl"
                showClose={false}
              >
                <div className="pt-10 space-y-1">
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={buttonVariants({
                        variant: "ghost",
                        className: "w-full justify-start rounded-xl",
                      })}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-auto space-y-2 border-t pt-4">
                  <OnboardingModal>
                    <Button className="w-full rounded-xl">Register</Button>
                  </OnboardingModal>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

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