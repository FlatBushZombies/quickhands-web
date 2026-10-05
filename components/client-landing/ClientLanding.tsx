"use client"

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  CalendarClock,
  ChevronDown,
  ClipboardList,
  Clock,
  Droplets,
  Drill,
  GraduationCap,
  Hammer,
  MapPin,
  MessageSquareLock,
  Minus,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Text,
  Truck,
  UserRoundSearch,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { authFontClassName } from "@/components/auth/fonts"
import { OPEN_COOKIE_PREFERENCES_EVENT } from "@/components/cookie-consent/CookieConsent"
import { useDitherArc } from "@/components/client-landing/useDitherArc"
import { LandingNav } from "@/components/client-landing/LandingNav"
import { useMarketplaceStats } from "@/components/client-landing/useMarketplaceStats"
import { Button, Divider, Tag } from "@/components/client-landing/primitives"
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
  "arrow-up-right": ArrowUpRight,
  clock: Clock,
  star: Star,
  search: Search,
  "chevron-down": ChevronDown,
  minus: Minus,
  plus: Plus,
  text: Text,
}

const GREEN = "#108600"
const GREEN_HOVER = "#0D6E00"
const GREEN_LIGHT = "#7BD96B"
/** The design's brand-green override, applied to primary buttons on this page. */
const GREEN_TOKENS = { "--ink-950": GREEN, "--ink-800": GREEN_HOVER } as CSSProperties
const SHADOW_FLOAT = "0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14),0 0 0 1px rgba(10,10,11,.08)"
const SERIF_EM: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 400,
  letterSpacing: "-0.02em",
}
const MICRO: CSSProperties = {
  font: "var(--text-micro)",
  letterSpacing: "var(--ls-mono)",
  textTransform: "uppercase",
}

/** Design stylesheet, scoped to the page root. Hover states live here because the design uses style-hover. */
const CSS = `
.qh-cl{--ink-950:#0A0A0B;--ink-900:#141416;--ink-800:#1F1F22;--ink-600:#4A4A50;--ink-400:#9A9AA0;--ink-200:#E4E4E6;--ink-100:#EFEFF0;--ink-50:#F6F6F5;--paper:#FBFBFA;--white:#FFFFFF;--signal-500:#2F54FF;
--fg-1:var(--ink-950);--fg-2:var(--ink-600);--fg-3:var(--ink-400);
--border-hairline:rgba(10,10,11,.08);--border-default:rgba(10,10,11,.12);--border-inverse:rgba(255,255,255,.12);
--shadow-sm:0 1px 2px rgba(10,10,11,.04),0 0 0 1px rgba(10,10,11,.08);
--shadow-float:0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14),0 0 0 1px rgba(10,10,11,.08);
--shadow-hairline:0 0 0 1px rgba(10,10,11,.08);
--ease-out:cubic-bezier(.22,1,.36,1);--dur-fast:140ms;--dur-base:240ms;--dur-slow:480ms;
--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif;--font-mono:var(--font-geist-mono),ui-monospace,Menlo,monospace;--font-serif:var(--font-instrument-serif),ui-serif,Georgia,serif;
--text-display:500 88px/0.98 var(--font-sans);--text-h1:500 64px/1.05 var(--font-sans);--text-h2:500 44px/1.05 var(--font-sans);--text-h3:500 28px/1.15 var(--font-sans);--text-h4:500 20px/1.3 var(--font-sans);
--text-body-lg:400 18px/1.55 var(--font-sans);--text-body-md:400 15px/1.55 var(--font-sans);--text-small:400 13px/1.45 var(--font-sans);--text-micro:400 11px/1.3 var(--font-mono);
--ls-display:-0.045em;--ls-heading:-0.035em;--ls-tight:-0.015em;--ls-body:-0.005em;--ls-mono:0.06em;
}
.qh-cl input::placeholder{color:var(--ink-400)}
.qh-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:999px;text-decoration:none;cursor:pointer;white-space:nowrap;transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)}
.qh-btn-primary{background:var(--ink-950);color:var(--white)}
.qh-btn-primary:hover{background:var(--ink-800)}
.qh-btn-ghost{background:transparent;color:var(--fg-1)}
.qh-btn-ghost:hover{background:var(--ink-100)}
.qh-seg{background:transparent;color:var(--fg-2)}
.qh-seg:hover{color:var(--fg-1)}
.qh-seg-active{background:var(--white);color:var(--fg-1);box-shadow:var(--shadow-sm)}
.qh-navlink:hover{background:var(--ink-100);color:var(--fg-1)}
.qh-menu-btn:hover{background:var(--ink-100)}
.qh-acct:hover{background:var(--ink-100)}
.qh-mega-tile:hover{background:var(--ink-100)}
.qh-mega-item:hover{background:var(--ink-50)}
.qh-mega-link:hover{color:${GREEN}}
.qh-row:hover{background:rgba(255,255,255,.04)}
.qh-zoom:hover img{transform:scale(1.03)}
.qh-chip:hover{background:var(--ink-100);color:var(--fg-1)}
.qh-search-btn:hover{background:${GREEN_HOVER}}
.qh-search-btn:active{transform:scale(.98)}
.qh-gplay:hover{background:rgba(255,255,255,.06)}
.qh-social:hover{background:rgba(255,255,255,.06);color:#fff}
.qh-footlink:hover{color:#fff}
.qh-ghost-inverse:hover{background:rgba(255,255,255,.06)}
@keyframes qhFade{from{opacity:0}to{opacity:1}}
@keyframes qhPulse{0%,100%{box-shadow:0 0 0 0 rgba(16,134,0,.35)}50%{box-shadow:0 0 0 4px rgba(16,134,0,0)}}
`

