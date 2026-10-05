"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Droplets,
  GraduationCap,
  Hammer,
  MessageSquare,
  Minus,
  Percent,
  Plus,
  Scissors,
  Search,
  Sparkles,
  Sprout,
  Star,
  Text,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { authFontClassName } from "@/components/auth/fonts"
import { OPEN_COOKIE_PREFERENCES_EVENT } from "@/components/cookie-consent/CookieConsent"
import { useDitherArc } from "@/components/client-landing/useDitherArc"
import { getApiUrl } from "@/lib/fetch-client"

/* Design tokens from the Professionals design (template <style> blocks). Font families point at the
   next/font variables that authFontClassName provides. */
const TOKENS: Record<string, string> = {
  "--ink-950": "#0A0A0B",
  "--ink-900": "#141416",
  "--ink-800": "#1F1F22",
  "--ink-600": "#4A4A50",
  "--ink-400": "#9A9AA0",
  "--ink-100": "#EFEFF0",
  "--ink-50": "#F6F6F5",
  "--paper": "#FBFBFA",
  "--white": "#FFFFFF",
  "--fg-1": "var(--ink-950)",
  "--fg-2": "var(--ink-600)",
  "--fg-3": "var(--ink-400)",
  "--border-hairline": "rgba(10,10,11,.08)",
  "--border-default": "rgba(10,10,11,.12)",
  "--border-inverse": "rgba(255,255,255,.12)",
  "--blue": "#1B3A9E",
  "--blue-hover": "#142C7A",
  "--blue-100": "#E7ECF8",
  "--font-sans": "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
  "--font-mono": "var(--font-geist-mono), ui-monospace, Menlo, monospace",
  "--font-serif": "var(--font-instrument-serif), ui-serif, Georgia, serif",
  "--fw-regular": "400",
  "--fw-medium": "500",
  "--fs-display": "88px",
  "--fs-h1": "64px",
  "--fs-h2": "44px",
  "--fs-h3": "28px",
  "--fs-body-lg": "18px",
  "--fs-body": "15px",
  "--fs-small": "13px",
  "--fs-micro": "11px",
  "--lh-display": "0.98",
  "--lh-heading": "1.05",
  "--lh-snug": "1.3",
  "--lh-body": "1.55",
  "--ls-display": "-0.045em",
  "--ls-heading": "-0.035em",
  "--ls-tight": "-0.015em",
  "--ls-body": "-0.005em",
  "--ls-mono": "0.06em",
  "--text-display": "var(--fw-medium) var(--fs-display)/var(--lh-display) var(--font-sans)",
  "--text-h1": "var(--fw-medium) var(--fs-h1)/var(--lh-heading) var(--font-sans)",
  "--text-h2": "var(--fw-medium) var(--fs-h2)/var(--lh-heading) var(--font-sans)",
  "--text-h3": "var(--fw-medium) var(--fs-h3)/1.15 var(--font-sans)",
  "--text-body-lg": "var(--fw-regular) var(--fs-body-lg)/var(--lh-body) var(--font-sans)",
  "--text-body-md": "var(--fw-regular) var(--fs-body)/var(--lh-body) var(--font-sans)",
  "--text-small": "var(--fw-regular) var(--fs-small)/1.45 var(--font-sans)",
  "--text-micro": "var(--fw-regular) var(--fs-micro)/1.3 var(--font-mono)",
  "--radius-md": "10px",
  "--radius-lg": "14px",
  "--radius-xl": "20px",
  "--container-max": "1200px",
  "--gutter": "24px",
  "--shadow-sm": "0 1px 2px rgba(10,10,11,.04),0 0 0 1px rgba(10,10,11,.08)",
  "--shadow-float": "0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14),0 0 0 1px rgba(10,10,11,.08)",
  "--ease-out": "cubic-bezier(.22,1,.36,1)",
  "--dur-fast": "140ms",
  "--dur-base": "240ms",
}

