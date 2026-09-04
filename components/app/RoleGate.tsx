"use client"

import Link from "next/link"
import { useAppRole } from "@/components/app/AppRoleContext"
import type { AppRole } from "@/lib/user-api"

export function RoleGate({
  allow,
  children,
}: {
  allow: AppRole
  children: React.ReactNode
}) {
  const { appRole } = useAppRole()

  if (appRole !== allow) {
    const message =
      allow === "client"
        ? "Only clients can post jobs."
        : "Only specialists can apply to jobs."

    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-sm text-muted-foreground">{message}</p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          Go to your dashboard
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
