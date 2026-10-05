"use client"

import type { ReactNode } from "react"
import { useUser } from "@clerk/nextjs"
import { AccountClient } from "@/components/account/AccountClient"
import { ProAccountView } from "@/components/pro-account/ProAccountView"

/**
 * A signed-in, onboarded user who opens the landing page for their own role
 * sees that role's account dashboard. Everyone else sees the landing page.
 */
export function RoleLanding({ role, children }: { role: "client" | "freelancer"; children: ReactNode }) {
  const { user, isLoaded } = useUser()

  if (!isLoaded || !user) return <>{children}</>
  const onboarded = user.unsafeMetadata?.completedOnboarding === true
  if (!onboarded || user.unsafeMetadata?.appRole !== role) return <>{children}</>

  return role === "client" ? <AccountClient /> : <ProAccountView />
}
