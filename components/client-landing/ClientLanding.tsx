"use client"

import { useEffect, useState, type CSSProperties, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {
  ArrowUpRight,
  BadgeCheck,
  BadgePercent,
  Briefcase,
  CalendarClock,
  ChevronDown,
  ClipboardList,
  Clock,
  Droplets,
  Drill,
  GraduationCap,
  Hammer,
  Lock,
  MapPin,
  Menu,
  MessageSquareLock,
  Minus,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  UserRoundSearch,
  Wallet,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { authFontClassName } from "@/components/auth/fonts"
import { timeAgo } from "@/components/app-shell/feed"
import { useDitherArc } from "@/components/client-landing/useDitherArc"
import { getApiUrl } from "@/lib/fetch-client"
import { listJobs, type Job } from "@/lib/jobs-api"
import { searchSpecialists, type SpecialistSummary } from "@/lib/specialists-api"

const ICONS: Record<string, LucideIcon> = {
  hammer: Hammer,
  truck: Truck,
  zap: Zap,
  package: Package,
  droplets: Droplets,
  sparkles: Sparkles,
  drill: Drill,
  "graduation-cap": GraduationCap,
  "clipboard-list": ClipboardList,
  "user-round-search": UserRoundSearch,
  "badge-check": BadgeCheck,
  "shield-check": ShieldCheck,
  "map-pin": MapPin,
  "message-square-lock": MessageSquareLock,
  "calendar-clock": CalendarClock,
  wallet: Wallet,
  briefcase: Briefcase,
  lock: Lock,
  "badge-percent": BadgePercent,
  "arrow-up-right": ArrowUpRight,
  clock: Clock,
  star: Star,
  search: Search,
  "chevron-down": ChevronDown,
  minus: Minus,
  plus: Plus,
  text: Menu,
}

const SANS = "var(--font-geist), ui-sans-serif, system-ui, sans-serif"
const MONO = "var(--font-geist-mono), ui-monospace, Menlo, monospace"
const SERIF = "var(--font-instrument-serif), ui-serif, Georgia, serif"

const GREEN = "#108600"
const GREEN_HOVER = "#0D6E00"
const GREEN_LIGHT = "#7BD96B"
const INK = {
  950: "#0A0A0B",
  900: "#141416",
  600: "#4A4A50",
  500: "#6E6E75",
  400: "#9A9AA0",
  200: "#E4E4E6",
  100: "#EFEFF0",
  50: "#F6F6F5",
}
const PAPER = "#FBFBFA"
const HAIRLINE = "rgba(10,10,11,.08)"
const DEFAULT_BORDER = "rgba(10,10,11,.12)"
const INVERSE_BORDER = "rgba(255,255,255,.12)"
const SHADOW_FLOAT = "0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14),0 0 0 1px rgba(10,10,11,.08)"
const SHADOW_SM = "0 1px 2px rgba(10,10,11,.04),0 0 0 1px rgba(10,10,11,.08)"
const CONTAINER = 1200
const GUTTER = 24
const EASE = "cubic-bezier(.22,1,.36,1)"

const MEGA_ITEMS = [
  { icon: "hammer", label: "Handyman" },
  { icon: "truck", label: "Moving help" },
  { icon: "zap", label: "Electrician" },
  { icon: "package", label: "Pickups & deliveries" },
  { icon: "droplets", label: "Plumbing" },
  { icon: "sparkles", label: "Home & office cleaning" },
  { icon: "drill", label: "Installations" },
  { icon: "graduation-cap", label: "Tutoring & personal" },
]

const STEPS_CAROUSEL = [
  { icon: "clipboard-list", title: "Post a task", desc: "Tell us what you need." },
  { icon: "user-round-search", title: "Find a specialist", desc: "Choose the right person." },
  { icon: "badge-check", title: "Get it done", desc: "Simple from start to finish." },
]

const FAQS: [string, string][] = [
  [
    "Do I have to pay to use QuickHands?",
    "No — the platform is free for clients. We connect you with the right specialist, and you only pay them once the job is done and you're happy with it.",
  ],
  [
    "Is there any risk of losing my money?",
    "No. To protect you from scams or dishonest behaviour, all payments are made securely through the app.",
  ],
  [
    "Why is paying through the app safe?",
    "Your payment is held securely until you approve the completed task. If the work doesn't meet your expectations, your money stays protected.",
  ],
  [
    "Why not find someone on my own?",
    "QuickHands saves you time and money, with verified specialists across a wide range of trades — and peace of mind built in.",
  ],
]

const STEPS = [
  {
    n: "01",
    label: "Post",
    title: "Post what you need done",
    desc: "Describe the task, add a location and timing. Takes less than two minutes.",
    image: "https://images.pexels.com/photos/6260134/pexels-photo-6260134.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "A person typing a task description into a phone",
  },
  {
    n: "02",
    label: "Match",
    title: "Find people who can help",
    desc: "We surface nearby specialists who do exactly this kind of work.",
    image: "https://images.pexels.com/photos/7283717/pexels-photo-7283717.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Hands browsing a laptop",
  },
  {
    n: "03",
    label: "Agree",
    title: "Choose the right person",
    desc: "Compare profiles, ratings and pricing, then agree on the details.",
    image: "https://images.pexels.com/photos/7578896/pexels-photo-7578896.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Two people shaking hands outside a home",
  },
  {
    n: "04",
    label: "Done",
    title: "Get the task completed",
    desc: "Approve the work and pay securely once you're happy.",
    image: "https://images.pexels.com/photos/13432295/pexels-photo-13432295.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "People relaxing at home after a task is finished",
  },
]

const CATEGORIES = [
  {
    n: "01",
    title: "Home & repairs",
    tagline: "Handymen, electricians, plumbers, installers and general repairs.",
    tags: ["Handyman", "Electrician", "Plumbing", "Installations"],
    image: "https://images.pexels.com/photos/5691544/pexels-photo-5691544.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A specialist drilling a window frame",
    query: "Handyman",
  },
  {
    n: "02",
    title: "Moving & delivery",
    tagline: "Moving help, pickups, deliveries, errands and local transport.",
    tags: ["Moving help", "Pickups", "Deliveries", "Errands"],
    image: "https://images.pexels.com/photos/5025669/pexels-photo-5025669.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A specialist carrying moving boxes beside a van",
    query: "Moving help",
  },
  {
    n: "03",
    title: "Cleaning",
    tagline: "Home, office, deep cleans and recurring visits.",
    tags: ["Home", "Office", "Deep clean", "Recurring"],
    image: "https://images.pexels.com/photos/7641484/pexels-photo-7641484.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A cleaning specialist mopping a floor",
    query: "Cleaning",
  },
  {
    n: "04",
    title: "Personal & other",
    tagline: "Beauty, tutoring, gardening, admin help and everyday assistance.",
    tags: ["Beauty", "Tutoring", "Gardening", "Admin help"],
    image: "https://images.pexels.com/photos/6502822/pexels-photo-6502822.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A tutor helping a student",
    query: "Tutoring",
  },
]

const TRUST = [
  { icon: "shield-check", label: "Verified specialists" },
  { icon: "map-pin", label: "Local professionals" },
  { icon: "message-square-lock", label: "Secure communication" },
  { icon: "calendar-clock", label: "Flexible scheduling" },
]

const PERKS = [
  { icon: "wallet", label: "Set your own rate" },
  { icon: "calendar-clock", label: "Work when you want" },
  { icon: "shield-check", label: "Get paid securely" },
]

const POPULAR = ["Plumbing", "Deep clean", "Moving help", "Electrician", "Tutoring"]

const SOCIAL = [
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@quickhands.app",
    path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.79 1.52V6.75a4.85 4.85 0 0 1-1.02-.06z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/quickhandsafrica",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/181GvFUCXq/?mibextid=wwXIfr",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
]

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "For clients",
    links: [
      { label: "Post a task", href: "/post-job" },
      { label: "How to hire", href: "#how-it-works" },
      { label: "Enterprise", href: "mailto:business@quickhands.com" },
    ],
  },
  {
    title: "For specialists",
    links: [
      { label: "Create profile", href: "/sign-up#pro" },
      { label: "How to win jobs", href: "/professionals#how" },
      { label: "Success stories", href: "/professionals#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#how-it-works" },
      { label: "Feedback", href: "mailto:feedback@quickhands.com" },
      { label: "Terms", href: "/legal#terms" },
      { label: "Privacy", href: "/privacy-policy" },
    ],
  },
]

