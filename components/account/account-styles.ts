import type { CSSProperties } from "react"

/**
 * Design tokens, keyframes and hover/press states for the client account page.
 * Scoped to `.qh-account` so nothing leaks into the rest of the app. Values are
 * copied from the design source; the fonts come from `authFontClassName`.
 */
export const ACCOUNT_CSS = `
.qh-account{
--ink-950:#0A0A0B;--ink-900:#141416;--ink-800:#1F1F22;--ink-700:#2E2E33;--ink-600:#4A4A50;--ink-500:#6E6E75;--ink-400:#9A9AA0;--ink-300:#C7C7CB;--ink-200:#E4E4E6;--ink-100:#EFEFF0;--ink-50:#F6F6F5;
--paper:#FBFBFA;--white:#FFFFFF;
--fg-1:var(--ink-950);--fg-2:var(--ink-600);--fg-3:var(--ink-400);
--surface-glass:rgba(251,251,250,.72);--blur-glass:saturate(1.4) blur(14px);
--border-hairline:rgba(10,10,11,.08);--border-default:rgba(10,10,11,.12);
--bg-page:var(--paper);--text-link:var(--fg-1);
--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif;
--font-mono:var(--font-geist-mono),ui-monospace,Menlo,monospace;
--font-serif:var(--font-instrument-serif),ui-serif,Georgia,serif;
--fs-h1:64px;--fs-h2:44px;--fs-h3:28px;--fs-h4:20px;--fs-body-lg:18px;--fs-body:15px;--fs-small:13px;--fs-micro:11px;
--lh-heading:1.05;--lh-snug:1.3;--lh-body:1.55;
--ls-heading:-0.035em;--ls-tight:-0.015em;--ls-body:-0.005em;--ls-mono:0.06em;
--text-h1:500 var(--fs-h1)/var(--lh-heading) var(--font-sans);
--text-h2:500 var(--fs-h2)/var(--lh-heading) var(--font-sans);
--text-h3:500 var(--fs-h3)/1.15 var(--font-sans);
--text-h4:500 var(--fs-h4)/var(--lh-snug) var(--font-sans);
--text-body-md:400 var(--fs-body)/var(--lh-body) var(--font-sans);
--text-small:400 var(--fs-small)/1.45 var(--font-sans);
--text-micro:400 var(--fs-micro)/1.3 var(--font-mono);
--radius-md:10px;--radius-lg:14px;--radius-xl:20px;
--container-max:1200px;--gutter:24px;
--shadow-hairline:0 0 0 1px var(--border-hairline);
--shadow-sm:0 1px 2px rgba(10,10,11,.04),0 0 0 1px var(--border-hairline);
--shadow-float:0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14),0 0 0 1px var(--border-hairline);
--ease-out:cubic-bezier(.22,1,.36,1);
--dur-fast:140ms;--dur-base:240ms;
min-height:100vh;background:var(--paper);color:var(--fg-1);font:var(--text-body-md);letter-spacing:var(--ls-body);-webkit-font-smoothing:antialiased;
}
.qh-account a{color:var(--fg-1)}
.qh-account ::selection{background:var(--ink-950);color:var(--white)}
.qh-account :focus-visible{outline:2px solid var(--ink-500);outline-offset:2px}
@keyframes qhFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes qhPulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes qhSpin{to{transform:rotate(360deg)}}
.qh-account .qh-acc-nav:hover,.qh-account .qh-acc-signout:hover{background:var(--ink-100)!important;color:var(--fg-1)!important}
.qh-account .qh-acc-card:hover{box-shadow:inset 0 0 0 1.5px var(--ink-950)!important}
.qh-account .qh-acc-row:hover{background:var(--ink-50)!important}
.qh-account .qh-acc-green:hover{background:#0D6E00!important}
.qh-account .qh-acc-ghost:hover{background:var(--ink-50)!important}
.qh-account .qh-acc-decline:hover{background:var(--ink-100)!important;color:var(--fg-1)!important}
.qh-account .qh-acc-icon:hover{background:var(--ink-100)!important}
.qh-account .qh-acc-star:hover{background:var(--ink-50)!important}
.qh-account .qh-acc-press:active{transform:scale(.98)}
.qh-account .qh-acc-press-sm:active{transform:scale(.96)}
.qh-account button:disabled{cursor:not-allowed!important;opacity:.6}
`

export const GREEN = "#108600"

/**
 * Turns a design `style="..."` declaration list into a React style object, so
 * the values stay byte-for-byte what the design source uses.
 */
export function sx(declarations: string): CSSProperties {
  const out: Record<string, string> = {}
  for (const declaration of declarations.split(";")) {
    const colon = declaration.indexOf(":")
    if (colon < 0) continue
    const prop = declaration.slice(0, colon).trim()
    const value = declaration.slice(colon + 1).trim()
    if (!prop || !value) continue
    const key = prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    out[key] = value
  }
  return out as CSSProperties
}

export const EYEBROW = sx(
  "font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)"
)

export const PAGE_H1 = sx(
  "font:var(--text-h1);font-size:clamp(36px,4.4vw,52px);letter-spacing:var(--ls-heading);margin:12px 0 0"
)

export const SERIF_EM = sx(
  `font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-0.02em;color:${GREEN}`
)

export function initialsOf(name: string | null | undefined) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function firstNameOf(name: string | null | undefined) {
  return (name || "").split(" ").filter(Boolean)[0] || ""
}

export function dayLabel(iso: string | null | undefined) {
  if (!iso) return ""
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function whenLabel(startDate: string | null | undefined, endDate: string | null | undefined) {
  const start = dayLabel(startDate)
  const end = dayLabel(endDate)
  return start && end && start !== end ? `${start} – ${end}` : start || end
}

export function fullDateLabel(iso: string | null | undefined) {
  if (!iso) return ""
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
