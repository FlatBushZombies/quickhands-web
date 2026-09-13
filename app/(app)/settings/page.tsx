import type { Metadata } from "next"
import SettingsClient from "./SettingsClient"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your QuickHands bio page, contact details and public links.",
  robots: { index: false, follow: false },
}

export default function SettingsPage() {
  return <SettingsClient />
}
