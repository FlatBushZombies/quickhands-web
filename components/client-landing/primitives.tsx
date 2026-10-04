"use client"

import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"

/**
 * Recreations of the NoirsferaDesignSystem components the Client landing design
 * uses (Button, Tag, Divider, Segmented). Their source is not in the design
 * artifact, so sizes come from the template's hint-size values and colours from
 * its design tokens. Hover states are classes in ClientLanding's stylesheet.
 */

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#")
}

type ButtonProps = {
  variant?: "primary" | "ghost"
  size?: "md" | "lg"
  href?: string
  onClick?: () => void
  full?: boolean
  iconRight?: ReactNode
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function Button({ variant = "primary", size = "md", href, onClick, full, iconRight, className: extraClass, style, children }: ButtonProps) {
  const lg = size === "lg"
  const className = ["qh-btn", `qh-btn-${variant}`, extraClass].filter(Boolean).join(" ")
  const base: CSSProperties = {
    height: lg ? 52 : 40,
    padding: lg ? "0 26px" : "0 18px",
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    fontSize: lg ? 15 : 14,
    lineHeight: 1,
    letterSpacing: "-0.01em",
    width: full ? "100%" : undefined,
    ...style,
  }

  if (href && isInternal(href)) {
    return (
      <Link href={href} className={className} style={base}>
        {children}
        {iconRight}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={className} style={base}>
        {children}
        {iconRight}
      </a>
    )
  }
  return (
    <button type="button" className={className} style={base} onClick={onClick}>
      {children}
      {iconRight}
    </button>
  )
}

export function Tag({ inverse, live, children }: { inverse?: boolean; live?: boolean; children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 24,
        padding: "0 10px",
        borderRadius: 999,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        lineHeight: 1,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        background: inverse ? "rgba(255,255,255,.12)" : "var(--white)",
        color: inverse ? "var(--white)" : "var(--fg-2)",
        boxShadow: inverse ? "none" : "inset 0 0 0 1px var(--border-default)",
      }}
    >
      {live ? (
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: inverse ? "#7BD96B" : "#108600",
            animation: "qhPulse 2s ease-in-out infinite",
          }}
        />
      ) : null}
      {children}
    </span>
  )
}

export function Divider({ label, inverse }: { label: string; inverse?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, height: 16, width: "100%" }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: inverse ? "rgba(255,255,255,.45)" : "var(--fg-3)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1, height: 1, background: inverse ? "var(--border-inverse)" : "var(--border-default)" }} />
    </div>
  )
}

export function Segmented({
  options,
  value,
  onChange,
  width,
  height,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  width: number
  height: number
}) {
  return (
    <div
      role="radiogroup"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${options.length},minmax(0,1fr))`,
        gap: 2,
        width,
        height,
        padding: 2,
        boxSizing: "border-box",
        borderRadius: 999,
        background: "var(--ink-100)",
      }}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={active ? "qh-seg qh-seg-active" : "qh-seg"}
            style={{
              border: 0,
              borderRadius: 999,
              padding: 0,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: 13,
              lineHeight: 1,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
