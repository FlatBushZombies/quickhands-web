"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
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
import { Avatar } from "@/components/app-shell/Avatar"
import { DateDivider } from "@/components/app-shell/feed"
import { SCROLL_THIN } from "@/components/app-shell/role-styles"
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

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

function dayKey(iso: string) {
  const date = new Date(iso)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function dayLabel(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (dayKey(iso) === dayKey(now.toISOString())) return "Today"
  if (dayKey(iso) === dayKey(yesterday.toISOString())) return "Yesterday"
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
}

function cardKind(message: ServerMessage) {
  return parseCard(message.text)?.kind ?? null
}

// Consecutive messages from the same sender are visually grouped — a
// system card always breaks the group on both sides. Direct port of the
// same logic in client-app/components/messaging/ConversationChatScreen.tsx.
function breaksGroup(a: ServerMessage, b: ServerMessage) {
  return (
    a.senderId !== b.senderId ||
    cardKind(a) === "application-submitted" ||
    cardKind(b) === "application-submitted" ||
    dayKey(a.createdAt) !== dayKey(b.createdAt)
  )
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
  const { user } = useUser()
  const [messageText, setMessageText] = useState("")
  const [sending, setSending] = useState(false)
  const [sendingTag, setSendingTag] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const myName = user?.fullName || user?.firstName || "You"

  const { messages, sendMessage, loadingHistory, lastError, connected } = useMessagingSocket({
    serverUrl: API_BASE_URL,
    apiBaseUrl: API_BASE_URL,
    getToken,
    conversationId,
    enabled: true,
  })

  // Scroll the message list itself (not scrollIntoView, which can also nudge
  // the shell's overflow-hidden ancestors).
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    list.scrollTo({ top: list.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" })
  }, [messages.length, loadingHistory])

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
    // Fills whatever pane it sits in (no viewport math): header + composer
    // are fixed, the message list in between scrolls.
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
        <Avatar name={otherDisplayName} imageUrl={otherAvatarUrl} size="md" />
        <div className="min-w-0">
          <p className="truncate text-[17px] font-medium leading-tight text-foreground">{otherDisplayName}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-primary" : "bg-muted-foreground/50"}`} aria-hidden="true" />
            {connected ? "Live" : "Connecting…"}
          </p>
        </div>
      </div>

      {lastError ? <p className="shrink-0 border-b border-destructive/20 bg-destructive/5 px-4 py-2 text-xs text-destructive">{lastError}</p> : null}

      <div ref={listRef} className={`min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 ${SCROLL_THIN}`}>
        {loadingHistory ? (
          <div className="h-full min-h-32 animate-pulse rounded-[14px] bg-secondary motion-reduce:animate-none" />
        ) : (
          <ul>
            {messages.map((message, index) => {
              const card = parseCard(message.text)
              const isMine = message.senderId === userId
              const newDay = index === 0 || dayKey(messages[index - 1].createdAt) !== dayKey(message.createdAt)
              const divider = newDay ? <DateDivider label={dayLabel(message.createdAt)} /> : null

              if (card?.kind === "application-submitted") {
                return (
                  <li key={message.id} className="list-none">
                    <ul>{divider}</ul>
                    <div className="my-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      {isMine ? "You applied for this job." : `${message.senderName || "A freelancer"} applied for this job.`}
                      <span>· {formatTime(message.createdAt)}</span>
                    </div>
                  </li>
                )
              }

              const startsGroup = index === 0 || breaksGroup(messages[index - 1], message)
              const isPlainMessage = !card || card.kind === "message"
              const TagIcon = card ? [...CLIENT_TAGS, ...FREELANCER_TAGS].find((t) => t.kind === card.kind)?.Icon ?? Tag : null
              const senderName = isMine ? myName : otherDisplayName || message.senderName

              return (
                <li key={message.id} className="list-none">
                  {divider ? <ul>{divider}</ul> : null}
                  <div style={{ marginTop: startsGroup ? 14 : 3 }} className={`flex items-start gap-3 ${isMine ? "flex-row-reverse" : ""}`}>
                    {startsGroup ? (
                      isMine ? (
                        <Avatar name={myName} imageUrl={user?.imageUrl} size="md" />
                      ) : (
                        <Avatar name={otherDisplayName} imageUrl={otherAvatarUrl} size="md" />
                      )
                    ) : (
                      <span className="h-10 w-10 shrink-0" aria-hidden="true" />
                    )}
                    <div className={`flex min-w-0 max-w-[80%] flex-col sm:max-w-xl ${isMine ? "items-end" : "items-start"}`}>
                      {startsGroup ? (
                        <p className="mb-1 flex items-baseline gap-2 text-xs text-muted-foreground">
                          <span className="text-[13px] font-medium text-foreground">{senderName}</span>
                          {formatTime(message.createdAt)}
                        </p>
                      ) : null}
                      <div
                        className={`rounded-[14px] px-4 py-2.5 text-[15px] ${
                          isMine ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                        } ${!isPlainMessage ? "border border-current/10" : ""}`}
                      >
                        {isPlainMessage ? (
                          <p className="break-words">{card?.label ?? message.text}</p>
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
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Composer: one bordered box — input on top, quick replies + send under a hairline. */}
      <div className="shrink-0 px-4 pb-4 pt-2 sm:px-6">
        <div className="rounded-[12px] border border-border bg-card shadow-sm transition-shadow focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20">
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendChatMessage()
              }
            }}
            aria-label="Message"
            placeholder="Type a message"
            className="block h-14 w-full rounded-t-[12px] bg-transparent px-4 text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2">
            <div className="flex flex-wrap gap-1.5">
              {quickTags.map((tag) => (
                <button
                  key={tag.kind}
                  type="button"
                  onClick={() => sendQuickTag(tag)}
                  disabled={sendingTag !== null}
                  className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5 text-xs text-muted-foreground outline-none transition-colors hover:border-primary/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-50"
                >
                  <tag.Icon className="h-3 w-3" />
                  {tag.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={sendChatMessage}
              disabled={!messageText.trim() || sending}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-[10px] bg-primary text-primary-foreground outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 disabled:opacity-50 sm:h-10 sm:w-10"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
