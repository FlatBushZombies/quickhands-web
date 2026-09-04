"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { MessageCircle } from "lucide-react"
import { getConversations, type Conversation } from "@/lib/messaging-api"
import { parseCard } from "@/lib/message-cards"

const AVATAR_ACCENTS = [
  "bg-primary/10 text-primary",
  "bg-[#F5E9FF] text-[#7C3AED]",
  "bg-[#FFF3DC] text-[#B45309]",
]

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getAccent(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_ACCENTS[hash % AVATAR_ACCENTS.length]
}

function timeAgo(dateString: string | null) {
  if (!dateString) return ""
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  return `${Math.floor(diffHours / 24)}d`
}

function previewText(conversation: Conversation) {
  if (!conversation.lastMessageText) return "No messages yet"
  const card = parseCard(conversation.lastMessageText)
  return card?.label ?? conversation.lastMessageText
}

export function ConversationList() {
  const { getToken } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const token = await getToken()
      if (!token || cancelled) return
      const data = await getConversations(token)
      if (!cancelled) {
        setConversations(data)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [getToken])

  if (loading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">No conversations yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Link
          key={conversation.conversationId}
          href={`/messages/${conversation.conversationId}`}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
        >
          {conversation.otherUser.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={conversation.otherUser.imageUrl} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
          ) : (
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getAccent(conversation.otherUser.displayName)}`}>
              {getInitials(conversation.otherUser.displayName)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-foreground">{conversation.otherUser.displayName}</p>
              <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(conversation.lastMessageAt)}</span>
            </div>
            {conversation.jobTitle ? <p className="truncate text-xs text-primary">{conversation.jobTitle}</p> : null}
            <p className="truncate text-sm text-muted-foreground">{previewText(conversation)}</p>
          </div>

          {conversation.unreadCount > 0 ? (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
              {conversation.unreadCount}
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  )
}
