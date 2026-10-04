"use client"

import { useState, type CSSProperties } from "react"
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
  Locate,
  MapPin,
  Plus,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Trees,
  Truck,
  Wallet,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { authFontClassName } from "@/components/auth/fonts"
import { RoleGate } from "@/components/app/RoleGate"
import { createJob, type CreateJobPayload, type CreateJobResult } from "@/lib/jobs-api"
import { detectLocation, type DetectedLocation } from "@/lib/geocoding"
import { uploadToCloudinary } from "@/lib/cloudinary"

const SANS = "var(--font-geist), ui-sans-serif, system-ui, sans-serif"
const MONO = "var(--font-geist-mono), ui-monospace, Menlo, monospace"
const SERIF = "var(--font-instrument-serif), ui-serif, Georgia, serif"
const GREEN = "#108600"
const GREEN_HOVER = "#0D6E00"

/** Design tokens from the Post a task artifact, scoped to this page. */
const TOKENS = {
  "--ink-950": "#0A0A0B",
  "--ink-800": "#1F1F22",
  "--ink-400": "#9A9AA0",
  "--ink-300": "#C7C7CB",
  "--ink-100": "#EFEFF0",
  "--ink-50": "#F6F6F5",
  "--paper": "#FBFBFA",
  "--white": "#FFFFFF",
  "--danger-600": "#C9302C",
  "--fg-1": "var(--ink-950)",
  "--fg-2": "#4A4A50",
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
} as CSSProperties

