"use client"

import type { CSSProperties } from "react"
import { Briefcase, Mail, MessageCircle, Phone, Star, Link2 } from "lucide-react"
import type { BioCustomLink, BioSmartLinks } from "@/lib/bio-api"
import { BioAvatar } from "@/components/bio/BioAvatar"
import { BioIconRow, type BioIconLink } from "@/components/bio/BioIconRow"
import { BioLinkCard, BioHeadingDivider } from "@/components/bio/BioLinkCard"
import {
  BIO_ACCENT,
  BIO_ACCENT_TINT,
  BIO_INSET,
  BIO_MICRO,
  BIO_ROOT_CLASS,
  BIO_ROOT_STYLE,
  BioNameText,
  BioStyles,
} from "@/components/bio/BioDesign"

type StackEntry =
  | { kind: "link"; key: string; label: string; href: string; icon: React.ReactNode; external?: boolean }
  | { kind: "heading"; key: string; label: string }

/**
 * Live preview of the public bio page, inside a small phone frame. Reflects
 * only the state that's actually editable on this screen (tagline, phone,
 * smartLinks, customLinks) — name/avatar/skills/rating come from the
 * specialist's real profile and never change here, so they're read once
 * from settings.profile and left static. Shares the same presentational
 * pieces (BioAvatar / BioIconRow / BioLinkCard) and design tokens as the real
 * public page so the two can't visually drift apart.
 */
export function BioPreview({
  name,
  imageUrl,
  skills,
  experienceLevel,
  hourlyRate,
  reviewCount,
  averageRating,
  tagline,
  phone,
  smartLinks,
  customLinks,
}: {
  name: string
  imageUrl: string | null
  skills: string | null
  experienceLevel: string | null
  hourlyRate: number | null
  reviewCount: number
  averageRating: number
  tagline: string
  phone: string
  smartLinks: BioSmartLinks
  customLinks: BioCustomLink[]
}) {
  const whatsappHref = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null

  const contactLinks: BioIconLink[] = [
    smartLinks.call && phone ? { key: "call", label: "Call me", href: "#", icon: <Phone className="h-4 w-4" /> } : null,
    smartLinks.whatsapp && whatsappHref
      ? { key: "whatsapp", label: "Message on WhatsApp", href: "#", icon: <MessageCircle className="h-4 w-4" /> }
      : null,
    smartLinks.email ? { key: "email", label: "Email me", href: "#", icon: <Mail className="h-4 w-4" /> } : null,
  ].filter(Boolean) as BioIconLink[]

  const stackEntries: StackEntry[] = [
    smartLinks.portfolio
      ? { kind: "link", key: "portfolio", label: "See my work", href: "#", icon: <Briefcase className="h-4 w-4" /> }
      : null,
    ...customLinks
      .filter((link) => link.label.trim())
      .map((link, index) =>
        link.type === "heading"
          ? { kind: "heading" as const, key: `h-${index}`, label: link.label }
          : { kind: "link" as const, key: `l-${index}`, label: link.label, href: "#", icon: <Link2 className="h-4 w-4" /> }
      ),
  ].filter(Boolean) as StackEntry[]

  const rateLabel = hourlyRate ? `$${hourlyRate % 1 === 0 ? hourlyRate : hourlyRate.toFixed(2)}/hr` : null

  const chip: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    background: "#FFFFFF",
    boxShadow: BIO_INSET,
    padding: "4px 9px",
    fontFamily: "var(--font-sans)",
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1,
    color: "var(--fg-1)",
  }

  return (
    <div className={BIO_ROOT_CLASS} style={{ ...BIO_ROOT_STYLE, width: "100%", maxWidth: 300, margin: "0 auto" }}>
      <BioStyles />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 28,
          background: "var(--paper)",
          boxShadow: "0 0 0 4px var(--ink-100),0 1px 2px rgba(10,10,11,.04),0 12px 32px -12px rgba(10,10,11,.14)",
        }}
      >
        <div style={{ position: "relative", maxHeight: 560, overflowY: "auto", padding: "24px 18px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <BioAvatar name={name || "Q"} imageUrl={imageUrl} isVerified={reviewCount > 0} size={96} />

            <p
              style={{
                margin: "14px 0 0",
                textAlign: "center",
                fontFamily: "var(--font-sans)",
                fontSize: 20,
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "var(--ls-heading)",
                color: "var(--fg-1)",
              }}
            >
              <BioNameText name={name || "Your name"} />
            </p>

            {skills ? (
              <div
                style={{
                  ...BIO_MICRO,
                  marginTop: 8,
                  display: "inline-flex",
                  maxWidth: "100%",
                  alignItems: "center",
                  borderRadius: 999,
                  background: BIO_ACCENT_TINT,
                  boxShadow: "inset 0 0 0 1px rgba(27,58,158,.2)",
                  padding: "4px 10px",
                  color: BIO_ACCENT,
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{skills}</span>
              </div>
            ) : null}

            {tagline ? (
              <p
                style={{
                  margin: "10px 0 0",
                  textAlign: "center",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "var(--fg-2)",
                  textWrap: "pretty",
                } as CSSProperties}
              >
                {tagline}
              </p>
            ) : null}

            <BioIconRow links={contactLinks} />

            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {reviewCount > 0 ? (
                <div style={chip}>
                  <Star style={{ width: 12, height: 12, fill: "var(--warning)", color: "var(--warning)" }} />
                  <span>{averageRating.toFixed(1)}</span>
                </div>
              ) : null}
              {experienceLevel ? (
                <div style={{ ...chip, textTransform: "capitalize" }}>
                  <span>{experienceLevel}</span>
                </div>
              ) : null}
              {rateLabel ? (
                <div style={chip}>
                  <span>{rateLabel}</span>
                </div>
              ) : null}
            </div>

            <div className="qh-bio-static" style={{ marginTop: 20, width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              {stackEntries.length === 0 ? (
                <p style={{ margin: 0, paddingTop: 16, textAlign: "center", fontSize: 12, color: "var(--fg-3)" }}>
                  Your links will show up here.
                </p>
              ) : (
                stackEntries.map((entry) =>
                  entry.kind === "heading" ? (
                    <BioHeadingDivider key={entry.key} label={entry.label} />
                  ) : (
                    <BioLinkCard key={entry.key} href={entry.href} label={entry.label} icon={entry.icon} />
                  )
                )
              )}
              {smartLinks.hireMe ? (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 999,
                    background: BIO_ACCENT,
                    padding: "8px 16px 8px 8px",
                    boxSizing: "border-box",
                    color: "#FFFFFF",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      width: 28,
                      height: 28,
                      flexShrink: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,.2)",
                    }}
                  >
                    <MessageCircle style={{ width: 14, height: 14 }} />
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500 }}>Hire Now</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 12, color: "var(--fg-3)" }}>
        Live preview — updates as you type
      </p>
    </div>
  )
}
