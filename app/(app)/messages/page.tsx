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
      <ConversationList />
    </div>
  )
}
