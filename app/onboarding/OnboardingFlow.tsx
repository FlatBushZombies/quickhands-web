"use client"

import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {
  Briefcase,
  Wrench,
  Zap,
  Sparkles,
  Hammer,
  PaintBucket,
  Truck,
  Grid2x2,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { authFontClassName } from "@/components/auth/fonts"
import { ensureBackendUser, updateOnboarding, type AppRole } from "@/lib/user-api"

// Same field set/labels as freelance-app's app/(auth)/onboarding.tsx, for
// backend data parity — a specialist's skills/experience/rate are read by
// the marketplace's job-matching logic regardless of which app wrote them.
const SKILL_OPTIONS = [
  { label: "Plumbing", Icon: Wrench },
  { label: "Electrical", Icon: Zap },
  { label: "Cleaning", Icon: Sparkles },
  { label: "Carpentry", Icon: Hammer },
  { label: "Painting", Icon: PaintBucket },
  { label: "Moving", Icon: Truck },
  { label: "Other", Icon: Grid2x2 },
] as const

const EXPERIENCE_LEVELS = [
  { label: "Beginner", subtitle: "0-2 years", value: "Beginner (0-2 years)" },
  { label: "Intermediate", subtitle: "2-5 years", value: "Intermediate (2-5 years)" },
  { label: "Expert", subtitle: "5+ years", value: "Expert (5+ years)" },
] as const

type Step = "role" | "client-confirm" | "freelancer-details"

// Accents from the artifact design: client-side green, specialist-side blue.
const GREEN = "#108600"
const GREEN_HOVER = "#0D6E00"
const BLUE = "#1B3A9E"
const BLUE_HOVER = "#162F80"

/*
 * Design tokens and hover/focus states, scoped to .qh-onb. Values are copied
 * from the auth screen (components/auth/AuthScreen.tsx) so the onboarding
 * flow reads as part of the same system.
 */
const ONB_CSS = `
.qh-onb{
--ink-950:#0A0A0B;--ink-600:#4A4A50;--ink-500:#6E6E75;--ink-400:#9A9AA0;--ink-50:#F6F6F5;
--paper:#FBFBFA;--white:#FFFFFF;--signal-500:#2F54FF;--danger-600:#C9302C;
--fg-1:var(--ink-950);--fg-2:var(--ink-600);--fg-3:var(--ink-400);
--border-hairline:rgba(10,10,11,.08);--border-default:rgba(10,10,11,.12);
--radius-md:10px;--radius-xl:20px;--radius-pill:999px;
--shadow-hairline:0 0 0 1px var(--border-hairline);
--shadow-inset:inset 0 0 0 1px var(--border-default);
--ease-out:cubic-bezier(.22,1,.36,1);--dur-fast:140ms;--dur-slow:480ms;
--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif;
--font-mono:var(--font-geist-mono),ui-monospace,Menlo,monospace;
--font-serif:var(--font-instrument-serif),ui-serif,Georgia,serif;
--text-micro:400 11px/1.3 var(--font-mono);
--text-small:400 13px/1.45 var(--font-sans);
--text-body-md:400 15px/1.55 var(--font-sans);
--text-h2:500 44px/1.05 var(--font-sans);
--ls-heading:-0.035em;--ls-tight:-0.015em;--ls-body:-0.005em;--ls-mono:0.06em;
font:var(--text-body-md);letter-spacing:var(--ls-body);color:var(--fg-1);
-webkit-font-smoothing:antialiased;
}
.qh-onb :focus-visible{outline:2px solid var(--signal-500);outline-offset:2px}
.qh-onb ::selection{background:var(--ink-950);color:var(--white)}
.qh-onb .qh-input::placeholder{color:var(--fg-3);opacity:1}
.qh-onb .qh-card,.qh-onb .qh-chip,.qh-onb .qh-primary,.qh-onb .qh-secondary{transition:background var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out),filter var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)}
.qh-onb .qh-card{background:var(--white);box-shadow:var(--shadow-hairline);color:var(--fg-1)}
.qh-onb .qh-card:hover{background:var(--ink-50);box-shadow:inset 0 0 0 1px var(--accent)}
.qh-onb .qh-card:active{transform:scale(.99)}
.qh-onb .qh-chip{background:var(--white);box-shadow:var(--shadow-inset);color:var(--fg-1)}
.qh-onb .qh-chip:hover{background:var(--ink-50)}
.qh-onb .qh-chip[aria-pressed="true"]{background:var(--accent-tint);box-shadow:inset 0 0 0 1.5px var(--accent);color:var(--accent)}
.qh-onb .qh-primary{background:var(--accent);color:var(--white)}
.qh-onb .qh-primary:hover:not(:disabled){background:var(--accent-hover)}
.qh-onb .qh-primary:active:not(:disabled){transform:scale(.98)}
.qh-onb .qh-secondary{background:var(--white);box-shadow:var(--shadow-inset);color:var(--fg-1)}
.qh-onb .qh-secondary:hover:not(:disabled){background:var(--ink-50)}
.qh-onb .qh-secondary:active:not(:disabled){transform:scale(.98)}
.qh-onb .qh-primary:disabled,.qh-onb .qh-secondary:disabled{opacity:.45;cursor:not-allowed}
.qh-onb .qh-anim{animation:qhFade 260ms var(--ease-out) both}
@keyframes qhFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
`

const H_TITLE: CSSProperties = {
  font: "var(--text-h2)",
  fontSize: "clamp(32px, 4.6vw, 40px)",
  letterSpacing: "var(--ls-heading)",
  margin: "14px 0 0",
  textWrap: "balance",
}
const SERIF_EM: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 400,
  letterSpacing: "-0.02em",
}
const SUB: CSSProperties = { margin: "10px 0 0", color: "var(--fg-2)", textWrap: "pretty" }
const LABEL: CSSProperties = { font: "500 13px/18px var(--font-sans)", color: "var(--fg-1)" }
const ERROR: CSSProperties = {
  margin: "16px 0 0",
  font: "var(--text-small)",
  color: "var(--danger-600)",
  textWrap: "pretty",
}
const INPUT: CSSProperties = {
  height: 48,
  boxSizing: "border-box",
  width: "100%",
  margin: 0,
  padding: "0 14px",
  border: 0,
  borderRadius: "var(--radius-md)",
  background: "var(--white)",
  boxShadow: "var(--shadow-inset)",
  font: "400 15px/1 var(--font-sans)",
  letterSpacing: "var(--ls-body)",
  color: "var(--fg-1)",
}
const BUTTON_BASE: CSSProperties = {
  height: 52,
  padding: "0 24px",
  border: 0,
  borderRadius: "var(--radius-pill)",
  font: "500 15px/1 var(--font-sans)",
  letterSpacing: "-0.01em",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
}
const CHIP: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  minHeight: 44,
  padding: "10px 14px",
  border: 0,
  borderRadius: "var(--radius-md)",
  font: "500 14px/1.2 var(--font-sans)",
  letterSpacing: "var(--ls-tight)",
  cursor: "pointer",
  textAlign: "left",
}
const GROUP: CSSProperties = {
  display: "grid",
  gap: 8,
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 108px), 1fr))",
}

