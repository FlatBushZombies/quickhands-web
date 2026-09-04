"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { AppRoleProvider } from "@/components/app/AppRoleContext"
import type { AppRole } from "@/lib/user-api"

/**
 * Backstop for routes middleware can only prove "signed in" for, not
 * "signed in AND has picked a role AND finished onboarding". Reads Clerk's
 * unsafeMetadata (already in the session object — no extra network round
 * trip) rather than a backend call, same mechanism client-app already uses
 * for its own onboarding gate.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const completedOnboarding = user?.unsafeMetadata?.completedOnboarding === true
  const appRole = user?.unsafeMetadata?.appRole as AppRole | undefined

  useEffect(() => {
    if (!isLoaded) return
    if (!user) return // middleware already redirects signed-out visitors away from protected routes
    if (!completedOnboarding || !appRole) {
      router.replace("/onboarding")
    }
  }, [isLoaded, user, completedOnboarding, appRole, router])

  if (!isLoaded || !user || !completedOnboarding || !appRole) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <AppRoleProvider value={{ appRole, clerkId: user.id }}>{children}</AppRoleProvider>
  )
}
