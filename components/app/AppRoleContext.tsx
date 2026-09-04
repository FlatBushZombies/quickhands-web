"use client"

import { createContext, useContext } from "react"
import type { AppRole } from "@/lib/user-api"

interface AppRoleContextValue {
  appRole: AppRole
  clerkId: string
}

const AppRoleContext = createContext<AppRoleContextValue | null>(null)

export function AppRoleProvider({
  value,
  children,
}: {
  value: AppRoleContextValue
  children: React.ReactNode
}) {
  return <AppRoleContext.Provider value={value}>{children}</AppRoleContext.Provider>
}

export function useAppRole() {
  const ctx = useContext(AppRoleContext)
  if (!ctx) {
    throw new Error("useAppRole must be used within AppRoleProvider (inside the (app) route group)")
  }
  return ctx
}