const CAROUSEL_STEPS = [
  { icon: "clipboard-list", title: "Post a task", desc: "Tell us what you need." },
  { icon: "user-round-search", title: "Find a specialist", desc: "Choose the right person." },
  { icon: "badge-check", title: "Get it done", desc: "Simple from start to finish." },
]

const POPULAR = ["Plumbing", "Deep clean", "Moving help", "Electrician", "Tutoring"]

const TRUST = [
  { icon: "shield-check", label: "Verified specialists" },
  { icon: "map-pin", label: "Local professionals" },
  { icon: "message-square-lock", label: "Secure communication" },
  { icon: "calendar-clock", label: "Flexible scheduling" },
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

const PERKS = [
  { icon: "wallet", label: "Set your own rate" },
  { icon: "calendar-clock", label: "Work when you want" },
  { icon: "shield-check", label: "Get paid securely" },
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

type FooterLink = { label: string; href: string; cookies?: boolean }
const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
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
      { label: "Create profile", href: "/sign-up#pro-signup" },
      { label: "How to win jobs", href: "/professionals#how" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#how-it-works" },
      { label: "Feedback", href: "/feedback" },
      { label: "Privacy", href: "/privacy-policy" },
    ],
  },
]

function Icon({ name, size, style }: { name: string; size: number; style?: CSSProperties }) {
  const Component = ICONS[name]
  if (!Component) return null
  return <Component size={size} strokeWidth={1.5} aria-hidden="true" style={{ display: "block", flexShrink: 0, ...style }} />
}

