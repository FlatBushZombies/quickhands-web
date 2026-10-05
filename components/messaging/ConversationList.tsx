"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { MessageCircle } from "lucide-react"
import { getConversations, type Conversation } from "@/lib/messaging-api"
import { parseCard } from "@/lib/message-cards"
import { useAppRole } from "@/components/app/AppRoleContext"
import { getInitials } from "@/components/app-shell/Avatar"
import {
  MSG_ROOT_CLASS,
  MSG_ROOT_STYLE,
  MessagingStyles,
  messagingPalette,
} from "@/components/messaging/MessagingDesign"

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
  const { appRole } = useAppRole()
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

  let body: ReactNode
  if (loading) {
    body = <div className="h-40 animate-pulse rounded-[20px] bg-[var(--ink-50)] motion-reduce:animate-none" />
  } else if (conversations.length === 0) {
    body = (
      <div className="qh-msg-inset rounded-[20px] bg-[var(--white)] px-6 py-16 text-center">
        <MessageCircle className="mx-auto h-7 w-7 text-[var(--ink-400)]" />
        <p className="qh-msg-eyebrow mt-4">No conversations yet</p>
      </div>
    )
  } else {
    body = (
      <div className="space-y-2">
        {conversations.map((conversation) => (
          <Link
            key={conversation.conversationId}
            href={`/messages/${conversation.conversationId}`}
            className="qh-msg-row qh-msg-inset flex items-center gap-3 rounded-[20px] bg-[var(--white)] p-4"
          >
            {conversation.otherUser.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={conversation.otherUser.imageUrl} alt="" className="h-11 w-11 shrink-0 rounded-[12px] object-cover" />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--ink-50)] text-[13px] font-medium text-[var(--ink-600)] qh-msg-inset">
                {getInitials(conversation.otherUser.displayName)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[15px] font-medium tracking-[-0.01em] text-[var(--ink-950)]">
                  {conversation.otherUser.displayName}
                </p>
                <span className="qh-msg-eyebrow shrink-0">{timeAgo(conversation.lastMessageAt)}</span>
              </div>
              {conversation.jobTitle ? (
                <p className="qh-msg-eyebrow mt-0.5 truncate text-[var(--accent)]">{conversation.jobTitle}</p>
              ) : null}
              <p className="truncate text-[14px] text-[var(--ink-500)]">{previewText(conversation)}</p>
            </div>

            {conversation.unreadCount > 0 ? (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 font-mono text-[11px] font-medium text-white">
                {conversation.unreadCount}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className={MSG_ROOT_CLASS} style={{ ...MSG_ROOT_STYLE, ...messagingPalette(appRole) }}>
      <MessagingStyles />
      <p className="qh-msg-eyebrow">Inbox</p>
      <h1 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.035em] text-[var(--ink-950)] sm:text-[40px]">
        <em className="qh-msg-serif">Messages</em>
      </h1>
      <p className="mt-3 text-[15px] leading-[1.55] text-[var(--ink-600)]">Coordinate directly with clients and specialists.</p>

      <div className="mt-6">{body}</div>
    </div>
  )
}