const CSS = `
@keyframes qhFade{from{opacity:0}to{opacity:1}}
.qh-pro-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:999px;text-decoration:none;font-family:var(--font-sans);font-weight:500;letter-spacing:var(--ls-tight);white-space:nowrap;cursor:pointer;transition:background-color var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)}
.qh-pro-btn-primary{background:var(--blue);color:#fff}
.qh-pro-btn-primary:hover{background:var(--blue-hover)}
.qh-pro-btn-secondary{background:#fff;color:var(--ink-950);box-shadow:inset 0 0 0 1px var(--border-default)}
.qh-pro-btn-secondary:hover{background:var(--ink-50)}
.qh-pro-btn-ghost{background:transparent;color:var(--ink-950)}
.qh-pro-btn-ghost:hover{background:var(--ink-100)}
.qh-pro-btn-inverse{background:#fff;color:var(--blue)}
.qh-pro-btn-inverse:hover{background:var(--ink-50)}
.qh-pro-nav-link{display:inline-flex;align-items:center;height:36px;padding:0 12px;border-radius:999px;font:500 14px/1 var(--font-sans);text-decoration:none;color:var(--fg-2);white-space:nowrap;transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)}
.qh-pro-nav-link:hover{background:var(--ink-100);color:var(--fg-1)}
.qh-pro-find{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border:0;border-radius:999px;font:500 14px/1 var(--font-sans);color:var(--fg-1);cursor:pointer;white-space:nowrap;transition:background var(--dur-fast) var(--ease-out)}
.qh-pro-find:hover{background:var(--ink-100)}
.qh-pro-menu-btn{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 12px;border:0;border-radius:999px;background:transparent;font:500 14px/1 var(--font-sans);color:var(--fg-1);cursor:pointer;transition:background var(--dur-fast) var(--ease-out)}
.qh-pro-menu-btn:hover{background:var(--ink-100)}
.qh-pro-account{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 12px 0 4px;border-radius:999px;text-decoration:none;color:var(--fg-1);font:500 14px/1 var(--font-sans);transition:background var(--dur-fast) var(--ease-out)}
.qh-pro-account:hover{background:var(--ink-100)}
.qh-pro-mega-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:var(--radius-md);text-decoration:none;color:var(--fg-1);transition:background var(--dur-fast) var(--ease-out)}
.qh-pro-mega-item:hover{background:var(--ink-50)}
.qh-pro-mega-how{display:flex;align-items:center;gap:16px;border-radius:var(--radius-lg);background:var(--ink-50);overflow:hidden;text-decoration:none;color:var(--fg-1);transition:background var(--dur-fast) var(--ease-out)}
.qh-pro-mega-how:hover{background:var(--ink-100)}
.qh-pro-mega-link{display:flex;align-items:baseline;gap:10px;padding:12px 0;text-decoration:none;color:var(--fg-1);transition:color var(--dur-fast) var(--ease-out)}
.qh-pro-mega-link:hover{color:var(--blue)}
.qh-pro-mega-link-last{border-bottom:0}
.qh-pro-play:hover{background:rgba(255,255,255,.06)}
.qh-pro-foot-link{color:rgba(255,255,255,.72);text-decoration:none;font:var(--text-small);font-size:14px;transition:color var(--dur-fast) var(--ease-out)}
.qh-pro-foot-link:hover{color:#fff}
.qh-pro-foot-bottom{color:inherit;text-decoration:none;transition:color var(--dur-fast) var(--ease-out);background:none;border:0;padding:0;font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer}
.qh-pro-foot-bottom:hover{color:#fff}
`

const SIGN_UP_HREF = "/sign-up#pro"
const SIGN_IN_HREF = "/sign-in#pro"
const DASHBOARD_HREF = "/dashboard"

const PRO_PALETTE = ["#E9ECFB", "#B9C6F5", "#7D95E8", "#3F5FD6", "#1B3A9E", "#12276E", "#0A1440"]
const HAIRLINE = "var(--border-hairline)"
const INVERSE_LINE = "var(--border-inverse)"
const CAROUSEL_DURATION = 4500
const CAROUSEL_TICK = 100

const MEGA_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: Hammer, label: "Handyman jobs" },
  { icon: Sparkles, label: "Cleaning jobs" },
  { icon: Zap, label: "Electrical work" },
  { icon: Scissors, label: "Beauty & grooming" },
  { icon: Droplets, label: "Plumbing" },
  { icon: GraduationCap, label: "Tutoring" },
  { icon: Truck, label: "Moving & delivery" },
  { icon: Sprout, label: "Gardening" },
]

const STEPS: { icon: LucideIcon; title: string; desc: string; image: string; stat: string }[] = [
  {
    icon: ClipboardList,
    title: "Clients post tasks",
    desc: "Clients describe their task in detail and suggest a budget.",
    image: "/design/professionals/tasks.jpg",
    stat: "Tasks posted daily",
  },
  {
    icon: Search,
    title: "Choose the orders that suit you",
    desc: "Browse available tasks and pick the ones that match your skills and schedule.",
    image: "/design/professionals/orders.jpg",
    stat: "Matched to your skills",
  },
  {
    icon: MessageSquare,
    title: "Send your offer",
    desc: "Respond to the task and discuss pricing and details privately with the client.",
    image: "/design/professionals/offers.jpg",
    stat: "",
  },
  {
    icon: CreditCard,
    title: "Complete the work, get paid",
    desc: "Finish the task and receive your payment securely in the app.",
    image: "/design/professionals/factory-worker.jpg",
    stat: "Paid in under 24 hrs",
  },
  {
    icon: Star,
    title: "Build your reputation",
    desc: "Earn reviews, grow your profile and attract more clients.",
    image: "/design/professionals/rep.jpg",
    stat: "",
  },
]

const FEATURES = [
  "Free access to job opportunities",
  "No subscription or credit fees",
  "Earn on a flexible schedule",
  "Grow your business and client base",
]

