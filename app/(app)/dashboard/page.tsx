"use client"

import Link from "next/link"
import { Briefcase, Send } from "lucide-react"
import { useAppRole } from "@/components/app/AppRoleContext"
import { Button } from "@/components/ui/button"
import { ClientApplicationsPanel } from "@/components/dashboard/ClientApplicationsPanel"
import { SpecialistApplicationsPanel } from "@/components/dashboard/SpecialistApplicationsPanel"
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel"

export default function DashboardPage() {
  const { appRole } = useAppRole()
  const isClient = appRole === "client"

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Distinct icon+color per role's core action, so "posting" and
              "applying" read as visibly different activities, not the same
              screen with a swapped label. */}
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isClient ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>
            {isClient ? <Briefcase className="h-5 w-5" /> : <Send className="h-5 w-5" />}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {isClient ? "Jobs you've posted" : "Jobs you've applied to"}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {isClient ? "Review applicants and manage your jobs." : "Track the status of your applications."}
            </p>
          </div>
        </div>
        {isClient ? (
          <Link href="/post-job">
            <Button>
              <Briefcase className="h-4 w-4" />
              Post a job
            </Button>
          </Link>
        ) : (
          <Link href="/jobs">
            <Button>
              <Send className="h-4 w-4" />
              Browse jobs
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>{isClient ? <ClientApplicationsPanel /> : <SpecialistApplicationsPanel />}</div>
        <div>
          <NotificationsPanel />
        </div>
      </div>
    </div>
  )
}
