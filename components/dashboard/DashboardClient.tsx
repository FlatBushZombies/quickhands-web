"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Briefcase, Compass, Send, Users } from "lucide-react"
import { useAppRole } from "@/components/app/AppRoleContext"
import { Button } from "@/components/ui/button"
import { PaneTabs, panelId, tabId, type PaneTab } from "@/components/app-shell/PaneTabs"
import { SCROLL_THIN } from "@/components/app-shell/role-styles"
import { ClientApplicationsPanel } from "@/components/dashboard/ClientApplicationsPanel"
import { SpecialistApplicationsPanel } from "@/components/dashboard/SpecialistApplicationsPanel"
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel"
import { SpecialistsForYouPanel } from "@/components/dashboard/SpecialistsForYouPanel"
import { JobsForYouPanel } from "@/components/dashboard/JobsForYouPanel"

const ID_PREFIX = "dashboard"

export default function DashboardClient() {
  const { appRole } = useAppRole()
  const isClient = appRole === "client"
  const [activeTab, setActiveTab] = useState<"main" | "discover" | "notifications">("main")

  const tabs: PaneTab[] = [
    isClient ? { id: "main", label: "Jobs", icon: Briefcase } : { id: "main", label: "Applications", icon: Send },
    isClient ? { id: "discover", label: "Specialists", icon: Users } : { id: "discover", label: "Jobs for you", icon: Compass },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  return (
    // Fills the pane: heading + tab bar stay put, the active panel scrolls.
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-4 pt-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {/* Distinct icon+color per role's core action, so "posting" and
              "applying" read as visibly different activities, not the same
              screen with a swapped label. */}
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isClient ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>
            {isClient ? <Briefcase className="h-5 w-5" /> : <Send className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
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

      <PaneTabs
        tabs={tabs}
        value={activeTab}
        onChange={(id) => setActiveTab(id as "main" | "discover" | "notifications")}
        idPrefix={ID_PREFIX}
        label="Dashboard sections"
      />

      {/* Both panels stay mounted (inactive one is just hidden) so an
          in-progress review form or loaded data survives a tab switch and
          each panel keeps its existing visibility-aware refresh behaviour.
          Content column matches every sibling in-shell page (/jobs,
          /messages, /settings all use mx-auto max-w-* px-4 py-8 sm:px-6) —
          the dashboard was the one page stretching its lists edge-to-edge
          across the pane instead of sitting in the same centered column. */}
      <div className={`min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6 ${SCROLL_THIN}`}>
        <div className="mx-auto w-full max-w-4xl">
          <div
            role="tabpanel"
            id={panelId(ID_PREFIX, "main")}
            aria-labelledby={tabId(ID_PREFIX, "main")}
            hidden={activeTab !== "main"}
          >
            {isClient ? <ClientApplicationsPanel /> : <SpecialistApplicationsPanel />}
          </div>
          <div
            role="tabpanel"
            id={panelId(ID_PREFIX, "discover")}
            aria-labelledby={tabId(ID_PREFIX, "discover")}
            hidden={activeTab !== "discover"}
          >
            {isClient ? <SpecialistsForYouPanel /> : <JobsForYouPanel />}
          </div>
          <div
            role="tabpanel"
            id={panelId(ID_PREFIX, "notifications")}
            aria-labelledby={tabId(ID_PREFIX, "notifications")}
            hidden={activeTab !== "notifications"}
          >
            <NotificationsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
