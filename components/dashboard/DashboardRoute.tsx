"use client"

import { OnboardingGate } from "@/components/app/OnboardingGate"
import { useAppRole } from "@/components/app/AppRoleContext"
import { AccountClient } from "@/components/account/AccountClient"
import { AppShell } from "@/components/app-shell/AppShell"
import DashboardClient from "@/components/dashboard/DashboardClient"

/**
 * /dashboard serves both roles. Clients get the standalone account page;
 * everyone else keeps the three-pane shell that used to be the (app) layout.
 */
export function DashboardRoute() {
  return (
    <OnboardingGate>
      <DashboardByRole />
    </OnboardingGate>
  )
}

function DashboardByRole() {
  const { appRole } = useAppRole()

  if (appRole === "client") {
    return <AccountClient />
  }

  return (
    <div className="min-h-dvh bg-background">
      <AppShell>
        <DashboardClient />
      </AppShell>
    </div>
  )
}
