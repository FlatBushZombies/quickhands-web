"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { useAuth } from "@clerk/nextjs"
import { Check, Send, X } from "lucide-react"
import { API_BASE_URL } from "@/lib/fetch-client"
import { useMessagingSocket } from "@/hooks/useMessagingSocket"
import { parseCard } from "@/lib/message-cards"
import { submitApplicationReview, type Application, type ClientJobWithApplications, type ReviewEntry } from "@/lib/applications-api"
import { GREEN, SERIF_EM, EYEBROW, initialsOf, sx } from "@/components/account/account-styles"
import { type TaskStatus, taskStatusOf } from "@/components/account/account-tasks"

const OVERLAY = sx(
  "position:fixed;inset:0;z-index:55;background:rgba(10,10,11,.56);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;animation:qhFade 200ms var(--ease-out) both"
)

const CLOSE_BUTTON = sx(
  "width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:var(--fg-2);display:inline-flex;align-items:center;justify-content:center;cursor:pointer"
)

const AVATAR = sx(
  "width:40px;height:40px;border-radius:50%;background-color:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 13px/1 var(--font-sans);flex-shrink:0"
)

/** Escape closes whichever modal is open. */
function useEscape(onEscape: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onEscape])
}

function clockLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

/**
 * Conversation about one offer. Reads and sends through the real messaging
 * socket hook. Contact details are never shared here, by policy.
 */