function minutesAgo(iso: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} h ago`
  return `${Math.floor(hours / 24)} d ago`
}

function startLabel(iso: string) {
  const start = new Date(iso)
  if (Number.isNaN(start.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  start.setHours(0, 0, 0, 0)
  const days = Math.round((start.getTime() - today.getTime()) / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  return start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
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

  const [step, setStep] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  /** undefined while loading, [] when the API is unreachable or empty. */
  const [specialists, setSpecialists] = useState<SpecialistSummary[] | undefined>(undefined)
  /** undefined while loading, null when there are no tasks yet. */
  const [latestJob, setLatestJob] = useState<Job | null | undefined>(undefined)

  const carouselPaused = useRef(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!carouselPaused.current) setStep((current) => (current + 1) % CAROUSEL_STEPS.length)
    }, 3400)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let cancelled = false
    searchSpecialists("", 3).then((result) => {
      if (!cancelled) setSpecialists(result.specialists)
    })
    listJobs(new URLSearchParams({ limit: "1" })).then((jobs) => {
      if (!cancelled) setLatestJob(jobs[0] ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const signedIn = isLoaded && !!isSignedIn
  const isSpecialistAccount = user?.unsafeMetadata?.appRole === "freelancer"
  const specialistHref = signedIn && isSpecialistAccount ? "/dashboard" : "/professionals"

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = String(new FormData(event.currentTarget).get("q") || "").trim()
    router.push(query ? `/specialists?q=${encodeURIComponent(query)}` : "/specialists")
  }

  const carouselStep = CAROUSEL_STEPS[step]
  const latestLocation = latestJob?.location?.label || latestJob?.location?.city || null
  const latestStart = latestJob ? startLabel(latestJob.startDate) : null
  const trustPairs = [TRUST.slice(0, 2), TRUST.slice(2)]
  const stepPairs = [STEPS.slice(0, 2), STEPS.slice(2)]

  return (
    <div
      className={`qh-cl ${authFontClassName}`}
      style={
        {
          position: "relative",
          overflowX: "clip",
          minHeight: "100vh",
          background: "var(--paper)",
          color: "var(--fg-1)",
          font: "var(--text-body-md)",
          letterSpacing: "var(--ls-body)",
          WebkitFontSmoothing: "antialiased",
          "--qh-img": "saturate(.72) contrast(1.02)",
        } as CSSProperties
      }
    >
      <style>{CSS}</style>

      <LandingNav />


      {/* Hero */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", top: 44, right: 0, width: "min(52vw,860px)", height: "min(760px,88vh)", pointerEvents: "none", zIndex: 0 }}
      >
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated" }} />
      </div>
      <section style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "184px 24px 72px" }}>
        <Tag live>Free for clients</Tag>
        <h1
          style={{
            font: "var(--text-display)",
            fontSize: "clamp(48px,7.4vw,88px)",
            letterSpacing: "var(--ls-display)",
            margin: "32px 0 0",
            maxWidth: 960,
            textWrap: "balance",
          } as CSSProperties}
        >
          Get tasks done. Find <em style={{ ...SERIF_EM, color: GREEN }}>trusted</em> help, right when you need it.
        </h1>
        <p style={{ font: "var(--text-body-lg)", maxWidth: 560, margin: "28px 0 40px", textWrap: "pretty" } as CSSProperties}>
          QuickHands connects you with reliable local specialists for cleaning, repairs, beauty and trades.{" "}
          <span style={{ color: "var(--fg-3)" }}>Post what you need and hear back fast.</span>
        </p>

        <form
          onSubmit={onSearch}
          role="search"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            maxWidth: 600,
            padding: "6px 6px 6px 20px",
            borderRadius: 999,
            background: "var(--white)",
            boxShadow: SHADOW_FLOAT,
          }}
        >
          <Search size={18} strokeWidth={1.5} aria-hidden="true" style={{ display: "block", color: "var(--fg-3)", flexShrink: 0 }} />
          <input
            type="text"
            name="q"
            placeholder="Plumber, electrician, cleaner…"
            aria-label="Search for a specialist"
            style={{
              flex: 1,
              minWidth: 0,
              border: 0,
              outline: "none",
              background: "transparent",
              font: "var(--text-body-md)",
              fontSize: 16,
              color: "var(--fg-1)",
              height: 44,
            }}
          />
          <button
            type="submit"
            className="qh-search-btn"
            style={{
              height: 44,
              padding: "0 22px",
              border: 0,
              borderRadius: 999,
              background: GREEN,
              color: "var(--white)",
              font: "500 14px/1 var(--font-sans)",
              letterSpacing: "-0.01em",
              cursor: "pointer",
              transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
            }}
          >
            Search
          </button>
        </form>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 16 }}>
          <span style={{ ...MICRO, fontSize: 11, color: "var(--fg-3)", marginRight: 4 }}>Popular</span>
          {POPULAR.map((label) => (
            <Link
              key={label}
              href={`/specialists?q=${encodeURIComponent(label)}`}
              className="qh-chip"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 28,
                padding: "0 12px",
                borderRadius: 999,
                boxShadow: "inset 0 0 0 1px var(--border-default)",
                font: "500 13px/1 var(--font-sans)",
                color: "var(--fg-2)",
                textDecoration: "none",
                transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Carousel card over the carpenter photo */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(360px,43vw,520px)",
            borderRadius: 20,
            overflow: "hidden",
            background: "var(--ink-900)",
          }}
        >
          <img
            src="/design/client-landing/hero-carpenter.jpg"
            alt="A carpenter operating a circular saw at an outdoor site"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 40%",
              filter: "var(--qh-img)",
            }}
          />
          <div
            onMouseEnter={() => {
              carouselPaused.current = true
            }}
            onMouseLeave={() => {
              carouselPaused.current = false
            }}
            style={{
              position: "absolute",
              left: 24,
              bottom: 24,
              width: 300,
              maxWidth: "calc(100% - 48px)",
              boxSizing: "border-box",
              padding: 20,
              borderRadius: 14,
              background: "var(--white)",
              boxShadow: SHADOW_FLOAT,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...MICRO, fontSize: 11, color: "var(--fg-3)" }}>How QuickHands works</span>
              <span style={{ ...MICRO, fontSize: 11, color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>
                {`0${step + 1} / 0${CAROUSEL_STEPS.length}`}
              </span>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginTop: 18, minHeight: 52 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--ink-100)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={carouselStep.icon} size={18} />
              </span>
              <div>
                <div style={{ font: "var(--text-h4)", fontSize: 17, letterSpacing: "var(--ls-tight)" }}>{carouselStep.title}</div>
                <div style={{ font: "var(--text-small)", color: "var(--fg-2)", marginTop: 4 }}>{carouselStep.desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 18 }}>
              {CAROUSEL_STEPS.map((item, index) => {
                const active = index === step
                return (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Step ${index + 1}: ${item.title}`}
                    onClick={() => setStep(index)}
                    style={{
                      height: 4,
                      width: active ? 24 : 8,
                      border: 0,
                      padding: 0,
                      borderRadius: 999,
                      background: active ? GREEN : "var(--ink-200)",
                      cursor: "pointer",
                      transition: "width var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)",
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 120px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))",
            gap: 1,
            background: "var(--border-hairline)",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "var(--shadow-hairline)",
          }}
        >
          {trustPairs.map((pair) => (
            <ul
              key={pair[0].label}
              style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 1 }}
            >
              {pair.map((item) => (
                <li key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 24px", background: "var(--white)" }}>
                  <Icon name={item.icon} size={18} style={{ color: "var(--fg-1)" }} />
                  <span style={{ font: "500 15px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)" }}>{item.label}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 128px", scrollMarginTop: 80 }}
      >
        <Divider label="How it works" />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, margin: "48px 0 56px" }}>
          <h2
            style={{
              font: "var(--text-h1)",
              fontSize: "clamp(40px,5.4vw,64px)",
              letterSpacing: "var(--ls-heading)",
              margin: 0,
              maxWidth: 640,
              textWrap: "balance",
            } as CSSProperties}
          >
            Four steps. <em style={{ ...SERIF_EM, color: GREEN }}>No</em> friction.
          </h2>
          <p style={{ margin: 0, maxWidth: 340, color: "var(--fg-2)", textWrap: "pretty" } as CSSProperties}>
            QuickHands strips out the back-and-forth. Post once, meet the right specialist, get it done.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "48px 24px" }}>
          {stepPairs.map((pair) => (
            <ol
              key={pair[0].n}
              style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "48px 24px" }}
            >
              {pair.map((item) => (
                <li key={item.n} style={{ display: "flex", flexDirection: "column" }}>
                  <div className="qh-zoom" style={{ aspectRatio: "4 / 5", borderRadius: 14, overflow: "hidden", background: "var(--ink-100)" }}>
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: "var(--qh-img)",
                        transition: "transform var(--dur-slow) var(--ease-out)",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 20, ...MICRO, fontSize: 11, color: "var(--fg-3)" }}>
                    <span>{item.n}</span>
                    <span style={{ width: 16, height: 1, background: "var(--border-default)" }} />
                    <span>{item.label}</span>
                  </div>
                  <h3 style={{ font: "var(--text-h4)", letterSpacing: "var(--ls-tight)", margin: "10px 0 0" }}>{item.title}</h3>
                  <p style={{ margin: "6px 0 0", color: "var(--fg-2)", textWrap: "pretty" } as CSSProperties}>{item.desc}</p>
                </li>
              ))}
            </ol>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="tasks" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 128px", scrollMarginTop: 80 }}>
        <Divider label="Popular tasks" />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, margin: "48px 0 56px" }}>
          <h2
            style={{
              font: "var(--text-h1)",
              fontSize: "clamp(40px,5.4vw,64px)",
              letterSpacing: "var(--ls-heading)",
              margin: 0,
              maxWidth: 640,
              textWrap: "balance",
            } as CSSProperties}
          >
            What can you get <em style={{ ...SERIF_EM, color: GREEN }}>done</em>?
          </h2>
          <p style={{ margin: 0, maxWidth: 340, color: "var(--fg-2)", textWrap: "pretty" } as CSSProperties}>
            From a leaky tap to a full house move — the tasks people get done on QuickHands every day.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: "56px 24px" }}>
          {CATEGORIES.map((category) => (
            <Link
              key={category.title}
              href={`/specialists?q=${encodeURIComponent(category.query)}`}
              style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--fg-1)" }}
            >
              <div className="qh-zoom" style={{ aspectRatio: "16 / 10", borderRadius: 14, overflow: "hidden", background: "var(--ink-100)" }}>
                <img
                  src={category.image}
                  alt={category.alt}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: "var(--qh-img)",
                    transition: "transform var(--dur-slow) var(--ease-out)",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginTop: 20 }}>
                <h3 style={{ font: "var(--text-h3)", letterSpacing: "var(--ls-heading)", margin: 0 }}>{category.title}</h3>
                <span style={{ ...MICRO, fontSize: 11, color: "var(--fg-3)" }}>{category.n}</span>
              </div>
              <p style={{ margin: "8px 0 0", color: "var(--fg-2)", textWrap: "pretty" } as CSSProperties}>{category.tagline}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
                {category.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Marketplace preview */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 128px" }}>
        <div
          style={{
            background: "var(--ink-950)",
            color: "var(--white)",
            borderRadius: 20,
            padding: "clamp(40px,6vw,88px) clamp(24px,5vw,64px)",
          }}
        >
          <Divider label="See it in action" inverse />
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, margin: "48px 0 56px" }}>
            <h2
              style={{
                font: "var(--text-h1)",
                fontSize: "clamp(40px,5.4vw,64px)",
                letterSpacing: "var(--ls-heading)",
                margin: 0,
                maxWidth: 640,
                textWrap: "balance",
              } as CSSProperties}
            >
              Post a task. Meet your <em style={{ ...SERIF_EM, color: GREEN_LIGHT }}>match</em>.
            </h2>
            <p style={{ margin: 0, maxWidth: 340, color: "rgba(255,255,255,.6)", textWrap: "pretty" } as CSSProperties}>
              A real task, matched with local specialists ready to help.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", gap: 24, alignItems: "start" }}>
            <div
              style={{
                padding: 28,
                borderRadius: 14,
                background: "var(--ink-900)",
                boxShadow: "inset 0 0 0 1px var(--border-inverse)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    ...MICRO,
                    fontSize: 11,
                    color: "rgba(255,255,255,.72)",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--signal-500)",
                      boxShadow: "0 0 0 3px rgba(47,84,255,.25)",
                    }}
                  />
                  Task posted
                </span>
                <span style={{ ...MICRO, fontSize: 11, color: "rgba(255,255,255,.45)" }}>
                  {latestJob ? minutesAgo(latestJob.createdAt) : ""}
                </span>
              </div>
              {latestJob === null ? (
                <>
                  <h3 style={{ font: "var(--text-h3)", letterSpacing: "var(--ls-heading)", margin: "28px 0 0" }}>No tasks posted yet</h3>
                  <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,.6)", maxWidth: "42ch", textWrap: "pretty" } as CSSProperties}>
                    The first task posted on QuickHands will appear here.
                  </p>
                </>
              ) : latestJob ? (
                <>
                  <h3 style={{ font: "var(--text-h3)", letterSpacing: "var(--ls-heading)", margin: "28px 0 0" }}>{latestJob.serviceType}</h3>
                  {latestJob.additionalInfo ? (
                    <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,.6)", maxWidth: "42ch", textWrap: "pretty" } as CSSProperties}>
                      {latestJob.additionalInfo}
                    </p>
                  ) : null}
                  <div
                    style={{
                      display: "flex",
                      gap: 20,
                      marginTop: 28,
                      paddingTop: 20,
                      borderTop: "1px solid var(--border-inverse)",
                      font: "var(--text-small)",
                      color: "rgba(255,255,255,.72)",
                    }}
                  >
                    {latestLocation ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} strokeWidth={1.5} aria-hidden="true" style={{ display: "block" }} />
                        {latestLocation}
                      </span>
                    ) : null}
                    {latestStart ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Clock size={14} strokeWidth={1.5} aria-hidden="true" style={{ display: "block" }} />
                        {latestStart}
                      </span>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 14,
                boxShadow: "inset 0 0 0 1px var(--border-inverse)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border-inverse)",
                  ...MICRO,
                  fontSize: 11,
                  color: "rgba(255,255,255,.45)",
                }}
              >
                <span>{specialists && specialists.length > 0 ? `${specialists.length} matches nearby` : "Matches nearby"}</span>
                <span>Rating</span>
              </div>
              {(specialists ?? []).map((specialist) => (
                <div
                  key={specialist.clerkId}
                  className="qh-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 20px",
                    borderBottom: "1px solid var(--border-inverse)",
                    transition: "background var(--dur-fast) var(--ease-out)",
                  }}
                >
                  {specialist.imageUrl ? (
                    <div
                      role="img"
                      aria-label={specialist.name}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundImage: `url("${specialist.imageUrl}")`,
                        flexShrink: 0,
                        filter: "var(--qh-img)",
                      }}
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={specialist.name}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "var(--ink-800)",
                        color: "var(--white)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        font: "500 13px/1 var(--font-sans)",
                        flexShrink: 0,
                      }}
                    >
                      {initialsOf(specialist.name)}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "500 15px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)" }}>{specialist.name}</div>
                    <div
                      style={{
                        font: "var(--text-small)",
                        color: "rgba(255,255,255,.6)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {specialist.skillList.length > 0 ? specialist.skillList.join(" · ") : specialist.tagline}
                    </div>
                    <div style={{ ...MICRO, fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 6 }}>
                      {[
                        specialist.reviewSummary.reviewCount === 1
                          ? "1 review"
                          : specialist.reviewSummary.reviewCount > 1
                            ? `${specialist.reviewSummary.reviewCount} reviews`
                            : "No reviews yet",
                        specialist.location?.label || specialist.location?.city,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, font: "500 14px/1 var(--font-sans)", fontVariantNumeric: "tabular-nums" }}>
                    {specialist.reviewSummary.reviewCount > 0 ? (
                      <>
                        <Star size={13} strokeWidth={1.5} aria-hidden="true" style={{ display: "block" }} />
                        {specialist.reviewSummary.averageRating.toFixed(1)}
                      </>
                    ) : (
                      "New"
                    )}
                  </span>
                </div>
              ))}
              <div style={{ padding: "16px 20px" }}>
                <div style={GREEN_TOKENS}>
                  <Button href="/post-job" variant="primary" size="md" full>
                    Post your task
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section id="specialists" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 128px", scrollMarginTop: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 56, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Tag>For specialists</Tag>
            <h2
              style={{
                font: "var(--text-h1)",
                fontSize: "clamp(40px,5.4vw,64px)",
                letterSpacing: "var(--ls-heading)",
                margin: "28px 0 0",
                textWrap: "balance",
              } as CSSProperties}
            >
              Turn your skills into <em style={{ ...SERIF_EM, color: GREEN }}>extra</em> income.
            </h2>
            <p style={{ font: "var(--text-body-lg)", margin: "24px 0 0", maxWidth: 460, textWrap: "pretty" } as CSSProperties}>
              Offer your skills locally and connect with people who need your help.{" "}
              <span style={{ color: "var(--fg-3)" }}>They get things done — you earn by doing them.</span>
            </p>
            <ul style={{ listStyle: "none", margin: "36px 0 0", padding: 0, width: "100%", maxWidth: 460, borderTop: "1px solid var(--border-hairline)" }}>
              {PERKS.map((perk) => (
                <li
                  key={perk.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 0",
                    borderBottom: "1px solid var(--border-hairline)",
                  }}
                >
                  <span style={{ font: "500 15px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)" }}>{perk.label}</span>
                  <Icon name={perk.icon} size={16} style={{ color: "var(--fg-3)" }} />
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 10, marginTop: 36 }}>
              <span style={{ display: "inline-flex", ...GREEN_TOKENS }}>
                <Button
                  href={specialistHref}
                  size="lg"
                  iconRight={<ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" style={{ display: "block" }} />}
                >
                  Become a specialist
                </Button>
              </span>
            </div>
          </div>
          <div style={{ aspectRatio: "4 / 5", borderRadius: 20, overflow: "hidden", background: "var(--ink-100)" }}>
            <img
              src="/design/client-landing/specialist-wrench.jpg"
              alt="A specialist holding a wrench while making a repair"
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "var(--qh-img)" }}
            />
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 128px" }}>
        <Divider label="By the numbers" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", marginTop: 48 }}>
          {[
            { value: stats ? String(stats.categories) : "—", label: "Task categories" },
            { value: stats?.averageRating != null ? stats.averageRating.toFixed(1) : "—", label: "Average specialist rating" },
            { value: "$0", label: "Platform fees for clients" },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: "8px 24px 8px 0", display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  font: "var(--text-display)",
                  fontSize: "clamp(56px,6vw,80px)",
                  letterSpacing: "var(--ls-display)",
                  fontVariantNumeric: "tabular-nums",
                } as CSSProperties}
              >
                {stat.value}
              </div>
              <div style={{ ...MICRO, fontSize: 11, color: "var(--fg-3)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 128px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: "48px 64px", alignItems: "start" }}>
          <div style={{ position: "sticky", top: 96 }}>
            <h2 style={{ font: "var(--text-h2)", letterSpacing: "var(--ls-heading)", margin: 0, textWrap: "balance" } as CSSProperties}>
              Questions, <em style={{ ...SERIF_EM, color: GREEN }}>answered</em>.
            </h2>
            <p style={{ margin: "16px 0 0", maxWidth: 360, color: "var(--fg-2)", textWrap: "pretty" } as CSSProperties}>
              Everything you need to know about working with specialists on QuickHands.
            </p>
          </div>
          <div style={{ borderTop: "1px solid var(--border-hairline)" }}>
            {FAQS.map(([question, answer], index) => {
              const open = openFaq === index
              return (
                <div key={question} style={{ borderBottom: "1px solid var(--border-hairline)" }}>
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
                      padding: "24px 0",
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
                    <Icon name={open ? "minus" : "plus"} size={16} style={{ color: "var(--fg-2)" }} />
                  </button>
                  {open ? (
                    <p style={{ margin: "-8px 0 24px", maxWidth: 560, color: "var(--fg-2)", textWrap: "pretty" } as CSSProperties}>{answer}</p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 24px" }}>
        <div
          style={{
            background: "var(--ink-950)",
            color: "var(--white)",
            borderRadius: 20,
            padding: "clamp(56px,7vw,96px) clamp(28px,5vw,64px)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 32,
          }}
        >
          <div>
            <Tag inverse>Ready when you are</Tag>
            <h2
              style={{
                font: "var(--text-h1)",
                fontSize: "clamp(40px,5.4vw,64px)",
                letterSpacing: "var(--ls-heading)",
                margin: "24px 0 0",
                maxWidth: 640,
                textWrap: "balance",
              } as CSSProperties}
            >
              Got something to do? Let's get it <em style={{ ...SERIF_EM, color: GREEN_LIGHT }}>done</em>.
            </h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <span style={{ display: "inline-flex", ...GREEN_TOKENS }}>
              <Button
                href="/post-job"
                size="lg"
                iconRight={<ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" style={{ display: "block" }} />}
              >
                Post a task
              </Button>
            </span>
            <Button
              href={specialistHref}
              variant="ghost"
              size="lg"
              className="qh-ghost-inverse"
              style={{ color: "#fff", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.24)" }}
            >
              Become a specialist
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 24px" }}>
        <div style={{ background: "var(--ink-950)", color: "var(--white)", borderRadius: 20, padding: "clamp(40px,5vw,64px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "48px 64px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: "1 1 280px", maxWidth: 340 }}>
              <span style={{ font: "600 22px/1 var(--font-sans)", letterSpacing: "-0.05em" }}>quickhands</span>
              <p style={{ margin: 0, color: "rgba(255,255,255,.6)", textWrap: "pretty" } as CSSProperties}>
                The marketplace for clients and local specialists to connect, agree and get jobs done.
              </p>
              <a
                href="https://play.google.com/store/search?q=QuickHands&c=apps"
                target="_blank"
                rel="noopener"
                aria-label="Get it on Google Play"
                className="qh-gplay"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  width: "fit-content",
                  padding: "10px 18px 10px 14px",
                  borderRadius: 999,
                  boxShadow: "inset 0 0 0 1px var(--border-inverse)",
                  textDecoration: "none",
                  color: "var(--white)",
                  transition: "background var(--dur-fast) var(--ease-out)",
                }}
              >
                <img src="/design/client-landing/google-play.svg" alt="" style={{ width: 20, height: 20, filter: "invert(1)" }} />
                <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ ...MICRO, fontSize: 11, color: "rgba(255,255,255,.5)" }}>Get it on</span>
                  <span style={{ font: "500 14px/1 var(--font-sans)" }}>Google Play</span>
                </span>
              </a>
              <div style={{ display: "flex", gap: 8 }}>
                {SOCIAL.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={item.label}
                    className="qh-social"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "inset 0 0 0 1px var(--border-inverse)",
                      color: "rgba(255,255,255,.72)",
                      transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
                      <path d={item.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(140px,180px))", gap: "40px 48px" }}>
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <span style={{ ...MICRO, fontSize: 11, color: "rgba(255,255,255,.45)", marginBottom: 6 }}>{column.title}</span>
                  {column.links.map((link) => (
                    <FooterLinkItem key={link.label} link={link} />
                  ))}
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
              borderTop: "1px solid var(--border-inverse)",
              ...MICRO,
              fontSize: 11,
              color: "rgba(255,255,255,.45)",
            }}
          >
            <span>© 2026 Quickhands, Inc.</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              <Link href="/privacy-policy" className="qh-footlink" style={{ color: "inherit", textDecoration: "none" }}>
                Privacy
              </Link>
              <button
                type="button"
                className="qh-footlink"
                onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT))}
                style={{
                  padding: 0,
                  border: 0,
                  background: "transparent",
                  color: "inherit",
                  font: "inherit",
                  letterSpacing: "inherit",
                  textTransform: "inherit",
                  cursor: "pointer",
                }}
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

function FooterLinkItem({ link }: { link: FooterLink }) {
  const style: CSSProperties = {
    font: "var(--text-small)",
    fontSize: 14,
    color: "rgba(255,255,255,.72)",
    textDecoration: "none",
    transition: "color var(--dur-fast) var(--ease-out)",
  }
  if (link.href.startsWith("/") || link.href.startsWith("#")) {
    return (
      <Link href={link.href} className="qh-footlink" style={style}>
        {link.label}
      </Link>
    )
  }
  return (
    <a href={link.href} className="qh-footlink" style={style}>
      {link.label}
    </a>
  )
}
