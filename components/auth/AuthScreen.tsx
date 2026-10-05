"use client"

import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type FormEvent,
  type InputHTMLAttributes,
  type MouseEvent,
} from "react"
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
type Step = "form" | "verify"

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

const AUDIENCE_OPTIONS: { value: Audience; label: string }[] = [
  { value: "clients", label: "Client" },
  { value: "pros", label: "Specialist" },
]

const GOOGLE_NOTICE = "Signed in with Google. Redirecting…"
const SIGNED_IN_NOTICE = "Signed in. Redirecting to your dashboard…"
const REDIRECT_DELAY_MS = 900

// Email and password sign-in and sign-up are paused. The fields and submit
// stay rendered exactly as designed but are disabled. Google sign-in is live.
const EMAIL_AUTH_ENABLED = false

/*
 * Design tokens and the few hover, active and focus states the design applies
 * through style-hover / style-active. Scoped to .qh-auth so nothing leaks into
 * the rest of the app. Values are copied from the design's <style> blocks.
 */
const AUTH_CSS = `
.qh-auth{
--ink-950:#0A0A0B;--ink-600:#4A4A50;--ink-500:#6E6E75;--ink-400:#9A9AA0;--ink-100:#EFEFF0;--ink-50:#F6F6F5;
--paper:#FBFBFA;--white:#FFFFFF;--signal-500:#2F54FF;--danger-600:#C9302C;
--fg-1:var(--ink-950);--fg-2:var(--ink-600);--fg-3:var(--ink-400);
--surface-sunken:var(--ink-50);
--border-hairline:rgba(10,10,11,.08);--border-default:rgba(10,10,11,.12);--border-strong:rgba(10,10,11,.24);
--radius-md:10px;--radius-xl:20px;--radius-pill:999px;
--shadow-sm:0 1px 2px rgba(10,10,11,.04),0 0 0 1px var(--border-hairline);
--shadow-hairline:0 0 0 1px var(--border-hairline);
--shadow-inset:inset 0 0 0 1px var(--border-default);
--ease-out:cubic-bezier(.22,1,.36,1);--dur-fast:140ms;--dur-slow:480ms;
--focus-ring:var(--signal-500);
--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif;
--font-mono:var(--font-geist-mono),ui-monospace,Menlo,monospace;
--font-serif:var(--font-instrument-serif),ui-serif,Georgia,serif;
--text-micro:400 11px/1.3 var(--font-mono);
--text-small:400 13px/1.45 var(--font-sans);
--text-body-md:400 15px/1.55 var(--font-sans);
--text-h2:500 44px/1.05 var(--font-sans);
--text-display:500 88px/0.98 var(--font-sans);
--ls-display:-0.045em;--ls-heading:-0.035em;--ls-tight:-0.015em;--ls-body:-0.005em;--ls-mono:0.06em;
font:var(--text-body-md);letter-spacing:var(--ls-body);color:var(--fg-1);
-webkit-font-smoothing:antialiased;
}
.qh-auth a{color:var(--fg-1);text-decoration:underline;text-decoration-color:var(--border-strong);text-underline-offset:3px;transition:text-decoration-color var(--dur-fast) var(--ease-out)}
.qh-auth a:hover{text-decoration-color:currentColor}
.qh-auth :focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}
.qh-auth ::selection{background:var(--ink-950);color:var(--white)}
.qh-auth .qh-input::placeholder{color:var(--fg-3);opacity:1}
.qh-auth .qh-back{transition:background var(--dur-fast) var(--ease-out)}
.qh-auth .qh-back:hover{background:rgba(255,255,255,.2)}
.qh-auth .qh-google{transition:background var(--dur-fast) var(--ease-out)}
.qh-auth .qh-google:hover{background:var(--ink-50)}
.qh-auth .qh-google:active{transform:scale(0.98)}
.qh-auth .qh-eye{transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)}
.qh-auth .qh-eye:hover{color:var(--fg-1);background:var(--ink-50)}
.qh-auth .qh-submit{transition:filter var(--dur-fast) var(--ease-out)}
.qh-auth .qh-submit:hover:not(:disabled){filter:brightness(.88)}
.qh-auth .qh-submit:active:not(:disabled){transform:scale(0.98)}
.qh-auth .qh-footer-link{color:inherit;text-decoration:none}
.qh-auth .qh-footer-link:hover{color:var(--fg-1)}
.qh-auth .qh-check{transition:background var(--dur-fast) var(--ease-out)}
.qh-auth .qh-anim{animation:qhFade 260ms var(--ease-out) both}
@keyframes qhFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
`

