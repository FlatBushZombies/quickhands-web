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
            "rounded-2xl backdrop-blur-xl bg-background/90",
            scrolled
              ? "shadow-lg border border-border/80 py-1"
              : "shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] border border-border/50 py-2"
          )}
        >
          <nav className="flex items-center justify-between px-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-border/60 bg-muted shadow-sm flex-shrink-0">
                <Image
                  src="/quickhands.png"
                  alt="Quickhands"
                  fill
                  className="object-contain p-1 transition-transform duration-200 group-hover:scale-110"
                />
              </div>
              <span className="text-lg font-semibold tracking-tight transition group-hover:opacity-80">
                Quickhands Africa
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "rounded-xl text-[13px] text-muted-foreground hover:text-foreground",
                    "transition-all duration-200 hover:bg-muted/60",
                    "relative after:absolute after:bottom-1 after:left-3 after:right-3 after:h-[1px] after:bg-foreground after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <OnboardingModal>
                <Button
                  size="sm"
                  className="ml-2 rounded-xl px-5 bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"
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
                    className="rounded-xl border-border/60 h-8 w-8"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="flex flex-col w-72 bg-background/95 backdrop-blur-xl"
                  showClose={false}
                >
                  {/* Logo */}
                  <div className="flex items-center gap-2.5 pt-2 pb-6 border-b border-border/50">
                    <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-border/60 bg-muted shadow-sm flex-shrink-0">
                      <Image
                        src="/quickhands.png"
                        alt="Quickhands"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                      Quickhands Africa
                    </span>
                  </div>

                  <div className="pt-6 space-y-2">
                    {links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={buttonVariants({
                          variant: "ghost",
                          className:
                            "w-full justify-start rounded-xl text-[13px] text-muted-foreground hover:bg-muted/60",
                        })}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto space-y-2 border-t border-border/50 pt-4">
                    <OnboardingModal>
                      <Button className="w-full rounded-xl h-10 shadow-md">
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