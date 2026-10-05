"use client"

import { useState } from "react"
import { ChatWindow } from "@/components/messaging/ChatWindow"
import { Box, Field, G, G_DARK, G_TINT, Ico, Ix, Modal, ModalHeader, css } from "@/components/pro-account/ui"
import {
  CATEGORIES,
  YEAR_OPTIONS,
  skillsForCategory,
  type ProfessionCategory,
  type YearValue,
} from "@/components/pro-account/professions"
import type { ExperienceEntry } from "@/lib/user-api"

const EM = `font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-0.02em;color:${G}`

const SAVE_BTN = (enabled: boolean) =>
  `height:44px;padding:0 22px;border:0;border-radius:999px;background:${enabled ? G : "var(--ink-300)"};color:var(--white);font:500 14px/1 var(--font-sans);cursor:${enabled ? "pointer" : "not-allowed"}`
const CANCEL_BTN = "height:44px;padding:0 18px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:500 14px/1 var(--font-sans);cursor:pointer"
const CANCEL_HOVER = "background:var(--ink-100)"

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
  const category: ProfessionCategory | null = CATEGORIES.find((c) => c.id === draft.categoryId) ?? null
  const chipLabels = category
    ? Array.from(new Set([...category.subs, ...draft.skills.filter((s) => skillsForCategory([s], category.id).length)]))
    : []
  const valid = Boolean(category && draft.skills.length)

  const pickCategory = (id: string) =>
    setDraft((d) => ({
      ...d,
      categoryId: id,
      skills: d.categoryId === id ? d.skills : skillsForCategory(d.skills, id),
    }))

  const toggleSkill = (skill: string) =>
    setDraft((d) => ({
      ...d,
      skills: d.skills.includes(skill) ? d.skills.filter((s) => s !== skill) : [...d.skills, skill],
    }))

  return (
    <Modal label="Your profession" maxWidth={560}>
      <ModalHeader eyebrow="Your profession" onClose={onClose} />
      <div style={css("padding:28px;overflow:auto;display:flex;flex-direction:column;gap:28px")}>
        <div>
          <h2 style={css(`font:var(--text-h2);font-size:30px;letter-spacing:var(--ls-heading);margin:0`)}>
            What do you <em style={css(EM)}>do</em>?
          </h2>
          <p style={css("margin:8px 0 0;color:var(--fg-2)")}>We use this to show you the right tasks.</p>
        </div>

        <div style={css("display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px")}>
          {CATEGORIES.map((c) => {
            const on = draft.categoryId === c.id
            return (
              <Ix
                key={c.id}
                onClick={() => pickCategory(c.id)}
                base={`display:flex;flex-direction:column;align-items:flex-start;gap:12px;padding:14px;border:0;border-radius:var(--radius-lg);background:${on ? G_TINT : "var(--white)"};box-shadow:${on ? `inset 0 0 0 1.5px ${G}` : "inset 0 0 0 1px var(--border-default)"};text-align:left;cursor:pointer;color:var(--fg-1)`}
              >
                <Ico name={c.icon} size={18} style={`color:${on ? G : "var(--fg-2)"}`} />
                <span style={css("font:500 14px/1.25 var(--font-sans)")}>{c.label}</span>
              </Ix>
            )
          })}
        </div>

        {category ? (
          <div style={css("display:flex;flex-direction:column;gap:24px;animation:qhFade 220ms var(--ease-out) both")}>
            <div>
              <div style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3);margin-bottom:12px")}>
                Your skills · pick all that apply
              </div>
              <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
                {chipLabels.map((skill) => {
                  const on = draft.skills.includes(skill)
                  return (
                    <Ix
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      base={`display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 14px;border:0;border-radius:999px;background:${on ? "var(--ink-950)" : "var(--white)"};color:${on ? "var(--white)" : "var(--fg-1)"};box-shadow:${on ? "none" : "inset 0 0 0 1px var(--border-default)"};font:500 14px/1 var(--font-sans);cursor:pointer`}
                    >
                      {on ? <Ico name="check" size={13} /> : null}
                      {skill}
                    </Ix>
                  )
                })}
              </div>
            </div>

            <div>
              <div style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3);margin-bottom:12px")}>
                Years of experience
              </div>
              <div role="radiogroup" aria-label="Years of experience" style={css("display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--ink-100)")}>
                {YEAR_OPTIONS.map((o) => {
                  const on = draft.years === o.value
                  return (
                    <Ix
                      key={o.value}
                      role="radio"
                      aria-checked={on}
                      onClick={() => setDraft((d) => ({ ...d, years: o.value }))}
                      base={`height:28px;padding:0 12px;border:0;border-radius:999px;background:${on ? "var(--white)" : "transparent"};box-shadow:${on ? "var(--shadow-sm)" : "none"};color:var(--fg-1);font:500 13px/1 var(--font-sans);cursor:pointer`}
                    >
                      {o.label}
                    </Ix>
                  )
                })}
              </div>
            </div>

            <Field
              label="Where do you work?"
              placeholder="e.g. Harare, Borrowdale & Avondale"
              value={draft.area}
              onChange={(v) => setDraft((d) => ({ ...d, area: v }))}
            />
          </div>
        ) : null}

        <ErrorLine message={error} />
      </div>
      <div style={css("display:flex;justify-content:flex-end;gap:10px;padding:16px 20px;border-top:1px solid var(--border-hairline)")}>
        <Ix onClick={onClose} base={CANCEL_BTN} hover={CANCEL_HOVER}>
          Cancel
        </Ix>
        <Ix
          disabled={!valid || saving}
          onClick={() => valid && onSave(draft)}
          base={SAVE_BTN(valid && !saving)}
        >
          {saving ? "Saving…" : "Save profession"}
        </Ix>
      </div>
    </Modal>
  )
}

