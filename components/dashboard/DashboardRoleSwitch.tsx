"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { AccountClient } from "@/components/account/AccountClient"
import { ProAccountView } from "@/components/pro-account/ProAccountView"

/**
 * /dashboard is the account page for both roles. Freelancers get the
 * specialist view, clients get the client view, and anyone without a
 * completed role onboarding is sent to /onboarding.
 */
export function DashboardRoleSwitch() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const appRole = user?.unsafeMetadata?.appRole as string | undefined
  const onboarded = user?.unsafeMetadata?.completedOnboarding === true
  const hasRole = appRole === "freelancer" || appRole === "client"

  useEffect(() => {
    if (!isLoaded) return
    if (!user) {
      router.replace("/sign-in")
      return
    }
    if (!onboarded || !hasRole) router.replace("/onboarding")
  }, [isLoaded, user, onboarded, hasRole, router])

  if (!isLoaded || !user || !onboarded || !hasRole) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return appRole === "freelancer" ? <ProAccountView /> : <AccountClient />
}
