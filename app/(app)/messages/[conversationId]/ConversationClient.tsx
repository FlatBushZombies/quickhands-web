"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { ChatWindow } from "@/components/messaging/ChatWindow"
import { getConversationMessages, type Conversation } from "@/lib/messaging-api"

export default function ConversationClient({ conversationId }: { conversationId: string }) {
  const { getToken } = useAuth()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const token = await getToken()
      if (!token || cancelled) return
      const { conversation: conv } = await getConversationMessages(conversationId, token)
      if (!cancelled) {
        setConversation(conv)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [conversationId, getToken])

  if (loading) {
    return <div className="h-full min-h-0 animate-pulse bg-secondary motion-reduce:animate-none" />
  }

  return (
    <div className="h-full min-h-0">
      <ChatWindow
        conversationId={conversationId}
        otherDisplayName={conversation?.otherUser.displayName || "Conversation"}
        otherAvatarUrl={conversation?.otherUser.imageUrl || null}
      />
    </div>
  )
}
