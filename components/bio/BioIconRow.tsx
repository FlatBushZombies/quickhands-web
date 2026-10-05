import type { ReactNode } from "react"
import { BIO_ACCENT, BIO_INSET } from "@/components/bio/BioDesign"

export interface BioIconLink {
  key: string
  label: string
  href: string
  icon: ReactNode
  external?: boolean
}

/**
 * Compact row of icon-only round controls: white discs with a hairline
 * inset ring and accent glyphs. Call / WhatsApp / Email.
 */
export function BioIconRow({ links }: { links: BioIconLink[] }) {
  if (links.length === 0) return null

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 20 }}>
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          aria-label={link.label}
          title={link.label}
          className="qh-bio-icon"
          style={{
            display: "flex",
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "#FFFFFF",
            color: BIO_ACCENT,
            boxShadow: BIO_INSET,
          }}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}
