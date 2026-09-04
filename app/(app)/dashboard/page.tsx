"use client"

import Link from "next/link"
import { useAppRole } from "@/components/app/AppRoleContext"
import { Button } from "@/components/ui/button"
import { ClientApplicationsPanel } from "@/components/dashboard/ClientApplicationsPanel"
import { SpecialistApplicationsPanel } from "@/components/dashboard/SpecialistApplicationsPanel"

export default function DashboardPage() {
  const { appRole } = useAppRole()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {appRole === "client" ? "Your posted jobs" : "Your applications"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {appRole === "client" ? "Review applicants and manage your jobs." : "Track the jobs you've applied to."}
          </p>
        </div>
        {appRole === "client" ? (
          <Link href="/post-job">
            <Button>Post a job</Button>
          </Link>
        ) : (
          <Link href="/jobs">
            <Button>Browse jobs</Button>
          </Link>
        )}
      </div>

      <div className="mt-6">
        {appRole === "client" ? <ClientApplicationsPanel /> : <SpecialistApplicationsPanel />}
      </div>
    </div>
  )
}
