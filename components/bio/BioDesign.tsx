import type { CSSProperties } from "react"
import { authFontClassName } from "@/components/auth/fonts"

/*
 * Shared design tokens for the public bio page and its settings preview.
 * Values are taken from the Quickhands artifact design system (see
 * components/auth/AuthScreen.tsx and components/client-landing/ClientLanding.tsx).
 * A specialist's bio is the specialist-side surface, so the accent is the
 * specialist blue rather than the client green.
 */

export const BIO_ACCENT = "#1B3A9E"
export const BIO_ACCENT_HOVER = "#162F7F"
export const BIO_ACCENT_LIGHT = "#AFC0F5"
export const BIO_ACCENT_TINT = "rgba(27,58,158,.08)"

/** Apply to the root of any bio surface, together with <BioStyles />. */
export const BIO_ROOT_CLASS = `qh-bio ${authFontClassName}`

export const BIO_ROOT_STYLE: CSSProperties = {
  position: "relative",
  background: "var(--paper)",
  color: "var(--fg-1)",
  fontFamily: "var(--font-sans)",
  fontSize: 15,
  lineHeight: 1.55,
  letterSpacing: "var(--ls-body)",
  WebkitFontSmoothing: "antialiased",
}

/** Mono uppercase eyebrow treatment (11px, 0.06em tracking). */
export const BIO_MICRO: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  lineHeight: 1.3,
  fontWeight: 400,
  letterSpacing: "var(--ls-mono)",
  textTransform: "uppercase",
}

/** The single italic serif accent word used inside headings. */
export const BIO_SERIF_EM: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 400,
  letterSpacing: "-0.02em",
  color: BIO_ACCENT,
}

/** Hairline inset border used on cards, chips and round controls. */
export const BIO_INSET = "var(--shadow-card)"

const BIO_CSS = `
.qh-bio{
--ink-950:#0A0A0B;--ink-600:#4A4A50;--ink-500:#6E6E75;--ink-400:#9A9AA0;--ink-100:#EFEFF0;--ink-50:#F6F6F5;
--paper:#FBFBFA;--white:#FFFFFF;--signal-500:#2F54FF;
--accent:#1B3A9E;--accent-hover:#162F7F;--accent-tint:rgba(27,58,158,.08);
--fg-1:var(--ink-950);--fg-2:var(--ink-600);--fg-3:var(--ink-500);
--border-hairline:rgba(10,10,11,.08);--border-default:rgba(10,10,11,.12);
--shadow-card:inset 0 0 0 1px var(--border-default),0 1px 2px rgba(10,10,11,.04);
--shadow-float:0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14),0 0 0 1px var(--border-hairline);
--ease-out:cubic-bezier(.22,1,.36,1);--dur-fast:140ms;--dur-base:240ms;
--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif;
--font-mono:var(--font-geist-mono),ui-monospace,Menlo,monospace;
--font-serif:var(--font-instrument-serif),ui-serif,Georgia,serif;
--ls-heading:-0.035em;--ls-body:-0.005em;--ls-mono:0.06em;
}
.qh-bio a{color:inherit;text-decoration:none}
.qh-bio .qh-bio-static a{pointer-events:none;cursor:default}
.qh-bio :focus-visible{outline:2px solid var(--signal-500);outline-offset:2px}
.qh-bio ::selection{background:var(--ink-950);color:var(--white)}
.qh-bio .qh-bio-card{transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out)}
.qh-bio .qh-bio-card:hover{transform:translateY(-1px);box-shadow:inset 0 0 0 1px rgba(27,58,158,.32),0 8px 20px -12px rgba(10,10,11,.2)}
.qh-bio .qh-bio-card:active{transform:scale(.99)}
.qh-bio .qh-bio-icon{transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out)}
.qh-bio .qh-bio-icon:hover{transform:translateY(-1px);box-shadow:inset 0 0 0 1px rgba(27,58,158,.32),0 8px 20px -12px rgba(10,10,11,.2)}
.qh-bio .qh-bio-share{transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)}
.qh-bio .qh-bio-share:hover{background:var(--ink-50);color:var(--ink-950)}
.qh-bio .qh-bio-hire{transition:background var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)}
.qh-bio .qh-bio-hire:hover{background:var(--accent-hover)}
.qh-bio .qh-bio-hire:active{transform:scale(.98)}
.qh-bio .qh-bio-link{text-decoration:underline;text-decoration-color:rgba(10,10,11,.24);text-underline-offset:3px;transition:text-decoration-color var(--dur-fast) var(--ease-out)}
.qh-bio .qh-bio-link:hover{text-decoration-color:currentColor}
@media (prefers-reduced-motion:reduce){.qh-bio *{transition:none!important;animation:none!important;transform:none!important}}
`

/** Scoped design tokens and hover states. Render once inside each bio root. */
export function BioStyles() {
  return <style>{BIO_CSS}</style>
}

/**
 * Display name for headings: the first word set in the italic serif accent,
 * the rest in ink. Single-word names are fully accented.
 */
export function BioNameText({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return <>{name}</>
  const [first, ...rest] = parts
  return (
    <>
      <em style={BIO_SERIF_EM}>{first}</em>
      {rest.length > 0 ? ` ${rest.join(" ")}` : null}
    </>
  )
}
