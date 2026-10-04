import type { Metadata } from "next"
import { DashboardRoute } from "@/components/dashboard/DashboardRoute"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your QuickHands account: tasks, offers and conversations.",
  robots: { index: false, follow: false },
}

// Outside the (app) group on purpose: clients get the standalone account
// design, specialists keep the three-pane shell (see DashboardRoute).
export default function DashboardPage() {
  return <DashboardRoute />
}