function clerkErrorMessage(error: unknown, fallback: string) {
  const first = (error as { errors?: { longMessage?: string; message?: string }[] })?.errors?.[0]
  return first?.longMessage || first?.message || fallback
}

type AuthInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "style"> & {
  label: string
  error?: string
}

/** The design system Input, reconstructed from the template: 18px label, 8px gap, 48px field. */
function AuthInput({ label, error, id: idProp, ...props }: AuthInputProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const errorId = `${id}-error`
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <label htmlFor={id} style={{ font: "500 13px/18px var(--font-sans)", color: "var(--fg-1)" }}>
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="qh-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        style={{
          height: 48,
          boxSizing: "border-box",
          width: "100%",
          margin: 0,
          padding: "0 14px",
          border: 0,
          borderRadius: "var(--radius-md)",
          background: "var(--white)",
          boxShadow: error ? "inset 0 0 0 1px var(--danger-600)" : "var(--shadow-inset)",
          font: "400 15px/1 var(--font-sans)",
          letterSpacing: "var(--ls-body)",
          color: "var(--fg-1)",
        }}
      />
      {error ? (
        <span id={errorId} style={{ font: "var(--text-small)", color: "var(--danger-600)" }}>
          {error}
        </span>
      ) : null}
    </div>
  )
}

