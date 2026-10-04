"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import {
  ArrowLeft,
  ArrowUpRight,
  BadgePercent,
  Briefcase,
  CalendarClock,
  Check,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react"

type Audience = "clients" | "pros"
type Mode = "signin" | "signup" | "reset"
type Step = "form" | "code"

const ICONS: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  lock: Lock,
  "badge-percent": BadgePercent,
  briefcase: Briefcase,
  "calendar-clock": CalendarClock,
  wallet: Wallet,
}

const AUDIENCE: Record<
  Audience,
  {
    accent: string
    accentLight: string
    homeHref: string
    image: string
    imageAlt: string
    eyebrow: string
    h1a: string
    h1em: string
    h1b: string
    formEyebrow: string
    points: { icon: string; label: string }[]
    inTitle: string
    inSub: string
    upTitle: string
    upSub: string
    remember: string
    upCheck: string
    appRole: "client" | "freelancer"
  }
> = {
  clients: {
    accent: "#108600",
    accentLight: "#7BD96B",
    homeHref: "/",
    image: "https://images.pexels.com/photos/7641484/pexels-photo-7641484.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "A cleaning specialist at work in a bright home",
    eyebrow: "For clients",
    h1a: "Get tasks done by",
    h1em: "trusted",
    h1b: " local hands.",
    formEyebrow: "Client account",
    points: [
      { icon: "shield-check", label: "Verified specialists" },
      { icon: "lock", label: "Payments held until you approve" },
      { icon: "badge-percent", label: "Free for clients" },
    ],
    inTitle: "Welcome back.",
    inSub: "Sign in to post tasks and manage your bookings.",
    upTitle: "Create your account.",
    upSub: "Post your first task in under two minutes.",
    remember: "Keep me signed in",
    upCheck: "Send me task updates",
    appRole: "client",
  },
  pros: {
    accent: "#1B3A9E",
    accentLight: "#AFC0F5",
    homeHref: "/professionals",
    image: "https://images.pexels.com/photos/8486966/pexels-photo-8486966.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "A construction professional on site",
    eyebrow: "For specialists",
    h1a: "Be your own",
    h1em: "boss",
    h1b: ". Start earning today.",
    formEyebrow: "Specialist account",
    points: [
      { icon: "briefcase", label: "Free access to new jobs" },
      { icon: "calendar-clock", label: "Work on your own schedule" },
      { icon: "wallet", label: "Get paid securely in the app" },
    ],
    inTitle: "Welcome back.",
    inSub: "Sign in to browse jobs, send offers and track earnings.",
    upTitle: "Register as a specialist.",
    upSub: "Set up your profile and start responding to tasks.",
    remember: "Keep me signed in",
    upCheck: "Notify me about new jobs nearby",
    appRole: "freelancer",
  },
}

const SANS = "var(--font-geist), ui-sans-serif, system-ui, sans-serif"
const MONO = "var(--font-geist-mono), ui-monospace, Menlo, monospace"
const SERIF = "var(--font-instrument-serif), ui-serif, Georgia, serif"

const INK = {
  950: "#0A0A0B",
  800: "#1F1F22",
  600: "#4A4A50",
  500: "#6E6E75",
  400: "#9A9AA0",
  100: "#EFEFF0",
  50: "#F6F6F5",
  paper: "#FBFBFA",
}

function clerkErrorMessage(error: unknown, fallback: string) {
  const first = (error as { errors?: { longMessage?: string; message?: string }[] })?.errors?.[0]
  return first?.longMessage || first?.message || fallback
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: INK[950] }}>{label}</span>
      {children}
      {error ? (
        <span style={{ fontFamily: SANS, fontSize: 12, color: "#C9302C" }}>{error}</span>
      ) : null}
    </label>
  )
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    height: 48,
    width: "100%",
    borderRadius: 10,
    border: 0,
    padding: "0 14px",
    fontFamily: SANS,
    fontSize: 15,
    color: INK[950],
    background: "#FFFFFF",
    boxShadow: hasError ? "inset 0 0 0 1px #C9302C" : "inset 0 0 0 1px rgba(10,10,11,.12)",
    outline: "none",
  }
}

