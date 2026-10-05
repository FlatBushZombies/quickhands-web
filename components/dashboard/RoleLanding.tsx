"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { AccountClient } from "@/components/account/AccountClient"
import { ProAccountView } from "@/components/pro-account/ProAccountView"

/**
 * A signed-in, onboarded user who opens the landing page for their own role
 * sees that role's account dashboard. If they open the other role's landing,
 * they are sent to /dashboard. Users who have not finished onboarding see the
 * landing page.
 */
export function RoleLanding({ role, children }: { role: "client" | "freelancer"; children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const onboarded = user?.unsafeMetadata?.completedOnboarding === true
  const appRole = user?.unsafeMetadata?.appRole
  const viewingLanding = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("view") === "landing"
  const isOtherRole = Boolean(user && onboarded && appRole && appRole !== role && !viewingLanding)

  useEffect(() => {
    if (isOtherRole) router.replace("/dashboard")
  }, [isOtherRole, router])

  if (!isLoaded || !user || viewingLanding) return <>{children}</>
  if (isOtherRole) return null
  if (!onboarded || appRole !== role) return <>{children}</>

  return role === "client" ? <AccountClient /> : <ProAccountView />
}