const FAQS: [string, string][] = [
  [
    "How can I make money on QuickHands?",
    "Choose a task posted on the platform, send your proposal to the client and, if selected, complete the task and get paid securely through the platform.",
  ],
  [
    "Why do specialists pay to use the platform?",
    "Fees keep a steady flow of quality orders coming. They also fund platform development, advertising and dedicated specialist support.",
  ],
  [
    "What if I pay for a response but the job isn't right?",
    "Review the description, budget and complexity before responding. If a client doesn't open your message within 5 days, the response fee is refunded automatically.",
  ],
  [
    "How do payments work?",
    "You pay a small fee for the chance to contact a client. It's charged instantly from your balance or linked card, so you can respond right away.",
  ],
  [
    "Who pays me for the work?",
    "Clients pay when they choose to work with you. Funds are released to you once the job is completed, through the platform's secure payments.",
  ],
  [
    "Will clients choose me without reviews?",
    "Yes. Clients weigh a complete profile, work samples, clear communication and fair pricing. Many professionals win their first job quickly.",
  ],
  [
    "What if the client disappears?",
    "Plans change. Communicate clearly and ask for confirmation. You can also report inactive clients to our support team.",
  ],
  [
    "Am I guaranteed to get the order?",
    "No — clients decide based on your profile, offer, communication and pricing. A strong profile and thoughtful proposals raise your chances significantly.",
  ],
]

const PLAN_A = [
  "Unlocks after verification or 1 paid responses",
  "Available to all professionals",
  "No upfront costs or hidden fees",
  "Only pay when you get paid",
]

const PLAN_B = [
  "No hidden charges",
  "Not every response leads to a job",
  "First order takes 5–10 responses on average",
  "Good for getting started quickly",
]

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "For clients",
    links: [
      { label: "Post a task", href: "/post-job" },
      { label: "How to hire", href: "/#how-it-works" },
      { label: "Enterprise", href: "mailto:business@quickhands.com" },
    ],
  },
  {
    title: "For specialists",
    links: [
      { label: "Create profile", href: SIGN_UP_HREF },
      { label: "How to win jobs", href: "#how" },
      { label: "Success stories", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#how-it-works" },
      { label: "Feedback", href: "mailto:feedback@quickhands.com" },
      { label: "Terms", href: "/privacy-policy" },
      { label: "Privacy", href: "/privacy-policy" },
    ],
  },
]

type PublicStats = { specialists: number; jobsPosted: number; categories: number; averageRating: number | null }

function usePublicStats() {
  const [stats, setStats] = useState<PublicStats | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch(getApiUrl("/api/stats/public"))
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!cancelled && payload?.success) setStats(payload.data as PublicStats)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])
  return stats
}

function initialsOf(value: string) {
  return value
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function isInternalHref(href: string) {
  return href.startsWith("/")
}

function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  full = false,
  iconRight = false,
  children,
}: {
  href: string
  variant?: "primary" | "secondary" | "ghost" | "inverse"
  size?: "md" | "lg"
  full?: boolean
  iconRight?: boolean
  children: ReactNode
}) {
  const style: CSSProperties = {
    height: size === "lg" ? 52 : 40,
    padding: size === "lg" ? "0 24px" : "0 18px",
    fontSize: size === "lg" ? 15 : 14,
    width: full ? "100%" : undefined,
    boxSizing: "border-box",
  }
  const className = `qh-pro-btn qh-pro-btn-${variant}`
  const content = (
    <>
      {children}
      {iconRight ? <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /> : null}
    </>
  )
  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className} style={style}>
        {content}
      </Link>
    )
  }
  return (
    <a href={href} className={className} style={style}>
      {content}
    </a>
  )
}

function Tag({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 24,
        padding: "0 10px",
        borderRadius: 999,
        background: inverse ? "rgba(255,255,255,.16)" : "var(--ink-100)",
        color: inverse ? "#FFFFFF" : "var(--fg-2)",
        font: "var(--text-micro)",
        letterSpacing: "var(--ls-mono)",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  )
}

function SectionDivider({ label, inverse = false }: { label: string; inverse?: boolean }) {
  const color = inverse ? "rgba(255,255,255,.72)" : "var(--ink-600)"
  const line = inverse ? INVERSE_LINE : HAIRLINE
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color,
      }}
    >
      <span style={{ flex: 1, height: 1, background: line }} />
      {label}
      <span style={{ flex: 1, height: 1, background: line }} />
    </div>
  )
}