type Stats = { specialists: number; jobsPosted: number; categories: number; averageRating: number | null }

function useMarketplaceStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch(getApiUrl("/api/stats/public"))
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!cancelled && payload?.success) setStats(payload.data as Stats)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])
  return stats
}

function Icon({ name, size, color, style }: { name: string; size: number; color?: string; style?: CSSProperties }) {
  const Component = ICONS[name]
  if (!Component) return null
  return <Component size={size} color={color} strokeWidth={1.5} aria-hidden="true" style={style} />
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

export function ClientLanding() {
  const router = useRouter()
  const { isLoaded, isSignedIn, user } = useUser()
  const canvasRef = useDitherArc()
  const stats = useMarketplaceStats()

  const [scrolled, setScrolled] = useState(false)
  const [mega, setMega] = useState(false)
  const [forceOpen, setForceOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const [step, setStep] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const [time, setTime] = useState("")
  const [specialists, setSpecialists] = useState<SpecialistSummary[] | null>(null)
  const [latestJob, setLatestJob] = useState<Job | null>(null)

  useEffect(() => {
    const tick = () =>
      setTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Harare", hour: "2-digit", minute: "2-digit" }).format(new Date()))
    tick()
    const clock = window.setInterval(tick, 30_000)
    return () => window.clearInterval(clock)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 120)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => setStep((current) => (current + 1) % STEPS_CAROUSEL.length), 3400)
    return () => window.clearInterval(timer)
  }, [paused])

  useEffect(() => {
    let cancelled = false
    searchSpecialists("", 3).then((result) => {
      if (!cancelled) setSpecialists(result.unavailable ? [] : result.specialists)
    })
    listJobs(new URLSearchParams({ limit: "1" })).then((jobs) => {
      if (!cancelled) setLatestJob(jobs[0] ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const compact = scrolled && !forceOpen && !mega
  const navTop = scrolled ? 12 : 60
  const isSpecialistAccount = user?.unsafeMetadata?.appRole === "freelancer"
  const signedIn = isLoaded && !!isSignedIn
  const firstName = user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || ""
  const specialistHref = signedIn && isSpecialistAccount ? "/dashboard" : "/professionals"

  const closeMenu = () => {
    setMega(false)
    setForceOpen(false)
  }

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = String(new FormData(event.currentTarget).get("q") || "").trim()
    router.push(query ? `/specialists?q=${encodeURIComponent(query)}` : "/specialists")
  }

  const currentStep = STEPS_CAROUSEL[step]

  return (
    <div className={authFontClassName} style={{ fontFamily: SANS, color: INK[950], background: PAPER, minHeight: "100vh", overflowX: "clip" }}>
      {/* Audience strip */}
      <div style={{ borderBottom: `1px solid ${HAIRLINE}`, background: INK[50] }}>
        <div
          style={{
            maxWidth: CONTAINER,
            margin: "0 auto",
            padding: `0 ${GUTTER}px`,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div role="radiogroup" aria-label="Audience" style={{ display: "inline-flex", padding: 3, borderRadius: 999, background: "#EFEFF0", gap: 2 }}>
            {[
              { value: "clients", label: "For clients", href: null },
              { value: "pros", label: "For professionals", href: "/professionals" },
            ].map((option) => {
              const active = option.value === "clients"
              const common = {
                height: 28,
                padding: "0 14px",
                borderRadius: 999,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 500,
                background: active ? "#FFFFFF" : "transparent",
                color: active ? INK[950] : INK[500],
                boxShadow: active ? "0 0 0 1px rgba(10,10,11,.08)" : "none",
                display: "inline-flex",
                alignItems: "center",
                border: 0,
                textDecoration: "none",
              } as CSSProperties
              return option.href ? (
                <Link key={option.value} href={option.href} role="radio" aria-checked={false} style={common}>
                  {option.label}
                </Link>
              ) : (
                <span key={option.value} role="radio" aria-checked={active} style={common}>
                  {option.label}
                </span>
              )
            })}
          </div>
          <span style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: INK[400] }}>
            <span>Harare</span>
            <span style={{ color: INK[600], fontVariantNumeric: "tabular-nums" }}>{time}</span>
          </span>
        </div>
      </div>

      {/* Floating nav */}
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
          transition: `top 240ms ${EASE}`,
        }}
      >
        <div
          onMouseLeave={() => {
            setMega(false)
            setForceOpen(false)
          }}
          style={{
            pointerEvents: "auto",
            width: compact ? 300 : 960,
            maxWidth: "100%",
            boxSizing: "border-box",
            background: "#FFFFFF",
            borderRadius: 20,
            boxShadow: scrolled || mega ? SHADOW_FLOAT : SHADOW_SM,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: `width 240ms ${EASE}, box-shadow 240ms ${EASE}`,
          }}
        >
          {compact ? (
            <div style={{ width: 300, maxWidth: "calc(100vw - 32px)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, height: 56, padding: "0 8px 0 12px" }}>
              <Link href="/" aria-label="QuickHands home" style={{ display: "block", width: 32, height: 32, borderRadius: 9, overflow: "hidden", flexShrink: 0 }}>
                <img src="/quickhands.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.4)", display: "block" }} />
              </Link>
              <button
                type="button"
                onMouseEnter={() => {
                  setForceOpen(true)
                  setMega(true)
                }}
                onClick={() => {
                  setForceOpen(true)
                  setMega(true)
                }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 36, padding: "0 12px", border: 0, borderRadius: 999, background: "transparent", fontFamily: SANS, fontWeight: 500, fontSize: 14, color: INK[950], cursor: "pointer" }}
              >
                <Icon name="text" size={15} color={GREEN} />
                Menu
              </button>
              <Link href="/post-job" style={ctaStyle}>
                Post a task
              </Link>
            </div>
          ) : (
            <div style={{ width: "min(960px, calc(100vw - 32px))", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, height: 64, padding: "0 10px 0 22px" }}>
                <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none", color: INK[950], flexShrink: 0 }}>
                  <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, lineHeight: 1, letterSpacing: "-0.05em" }}>quickhands</span>
                </Link>
                <nav style={{ display: "flex", gap: 2, flex: 1, minWidth: 0 }}>
                  <button
                    type="button"
                    onMouseEnter={() => setMega(true)}
                    onClick={() => setMega((current) => !current)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      height: 36,
                      padding: "0 12px",
                      border: 0,
                      borderRadius: 999,
                      background: mega ? INK[100] : "transparent",
                      fontFamily: SANS,
                      fontWeight: 500,
                      fontSize: 14,
                      color: INK[950],
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "background 140ms",
                    }}
                  >
                    Tasks
                    <ChevronDown size={14} color={INK[400]} style={{ transform: mega ? "rotate(180deg)" : "none", transition: `transform 240ms ${EASE}` }} />
                  </button>
                  <a href="#how-it-works" onMouseEnter={() => setMega(false)} style={navLinkStyle}>
                    How it works
                  </a>
                  <Link href={specialistHref} onMouseEnter={() => setMega(false)} style={navLinkStyle}>
                    Become a specialist
                  </Link>
                </nav>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  {signedIn ? (
                    <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 40, padding: "0 12px 0 4px", borderRadius: 999, textDecoration: "none", color: INK[950], fontFamily: SANS, fontWeight: 500, fontSize: 14 }}>
                      <span style={{ width: 32, height: 32, borderRadius: "50%", background: GREEN, color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 500, fontSize: 12 }}>
                        {initialsOf(firstName || "U")}
                      </span>
                      {firstName}
                    </Link>
                  ) : (
                    <Link href="/sign-in" style={{ display: "inline-flex", alignItems: "center", height: 40, padding: "0 14px", borderRadius: 999, textDecoration: "none", color: INK[950], fontFamily: SANS, fontWeight: 500, fontSize: 14 }}>
                      Sign in
                    </Link>
                  )}
                  <Link href="/post-job" style={ctaStyle}>
                    Post a task
                  </Link>
                </div>
              </div>
              {mega ? (
                <>
                  <div style={{ margin: "0 22px", borderTop: `1px solid ${HAIRLINE}` }} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "2px 24px", padding: "16px 12px 8px" }}>
                    {MEGA_ITEMS.map((item) => (
                      <Link
                        key={item.label}
                        href={`/specialists?q=${encodeURIComponent(item.label)}`}
                        onClick={closeMenu}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 10, textDecoration: "none", color: INK[950] }}
                      >
                        <Icon name={item.icon} size={16} color={GREEN} style={{ flexShrink: 0 }} />
                        <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 14, lineHeight: 1.3, letterSpacing: "-0.015em" }}>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24, padding: "12px 22px 22px", alignItems: "center" }}>
                    <Link href="/specialists" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: 16, borderRadius: 14, background: INK[50], overflow: "hidden", textDecoration: "none", color: INK[950] }}>
                      <img src="/design/client/megamenu-thumb.jpg" alt="" style={{ width: 88, height: 80, objectFit: "cover", display: "block", flexShrink: 0, filter: "saturate(.72)" }} />
                      <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 15, lineHeight: 1.3, letterSpacing: "-0.015em" }}>Browse all specialists</span>
                        <span style={{ fontSize: 13, color: INK[600] }}>Find someone near you</span>
                      </span>
                    </Link>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link href="/post-job" onClick={closeMenu} style={menuRowStyle}>
                        <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 14, lineHeight: 1.3, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>Post a task</span>
                        <span style={{ fontSize: 12, color: INK[400] }}>Takes less than two minutes</span>
                      </Link>
                      <Link href={specialistHref} onClick={closeMenu} style={{ ...menuRowStyle, borderBottom: 0 }}>
                        <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 14, lineHeight: 1.3, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>Become a specialist</span>
                        <span style={{ fontSize: 12, color: INK[400] }}>Turn your skills into income</span>
                      </Link>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <div aria-hidden="true" style={{ position: "absolute", top: 44, right: 0, width: "min(52vw, 860px)", height: "min(760px, 88vh)", pointerEvents: "none", zIndex: 0 }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated" }} />
      </div>
      <section style={{ position: "relative", zIndex: 1, maxWidth: CONTAINER, margin: "0 auto", padding: `184px ${GUTTER}px 72px` }}>
        <span style={tagStyle}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
          Free for clients
        </span>
        <h1 style={{ fontFamily: SANS, fontWeight: 500, fontSize: "clamp(48px, 7.4vw, 88px)", lineHeight: 0.98, letterSpacing: "-0.045em", margin: "32px 0 0", maxWidth: 960, textWrap: "balance" }}>
          Get tasks done. Find{" "}
          <em style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: GREEN }}>trusted</em> help, right when you need it.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 560, margin: "28px 0 40px", textWrap: "pretty" }}>
          QuickHands connects you with reliable local specialists for cleaning, repairs, beauty and trades.{" "}
          <span style={{ color: INK[400] }}>Post what you need and hear back fast.</span>
        </p>

        <form onSubmit={onSearch} role="search" style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 600, padding: "6px 6px 6px 20px", borderRadius: 999, background: "#FFFFFF", boxShadow: SHADOW_FLOAT }}>
          <Search size={18} color={INK[400]} aria-hidden="true" style={{ flexShrink: 0 }} />
          <input
            type="text"
            name="q"
            placeholder="Plumber, electrician, cleaner…"
            aria-label="Search for a specialist"
            style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", fontFamily: SANS, fontSize: 16, color: INK[950], height: 44 }}
          />
          <button type="submit" style={{ height: 44, padding: "0 22px", border: 0, borderRadius: 999, background: GREEN, color: "#FFFFFF", fontFamily: SANS, fontWeight: 500, fontSize: 14, letterSpacing: "-0.01em", cursor: "pointer" }}>
            Search
          </button>
        </form>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 16 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: INK[400], marginRight: 4 }}>Popular</span>
          {POPULAR.map((label) => (
            <Link key={label} href={`/specialists?q=${encodeURIComponent(label)}`} style={{ display: "inline-flex", alignItems: "center", height: 28, padding: "0 12px", borderRadius: 999, boxShadow: `inset 0 0 0 1px ${DEFAULT_BORDER}`, fontFamily: SANS, fontWeight: 500, fontSize: 13, color: INK[600], textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Image + how-it-works carousel */}
      <section style={{ maxWidth: CONTAINER, margin: "0 auto", padding: `0 ${GUTTER}px` }}>
        <div style={{ position: "relative", width: "100%", height: "clamp(360px, 43vw, 520px)", borderRadius: 20, overflow: "hidden", background: INK[900] }}>
          <img src="/design/client/carpenter.jpg" alt="A carpenter operating a circular saw at an outdoor site" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", filter: "saturate(.72) contrast(1.02)" }} />
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ position: "absolute", left: 24, bottom: 24, width: 300, maxWidth: "calc(100% - 48px)", boxSizing: "border-box", padding: 20, borderRadius: 14, background: "#FFFFFF", boxShadow: SHADOW_FLOAT }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: INK[400] }}>How QuickHands works</span>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", color: INK[400], fontVariantNumeric: "tabular-nums" }}>
                0{step + 1} / 03
              </span>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginTop: 18, minHeight: 52 }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: INK[100], display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={currentStep.icon} size={18} />
              </span>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 17, letterSpacing: "-0.015em" }}>{currentStep.title}</div>
                <div style={{ fontSize: 13, color: INK[600], marginTop: 4 }}>{currentStep.desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 18 }}>
              {STEPS_CAROUSEL.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Step ${index + 1}: ${item.title}`}
                  onClick={() => setStep(index)}
                  style={{
                    height: 4,
                    width: index === step ? 24 : 8,
                    border: 0,
                    padding: 0,
                    borderRadius: 999,
                    background: index === step ? GREEN : INK[200],
                    cursor: "pointer",
                    transition: `width 240ms ${EASE}, background 240ms ${EASE}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section style={{ maxWidth: CONTAINER, margin: "0 auto", padding: `48px ${GUTTER}px 120px` }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 1, background: HAIRLINE, borderRadius: 14, overflow: "hidden", boxShadow: "0 0 0 1px rgba(10,10,11,.08)" }}>
          {TRUST.map((item) => (
            <li key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 24px", background: "#FFFFFF", listStyle: "none" }}>
              <Icon name={item.icon} size={18} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 15, lineHeight: 1.3, letterSpacing: "-0.015em" }}>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ maxWidth: CONTAINER, margin: "0 auto", padding: `0 ${GUTTER}px 128px`, scrollMarginTop: 80 }}>
        <SectionDivider label="How it works" />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, margin: "48px 0 56px" }}>
          <h2 style={headingStyle}>
            Four steps. <em style={accentEmStyle}>No</em> friction.
          </h2>
          <p style={{ margin: 0, maxWidth: 340, color: INK[600], textWrap: "pretty" }}>QuickHands strips out the back-and-forth. Post once, meet the right specialist, get it done.</p>
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "48px 24px" }}>
          {STEPS.map((item) => (
            <li key={item.n} style={{ display: "flex", flexDirection: "column", listStyle: "none" }}>
              <div style={{ aspectRatio: "4 / 5", borderRadius: 14, overflow: "hidden", background: INK[100] }}>
                <img src={item.image} alt={item.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(.72) contrast(1.02)" }} />
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 20, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: INK[400] }}>
                <span>{item.n}</span>
                <span style={{ width: 16, height: 1, background: DEFAULT_BORDER }} />
                <span>{item.label}</span>
              </div>
              <h3 style={{ fontFamily: SANS, fontWeight: 500, fontSize: 20, lineHeight: 1.3, letterSpacing: "-0.015em", margin: "10px 0 0" }}>{item.title}</h3>
              <p style={{ margin: "6px 0 0", color: INK[600], textWrap: "pretty" }}>{item.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Categories */}
      <section id="tasks" style={{ maxWidth: CONTAINER, margin: "0 auto", padding: `0 ${GUTTER}px 128px`, scrollMarginTop: 80 }}>
        <SectionDivider label="Popular tasks" />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, margin: "48px 0 56px" }}>
          <h2 style={headingStyle}>
            What can you get <em style={accentEmStyle}>done</em>?
          </h2>
          <p style={{ margin: 0, maxWidth: 340, color: INK[600], textWrap: "pretty" }}>From a leaky tap to a full house move — the tasks people get done on QuickHands every day.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: "56px 24px" }}>
          {CATEGORIES.map((category) => (
            <Link key={category.title} href={`/specialists?q=${category.query}`} style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: INK[950] }}>
              <div style={{ aspectRatio: "16 / 10", borderRadius: 14, overflow: "hidden", background: INK[100] }}>
                <img src={category.image} alt={category.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(.72) contrast(1.02)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginTop: 20 }}>
                <h3 style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.035em", margin: 0 }}>{category.title}</h3>
                <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", color: INK[400] }}>{category.n}</span>
              </div>
              <p style={{ margin: "8px 0 0", color: INK[600], textWrap: "pretty" }}>{category.tagline}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
                {category.tags.map((tag) => (
                  <span key={tag} style={tagStyle}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Marketplace preview */}
      <section style={{ maxWidth: CONTAINER, margin: "0 auto", padding: `0 ${GUTTER}px 128px` }}>
        <div style={{ background: INK[950], color: "#FFFFFF", borderRadius: 20, padding: "clamp(40px, 6vw, 88px) clamp(24px, 5vw, 64px)" }}>
          <SectionDivider label="See it in action" inverse />
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, margin: "48px 0 56px" }}>
            <h2 style={{ ...headingStyle, color: "#FFFFFF" }}>
              Post a task. Meet your <em style={{ ...accentEmStyle, color: GREEN_LIGHT }}>match</em>.
            </h2>
            <p style={{ margin: 0, maxWidth: 340, color: "rgba(255,255,255,.6)", textWrap: "pretty" }}>A real task, matched with local specialists ready to help.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: 24, alignItems: "start" }}>
            <div style={{ padding: 28, borderRadius: 14, background: INK[900], boxShadow: `inset 0 0 0 1px ${INVERSE_BORDER}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,.72)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2F54FF", boxShadow: "0 0 0 3px rgba(47,84,255,.25)" }} />
                  Task posted
                </span>
                {latestJob ? (
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,.45)" }}>{timeAgo(latestJob.createdAt)}</span>
                ) : null}
              </div>
              {latestJob ? (
                <>
                  <h3 style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.035em", margin: "28px 0 0" }}>{latestJob.serviceType}</h3>
                  {latestJob.additionalInfo ? (
                    <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,.6)", maxWidth: "42ch", textWrap: "pretty" }}>{latestJob.additionalInfo}</p>
                  ) : null}
                  <div style={{ display: "flex", gap: 20, marginTop: 28, paddingTop: 20, borderTop: `1px solid ${INVERSE_BORDER}`, fontSize: 13, color: "rgba(255,255,255,.72)" }}>
                    {latestJob.location?.label || latestJob.location?.city ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} aria-hidden="true" />
                        {latestJob.location.label || latestJob.location.city}
                      </span>
                    ) : null}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Clock size={14} aria-hidden="true" />
                      {latestJob.applicantCount === 0 ? "No applicants yet" : `${latestJob.applicantCount} applied`}
                    </span>
                  </div>
                </>
              ) : (
                <p style={{ margin: "28px 0 0", color: "rgba(255,255,255,.6)" }}>No open tasks yet — be the first to post one.</p>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", borderRadius: 14, boxShadow: `inset 0 0 0 1px ${INVERSE_BORDER}`, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${INVERSE_BORDER}`, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,.45)" }}>
                <span>{specialists && specialists.length > 0 ? `${specialists.length} matches nearby` : "Matches nearby"}</span>
                <span>Rating</span>
              </div>
              {(specialists ?? []).map((specialist) => (
                <div key={specialist.clerkId} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderBottom: `1px solid ${INVERSE_BORDER}` }}>
                  {specialist.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={specialist.imageUrl} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: 48, height: 48, borderRadius: "50%", background: INK[900], display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 500, fontSize: 14, flexShrink: 0 }}>
                      {initialsOf(specialist.name)}
                    </span>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 15, lineHeight: 1.3, letterSpacing: "-0.015em" }}>{specialist.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {specialist.skillList.slice(0, 2).join(" · ") || specialist.tagline}
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginTop: 6 }}>
                      {specialist.reviewSummary.reviewCount} {specialist.reviewSummary.reviewCount === 1 ? "review" : "reviews"}
                    </div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: SANS, fontWeight: 500, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>
                    <Star size={13} aria-hidden="true" />
                    {specialist.reviewSummary.reviewCount > 0 ? specialist.reviewSummary.averageRating.toFixed(1) : "New"}
                  </span>
                </div>
              ))}
              <div style={{ padding: "16px 20px" }}>
                <Link href="/post-job" style={{ ...ctaStyle, display: "flex", justifyContent: "center", height: 40, width: "100%", boxSizing: "border-box" }}>
                  Post your task
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section id="specialists" style={{ maxWidth: CONTAINER, margin: "0 auto", padding: `0 ${GUTTER}px 128px`, scrollMarginTop: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 56, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span style={tagStyle}>For specialists</span>
            <h2 style={{ ...headingStyle, margin: "28px 0 0" }}>
              Turn your skills into <em style={accentEmStyle}>extra</em> income.
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.55, margin: "24px 0 0", maxWidth: 460, textWrap: "pretty" }}>
              Offer your skills locally and connect with people who need your help. <span style={{ color: INK[400] }}>They get things done — you earn by doing them.</span>
            </p>
            <ul style={{ listStyle: "none", margin: "36px 0 0", padding: 0, width: "100%", maxWidth: 460, borderTop: `1px solid ${HAIRLINE}` }}>
              {PERKS.map((perk) => (
                <li key={perk.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${HAIRLINE}` }}>
                  <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 15, lineHeight: 1.3, letterSpacing: "-0.015em" }}>{perk.label}</span>
                  <Icon name={perk.icon} size={16} color={INK[400]} />
                </li>
              ))}
            </ul>
            <Link href={specialistHref} style={{ ...ctaStyle, height: 52, padding: "0 24px", fontSize: 15, marginTop: 36, display: "inline-flex", alignItems: "center", gap: 8 }}>
              Become a specialist
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div style={{ aspectRatio: "4 / 5", borderRadius: 20, overflow: "hidden", background: INK[100] }}>
            <img src="/design/client/specialist-photo.jpg" alt="A specialist holding a wrench while making a repair" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(.72) contrast(1.02)" }} />
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section style={{ maxWidth: CONTAINER, margin: "0 auto", padding: `0 ${GUTTER}px 128px` }}>
        <SectionDivider label="By the numbers" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 48 }}>
          {[
            { value: stats ? String(stats.specialists) : "—", label: "Specialists on QuickHands" },
            { value: stats ? String(stats.categories) : "—", label: "Task categories" },
            { value: stats?.averageRating != null ? stats.averageRating.toFixed(1) : "—", label: "Average specialist rating" },
            { value: stats ? String(stats.jobsPosted) : "—", label: "Tasks posted" },
          ].map((item) => (
            <div key={item.label} style={{ padding: "8px 24px 8px 0", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: "clamp(56px, 6vw, 80px)", lineHeight: 0.98, letterSpacing: "-0.045em", fontVariantNumeric: "tabular-nums" }}>{item.value}</div>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: INK[400] }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: CONTAINER, margin: "0 auto", padding: `0 ${GUTTER}px 128px` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: "48px 64px", alignItems: "start" }}>
          <div style={{ position: "sticky", top: 96 }}>
            <h2 style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.035em", margin: 0, textWrap: "balance" }}>
              Questions, <em style={accentEmStyle}>answered</em>.
            </h2>
            <p style={{ margin: "16px 0 0", maxWidth: 360, color: INK[600], textWrap: "pretty" }}>Everything you need to know about working with specialists on QuickHands.</p>
          </div>
          <div style={{ borderTop: `1px solid ${HAIRLINE}` }}>
            {FAQS.map(([question, answer], index) => {
              const open = openFaq === index
              return (
                <div key={question} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    aria-expanded={open}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, padding: "24px 0", border: 0, background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: SANS, fontWeight: 500, fontSize: 17, lineHeight: 1.35, letterSpacing: "-0.015em", color: INK[950] }}
                  >
                    <span>{question}</span>
                    {open ? <Minus size={16} color={INK[600]} style={{ flexShrink: 0 }} aria-hidden="true" /> : <Plus size={16} color={INK[600]} style={{ flexShrink: 0 }} aria-hidden="true" />}
                  </button>
                  {open ? <p style={{ margin: "-8px 0 24px", maxWidth: 560, color: INK[600], textWrap: "pretty" }}>{answer}</p> : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: CONTAINER, margin: "0 auto", padding: `0 ${GUTTER}px 24px` }}>
        <div style={{ background: INK[950], color: "#FFFFFF", borderRadius: 20, padding: "clamp(56px, 7vw, 96px) clamp(28px, 5vw, 64px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32 }}>
          <div>
            <span style={{ ...tagStyle, background: "transparent", color: "rgba(255,255,255,.72)", boxShadow: `inset 0 0 0 1px ${INVERSE_BORDER}` }}>Ready when you are</span>
            <h2 style={{ ...headingStyle, color: "#FFFFFF", margin: "24px 0 0", maxWidth: 640 }}>
              Got something to do? Let's get it <em style={{ ...accentEmStyle, color: GREEN_LIGHT }}>done</em>.
            </h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/post-job" style={{ ...ctaStyle, height: 52, padding: "0 24px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}>
              Post a task
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link href={specialistHref} style={{ display: "inline-flex", alignItems: "center", height: 52, padding: "0 24px", borderRadius: 999, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.24)", color: "#FFFFFF", fontFamily: SANS, fontWeight: 500, fontSize: 15, textDecoration: "none" }}>
              Become a specialist
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: CONTAINER, margin: "0 auto", padding: `0 ${GUTTER}px 24px` }}>
        <div style={{ background: INK[950], color: "#FFFFFF", borderRadius: 20, padding: "clamp(40px, 5vw, 64px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "48px 64px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: "1 1 280px", maxWidth: 340 }}>
              <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, lineHeight: 1, letterSpacing: "-0.05em" }}>quickhands</span>
              <p style={{ margin: 0, color: "rgba(255,255,255,.6)", textWrap: "pretty" }}>The marketplace for clients and local specialists to connect, agree and get jobs done.</p>
              <a
                href="https://play.google.com/store/search?q=QuickHands&c=apps"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                style={{ display: "inline-flex", alignItems: "center", gap: 12, width: "fit-content", padding: "10px 18px 10px 14px", borderRadius: 999, boxShadow: `inset 0 0 0 1px ${INVERSE_BORDER}`, textDecoration: "none", color: "#FFFFFF" }}
              >
                <img src="/design/client/google-play.svg" alt="" style={{ width: 20, height: 20, filter: "invert(1)" }} />
                <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,.5)" }}>Get it on</span>
                  <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 14 }}>Google Play</span>
                </span>
              </a>
              <div style={{ display: "flex", gap: 8 }}>
                {SOCIAL.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} style={{ width: 36, height: 36, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 0 0 1px ${INVERSE_BORDER}`, color: "rgba(255,255,255,.72)" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
                      <path d={item.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(140px, 180px))", gap: "40px 48px" }}>
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: 6 }}>{column.title}</span>
                  {column.links.map((link) => (
                    <Link key={link.label} href={link.href} style={{ fontSize: 14, color: "rgba(255,255,255,.72)", textDecoration: "none" }}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, marginTop: 64, paddingTop: 24, borderTop: `1px solid ${INVERSE_BORDER}`, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,.45)" }}>
            <span>© 2026 Quickhands, Inc.</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              <Link href="/privacy-policy" style={{ color: "inherit", textDecoration: "none" }}>Privacy</Link>
              <Link href="/legal#terms" style={{ color: "inherit", textDecoration: "none" }}>Terms</Link>
              <Link href="/legal#accessibility" style={{ color: "inherit", textDecoration: "none" }}>Accessibility</Link>
              <Link href="/legal#cookies" style={{ color: "inherit", textDecoration: "none" }}>Cookie preferences</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

const ctaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  padding: "0 18px",
  borderRadius: 999,
  background: GREEN,
  color: "#FFFFFF",
  fontFamily: SANS,
  fontWeight: 500,
  fontSize: 14,
  letterSpacing: "-0.01em",
  textDecoration: "none",
  whiteSpace: "nowrap",
}

const navLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: 36,
  padding: "0 12px",
  borderRadius: 999,
  fontFamily: SANS,
  fontWeight: 500,
  fontSize: 14,
  color: INK[600],
  textDecoration: "none",
  whiteSpace: "nowrap",
}

const menuRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 10,
  padding: "12px 0",
  borderBottom: `1px solid ${HAIRLINE}`,
  textDecoration: "none",
  color: INK[950],
}

const tagStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  height: 24,
  padding: "0 10px",
  borderRadius: 999,
  background: INK[50],
  boxShadow: `inset 0 0 0 1px ${DEFAULT_BORDER}`,
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: INK[600],
  whiteSpace: "nowrap",
}

const headingStyle: CSSProperties = {
  fontFamily: SANS,
  fontWeight: 500,
  fontSize: "clamp(40px, 5.4vw, 64px)",
  lineHeight: 1.05,
  letterSpacing: "-0.035em",
  margin: 0,
  maxWidth: 640,
  textWrap: "balance",
}

const accentEmStyle: CSSProperties = {
  fontFamily: SERIF,
  fontStyle: "italic",
  fontWeight: 400,
  letterSpacing: "-0.02em",
  color: GREEN,
}

function SectionDivider({ label, inverse = false }: { label: string; inverse?: boolean }) {
  const color = inverse ? "rgba(255,255,255,.72)" : INK[600]
  const line = inverse ? INVERSE_BORDER : HAIRLINE
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color }}>
      <span style={{ flex: 1, height: 1, background: line }} />
      {label}
      <span style={{ flex: 1, height: 1, background: line }} />
    </div>
  )
}
