"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { LoginModal } from "./LoginModal"
import { SignupModal } from "./SignupModal"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ClientLogin } from "./ClientLogin"
import { OnboardingModal } from "./OnboardingModal"

export function ProfessionalsHeader() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 transition-all duration-200">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <Image
                  src="/quickhands.png"
                  height={32}
                  width={32}
                  alt="Quickhands Logo"
                  className="transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <span className="font-sans text-xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                Quickhands
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              <Link
                href="#jobs"
                className="relative px-4 py-2 font-sans text-[15px] font-medium text-foreground/80 transition-all duration-200 hover:text-foreground rounded-lg hover:bg-accent/50 group"
              >
                Find Work
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-primary transition-all duration-200 group-hover:w-3/4 group-hover:left-[12.5%]" />
              </Link>
              <Link
                href="#talent"
                className="relative px-4 py-2 font-sans text-[15px] font-medium text-foreground/80 transition-all duration-200 hover:text-foreground rounded-lg hover:bg-accent/50 group"
              >
                Find Talent
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-primary transition-all duration-200 group-hover:w-3/4 group-hover:left-[12.5%]" />
              </Link>
              <Link
                href="#how"
                className="relative px-4 py-2 font-sans text-[15px] font-medium text-foreground/80 transition-all duration-200 hover:text-foreground rounded-lg hover:bg-accent/50 group"
              >
                How It Works
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-primary transition-all duration-200 group-hover:w-3/4 group-hover:left-[12.5%]" />
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden lg:block px-3 py-2 font-sans text-[15px] font-medium text-foreground/80 transition-all duration-200 hover:text-foreground rounded-lg hover:bg-accent/50"
            >
              Website for clients
            </Link>

            <OnboardingModal>
            <Button
                  size="lg"
                  className="h-14 bg-primary px-8 font-sans font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Register 
                </Button>
            </OnboardingModal>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="#jobs"
                    className="px-4 py-3 font-sans text-base font-medium text-foreground/80 transition-all duration-200 hover:text-foreground hover:bg-accent/50 rounded-lg"
                  >
                    Find Work
                  </Link>
                  <Link
                    href="#talent"
                    className="px-4 py-3 font-sans text-base font-medium text-foreground/80 transition-all duration-200 hover:text-foreground hover:bg-accent/50 rounded-lg"
                  >
                    Find Talent
                  </Link>
                  <Link
                    href="#how"
                    className="px-4 py-3 font-sans text-base font-medium text-foreground/80 transition-all duration-200 hover:text-foreground hover:bg-accent/50 rounded-lg"
                  >
                    How It Works
                  </Link>
                  <div className="border-t border-border my-2" />
                  <Link
                    href="/"
                    className="px-4 py-3 font-sans text-base font-medium text-foreground/80 transition-all duration-200 hover:text-foreground hover:bg-accent/50 rounded-lg"
                  >
                    Website for clients
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
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
