import type { Metadata } from "next"
import DashboardClient from "./DashboardClient"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your QuickHands jobs, applications and notifications.",
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return <DashboardClient />
}
