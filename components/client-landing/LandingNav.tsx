"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { ChevronDown, Droplets, Drill, GraduationCap, Hammer, Package, Sparkles, Text, Truck, Zap, type LucideIcon } from "lucide-react"
import { Button, Segmented } from "@/components/client-landing/primitives"
import { useMarketplaceStats } from "@/components/client-landing/useMarketplaceStats"

/*
 * The floating landing nav: the audience strip, the floating header (compact
 * and expanded states), the Tasks mega menu, the signed-in name link and the
 * Post a task button. Shared by ClientLanding and the /specialists page. It
 * takes no props; everything it shows comes from Clerk and the page-independent
 * stats hook. Its stylesheet sits inside its own `.qh-cl` token scope, so it
 * renders the same on any page root.
 */

const GREEN = "#108600"
const GREEN_HOVER = "#0D6E00"
/** The design's brand-green override, applied to primary buttons on the nav. */
const GREEN_TOKENS = { "--ink-950": GREEN, "--ink-800": GREEN_HOVER } as CSSProperties
const SHADOW_FLOAT = "0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14),0 0 0 1px rgba(10,10,11,.08)"
const SHADOW_SM = "0 1px 2px rgba(10,10,11,.04),0 0 0 1px rgba(10,10,11,.08)"
const MICRO: CSSProperties = {
  font: "var(--text-micro)",
  letterSpacing: "var(--ls-mono)",
  textTransform: "uppercase",
}

/** Nav stylesheet: the tokens plus the classes the nav and its buttons use. Copied from ClientLanding's stylesheet. */
const LANDING_NAV_CSS = `
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
@keyframes qhFade{from{opacity:0}to{opacity:1}}
`

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

const NAV_ICONS: Record<string, LucideIcon> = {
  hammer: Hammer,
  truck: Truck,
  zap: Zap,
  package: Package,
  droplets: Droplets,
  sparkles: Sparkles,
  drill: Drill,
  "graduation-cap": GraduationCap,
  text: Text,
}

function Icon({ name, size, style }: { name: string; size: number; style?: CSSProperties }) {
  const Component = NAV_ICONS[name]
  if (!Component) return null
  return <Component size={size} strokeWidth={1.5} aria-hidden="true" style={{ display: "block", flexShrink: 0, ...style }} />
}