/* ───────────── Work experience ───────────── */

export function ExperienceModal({
  saving,
  error,
  onSave,
  onClose,
}: {
  saving: boolean
  error: string | null
  onSave: (entry: ExperienceEntry) => void
  onClose: () => void
}) {
  const [entry, setEntry] = useState<ExperienceEntry>({ title: "", org: "", from: "", to: "", desc: "" })
  const set = (k: keyof ExperienceEntry) => (v: string) => setEntry((e) => ({ ...e, [k]: v }))
  const valid = entry.title.trim().length > 0

  return (
    <Modal label="Add work experience" maxWidth={520}>
      <ModalHeader eyebrow="Work experience · Optional" onClose={onClose} />
      <div style={css("padding:28px;overflow:auto;display:flex;flex-direction:column;gap:18px")}>
        <div>
          <h2 style={css("font:var(--text-h2);font-size:30px;letter-spacing:var(--ls-heading);margin:0")}>
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
      <div style={css("display:flex;justify-content:space-between;gap:10px;padding:16px 20px;border-top:1px solid var(--border-hairline)")}>
        <Ix onClick={onClose} base={CANCEL_BTN} hover={CANCEL_HOVER}>
          Cancel
        </Ix>
        <Ix disabled={!valid || saving} onClick={() => valid && onSave(entry)} base={SAVE_BTN(valid && !saving)}>
          {saving ? "Saving…" : "Save experience"}
        </Ix>
      </div>
    </Modal>
  )
}

/* ───────────── Apply (send an offer) ───────────── */

