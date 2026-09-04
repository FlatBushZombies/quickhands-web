"use client"

import { use, useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { ChatWindow } from "@/components/messaging/ChatWindow"
import { getConversationMessages, type Conversation } from "@/lib/messaging-api"

export default function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params)
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
    return <div className="mx-auto h-[calc(100vh-4rem)] max-w-2xl animate-pulse bg-secondary" />
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ChatWindow
        conversationId={conversationId}
        otherDisplayName={conversation?.otherUser.displayName || "Conversation"}
        otherAvatarUrl={conversation?.otherUser.imageUrl || null}
      />
    </div>
  )
}
