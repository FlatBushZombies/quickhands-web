"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function ProfessionalsHeader() {
  const links = [
    { label: "How It Works", href: "#how" },
    { label: "For Clients", href: "/" },
  ]

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 w-full">
        {/* Solid, opaque bar at all times — kept clearly distinct from the
            photo hero underneath rather than blending into it. */}
        <header className="w-full border-b border-zinc-200 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
          <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-3.5">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative h-8 w-8 overflow-hidden rounded-full flex-shrink-0 border border-zinc-200/60 bg-zinc-50 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Image
                  src="/quickhands.png"
                  alt="Quickhands"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-xs font-semibold tracking-tight text-zinc-900 transition-colors duration-200 group-hover:text-primary font-sans">
                Quickhands Africa
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1.5 font-sans">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs font-medium px-3.5 py-1.5 text-zinc-500 transition-colors duration-200 hover:text-zinc-900"
                >
                  {link.label}
                </Link>
              ))}

              <div className="w-px h-4 mx-2 bg-zinc-200/60" />

              <SignedOut>
                <Link
                  href="/sign-in"
                  className="text-xs font-medium px-3.5 py-1.5 rounded-full text-zinc-500 transition-colors duration-200 hover:text-zinc-950 hover:bg-zinc-50"
                >
                  Sign in
                </Link>

                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "sm",
                    className: "rounded-full px-5 text-xs font-semibold bg-primary text-white hover:bg-primary-hover active:scale-[0.97] shadow-[0_4px_14px_rgba(38,192,141,0.25)] hover:shadow-[0_6px_20px_rgba(38,192,141,0.35)] transition-all duration-200 border-0",
                  })}
                >
                  Register
                </Link>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-xs font-medium px-3.5 py-1.5 rounded-full text-zinc-500 transition-colors duration-200 hover:text-zinc-950 hover:bg-zinc-50"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile menu */}
            <div className="flex items-center gap-2 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 border-zinc-200 hover:bg-zinc-50 text-zinc-900"
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
                    <SignedOut>
                      <Link
                        href="/sign-in"
                        className={buttonVariants({
                          variant: "link",
                          className: "w-full text-xs font-semibold text-zinc-500 hover:text-zinc-900",
                        })}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/sign-up"
                        className={buttonVariants({
                          className: "w-full rounded-full text-xs font-semibold h-10 bg-primary text-white hover:bg-primary-hover shadow-sm",
                        })}
                      >
                        Register
                      </Link>
                    </SignedOut>
                    <SignedIn>
                      <Link
                        href="/dashboard"
                        className={buttonVariants({
                          className: "w-full rounded-full text-xs font-semibold h-10 bg-primary text-white hover:bg-primary-hover shadow-sm",
                        })}
                      >
                        Dashboard
                      </Link>
                    </SignedIn>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

          </nav>
        </header>
      </div>
    </>
  )
}
