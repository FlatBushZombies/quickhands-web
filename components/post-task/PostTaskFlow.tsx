"use client"

import { useEffect, useState, type CSSProperties } from "react"
import Link from "next/link"
import { useAuth, useUser } from "@clerk/nextjs"
import {
  ArrowRight,
  Calendar,
  CalendarRange,
  Check,
  FileText,
  GraduationCap,
  ImagePlus,
  Loader2,
  Plus,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Trees,
  Truck,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { authFontClassName } from "@/components/auth/fonts"
import { RoleGate } from "@/components/app/RoleGate"
import { createJob, type CreateJobPayload, type CreateJobResult, type PreferredTime } from "@/lib/jobs-api"
import { uploadToCloudinary } from "@/lib/cloudinary"

const SANS = "var(--font-geist), ui-sans-serif, system-ui, sans-serif"
const MONO = "var(--font-geist-mono), ui-monospace, Menlo, monospace"
const SERIF = "var(--font-instrument-serif), ui-serif, Georgia, serif"
const GREEN = "#108600"
const GREEN_HOVER = "#0D6E00"
const GREEN_TINT = "#F1F8EF"

/** Design tokens from the Post a task design, scoped to this page. */
const TOKENS = {
  "--ink-950": "#0A0A0B",
  "--ink-800": "#1F1F22",
  "--ink-600": "#4A4A50",
  "--ink-400": "#9A9AA0",
  "--ink-300": "#C7C7CB",
  "--ink-100": "#EFEFF0",
  "--ink-50": "#F6F6F5",
  "--paper": "#FBFBFA",
  "--white": "#FFFFFF",
  "--danger-600": "#C9302C",
  "--fg-1": "var(--ink-950)",
  "--fg-2": "var(--ink-600)",
  "--fg-3": "var(--ink-400)",
  "--border-hairline": "rgba(10,10,11,.08)",
  "--border-default": "rgba(10,10,11,.12)",
  "--focus-ring": "#2F54FF",
  "--shadow-sm": "0 1px 2px rgba(10,10,11,.04),0 0 0 1px var(--border-hairline)",
  "--shadow-float":
    "0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14),0 0 0 1px var(--border-hairline)",
  "--shadow-hairline": "0 0 0 1px var(--border-hairline)",
  "--surface-glass": "rgba(251,251,250,.72)",
  "--blur-glass": "saturate(1.4) blur(14px)",
  "--ease-out": "cubic-bezier(.22,1,.36,1)",
  "--container-max": "1200px",
  "--gutter": "24px",
  "--radius-md": "10px",
  "--radius-lg": "14px",
  "--radius-xl": "20px",
  "--dur-fast": "140ms",
  "--dur-base": "240ms",
  "--ls-mono": "0.06em",
} as CSSProperties

const PAGE_CSS = `
@keyframes qhFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes qhSpin{to{transform:rotate(360deg)}}
input::placeholder,textarea::placeholder{color:var(--ink-400)}
::selection{background:var(--ink-950);color:var(--white)}
:focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}
.pt-card{transition:box-shadow 140ms var(--ease-out),background 140ms var(--ease-out)}
.pt-card:hover{box-shadow:inset 0 0 0 1.5px var(--ink-950) !important}
.pt-card:active,.pt-press:active{transform:scale(0.98)}
.pt-ghost:hover,.pt-skip:hover,.pt-chip:hover,.pt-close:hover{background:var(--ink-100) !important;color:var(--fg-1) !important}
.pt-attach:hover{background:var(--ink-50) !important}
.pt-secondary:hover{background:var(--ink-50) !important}
.pt-primary:hover{background:${GREEN_HOVER} !important}
.pt-field:focus{box-shadow:inset 0 0 0 1.5px var(--ink-950) !important;outline:none}
@media (max-width: 727px){ .pt-form{grid-column:auto !important} }
`

const MICRO: CSSProperties = {
  fontFamily: MONO,
  fontWeight: 400,
  fontSize: 11,
  lineHeight: 1.3,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
}

const SMALL: CSSProperties = { fontFamily: SANS, fontWeight: 400, fontSize: 13, lineHeight: 1.45 }

const H1: CSSProperties = {
  fontFamily: SANS,
  fontWeight: 500,
  fontSize: "clamp(36px, 4.6vw, 56px)",
  lineHeight: 1.05,
  letterSpacing: "-0.035em",
  margin: "14px 0 0",
  textWrap: "balance",
}

const EM: CSSProperties = {
  fontFamily: SERIF,
  fontStyle: "italic",
  fontWeight: 400,
  letterSpacing: "-0.02em",
  color: GREEN,
}

const LABEL_500: CSSProperties = { fontFamily: SANS, fontWeight: 500, fontSize: 15, lineHeight: 1.25, letterSpacing: "-0.015em" }

const BUTTON_LG: CSSProperties = {
  height: 52,
  padding: "0 24px",
  border: 0,
  borderRadius: 999,
  fontFamily: SANS,
  fontWeight: 500,
  fontSize: 15,
  lineHeight: 1,
  letterSpacing: "-0.01em",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  cursor: "pointer",
}

const CATS: { id: string; label: string; icon: LucideIcon; subs: string[] }[] = [
  { id: "repairs", label: "Home & repairs", icon: Wrench, subs: ["Plumbing", "Electrical", "Handyman", "Furniture assembly", "Installations", "Painting"] },
  { id: "cleaning", label: "Cleaning", icon: Sparkles, subs: ["Home clean", "Deep clean", "Office clean", "Move-out clean", "Laundry"] },
  { id: "moving", label: "Moving & delivery", icon: Truck, subs: ["Moving help", "Pickup & drop-off", "Deliveries", "Errands", "Heavy lifting"] },
  { id: "beauty", label: "Beauty", icon: Scissors, subs: ["Hair", "Nails", "Makeup", "Barber"] },
  { id: "garden", label: "Garden & outdoor", icon: Trees, subs: ["Lawn mowing", "Gardening", "Tree trimming", "Pool cleaning"] },
  { id: "other", label: "Tutoring & other", icon: GraduationCap, subs: ["Tutoring", "Admin help", "Tech support", "Something else"] },
]

const TIMES: { id: PreferredTime; label: string; range: string }[] = [
  { id: "morning", label: "Morning", range: "8–12" },
  { id: "afternoon", label: "Afternoon", range: "12–5" },
  { id: "evening", label: "Evening", range: "5–8" },
  { id: "any", label: "Any time", range: "" },
]

type WhenId = "asap" | "date" | "flex"

const WHEN_OPTIONS: { id: WhenId; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "asap", label: "As soon as possible", hint: "Today or tomorrow", icon: Zap },
  { id: "date", label: "On a specific day", hint: "Pick a date and time", icon: Calendar },
  { id: "flex", label: "I'm flexible", hint: "Within the next few weeks", icon: CalendarRange },
]