function harareClock() {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Harare", hour: "2-digit", minute: "2-digit" }).format(new Date())
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

export function LandingNav() {
  const router = useRouter()
  const { isLoaded, isSignedIn, user } = useUser()
  const stats = useMarketplaceStats()

  const [scrolled, setScrolled] = useState(false)
  const [nav, setNav] = useState({ mega: false, forceOpen: false })
  const [time, setTime] = useState("")

  const hoveringRef = useRef(false)
  const closeTimer = useRef<number | null>(null)

  useEffect(() => {
    setTime(harareClock())
    const clock = window.setInterval(() => setTime(harareClock()), 30_000)
    return () => window.clearInterval(clock)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      setScrolled(y > 120)
      if (!hoveringRef.current) {
        setNav((current) => (current.mega || current.forceOpen ? { mega: false, forceOpen: false } : current))
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    }
  }, [])

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  const onNavEnter = () => {
    hoveringRef.current = true
    cancelClose()
  }
  const onNavLeave = () => {
    hoveringRef.current = false
    cancelClose()
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null
      setNav({ mega: false, forceOpen: false })
    }, 220)
  }
  const openMega = () => {
    cancelClose()
    setNav((current) => (current.mega ? current : { ...current, mega: true }))
  }
  const closeMega = () => setNav((current) => (current.mega ? { ...current, mega: false } : current))
  const openFromCompact = () => {
    cancelClose()
    setNav((current) => (current.forceOpen ? current : { forceOpen: true, mega: true }))
  }
  const closeMenu = () => {
    cancelClose()
    setNav({ mega: false, forceOpen: false })
  }

  const compact = scrolled && !nav.forceOpen && !nav.mega
  const navTop = scrolled ? 12 : 60
  const navWidth = compact ? 300 : 960
  const navShadow = scrolled || nav.mega ? SHADOW_FLOAT : SHADOW_SM

  const signedIn = isLoaded && !!isSignedIn
  const signedOut = isLoaded && !isSignedIn
  const isSpecialistAccount = user?.unsafeMetadata?.appRole === "freelancer"
  const specialistHref = signedIn && isSpecialistAccount ? "/dashboard" : "/professionals"
  const accountName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || ""
  const userFirst = user?.firstName || accountName.split(/[ @]/)[0] || ""
  const userInitials = initialsOf(accountName || "U")

  return (
    <div className="qh-cl" style={{ display: "contents" }}>
      <style>{LANDING_NAV_CSS}</style>
      {/* Audience strip */}
      <div style={{ borderBottom: "1px solid var(--border-hairline)", background: "var(--ink-50)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Segmented
            options={[
              { value: "clients", label: "For clients" },
              { value: "pros", label: "For professionals" },
            ]}
            value="clients"
            onChange={(value) => {
              if (value === "pros") router.push("/professionals")
            }}
            width={230}
            height={28}
          />
          <span
            style={{ ...MICRO, fontSize: 11, color: "var(--fg-3)", display: "flex", gap: 8, alignItems: "center", textTransform: "uppercase" }}
          >
            <span>Harare</span>
            <span style={{ color: "var(--fg-2)", fontVariantNumeric: "tabular-nums" }}>{time}</span>
          </span>
        </div>
      </div>

      {/* Floating header */}
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
          onMouseEnter={onNavEnter}
          onMouseLeave={onNavLeave}
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
                  src="/design/client-landing/logo-mark.png"
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.4)", display: "block" }}
                />
              </Link>
              <button
                type="button"
                onMouseEnter={openFromCompact}
                onClick={openFromCompact}
                className="qh-menu-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  height: 36,
                  padding: "0 12px",
                  border: 0,
                  borderRadius: 999,
                  background: "transparent",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: 1,
                  color: "var(--fg-1)",
                  cursor: "pointer",
                  transition: "background var(--dur-fast) var(--ease-out)",
                }}
              >
                <Icon name="text" size={15} style={{ color: GREEN }} />
                Menu
              </button>
              <span style={{ display: "inline-flex", ...GREEN_TOKENS }}>
                <Button href="/post-job" variant="primary" size="md">
                  Post a task
                </Button>
              </span>
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
                <Link
                  href="/"
                  style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none", color: "var(--fg-1)", flexShrink: 0 }}
                >
                  <span style={{ font: "600 20px/1 var(--font-sans)", letterSpacing: "-0.05em" }}>quickhands</span>
                </Link>
                <nav style={{ display: "flex", gap: 2, flex: 1, minWidth: 0 }}>
                  <button
                    type="button"
                    onMouseEnter={openMega}
                    onClick={openMega}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      height: 36,
                      padding: "0 12px",
                      border: 0,
                      borderRadius: 999,
                      background: nav.mega ? "var(--ink-100)" : "transparent",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: 1,
                      color: "var(--fg-1)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "background var(--dur-fast) var(--ease-out)",
                    }}
                  >
                    Tasks
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      style={{
                        display: "block",
                        color: "var(--fg-3)",
                        transform: nav.mega ? "rotate(180deg)" : "none",
                        transition: "transform var(--dur-base) var(--ease-out)",
                      }}
                    />
                  </button>
                  <a
                    href="#how-it-works"
                    onMouseEnter={closeMega}
                    className="qh-navlink"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 999,
                      font: "500 14px/1 var(--font-sans)",
                      textDecoration: "none",
                      color: "var(--fg-2)",
                      whiteSpace: "nowrap",
                      transition: "background var(--dur-fast) var(--ease-out)",
                    }}
                  >
                    How it works
                  </a>
                  <Link
                    href={specialistHref}
                    onMouseEnter={closeMega}
                    className="qh-navlink"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 999,
                      font: "500 14px/1 var(--font-sans)",
                      textDecoration: "none",
                      color: "var(--fg-2)",
                      whiteSpace: "nowrap",
                      transition: "background var(--dur-fast) var(--ease-out)",
                    }}
                  >
                    Become a specialist
                  </Link>
                </nav>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  {signedOut ? <Button href="/sign-in" variant="ghost" size="md">Sign in</Button> : null}
                  {signedIn ? (
                    <Link
                      href="/dashboard"
                      className="qh-acct"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        height: 40,
                        padding: "0 12px 0 4px",
                        borderRadius: 999,
                        textDecoration: "none",
                        color: "var(--fg-1)",
                        font: "500 14px/1 var(--font-sans)",
                        transition: "background var(--dur-fast) var(--ease-out)",
                      }}
                    >
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: GREEN,
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
                  <span style={{ display: "inline-flex", ...GREEN_TOKENS }}>
                    <Button href="/post-job" variant="primary" size="md">
                      Post a task
                    </Button>
                  </span>
                </div>
              </div>
              {nav.mega ? (
                <>
                  <div style={{ margin: "0 22px", borderTop: "1px solid var(--border-hairline)" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "2px 24px", padding: "16px 12px 8px" }}>
                    {MEGA_ITEMS.map((item) => (
                      <a
                        key={item.label}
                        href="#tasks"
                        onClick={closeMenu}
                        className="qh-mega-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: 10,
                          borderRadius: 10,
                          textDecoration: "none",
                          color: "var(--fg-1)",
                          transition: "background var(--dur-fast) var(--ease-out)",
                        }}
                      >
                        <Icon name={item.icon} size={16} style={{ color: GREEN }} />
                        <span style={{ font: "500 14px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)" }}>{item.label}</span>
                      </a>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 24, padding: "12px 22px 22px", alignItems: "center" }}>
                    <a
                      href="#tasks"
                      onClick={closeMenu}
                      className="qh-mega-tile"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        borderRadius: 14,
                        background: "var(--ink-50)",
                        overflow: "hidden",
                        textDecoration: "none",
                        color: "var(--fg-1)",
                        transition: "background var(--dur-fast) var(--ease-out)",
                      }}
                    >
                      <img
                        src="/design/client-landing/browse-tasks.jpg"
                        alt=""
                        style={{ width: 88, height: 80, objectFit: "cover", display: "block", flexShrink: 0, filter: "saturate(.72)" }}
                      />
                      <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ font: "500 15px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)" }}>Browse all tasks</span>
                        <span style={{ font: "var(--text-small)", color: "var(--fg-2)" }}>
                          {stats ? `${stats.categories} categories near you` : "Task categories near you"}
                        </span>
                      </span>
                    </a>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link
                        href="/post-job"
                        onClick={closeMenu}
                        className="qh-mega-link"
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 10,
                          padding: "12px 0",
                          borderBottom: "1px solid var(--border-hairline)",
                          textDecoration: "none",
                          color: "var(--fg-1)",
                        }}
                      >
                        <span style={{ font: "500 14px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)", whiteSpace: "nowrap" }}>Post a task</span>
                        <span style={{ font: "var(--text-small)", fontSize: 12, color: "var(--fg-3)" }}>Takes less than two minutes</span>
                      </Link>
                      <Link
                        href={specialistHref}
                        onClick={closeMenu}
                        className="qh-mega-link"
                        style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "12px 0", textDecoration: "none", color: "var(--fg-1)" }}
                      >
                        <span style={{ font: "500 14px/1.3 var(--font-sans)", letterSpacing: "var(--ls-tight)", whiteSpace: "nowrap" }}>Become a specialist</span>
                        <span style={{ font: "var(--text-small)", fontSize: 12, color: "var(--fg-3)" }}>Turn your skills into income</span>
                      </Link>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
