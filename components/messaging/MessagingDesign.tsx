import type { CSSProperties } from "react"
import { authFontClassName } from "@/components/auth/fonts"
import { getInitials } from "@/components/app-shell/Avatar"
import type { AppRole } from "@/lib/user-api"

/*
 * Shared design tokens for the messages surfaces. Values come from the
 * Quickhands artifact design system (see components/bio/BioDesign.tsx and
 * components/auth/AuthScreen.tsx). Messages are shared by both roles, so the
 * accent follows the viewer: green for clients, specialist blue for
 * specialists.
 */

export const MSG_ROOT_CLASS = `qh-msg ${authFontClassName}`

export const MSG_ROOT_STYLE: CSSProperties = {
  background: "var(--paper)",
  color: "var(--ink-950)",
  fontFamily: "var(--font-sans)",
  fontSize: 15,
  lineHeight: 1.55,
  letterSpacing: "-0.005em",
  WebkitFontSmoothing: "antialiased",
}

/** Accent variables for the viewer's role, applied on the same root as the tokens. */
export function messagingPalette(appRole: AppRole): CSSProperties {
  const specialist = appRole === "freelancer"
  return {
    "--accent": specialist ? "#1B3A9E" : "#108600",
    "--accent-hover": specialist ? "#162F7F" : "#0D6E00",
    "--accent-tint": specialist ? "rgba(27,58,158,.08)" : "rgba(16,134,0,.08)",
    "--accent-line": specialist ? "rgba(27,58,158,.32)" : "rgba(16,134,0,.32)",
  } as CSSProperties
}

const MSG_CSS = `
.qh-msg{
--ink-950:#0A0A0B;--ink-600:#4A4A50;--ink-500:#6E6E75;--ink-400:#9A9AA0;--ink-100:#EFEFF0;--ink-50:#F6F6F5;
--paper:#FBFBFA;--white:#FFFFFF;--signal-500:#2F54FF;--danger-600:#C9302C;
--accent:#108600;--accent-hover:#0D6E00;--accent-tint:rgba(16,134,0,.08);--accent-line:rgba(16,134,0,.32);
--border-hairline:rgba(10,10,11,.08);--border-default:rgba(10,10,11,.12);
--shadow-inset:inset 0 0 0 1px var(--border-default),0 1px 2px rgba(10,10,11,.04);
--ease-out:cubic-bezier(.22,1,.36,1);--dur-fast:140ms;--dur-base:240ms;
--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif;
--font-mono:var(--font-geist-mono),ui-monospace,Menlo,monospace;
--font-serif:var(--font-instrument-serif),ui-serif,Georgia,serif;
}
.qh-msg a{color:inherit;text-decoration:none}
.qh-msg :focus-visible{outline:2px solid var(--signal-500);outline-offset:2px}
.qh-msg input:focus-visible{outline:none}
.qh-msg ::selection{background:var(--ink-950);color:var(--white)}
.qh-msg-inset{box-shadow:var(--shadow-inset)}
.qh-msg-hair{border-bottom:1px solid var(--border-hairline)}
.qh-msg-hair-top{border-top:1px solid var(--border-hairline)}
.qh-msg-rule{background:var(--border-default)}
.qh-msg-eyebrow{font-family:var(--font-mono);font-size:11px;line-height:1.3;font-weight:400;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-500)}
.qh-msg-serif{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.02em;color:var(--accent)}
.qh-msg-row{transition:box-shadow var(--dur-base) var(--ease-out),transform var(--dur-base) var(--ease-out)}
.qh-msg-row:hover{box-shadow:inset 0 0 0 1px var(--accent-line),0 8px 20px -12px rgba(10,10,11,.2)}
.qh-msg-row:active{transform:scale(.99)}
.qh-msg-composer{transition:box-shadow var(--dur-base) var(--ease-out)}
.qh-msg-composer:focus-within{box-shadow:inset 0 0 0 1px var(--accent-line),0 0 0 3px var(--accent-tint)}
.qh-msg-tag{transition:box-shadow var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)}
.qh-msg-tag:hover:not(:disabled){box-shadow:inset 0 0 0 1px var(--accent-line);color:var(--ink-950)}
.qh-msg-send{transition:background var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out),opacity var(--dur-fast) var(--ease-out)}
.qh-msg-send:hover:not(:disabled){background:var(--accent-hover)}
.qh-msg-send:active:not(:disabled){transform:scale(.98)}
@media (prefers-reduced-motion:reduce){.qh-msg *{transition:none!important;animation:none!important;transform:none!important}}
`

/** Scoped tokens and states. Render once inside each messages root. */
export function MessagingStyles() {
  return <style>{MSG_CSS}</style>
}

/** Squircle-free rounded avatar in the design palette. Decorative; the name sits beside it. */
export function MsgAvatar({
  name,
  imageUrl,
  mine = false,
}: {
  name: string
  imageUrl?: string | null
  mine?: boolean
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-[12px] object-cover" />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="qh-msg-inset flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-[12px] text-[13px] font-medium"
      style={
        mine
          ? { background: "var(--accent-tint)", color: "var(--accent)" }
          : { background: "var(--white)", color: "var(--ink-600)" }
      }
    >
      {getInitials(name)}
    </div>
  )
}

/** Date break in the thread: hairline, mono label pill, hairline. */
export function MsgDateDivider({ label }: { label: string }) {
  return (
    <li role="presentation" className="flex items-center gap-3 py-3">
      <span className="qh-msg-rule h-px flex-1" />
      <span className="qh-msg-eyebrow qh-msg-inset rounded-full bg-[var(--white)] px-3 py-1.5">{label}</span>
      <span className="qh-msg-rule h-px flex-1" />
    </li>
  )
}
