"use client"

import { Fragment, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { authFontClassName } from "@/components/auth/fonts"
import { OPEN_COOKIE_PREFERENCES_EVENT } from "@/components/cookie-consent/CookieConsent"
import { PRIVACY_POLICY, type LegalBlock } from "./legal-content"

// Tokens from the design's :root blocks (legal/template.html).
const INK = {
  950: "#0A0A0B",
  600: "#4A4A50",
  400: "#9A9AA0",
  200: "#E4E4E6",
}
const WHITE = "#FFFFFF"
const PAPER = "#FBFBFA"
const SIGNAL = "#2F54FF"
const HAIRLINE = "rgba(10,10,11,.08)"
const BORDER_STRONG = "rgba(10,10,11,.24)"
const SURFACE_GLASS = "rgba(251,251,250,.72)"
const SHADOW_INSET = "inset 0 0 0 1px rgba(10,10,11,.12)"
const FG_2 = INK[600]
const FG_3 = INK[400]
const HIGHLIGHT_BG = "#F5DFA8"

const SANS = "var(--font-geist), ui-sans-serif, system-ui, sans-serif"
const MONO = "var(--font-geist-mono), ui-monospace, Menlo, monospace"
const SERIF = "var(--font-instrument-serif), ui-serif, Georgia, serif"
const EASE = "cubic-bezier(.22,1,.36,1)"

const CONTAINER: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" }

const MICRO: CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  lineHeight: 1.3,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: FG_3,
}

const EM_SERIF: CSSProperties = {
  fontFamily: SERIF,
  fontStyle: "italic",
  fontWeight: 400,
  letterSpacing: "-0.02em",
}

const ICONS = {
  "arrow-left": ArrowLeft,
  "arrow-up-right": ArrowUpRight,
} as const

function Icon({ name, size }: { name: keyof typeof ICONS; size: number }) {
  const Cmp = ICONS[name]
  return <Cmp width={size} height={size} strokeWidth={1.5} aria-hidden="true" />
}

// ─── Button (stands in for the design system's Button) ───────────────────

const BUTTON_VARIANTS = {
  ghost: { background: "transparent", color: INK[950] },
  inverse: { background: WHITE, color: INK[950], boxShadow: SHADOW_INSET },
} as const

function Button({
  variant,
  children,
  href,
  iconLeft,
  iconRight,
}: {
  variant: keyof typeof BUTTON_VARIANTS
  children: ReactNode
  href: string
  iconLeft?: keyof typeof ICONS
  iconRight?: keyof typeof ICONS
}) {
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    padding: "0 16px",
    borderRadius: 999,
    border: 0,
    fontFamily: SANS,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    textDecoration: "none",
    whiteSpace: "nowrap",
    ...BUTTON_VARIANTS[variant],
  }
  const content = (
    <>
      {iconLeft && <Icon name={iconLeft} size={16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={16} />}
    </>
  )
  if (href.startsWith("/")) {
    return (
      <Link href={href} style={style}>
        {content}
      </Link>
    )
  }
  return (
    <a href={href} style={style}>
      {content}
    </a>
  )
}

// ─── Inline markup: **bold** and [label](href) ───────────────────────────

function renderSegments(text: string): ReactNode[] {
  return text
    .split(/(\[[^\]]+\]\([^)]+\)|\*\*.+?\*\*)/)
    .filter(Boolean)
    .map((part, i) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) {
        return (
          <a key={i} href={link[2]}>
            {link[1]}
          </a>
        )
      }
      if (part.startsWith("**")) {
        return (
          <strong key={i} style={{ fontWeight: 500, color: INK[950] }}>
            {part.slice(2, -2)}
          </strong>
        )
      }
      return <Fragment key={i}>{part}</Fragment>
    })
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return (
      <p style={{ margin: 0, color: FG_2, lineHeight: 1.65, textWrap: "pretty" } as CSSProperties}>
        {renderSegments(block)}
      </p>
    )
  }
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {block.ul.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 12, color: FG_2, lineHeight: 1.6 }}>
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: INK[400],
              flexShrink: 0,
              marginTop: 10,
            }}
          />
          <span style={{ textWrap: "pretty" } as CSSProperties}>{renderSegments(item)}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────

const LINK_RESET: CSSProperties = { color: "inherit", textDecoration: "none", background: "none", border: 0, padding: 0, font: "inherit", cursor: "pointer" }

