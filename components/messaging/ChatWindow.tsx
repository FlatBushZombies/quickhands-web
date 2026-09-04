"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import {
  Briefcase,
  Calendar,
  Camera,
  CheckCircle2,
  Home,
  MapPin,
  Phone,
  Send,
  Tag,
  Clock,
} from "lucide-react"
import { API_BASE_URL } from "@/lib/fetch-client"
import { useMessagingSocket, type ServerMessage } from "@/hooks/useMessagingSocket"
import { useAppRole } from "@/components/app/AppRoleContext"
import { parseCard } from "@/lib/message-cards"

const CLIENT_TAGS = [
  { kind: "ready-for-visit", label: "Ready for visit", Icon: Home },
  { kind: "please-call", label: "Please call", Icon: Phone },
  { kind: "share-location", label: "Location shared", Icon: MapPin },
  { kind: "need-quote-update", label: "Need quote update", Icon: Tag },
  { kind: "confirm-arrival", label: "Confirm arrival", Icon: Calendar },
]

const FREELANCER_TAGS = [
  { kind: "available-now", label: "Available now", Icon: CheckCircle2 },
  { kind: "need-address", label: "Need address", Icon: MapPin },
  { kind: "need-photos", label: "Need photos", Icon: Camera },
  { kind: "running-late", label: "Running late", Icon: Clock },
  { kind: "job-complete", label: "Job complete", Icon: CheckCircle2 },
]

function getInitials(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return "?"
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

function cardKind(message: ServerMessage) {
  return parseCard(message.text)?.kind ?? null
}

// Consecutive messages from the same sender are visually grouped — a
// system card always breaks the group on both sides. Direct port of the
// same logic in client-app/components/messaging/ConversationChatScreen.tsx.
function breaksGroup(a: ServerMessage, b: ServerMessage) {
  return a.senderId !== b.senderId || cardKind(a) === "application-submitted" || cardKind(b) === "application-submitted"
}

export function ChatWindow({
  conversationId,
  otherDisplayName,
  otherAvatarUrl,
}: {
  conversationId: string
  otherDisplayName: string
  otherAvatarUrl: string | null
}) {
  const { userId, getToken } = useAuth()
  const { appRole } = useAppRole()
  const [messageText, setMessageText] = useState("")
  const [sending, setSending] = useState(false)
  const [sendingTag, setSendingTag] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, loadingHistory, lastError, connected } = useMessagingSocket({
    serverUrl: API_BASE_URL,
    apiBaseUrl: API_BASE_URL,
    getToken,
    conversationId,
    enabled: true,
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const quickTags = appRole === "client" ? CLIENT_TAGS : FREELANCER_TAGS

  const sendChatMessage = async () => {
    const trimmed = messageText.trim()
    if (!trimmed || sending) return
    setSending(true)
    try {
      await sendMessage({ label: trimmed })
      setMessageText("")
    } finally {
      setSending(false)
    }
  }

  const sendQuickTag = async (tag: { kind: string; label: string }) => {
    if (sendingTag) return
    setSendingTag(tag.kind)
    try {
      await sendMessage({ tag: tag.kind, label: tag.label })
    } finally {
      setSendingTag(null)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        {otherAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={otherAvatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {getInitials(otherDisplayName)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">{otherDisplayName}</p>
          <p className="text-xs text-muted-foreground">{connected ? "Live" : "Connecting…"}</p>
        </div>
      </div>

      {lastError ? <p className="border-b border-destructive/20 bg-destructive/5 px-4 py-2 text-xs text-destructive">{lastError}</p> : null}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loadingHistory ? (
          <div className="h-full animate-pulse rounded-2xl bg-secondary" />
        ) : (
          messages.map((message, index) => {
            const card = parseCard(message.text)
            const isMine = message.senderId === userId

            if (card?.kind === "application-submitted") {
              return (
                <div key={message.id} className="my-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" />
                  {isMine ? "You applied for this job." : `${message.senderName || "A freelancer"} applied for this job.`}
                  <span>· {formatTime(message.createdAt)}</span>
                </div>
              )
            }

            const startsGroup = index === 0 || breaksGroup(messages[index - 1], message)
            const isPlainMessage = !card || card.kind === "message"
            const TagIcon = card ? [...CLIENT_TAGS, ...FREELANCER_TAGS].find((t) => t.kind === card.kind)?.Icon ?? Tag : null

            return (
              <div key={message.id} style={{ marginTop: startsGroup ? 14 : 3 }}>
                {!isMine && startsGroup ? (
                  <p className="mb-1 text-xs font-medium text-muted-foreground">{otherDisplayName || message.senderName}</p>
                ) : null}
                <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMine ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    } ${!isPlainMessage ? "border border-current/10" : ""}`}
                  >
                    {isPlainMessage ? (
                      <p>{card?.label ?? message.text}</p>
                    ) : (
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold">
                          {TagIcon ? <TagIcon className="h-3.5 w-3.5" /> : null}
                          {card!.label}
                        </div>
                        {card?.note ? <p className="mt-1 opacity-90">{card.note}</p> : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border px-4 py-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {quickTags.map((tag) => (
            <button
              key={tag.kind}
              type="button"
              onClick={() => sendQuickTag(tag)}
              disabled={sendingTag !== null}
              className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
            >
              <tag.Icon className="h-3 w-3" />
              {tag.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendChatMessage()
              }
            }}
            placeholder="Type a message"
            className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={sendChatMessage}
            disabled={!messageText.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
