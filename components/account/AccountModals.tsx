"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowRight, BookOpen, Check, IdCard, Lock, Send, ShieldCheck, Sun, X, type LucideIcon } from "lucide-react"
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
  verified,
  onHire,
  hiring,
  onClose,
}: {
  job: ClientJobWithApplications
  application: Application
  verified: boolean
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
              {verified ? (
                <Check width={13} height={13} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Lock width={13} height={13} strokeWidth={1.5} aria-hidden="true" />
              )}
              {verified ? (application.quotation ? `Hire · ${application.quotation}` : "Hire") : "Verify to hire"}
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

type FlowStep = "intro" | "doc" | "docReview" | "selfie" | "selfieReview" | "done"
type DocType = "id" | "passport"

const FLOW_STEPS: FlowStep[] = ["intro", "doc", "docReview", "selfie", "selfieReview", "done"]

const FLOW_LABEL: Record<FlowStep, string> = {
  intro: "Before you start",
  doc: "Step 1 of 2 · Document",
  docReview: "Step 1 of 2 · Document",
  selfie: "Step 2 of 2 · Selfie",
  selfieReview: "Step 2 of 2 · Selfie",
  done: "All done",
}

const FLOW_BACK: Partial<Record<FlowStep, FlowStep>> = {
  doc: "intro",
  docReview: "doc",
  selfie: "docReview",
  selfieReview: "selfie",
}

const FLOW_PRIMARY_LABEL: Partial<Record<FlowStep, string>> = {
  intro: "Continue",
  docReview: "Use this photo",
  selfieReview: "Submit",
  done: "Done",
}

const DOC_OPTIONS: { id: DocType; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "id", label: "National ID", hint: "Front side of your ID card", icon: IdCard },
  { id: "passport", label: "Passport", hint: "The photo / bio page", icon: BookOpen },
]

const FLOW_OVERLAY = sx(
  "position:fixed;inset:0;z-index:50;background:rgba(10,10,11,.56);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;animation:qhFade 200ms var(--ease-out) both"
)

const SERIF_EM_GREEN = sx(
  `font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-0.02em;color:${GREEN}`
)

const FLOW_NOTE = sx("margin:14px 0 0;text-align:center;font:var(--text-small);color:var(--fg-3)")

const FLOW_BACK_BUTTON = sx(
  "height:44px;padding:0 18px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:500 14px/1 var(--font-sans);cursor:pointer"
)

const FLOW_PRIMARY_BUTTON = sx(
  "height:44px;padding:0 22px;border:0;border-radius:999px;color:var(--white);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px"
)

function FlowIcon({ icon: Glyph, size = 18, color }: { icon: LucideIcon; size?: number; color?: string }) {
  return <Glyph width={size} height={size} strokeWidth={1.5} color={color} aria-hidden="true" style={{ flexShrink: 0 }} />
}

/**
 * Identity verification steps as the design lays them out: intro, document
 * capture, selfie capture and their reviews. No camera is opened, nothing is
 * uploaded and nothing is sent. Capture and submit stay disabled until the
 * verification service exists.
 */