export function PrivacyPolicyPage() {
  const D = PRIVACY_POLICY
  const sections = D.sections.map(([h, blocks], i) => ({
    id: `privacy-${i + 1}`,
    n: String(i + 1).padStart(2, "0"),
    h,
    blocks,
  }))
  const words = JSON.stringify(D.sections).split(/\s+/).length
  const readTime = `${Math.max(1, Math.round(words / 220))} min read`

  const goToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: "smooth" })
  }

  const openCookiePreferences = () => {
    window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT))
  }

  return (
    <div className={authFontClassName} style={{ minHeight: "100vh", background: PAPER, color: INK[950], fontFamily: SANS, fontSize: 15, lineHeight: 1.55, letterSpacing: "-0.005em", WebkitFontSmoothing: "antialiased" } as CSSProperties}>
      <style>{`
        .qh-legal a { color: ${INK[950]}; text-decoration: underline; text-decoration-color: ${BORDER_STRONG}; text-underline-offset: 3px; transition: text-decoration-color 140ms ${EASE}; }
        .qh-legal a:hover { text-decoration-color: currentColor; }
        .qh-legal ::selection { background: ${INK[950]}; color: ${WHITE}; }
        .qh-legal :focus-visible { outline: 2px solid ${SIGNAL}; outline-offset: 2px; }
        .qh-legal nav button:hover { color: ${INK[950]}; }
        @keyframes qhFade { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: SURFACE_GLASS,
          backdropFilter: "saturate(1.4) blur(14px)",
          WebkitBackdropFilter: "saturate(1.4) blur(14px)",
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <div
          style={{
            ...CONTAINER,
            maxWidth: 1200,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none", color: INK[950] }}>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, lineHeight: 1, letterSpacing: "-0.05em" }}>quickhands</span>
            <span style={{ ...MICRO, letterSpacing: "0.06em" }}>Legal</span>
          </Link>
          <Button variant="ghost" href="/" iconLeft="arrow-left">
            Back to site
          </Button>
        </div>
      </header>

      <div className="qh-legal">
        <section style={{ ...CONTAINER, padding: "72px 24px 40px" }}>
          <div>
            <h1
              style={{
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: "clamp(44px,6.4vw,80px)",
                lineHeight: 0.98,
                letterSpacing: "-0.045em",
                margin: "48px 0 0",
                maxWidth: 900,
                textWrap: "balance",
              } as CSSProperties}
            >
              {D.t1} <em style={EM_SERIF}>{D.tEm}</em>
              {D.t2}
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 640, margin: "24px 0 0", textWrap: "pretty" } as CSSProperties}>
              {renderSegments(D.lead)}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", marginTop: 28, ...MICRO }}>
              <span>{D.effective}</span>
              <span>{readTime}</span>
            </div>
          </div>
        </section>

        <div
          style={{
            ...CONTAINER,
            paddingBottom: 120,
            display: "flex",
            flexWrap: "wrap",
            gap: "48px 64px",
            alignItems: "flex-start",
          }}
        >
          <nav aria-label="On this page" style={{ flex: "0 0 240px", position: "sticky", top: 96, display: "flex", flexDirection: "column" }}>
            <span style={{ ...MICRO, paddingBottom: 12, borderBottom: `1px solid ${HAIRLINE}` }}>On this page</span>
            {sections.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => goToSection(c.id)}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "baseline",
                  padding: "10px 0",
                  border: 0,
                  borderBottom: `1px solid ${HAIRLINE}`,
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: 1.35,
                  color: FG_2,
                }}
              >
                <span style={{ ...MICRO, width: 18, flexShrink: 0 }}>{c.n}</span>
                {c.h}
              </button>
            ))}
          </nav>

          <article style={{ flex: "1 1 520px", minWidth: 0, maxWidth: 720 }}>
            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                style={{ padding: "0 0 40px", marginBottom: 40, borderBottom: `1px solid ${HAIRLINE}`, scrollMarginTop: 96 }}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <span style={{ ...MICRO, width: 24, flexShrink: 0 }}>{s.n}</span>
                  <h2 style={{ fontFamily: SANS, fontWeight: 500, fontSize: 22, lineHeight: 1.3, letterSpacing: "-0.015em", margin: 0, textWrap: "balance" } as CSSProperties}>
                    {s.h}
                  </h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16, paddingLeft: 40 }}>
                  {s.blocks.map((b, i) => (
                    <Block key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
                padding: 24,
                borderRadius: 20,
                background: INK[950],
                color: WHITE,
              }}
            >
              <div>
                <div style={{ fontWeight: 500, fontSize: 17, lineHeight: 1.3, letterSpacing: "-0.015em" }}>Questions about this policy?</div>
                <div style={{ fontSize: 13, lineHeight: 1.45, color: "rgba(255,255,255,.62)", marginTop: 6 }}>Email support@quickhandsafrica.com</div>
              </div>
              <Button variant="inverse" href="mailto:support@quickhandsafrica.com" iconRight="arrow-up-right">
                Contact us
              </Button>
            </div>
          </article>
        </div>

        <footer
          style={{
            ...CONTAINER,
            paddingBottom: 32,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 16,
            ...MICRO,
          }}
        >
          <span>{D.copyright}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            <button type="button" onClick={openCookiePreferences} style={{ ...MICRO, ...LINK_RESET }}>
              Cookie preferences
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