export function AccountThreadModal({
  job,
  application,
  onHire,
  hiring,
  onClose,
}: {
  job: ClientJobWithApplications
  application: Application
  onHire: () => void
  hiring: boolean
  onClose: () => void
}) {
  useEscape(onClose)
  const { getToken, userId } = useAuth()
  const { messages, sendMessage, loadingHistory, lastError } = useMessagingSocket({
    serverUrl: API_BASE_URL,
    apiBaseUrl: API_BASE_URL,
    getToken,
    conversationId: application.conversationId ?? "",
    enabled: Boolean(application.conversationId),
  })
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages.length])

  const status: TaskStatus = taskStatusOf(job)
  const hired = application.status === "accepted" || application.status === "completed"
  const canWrite = Boolean(application.conversationId) && application.status !== "rejected" && status !== "completed" && (status === "open" || hired)
  const canHire = status === "open" && application.status === "pending"
  const closedNote = canWrite ? "" : status === "completed" ? "This task is complete." : "This offer is closed."
  const firstName = application.freelancerName.split(" ")[0]
  const sub = `${job.serviceType} · offer ${application.quotation || "not quoted"}`

  const send = async (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !canWrite || sending) return
    setSending(true)
    try {
      await sendMessage({ label: text })
      setDraft("")
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={OVERLAY}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Conversation"
        style={sx(
          "width:100%;max-width:540px;height:min(680px, calc(100vh - 32px));display:flex;flex-direction:column;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-float);overflow:hidden"
        )}
      >
        <div style={sx("display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--border-hairline)")}>
          <div role="img" aria-label={application.freelancerName} style={AVATAR}>
            {initialsOf(application.freelancerName)}
          </div>
          <div style={sx("flex:1;min-width:0")}>
            <div style={sx("font:500 15px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>{application.freelancerName}</div>
            <div style={sx("font:var(--text-small);color:var(--fg-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{sub}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="qh-acc-icon" style={CLOSE_BUTTON}>
            <X width={16} height={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <div ref={listRef} style={sx("flex:1;overflow-y:auto;padding:20px 18px;display:flex;flex-direction:column;gap:12px;background:var(--paper)")}>
          {!application.conversationId ? (
            <div style={sx("margin:auto;text-align:center;color:var(--fg-3);font:var(--text-small)")}>This conversation is not available yet.</div>
          ) : null}
          {application.conversationId && loadingHistory && messages.length === 0 ? (
            <div style={sx("margin:auto;display:flex;justify-content:center")}>
              <span style={sx("width:18px;height:18px;border-radius:50%;border:1.5px solid var(--ink-200);border-top-color:#108600;animation:qhSpin 900ms linear infinite")} />
            </div>
          ) : null}
          {messages.map((message) => {
            const card = parseCard(message.text)
            if (card) {
              return (
                <div
                  key={message.id}
                  style={sx("align-self:center;display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;background:var(--ink-100);font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-2)")}
                >
                  <Check width={12} height={12} strokeWidth={1.5} aria-hidden="true" />
                  {card.label}
                </div>
              )
            }
            const mine = message.senderId === userId
            return (
              <div
                key={message.id}
                style={sx(`align-self:${mine ? "flex-end" : "flex-start"};max-width:80%;display:flex;flex-direction:column;gap:4px;align-items:${mine ? "flex-end" : "flex-start"}`)}
              >
                <div
                  style={sx(
                    `padding:10px 14px;border-radius:${mine ? "18px 18px 6px 18px" : "18px 18px 18px 6px"};background:${mine ? GREEN : "var(--white)"};color:${mine ? "var(--white)" : "var(--fg-1)"};box-shadow:${mine ? "none" : "inset 0 0 0 1px var(--border-hairline)"};font:var(--text-body-md);font-size:15px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere`
                  )}
                >
                  {message.text}
                </div>
                <span style={sx("font:var(--text-micro);letter-spacing:var(--ls-mono);color:var(--fg-3)")}>{clockLabel(message.createdAt)}</span>
              </div>
            )
          })}
          {application.conversationId && !loadingHistory && messages.length === 0 && !lastError ? (
            <div style={sx("margin:auto;text-align:center;color:var(--fg-3);font:var(--text-small)")}>No messages yet. Say hello.</div>
          ) : null}
          {application.conversationId && lastError && messages.length === 0 && !loadingHistory ? (
            <div style={sx("margin:auto;text-align:center;color:var(--fg-3);font:var(--text-small)")}>Messages are unavailable right now.</div>
          ) : null}
        </div>

        {canHire ? (
          <div style={sx("display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 18px;border-top:1px solid var(--border-hairline)")}>
            <span style={sx("font:var(--text-small);color:var(--fg-2)")}>Happy with {firstName}&apos;s offer?</span>
            <button
              type="button"
              onClick={onHire}
              disabled={hiring}
              className="qh-acc-green qh-acc-press"
              style={sx("height:36px;padding:0 16px;border:0;border-radius:999px;background:#108600;color:var(--white);font:500 13px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap")}
            >
              <Check width={13} height={13} strokeWidth={1.5} aria-hidden="true" />
              {application.quotation ? `Hire · ${application.quotation}` : "Hire"}
            </button>
          </div>
        ) : null}

        {canWrite ? (
          <form onSubmit={send} style={sx("display:flex;align-items:center;gap:8px;padding:12px;border-top:1px solid var(--border-hairline)")}>
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a message…"
              aria-label="Message"
              style={sx("flex:1;min-width:0;height:44px;padding:0 16px;border:0;border-radius:999px;background:var(--ink-50);box-shadow:inset 0 0 0 1px var(--border-hairline);font:var(--text-body-md);font-size:15px;color:var(--fg-1);outline:none")}
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={sending || !draft.trim()}
              className="qh-acc-green qh-acc-press"
              style={sx("width:44px;height:44px;border:0;border-radius:50%;background:#108600;color:var(--white);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0")}
            >
              <Send width={16} height={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </form>
        ) : null}

        {closedNote ? (
          <div style={sx("padding:16px 18px;border-top:1px solid var(--border-hairline);text-align:center;font:var(--text-small);color:var(--fg-3)")}>{closedNote}</div>
        ) : null}
      </div>
    </div>
  )
}

const RATING_LABELS = ["Tap a star to rate", "Poor", "Fair", "Good", "Very good", "Excellent"]

/** Client rates a specialist after a completed job. Saves through the real review endpoint. */
export function AccountReviewModal({
  application,
  serviceType,
  existing,
  onSaved,
  onClose,
}: {
  application: Application
  serviceType: string
  existing: ReviewEntry | null
  onSaved: (saved: ReviewEntry) => void
  onClose: () => void
}) {
  useEscape(onClose)
  const { getToken } = useAuth()
  const [rating, setRating] = useState(existing?.rating ?? 0)
  const [text, setText] = useState(existing?.comment ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!rating || saving) return
    setSaving(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Not signed in")
      const saved = await submitApplicationReview(application.id, { rating, comment: text.trim() }, token)
      onSaved(saved)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your review")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={OVERLAY}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Leave a review"
        style={sx(
          "width:100%;max-width:480px;max-height:calc(100vh - 32px);display:flex;flex-direction:column;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-float);overflow:hidden"
        )}
      >
        <div style={sx("display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--border-hairline)")}>
          <span style={EYEBROW}>Task completed · Leave a review</span>
          <button type="button" onClick={onClose} aria-label="Close" className="qh-acc-icon" style={CLOSE_BUTTON}>
            <X width={16} height={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <div style={sx("padding:28px;overflow:auto;display:flex;flex-direction:column;gap:20px")}>
          <div style={sx("display:flex;align-items:center;gap:14px")}>
            <div role="img" aria-label={application.freelancerName} style={sx("width:52px;height:52px;border-radius:50%;background-color:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 16px/1 var(--font-sans);flex-shrink:0")}>
              {initialsOf(application.freelancerName)}
            </div>
            <div style={sx("min-width:0")}>
              <h2 style={sx("font:var(--text-h3);letter-spacing:var(--ls-heading);margin:0")}>
                How did it <em style={SERIF_EM}>go</em>?
              </h2>
              <div style={sx("font:var(--text-small);color:var(--fg-2);margin-top:4px")}>
                Rate {application.freelancerName} for {serviceType.toLowerCase()}.
              </div>
            </div>
          </div>
          <div style={sx("display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 0;border-top:1px solid var(--border-hairline);border-bottom:1px solid var(--border-hairline)")}>
            <div role="radiogroup" aria-label="Rating" style={sx("display:flex;gap:4px")}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={n === rating}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  onClick={() => setRating(n)}
                  className="qh-acc-star qh-acc-press"
                  style={{
                    ...sx("width:48px;height:48px;border:0;border-radius:var(--radius-md);background:transparent;cursor:pointer;font-size:34px;line-height:1;transition:color var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)"),
                    color: n <= rating ? "var(--ink-950)" : "var(--ink-200)",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            <span style={EYEBROW}>{RATING_LABELS[rating]}</span>
          </div>
          <label style={sx("display:flex;flex-direction:column;gap:8px")}>
            <span style={sx("font:500 14px/1.3 var(--font-sans)")}>Tell others about it (optional)</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="e.g. On time, friendly and did a great job."
              style={sx("width:100%;box-sizing:border-box;padding:12px 14px;border:0;border-radius:var(--radius-lg);background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);font:var(--text-body-md);font-size:15px;color:var(--fg-1);outline:none;resize:vertical")}
            />
          </label>
          {error ? <p role="alert" style={sx("margin:0;font:var(--text-small);color:#C2410C")}>{error}</p> : null}
        </div>
        <div style={sx("display:flex;justify-content:space-between;gap:10px;padding:16px 20px;border-top:1px solid var(--border-hairline)")}>
          <button type="button" onClick={onClose} className="qh-acc-decline qh-acc-press" style={sx("height:44px;padding:0 18px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:500 14px/1 var(--font-sans);cursor:pointer")}>
            Later
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!rating || saving}
            className="qh-acc-press"
            style={{
              ...sx("height:44px;padding:0 22px;border:0;border-radius:999px;color:var(--white);font:500 14px/1 var(--font-sans)"),
              background: rating ? GREEN : "var(--ink-300)",
              cursor: rating ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Saving…" : "Submit review"}
          </button>
        </div>
      </div>
    </div>
  )
}