/** Quick-add lines from the design's details step. */
const QUICK_ADD = ["Size of the job", "Tools or materials needed", "Access & parking", "Budget in mind"]

/** The design allows up to five task photos. */
const PHOTO_LIMIT = 5
const DETAILS_MAX = 1000
/**
 * "Within the next few weeks" is stored as a window from today. The design
 * gives no exact date, so this is the length of that window in days.
 */
const FLEXIBLE_WINDOW_DAYS = 21

function choiceStyle(on: boolean): CSSProperties {
  return {
    background: on ? "var(--ink-950)" : "var(--white)",
    color: on ? "var(--white)" : "var(--fg-1)",
    boxShadow: on ? "none" : "inset 0 0 0 1px var(--border-default)",
  }
}

function cardStyle(on: boolean): CSSProperties {
  return {
    background: on ? GREEN_TINT : "var(--white)",
    boxShadow: on ? `inset 0 0 0 1.5px ${GREEN}` : "inset 0 0 0 1px var(--border-default)",
  }
}

function readHashParam(name: string): string | null {
  if (typeof window === "undefined") return null
  try {
    const hash = decodeURIComponent(window.location.hash.slice(1))
    const match = hash.match(new RegExp(`(?:^|&)${name}=([^&]*)`))
    return match ? match[1] : null
  } catch {
    return null
  }
}

function toDayString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base)
  next.setDate(next.getDate() + days)
  return next
}

function formatDay(date: Date): string {
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
}

function sentLine(count: number): string {
  if (count > 0) {
    return `We've sent it to ${count} ${count === 1 ? "specialist" : "specialists"}.`
  }
  return "We'll notify matching specialists as they become available."
}

