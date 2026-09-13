import type { Metadata } from "next"
import ConversationClient from "./ConversationClient"

export const metadata: Metadata = {
  title: "Conversation",
  description: "Your QuickHands conversation.",
  robots: { index: false, follow: false },
}

interface PageProps {
  params: Promise<{ conversationId: string }>
}

export default async function ConversationPage({ params }: PageProps) {
  const { conversationId } = await params
  return <ConversationClient conversationId={conversationId} />
}
