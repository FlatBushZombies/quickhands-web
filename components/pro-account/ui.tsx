"use client"

import { createElement, useState, type ChangeEvent, type CSSProperties, type ElementType, type MouseEvent, type ReactNode } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Briefcase,
  Calendar,
  Check,
  CircleCheck,
  CircleDashed,
  GraduationCap,
  History,
  Info,
  LayoutGrid,
  LockOpen,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Scissors,
  Send,
  Sparkles,
  Star,
  Trash2,
  Trees,
  Truck,
  UserRound,
  Users,
  Wrench,
  X,
  LogOut,
  type LucideIcon,
} from "lucide-react"

/** The design's accent blue, used as a literal in the source. */
export const G = "#1B3A9E"
export const G_DARK = "#142C7A"
export const G_TINT = "#E7ECF8"

const SANS = "var(--font-sans)"

/**
 * Turns the design's inline `style="..."` declaration strings into React style
 * objects, so the values stay byte-for-byte what the design specifies.
 */
export function css(input: string): CSSProperties {
  const out: Record<string, string> = {}
  let depth = 0
  let quote: string | null = null
  let current = ""
  const decls: string[] = []
  for (const ch of input) {
    if (quote) {
      if (ch === quote) quote = null
    } else if (ch === '"' || ch === "'") {
      quote = ch
    } else if (ch === "(") {
      depth++
    } else if (ch === ")") {
      depth--
    } else if (ch === ";" && depth === 0) {
      decls.push(current)
      current = ""
      continue
    }
    current += ch
  }
  decls.push(current)

  for (const decl of decls) {
    const idx = decl.indexOf(":")
    if (idx < 0) continue
    const prop = decl.slice(0, idx).trim()
    const value = decl.slice(idx + 1).trim()
    if (!prop || !value) continue
    out[toCamel(prop)] = value
  }
  return out as CSSProperties
}

function toCamel(prop: string) {
  if (prop.startsWith("--")) return prop
  const body = prop.startsWith("-webkit-") ? "Webkit" + prop.slice(8) : prop
  return body.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

type IxProps = {
  as?: ElementType
  base?: string
  hover?: string
  active?: string
  style?: CSSProperties
  children?: ReactNode
  [key: string]: unknown
}

/**
 * An element whose inline style reacts to hover and press, the way the
 * design's style-hover / style-active attributes do.
 */
export function Ix({ as = "button", base = "", hover = "", active = "", style, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, ...rest }: IxProps) {
  const [isHover, setHover] = useState(false)
  const [isActive, setActive] = useState(false)
  const merged: CSSProperties = {
    ...css(base),
    ...(isHover && hover ? css(hover) : {}),
    ...(isActive && active ? css(active) : {}),
    ...style,
  }
  return createElement(as, {
    ...rest,
    style: merged,
    onMouseEnter: (e: MouseEvent) => {
      setHover(true)
      ;(onMouseEnter as ((e: MouseEvent) => void) | undefined)?.(e)
    },
    onMouseLeave: (e: MouseEvent) => {
      setHover(false)
      setActive(false)
      ;(onMouseLeave as ((e: MouseEvent) => void) | undefined)?.(e)
    },
    onMouseDown: (e: MouseEvent) => {
      setActive(true)
      ;(onMouseDown as ((e: MouseEvent) => void) | undefined)?.(e)
    },
    onMouseUp: (e: MouseEvent) => {
      setActive(false)
      ;(onMouseUp as ((e: MouseEvent) => void) | undefined)?.(e)
    },
  })
}

/** Plain styled element (no hover). */
export function Box({ as = "div", style, children, ...rest }: { as?: ElementType; style?: string; children?: ReactNode; [key: string]: unknown }) {
  return createElement(as, { ...rest, style: css(style ?? "") }, children)
}

const ICONS: Record<string, LucideIcon> = {
  "badge-check": BadgeCheck,
  "layout-grid": LayoutGrid,
  briefcase: Briefcase,
  send: Send,
  "user-round": UserRound,
  "log-out": LogOut,
  "arrow-up-right": ArrowUpRight,
  "arrow-right": ArrowRight,
  "map-pin": MapPin,
  calendar: Calendar,
  check: Check,
  "circle-check": CircleCheck,
  "circle-dashed": CircleDashed,
  award: Award,
  plus: Plus,
  "trash-2": Trash2,
  x: X,
  "message-square": MessageSquare,
  phone: Phone,
  mail: Mail,
  star: Star,
  "lock-open": LockOpen,
  info: Info,
  users: Users,
  wrench: Wrench,
  sparkles: Sparkles,
  truck: Truck,
  scissors: Scissors,
  trees: Trees,
  "graduation-cap": GraduationCap,
  history: History,
}

/** A design icon (`data-icon` in the source), sized and stroked as the design does. */
export function Ico({ name, size = 16, style = "" }: { name: string; size?: number; style?: string }) {
  const Cmp = ICONS[name]
  return (
    <span style={{ display: "inline-flex", ...css(style) }}>
      {Cmp ? <Cmp width={size} height={size} strokeWidth={1.5} aria-hidden="true" /> : null}
    </span>
  )
}

export function Eyebrow({ children, style = "" }: { children: ReactNode; style?: string }) {
  return (
    <span style={css(`font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3);${style}`)}>
      {children}
    </span>
  )
}

export function Modal({
  label,
  maxWidth,
  children,
  zIndex = 50,
  boxStyle = "",
}: {
  label: string
  maxWidth: number
  children: ReactNode
  zIndex?: number
  boxStyle?: string
}) {
  return (
    <div
      style={css(
        `position:fixed;inset:0;z-index:${zIndex};background:rgba(10,10,11,.56);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;animation:qhFade 200ms var(--ease-out) both`
      )}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        style={css(
          `width:100%;max-width:${maxWidth}px;max-height:calc(100vh - 32px);display:flex;flex-direction:column;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-float);overflow:hidden;${boxStyle}`
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ eyebrow, onClose }: { eyebrow: string; onClose: () => void }) {
  return (
    <div style={css("display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--border-hairline)")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Ix
        aria-label="Close"
        onClick={onClose}
        base="width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:var(--fg-2);display:inline-flex;align-items:center;justify-content:center;cursor:pointer"
        hover="background:var(--ink-100)"
      >
        <Ico name="x" size={16} />
      </Ix>
    </div>
  )
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label style={css(`display:block;font:500 13px/1 ${SANS};color:var(--fg-1);margin-bottom:8px`)}>{children}</label>
}

export const inputBase = css(
  `width:100%;box-sizing:border-box;height:44px;padding:0 14px;border:0;border-radius:var(--radius-md);background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);font:var(--text-body-md);font-size:15px;color:var(--fg-1);outline:none`
)

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  rows = 3,
  min,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  multiline?: boolean
  rows?: number
  min?: string
}) {
  const shared = {
    value,
    placeholder,
    "aria-label": label,
    onChange: (e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => onChange(e.target.value),
    style: { ...inputBase, ...(multiline ? { height: "auto", padding: "12px 14px", resize: "vertical" as const, lineHeight: 1.5 } : {}) },
  }
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {multiline ? <textarea rows={rows} {...shared} /> : <input type={type} min={min} {...shared} />}
    </div>
  )
}

export const Divider = () => <div style={css("height:1px;background:var(--border-hairline)")} />

export { SANS }
