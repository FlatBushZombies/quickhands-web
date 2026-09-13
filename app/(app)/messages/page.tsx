import type { Metadata } from "next"
import { ConversationList } from "@/components/messaging/ConversationList"

export const metadata: Metadata = {
  title: "Messages",
  description: "Your QuickHands conversations with clients and specialists.",
  robots: { index: false, follow: false },
}

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Coordinate directly with clients and specialists.</p>

      <div className="mt-6">
        <ConversationList />
      </div>
    </div>
  )
}
