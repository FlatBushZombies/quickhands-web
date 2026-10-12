import { authFontClassName } from "@/components/auth/fonts"

/*
 * Quickhands artifact design for the /hire booking flow. Tokens match
 * components/specialists/specialists-design.ts (same directory the visitor
 * arrived from) — client green accent, paper background, Geist/Instrument
 * Serif pairing, pill buttons, hairline cards.
 */

export const HIRE_ROOT_CLASS = `qh-hire ${authFontClassName}`

export const HIRE_CSS = `
.qh-hire{--ink-950:#0A0A0B;--ink-800:#1F1F22;--ink-600:#4A4A50;--ink-500:#6E6E75;--ink-400:#9A9AA0;--ink-100:#EFEFF0;--ink-50:#F6F6F5;--paper:#FBFBFA;--white:#FFFFFF;
--green:#108600;--green-hover:#0D6E00;--green-tint:rgba(16,134,0,.08);--signal-500:#2F54FF;--warn:#C2410C;
--border-hairline:rgba(10,10,11,.08);--border-default:rgba(10,10,11,.12);
--shadow-card:inset 0 0 0 1px rgba(10,10,11,.12),0 1px 2px rgba(10,10,11,.04);
--shadow-float:0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14),0 0 0 1px rgba(10,10,11,.08);
--ease-out:cubic-bezier(.22,1,.36,1);--dur-fast:140ms;--dur-base:240ms;
--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif;
--font-mono:var(--font-geist-mono),ui-monospace,Menlo,monospace;
--font-serif:var(--font-instrument-serif),ui-serif,Georgia,serif;
background:var(--paper);color:var(--ink-950);font-family:var(--font-sans);font-size:15px;line-height:1.55;letter-spacing:-0.005em;-webkit-font-smoothing:antialiased;min-height:100vh;
}
.qh-hire a{color:inherit;text-decoration:none}
.qh-hire :focus-visible{outline:2px solid var(--signal-500);outline-offset:2px}
.qh-hire-main{min-height:100vh;padding:136px 0 96px}
.qh-hire-wrap{max-width:720px;margin:0 auto;padding:0 20px}
@media (min-width:640px){.qh-hire-wrap{padding:0 24px}}

.qh-hire-back{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--ink-500)}
.qh-hire-back:hover{color:var(--ink-950)}

.qh-hire-profile{display:flex;align-items:flex-start;gap:16px;margin-top:20px}
.qh-hire-avatar{display:block;flex-shrink:0;width:56px;height:56px;border-radius:50%;object-fit:cover}
.qh-hire-initials{display:flex;flex-shrink:0;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:var(--green-tint);color:var(--green);font:500 18px/1 var(--font-sans);letter-spacing:-0.035em}
.qh-hire-eyebrow{display:block;font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-500)}
.qh-hire-h1{margin:4px 0 0;font:500 clamp(28px,4vw,36px)/1.15 var(--font-sans);letter-spacing:-0.035em;color:var(--ink-950)}
.qh-hire-h1 em{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-0.02em;color:var(--green)}
.qh-hire-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px;font-size:13px;color:var(--ink-500)}
.qh-hire-meta-dot{color:var(--ink-400)}
.qh-hire-skills{list-style:none;margin:16px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.qh-hire-skill{display:inline-flex;align-items:center;height:26px;padding:0 12px;border-radius:999px;background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);font-size:12px;font-weight:500;color:var(--ink-600)}

.qh-hire-section{margin-top:40px}
.qh-hire-label{margin:0 0 16px;font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-500)}

.qh-hire-days{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
.qh-hire-days::-webkit-scrollbar{display:none}
.qh-hire-day{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:2px;width:64px;padding:10px 0;border:0;border-radius:16px;background:var(--white);box-shadow:var(--shadow-card);cursor:pointer;font-family:var(--font-sans);color:var(--ink-950);transition:background var(--dur-fast) var(--ease-out)}
.qh-hire-day:hover{background:var(--ink-100)}
.qh-hire-day[aria-pressed="true"]{background:var(--green);color:var(--white);box-shadow:none}
.qh-hire-day-name{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.04em;opacity:.7}
.qh-hire-day-num{font-size:18px;font-weight:500;letter-spacing:-0.02em}

.qh-hire-slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px;margin-top:16px}
.qh-hire-slot{display:flex;align-items:center;justify-content:center;height:44px;border:0;border-radius:999px;background:var(--white);box-shadow:var(--shadow-card);font-family:var(--font-sans);font-size:14px;font-weight:500;color:var(--ink-950);cursor:pointer;transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)}
.qh-hire-slot:hover{background:var(--ink-100)}
.qh-hire-slot[aria-pressed="true"]{background:var(--green);color:var(--white);box-shadow:none}

.qh-hire-panel{padding:32px 24px;border-radius:20px;background:var(--white);box-shadow:var(--shadow-card);text-align:center}
.qh-hire-panel-title{margin:16px 0 0;font:500 20px/1.3 var(--font-sans);letter-spacing:-0.025em;color:var(--ink-950)}
.qh-hire-panel-body{margin:8px auto 0;max-width:44ch;font-size:14px;color:var(--ink-600)}

.qh-hire-form{margin-top:24px;padding:24px;border-radius:20px;background:var(--white);box-shadow:var(--shadow-card);display:flex;flex-direction:column;gap:16px}
.qh-hire-field{display:flex;flex-direction:column;gap:6px}
.qh-hire-field label{font-size:13px;font-weight:500;color:var(--ink-600)}
.qh-hire-field input,.qh-hire-field textarea{border:0;border-radius:12px;padding:12px 14px;background:var(--ink-50);box-shadow:inset 0 0 0 1px var(--border-hairline);font-family:var(--font-sans);font-size:14px;color:var(--ink-950);resize:vertical}
.qh-hire-field input::placeholder,.qh-hire-field textarea::placeholder{color:var(--ink-400)}
.qh-hire-summary{display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:14px;background:var(--green-tint);color:var(--green);font-size:14px;font-weight:500}

.qh-hire-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:46px;padding:0 22px;border:0;border-radius:999px;font-family:var(--font-sans);font-size:14px;font-weight:500;letter-spacing:-0.01em;white-space:nowrap;cursor:pointer;transition:background var(--dur-fast) var(--ease-out),opacity var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)}
.qh-hire-btn:active{transform:scale(.98)}
.qh-hire-btn:disabled{opacity:.5;cursor:default;transform:none}
.qh-hire-btn-primary{background:var(--green);color:var(--white);width:100%}
.qh-hire-btn-primary:hover:not(:disabled){background:var(--green-hover)}
.qh-hire-btn-ghost{background:var(--white);color:var(--ink-950);box-shadow:var(--shadow-card)}
.qh-hire-btn-ghost:hover{background:var(--ink-100)}

.qh-hire-error{margin-top:12px;padding:12px 16px;border-radius:14px;background:rgba(194,65,12,.08);color:var(--warn);font-size:13px}
.qh-hire-skeleton{border-radius:16px;background:var(--ink-100);animation:qhHirePulse 1.4s ease-in-out infinite}
@keyframes qhHirePulse{0%,100%{opacity:1}50%{opacity:.6}}
.qh-hire-actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px}
`