export function PostTaskFlow() {
  return (
    <div
      className={authFontClassName}
      style={{
        ...TOKENS,
        minHeight: "100vh",
        background: "var(--paper)",
        color: "var(--fg-1)",
        display: "flex",
        flexDirection: "column",
        fontFamily: SANS,
        fontWeight: 400,
        fontSize: 15,
        lineHeight: 1.55,
        letterSpacing: "-0.005em",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{PAGE_CSS}</style>
      <RoleGate allow="client">
        <PostTaskForm />
      </RoleGate>
    </div>
  )
}

function PostTaskForm() {
  const { user } = useUser()
  const { getToken } = useAuth()

  const [step, setStep] = useState(1)
  const [cat, setCat] = useState<string | null>(null)
  const [sub, setSub] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [when, setWhen] = useState<WhenId | null>(null)
  const [day, setDay] = useState<number | null>(null)
  const [time, setTime] = useState<PreferredTime | null>(null)
  const [details, setDetails] = useState("")
  /** Cloudinary URLs of uploaded photos, in the order they were added. */
  const [photos, setPhotos] = useState<string[]>([])
  const [pendingUploads, setPendingUploads] = useState(0)
  const [photoError, setPhotoError] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<CreateJobResult | null>(null)
  const [submitted, setSubmitted] = useState<{ category: string; service: string; when: string } | null>(null)

  // The design prefills from "#q=...&cat=..." when the page is opened from a link.
  useEffect(() => {
    const requestedQuery = readHashParam("q")
    const requestedCat = readHashParam("cat")
    if (requestedQuery) setQuery(requestedQuery)
    if (requestedCat && CATS.some((c) => c.id === requestedCat)) setCat(requestedCat)
  }, [])

  const category = CATS.find((c) => c.id === cat) ?? null
  const trimmedQuery = query.trim()
  const service = trimmedQuery || sub || null
  const step1Ok = !!(trimmedQuery || (category && sub))

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayList = Array.from({ length: 14 }, (_, i) => addDays(today, i))
  const timeChoice = TIMES.find((t) => t.id === time) ?? null

  const step2Ok = when === "asap" || when === "flex" || (when === "date" && day !== null && time !== null)
  const whenText: string | null =
    when === "asap"
      ? "As soon as possible"
      : when === "flex"
        ? "I'm flexible"
        : when === "date" && day !== null
          ? formatDay(dayList[day]) +
            (timeChoice ? ` · ${timeChoice.label}${timeChoice.range ? ` (${timeChoice.range})` : ""}` : "")
          : null

  const stepOk = [step1Ok, step2Ok, !!details.trim()]
  const maxReach = step1Ok ? (step2Ok ? 3 : 2) : 1
  const busy = submitting || pendingUploads > 0
  const nextDisabled = busy || (step === 1 && !step1Ok) || (step === 2 && !step2Ok)
  const photoRoomFull = photos.length + pendingUploads >= PHOTO_LIMIT

  const steps = [
    { n: 1, label: "Service" },
    { n: 2, label: "When" },
    { n: 3, label: "Details" },
  ]

  const progressPct = result
    ? "100%"
    : `${(((step - 1) / 3) * 100 + (stepOk[step - 1] ? 33.3 : 8)).toFixed(1)}%`

  const go = (n: number) => setStep(n)

  const pickCategory = (id: string) => {
    setCat(id)
    setSub(null)
  }

  /** Start and end dates for the request, derived from the When step. */
  const scheduleWindow = (): { startDate: string; endDate: string } | null => {
    if (when === "asap") return { startDate: toDayString(today), endDate: toDayString(addDays(today, 1)) }
    if (when === "flex") {
      return { startDate: toDayString(today), endDate: toDayString(addDays(today, FLEXIBLE_WINDOW_DAYS)) }
    }
    if (when === "date" && day !== null) {
      const picked = toDayString(dayList[day])
      return { startDate: picked, endDate: picked }
    }
    return null
  }

  const addPhotos = async (fileList: FileList | null) => {
    if (!fileList) return
    const images = Array.from(fileList).filter((file) => file.type.startsWith("image/"))
    const room = PHOTO_LIMIT - photos.length - pendingUploads
    const picked = images.slice(0, Math.max(0, room))

    if (images.length < fileList.length) setPhotoError("Only image files can be added.")
    else if (images.length > picked.length) setPhotoError(`A task can have up to ${PHOTO_LIMIT} photos.`)
    else setPhotoError(null)
    if (picked.length === 0) return

    setPendingUploads((count) => count + picked.length)
    const settled = await Promise.allSettled(picked.map((file) => uploadToCloudinary(file, { resourceType: "image" })))
    const uploaded: string[] = []
    settled.forEach((entry) => {
      if (entry.status === "fulfilled") uploaded.push(entry.value.url)
      else console.error("[post-job] Photo upload failed:", entry.reason)
    })
    if (uploaded.length < picked.length) setPhotoError("Some photos could not be uploaded. Try again.")
    setPhotos((current) => [...current, ...uploaded].slice(0, PHOTO_LIMIT))
    setPendingUploads((count) => count - picked.length)
  }

  const submit = async () => {
    const range = scheduleWindow()
    if (!user || busy || !step1Ok || !step2Ok || !service || !range) return

    const payload: CreateJobPayload = {
      serviceType: service,
      selectedServices: [service],
      startDate: range.startDate,
      endDate: range.endDate,
      additionalInfo: details.trim(),
      preferredTime: when === "date" ? time : null,
      documents: photos,
      clerkId: user.id,
      userName: user.fullName || "Anonymous",
      userAvatar: user.imageUrl || null,
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Could not verify your session. Please try again.")
      const response = await createJob(payload, token)
      setSubmitted({
        category: category && !trimmedQuery ? category.label : "Your task",
        service,
        when: whenText ?? "",
      })
      setResult(response)
    } catch (submitFailure) {
      setSubmitError(submitFailure instanceof Error ? submitFailure.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const next = () => {
    if (nextDisabled) return
    if (step < 3) go(step + 1)
    else void submit()
  }

  const restart = () => {
    setStep(1)
    setCat(null)
    setSub(null)
    setQuery("")
    setWhen(null)
    setDay(null)
    setTime(null)
    setDetails("")
    setPhotos([])
    setPhotoError(null)
    setSubmitError(null)
    setResult(null)
    setSubmitted(null)
  }

  const addQuickLine = (label: string) =>
    setDetails((current) => ((current ? current.replace(/\s*$/, "") + "\n" : "") + label + ": ").slice(0, DETAILS_MAX))

  const summaryRows = [
    {
      key: "Service",
      icon: Wrench,
      value: service ? (category && !trimmedQuery ? `${category.label} — ${service}` : service) : "Not chosen yet",
      ok: !!service,
      edit: () => go(1),
    },
    { key: "When", icon: Calendar, value: whenText || "Not chosen yet", ok: !!whenText, edit: () => go(2) },
    {
      key: "Details",
      icon: FileText,
      value: details.trim() ? (details.length > 120 ? `${details.slice(0, 120)}…` : details) : "Optional",
      ok: !!details.trim(),
      edit: () => go(3),
    },
  ]

  const sentToText = result ? sentLine(result.matchingSummary.nearbyFreelancerCount) : ""

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--surface-glass)",
          backdropFilter: "var(--blur-glass)",
          WebkitBackdropFilter: "var(--blur-glass)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{
              font: "600 20px/1 var(--font-sans)",
              letterSpacing: "-0.05em",
              textDecoration: "none",
              color: "var(--fg-1)",
            }}
          >
            quickhands
          </Link>
          <span style={{ ...MICRO, letterSpacing: "var(--ls-mono)", color: "var(--fg-3)" }}>Post a task</span>
          <Link
            href="/"
            aria-label="Close"
            className="pt-close"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--fg-2)",
              boxShadow: "inset 0 0 0 1px var(--border-default)",
              transition: "background var(--dur-fast) var(--ease-out)",
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </Link>
        </div>
        <div style={{ height: 2, background: "var(--ink-100)" }}>
          <div
            style={{
              height: 2,
              width: progressPct,
              background: GREEN,
              transition: "width var(--dur-base) var(--ease-out)",
            }}
          />
        </div>
      </header>

      {!result ? (
        <div
          style={{
            flex: 1,
            width: "100%",
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "56px var(--gutter) 64px",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Form column */}
          <div className="pt-form" style={{ gridColumn: "span 2", minWidth: 0, maxWidth: 720 }}>
            <ol style={{ listStyle: "none", margin: "0 0 40px", padding: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {steps.map((s) => {
                const current = s.n === step
                const past = s.n < step && stepOk[s.n - 1]
                const locked = s.n > maxReach
                return (
                  <li key={s.n}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!locked) go(s.n)
                      }}
                      disabled={locked}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        height: 32,
                        padding: "0 14px 0 6px",
                        border: 0,
                        borderRadius: 999,
                        background: current ? "var(--white)" : "transparent",
                        color: locked ? "var(--fg-3)" : "var(--fg-1)",
                        boxShadow: current ? "var(--shadow-sm), inset 0 0 0 1px var(--border-hairline)" : "none",
                        fontFamily: SANS,
                        fontWeight: 500,
                        fontSize: 13,
                        lineHeight: 1,
                        cursor: locked ? "default" : "pointer",
                        transition: "background var(--dur-fast) var(--ease-out)",
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: current ? "var(--ink-950)" : past ? GREEN : "var(--ink-100)",
                          color: current || past ? "var(--white)" : "var(--fg-3)",
                          ...MICRO,
                          letterSpacing: 0,
                        }}
                      >
                        {past ? "✓" : `0${s.n}`}
                      </span>
                      {s.label}
                    </button>
                  </li>
                )
              })}
            </ol>

            {/* Step 1: service */}
            {step === 1 ? (
              <div style={{ animation: "qhFade 260ms var(--ease-out) both" }}>
                <span style={{ ...MICRO, color: GREEN }}>Step 01 / 03</span>
                <h1 style={H1}>
                  What do you need <em style={EM}>done</em>?
                </h1>
                <p style={{ margin: "12px 0 0", color: "var(--fg-2)" }}>Pick a service, or type it in your own words.</p>

                <label
                  style={{
                    marginTop: 32,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    height: 56,
                    padding: "0 18px",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--white)",
                    boxShadow: "var(--shadow-float)",
                  }}
                >
                  <Search size={18} strokeWidth={1.5} style={{ color: "var(--fg-3)", flexShrink: 0 }} />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="e.g. Fix a leaking kitchen tap"
                    aria-label="Describe the service you need"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      border: 0,
                      outline: "none",
                      background: "transparent",
                      fontFamily: SANS,
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: 1.55,
                      color: "var(--fg-1)",
                    }}
                  />
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: 10,
                    marginTop: 28,
                  }}
                >
                  {CATS.map((c) => {
                    const on = cat === c.id
                    const Icon = c.icon
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => pickCategory(c.id)}
                        aria-pressed={on}
                        className="pt-card"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 14,
                          padding: 16,
                          border: 0,
                          borderRadius: "var(--radius-lg)",
                          textAlign: "left",
                          cursor: "pointer",
                          color: "var(--fg-1)",
                          ...cardStyle(on),
                        }}
                      >
                        <Icon size={20} strokeWidth={1.5} style={{ color: on ? GREEN : "var(--fg-2)" }} />
                        <span style={LABEL_500}>{c.label}</span>
                      </button>
                    )
                  })}
                </div>

                {category ? (
                  <div style={{ marginTop: 28, animation: "qhFade 220ms var(--ease-out) both" }}>
                    <div style={{ ...MICRO, color: "var(--fg-3)", marginBottom: 12 }}>
                      {`${category.label} · choose one`}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {category.subs.map((label) => {
                        const on = sub === label
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setSub(label)}
                            aria-pressed={on}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              height: 36,
                              padding: "0 14px",
                              border: 0,
                              borderRadius: 999,
                              ...choiceStyle(on),
                              fontFamily: SANS,
                              fontWeight: 500,
                              fontSize: 14,
                              lineHeight: 1,
                              cursor: "pointer",
                              transition: "background var(--dur-fast) var(--ease-out)",
                            }}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Step 2: when */}
            {step === 2 ? (
              <div style={{ animation: "qhFade 260ms var(--ease-out) both" }}>
                <span style={{ ...MICRO, color: GREEN }}>Step 02 / 03</span>
                <h1 style={H1}>
                  When do you need <em style={EM}>it</em>?
                </h1>
                <p style={{ margin: "12px 0 0", color: "var(--fg-2)" }}>
                  Specialists see this before they send you an offer.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                    marginTop: 32,
                  }}
                >
                  {WHEN_OPTIONS.map((w) => {
                    const on = when === w.id
                    const Icon = w.icon
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setWhen(w.id)}
                        aria-pressed={on}
                        className="pt-card"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 6,
                          padding: 18,
                          border: 0,
                          borderRadius: "var(--radius-lg)",
                          textAlign: "left",
                          cursor: "pointer",
                          color: "var(--fg-1)",
                          ...cardStyle(on),
                        }}
                      >
                        <Icon size={18} strokeWidth={1.5} style={{ color: on ? GREEN : "var(--fg-2)", marginBottom: 8 }} />
                        <span style={LABEL_500}>{w.label}</span>
                        <span style={{ ...SMALL, color: "var(--fg-3)" }}>{w.hint}</span>
                      </button>
                    )
                  })}
                </div>

                {when === "date" ? (
                  <div style={{ marginTop: 32, animation: "qhFade 220ms var(--ease-out) both" }}>
                    <div style={{ ...MICRO, color: "var(--fg-3)", marginBottom: 12 }}>Pick a day</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
                      {dayList.map((d, i) => {
                        const on = day === i
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setDay(i)}
                            aria-pressed={on}
                            aria-label={formatDay(d)}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 6,
                              padding: "10px 0",
                              border: 0,
                              borderRadius: "var(--radius-md)",
                              ...choiceStyle(on),
                              cursor: "pointer",
                              transition: "background var(--dur-fast) var(--ease-out)",
                            }}
                          >
                            <span style={{ ...MICRO, letterSpacing: "var(--ls-mono)", opacity: 0.7 }}>
                              {i === 0 ? "Today" : d.toLocaleDateString("en-GB", { weekday: "short" })}
                            </span>
                            <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 17, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                              {d.getDate()}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                {when === "date" && day !== null ? (
                  <div style={{ marginTop: 28, animation: "qhFade 220ms var(--ease-out) both" }}>
                    <div style={{ ...MICRO, color: "var(--fg-3)", marginBottom: 12 }}>Preferred time</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {TIMES.map((tm) => {
                        const on = time === tm.id
                        return (
                          <button
                            key={tm.id}
                            type="button"
                            onClick={() => setTime(tm.id)}
                            aria-pressed={on}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              height: 40,
                              padding: "0 16px",
                              border: 0,
                              borderRadius: 999,
                              ...choiceStyle(on),
                              fontFamily: SANS,
                              fontWeight: 500,
                              fontSize: 14,
                              lineHeight: 1,
                              cursor: "pointer",
                            }}
                          >
                            {tm.label}
                            {tm.range ? <span style={{ ...MICRO, letterSpacing: "var(--ls-mono)", opacity: 0.6 }}>{tm.range}</span> : null}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Step 3: details */}
            {step === 3 ? (
              <div style={{ animation: "qhFade 260ms var(--ease-out) both" }}>
                <span style={{ ...MICRO, color: GREEN }}>Step 03 / 03 · Optional</span>
                <h1 style={H1}>
                  Anything <em style={EM}>else</em> they should know?
                </h1>
                <p style={{ margin: "12px 0 0", color: "var(--fg-2)" }}>
                  More detail means more accurate offers. <span style={{ color: "var(--fg-3)" }}>You can skip this.</span>
                </p>

                <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="pt-details" style={{ ...SMALL, fontWeight: 500, color: "var(--fg-1)" }}>
                    Describe the task
                  </label>
                  <textarea
                    id="pt-details"
                    rows={6}
                    value={details}
                    onChange={(event) => setDetails(event.target.value.slice(0, DETAILS_MAX))}
                    placeholder="e.g. The tap under the kitchen sink drips constantly. I have a replacement washer but no tools."
                    className="pt-field"
                    style={{
                      width: "100%",
                      height: 180,
                      boxSizing: "border-box",
                      padding: "16px 18px",
                      borderRadius: "var(--radius-lg)",
                      border: 0,
                      background: "var(--white)",
                      boxShadow: "inset 0 0 0 1px var(--border-default)",
                      resize: "none",
                      outline: "none",
                      fontFamily: SANS,
                      fontWeight: 400,
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: "var(--fg-1)",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", ...SMALL, color: "var(--fg-3)" }}>
                    <span>Don&apos;t share phone numbers or addresses here.</span>
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{`${details.length} / ${DETAILS_MAX}`}</span>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <div style={{ ...MICRO, color: "var(--fg-3)", marginBottom: 12 }}>Quick add</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {QUICK_ADD.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => addQuickLine(label)}
                        className="pt-chip"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          height: 32,
                          padding: "0 12px",
                          border: 0,
                          borderRadius: 999,
                          background: "var(--white)",
                          boxShadow: "inset 0 0 0 1px var(--border-default)",
                          fontFamily: SANS,
                          fontWeight: 500,
                          fontSize: 13,
                          lineHeight: 1,
                          color: "var(--fg-2)",
                          cursor: "pointer",
                          transition: "background var(--dur-fast) var(--ease-out)",
                        }}
                      >
                        <Plus size={13} strokeWidth={1.5} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <label
                  className="pt-attach"
                  style={{
                    marginTop: 28,
                    width: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 20px",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--white)",
                    boxShadow: "inset 0 0 0 1px var(--border-default)",
                    cursor: photoRoomFull ? "not-allowed" : "pointer",
                    color: "var(--fg-1)",
                    transition: "background var(--dur-fast) var(--ease-out)",
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "var(--radius-md)",
                      background: "var(--ink-100)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ImagePlus size={20} strokeWidth={1.5} />
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 15, lineHeight: 1.3 }}>Add photos</span>
                    <span style={{ ...SMALL, color: "var(--fg-3)" }}>
                      {photos.length >= PHOTO_LIMIT
                        ? `${PHOTO_LIMIT} of ${PHOTO_LIMIT} added`
                        : photos.length > 0 || pendingUploads > 0
                          ? `${photos.length + pendingUploads} of ${PHOTO_LIMIT} added · tap to add more`
                          : `Up to ${PHOTO_LIMIT} images. Helps specialists quote accurately.`}
                    </span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={photoRoomFull}
                    onChange={(event) => {
                      void addPhotos(event.target.files)
                      event.target.value = ""
                    }}
                    style={{ display: "none" }}
                  />
                </label>

                {photoError ? (
                  <p role="alert" style={{ ...SMALL, margin: "12px 0 0", color: "var(--danger-600)" }}>
                    {photoError}
                  </p>
                ) : null}

                {photos.length > 0 || pendingUploads > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {photos.map((url, index) => (
                      <div
                        key={url}
                        role="img"
                        aria-label="Task photo"
                        style={{
                          position: "relative",
                          width: 84,
                          height: 84,
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--ink-100)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundImage: `url("${url}")`,
                        }}
                      >
                        <button
                          type="button"
                          aria-label="Remove photo"
                          onClick={() => setPhotos((current) => current.filter((_, k) => k !== index))}
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            width: 24,
                            height: 24,
                            border: 0,
                            borderRadius: "50%",
                            background: "rgba(10,10,11,.72)",
                            color: "var(--white)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <X size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                    {Array.from({ length: pendingUploads }, (_, index) => (
                      <div
                        key={`pending-${index}`}
                        aria-label="Uploading photo"
                        style={{
                          width: 84,
                          height: 84,
                          borderRadius: "var(--radius-md)",
                          background: "var(--ink-100)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--fg-3)",
                        }}
                      >
                        <Loader2 size={18} strokeWidth={1.5} style={{ animation: "qhSpin 900ms linear infinite" }} />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginTop: 48,
                paddingTop: 24,
                borderTop: "1px solid var(--border-hairline)",
              }}
            >
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  className="pt-ghost"
                  style={{ ...BUTTON_LG, padding: "0 20px", background: "transparent", color: "var(--fg-2)", transition: "background var(--dur-fast) var(--ease-out)" }}
                >
                  Back
                </button>
              ) : null}
              <span style={{ flex: 1 }} />
              {step === 3 ? (
                <button
                  type="button"
                  onClick={() => void submit()}
                  disabled={busy}
                  className="pt-skip"
                  style={{
                    height: 52,
                    padding: "0 20px",
                    border: 0,
                    background: "transparent",
                    fontFamily: SANS,
                    fontWeight: 500,
                    fontSize: 15,
                    lineHeight: 1,
                    color: "var(--fg-2)",
                    cursor: busy ? "not-allowed" : "pointer",
                    borderRadius: 999,
                    transition: "background var(--dur-fast) var(--ease-out)",
                  }}
                >
                  Skip & post
                </button>
              ) : null}
              <button
                type="button"
                onClick={next}
                disabled={nextDisabled}
                className="pt-press"
                style={{
                  height: 52,
                  padding: "0 26px",
                  border: 0,
                  borderRadius: 999,
                  background: nextDisabled ? "var(--ink-300)" : GREEN,
                  color: "var(--white)",
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: 15,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  cursor: nextDisabled ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "background var(--dur-fast) var(--ease-out)",
                }}
              >
                {step < 3 ? "Continue" : submitting ? "Posting…" : "Post task"}
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>
            {submitError ? (
              <p role="alert" style={{ ...SMALL, margin: "16px 0 0", color: "var(--danger-600)" }}>
                {submitError}
              </p>
            ) : null}
          </div>

          {/* Summary */}
          <aside
            style={{
              position: "sticky",
              top: 96,
              padding: 28,
              borderRadius: "var(--radius-xl)",
              background: "var(--white)",
              boxShadow: "var(--shadow-hairline)",
            }}
          >
            <div style={{ ...MICRO, color: "var(--fg-3)" }}>Your task</div>
            <dl style={{ margin: "20px 0 0", display: "flex", flexDirection: "column" }}>
              {summaryRows.map((row) => {
                const Icon = row.icon
                return (
                  <div
                    key={row.key}
                    style={{ display: "flex", gap: 14, padding: "16px 0", borderTop: "1px solid var(--border-hairline)" }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      style={{
                        color: row.ok ? GREEN : "var(--fg-3)",
                        paddingTop: 2,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <dt style={{ ...MICRO, color: "var(--fg-3)" }}>{row.key}</dt>
                      <dd
                        style={{
                          margin: "6px 0 0",
                          fontFamily: SANS,
                          fontWeight: 500,
                          fontSize: 15,
                          lineHeight: 1.4,
                          color: row.ok ? "var(--fg-1)" : "var(--fg-3)",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {row.value}
                      </dd>
                    </div>
                    {row.ok ? (
                      <button
                        type="button"
                        onClick={row.edit}
                        style={{
                          alignSelf: "flex-start",
                          border: 0,
                          background: "transparent",
                          padding: "2px 0",
                          fontFamily: SANS,
                          fontWeight: 500,
                          fontSize: 13,
                          lineHeight: 1,
                          color: "var(--fg-2)",
                          textDecoration: "underline",
                          textUnderlineOffset: 3,
                          textDecorationColor: "rgba(10,10,11,.24)",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                    ) : null}
                  </div>
                )
              })}
            </dl>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginTop: 8,
                padding: 14,
                borderRadius: "var(--radius-md)",
                background: "var(--ink-50)",
                ...SMALL,
                color: "var(--fg-2)",
              }}
            >
              <ShieldCheck size={16} strokeWidth={1.5} style={{ color: GREEN, flexShrink: 0, paddingTop: 1 }} />
              <span>Posting is free. You only pay once the job is done and you approve it.</span>
            </div>
          </aside>
        </div>
      ) : (
        /* Success */
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "64px var(--gutter)" }}>
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animation: "qhFade 320ms var(--ease-out) both",
            }}
          >
            <span
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: GREEN,
                color: "var(--white)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={28} strokeWidth={1.5} />
            </span>
            <h1 style={{ ...H1, margin: "28px 0 0" }}>
              Your task is <em style={EM}>live</em>.
            </h1>
            <p style={{ margin: "14px 0 0", color: "var(--fg-2)", maxWidth: 400, textWrap: "pretty" }}>
              {sentToText} <span style={{ color: "var(--fg-3)" }}>Offers usually start arriving within the hour.</span>
            </p>
            <div
              style={{
                width: "100%",
                marginTop: 32,
                padding: "20px 24px",
                borderRadius: "var(--radius-lg)",
                background: "var(--white)",
                boxShadow: "var(--shadow-hairline)",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span style={{ ...MICRO, color: "var(--fg-3)" }}>{submitted?.category}</span>
              <span style={{ ...LABEL_500, fontSize: 18, lineHeight: 1.3 }}>{submitted?.service}</span>
              <span style={{ ...SMALL, color: "var(--fg-2)" }}>{submitted?.when}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 28 }}>
              <Link
                href="/dashboard"
                className="pt-primary"
                style={{ ...BUTTON_LG, background: GREEN, color: "var(--white)", width: 170, transition: "background var(--dur-fast) var(--ease-out)" }}
              >
                View in my account
              </Link>
              <button
                type="button"
                onClick={restart}
                className="pt-secondary"
                style={{
                  ...BUTTON_LG,
                  width: 170,
                  background: "var(--white)",
                  color: "var(--fg-1)",
                  boxShadow: "inset 0 0 0 1px var(--border-default)",
                  transition: "background var(--dur-fast) var(--ease-out)",
                }}
              >
                Post another task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
