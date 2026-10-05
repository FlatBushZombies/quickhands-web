import { authFontClassName } from "@/components/auth/fonts"

/*
 * Quickhands artifact design for the /specialists directory. Tokens match
 * components/auth/AuthScreen.tsx, components/client-landing/ClientLanding.tsx
 * and components/bio/BioDesign.tsx. This is the client-facing directory, so
 * the accent is the client green rather than the specialist blue.
 */

/** Apply to the root of the specialists page, together with the styles below. */
export const SPECIALISTS_ROOT_CLASS = `qh-sp ${authFontClassName}`

export const SPECIALISTS_CSS = `
.qh-sp{--ink-950:#0A0A0B;--ink-800:#1F1F22;--ink-600:#4A4A50;--ink-500:#6E6E75;--ink-400:#9A9AA0;--ink-100:#EFEFF0;--ink-50:#F6F6F5;--paper:#FBFBFA;--white:#FFFFFF;
--green:#108600;--green-hover:#0D6E00;--green-tint:rgba(16,134,0,.08);--signal-500:#2F54FF;
--border-hairline:rgba(10,10,11,.08);--border-default:rgba(10,10,11,.12);
--shadow-card:inset 0 0 0 1px rgba(10,10,11,.12),0 1px 2px rgba(10,10,11,.04);
--shadow-float:0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14),0 0 0 1px rgba(10,10,11,.08);
--ease-out:cubic-bezier(.22,1,.36,1);--dur-fast:140ms;--dur-base:240ms;
--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif;
--font-mono:var(--font-geist-mono),ui-monospace,Menlo,monospace;
--font-serif:var(--font-instrument-serif),ui-serif,Georgia,serif;
background:var(--paper);color:var(--ink-950);font-family:var(--font-sans);font-size:15px;line-height:1.55;letter-spacing:-0.005em;-webkit-font-smoothing:antialiased;min-height:100vh;
}
.qh-sp a{color:inherit;text-decoration:none}
.qh-sp :focus-visible{outline:2px solid var(--signal-500);outline-offset:2px}
.qh-sp ::selection{background:var(--ink-950);color:var(--white)}
/* Clears the floating LandingNav (60px top, 64px tall) below the 44px audience strip. */
.qh-sp-main{min-height:100vh;padding:136px 0 96px}
.qh-sp-wrap{max-width:1000px;margin:0 auto;padding:0 20px}
@media (min-width:640px){.qh-sp-wrap{padding:0 24px}}

.qh-sp-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:11px;line-height:1.3;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-500)}
.qh-sp-eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--green)}
.qh-sp-h1{margin:20px 0 0;font:500 clamp(40px,5.4vw,64px)/1.05 var(--font-sans);letter-spacing:-0.035em;color:var(--ink-950);text-wrap:balance;max-width:20ch}
.qh-sp-h1 em{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-0.02em;color:var(--green)}
.qh-sp-lead{margin:16px 0 0;max-width:56ch;font-size:18px;line-height:1.55;letter-spacing:-0.005em;color:var(--ink-600)}

.qh-sp-search{display:flex;align-items:center;gap:8px;width:100%;max-width:640px;margin-top:32px;padding:6px 6px 6px 20px;border-radius:999px;background:var(--white);box-shadow:var(--shadow-float);transition:box-shadow var(--dur-fast) var(--ease-out)}
.qh-sp-search:focus-within{box-shadow:var(--shadow-float),0 0 0 3px rgba(16,134,0,.18)}
.qh-sp-search-icon{display:block;flex-shrink:0;color:var(--ink-400)}
.qh-sp-search input{flex:1;min-width:0;height:44px;border:0;outline:none;background:transparent;font-family:var(--font-sans);font-size:16px;letter-spacing:-0.005em;color:var(--ink-950)}
.qh-sp-search input::placeholder{color:var(--ink-400)}

.qh-sp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;padding:0 20px;border:0;border-radius:999px;font-family:var(--font-sans);font-size:14px;font-weight:500;line-height:1;letter-spacing:-0.01em;white-space:nowrap;cursor:pointer;transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)}
.qh-sp-btn:active{transform:scale(.98)}
.qh-sp-btn-primary{background:var(--green);color:var(--white);padding:0 22px}
.qh-sp-btn-primary:hover{background:var(--green-hover)}
.qh-sp-btn-ghost{background:var(--white);color:var(--ink-950);box-shadow:var(--shadow-card)}
.qh-sp-btn-ghost:hover{background:var(--ink-100)}
.qh-sp-btn-icon{width:16px;height:16px;flex-shrink:0}
.qh-sp-hire:hover .qh-sp-arrow{transform:translateX(2px)}
.qh-sp-arrow{transition:transform var(--dur-base) var(--ease-out)}

.qh-sp-label{margin:0;font-family:var(--font-mono);font-size:11px;font-weight:400;line-height:1.3;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-500)}
.qh-sp-section{margin-top:40px}
.qh-sp-section-title{margin:0;font:500 24px/1.2 var(--font-sans);letter-spacing:-0.035em;color:var(--ink-950)}

.qh-sp-list{list-style:none;margin:16px 0 0;padding:0;overflow:hidden;border-radius:20px;background:var(--white);box-shadow:var(--shadow-card)}
.qh-sp-row{display:flex;flex-direction:column;gap:20px;padding:24px}
.qh-sp-list>li+li{border-top:1px solid var(--border-hairline)}
@media (min-width:640px){.qh-sp-row{flex-direction:row;align-items:flex-start;gap:24px}}

.qh-sp-avatar{display:block;flex-shrink:0;width:64px;height:64px;border-radius:50%;object-fit:cover}
.qh-sp-initials{display:flex;flex-shrink:0;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:var(--green-tint);color:var(--green);font:500 20px/1 var(--font-sans);letter-spacing:-0.035em}
.qh-sp-body{min-width:0;flex:1}
.qh-sp-head{display:flex;flex-wrap:wrap;align-items:center;column-gap:12px;row-gap:4px}
.qh-sp-name{margin:0;font:500 20px/1.2 var(--font-sans);letter-spacing:-0.035em;color:var(--ink-950)}
.qh-sp-rating{display:inline-flex;align-items:center;gap:4px;font-size:13px;color:var(--ink-500)}
.qh-sp-rating strong{font-weight:500;color:var(--ink-950)}
.qh-sp-meta{display:flex;flex-wrap:wrap;align-items:center;column-gap:8px;row-gap:4px;margin:6px 0 0;font-size:13px;color:var(--ink-500)}
.qh-sp-meta-item{display:inline-flex;align-items:center;gap:6px}
.qh-sp-meta-dot{color:var(--ink-400)}
.qh-sp-meta-rate{font-weight:500;color:var(--ink-950)}
.qh-sp-tagline{margin:12px 0 0;max-width:60ch;font-size:15px;line-height:1.55;color:var(--ink-950)}
.qh-sp-skills{list-style:none;margin:16px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.qh-sp-skill{display:inline-flex;align-items:center;height:28px;padding:0 12px;border-radius:999px;background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);font-size:13px;font-weight:500;line-height:1;color:var(--ink-600)}
.qh-sp-actions{display:flex;flex-direction:column;flex-shrink:0;gap:8px}
@media (min-width:640px){.qh-sp-actions{width:176px}}

.qh-sp-panel{padding:48px 24px;border-radius:20px;border:1px dashed rgba(10,10,11,.16);background:rgba(255,255,255,.6);text-align:center}
.qh-sp-panel-icon{display:block;margin:0 auto;color:var(--ink-400)}
.qh-sp-panel-title{margin:16px 0 0;font:500 22px/1.2 var(--font-sans);letter-spacing:-0.035em;color:var(--ink-950)}
.qh-sp-panel-body{margin:8px auto 0;max-width:48ch;font-size:15px;color:var(--ink-600)}
.qh-sp-panel-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;margin-top:24px}
.qh-sp-fallback{margin-top:48px}
`
