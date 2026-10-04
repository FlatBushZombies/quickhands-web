import type { Metadata } from "next"
import { DashboardRoleSwitch } from "@/components/dashboard/DashboardRoleSwitch"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your QuickHands account, jobs and profile.",
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return <DashboardRoleSwitch />
}