export function AccountVerifyModal({ onClose }: { onClose: () => void }) {
  useEscape(onClose)
  const [step, setStep] = useState<FlowStep>("intro")
  const [doc, setDoc] = useState<DocType>("id")

  const docName = doc === "passport" ? "passport bio page" : "national ID"
  const stepIndex = FLOW_STEPS.indexOf(step)
  const isDoc = step === "doc"
  const isSelfie = step === "selfie"
  const isCapture = isDoc || isSelfie
  const isReview = step === "docReview" || step === "selfieReview"
  const primaryLabel = FLOW_PRIMARY_LABEL[step]
  // Submitting is not possible yet, so the final step cannot be sent.
  const primaryDisabled = step === "selfieReview"
  const backLabel =
    step === "intro" ? "Not now" : step === "done" ? "" : isReview ? "Retake" : "Back"

  const goBack = () => {
    if (step === "intro" || step === "done") {
      onClose()
      return
    }
    const previous = FLOW_BACK[step]
    if (previous) setStep(previous)
  }

  const goNext = () => {
    if (step === "intro") setStep("doc")
    else if (step === "docReview") setStep("selfie")
    else if (step === "selfieReview") setStep("done")
    else if (step === "done") onClose()
  }

  return (
    <div style={FLOW_OVERLAY}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Verify your identity"
        style={sx(
          "width:100%;max-width:520px;max-height:calc(100vh - 32px);overflow:auto;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-float)"
        )}
      >
        <div style={sx("display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid var(--border-hairline)")}>
          <span style={sx("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>
            {FLOW_LABEL[step]}
          </span>
          <button type="button" onClick={onClose} aria-label="Close" className="qh-acc-icon" style={CLOSE_BUTTON}>
            <FlowIcon icon={X} size={16} />
          </button>
        </div>
        <div style={sx("height:2px;background:var(--ink-100)")}>
          <div style={sx(`height:2px;width:${(stepIndex / 5) * 100}%;background:${GREEN};transition:width var(--dur-base) var(--ease-out)`)} />
        </div>

        <div style={sx("padding:28px")}>
          {step === "intro" ? (
            <div style={sx("animation:qhFade 220ms var(--ease-out) both")}>
              <h2 style={sx("font:var(--text-h2);font-size:32px;letter-spacing:var(--ls-heading);margin:0")}>
                Verify your <em style={SERIF_EM_GREEN}>identity</em>.
              </h2>
              <p style={sx("margin:10px 0 0;color:var(--fg-2);text-wrap:pretty")}>
                Two quick photos: your ID, then a live selfie so we can match them.
              </p>
              <div style={sx("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3);margin:28px 0 12px")}>
                Choose a document
              </div>
              <div style={sx("display:flex;flex-direction:column;gap:10px")}>
                {DOC_OPTIONS.map((option) => {
                  const on = doc === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setDoc(option.id)}
                      aria-pressed={on}
                      style={sx(
                        `display:flex;align-items:center;gap:14px;padding:16px;border:0;border-radius:var(--radius-lg);background:${on ? "#F1F8EF" : "var(--white)"};box-shadow:${on ? `inset 0 0 0 1.5px ${GREEN}` : "inset 0 0 0 1px var(--border-default)"};text-align:left;cursor:pointer;color:var(--fg-1)`
                      )}
                    >
                      <span style={sx("width:40px;height:40px;border-radius:var(--radius-md);background:var(--ink-100);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0")}>
                        <FlowIcon icon={option.icon} />
                      </span>
                      <span style={sx("flex:1")}>
                        <span style={sx("display:block;font:500 15px/1.3 var(--font-sans)")}>{option.label}</span>
                        <span style={sx("display:block;font:var(--text-small);color:var(--fg-3);margin-top:3px")}>{option.hint}</span>
                      </span>
                      <span
                        style={sx(
                          `width:18px;height:18px;border-radius:50%;box-shadow:${on ? `inset 0 0 0 5px ${GREEN}` : "inset 0 0 0 1.5px var(--ink-300)"};flex-shrink:0`
                        )}
                      />
                    </button>
                  )
                })}
              </div>
              <ul style={sx("list-style:none;margin:24px 0 0;padding:0;display:flex;flex-direction:column;gap:10px;font:var(--text-small);color:var(--fg-2)")}>
                <li style={sx("display:flex;gap:10px;align-items:center")}>
                  <FlowIcon icon={Sun} size={14} color="var(--fg-3)" />
                  Find good light, avoid glare on the document
                </li>
                <li style={sx("display:flex;gap:10px;align-items:center")}>
                  <FlowIcon icon={Lock} size={14} color="var(--fg-3)" />
                  Encrypted and only used for verification
                </li>
              </ul>
              <p style={sx("margin:20px 0 0;padding-top:16px;border-top:1px solid var(--border-hairline);font:var(--text-small);color:var(--fg-3);text-wrap:pretty")}>
                By continuing, you consent to QuickHands processing your document and selfie, including biometric data, solely to verify your identity. Images are deleted within 30 days of a decision.{" "}
                <Link href="/privacy-policy" style={sx("color:var(--fg-2)")}>
                  Learn more
                </Link>
              </p>
            </div>
          ) : null}

          {isCapture ? (
            <div style={sx("animation:qhFade 220ms var(--ease-out) both")}>
              <h2 style={sx("font:var(--text-h3);letter-spacing:var(--ls-heading);margin:0")}>
                {isDoc ? `Photograph your ${docName}.` : "Take a live selfie."}
              </h2>
              <p style={sx("margin:8px 0 20px;color:var(--fg-2);text-wrap:pretty")}>
                {isDoc
                  ? "Place it flat inside the frame. All four corners should be visible."
                  : "Centre your face in the oval and follow the prompts. We'll capture automatically."}
              </p>
              <div style={sx(`position:relative;aspect-ratio:${isDoc ? "16 / 11" : "4 / 5"};border-radius:var(--radius-lg);overflow:hidden;background:var(--ink-950)`)}>
                {isDoc ? (
                  <div style={sx("position:absolute;inset:12%;border-radius:12px;box-shadow:0 0 0 999px rgba(10,10,11,.45),inset 0 0 0 2px rgba(255,255,255,.9);pointer-events:none")} />
                ) : (
                  <div style={sx("position:absolute;left:50%;top:50%;width:58%;height:76%;transform:translate(-50%,-50%);border-radius:50%;box-shadow:0 0 0 999px rgba(10,10,11,.5),inset 0 0 0 2px rgba(255,255,255,.9);pointer-events:none")} />
                )}
                <div style={sx("position:absolute;left:0;right:0;bottom:16px;display:flex;justify-content:center")}>
                  <span style={sx("display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 14px;border-radius:999px;background:rgba(10,10,11,.7);color:var(--white);font:500 13px/1 var(--font-sans)")}>
                    Camera capture is coming soon.
                  </span>
                </div>
              </div>
              <div style={sx("display:flex;justify-content:center;margin-top:20px")}>
                <button
                  type="button"
                  disabled
                  aria-label="Take photo"
                  className="qh-acc-press"
                  style={sx("width:64px;height:64px;border:0;border-radius:50%;background:var(--white);box-shadow:inset 0 0 0 4px var(--ink-950),0 0 0 1px var(--border-default);cursor:pointer;display:inline-flex;align-items:center;justify-content:center")}
                >
                  <span style={sx(`width:44px;height:44px;border-radius:50%;background:${GREEN}`)} />
                </button>
              </div>
              <p style={FLOW_NOTE}>Verification is coming soon, so nothing is sent.</p>
            </div>
          ) : null}

          {isReview ? (
            <div style={sx("animation:qhFade 220ms var(--ease-out) both")}>
              <h2 style={sx("font:var(--text-h3);letter-spacing:var(--ls-heading);margin:0")}>
                {step === "docReview" ? `Is your ${docName} readable?` : "Happy with your selfie?"}
              </h2>
              <p style={sx("margin:8px 0 20px;color:var(--fg-2)")}>Make sure everything is sharp and readable, with no glare.</p>
              <div
                role="img"
                aria-label="Captured photo"
                style={sx(`aspect-ratio:${step === "docReview" ? "16 / 11" : "4 / 5"};border-radius:var(--radius-lg);background-color:var(--ink-100)`)}
              />
              <p style={FLOW_NOTE}>Verification is coming soon, so nothing is sent.</p>
            </div>
          ) : null}

          {step === "done" ? (
            <div style={sx("text-align:center;padding:16px 0;display:flex;flex-direction:column;align-items:center;animation:qhFade 260ms var(--ease-out) both")}>
              <span style={sx("width:60px;height:60px;border-radius:50%;background:#F1F8EF;color:#108600;display:inline-flex;align-items:center;justify-content:center")}>
                <FlowIcon icon={ShieldCheck} size={26} />
              </span>
              <h2 style={sx("font:var(--text-h2);font-size:30px;letter-spacing:var(--ls-heading);margin:22px 0 0")}>
                Submitted for <em style={SERIF_EM_GREEN}>review</em>.
              </h2>
              <p style={sx("margin:10px 0 0;color:var(--fg-2);max-width:360px;text-wrap:pretty")}>
                We&apos;re matching your selfie to your document. This usually takes a few minutes. We&apos;ll notify you when it&apos;s done.
              </p>
              <div style={sx("display:flex;gap:10px;margin-top:24px")}>
                <div role="img" aria-label="Document" style={sx("width:96px;height:64px;border-radius:var(--radius-md);background-color:var(--ink-100)")} />
                <div role="img" aria-label="Selfie" style={sx("width:64px;height:64px;border-radius:50%;background-color:var(--ink-100)")} />
              </div>
            </div>
          ) : null}
        </div>

        <div style={sx("display:flex;justify-content:space-between;gap:10px;padding:16px 20px;border-top:1px solid var(--border-hairline)")}>
          {backLabel ? (
            <button type="button" onClick={goBack} className="qh-acc-decline" style={FLOW_BACK_BUTTON}>
              {backLabel}
            </button>
          ) : (
            <span />
          )}
          {!isCapture && primaryLabel ? (
            <button
              type="button"
              onClick={goNext}
              disabled={primaryDisabled}
              className="qh-acc-green qh-acc-press"
              style={{ ...FLOW_PRIMARY_BUTTON, background: primaryDisabled ? "var(--ink-300)" : GREEN }}
            >
              {primaryLabel}
              <FlowIcon icon={ArrowRight} size={14} />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  )
}