export function AuthScreen({
  mode: initialMode,
  initialAudience = "clients",
}: {
  mode: Mode
  initialAudience?: Audience
}) {
  const router = useRouter()
  const { isLoaded: signInLoaded, signIn, setActive: setActiveSignIn } = useSignIn()
  const { isLoaded: signUpLoaded, signUp, setActive: setActiveSignUp } = useSignUp()

  const [audience, setAudience] = useState<Audience>(initialAudience)
  const [mode, setMode] = useState<Mode>(initialMode)
  const [step, setStep] = useState<Step>("form")
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const hash = (window.location.hash || "").toLowerCase()
    if (hash.includes("pro") || hash.includes("special")) setAudience("pros")
  }, [])

  const v = AUDIENCE[audience]
  const isPro = audience === "pros"
  const signUpMode = mode === "signup"
  const resetMode = mode === "reset"
  const emailOk = /\S+@\S+\.\S+/.test(email)
  const pwOk = resetMode || password.length >= (signUpMode ? 8 : 1)
  const codeOk = code.trim().length >= 4

  const title = resetMode ? "Reset your password." : signUpMode ? v.upTitle : v.inTitle
  const subtitle = resetMode
    ? "Enter your account email and we'll send you a link to choose a new password."
    : signUpMode
      ? v.upSub
      : v.inSub

  const finishSession = async (sessionId: string | null, setActive: ((args: { session: string }) => Promise<void>) | undefined) => {
    if (!sessionId || !setActive) return
    await setActive({ session: sessionId })
    setDone(true)
    router.replace(signUpMode ? "/onboarding" : "/dashboard")
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setStep("form")
    setTried(false)
    setDone(false)
    setServerError(null)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setTried(true)
    setServerError(null)
    if (!emailOk || !pwOk) return
    setBusy(true)
    try {
      if (step === "code") {
        if (!codeOk) return
        if (resetMode) {
          if (!signIn) return
          const result = await signIn.attemptFirstFactor({
            strategy: "reset_password_email_code",
            code: code.trim(),
            password,
          })
          await finishSession(result.createdSessionId, setActiveSignIn)
        } else {
          if (!signUp) return
          const result = await signUp.attemptEmailAddressVerification({ code: code.trim() })
          await finishSession(result.createdSessionId, setActiveSignUp)
        }
        return
      }

      if (resetMode) {
        if (!signIn) return
        await signIn.create({ strategy: "reset_password_email_code", identifier: email })
        setStep("code")
        return
      }

      if (signUpMode) {
        if (!signUp) return
        const [firstName, ...rest] = name.trim().split(/\s+/)
        await signUp.create({
          emailAddress: email,
          password,
          firstName: firstName || undefined,
          lastName: rest.join(" ") || undefined,
          unsafeMetadata: { appRole: v.appRole, phone: phone.trim() || undefined },
        })
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
        setStep("code")
        return
      }

      if (!signIn) return
      const result = await signIn.create({ identifier: email, password })
      if (result.status === "complete") {
        await finishSession(result.createdSessionId, setActiveSignIn)
      } else {
        setServerError("Additional verification is required to sign in.")
      }
    } catch (error) {
      setServerError(clerkErrorMessage(error, "Something went wrong. Please try again."))
    } finally {
      setBusy(false)
    }
  }

  const onGoogle = async () => {
    setServerError(null)
    try {
      if (signUpMode) {
        if (!signUp) return
        await signUp.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/onboarding",
          unsafeMetadata: { appRole: v.appRole },
        })
      } else {
        if (!signIn) return
        await signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard",
        })
      }
    } catch (error) {
      setServerError(clerkErrorMessage(error, "Google sign-in is unavailable right now."))
    }
  }

  const loaded = signInLoaded && signUpLoaded
  const submitLabel = step === "code"
    ? "Confirm"
    : resetMode
      ? "Send reset link"
      : signUpMode
        ? isPro
          ? "Register"
          : "Create account"
        : "Sign in"

  const submittedMessage = step === "code"
    ? resetMode
      ? "We've sent a code to " + email + ". Enter it with your new password."
      : "Check your inbox for a code to confirm " + email + "."
    : done
      ? "Signed in. Redirecting…"
      : ""

  const switchPrompt = resetMode
    ? "Remembered it?"
    : signUpMode
      ? "Already have an account?"
      : isPro
        ? "New to QuickHands Pro?"
        : "New to QuickHands?"
  const switchCta = resetMode
    ? "Back to sign in"
    : signUpMode
      ? "Sign in"
      : isPro
        ? "Register as a specialist"
        : "Create an account"

  return (
    <div
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: 16,
        background: INK.paper,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
        gap: 16,
        fontFamily: SANS,
        color: INK[950],
      }}
    >
      <aside
        style={{
          position: "relative",
          minHeight: 640,
          borderRadius: 20,
          overflow: "hidden",
          background: INK[950],
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(28px, 4vw, 48px)",
        }}
      >
        <div
          role="img"
          aria-label={v.imageAlt}
          style={{
            position: "absolute",
            inset: 0,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url("${v.image}")`,
            filter: "saturate(.7) contrast(1.02)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,11,.55) 0%, rgba(10,10,11,.15) 38%, rgba(10,10,11,.82) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <Link href={v.homeHref} style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none", color: "#FFFFFF" }}>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, lineHeight: 1, letterSpacing: "-0.05em" }}>
              quickhands
            </span>
            {isPro ? (
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#AFC0F5" }}>
                Pro
              </span>
            ) : null}
          </Link>
          <Link
            href={v.homeHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 32,
              padding: "0 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,.12)",
              color: "#FFFFFF",
              textDecoration: "none",
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to site
          </Link>
        </div>
        <div style={{ position: "relative", marginTop: "auto", display: "flex", flexDirection: "column", gap: 28 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.72)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.accentLight }} />
            {v.eyebrow}
          </span>
          <h1
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: "clamp(44px, 5.4vw, 72px)",
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
              margin: 0,
              maxWidth: 560,
              textWrap: "balance",
            }}
          >
            {v.h1a}{" "}
            <em style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: v.accentLight }}>
              {v.h1em}
            </em>
            {v.h1b}
          </h1>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              borderTop: "1px solid rgba(255,255,255,.18)",
            }}
          >
            {v.points.map((point) => {
              const Icon = ICONS[point.icon]
              return (
                <li key={point.label} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "18px 16px 0 0" }}>
                  <Icon size={18} color={v.accentLight} aria-hidden="true" />
                  <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 14, lineHeight: 1.35, letterSpacing: "-0.015em", color: "rgba(255,255,255,.88)" }}>
                    {point.label}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          background: "#FFFFFF",
          boxShadow: "0 0 0 1px rgba(10,10,11,.08)",
          padding: "clamp(24px, 4vw, 48px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            role="radiogroup"
            aria-label="Account type"
            style={{ display: "inline-flex", padding: 3, borderRadius: 999, background: INK[50], gap: 2 }}
          >
            {(
              [
                { value: "clients", label: "Client" },
                { value: "pros", label: "Specialist" },
              ] as const
            ).map((option) => {
              const active = audience === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setAudience(option.value)
                    setTried(false)
                    setDone(false)
                    setServerError(null)
                  }}
                  style={{
                    height: 28,
                    padding: "0 14px",
                    borderRadius: 999,
                    border: 0,
                    cursor: "pointer",
                    fontFamily: SANS,
                    fontSize: 13,
                    fontWeight: 500,
                    background: active ? "#FFFFFF" : "transparent",
                    color: active ? INK[950] : INK[500],
                    boxShadow: active ? "0 0 0 1px rgba(10,10,11,.08)" : "none",
                  }}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
          <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: v.accent }}>
              {v.formEyebrow}
            </span>
            <h2 style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.035em", margin: "14px 0 0", textWrap: "balance" }}>
              {title}
            </h2>
            <p style={{ margin: "10px 0 0", color: INK[600], textWrap: "pretty" }}>{subtitle}</p>

            {!resetMode && step === "form" ? (
              <>
                <button
                  type="button"
                  onClick={onGoogle}
                  disabled={!loaded || busy}
                  style={{
                    marginTop: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    height: 48,
                    border: 0,
                    borderRadius: 999,
                    background: "#FFFFFF",
                    boxShadow: "inset 0 0 0 1px rgba(10,10,11,.12)",
                    fontFamily: SANS,
                    fontWeight: 500,
                    fontSize: 15,
                    color: INK[950],
                    cursor: "pointer",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
                  </svg>
                  Continue with Google
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0", fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: INK[400] }}>
                  <span style={{ flex: 1, height: 1, background: "rgba(10,10,11,.08)" }} />
                  or with email
                  <span style={{ flex: 1, height: 1, background: "rgba(10,10,11,.08)" }} />
                </div>
              </>
            ) : (
              <div style={{ height: 28 }} />
            )}

            <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {signUpMode && step === "form" ? (
                <>
                  <Field label="Full name">
                    <input
                      style={inputStyle(false)}
                      placeholder="Your full name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Phone number">
                    <input
                      style={inputStyle(false)}
                      type="tel"
                      placeholder="+263 77 123 4567"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      autoComplete="tel"
                    />
                  </Field>
                </>
              ) : null}

              {step === "form" ? (
                <Field label="Email" error={tried && !emailOk ? "Enter a valid email address." : undefined}>
                  <input
                    style={inputStyle(tried && !emailOk)}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                </Field>
              ) : null}

              {step === "code" ? (
                <Field label="Verification code" error={tried && !codeOk ? "Enter the code from your email." : undefined}>
                  <input
                    style={inputStyle(tried && !codeOk)}
                    inputMode="numeric"
                    placeholder="123456"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    autoComplete="one-time-code"
                  />
                </Field>
              ) : null}

              {!(signUpMode && step === "code") ? (
                <div style={{ position: "relative" }}>
                  <Field
                    label={resetMode ? "New password" : "Password"}
                    error={tried && !pwOk ? (signUpMode ? "Use at least 8 characters." : "Enter your password.") : undefined}
                  >
                    <input
                      style={{ ...inputStyle(tried && !pwOk), paddingRight: 52 }}
                      type={showPw ? "text" : "password"}
                      placeholder={signUpMode || resetMode ? "At least 8 characters" : "Your password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete={signUpMode || resetMode ? "new-password" : "current-password"}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => setShowPw((current) => !current)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: 6,
                      top: 32,
                      width: 36,
                      height: 36,
                      border: 0,
                      borderRadius: 10,
                      background: "transparent",
                      color: INK[400],
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    {showPw ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </button>
                </div>
              ) : null}

              {step === "form" && !resetMode ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: INK[600] }}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={remember}
                      onClick={() => setRemember((current) => !current)}
                      style={{
                        width: 18,
                        height: 18,
                        padding: 0,
                        border: 0,
                        borderRadius: 5,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        background: remember ? v.accent : "#FFFFFF",
                        boxShadow: remember ? "none" : "inset 0 0 0 1px rgba(10,10,11,.12)",
                        color: "#FFFFFF",
                      }}
                    >
                      {remember ? <Check size={12} aria-hidden="true" /> : null}
                    </button>
                    {signUpMode ? v.upCheck : v.remember}
                  </label>
                  {!signUpMode ? (
                    <button
                      type="button"
                      onClick={() => switchMode("reset")}
                      style={{ background: "none", border: 0, padding: 0, fontFamily: SANS, fontWeight: 500, fontSize: 13, color: INK[950], cursor: "pointer" }}
                    >
                      Forgot password?
                    </button>
                  ) : null}
                </div>
              ) : null}

              {serverError ? (
                <p role="alert" style={{ margin: 0, fontSize: 13, color: "#C9302C" }}>
                  {serverError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={busy || !loaded}
                style={{
                  marginTop: 8,
                  height: 52,
                  border: 0,
                  borderRadius: 999,
                  background: v.accent,
                  color: "#FFFFFF",
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: 15,
                  letterSpacing: "-0.015em",
                  cursor: busy ? "wait" : "pointer",
                  opacity: busy || !loaded ? 0.7 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {submitLabel}
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>

              {signUpMode && step === "form" ? (
                <p style={{ margin: 0, fontSize: 13, color: INK[400], textAlign: "center", textWrap: "pretty" }}>
                  By creating an account you agree to our{" "}
                  <Link href="/legal#terms" style={{ color: INK[600] }}>
                    Terms of service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" style={{ color: INK[600] }}>
                    Privacy policy
                  </Link>
                  .
                </p>
              ) : null}
            </form>

            {submittedMessage ? (
              <div
                role="status"
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: INK[50],
                  fontSize: 13,
                  color: INK[600],
                }}
              >
                <Check size={14} aria-hidden="true" color={v.accent} />
                {submittedMessage}
              </div>
            ) : null}

            <p
              style={{
                margin: "28px 0 0",
                paddingTop: 24,
                borderTop: "1px solid rgba(10,10,11,.08)",
                fontSize: 13,
                color: INK[600],
                textAlign: "center",
              }}
            >
              {switchPrompt}{" "}
              <button
                type="button"
                onClick={() => switchMode(resetMode ? "signin" : signUpMode ? "signin" : "signup")}
                style={{ background: "none", border: 0, padding: 0, fontFamily: SANS, fontWeight: 500, color: INK[950], cursor: "pointer" }}
              >
                {switchCta}
              </button>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: INK[400] }}>
          <span>© 2026 Quickhands, Inc.</span>
          <span style={{ display: "flex", gap: 16 }}>
            <Link href="/legal#terms" style={{ color: "inherit", textDecoration: "none" }}>
              Terms
            </Link>
            <Link href="/privacy-policy" style={{ color: "inherit", textDecoration: "none" }}>
              Privacy
            </Link>
            <a href="mailto:support@quickhands.com" style={{ color: "inherit", textDecoration: "none" }}>
              Support
            </a>
          </span>
        </div>
      </main>
    </div>
  )
}
