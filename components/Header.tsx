"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { LoginModal } from "./LoginModal"
import { SignupModal } from "./SignupModal"

export function Header() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-xl font-bold font-schibsted-grotesk">Quickhands</span>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <a
                href="#jobs"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Find Work
              </a>
              <a
                href="#talent"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Find Talent
              </a>
              <a
                href="#how"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setShowLogin(true)}>
              Log in
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowSignup(true)}
            >
              Sign Up
            </Button>
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
