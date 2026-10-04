import type { Metadata } from "next"
import { AccountClient } from "@/components/account/AccountClient"

export const metadata: Metadata = {
  title: "Account",
  description: "Your QuickHands tasks, offers and conversations with specialists.",
  robots: { index: false, follow: false },
}

export default function AccountPage() {
  return <AccountClient />
}