export function ApplyModal({
  job,
  saving,
  error,
  onSend,
  onClose,
}: {
  job: { skill: string; area: string; title: string; when: string; budgetText: string; maxPrice: number }
  saving: boolean
  error: string | null
  onSend: (price: number, message: string) => void
  onClose: () => void
}) {
  const [price, setPrice] = useState("")
  const [msg, setMsg] = useState("")
  const valid = Number(price) > 0

  return (
    <Modal label="Apply to job" maxWidth={520}>
      <ModalHeader eyebrow="Send an offer" onClose={onClose} />
      <div style={css("padding:28px;overflow:auto;display:flex;flex-direction:column;gap:18px")}>
        <div style={css("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
          <div style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>
            {job.skill} · {job.area}
          </div>
          <div style={css("font:500 17px/1.3 var(--font-sans);margin-top:8px")}>{job.title}</div>
          <div style={css("font:var(--text-small);color:var(--fg-2);margin-top:6px")}>
            {job.when} · {job.budgetText}
          </div>
        </div>
        <Field
          label="Your price (USD)"
          type="number"
          min="0"
          placeholder={job.maxPrice ? String(job.maxPrice) : "e.g. 40"}
          value={price}
          onChange={setPrice}
        />
        <Field
          label="Message to the client"
          multiline
          rows={4}
          placeholder="Introduce yourself and explain how you'd do the job."
          value={msg}
          onChange={setMsg}
        />
        <div style={css(`display:flex;gap:10px;align-items:flex-start;padding:14px;border-radius:var(--radius-md);background:${G_TINT};font:var(--text-small);color:${G_DARK}`)}>
          <Ico name="info" size={14} style={"flex-shrink:0;padding-top:2px"} />
          <span>Responding is free on the commission plan. You only pay when the client hires you.</span>
        </div>
        <ErrorLine message={error} />
      </div>
      <div style={css("display:flex;justify-content:flex-end;gap:10px;padding:16px 20px;border-top:1px solid var(--border-hairline)")}>
        <Ix onClick={onClose} base={CANCEL_BTN} hover={CANCEL_HOVER}>
          Cancel
        </Ix>
        <Ix
          disabled={!valid || saving}
          onClick={() => valid && onSend(Number(price), msg.trim())}
          base={`${SAVE_BTN(valid && !saving)};display:inline-flex;align-items:center;gap:8px`}
        >
          {saving ? "Sending…" : "Send offer"}
          {!saving ? <Ico name="send" size={14} /> : null}
        </Ix>
      </div>
    </Modal>
  )
}

/* ───────────── Review ───────────── */

const RATING_LABELS = ["Tap a star to rate", "Poor", "Fair", "Good", "Very good", "Excellent"]

export function ReviewModal({
  name,
  sub,
  saving,
  error,
  onSubmit,
  onLater,
}: {
  name: string
  sub: string
  saving: boolean
  error: string | null
  onSubmit: (rating: number, text: string) => void
  onLater: () => void
}) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")
  const valid = rating > 0

  return (
    <Modal label="Leave a review" maxWidth={480}>
      <ModalHeader eyebrow="Task completed · Leave a review" onClose={onLater} />
      <div style={css("padding:28px;overflow:auto;display:flex;flex-direction:column;gap:20px")}>
        <div style={css("display:flex;align-items:center;gap:14px")}>
          <div
            aria-hidden="true"
            style={css("width:52px;height:52px;border-radius:50%;background:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 16px/1 var(--font-sans);flex-shrink:0")}
          >
            {name.split(" ").filter(Boolean).map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div style={css("min-width:0")}>
            <h2 style={css("font:var(--text-h3);letter-spacing:var(--ls-heading);margin:0")}>
              How did it <em style={css(EM)}>go</em>?
            </h2>
            <div style={css("font:var(--text-small);color:var(--fg-2);margin-top:4px")}>{sub}</div>
          </div>
        </div>
        <div style={css("display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 0;border-top:1px solid var(--border-hairline);border-bottom:1px solid var(--border-hairline)")}>
          <div role="radiogroup" aria-label="Rating" style={css("display:flex;gap:4px")}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Ix
                key={n}
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
          <span style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>
            {RATING_LABELS[rating]}
          </span>
        </div>
        <Field
          label="Tell others about it (optional)"
          multiline
          rows={3}
          placeholder="e.g. Clear instructions, friendly and paid on time."
          value={text}
          onChange={setText}
        />
        <ErrorLine message={error} />
      </div>
      <div style={css("display:flex;justify-content:space-between;gap:10px;padding:16px 20px;border-top:1px solid var(--border-hairline)")}>
        <Ix onClick={onLater} base={CANCEL_BTN} hover={CANCEL_HOVER}>
          Later
        </Ix>
        <Ix disabled={!valid || saving} onClick={() => valid && onSubmit(rating, text.trim())} base={SAVE_BTN(valid && !saving)}>
          {saving ? "Submitting…" : "Submit review"}
        </Ix>
      </div>
    </Modal>
  )
}

/* ───────────── Conversation ───────────── */

/**
 * The job conversation, using the same chat window as /messages. The window
 * brings its own header, so the modal only adds the close control. The
 * caller must render this inside AppRoleProvider.
 */
export function ThreadModal({
  conversationId,
  onClose,
}: {
  conversationId: string | null
  onClose: () => void
}) {
  return (
    <Modal label="Conversation" maxWidth={540} boxStyle="height:min(680px, calc(100vh - 32px))">
      <div style={css("display:flex;justify-content:flex-end;padding:8px 10px 0")}>
        <Ix
          aria-label="Close"
          onClick={onClose}
          base="width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:var(--fg-2);display:inline-flex;align-items:center;justify-content:center;cursor:pointer"
          hover="background:var(--ink-100)"
        >
          <Ico name="x" size={16} />
        </Ix>
      </div>
      <Box as="div" style="flex:1;min-height:0;display:flex;flex-direction:column">
        {conversationId ? (
          <ChatWindow conversationId={conversationId} otherDisplayName="Client" otherAvatarUrl={null} />
        ) : (
          <div style={css("margin:auto;text-align:center;color:var(--fg-3);font:var(--text-small);padding:24px")}>
            No conversation for this job yet.
          </div>
        )}
      </Box>
    </Modal>
  )
}