function Eyebrow({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      style={{
        font: "var(--text-micro)",
        letterSpacing: "var(--ls-mono)",
        textTransform: "uppercase",
        color,
      }}
    >
      {children}
    </span>
  )
}

export default function OnboardingFlow() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [step, setStep] = useState<Step>("role")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState("")
  const [experienceLevel, setExperienceLevel] = useState<string>("")
  const [hourlyRate, setHourlyRate] = useState("")

  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.completedOnboarding === true) {
      router.replace("/dashboard")
    }
  }, [isLoaded, user, router])

  if (!isLoaded || !user) {
    return (
      <div
        className={authFontClassName}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBFBFA",
        }}
      >
        <Loader2 size={24} strokeWidth={1.5} className="animate-spin" style={{ color: "#6E6E75" }} aria-label="Loading" />
      </div>
    )
  }

  const toggleSkill = (label: string) => {
    setSelectedSkills((current) =>
      current.includes(label) ? current.filter((s) => s !== label) : [...current, label]
    )
  }

  const hasAnySkill =
    selectedSkills.filter((s) => s !== "Other").length > 0 || (selectedSkills.includes("Other") && customSkill.trim().length > 0)
  const isFreelancerFormValid =
    hasAnySkill && experienceLevel.length > 0 && hourlyRate.trim().length > 0 && !isNaN(parseFloat(hourlyRate)) && parseFloat(hourlyRate) > 0

  const finishAs = async (appRole: AppRole) => {
    setSubmitting(true)
    setError(null)

    try {
      if (appRole === "client") {
        await user.update({ unsafeMetadata: { appRole, completedOnboarding: true } })
        // Fire-and-forget: the client's backend row has nothing else to
        // capture at signup, and a sync hiccup here shouldn't block someone
        // who's already confirmed their Clerk-side onboarding.
        void ensureBackendUser(
          { id: user.id, fullName: user.fullName, imageUrl: user.imageUrl, primaryEmailAddress: user.primaryEmailAddress },
          appRole
        ).catch((syncError) => console.error("Backend user sync failed:", syncError))
      } else {
        const skillsValue = [...selectedSkills.filter((s) => s !== "Other"), customSkill.trim()]
          .filter(Boolean)
          .join(", ")

        // Awaited, not fire-and-forget — match.service.js's job-matching
        // logic reads skills/experienceLevel/hourlyRate directly, so a
        // specialist whose backend sync silently failed would never
        // actually receive job notifications.
        await updateOnboarding({
          clerkId: user.id,
          name: user.fullName || undefined,
          skills: skillsValue,
          experienceLevel,
          hourlyRate: parseFloat(hourlyRate),
          completedOnboarding: true,
          appRole,
        })
        await user.update({ unsafeMetadata: { appRole, completedOnboarding: true } })
      }

      router.replace("/dashboard")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  // Blue for the specialist-side form once the role is known; green everywhere else.
  const accent = step === "freelancer-details" ? BLUE : GREEN
  const accentHover = step === "freelancer-details" ? BLUE_HOVER : GREEN_HOVER
  const rootVars = {
    "--accent": accent,
    "--accent-hover": accentHover,
    "--accent-tint": `${accent}14`,
  } as CSSProperties

  const backButton = (
    <button
      type="button"
      className="qh-secondary"
      onClick={() => setStep("role")}
      disabled={submitting}
      style={{ ...BUTTON_BASE, flex: "0 0 auto" }}
    >
      Back
    </button>
  )

  return (
    <div
      className={`qh-onb ${authFontClassName}`}
      style={{
        ...rootVars,
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: 16,
        background: "var(--paper)",
      }}
    >
      <style>{ONB_CSS}</style>

      <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ padding: "8px 8px 0" }}>
          <span style={{ font: "600 22px/1 var(--font-sans)", letterSpacing: "-0.05em", color: "var(--fg-1)" }}>
            quickhands
          </span>
        </div>

        <main
          style={{
            borderRadius: "var(--radius-xl)",
            background: "var(--white)",
            boxShadow: "var(--shadow-hairline)",
            padding: "clamp(24px, 4vw, 48px)",
          }}
        >
          <div key={step} className="qh-anim">
            {step === "role" ? (
              <>
                <Eyebrow color={GREEN}>Get started</Eyebrow>
                <h1 style={H_TITLE}>
                  Welcome to <em style={SERIF_EM}>Quickhands</em>
                </h1>
                <p style={SUB}>How do you want to use Quickhands?</p>

                <div
                  style={{
                    marginTop: 32,
                    display: "grid",
                    gap: 16,
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setStep("client-confirm")}
                    className="qh-card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 14,
                      padding: 24,
                      border: 0,
                      borderRadius: "var(--radius-xl)",
                      textAlign: "left",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${GREEN}14`,
                        color: GREEN,
                      }}
                    >
                      <Briefcase size={20} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span style={{ font: "500 18px/1.2 var(--font-sans)", letterSpacing: "var(--ls-tight)" }}>
                      Hire specialists
                    </span>
                    <span style={{ font: "var(--text-small)", color: "var(--fg-2)" }}>
                      Post jobs and find help for tasks around you.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("freelancer-details")}
                    className="qh-card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 14,
                      padding: 24,
                      border: 0,
                      borderRadius: "var(--radius-xl)",
                      textAlign: "left",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${GREEN}14`,
                        color: GREEN,
                      }}
                    >
                      <Wrench size={20} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span style={{ font: "500 18px/1.2 var(--font-sans)", letterSpacing: "var(--ls-tight)" }}>
                      Find work
                    </span>
                    <span style={{ font: "var(--text-small)", color: "var(--fg-2)" }}>
                      Browse jobs and apply as a specialist.
                    </span>
                  </button>
                </div>
              </>
            ) : step === "client-confirm" ? (
              <>
                <Eyebrow color={accent}>Client account</Eyebrow>
                <h2 style={H_TITLE}>
                  Setting up your <em style={SERIF_EM}>Client</em> account
                </h2>
                <p style={SUB}>You&apos;ll be able to post jobs and review applications from specialists.</p>

                {error ? (
                  <p role="alert" style={ERROR}>
                    {error}
                  </p>
                ) : null}

                <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                  {backButton}
                  <button
                    type="button"
                    className="qh-primary"
                    onClick={() => finishAs("client")}
                    disabled={submitting}
                    style={{ ...BUTTON_BASE, flex: 1, minWidth: 0 }}
                  >
                    {submitting ? <Loader2 size={16} strokeWidth={1.5} className="animate-spin" aria-hidden="true" /> : "Continue"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Eyebrow color={accent}>Specialist account</Eyebrow>
                <h2 style={H_TITLE}>
                  Tell us about your <em style={SERIF_EM}>skills</em>
                </h2>
                <p style={SUB}>This helps clients find you for the right jobs.</p>

                <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 24 }}>
                  <div role="group" aria-labelledby="onb-skills-label" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <span id="onb-skills-label" style={LABEL}>
                      What do you specialize in?
                    </span>
                    <div style={GROUP}>
                      {SKILL_OPTIONS.map(({ label, Icon }) => {
                        const selected = selectedSkills.includes(label)
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => toggleSkill(label)}
                            aria-pressed={selected}
                            className="qh-chip"
                            style={CHIP}
                          >
                            <Icon size={16} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
                            {label}
                          </button>
                        )
                      })}
                    </div>

                    {selectedSkills.includes("Other") ? (
                      <input
                        type="text"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        placeholder="What else do you do?"
                        className="qh-input"
                        style={{ ...INPUT, marginTop: 4 }}
                      />
                    ) : null}
                  </div>

                  <div role="group" aria-labelledby="onb-experience-label" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <span id="onb-experience-label" style={LABEL}>
                      Experience level
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {EXPERIENCE_LEVELS.map((level) => {
                        const selected = experienceLevel === level.value
                        return (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => setExperienceLevel(level.value)}
                            aria-pressed={selected}
                            className="qh-chip"
                            style={{ ...CHIP, justifyContent: "space-between", minHeight: 52 }}
                          >
                            <span>{level.label}</span>
                            <span
                              style={{
                                font: "var(--text-small)",
                                color: selected ? "inherit" : "var(--fg-2)",
                                opacity: selected ? 0.75 : 1,
                              }}
                            >
                              {level.subtitle}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label htmlFor="hourlyRate" style={LABEL}>
                      Hourly rate (US$)
                    </label>
                    <input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="e.g. 25"
                      className="qh-input"
                      style={INPUT}
                    />
                  </div>
                </div>

                {error ? (
                  <p role="alert" style={ERROR}>
                    {error}
                  </p>
                ) : null}

                <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                  {backButton}
                  <button
                    type="button"
                    className="qh-primary"
                    onClick={() => finishAs("freelancer")}
                    disabled={submitting || !isFreelancerFormValid}
                    style={{ ...BUTTON_BASE, flex: 1, minWidth: 0 }}
                  >
                    {submitting ? <Loader2 size={16} strokeWidth={1.5} className="animate-spin" aria-hidden="true" /> : "Finish setup"}
                    {!submitting ? <CheckCircle2 size={16} strokeWidth={1.5} aria-hidden="true" /> : null}
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
