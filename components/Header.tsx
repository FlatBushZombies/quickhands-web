"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { useState } from "react"
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

  const links = [
    { label: "How It Works", href: "#how" },
    { label: "For Professionals", href: "/professionals" },
  ]

  return (
    <>
      <div className="sticky top-4 z-50 px-4 sm:px-6">
        <header
          className={cn(
            "mx-auto w-full max-w-6xl",
            "rounded-2xl border border-border/50 bg-background/90 backdrop-blur-xl",
            "shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)]"
          )}
        >
          <nav className="flex items-center justify-between px-4 py-2.5">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative h-8 w-8 overflow-hidden rounded-[10px] border border-border/60 bg-muted flex-shrink-0">
                <Image
                  src="/quickhands.png"
                  alt="Quickhands"
                  fill
                  className="object-contain p-1 transition-transform duration-200 group-hover:scale-110"
                />
              </div>
              <span className="text-[15px] font-semibold tracking-tight">
                Quickhands Africa
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "rounded-xl text-[13px] text-muted-foreground hover:text-foreground",
                  })}
                >
                  {link.label}
                </Link>
              ))}

              <div className="w-px h-4 bg-border/60 mx-1.5" />

              <ClientLogin>
                <Button
                  size="sm"
                  className="rounded-xl px-4 text-[13px] font-medium"
                >
                  Login / Register
                </Button>
              </ClientLogin>
            </div>

            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden h-8 w-8 rounded-xl border-border/60"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex flex-col w-72 bg-background/95 backdrop-blur-xl"
                showClose={false}
              >
                {/* Sheet logo */}
                <div className="flex items-center gap-2.5 pt-2 pb-6 border-b border-border/50">
                  <div className="relative h-8 w-8 overflow-hidden rounded-[10px] border border-border/60 bg-muted flex-shrink-0">
                    <Image
                      src="/quickhands.png"
                      alt="Quickhands"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-[15px] font-semibold tracking-tight">
                    Quickhands Africa
                  </span>
                </div>

                <div className="pt-4 space-y-1">
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={buttonVariants({
                        variant: "ghost",
                        className: "w-full justify-start rounded-xl text-[13px] text-muted-foreground",
                      })}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-auto space-y-2 border-t border-border/50 pt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl text-[13px]"
                    onClick={() => setShowLogin(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full rounded-xl text-[13px]"
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