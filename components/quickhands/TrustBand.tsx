import type { ReactNode } from "react"

/**
 * The four trust signals under the landing hero, as one deliberate component:
 * a single hairline-bordered container split into equal cells (the cells sit
 * on a 1px gap over the border colour, so dividers stay correct at every
 * breakpoint — 4-up, 2×2 — without per-cell border logic), each pairing a
 * branded icon tile with the benefit as a real heading-weight title.
 */

// Shared drawing rules for the icon set: 24px grid, 1.9 stroke, round caps
// and joins, white "paper" fills under the green line-work so each glyph has
// a little body instead of reading as a thin wireframe.
const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "h-6 w-6",
} as const

function VerifiedIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 3 19.5 5.9v5.3c0 4.6-3.1 8.1-7.5 9.8-4.4-1.7-7.5-5.2-7.5-9.8V5.9L12 3Z" fill="#fff" />
      <path d="m8.6 12.1 2.5 2.5 4.4-4.7" strokeWidth={2.2} />
    </svg>
  )
}

function LocalIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 21.2c-3.4-3-6.8-6.8-6.8-11a6.8 6.8 0 0 1 13.6 0c0 4.2-3.4 8-6.8 11Z" fill="#fff" />
      <circle cx="12" cy="10.2" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SecureChatIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path
        d="M5.5 4.2h13A2.5 2.5 0 0 1 21 6.7v7.9a2.5 2.5 0 0 1-2.5 2.5H12.6L8 20.6v-3.5H5.5A2.5 2.5 0 0 1 3 14.6V6.7a2.5 2.5 0 0 1 2.5-2.5Z"
        fill="#fff"
      />
      <path d="M10.7 9.6V8.9a1.3 1.3 0 0 1 2.6 0v.7" strokeWidth={1.6} />
      <rect x="9.4" y="9.6" width="5.2" height="4" rx="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ScheduleIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3" y="5" width="15.5" height="14" rx="2.6" fill="#fff" />
      <path d="M3 9.6h15.5M7.6 3.2v3.6M13.9 3.2v3.6" />
      <circle cx="17.2" cy="17.2" r="4.4" fill="#fff" />
      <path d="M17.2 14.9v2.4l1.6 1" strokeWidth={1.7} />
    </svg>
  )
}

const TRUST_SIGNALS: { icon: ReactNode; label: string }[] = [
  { icon: <VerifiedIcon />, label: "Verified specialists" },
  { icon: <LocalIcon />, label: "Local professionals" },
  { icon: <SecureChatIcon />, label: "Secure communication" },
  { icon: <ScheduleIcon />, label: "Flexible scheduling" },
]

export function TrustBand() {
  return (
    <div className="relative w-full border-b border-[#ECECEC] bg-zinc-50 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-[1800px] px-5 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:max-w-[1600px]">
        <ul
          aria-label="Why QuickHands"
          className="grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-[#ECECEC] bg-[#ECECEC] lg:grid-cols-4"
        >
          {TRUST_SIGNALS.map(({ icon, label }) => (
            <li
              key={label}
              className="group flex flex-col items-start gap-3.5 bg-white px-4 py-5 sm:flex-row sm:items-center sm:gap-4 sm:px-6"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-primary-light text-primary-hover shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(16,134,0,0.14)] ring-1 ring-inset ring-primary/15 transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:ring-primary/35 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                aria-hidden="true"
              >
                {icon}
              </span>
              <span className="min-w-0 font-heading text-[15px] font-bold leading-snug tracking-[-0.01em] text-zinc-950 sm:text-[17px]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
