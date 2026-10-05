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
import { SCROLL_THIN } from "@/components/app-shell/role-styles"
import { parseCard } from "@/lib/message-cards"
import {
  MSG_ROOT_CLASS,
  MSG_ROOT_STYLE,
  MsgAvatar,
  MsgDateDivider,
  MessagingStyles,
  messagingPalette,
} from "@/components/messaging/MessagingDesign"

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
  const palette = messagingPalette(appRole)

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
    <div className={`${MSG_ROOT_CLASS} flex h-full min-h-0 flex-col`} style={{ ...MSG_ROOT_STYLE, ...palette }}>
      <MessagingStyles />
      <div className="qh-msg-hair flex shrink-0 items-center gap-3 px-4 py-3">
        <MsgAvatar name={otherDisplayName} imageUrl={otherAvatarUrl} />
        <div className="min-w-0">
          <p className="truncate text-[17px] font-medium leading-tight tracking-[-0.01em] text-[var(--ink-950)]">{otherDisplayName}</p>
          <p className="qh-msg-eyebrow mt-1 flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: connected ? "var(--accent)" : "var(--ink-400)" }}
              aria-hidden="true"
            />
            {connected ? "Live" : "Connecting…"}
          </p>
        </div>
      </div>

      {lastError ? (
        <p
          className="shrink-0 px-4 py-2 text-[13px] text-[var(--danger-600)]"
          style={{ background: "rgba(201,48,44,.06)", borderBottom: "1px solid rgba(201,48,44,.16)" }}
        >
          {lastError}
        </p>
      ) : null}

      <div ref={listRef} className={`min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 ${SCROLL_THIN}`}>
        {loadingHistory ? (
          <div className="h-full min-h-32 animate-pulse rounded-[20px] bg-[var(--ink-50)] motion-reduce:animate-none" />
        ) : (
          <ul>
            {messages.map((message, index) => {
              const card = parseCard(message.text)
              const isMine = message.senderId === userId
              const newDay = index === 0 || dayKey(messages[index - 1].createdAt) !== dayKey(message.createdAt)
              const divider = newDay ? <MsgDateDivider label={dayLabel(message.createdAt)} /> : null

              if (card?.kind === "application-submitted") {
                return (
                  <li key={message.id} className="list-none">
                    <ul>{divider}</ul>
                    <div className="qh-msg-eyebrow my-4 flex items-center justify-center gap-1.5 text-center">
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
                  <div style={{ marginTop: startsGroup ? 16 : 4 }} className={`flex items-start gap-3 ${isMine ? "flex-row-reverse" : ""}`}>
                    {startsGroup ? (
                      isMine ? (
                        <MsgAvatar name={myName} imageUrl={user?.imageUrl} mine />
                      ) : (
                        <MsgAvatar name={otherDisplayName} imageUrl={otherAvatarUrl} />
                      )
                    ) : (
                      <span className="h-10 w-10 shrink-0" aria-hidden="true" />
                    )}
                    <div className={`flex min-w-0 max-w-[80%] flex-col sm:max-w-xl ${isMine ? "items-end" : "items-start"}`}>
                      {startsGroup ? (
                        <p className="mb-1 flex items-baseline gap-2">
                          <span className="text-[13px] font-medium text-[var(--ink-950)]">{senderName}</span>
                          <span className="qh-msg-eyebrow">{formatTime(message.createdAt)}</span>
                        </p>
                      ) : null}
                      <div
                        className={`rounded-[14px] px-4 py-2.5 text-[15px] leading-[1.45] ${
                          isMine ? "bg-[var(--accent)] text-white" : "qh-msg-inset bg-[var(--white)] text-[var(--ink-950)]"
                        }`}
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

      {/* Composer: one rounded box — input on top, quick replies + send under a hairline. */}
      <div className="shrink-0 px-4 pb-4 pt-2 sm:px-6">
        <div className="qh-msg-composer qh-msg-inset rounded-[20px] bg-[var(--white)]">
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
            className="block h-14 w-full rounded-t-[20px] bg-transparent px-4 text-[16px] text-[var(--ink-950)] outline-none placeholder:text-[var(--ink-400)]"
          />
          <div className="qh-msg-hair-top flex items-center justify-between gap-3 px-3 py-2">
            <div className="flex flex-wrap gap-1.5">
              {quickTags.map((tag) => (
                <button
                  key={tag.kind}
                  type="button"
                  onClick={() => sendQuickTag(tag)}
                  disabled={sendingTag !== null}
                  className="qh-msg-tag qh-msg-inset flex items-center gap-1 rounded-full bg-[var(--white)] px-2.5 py-1.5 text-[12px] text-[var(--ink-600)] outline-none disabled:opacity-50"
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
              className="qh-msg-send flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full bg-[var(--accent)] text-white outline-none disabled:opacity-50 sm:h-10 sm:w-10"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