const PAGE_CSS = `
@keyframes qhFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
input::placeholder,textarea::placeholder{color:var(--ink-400)}
::selection{background:var(--ink-950);color:var(--white)}
:focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}
.pt-card{transition:box-shadow 140ms var(--ease-out),background 140ms var(--ease-out)}
.pt-card:hover{box-shadow:inset 0 0 0 1.5px var(--ink-950) !important}
.pt-card:active,.pt-press:active{transform:scale(0.98)}
.pt-ghost:hover{background:var(--ink-100) !important;color:var(--fg-1) !important}
.pt-chip:hover{background:var(--ink-100) !important;color:var(--fg-1) !important}
.pt-attach:hover{background:var(--ink-50) !important}
.pt-secondary:hover{background:var(--ink-50) !important}
.pt-primary:hover{background:${GREEN_HOVER} !important}
.pt-skip:hover{background:var(--ink-100) !important;color:var(--fg-1) !important}
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

const HEADING: CSSProperties = {
  fontFamily: SANS,
  fontWeight: 500,
  fontSize: "clamp(36px, 4.6vw, 56px)",
  lineHeight: 1.05,
  letterSpacing: "-0.035em",
  margin: "14px 0 0",
}

const EM: CSSProperties = {
  fontFamily: SERIF,
  fontStyle: "italic",
  fontWeight: 400,
  letterSpacing: "-0.02em",
  color: GREEN,
}

const CARD_TITLE: CSSProperties = { fontFamily: SANS, fontWeight: 500, fontSize: 15, lineHeight: 1.25, letterSpacing: "-0.015em" }

const SUB_TITLE: CSSProperties = { ...MICRO, color: "var(--fg-3)", marginBottom: 12 }

const ROW_LABEL: CSSProperties = { ...MICRO, color: "var(--fg-3)" }

const STEP_KICKER: CSSProperties = { ...MICRO, color: GREEN }

const FADE_IN = (ms: number): CSSProperties => ({ animation: `qhFade ${ms}ms var(--ease-out) both` })

function choiceStyle(on: boolean): CSSProperties {
  return {
    background: on ? "var(--ink-950)" : "var(--white)",
    color: on ? "var(--white)" : "var(--fg-1)",
    boxShadow: on ? "none" : "inset 0 0 0 1px var(--border-default)",
  }
}

function cardStyle(on: boolean): CSSProperties {
  return {
    background: on ? "#F1F8EF" : "var(--white)",
    boxShadow: on ? `inset 0 0 0 1.5px ${GREEN}` : "inset 0 0 0 1px var(--border-default)",
  }
}

const CATS: { id: string; label: string; icon: LucideIcon; subs: string[] }[] = [
  { id: "repairs", label: "Home & repairs", icon: Wrench, subs: ["Plumbing", "Electrical", "Handyman", "Furniture assembly", "Installations", "Painting"] },
  { id: "cleaning", label: "Cleaning", icon: Sparkles, subs: ["Home clean", "Deep clean", "Office clean", "Move-out clean", "Laundry"] },
  { id: "moving", label: "Moving & delivery", icon: Truck, subs: ["Moving help", "Pickup & drop-off", "Deliveries", "Errands", "Heavy lifting"] },
  { id: "beauty", label: "Beauty", icon: Scissors, subs: ["Hair", "Nails", "Makeup", "Barber"] },
  { id: "garden", label: "Garden & outdoor", icon: Trees, subs: ["Lawn mowing", "Gardening", "Tree trimming", "Pool cleaning"] },
  { id: "other", label: "Tutoring & other", icon: GraduationCap, subs: ["Tutoring", "Admin help", "Tech support", "Something else"] },
]

const TIMES = [
  { id: "morning", label: "Morning", range: "8–12" },
  { id: "afternoon", label: "Afternoon", range: "12–5" },
  { id: "evening", label: "Evening", range: "5–8" },
  { id: "any", label: "Any time", range: "" },
]

const WHEN_OPTIONS: { id: WhenId; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "asap", label: "As soon as possible", hint: "Today or tomorrow", icon: Zap },
  { id: "date", label: "On a specific day", hint: "Pick a date and time", icon: Calendar },
  { id: "flex", label: "I'm flexible", hint: "Within the next few weeks", icon: CalendarRange },
]

/** Quick-add lines from the design's details step. */
const QUICK_ADD = ["Size of the job", "Tools or materials needed", "Access & parking", "Budget in mind"]

/** No specialist-preference control in the design; the API still receives the existing default. */
const SPECIALIST_CHOICE_DEFAULT = "Any Specialist"
const PHOTO_LIMIT = 5
/** "Within the next few weeks" has no backend equivalent; the request window is this many days. */
const FLEXIBLE_WINDOW_DAYS = 21
const DETAILS_MAX = 1000

type WhenId = "asap" | "date" | "flex"

interface Attachment {
  url: string
  name: string
  image: boolean
}

interface SubmittedSummary {
  category: string
  service: string
  when: string
  city: string | null
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

function sentLine(count: number, city: string | null): string {
  if (count > 0) {
    const noun = count === 1 ? "specialist" : "specialists"
    return city ? `We've sent it to ${count} ${noun} in ${city}.` : `We've sent it to ${count} ${noun} nearby.`
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
  const [cat, setCat] = useState<string | null>(() => {
    const requested = readHashParam("cat")
    return CATS.some((c) => c.id === requested) ? requested : null
  })
  const [sub, setSub] = useState<string | null>(null)
  const [query, setQuery] = useState(() => readHashParam("q") ?? "")
  const [when, setWhen] = useState<WhenId | null>(null)
  const [day, setDay] = useState<number | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [details, setDetails] = useState("")
  const [budget, setBudget] = useState("")

  const [location, setLocation] = useState<DetectedLocation | null>(null)
  const [manualCity, setManualCity] = useState("")
  const [locating, setLocating] = useState(false)
  const [locationFailed, setLocationFailed] = useState(false)

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [pendingUploads, setPendingUploads] = useState(0)
  const [attachError, setAttachError] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [showSlowHint, setShowSlowHint] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<CreateJobResult | null>(null)
  const [submitted, setSubmitted] = useState<SubmittedSummary | null>(null)

  const categoryObj = CATS.find((c) => c.id === cat)
  const service = query.trim() || sub || null
  const step1Ok = !!(query.trim() || (categoryObj && sub))

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayList = Array.from({ length: 14 }, (_, i) => addDays(today, i))
  const timeChoice = TIMES.find((t) => t.id === time)

  const step2Ok = when === "asap" || when === "flex" || (when === "date" && day !== null && !!time)
  const whenText =
    when === "asap"
      ? "As soon as possible"
      : when === "flex"
        ? "I'm flexible"
        : when === "date" && day !== null
          ? formatDay(dayList[day]) + (timeChoice ? ` · ${timeChoice.label}${timeChoice.range ? ` (${timeChoice.range})` : ""}` : "")
          : null

  const budgetNumber = budget.trim() === "" ? Number.NaN : Number(budget)
  const budgetOk = Number.isFinite(budgetNumber) && budgetNumber >= 0
  const budgetInvalid = budget.trim() !== "" && !budgetOk

  const city = location?.city || manualCity.trim() || null
  const whereText = location ? location.label || location.city || manualCity.trim() || "Location detected" : null

  const stepOk = [step1Ok, step2Ok, !!details.trim()]
  const maxReach = step1Ok ? (step2Ok ? 3 : 2) : 1
  const nextDisabled =
    submitting ||
    pendingUploads > 0 ||
    (step === 1 && !step1Ok) ||
    (step === 2 && !step2Ok) ||
    (step === 3 && !budgetOk)

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

  const handleDetectLocation = async () => {
    setLocating(true)
    setLocationFailed(false)
    try {
      setLocation(await detectLocation())
    } catch (detectError) {
      console.error("Location detection failed:", detectError)
      setLocationFailed(true)
    } finally {
      setLocating(false)
    }
  }

  const addFiles = async (fileList: FileList | null) => {
    if (!fileList) return
    const room = PHOTO_LIMIT - attachments.length - pendingUploads
    const picked = Array.from(fileList).slice(0, Math.max(0, room))
    if (picked.length === 0) return

    setAttachError(null)
    setPendingUploads((count) => count + picked.length)
    const results = await Promise.allSettled(
      picked.map(async (file) => {
        const image = file.type.startsWith("image/")
        const uploaded = await uploadToCloudinary(file, { resourceType: image ? "image" : "auto" })
        return { url: uploaded.url, name: uploaded.name, image }
      })
    )
    const uploaded: Attachment[] = []
    results.forEach((entry) => {
      if (entry.status === "fulfilled") uploaded.push(entry.value)
      else console.error("[post-job] Upload failed:", entry.reason)
    })
    if (uploaded.length < picked.length) setAttachError("Some files could not be uploaded. Try again.")
    setAttachments((current) => [...current, ...uploaded].slice(0, PHOTO_LIMIT))
    setPendingUploads((count) => count - picked.length)
  }

  const submit = async () => {
    if (!user || submitting || !step1Ok || !step2Ok || !budgetOk || pendingUploads > 0) return
    const range = scheduleWindow()
    if (!range || !service) return

    const detailsText = [
      details.trim(),
      when === "date" && timeChoice
        ? `Preferred time: ${timeChoice.label}${timeChoice.range ? ` (${timeChoice.range})` : ""}`
        : "",
    ]
      .filter(Boolean)
      .join("\n")

    const payload: CreateJobPayload = {
      serviceType: service,
      selectedServices: [service],
      startDate: range.startDate,
      endDate: range.endDate,
      maxPrice: budgetNumber,
      specialistChoice: SPECIALIST_CHOICE_DEFAULT,
      additionalInfo: detailsText,
      documents: attachments.map((a) => a.url),
      clerkId: user.id,
      userName: user.fullName || "Anonymous",
      userAvatar: user.imageUrl || null,
      location: {
        label: location?.label ?? null,
        city,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
      },
    }

    setSubmitting(true)
    setSubmitError(null)
    setShowSlowHint(false)
    const slowTimer = setTimeout(() => setShowSlowHint(true), 4000)
    try {
      const token = await getToken()
      if (!token) throw new Error("Could not verify your session. Please try again.")
      const response = await createJob(payload, token)
      setSubmitted({
        category: categoryObj && !query.trim() ? categoryObj.label : "Your task",
        service,
        when: whenText || "",
        city,
      })
      setResult(response)
    } catch (submitFailure) {
      setSubmitError(submitFailure instanceof Error ? submitFailure.message : "Something went wrong. Please try again.")
    } finally {
      clearTimeout(slowTimer)
      setSubmitting(false)
      setShowSlowHint(false)
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
    setBudget("")
    setAttachments([])
    setAttachError(null)
    setSubmitError(null)
    setResult(null)
    setSubmitted(null)
  }

  const summaryRows = [
    {
      key: "Service",
      icon: Wrench,
      value: service ? (categoryObj && !query.trim() ? `${categoryObj.label} — ${service}` : service) : "Not chosen yet",
      ok: !!service,
      edit: () => go(1),
    },
    { key: "When", icon: Calendar, value: whenText || "Not chosen yet", ok: !!whenText, edit: () => go(2) },
    { key: "Where", icon: MapPin, value: whereText || "Optional", ok: !!location, edit: () => go(2) },
    {
      key: "Details",
      icon: FileText,
      value: details.trim() ? (details.length > 120 ? `${details.slice(0, 120)}…` : details) : "Optional",
      ok: !!details.trim(),
      edit: () => go(3),
    },
    { key: "Budget", icon: Wallet, value: budgetOk ? `US$ ${budget.trim()}` : "Not chosen yet", ok: budgetOk, edit: () => go(3) },
  ]

  const sentToText = result ? sentLine(result.matchingSummary.nearbyFreelancerCount, submitted?.city ?? null) : ""

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
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{ font: "600 20px/1 " + SANS, letterSpacing: "-0.05em", textDecoration: "none", color: "var(--fg-1)" }}
          >
            quickhands
          </Link>
          <span style={{ ...MICRO, color: "var(--fg-3)" }}>Post a task</span>
          <Link
            href="/dashboard"
            aria-label="Close"
            className="pt-ghost"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--fg-2)",
              boxShadow: "inset 0 0 0 1px var(--border-default)",
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
              transition: "width 240ms var(--ease-out)",
            }}
          />
        </div>
      </header>

      {!result ? (
        <div
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "56px 24px 64px",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: 48,
            alignItems: "start",
          }}
        >
          <div style={{ gridColumn: "span 2", minWidth: 0, maxWidth: 720 }}>
            <ol style={{ listStyle: "none", margin: "0 0 40px", padding: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {steps.map((s) => {
                const cur = s.n === step
                const past = s.n < step && stepOk[s.n - 1]
                const locked = s.n > maxReach
                return (
                  <li key={s.n}>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => !locked && go(s.n)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        height: 32,
                        padding: "0 14px 0 6px",
                        border: 0,
                        borderRadius: 999,
                        background: cur ? "var(--white)" : "transparent",
                        color: locked ? "var(--fg-3)" : "var(--fg-1)",
                        boxShadow: cur ? "var(--shadow-sm), inset 0 0 0 1px var(--border-hairline)" : "none",
                        font: "500 13px/1 " + SANS,
                        cursor: locked ? "default" : "pointer",
                        transition: "background 140ms var(--ease-out)",
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
                          background: cur ? "var(--ink-950)" : past ? GREEN : "var(--ink-100)",
                          color: cur || past ? "var(--white)" : "var(--fg-3)",
                          fontFamily: MONO,
                          fontSize: 11,
                          lineHeight: 1.3,
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

            {step === 1 ? (
              <div style={FADE_IN(260)}>
                <span style={STEP_KICKER}>Step 01 / 03</span>
                <h1 className="text-balance" style={HEADING}>
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
                    borderRadius: 14,
                    background: "var(--white)",
                    boxShadow: "var(--shadow-float)",
                  }}
                >
                  <Search size={18} strokeWidth={1.5} style={{ color: "var(--fg-3)", flexShrink: 0 }} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Fix a leaking kitchen tap"
                    aria-label="Describe the service you need"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      border: 0,
                      outline: "none",
                      background: "transparent",
                      fontFamily: SANS,
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
                        className="pt-card"
                        aria-pressed={on}
                        onClick={() => pickCategory(c.id)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 14,
                          padding: 16,
                          border: 0,
                          borderRadius: 14,
                          textAlign: "left",
                          cursor: "pointer",
                          color: "var(--fg-1)",
                          ...cardStyle(on),
                        }}
                      >
                        <Icon size={20} strokeWidth={1.5} style={{ color: on ? GREEN : "var(--fg-2)" }} />
                        <span style={CARD_TITLE}>{c.label}</span>
                      </button>
                    )
                  })}
                </div>

                {categoryObj ? (
                  <div style={{ marginTop: 28, ...FADE_IN(220) }}>
                    <div style={SUB_TITLE}>{`${categoryObj.label} · choose one`}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {categoryObj.subs.map((s) => {
                        const on = sub === s
                        return (
                          <button
                            key={s}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setSub(s)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              height: 36,
                              padding: "0 14px",
                              border: 0,
                              borderRadius: 999,
                              font: "500 14px/1 " + SANS,
                              cursor: "pointer",
                              transition: "background 140ms var(--ease-out)",
                              ...choiceStyle(on),
                            }}
                          >
                            {s}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {step === 2 ? (
              <div style={FADE_IN(260)}>
                <span style={STEP_KICKER}>Step 02 / 03</span>
                <h1 className="text-balance" style={HEADING}>
                  When do you need <em style={EM}>it</em>?
                </h1>
                <p style={{ margin: "12px 0 0", color: "var(--fg-2)" }}>Specialists see this before they send you an offer.</p>

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
                        className="pt-card"
                        aria-pressed={on}
                        onClick={() => setWhen(w.id)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 6,
                          padding: 18,
                          border: 0,
                          borderRadius: 14,
                          textAlign: "left",
                          cursor: "pointer",
                          color: "var(--fg-1)",
                          ...cardStyle(on),
                        }}
                      >
                        <Icon size={18} strokeWidth={1.5} style={{ color: on ? GREEN : "var(--fg-2)", marginBottom: 8 }} />
                        <span style={CARD_TITLE}>{w.label}</span>
                        <span style={{ ...SMALL, color: "var(--fg-3)" }}>{w.hint}</span>
                      </button>
                    )
                  })}
                </div>

                {when === "date" ? (
                  <div style={{ marginTop: 32, ...FADE_IN(220) }}>
                    <div style={SUB_TITLE}>Pick a day</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
                      {dayList.map((d, i) => {
                        const on = day === i
                        return (
                          <button
                            key={i}
                            type="button"
                            aria-pressed={on}
                            aria-label={formatDay(d)}
                            onClick={() => setDay(i)}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 6,
                              padding: "10px 0",
                              border: 0,
                              borderRadius: 10,
                              cursor: "pointer",
                              transition: "background 140ms var(--ease-out)",
                              ...choiceStyle(on),
                            }}
                          >
                            <span style={{ ...MICRO, opacity: 0.7 }}>
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
                  <div style={{ marginTop: 28, ...FADE_IN(220) }}>
                    <div style={SUB_TITLE}>Preferred time</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {TIMES.map((tm) => {
                        const on = time === tm.id
                        return (
                          <button
                            key={tm.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setTime(tm.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              height: 40,
                              padding: "0 16px",
                              border: 0,
                              borderRadius: 999,
                              font: "500 14px/1 " + SANS,
                              cursor: "pointer",
                              ...choiceStyle(on),
                            }}
                          >
                            {tm.label}
                            <span style={{ ...MICRO, letterSpacing: "0.06em", opacity: 0.6 }}>{tm.range}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                <div style={{ marginTop: 28 }}>
                  <div style={SUB_TITLE}>Where</div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                    <button
                      type="button"
                      className="pt-chip"
                      onClick={handleDetectLocation}
                      disabled={locating}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        height: 36,
                        padding: "0 14px",
                        border: 0,
                        borderRadius: 999,
                        background: "var(--white)",
                        boxShadow: "inset 0 0 0 1px var(--border-default)",
                        font: "500 14px/1 " + SANS,
                        color: "var(--fg-2)",
                        cursor: locating ? "default" : "pointer",
                      }}
                    >
                      {locating ? <Loader2 size={14} className="animate-spin" /> : <Locate size={14} strokeWidth={1.5} />}
                      Detect my location
                    </button>
                    {location ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "500 14px/1 " + SANS, color: GREEN }}>
                        <MapPin size={14} strokeWidth={1.5} />
                        {location.label || location.city || "Location detected"}
                      </span>
                    ) : null}
                  </div>
                  {locationFailed ? (
                    <p style={{ ...SMALL, margin: "10px 0 0", color: "var(--danger-600)" }}>
                      Could not detect your location. Try again, or enter a city below.
                    </p>
                  ) : null}
                  {location && !location.city ? (
                    <input
                      type="text"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      placeholder="City / area name"
                      aria-label="City or area"
                      style={{
                        display: "block",
                        marginTop: 10,
                        width: "100%",
                        maxWidth: 320,
                        height: 44,
                        boxSizing: "border-box",
                        padding: "0 14px",
                        borderRadius: 14,
                        border: 0,
                        outline: "none",
                        background: "var(--white)",
                        boxShadow: "inset 0 0 0 1px var(--border-default)",
                        fontFamily: SANS,
                        fontSize: 16,
                        color: "var(--fg-1)",
                      }}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div style={FADE_IN(260)}>
                <span style={STEP_KICKER}>Step 03 / 03 · Optional</span>
                <h1 className="text-balance" style={HEADING}>
                  Anything <em style={EM}>else</em> they should know?
                </h1>
                <p style={{ margin: "12px 0 0", color: "var(--fg-2)" }}>
                  More detail means more accurate offers. <span style={{ color: "var(--fg-3)" }}>You can skip this.</span>
                </p>

                <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="pt-details" style={{ ...ROW_LABEL, marginBottom: 4 }}>
                    Describe the task
                  </label>
                  <textarea
                    id="pt-details"
                    rows={6}
                    value={details}
                    onChange={(e) => setDetails(e.target.value.slice(0, DETAILS_MAX))}
                    placeholder="e.g. The tap under the kitchen sink drips constantly. I have a replacement washer but no tools."
                    style={{
                      display: "block",
                      width: "100%",
                      height: 180,
                      boxSizing: "border-box",
                      padding: "16px 18px",
                      borderRadius: 14,
                      border: 0,
                      outline: "none",
                      resize: "none",
                      background: "var(--white)",
                      boxShadow: "var(--shadow-float)",
                      fontFamily: SANS,
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
                  <div style={SUB_TITLE}>Quick add</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {QUICK_ADD.map((label) => (
                      <button
                        key={label}
                        type="button"
                        className="pt-chip"
                        onClick={() =>
                          setDetails((current) => (current ? `${current.replace(/\s*$/, "")}\n` : "") + `${label}: `)
                        }
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
                          font: "500 13px/1 " + SANS,
                          color: "var(--fg-2)",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={13} strokeWidth={1.5} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 28 }}>
                  <label htmlFor="pt-budget" style={{ ...ROW_LABEL, display: "block", marginBottom: 12 }}>
                    Budget (US$)
                  </label>
                  <input
                    id="pt-budget"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 100"
                    style={{
                      display: "block",
                      width: "100%",
                      height: 56,
                      boxSizing: "border-box",
                      padding: "0 18px",
                      borderRadius: 14,
                      border: 0,
                      outline: "none",
                      background: "var(--white)",
                      boxShadow: "var(--shadow-float)",
                      fontFamily: SANS,
                      fontSize: 16,
                      color: "var(--fg-1)",
                    }}
                  />
                  {budgetInvalid ? (
                    <p style={{ ...SMALL, margin: "8px 0 0", color: "var(--danger-600)" }}>Enter a valid amount.</p>
                  ) : null}
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
                    borderRadius: 14,
                    background: "var(--white)",
                    boxShadow: "inset 0 0 0 1px var(--border-default)",
                    cursor: "pointer",
                    color: "var(--fg-1)",
                    transition: "background 140ms var(--ease-out)",
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
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
                      {attachments.length
                        ? `${attachments.length} of ${PHOTO_LIMIT} added · tap to add more`
                        : "Up to 5 images. Helps specialists quote accurately."}
                    </span>
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      void addFiles(e.target.files)
                      e.target.value = ""
                    }}
                  />
                </label>
                {attachError ? (
                  <p style={{ ...SMALL, margin: "8px 0 0", color: "var(--danger-600)" }}>{attachError}</p>
                ) : null}
                {attachments.length > 0 || pendingUploads > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {attachments.map((a, i) => (
                      <div
                        key={a.url}
                        role="img"
                        aria-label={a.image ? "Task photo" : a.name}
                        style={{
                          position: "relative",
                          width: 84,
                          height: 84,
                          borderRadius: 10,
                          background: a.image ? `var(--ink-100) url("${a.url}") center / cover no-repeat` : "var(--ink-100)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 8,
                          boxSizing: "border-box",
                          overflow: "hidden",
                        }}
                      >
                        {!a.image ? (
                          <span style={{ ...MICRO, fontSize: 10, color: "var(--fg-2)", textAlign: "center", overflowWrap: "anywhere" }}>
                            <FileText size={18} strokeWidth={1.5} style={{ display: "block", margin: "0 auto 4px" }} />
                            {a.name}
                          </span>
                        ) : null}
                        <button
                          type="button"
                          aria-label="Remove photo"
                          onClick={() => setAttachments((current) => current.filter((_, k) => k !== i))}
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
                    {pendingUploads > 0
                      ? Array.from({ length: pendingUploads }, (_, i) => (
                          <div
                            key={`pending-${i}`}
                            style={{
                              width: 84,
                              height: 84,
                              borderRadius: 10,
                              background: "var(--ink-100)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--fg-3)",
                            }}
                          >
                            <Loader2 size={18} className="animate-spin" />
                          </div>
                        ))
                      : null}
                  </div>
                ) : null}
              </div>
            ) : null}

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
                  className="pt-ghost"
                  onClick={() => go(step - 1)}
                  style={{
                    height: 52,
                    padding: "0 24px",
                    border: 0,
                    borderRadius: 999,
                    background: "transparent",
                    color: "var(--fg-1)",
                    font: "500 15px/1 " + SANS,
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
              ) : null}
              <span style={{ flex: 1 }} />
              {step === 3 ? (
                <button
                  type="button"
                  className="pt-skip"
                  onClick={() => void submit()}
                  disabled={nextDisabled}
                  style={{
                    height: 52,
                    padding: "0 20px",
                    border: 0,
                    background: "transparent",
                    font: "500 15px/1 " + SANS,
                    color: "var(--fg-2)",
                    cursor: nextDisabled ? "not-allowed" : "pointer",
                    borderRadius: 999,
                  }}
                >
                  Skip &amp; post
                </button>
              ) : null}
              <button
                type="button"
                className="pt-press"
                onClick={next}
                disabled={nextDisabled}
                style={{
                  height: 52,
                  padding: "0 26px",
                  border: 0,
                  borderRadius: 999,
                  background: nextDisabled ? "var(--ink-300)" : GREEN,
                  color: "var(--white)",
                  font: "500 15px/1 " + SANS,
                  letterSpacing: "-0.01em",
                  cursor: nextDisabled ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "background 140ms var(--ease-out)",
                }}
              >
                {step < 3 ? "Continue" : "Post task"}
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowRight size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>

            {submitError ? (
              <p style={{ ...SMALL, margin: "16px 0 0", color: "var(--danger-600)" }}>{submitError}</p>
            ) : null}
            {showSlowHint ? (
              <p style={{ ...SMALL, margin: "8px 0 0", color: "var(--fg-3)" }}>
                Waking up the server — this can take up to a minute on the first request…
              </p>
            ) : null}
          </div>

          <aside
            style={{
              position: "sticky",
              top: 96,
              padding: 28,
              borderRadius: 20,
              background: "var(--white)",
              boxShadow: "var(--shadow-hairline)",
            }}
          >
            <div style={ROW_LABEL}>Your task</div>
            <dl style={{ margin: "20px 0 0", display: "flex", flexDirection: "column" }}>
              {summaryRows.map((row) => {
                const Icon = row.icon
                const color = row.ok ? "var(--fg-1)" : "var(--fg-3)"
                return (
                  <div
                    key={row.key}
                    style={{ display: "flex", gap: 14, padding: "16px 0", borderTop: "1px solid var(--border-hairline)" }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      style={{ color: row.ok ? GREEN : "var(--fg-3)", paddingTop: 2, flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <dt style={ROW_LABEL}>{row.key}</dt>
                      <dd
                        style={{
                          margin: "6px 0 0",
                          fontFamily: SANS,
                          fontWeight: 500,
                          fontSize: 15,
                          lineHeight: 1.4,
                          color,
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
                          font: "500 13px/1 " + SANS,
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
                borderRadius: 10,
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
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 24px" }}>
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              ...FADE_IN(320),
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
            <h1 className="text-balance" style={{ ...HEADING, margin: "28px 0 0" }}>
              Your task is <em style={EM}>live</em>.
            </h1>
            <p className="text-pretty" style={{ margin: "14px 0 0", color: "var(--fg-2)", maxWidth: 400 }}>
              {sentToText} <span style={{ color: "var(--fg-3)" }}>Offers usually start arriving within the hour.</span>
            </p>
            <div
              style={{
                width: "100%",
                marginTop: 32,
                padding: "20px 24px",
                borderRadius: 14,
                background: "var(--white)",
                boxShadow: "var(--shadow-hairline)",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span style={{ ...MICRO, color: "var(--fg-3)" }}>{submitted?.category}</span>
              <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.015em" }}>
                {submitted?.service}
              </span>
              <span style={{ ...SMALL, color: "var(--fg-2)" }}>{submitted?.when}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 28 }}>
              <Link
                href="/dashboard"
                className="pt-primary"
                style={{
                  height: 52,
                  padding: "0 26px",
                  borderRadius: 999,
                  background: GREEN,
                  color: "var(--white)",
                  font: "500 15px/1 " + SANS,
                  letterSpacing: "-0.01em",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                View in my account
              </Link>
              <button
                type="button"
                className="pt-secondary"
                onClick={restart}
                style={{
                  height: 52,
                  padding: "0 26px",
                  border: 0,
                  borderRadius: 999,
                  background: "var(--white)",
                  color: "var(--fg-1)",
                  boxShadow: "inset 0 0 0 1px var(--border-default)",
                  font: "500 15px/1 " + SANS,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
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
