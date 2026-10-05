"use client"

import { useState } from "react"
import Link from "next/link"
import { ChatWindow } from "@/components/messaging/ChatWindow"
import { Box, CloseButton, Field, G, G_TINT, Ico, Ix, Modal, Segmented, css, Eyebrow } from "@/components/pro-account/ui"
import { CATEGORIES, YEAR_OPTIONS, initials, shortName, skillsForCategory, type YearValue } from "@/components/pro-account/professions"
import type { Application } from "@/lib/applications-api"
import { jobBudget, type RecommendedJob } from "@/lib/jobs-api"
import type { ExperienceEntry } from "@/lib/user-api"

const EM = `font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-0.02em;color:${G}`
const CAPTION = "font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)"
const H2_MODAL = "font:var(--text-h2);font-size:30px;letter-spacing:var(--ls-heading);margin:0"
const FOOT = "display:flex;justify-content:space-between;gap:10px;padding:16px 20px;border-top:1px solid var(--border-hairline)"
const CANCEL_BTN = "height:44px;padding:0 18px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:500 14px/1 var(--font-sans);cursor:pointer"
const CANCEL_HOVER = "background:var(--ink-100)"

function saveButton(enabled: boolean) {
  return `height:44px;padding:0 22px;border:0;border-radius:999px;background:${enabled ? G : "var(--ink-300)"};color:var(--white);font:500 14px/1 var(--font-sans);cursor:${enabled ? "pointer" : "not-allowed"}`
}

function ErrorLine({ message }: { message: string | null }) {
  if (!message) return null
  return <p style={css("margin:0;font:var(--text-small);color:var(--danger-600)")}>{message}</p>
}

/* ───────────── Profession ───────────── */

export interface ProfessionDraft {
  categoryId: string | null
  skills: string[]
  years: YearValue
  area: string
}

