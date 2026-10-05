"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { X } from "lucide-react"
import { ChatWindow } from "@/components/messaging/ChatWindow"
import { submitApplicationReview, type Application, type ReviewEntry } from "@/lib/applications-api"
import { GREEN, SERIF_EM, EYEBROW, initialsOf, sx } from "@/components/account/account-styles"

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

/** Conversation with a specialist about one application. Uses the real messaging socket. */
export function AccountChatModal({
  application,
  serviceType,
  onClose,
}: {
  application: Application
  serviceType: string
  onClose: () => void
}) {
  useEscape(onClose)
  const quote = application.quotation ? ` · offer ${application.quotation}` : ""

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
            <div style={sx("font:var(--text-small);color:var(--fg-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
              {serviceType}
              {quote}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="qh-acc-icon" style={CLOSE_BUTTON}>
            <X className="h-4 w-4" />
          </button>
        </div>
        {application.conversationId ? (
          <div style={sx("display:flex;flex:1;min-height:0;flex-direction:column")}>
            <ChatWindow
              conversationId={application.conversationId}
              otherDisplayName={application.freelancerName}
              otherAvatarUrl={null}
            />
          </div>
        ) : (
          <div style={sx("margin:auto;padding:24px;text-align:center;color:var(--fg-3);font:var(--text-small)")}>
            This conversation is not available yet.
          </div>
        )}
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
            <X className="h-4 w-4" />
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
              style={sx("width:100%;box-sizing:border-box;padding:12px 14px;border:0;border-radius:var(--radius-lg);background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);font:var(--text-body-md);font-size:15px;color:var(--fg-1);resize:vertical;outline:none")}
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