/** The design system Segmented control, reconstructed from the template: 230 x 28 pill. */
function AudienceSegmented({
  value,
  onChange,
}: {
  value: Audience
  onChange: (next: Audience) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Account type"
      style={{
        display: "inline-flex",
        width: 230,
        maxWidth: "100%",
        height: 28,
        boxSizing: "border-box",
        padding: 2,
        borderRadius: "var(--radius-pill)",
        background: "var(--surface-sunken)",
      }}
    >
      {AUDIENCE_OPTIONS.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            style={{
              flex: 1,
              height: "100%",
              padding: "0 12px",
              border: 0,
              borderRadius: "var(--radius-pill)",
              background: active ? "var(--white)" : "transparent",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              color: active ? "var(--fg-1)" : "var(--fg-2)",
              font: "500 13px/1 var(--font-sans)",
              cursor: "pointer",
              transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

const ROW_LINK: CSSProperties = { font: "500 13px/1 var(--font-sans)", color: "var(--fg-1)" }

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
  const [postNote, setPostNote] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  // Hash presets from the design: #pro / #special, #signup / #register, #post.
  useEffect(() => {
    const hash = (window.location.hash || "").toLowerCase()
    if (hash.includes("pro") || hash.includes("special")) setAudience("pros")
    if (hash.includes("signup") || hash.includes("register")) setMode("signup")
    if (hash.includes("post")) setPostNote(true)
  }, [])

  const v = AUDIENCE[audience]
  const isPro = audience === "pros"
  const signUpMode = mode === "signup"
  const resetMode = mode === "reset"
  const signInMode = mode === "signin"
  const isFormStep = step === "form"
  const isVerify = step === "verify"

  // Which fields the current step shows.
  const showName = isFormStep && signUpMode
  const showEmail = isFormStep
  const showCode = isVerify
  const showPassword = resetMode ? isVerify : isFormStep
  const showGoogle = isFormStep && !resetMode
  const showRemember = isFormStep && !resetMode
  const showForgot = showRemember && signInMode
  const showTerms = isFormStep && signUpMode

  const emailOk = /\S+@\S+\.\S+/.test(email)
  const pwMin = signUpMode || resetMode ? 8 : 1
  const pwOk = !showPassword || password.length >= pwMin
  const codeOk = !showCode || code.trim().length >= 4
  const emailValid = !showEmail || emailOk

  const emailError = tried && showEmail && !emailOk ? "Enter a valid email address." : undefined
  const pwError =
    tried && showPassword && !pwOk ? (signUpMode || resetMode ? "Use at least 8 characters." : "Enter your password.") : undefined
  const codeError = tried && showCode && !codeOk ? "Enter the code from your email." : undefined

  const loaded = signInLoaded && signUpLoaded
  const formKey = `${audience}-${mode}-${step}`

  const title = resetMode ? "Reset your password." : signUpMode ? v.upTitle : v.inTitle
  const subtitle = resetMode
    ? "Enter your account email and we'll send you a link to choose a new password."
    : postNote && !isPro
      ? signUpMode
        ? "Create an account to post your task. It goes live as soon as you're in."
        : "Sign in to post your task. It goes live as soon as you're in."
      : signUpMode
        ? v.upSub
        : v.inSub

  const submitLabel = isVerify
    ? resetMode
      ? "Reset password"
      : "Confirm"
    : resetMode
      ? "Send reset link"
      : signUpMode
        ? isPro
          ? "Register"
          : "Create account"
        : "Sign in"

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

  const clearFeedback = () => {
    setTried(false)
    setNotice(null)
    setServerError(null)
  }

  const chooseAudience = (next: Audience) => {
    setAudience(next)
    setTried(false)
    setNotice(null)
    setServerError(null)
  }

  const toForgot = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setMode("reset")
    setStep("form")
    clearFeedback()
  }

  const toggleMode = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setMode((current) => (current === "signin" ? "signup" : "signin"))
    setStep("form")
    clearFeedback()
  }

  const changeEmail = (value: string) => {
    setEmail(value)
    setNotice(null)
  }

  const changePassword = (value: string) => {
    setPassword(value)
    setNotice(null)
  }

  // Clerk creates the session; the design's 900ms pause before redirecting is kept.
  const activateAndRedirect = async (
    sessionId: string | null,
    activate: ((params: { session: string }) => Promise<void>) | undefined,
    destination: string,
  ) => {
    if (!sessionId || !activate) throw new Error("Your session could not be started. Please try again.")
    await activate({ session: sessionId })
    setNotice(SIGNED_IN_NOTICE)
    window.setTimeout(() => router.replace(destination), REDIRECT_DELAY_MS)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!EMAIL_AUTH_ENABLED) return
    setTried(true)
    setServerError(null)
    if (!emailValid || !pwOk || !codeOk || busy) return
    setBusy(true)
    try {
      if (isVerify) {
        if (resetMode) {
          if (!signIn) return
          const verified = await signIn.attemptFirstFactor({
            strategy: "reset_password_email_code",
            code: code.trim(),
          })
          if (verified.status !== "needs_new_password") {
            throw new Error("That code is not valid. Please try again.")
          }
          const result = await signIn.resetPassword({ password })
          await activateAndRedirect(result.createdSessionId, setActiveSignIn, "/dashboard")
        } else {
          if (!signUp) return
          const result = await signUp.attemptEmailAddressVerification({ code: code.trim() })
          await activateAndRedirect(result.createdSessionId, setActiveSignUp, "/onboarding")
        }
        return
      }

      if (resetMode) {
        if (!signIn) return
        await signIn.create({ strategy: "reset_password_email_code", identifier: email })
        setStep("verify")
        setTried(false)
        setCode("")
        setPassword("")
        setNotice(`If an account exists for ${email}, we've sent a reset link. Check your inbox.`)
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
        setStep("verify")
        setTried(false)
        setCode("")
        setNotice("Account created. Check your inbox to confirm your email.")
        return
      }

      if (!signIn) return
      const result = await signIn.create({ identifier: email, password })
      if (result.status !== "complete") {
        setServerError("Additional verification is required to sign in.")
        return
      }
      await activateAndRedirect(result.createdSessionId, setActiveSignIn, "/dashboard")
    } catch (error) {
      setNotice(null)
      setServerError(clerkErrorMessage(error, "Something went wrong. Please try again."))
    } finally {
      setBusy(false)
    }
  }

  const onGoogle = () => {
    if (!loaded || busy) return
    setServerError(null)
    setNotice(GOOGLE_NOTICE)
    window.setTimeout(async () => {
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
        setNotice(null)
        setServerError(clerkErrorMessage(error, "Google sign-in is unavailable right now."))
      }
    }, REDIRECT_DELAY_MS)
  }

  return (
    <div
      className="qh-auth"
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: 16,
        background: "var(--paper)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
        gap: 16,
      }}
    >
      <style>{AUTH_CSS}</style>

      <aside
        style={{
          position: "relative",
          minHeight: 640,
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          background: "var(--ink-950)",
          color: "var(--white)",
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
            transition: "opacity var(--dur-slow) var(--ease-out)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,rgba(10,10,11,.55) 0%,rgba(10,10,11,.15) 38%,rgba(10,10,11,.82) 100%)",
          }}
        />

        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <Link
            href={v.homeHref}
            style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none", color: "var(--white)" }}
          >
            <span style={{ font: "600 22px/1 var(--font-sans)", letterSpacing: "-0.05em" }}>quickhands</span>
            {isPro ? (
              <span
                style={{
                  font: "var(--text-micro)",
                  letterSpacing: "var(--ls-mono)",
                  textTransform: "uppercase",
                  color: "#AFC0F5",
                }}
              >
                Pro
              </span>
            ) : null}
          </Link>
          <Link
            href={v.homeHref}
            className="qh-back"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 32,
              padding: "0 14px",
              borderRadius: "var(--radius-pill)",
              background: "rgba(255,255,255,.12)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              color: "var(--white)",
              textDecoration: "none",
              font: "500 13px/1 var(--font-sans)",
            }}
          >
            <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
            Back to site
          </Link>
        </div>

        <div style={{ position: "relative", marginTop: "auto", display: "flex", flexDirection: "column", gap: 28 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              font: "var(--text-micro)",
              letterSpacing: "var(--ls-mono)",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.72)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.accentLight }} />
            {v.eyebrow}
          </span>
          <h1
            style={{
              font: "var(--text-display)",
              fontSize: "clamp(44px, 5.4vw, 72px)",
              letterSpacing: "var(--ls-display)",
              margin: 0,
              maxWidth: 560,
              textWrap: "balance",
            }}
          >
            {v.h1a}{" "}
            <em
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: v.accentLight,
              }}
            >
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
                  <span style={{ display: "inline-flex", color: v.accentLight }}>
                    <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span
                    style={{
                      font: "500 14px/1.35 var(--font-sans)",
                      letterSpacing: "var(--ls-tight)",
                      color: "rgba(255,255,255,.88)",
                      textWrap: "pretty",
                    }}
                  >
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
          borderRadius: "var(--radius-xl)",
          background: "var(--white)",
          boxShadow: "var(--shadow-hairline)",
          padding: "clamp(24px, 4vw, 48px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <AudienceSegmented value={audience} onChange={chooseAudience} />
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
          <div
            key={formKey}
            className="qh-anim"
            style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column" }}
          >
            <span
              style={{
                font: "var(--text-micro)",
                letterSpacing: "var(--ls-mono)",
                textTransform: "uppercase",
                color: v.accent,
              }}
            >
              {v.formEyebrow}
            </span>
            <h2
              style={{
                font: "var(--text-h2)",
                fontSize: 40,
                letterSpacing: "var(--ls-heading)",
                margin: "14px 0 0",
                textWrap: "balance",
              }}
            >
              {title}
            </h2>
            <p style={{ margin: "10px 0 0", color: "var(--fg-2)", textWrap: "pretty" }}>{subtitle}</p>

            {showGoogle ? (
              <>
                <button
                  type="button"
                  onClick={onGoogle}
                  disabled={!loaded || busy}
                  className="qh-google"
                  style={{
                    marginTop: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    height: 48,
                    border: 0,
                    borderRadius: "var(--radius-pill)",
                    background: "var(--white)",
                    boxShadow: "var(--shadow-inset)",
                    font: "500 15px/1 var(--font-sans)",
                    letterSpacing: "-0.01em",
                    color: "var(--fg-1)",
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

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    margin: "24px 0",
                    font: "var(--text-micro)",
                    letterSpacing: "var(--ls-mono)",
                    textTransform: "uppercase",
                    color: "var(--fg-3)",
                  }}
                >
                  <span style={{ flex: 1, height: 1, background: "var(--border-hairline)" }} />
                  or with email
                  <span style={{ flex: 1, height: 1, background: "var(--border-hairline)" }} />
                </div>
              </>
            ) : (
              <div style={{ height: 28 }} />
            )}

            <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {showName ? (
                <>
                  <AuthInput
                    label="Full name"
                    placeholder="Tendai Moyo"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    disabled={!EMAIL_AUTH_ENABLED}
                  />
                  <AuthInput
                    label="Phone number"
                    type="tel"
                    placeholder="+263 77 123 4567"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="tel"
                    disabled={!EMAIL_AUTH_ENABLED}
                  />
                </>
              ) : null}

              {showEmail ? (
                <AuthInput
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => changeEmail(event.target.value)}
                  error={emailError}
                  autoComplete="email"
                  disabled={!EMAIL_AUTH_ENABLED}
                />
              ) : null}

              {showCode ? (
                <AuthInput
                  label="Verification code"
                  inputMode="numeric"
                  placeholder="123456"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  error={codeError}
                  autoComplete="one-time-code"
                  disabled={!EMAIL_AUTH_ENABLED}
                />
              ) : null}

              {showPassword ? (
                <div style={{ position: "relative" }}>
                  <AuthInput
                    label={resetMode ? "New password" : "Password"}
                    type={showPw ? "text" : "password"}
                    placeholder={signUpMode || resetMode ? "At least 8 characters" : "Your password"}
                    value={password}
                    onChange={(event) => changePassword(event.target.value)}
                    error={pwError}
                    autoComplete={signUpMode || resetMode ? "new-password" : "current-password"}
                    disabled={!EMAIL_AUTH_ENABLED}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((current) => !current)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    disabled={!EMAIL_AUTH_ENABLED}
                    className="qh-eye"
                    style={{
                      position: "absolute",
                      right: 6,
                      top: 32,
                      width: 36,
                      height: 36,
                      border: 0,
                      borderRadius: "var(--radius-md)",
                      background: "transparent",
                      color: "var(--fg-3)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: EMAIL_AUTH_ENABLED ? "pointer" : "not-allowed",
                    }}
                  >
                    {showPw ? (
                      <EyeOff size={16} strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                      <Eye size={16} strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </button>
                </div>
              ) : null}

              {showRemember ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      font: "var(--text-small)",
                      color: "var(--fg-2)",
                    }}
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={remember}
                      onClick={() => setRemember((current) => !current)}
                      className="qh-check"
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
                        background: remember ? v.accent : "var(--white)",
                        boxShadow: remember ? "none" : "var(--shadow-inset)",
                        color: "var(--white)",
                      }}
                    >
                      {remember ? <Check size={12} strokeWidth={1.5} aria-hidden="true" /> : null}
                    </button>
                    {signUpMode ? v.upCheck : v.remember}
                  </label>
                  {showForgot ? (
                    <a href="#" onClick={toForgot} style={ROW_LINK}>
                      Forgot password?
                    </a>
                  ) : null}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!EMAIL_AUTH_ENABLED || busy || !loaded}
                className="qh-submit"
                style={{
                  marginTop: 8,
                  height: 52,
                  border: 0,
                  borderRadius: "var(--radius-pill)",
                  background: v.accent,
                  color: "var(--white)",
                  font: "500 15px/1 var(--font-sans)",
                  letterSpacing: "-0.01em",
                  cursor: EMAIL_AUTH_ENABLED ? "pointer" : "not-allowed",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {submitLabel}
                <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>

              {!EMAIL_AUTH_ENABLED ? (
                <p style={{ margin: 0, font: "var(--text-small)", color: "var(--fg-3)", textAlign: "center" }}>
                  Email sign-in is coming soon.
                </p>
              ) : null}

              {showTerms ? (
                <p style={{ margin: 0, font: "var(--text-small)", color: "var(--fg-3)", textAlign: "center", textWrap: "pretty" }}>
                  By creating an account you agree to our{" "}
                  <Link href="/privacy-policy" style={{ color: "var(--fg-2)" }}>
                    Terms of service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" style={{ color: "var(--fg-2)" }}>
                    Privacy policy
                  </Link>
                  .
                </p>
              ) : null}
            </form>

            <div id="clerk-captcha" />

            {serverError ? (
              <p
                role="alert"
                style={{ margin: "16px 0 0", font: "var(--text-small)", color: "var(--danger-600)", textWrap: "pretty" }}
              >
                {serverError}
              </p>
            ) : null}

            {notice ? (
              <div
                role="status"
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--ink-50)",
                  font: "var(--text-small)",
                  color: "var(--fg-2)",
                }}
              >
                <span style={{ display: "inline-flex", color: v.accent }}>
                  <Check size={14} strokeWidth={1.5} aria-hidden="true" />
                </span>
                {notice}
              </div>
            ) : null}

            <p
              style={{
                margin: "28px 0 0",
                paddingTop: 24,
                borderTop: "1px solid var(--border-hairline)",
                font: "var(--text-small)",
                color: "var(--fg-2)",
                textAlign: "center",
              }}
            >
              {switchPrompt}{" "}
              <a href="#" onClick={toggleMode} style={{ fontWeight: 500, color: "var(--fg-1)" }}>
                {switchCta}
              </a>
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 12,
            font: "var(--text-micro)",
            letterSpacing: "var(--ls-mono)",
            textTransform: "uppercase",
            color: "var(--fg-3)",
          }}
        >
          <span>© 2026 Quickhands, Inc.</span>
          <span style={{ display: "flex", gap: 16 }}>
            <Link href="/privacy-policy" className="qh-footer-link">
              Terms
            </Link>
            <Link href="/privacy-policy" className="qh-footer-link">
              Privacy
            </Link>
            <a href="mailto:support@quickhands.com" className="qh-footer-link">
              Support
            </a>
          </span>
        </div>
      </main>
    </div>
  )
}
