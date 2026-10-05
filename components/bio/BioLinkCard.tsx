import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { BIO_ACCENT, BIO_ACCENT_TINT, BIO_INSET, BIO_MICRO } from "@/components/bio/BioDesign"

/** Full-width white card with a hairline inset ring and an accent icon chip. */
export function BioLinkCard({
  href,
  label,
  icon,
  external,
}: {
  href: string
  label: string
  icon: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="qh-bio-card"
      style={{
        display: "flex",
        width: "100%",
        boxSizing: "border-box",
        alignItems: "center",
        gap: 12,
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: BIO_INSET,
        padding: "14px 16px",
        color: "var(--fg-1)",
      }}
    >
      <span
        style={{
          display: "flex",
          width: 36,
          height: 36,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: BIO_ACCENT_TINT,
          color: BIO_ACCENT,
        }}
      >
        {icon}
      </span>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </span>
      {external ? (
        <ArrowUpRight style={{ width: 16, height: 16, flexShrink: 0, color: "var(--fg-3)" }} />
      ) : null}
    </a>
  )
}

/** Mono uppercase eyebrow between groups of link cards (the "We are hiring!" slot). */
export function BioHeadingDivider({ label }: { label: string }) {
  return (
    <p
      style={{
        ...BIO_MICRO,
        margin: 0,
        paddingTop: 12,
        textAlign: "center",
        color: "var(--fg-2)",
      }}
    >
      {label}
    </p>
  )
}