export function ProfessionalsLanding() {
  const canvasRef = useDitherArc(PRO_PALETTE)
  const stats = usePublicStats()
  const { isLoaded, isSignedIn, user } = useUser()

  const appRole = user?.unsafeMetadata?.appRole
  const isPro = Boolean(isSignedIn) && appRole === "freelancer"
  const proCtaHref = isPro ? DASHBOARD_HREF : SIGN_UP_HREF
  const proCtaLabel = isPro ? "My jobs" : "Register"
  const findWorkHref = isPro ? DASHBOARD_HREF : SIGN_UP_HREF
  const displayName = user?.firstName ?? user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? ""
  const userFirst = displayName.split(/[ @]/)[0] ?? ""
  const userInitials = initialsOf(user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "U") || "U"

  // Header state (design: scroll compacts the nav; hover or click opens the Find work panel).
  const [scrolled, setScrolled] = useState(false)
  const [mega, setMega] = useState(false)
  const [forceOpen, setForceOpen] = useState(false)
  const hoveringRef = useRef(false)
  const closeTimerRef = useRef<number | null>(null)

  const cancelClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      setScrolled(y > 120)
      if (!hoveringRef.current) {
        setMega(false)
        setForceOpen(false)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelClose()
    }
  }, [])

  const compact = scrolled && !forceOpen && !mega
  const navTop = scrolled ? "12px" : "60px"
  const navWidth = compact ? "300px" : "960px"
  const navShadow = scrolled || mega ? "var(--shadow-float)" : "var(--shadow-sm)"
  const megaTabBg = mega ? "var(--ink-100)" : "transparent"

  const openMega = () => {
    cancelClose()
    if (!mega) setMega(true)
  }
  const closeMega = () => {
    if (mega) setMega(false)
  }
  const closeMenu = () => {
    cancelClose()
    setMega(false)
    setForceOpen(false)
  }
  const openFromCompact = () => {
    cancelClose()
    if (!forceOpen) {
      setForceOpen(true)
      setMega(true)
    }
  }
  const headerEnter = () => {
    hoveringRef.current = true
    cancelClose()
  }
  const headerLeave = () => {
    hoveringRef.current = false
    cancelClose()
    closeTimerRef.current = window.setTimeout(() => {
      setMega(false)
      setForceOpen(false)
    }, 220)
  }

  // Five-step carousel: advances every 4.5s, pauses while hovered, click selects a step.
  const [carousel, setCarousel] = useState({ step: 0, elapsed: 0 })
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setCarousel((s) =>
        s.elapsed + CAROUSEL_TICK >= CAROUSEL_DURATION
          ? { step: (s.step + 1) % STEPS.length, elapsed: 0 }
          : { step: s.step, elapsed: s.elapsed + CAROUSEL_TICK }
      )
    }, CAROUSEL_TICK)
    return () => window.clearInterval(id)
  }, [paused])
  const current = STEPS[carousel.step]
  const progress = `${((carousel.elapsed / CAROUSEL_DURATION) * 100).toFixed(1)}%`

  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div
      className={authFontClassName}
      style={
        {
          ...TOKENS,
          position: "relative",
          overflowX: "clip",
          minHeight: "100vh",
          background: "var(--paper)",
          color: "var(--fg-1)",
          font: "var(--text-body-md)",
          letterSpacing: "var(--ls-body)",
          WebkitFontSmoothing: "antialiased",
        } as CSSProperties
      }
    >
      <style>{CSS}</style>

      {/* Audience strip */}
      <div style={{ borderBottom: `1px solid ${HAIRLINE}`, background: "var(--ink-50)" }}>
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div
            role="group"
            aria-label="Audience"
            style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: 2, height: 28, width: 230, boxSizing: "border-box", borderRadius: 999, background: "var(--ink-100)" }}
          >
            <Link
              href="/"
              style={{
                flex: 1,
                height: 24,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                color: "var(--fg-2)",
                font: "500 12px/1 var(--font-sans)",
                textDecoration: "none",
              }}
            >
              For clients
            </Link>
            <button
              type="button"
              aria-pressed="true"
              style={{
                flex: 1,
                height: 24,
                border: 0,
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                background: "var(--white)",
                color: "var(--fg-1)",
                boxShadow: "var(--shadow-sm)",
                font: "500 12px/1 var(--font-sans)",
                cursor: "default",
              }}
            >
              For professionals
            </button>
          </div>
          <span style={{ font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: "var(--fg-3)" }}>
            Specialists · Africa
          </span>
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: navTop,
          zIndex: 30,
          display: "flex",
          justifyContent: "center",
          padding: "0 16px",
          pointerEvents: "none",
          transition: "top var(--dur-base) var(--ease-out)",
        }}
      >
        <div
          onMouseEnter={headerEnter}
          onMouseLeave={headerLeave}
          style={{
            pointerEvents: "auto",
            width: navWidth,
            maxWidth: "100%",
            boxSizing: "border-box",
            background: "var(--white)",
            borderRadius: 20,
            boxShadow: navShadow,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "width var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
          }}
        >
          {compact ? (
            <div
              style={{
                width: 300,
                maxWidth: "calc(100vw - 32px)",
                flexShrink: 0,
                boxSizing: "border-box",
                animation: "qhFade 180ms var(--ease-out) 60ms both",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                height: 56,
                padding: "0 8px 0 12px",
              }}
            >
              <Link
                href="/"
                aria-label="QuickHands home"
                style={{ display: "block", width: 32, height: 32, borderRadius: 9, overflow: "hidden", flexShrink: 0 }}
              >
                <img
                  src="/quickhands.png"
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.4)", display: "block" }}
                />
              </Link>
              <button type="button" className="qh-pro-menu-btn" onMouseEnter={openFromCompact} onClick={openFromCompact}>
                <Text size={15} strokeWidth={1.5} color="var(--blue)" aria-hidden="true" />
                Menu
              </button>
              <ButtonLink href={proCtaHref} variant="primary" size="md">
                {proCtaLabel}
              </ButtonLink>
            </div>
          ) : (
            <div
              style={{
                width: "min(960px, calc(100vw - 32px))",
                flexShrink: 0,
                animation: "qhFade 200ms var(--ease-out) 80ms both",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20, height: 64, padding: "0 10px 0 22px" }}>
                <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none", color: "var(--fg-1)", flexShrink: 0 }}>
                  <span style={{ font: "600 20px/1 var(--font-sans)", letterSpacing: "-0.05em" }}>quickhands</span>
                  <span style={{ font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: "var(--blue)" }}>
                    Pro
                  </span>
                </Link>
                <nav style={{ display: "flex", gap: 2, flex: 1, minWidth: 0 }}>
                  <button type="button" className="qh-pro-find" onMouseEnter={openMega} onClick={openMega} style={{ background: megaTabBg }}>
                    Find work
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      color="var(--fg-3)"
                      aria-hidden="true"
                      style={{ transform: mega ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)" }}
                    />
                  </button>
                  <a href="#how" className="qh-pro-nav-link" onMouseEnter={closeMega}>
                    How it works
                  </a>
                  <a href="#pricing" className="qh-pro-nav-link" onMouseEnter={closeMega}>
                    Pricing
                  </a>
                  <a href="#faq" className="qh-pro-nav-link" onMouseEnter={closeMega}>
                    FAQ
                  </a>
                  <Link href="/" className="qh-pro-nav-link" onMouseEnter={closeMega}>
                    For clients
                  </Link>
                </nav>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  {isLoaded && !isSignedIn ? (
                    <ButtonLink href={SIGN_IN_HREF} variant="ghost" size="md">
                      Sign in
                    </ButtonLink>
                  ) : null}
                  {isLoaded && isSignedIn ? (
                    <Link href={DASHBOARD_HREF} className="qh-pro-account">
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--blue)",
                          color: "var(--white)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          font: "500 12px/1 var(--font-sans)",
                        }}
                      >
                        {userInitials}
                      </span>
                      {userFirst}
                    </Link>
                  ) : null}
                  <ButtonLink href={proCtaHref} variant="primary" size="md">
                    {proCtaLabel}
                  </ButtonLink>
                </div>
              </div>
              {mega ? (
                <>
                  <div style={{ margin: "0 22px", borderTop: `1px solid ${HAIRLINE}` }} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "2px 24px", padding: "16px 12px 8px" }}>
                    {MEGA_ITEMS.map((item) => (
                      <Link key={item.label} href={findWorkHref} onClick={closeMenu} className="qh-pro-mega-item">
                        <item.icon size={16} strokeWidth={1.5} color="var(--blue)" aria-hidden="true" style={{ flexShrink: 0 }} />
                        <span style={{ font: "500 14px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)" }}>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 24, padding: "12px 22px 22px", alignItems: "center" }}>
                    <a href="#how" onClick={closeMenu} className="qh-pro-mega-how">
                      <img
                        src="/design/professionals/tasks.jpg"
                        alt=""
                        style={{ width: 88, height: 80, objectFit: "cover", display: "block", flexShrink: 0, filter: "saturate(.72)" }}
                      />
                      <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ font: "500 15px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)" }}>How it works</span>
                        <span style={{ font: "var(--text-small)", color: "var(--fg-2)" }}>Five steps to your first job</span>
                      </span>
                    </a>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <a href="#pricing" onClick={closeMenu} className="qh-pro-mega-link" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                        <span style={{ font: "500 14px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)", whiteSpace: "nowrap" }}>Pricing</span>
                        <span style={{ font: "var(--text-small)", fontSize: 12, color: "var(--fg-3)" }}>Two ways to pay</span>
                      </a>
                      <a href="mailto:support@quickhands.com" onClick={closeMenu} className="qh-pro-mega-link qh-pro-mega-link-last">
                        <span style={{ font: "500 14px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)", whiteSpace: "nowrap" }}>Get support</span>
                        <span style={{ font: "var(--text-small)", fontSize: 12, color: "var(--fg-3)" }}>support@quickhands.com</span>
                      </a>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", top: 44, right: 0, width: "min(52vw,860px)", height: "min(760px,88vh)", pointerEvents: "none", zIndex: 0 }}
      >
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated" }} />
      </div>
      <section style={{ position: "relative", zIndex: 1, maxWidth: "var(--container-max)", margin: "0 auto", padding: "184px var(--gutter) 72px" }}>
        <Tag>For specialists</Tag>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <div style={{ flex: "1 1 520px" }}>
            <h1 style={{ font: "var(--text-display)", fontSize: "clamp(56px,9vw,112px)", letterSpacing: "var(--ls-display)", margin: "32px 0 0" }}>
              Be your own{" "}
              <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--blue)" }}>boss</em>.
            </h1>
            <p style={{ font: "var(--text-body-lg)", maxWidth: 520, margin: "28px 0 40px", textWrap: "pretty" }}>
              Spreadsheet guru or skilled carpenter, find your next gig on QuickHands{" "}
              <span style={{ color: "var(--fg-3)" }}>and get paid doing what you love.</span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <ButtonLink href={proCtaHref} size="lg" iconRight>
                Register as a specialist
              </ButtonLink>
              <ButtonLink href="#how" variant="secondary" size="lg">
                See how it works
              </ButtonLink>
            </div>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, flex: "0 1 380px", borderTop: `1px solid ${HAIRLINE}` }}>
            {FEATURES.map((feature) => (
              <li
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: `1px solid ${HAIRLINE}`,
                  font: "500 15px/1.35 var(--font-sans)",
                  letterSpacing: "var(--ls-tight)",
                }}
              >
                <Check size={16} strokeWidth={1.5} color="var(--blue)" aria-hidden="true" style={{ flexShrink: 0 }} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--gutter)" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(380px,43vw,520px)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            background: "var(--ink-900)",
          }}
        >
          <img
            src="/design/professionals/hero-construction.jpg"
            alt="A construction professional in safety gear directing work on site"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 35%",
              filter: "saturate(.72) contrast(1.02)",
            }}
          />
          {stats ? (
            <div style={{ position: "absolute", right: 24, bottom: 24, display: "flex", flexDirection: "column", gap: 10, width: 260, maxWidth: "calc(100% - 48px)" }}>
              <div style={{ padding: "18px 20px", borderRadius: "var(--radius-lg)", background: "var(--white)", boxShadow: "var(--shadow-float)" }}>
                <div style={{ font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: "var(--fg-3)" }}>Specialists</div>
                <div style={{ font: "500 28px/1 var(--font-sans)", letterSpacing: "var(--ls-heading)", fontVariantNumeric: "tabular-nums", marginTop: 14 }}>
                  {stats.specialists.toLocaleString()}
                </div>
              </div>
              <div style={{ padding: "18px 20px", borderRadius: "var(--radius-lg)", background: "var(--white)", boxShadow: "var(--shadow-float)" }}>
                <div style={{ font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: "var(--fg-3)" }}>Jobs posted</div>
                <div style={{ font: "500 28px/1 var(--font-sans)", letterSpacing: "var(--ls-heading)", fontVariantNumeric: "tabular-nums", marginTop: 14 }}>
                  {stats.jobsPosted.toLocaleString()}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px 32px", padding: "20px 0 0", font: "var(--text-small)", color: "var(--fg-3)" }}>
          <span>We&apos;ll send you a confirmation code — no spam, no advertising.</span>
          <span>Sign up and we&apos;ll notify you when the app launches.</span>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "120px var(--gutter) 128px", scrollMarginTop: 40 }}>
        <div style={{ background: "var(--ink-950)", color: "var(--white)", borderRadius: "var(--radius-xl)", padding: "clamp(40px,6vw,88px) clamp(24px,5vw,64px)" }}>
          <SectionDivider label="Simple process" inverse />
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, margin: "48px 0 56px" }}>
            <h2 style={{ font: "var(--text-h1)", fontSize: "clamp(40px,5.4vw,64px)", letterSpacing: "var(--ls-heading)", margin: 0, maxWidth: 640 }}>
              How it{" "}
              <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: "#AFC0F5" }}>works</em>.
            </h2>
            <p style={{ margin: 0, maxWidth: 340, color: "rgba(255,255,255,.6)", textWrap: "pretty" }}>
              Get started in minutes. Five steps from first task to a growing client base.
            </p>
          </div>
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: 32, alignItems: "start" }}
          >
            <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${INVERSE_LINE}` }}>
              {STEPS.map((step, index) => {
                const active = index === carousel.step
                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setCarousel({ step: index, elapsed: 0 })}
                    style={{
                      position: "relative",
                      display: "flex",
                      gap: 20,
                      alignItems: "flex-start",
                      width: "100%",
                      padding: "22px 0",
                      border: 0,
                      borderBottom: `1px solid ${INVERSE_LINE}`,
                      background: "transparent",
                      color: "var(--white)",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        font: "var(--text-micro)",
                        letterSpacing: "var(--ls-mono)",
                        color: active ? "#7D95E8" : "rgba(255,255,255,.4)",
                        paddingTop: 5,
                        width: 20,
                        flexShrink: 0,
                      }}
                    >
                      {`0${index + 1}`}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          font: "500 18px/1.3 var(--font-sans)",
                          letterSpacing: "var(--ls-tight)",
                          color: active ? "#fff" : "rgba(255,255,255,.55)",
                          transition: "color var(--dur-base) var(--ease-out)",
                        }}
                      >
                        {step.title}
                      </span>
                      {active ? (
                        <span style={{ display: "block", marginTop: 8, font: "var(--text-body-md)", color: "rgba(255,255,255,.6)", textWrap: "pretty" }}>
                          {step.desc}
                        </span>
                      ) : null}
                    </span>
                    <step.icon
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      style={{ color: active ? "#fff" : "rgba(255,255,255,.55)", paddingTop: 3, flexShrink: 0, transition: "color var(--dur-base) var(--ease-out)" }}
                    />
                    {active ? <span style={{ position: "absolute", left: 0, bottom: -1, height: 1, width: progress, background: "#7D95E8" }} /> : null}
                  </button>
                )
              })}
            </div>
            <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--ink-900)", boxShadow: `inset 0 0 0 1px ${INVERSE_LINE}` }}>
              <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "var(--ink-800)" }}>
                <div
                  role="img"
                  aria-label={current.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url("${current.image}")`,
                    filter: "saturate(.72) contrast(1.02)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 16,
                    top: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    height: 28,
                    padding: "0 12px",
                    borderRadius: 999,
                    background: "var(--white)",
                    color: "var(--fg-1)",
                    font: "var(--text-micro)",
                    letterSpacing: "var(--ls-mono)",
                    textTransform: "uppercase",
                  }}
                >
                  {`Step ${String(carousel.step + 1).padStart(2, "0")} / 05`}
                </span>
                {current.stat ? (
                  <span
                    style={{
                      position: "absolute",
                      right: 16,
                      top: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      height: 28,
                      padding: "0 12px",
                      borderRadius: 999,
                      background: "var(--blue)",
                      color: "var(--white)",
                      font: "var(--text-micro)",
                      letterSpacing: "var(--ls-mono)",
                      textTransform: "uppercase",
                    }}
                  >
                    {current.stat}
                  </span>
                ) : null}
              </div>
              <div style={{ padding: 28 }}>
                <h3 style={{ font: "var(--text-h3)", letterSpacing: "var(--ls-heading)", margin: 0 }}>{current.title}</h3>
                <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,.6)", textWrap: "pretty" }}>{current.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--gutter) 128px", scrollMarginTop: 80 }}>
        <SectionDivider label="Transparent pricing" />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, margin: "48px 0 56px" }}>
          <h2 style={{ font: "var(--text-h1)", fontSize: "clamp(40px,5.4vw,64px)", letterSpacing: "var(--ls-heading)", margin: 0, maxWidth: 640, textWrap: "balance" }}>
            Two ways to{" "}
            <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--blue)" }}>pay</em>.
          </h2>
          <p style={{ margin: 0, maxWidth: 340, color: "var(--fg-2)", textWrap: "pretty" }}>
            Pick the tariff that fits how you work. Secure payments and support are included in both.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 36,
              borderRadius: "var(--radius-xl)",
              background: "var(--white)",
              boxShadow: "inset 0 0 0 1.5px var(--blue), var(--shadow-float)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: "var(--blue-100)",
                  color: "var(--blue)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Percent size={20} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 24,
                  padding: "0 10px",
                  borderRadius: 999,
                  background: "var(--blue)",
                  color: "var(--white)",
                  font: "var(--text-micro)",
                  letterSpacing: "var(--ls-mono)",
                  textTransform: "uppercase",
                }}
              >
                Recommended
              </span>
            </div>
            <h3 style={{ font: "var(--text-h3)", letterSpacing: "var(--ls-heading)", margin: "28px 0 0" }}>Commission per order</h3>
            <p style={{ margin: "8px 0 0", color: "var(--fg-2)", textWrap: "pretty" }}>You only pay after you receive an order. Responding is free.</p>
            <div style={{ font: "var(--text-h2)", fontSize: 36, letterSpacing: "var(--ls-heading)", margin: "28px 0 0", paddingBottom: 28, borderBottom: `1px solid ${HAIRLINE}` }}>
              Pay on{" "}
              <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--blue)" }}>success</em>
            </div>
            <ul style={{ listStyle: "none", margin: "24px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {PLAN_A.map((item) => (
                <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", color: "var(--fg-1)" }}>
                  <Check size={16} strokeWidth={1.5} color="var(--blue)" aria-hidden="true" style={{ paddingTop: 3, flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 32 }}>
              <ButtonLink href={proCtaHref} size="lg" full>
                Start with commission
              </ButtonLink>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: 36, borderRadius: "var(--radius-xl)", background: "var(--white)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: "var(--ink-100)",
                  color: "var(--fg-1)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CreditCard size={20} strokeWidth={1.5} aria-hidden="true" />
              </span>
            </div>
            <h3 style={{ font: "var(--text-h3)", letterSpacing: "var(--ls-heading)", margin: "28px 0 0" }}>Pay per response</h3>
            <p style={{ margin: "8px 0 0", color: "var(--fg-2)", textWrap: "pretty" }}>Pay a small fee to send an offer to a client.</p>
            <div style={{ font: "var(--text-h2)", fontSize: 36, letterSpacing: "var(--ls-heading)", margin: "28px 0 0", paddingBottom: 28, borderBottom: `1px solid ${HAIRLINE}` }}>
              Small fee
            </div>
            <ul style={{ listStyle: "none", margin: "24px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {PLAN_B.map((item) => (
                <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", color: "var(--fg-2)" }}>
                  <Check size={16} strokeWidth={1.5} color="var(--fg-3)" aria-hidden="true" style={{ paddingTop: 3, flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "auto", paddingTop: 32 }}>
              <ButtonLink href={proCtaHref} variant="secondary" size="lg" full>
                Pay as you go
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--gutter) 128px", scrollMarginTop: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: "48px 64px", alignItems: "start" }}>
          <div style={{ position: "sticky", top: 96, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <h2 style={{ font: "var(--text-h2)", letterSpacing: "var(--ls-heading)", margin: 0, textWrap: "balance" }}>
              Questions,{" "}
              <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--blue)" }}>answered</em>.
            </h2>
            <p style={{ margin: "16px 0 28px", maxWidth: 360, color: "var(--fg-2)", textWrap: "pretty" }}>
              Everything you need to know about working on QuickHands. <span style={{ color: "var(--fg-3)" }}>Can&apos;t find it? Our support team can help.</span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <ButtonLink href={SIGN_UP_HREF} variant="primary" size="md">
                Sign up
              </ButtonLink>
              <ButtonLink href="mailto:support@quickhands.com" variant="ghost" size="md" iconRight>
                Contact support
              </ButtonLink>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${HAIRLINE}` }}>
            {FAQS.map(([question, answer], index) => {
              const open = openFaq === index
              const Icon = open ? Minus : Plus
              return (
                <div key={question} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq((current) => (current === index ? -1 : index))}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 24,
                      padding: "22px 0",
                      border: 0,
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      font: "500 17px/1.35 var(--font-sans)",
                      letterSpacing: "var(--ls-tight)",
                      color: "var(--fg-1)",
                    }}
                  >
                    <span>{question}</span>
                    <Icon size={16} strokeWidth={1.5} color="var(--fg-2)" aria-hidden="true" style={{ flexShrink: 0 }} />
                  </button>
                  {open ? (
                    <p style={{ margin: "-6px 0 22px", maxWidth: 560, color: "var(--fg-2)", textWrap: "pretty" }}>{answer}</p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--gutter) 24px" }}>
        <div
          style={{
            background: "var(--blue)",
            color: "var(--white)",
            borderRadius: "var(--radius-xl)",
            padding: "clamp(56px,7vw,96px) clamp(28px,5vw,64px)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 32,
          }}
        >
          <div>
            <Tag inverse>Ready to get started?</Tag>
            <h2 style={{ font: "var(--text-h1)", fontSize: "clamp(40px,5.4vw,64px)", letterSpacing: "var(--ls-heading)", margin: "24px 0 0", maxWidth: 680, textWrap: "balance" }}>
              Join specialists already{" "}
              <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: "#AFC0F5" }}>earning</em> on
              QuickHands.
            </h2>
          </div>
          <ButtonLink href={proCtaHref} variant="inverse" size="lg" iconRight>
            Get started — it&apos;s free
          </ButtonLink>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--gutter) 24px" }}>
        <div style={{ background: "var(--ink-950)", color: "var(--white)", borderRadius: "var(--radius-xl)", padding: "clamp(40px,5vw,64px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "48px 64px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: "1 1 280px", maxWidth: 340 }}>
              <span style={{ font: "600 22px/1 var(--font-sans)", letterSpacing: "-0.05em" }}>quickhands</span>
              <p style={{ margin: 0, color: "rgba(255,255,255,.6)", textWrap: "pretty" }}>
                The marketplace for clients and local specialists to connect, agree and get jobs done.
              </p>
              <a
                href="https://play.google.com/store/search?q=QuickHands&c=apps"
                target="_blank"
                rel="noopener"
                aria-label="Get it on Google Play"
                className="qh-pro-play"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  width: "fit-content",
                  padding: "10px 18px 10px 14px",
                  borderRadius: 999,
                  boxShadow: `inset 0 0 0 1px ${INVERSE_LINE}`,
                  textDecoration: "none",
                  color: "var(--white)",
                }}
              >
                <img src="/design/professionals/google-play.svg" alt="" style={{ width: 20, height: 20, filter: "invert(1)" }} />
                <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: "rgba(255,255,255,.5)" }}>
                    Get it on
                  </span>
                  <span style={{ font: "500 14px/1 var(--font-sans)" }}>Google Play</span>
                </span>
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(140px,180px))", gap: "40px 48px" }}>
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <span style={{ font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: 6 }}>
                    {column.title}
                  </span>
                  {column.links.map((link) =>
                    isInternalHref(link.href) ? (
                      <Link key={link.label} href={link.href} className="qh-pro-foot-link">
                        {link.label}
                      </Link>
                    ) : (
                      <a key={link.label} href={link.href} className="qh-pro-foot-link">
                        {link.label}
                      </a>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 16,
              marginTop: 64,
              paddingTop: 24,
              borderTop: `1px solid ${INVERSE_LINE}`,
              font: "var(--text-micro)",
              letterSpacing: "var(--ls-mono)",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.45)",
            }}
          >
            <span>© 2026 Quickhands, Inc.</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              <Link href="/privacy-policy" className="qh-pro-foot-bottom" style={{ textDecoration: "none" }}>
                Privacy
              </Link>
              <Link href="/privacy-policy" className="qh-pro-foot-bottom" style={{ textDecoration: "none" }}>
                Terms
              </Link>
              <button
                type="button"
                className="qh-pro-foot-bottom"
                onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT))}
              >
                Cookie preferences
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