export function ProfessionModal({
  initial,
  saving,
  error,
  onSave,
  onClose,
}: {
  initial: ProfessionDraft
  saving: boolean
  error: string | null
  onSave: (draft: ProfessionDraft) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<ProfessionDraft>(initial)
  const cat = CATEGORIES.find((c) => c.id === draft.categoryId) ?? null
  const valid = Boolean(cat && draft.skills.length > 0)

  const pickCategory = (id: string) =>
    setDraft((d) => ({ ...d, categoryId: id, skills: d.categoryId === id ? d.skills : [] }))
  const toggleSkill = (skill: string) =>
    setDraft((d) => ({ ...d, skills: d.skills.includes(skill) ? d.skills.filter((x) => x !== skill) : [...d.skills, skill] }))

  return (
    <Modal label="Your profession" maxWidth={560} boxStyle="max-height:calc(100vh - 32px)">
      <div style={css("display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--border-hairline)")}>
        <Eyebrow>Your profession</Eyebrow>
        <CloseButton onClick={onClose} />
      </div>
      <div style={css("padding:28px;overflow:auto;display:flex;flex-direction:column;gap:28px")}>
        <div>
          <h2 style={css(H2_MODAL)}>
            What do you <em style={css(EM)}>do</em>?
          </h2>
          <p style={css("margin:8px 0 0;color:var(--fg-2)")}>We use this to show you the right tasks.</p>
        </div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px")}>
          {CATEGORIES.map((c) => {
            const on = draft.categoryId === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => pickCategory(c.id)}
                style={css(
                  `display:flex;flex-direction:column;align-items:flex-start;gap:12px;padding:14px;border:0;border-radius:var(--radius-lg);background:${on ? G_TINT : "var(--white)"};box-shadow:${on ? `inset 0 0 0 1.5px ${G}` : "inset 0 0 0 1px var(--border-default)"};text-align:left;cursor:pointer;color:var(--fg-1)`
                )}
              >
                <span style={css(`display:inline-flex;color:${on ? G : "var(--fg-2)"}`)}>
                  <Ico name={c.icon} size={18} />
                </span>
                <span style={css("font:500 14px/1.25 var(--font-sans)")}>{c.label}</span>
              </button>
            )
          })}
        </div>
        {cat ? (
          <div style={css("display:flex;flex-direction:column;gap:24px")}>
            <div>
              <div style={css(`${CAPTION};margin-bottom:12px`)}>Your skills · pick all that apply</div>
              <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
                {cat.subs.map((s) => {
                  const on = draft.skills.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSkill(s)}
                      style={css(
                        `display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 14px;border:0;border-radius:999px;background:${on ? "var(--ink-950)" : "var(--white)"};color:${on ? "var(--white)" : "var(--fg-1)"};box-shadow:${on ? "none" : "inset 0 0 0 1px var(--border-default)"};font:500 14px/1 var(--font-sans);cursor:pointer`
                      )}
                    >
                      {on ? <Ico name="check" size={13} /> : null}
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <div style={css(`${CAPTION};margin-bottom:12px`)}>Years of experience</div>
              <Segmented
                label="Years of experience"
                options={YEAR_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                value={draft.years}
                onChange={(years) => setDraft((d) => ({ ...d, years }))}
              />
            </div>
            <Field label="Where do you work?" placeholder="e.g. Harare, Borrowdale & Avondale" value={draft.area} onChange={(area) => setDraft((d) => ({ ...d, area }))} />
          </div>
        ) : null}
        <ErrorLine message={error} />
      </div>
      <div style={css(`${FOOT};justify-content:flex-end`)}>
        <Ix onClick={onClose} base={CANCEL_BTN} hover={CANCEL_HOVER}>
          Cancel
        </Ix>
        <button
          type="button"
          onClick={() => valid && !saving && onSave({ ...draft, skills: cat ? skillsForCategory(draft.skills, cat.id) : draft.skills })}
          disabled={!valid || saving}
          style={css(saveButton(valid && !saving))}
        >
          {saving ? "Saving…" : "Save profession"}
        </button>
      </div>
    </Modal>
  )
}

/* ───────────── Experience ───────────── */

export function ExperienceModal({
  hasExisting,
  saving,
  error,
  onSave,
  onSkip,
  onClose,
}: {
  hasExisting: boolean
  saving: boolean
  error: string | null
  onSave: (entry: ExperienceEntry) => void
  onSkip: () => void
  onClose: () => void
}) {
  const [entry, setEntry] = useState<ExperienceEntry>({ title: "", org: "", from: "", to: "", desc: "" })
  const valid = entry.title.trim().length > 0
  const set = (key: keyof ExperienceEntry) => (v: string) => setEntry((e) => ({ ...e, [key]: v }))

  return (
    <Modal label="Add work experience" maxWidth={520} boxStyle="max-height:calc(100vh - 32px)">
      <div style={css("display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--border-hairline)")}>
        <Eyebrow>Work experience · Optional</Eyebrow>
        <CloseButton onClick={onClose} />
      </div>
      <div style={css("padding:28px;overflow:auto;display:flex;flex-direction:column;gap:18px")}>
        <div>
          <h2 style={css(H2_MODAL)}>
            Add past <em style={css(EM)}>work</em>.
          </h2>
          <p style={css("margin:8px 0 0;color:var(--fg-2)")}>Jobs, apprenticeships or regular clients. It helps you win your first tasks.</p>
        </div>
        <Field label="Role or job" placeholder="e.g. Electrician" value={entry.title} onChange={set("title")} />
        <Field label="Company or client (optional)" placeholder="e.g. Self-employed, ZESA contractor" value={entry.org} onChange={set("org")} />
        <div style={css("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px")}>
          <Field label="From" placeholder="2019" value={entry.from} onChange={set("from")} />
          <Field label="To" placeholder="Present" value={entry.to} onChange={set("to")} />
        </div>
        <Field
          label="What did you do? (optional)"
          multiline
          rows={3}
          placeholder="e.g. House wiring, fault finding and DB board installs for residential clients."
          value={entry.desc}
          onChange={set("desc")}
        />
        <ErrorLine message={error} />
      </div>
      <div style={css(FOOT)}>
        <Ix onClick={onSkip} base={CANCEL_BTN} hover={CANCEL_HOVER}>
          {hasExisting ? "Cancel" : "I don't have any yet"}
        </Ix>
        <button
          type="button"
          onClick={() => valid && !saving && onSave({ ...entry, title: entry.title.trim() })}
          disabled={!valid || saving}
          style={css(saveButton(valid && !saving))}
        >
          {saving ? "Saving…" : "Save experience"}
        </button>
      </div>
    </Modal>
  )
}

/* ───────────── Identity verification ───────────── */

type VerifyStep = "intro" | "doc" | "docReview" | "selfie" | "selfieReview"
type VerifyDoc = "id" | "passport"

const VERIFY_LABEL: Record<VerifyStep, string> = {
  intro: "Before you start",
  doc: "Step 1 of 2 · Document",
  docReview: "Step 1 of 2 · Document",
  selfie: "Step 2 of 2 · Selfie",
  selfieReview: "Step 2 of 2 · Selfie",
}
/** The progress bar fills across the five screens, as the design's flow does. */
const VERIFY_PROGRESS: Record<VerifyStep, string> = { intro: "0%", doc: "20%", docReview: "40%", selfie: "60%", selfieReview: "80%" }
const VERIFY_BACK: Record<VerifyStep, VerifyStep | null> = { intro: null, doc: "intro", docReview: "doc", selfie: "docReview", selfieReview: "selfie" }
const VERIFY_BACK_LABEL: Record<VerifyStep, string> = { intro: "Not now", doc: "Back", docReview: "Retake", selfie: "Back", selfieReview: "Retake" }
const DOC_OPTIONS: { id: VerifyDoc; label: string; hint: string; icon: string }[] = [
  { id: "id", label: "National ID", hint: "Front side of your ID card", icon: "id-card" },
  { id: "passport", label: "Passport", hint: "The photo / bio page", icon: "book-open" },
]
const ICON_TILE = "width:40px;height:40px;border-radius:var(--radius-md);background:var(--ink-100);align-items:center;justify-content:center;flex-shrink:0"
const COMING_SOON = "Verification is coming soon. Nothing is captured, uploaded or sent."
const SOON_NOTE = "margin:16px 0 0;font:var(--text-small);color:var(--fg-3);text-wrap:pretty"

/**
 * The design's verification flow. Nothing is captured, uploaded or sent: there is
 * no camera access and no verification API yet, so the capture steps show the
 * design's frames with a coming-soon state, and the final submit is disabled.
 */
export function VerifyModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<VerifyStep>("intro")
  const [doc, setDoc] = useState<VerifyDoc>("id")
  const docName = doc === "passport" ? "passport bio page" : "national ID"
  const back = VERIFY_BACK[step]
  const wide = step === "doc" || step === "docReview"
  const aspect = wide ? "16 / 11" : "4 / 5"

  return (
    <Modal label="Verify your identity" maxWidth={520}>
      <div style={css("display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid var(--border-hairline)")}>
        <Eyebrow>{VERIFY_LABEL[step]}</Eyebrow>
        <CloseButton onClick={onClose} />
      </div>
      <div style={css("height:2px;background:var(--ink-100)")}>
        <div style={css(`height:2px;width:${VERIFY_PROGRESS[step]};background:${G};transition:width var(--dur-base) var(--ease-out)`)} />
      </div>

      <div style={css("padding:28px;overflow:auto;min-height:0")}>
        {step === "intro" ? (
          <div style={css("animation:qhFade 220ms var(--ease-out) both")}>
            <h2 style={css("font:var(--text-h2);font-size:32px;letter-spacing:var(--ls-heading);margin:0")}>
              Verify your <em style={css(EM)}>identity</em>.
            </h2>
            <p style={css("margin:10px 0 0;color:var(--fg-2);text-wrap:pretty")}>
              Two quick photos: your ID, then a live selfie. Verified specialists get hired more often.
            </p>
            <div style={css(`${CAPTION};margin:28px 0 12px`)}>Choose a document</div>
            <div style={css("display:flex;flex-direction:column;gap:10px")}>
              {DOC_OPTIONS.map((d) => {
                const on = doc === d.id
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDoc(d.id)}
                    aria-pressed={on}
                    style={css(
                      `display:flex;align-items:center;gap:14px;padding:16px;border:0;border-radius:var(--radius-lg);background:${on ? G_TINT : "var(--white)"};box-shadow:${on ? `inset 0 0 0 1.5px ${G}` : "inset 0 0 0 1px var(--border-default)"};text-align:left;cursor:pointer;color:var(--fg-1)`
                    )}
                  >
                    <Ico name={d.icon} size={18} style={ICON_TILE} />
                    <span style={css("flex:1")}>
                      <span style={css("display:block;font:500 15px/1.3 var(--font-sans)")}>{d.label}</span>
                      <span style={css("display:block;font:var(--text-small);color:var(--fg-3);margin-top:3px")}>{d.hint}</span>
                    </span>
                    <span style={css(`width:18px;height:18px;border-radius:50%;box-shadow:${on ? `inset 0 0 0 5px ${G}` : "inset 0 0 0 1.5px var(--ink-300)"};flex-shrink:0`)} />
                  </button>
                )
              })}
            </div>
            <ul style={css("list-style:none;margin:24px 0 0;padding:0;display:flex;flex-direction:column;gap:10px;font:var(--text-small);color:var(--fg-2)")}>
              <li style={css("display:flex;gap:10px;align-items:center")}>
                <Ico name="sun" size={14} style="color:var(--fg-3)" />
                Find good light, avoid glare on the document
              </li>
              <li style={css("display:flex;gap:10px;align-items:center")}>
                <Ico name="lock" size={14} style="color:var(--fg-3)" />
                Encrypted and only used for verification
              </li>
            </ul>
            <p style={css("margin:20px 0 0;padding-top:16px;border-top:1px solid var(--border-hairline);font:var(--text-small);color:var(--fg-3);text-wrap:pretty")}>
              By continuing, you consent to QuickHands processing your document and selfie, including biometric data, solely to verify your identity. Images
              are deleted within 30 days of a decision.{" "}
              <Link href="/privacy-policy" style={css("color:var(--fg-2)")}>
                Learn more
              </Link>
            </p>
          </div>
        ) : null}

        {step === "doc" || step === "selfie" ? (
          <div style={css("animation:qhFade 220ms var(--ease-out) both")}>
            <h2 style={css("font:var(--text-h3);letter-spacing:var(--ls-heading);margin:0")}>
              {step === "doc" ? `Photograph your ${docName}.` : "Take a live selfie."}
            </h2>
            <p style={css("margin:8px 0 20px;color:var(--fg-2);text-wrap:pretty")}>
              {step === "doc"
                ? "Place it flat inside the frame. All four corners should be visible."
                : "Centre your face in the oval and follow the prompts. We'll capture automatically."}
            </p>
            <div style={css(`position:relative;aspect-ratio:${aspect};border-radius:var(--radius-lg);overflow:hidden;background:var(--ink-950)`)}>
              <div style={css("position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center;color:rgba(255,255,255,.8)")}>
                <Ico name="camera-off" size={22} />
                <span style={css("font:var(--text-small);max-width:280px")}>Camera capture and photo upload are coming soon.</span>
                <button
                  type="button"
                  disabled
                  style={css("display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 18px;border:0;border-radius:999px;background:var(--white);color:var(--fg-1);font:500 14px/1 var(--font-sans);cursor:not-allowed;opacity:.5")}
                >
                  <Ico name="upload" size={14} />
                  Upload photo
                </button>
              </div>
              {step === "doc" ? (
                <div style={css("position:absolute;inset:12%;border-radius:12px;box-shadow:0 0 0 999px rgba(10,10,11,.45),inset 0 0 0 2px rgba(255,255,255,.9);pointer-events:none")} />
              ) : (
                <div style={css("position:absolute;left:50%;top:50%;width:58%;height:76%;transform:translate(-50%,-50%);border-radius:50%;box-shadow:0 0 0 999px rgba(10,10,11,.5),inset 0 0 0 2px rgba(255,255,255,.9);pointer-events:none")} />
              )}
            </div>
            <div style={css("display:flex;justify-content:center;margin-top:20px")}>
              <button
                type="button"
                onClick={() => setStep(step === "doc" ? "docReview" : "selfieReview")}
                aria-label="Preview the next step without taking a photo"
                style={css("width:64px;height:64px;border:0;border-radius:50%;background:var(--white);box-shadow:inset 0 0 0 4px var(--ink-950),0 0 0 1px var(--border-default);cursor:pointer;display:inline-flex;align-items:center;justify-content:center")}
              >
                <span style={css(`width:44px;height:44px;border-radius:50%;background:${G}`)} />
              </button>
            </div>
          </div>
        ) : null}

        {step === "docReview" || step === "selfieReview" ? (
          <div style={css("animation:qhFade 220ms var(--ease-out) both")}>
            <h2 style={css("font:var(--text-h3);letter-spacing:var(--ls-heading);margin:0")}>
              {step === "docReview" ? `Is your ${docName} readable?` : "Happy with your selfie?"}
            </h2>
            <p style={css("margin:8px 0 20px;color:var(--fg-2)")}>Make sure everything is sharp and readable, with no glare.</p>
            <div style={css(`display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;aspect-ratio:${aspect};border-radius:var(--radius-lg);background:var(--ink-100);font:var(--text-small);color:var(--fg-3)`)}>
              No photo has been taken yet.
            </div>
            {step === "selfieReview" ? <p style={css(SOON_NOTE)}>{COMING_SOON}</p> : null}
          </div>
        ) : null}
      </div>

      <div style={css(FOOT)}>
        <Ix onClick={() => (back ? setStep(back) : onClose())} base={CANCEL_BTN} hover={CANCEL_HOVER}>
          {VERIFY_BACK_LABEL[step]}
        </Ix>
        {step === "intro" ? (
          <Ix onClick={() => setStep("doc")} base={primaryPill(true)} active="transform:scale(0.98)">
            Continue
            <Ico name="arrow-right" size={14} />
          </Ix>
        ) : null}
        {step === "docReview" ? (
          <Ix onClick={() => setStep("selfie")} base={primaryPill(true)} active="transform:scale(0.98)">
            Use this photo
            <Ico name="arrow-right" size={14} />
          </Ix>
        ) : null}
        {step === "selfieReview" ? (
          <Ix disabled base={primaryPill(false)}>
            Submit
            <Ico name="arrow-right" size={14} />
          </Ix>
        ) : null}
      </div>
    </Modal>
  )
}

