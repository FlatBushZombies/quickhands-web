import type { ReactNode } from "react"

export interface BioIconLink {
  key: string
  label: string
  href: string
  icon: ReactNode
  external?: boolean
}

/**
 * Compact row of icon-only circular buttons — the reference's "quick
 * contact" row (Instagram/LinkedIn/Email/WhatsApp as outline glyphs on
 * plain circles). QuickHands' equivalent is Call / WhatsApp / Email.
 */
export function BioIconRow({ links }: { links: BioIconLink[] }) {
  if (links.length === 0) return null

  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          aria-label={link.label}
          title={link.label}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-card text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}