function primaryPill(enabled: boolean) {
  return `height:44px;padding:0 22px;border:0;border-radius:999px;background:${enabled ? G : "var(--ink-300)"};color:var(--white);font:500 14px/1 var(--font-sans);cursor:${enabled ? "pointer" : "not-allowed"};display:inline-flex;align-items:center;gap:8px`
}

/* ───────────── Apply ───────────── */

export function ApplyModal({
  job,
  saving,
  error,
  onSend,
  onClose,
}: {
  job: RecommendedJob
  saving: boolean
  error: string | null
  onSend: (price: number, message: string) => void
  onClose: () => void
}) {
  const [price, setPrice] = useState("")
  const [message, setMessage] = useState("")
  const budget = jobBudget(job.maxPrice)
  const priceNumber = Number(price)
  const valid = priceNumber > 0 && !saving

  return (
    <Modal label="Apply to job" maxWidth={520} boxStyle="max-height:calc(100vh - 32px)">
      <div style={css("display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--border-hairline)")}>
        <Eyebrow>Send an offer</Eyebrow>
        <CloseButton onClick={onClose} />
      </div>
      <div style={css("padding:28px;overflow:auto;display:flex;flex-direction:column;gap:18px")}>
        <div style={css("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
          <div style={css(CAPTION)}>
            {job.selectedServices?.[0] || job.serviceType} · {job.location?.label || job.location?.city || "Location not set"}
          </div>
          <div style={css("font:500 17px/1.3 var(--font-sans);margin-top:8px")}>{job.serviceType}</div>
          <div style={css("font:var(--text-small);color:var(--fg-2);margin-top:6px")}>
            {formatShort(job.startDate, job.endDate)} · {budget !== null ? `Budget $${budget}` : "No budget set"}
          </div>
        </div>
        <Field label="Your price (USD)" type="number" min="0" placeholder={budget !== null ? String(budget) : "e.g. 40"} value={price} onChange={setPrice} />
        <Field
          label="Message to the client"
          multiline
          rows={4}
          placeholder="Introduce yourself and explain how you'd do the job."
          value={message}
          onChange={setMessage}
        />
        <div style={css(`display:flex;gap:10px;align-items:flex-start;padding:14px;border-radius:var(--radius-md);background:${G_TINT};font:var(--text-small);color:#142C7A`)}>
          <span style={css("display:inline-flex;flex-shrink:0;padding-top:2px")}>
            <Ico name="info" size={14} />
          </span>
          <span>The client sees your price and message. Once you apply, you can message them in QuickHands.</span>
        </div>
        <ErrorLine message={error} />
      </div>
      <div style={css(`${FOOT};justify-content:flex-end`)}>
        <Ix onClick={onClose} base={CANCEL_BTN} hover={CANCEL_HOVER}>
          Cancel
        </Ix>
        <button
          type="button"
          onClick={() => valid && onSend(priceNumber, message.trim())}
          disabled={!valid}
          style={css(`${saveButton(valid)};display:inline-flex;align-items:center;gap:8px`)}
        >
          {saving ? "Sending…" : "Send offer"}
          {saving ? null : <Ico name="send" size={14} />}
        </button>
      </div>
    </Modal>
  )
}

function formatShort(start: string | null, end: string | null) {
  const fmt = (iso: string | null) => {
    if (!iso) return null
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString(undefined, { day: "numeric", month: "short" })
  }
  return [fmt(start), fmt(end)].filter(Boolean).join(" – ") || "Dates to agree"
}

/* ───────────── Conversation ───────────── */

export function ThreadModal({ app, onClose }: { app: Application; onClose: () => void }) {
  const clientName = app.job?.clientName || "Client"
  return (
    <Modal label="Conversation" maxWidth={540} boxStyle="height:min(680px, calc(100vh - 32px))">
      <div style={css("display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--border-hairline)")}>
        <div role="img" aria-label={clientName} style={css("width:40px;height:40px;border-radius:50%;background-color:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 13px/1 var(--font-sans);flex-shrink:0")}>
          {initials(clientName)}
        </div>
        <div style={css("flex:1;min-width:0")}>
          <div style={css("font:500 15px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>{clientName}</div>
          <div style={css("font:var(--text-small);color:var(--fg-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
            {app.job?.serviceType || "Job"} · your offer {app.quotation || ""}
          </div>
        </div>
        <CloseButton onClick={onClose} />
      </div>
      <Box as="div" style="flex:1;min-height:0;display:flex;flex-direction:column">
        {app.conversationId ? (
          <ChatWindow conversationId={app.conversationId} otherDisplayName={shortName(clientName) || "Client"} otherAvatarUrl={null} />
        ) : (
          <div style={css("margin:auto;text-align:center;color:var(--fg-3);font:var(--text-small);padding:24px")}>No messages yet. Say hello once the conversation opens.</div>
        )}
      </Box>
    </Modal>
  )
}

/* ───────────── Review ───────────── */

const RATING_LABELS = ["Tap a star to rate", "Poor", "Fair", "Good", "Very good", "Excellent"]

export function ReviewModal({
  name,
  saving,
  error,
  onSubmit,
  onLater,
}: {
  name: string
  saving: boolean
  error: string | null
  onSubmit: (rating: number, text: string) => void
  onLater: () => void
}) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")
  const valid = rating > 0 && !saving

  return (
    <Modal label="Leave a review" maxWidth={480} boxStyle="max-height:calc(100vh - 32px)">
      <div style={css("display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--border-hairline)")}>
        <Eyebrow>Task completed · Leave a review</Eyebrow>
        <CloseButton onClick={onLater} />
      </div>
      <div style={css("padding:28px;overflow:auto;display:flex;flex-direction:column;gap:20px")}>
        <div style={css("display:flex;align-items:center;gap:14px")}>
          <div role="img" aria-label={name} style={css("width:52px;height:52px;border-radius:50%;background-color:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 16px/1 var(--font-sans);flex-shrink:0")}>
            {initials(name)}
          </div>
          <div style={css("min-width:0")}>
            <h2 style={css("font:var(--text-h3);letter-spacing:var(--ls-heading);margin:0")}>
              How did it <em style={css(EM)}>go</em>?
            </h2>
            <div style={css("font:var(--text-small);color:var(--fg-2);margin-top:4px")}>Rate {name} as a client.</div>
          </div>
        </div>
        <div style={css("display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 0;border-top:1px solid var(--border-hairline);border-bottom:1px solid var(--border-hairline)")}>
          <div role="radiogroup" aria-label="Rating" style={css("display:flex;gap:4px")}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Ix
                key={n}
                as="button"
                role="radio"
                aria-checked={n === rating}
                aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                onClick={() => setRating(n)}
                base={`width:48px;height:48px;border:0;border-radius:var(--radius-md);background:transparent;cursor:pointer;font-size:34px;line-height:1;color:${n <= rating ? "var(--ink-950)" : "var(--ink-200)"};transition:color var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)`}
                hover="background:var(--ink-50)"
                active="transform:scale(0.92)"
              >
                ★
              </Ix>
            ))}
          </div>
          <span style={css(CAPTION)}>{RATING_LABELS[rating]}</span>
        </div>
        <Field
          label="Tell others about it (optional)"
          multiline
          rows={3}
          placeholder="e.g. Clear instructions, friendly and easy to work with."
          value={text}
          onChange={setText}
        />
        <ErrorLine message={error} />
      </div>
      <div style={css(FOOT)}>
        <Ix onClick={onLater} base={CANCEL_BTN} hover={CANCEL_HOVER}>
          Later
        </Ix>
        <button
          type="button"
          onClick={() => valid && onSubmit(rating, text.trim())}
          disabled={!valid}
          style={css(`height:44px;padding:0 22px;border:0;border-radius:999px;background:${rating ? G : "var(--ink-300)"};color:var(--white);font:500 14px/1 var(--font-sans);cursor:${valid ? "pointer" : "not-allowed"}`)}
        >
          {saving ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </Modal>
  )
}
