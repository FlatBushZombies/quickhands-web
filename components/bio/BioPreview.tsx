"use client"

import { Briefcase, Mail, MapPin, MessageCircle, Phone, Star, Link2 } from "lucide-react"
import type { BioCustomLink, BioSmartLinks } from "@/lib/bio-api"
import { BioAvatar } from "@/components/bio/BioAvatar"
import { BioIconRow, type BioIconLink } from "@/components/bio/BioIconRow"
import { BioLinkCard, BioHeadingDivider } from "@/components/bio/BioLinkCard"

type StackEntry =
  | { kind: "link"; key: string; label: string; href: string; icon: React.ReactNode; external?: boolean }
  | { kind: "heading"; key: string; label: string }

/**
 * Live preview of the public bio page, inside a small phone frame. Reflects
 * only the state that's actually editable on this screen (tagline, phone,
 * smartLinks, customLinks) — name/avatar/skills/rating come from the
 * specialist's real profile and never change here, so they're read once
 * from settings.profile and left static. Shares the same presentational
 * pieces (BioAvatar / BioIconRow / BioLinkCard) as the real public page so
 * the two can't visually drift apart.
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

  return (
    <div className="mx-auto w-full max-w-[300px]">
      <div className="relative overflow-hidden rounded-[2rem] border-4 border-foreground/10 bg-background shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/9 via-background to-primary/5" />
        <div className="relative max-h-[560px] overflow-y-auto px-5 pb-8 pt-6">
          <div className="flex flex-col items-center">
            <BioAvatar name={name || "Q"} imageUrl={imageUrl} isVerified={reviewCount > 0} />

            <p className="font-heading mt-3 text-center text-lg font-bold tracking-tight text-foreground">
              {name || "Your name"}
            </p>

            {skills ? (
              <div className="mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5">
                <span className="truncate text-[11px] font-semibold text-primary">{skills}</span>
              </div>
            ) : null}

            {tagline ? (
              <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">{tagline}</p>
            ) : null}

            <BioIconRow links={contactLinks} />

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              {reviewCount > 0 ? (
                <div className="flex items-center gap-1 rounded-full bg-card px-2 py-1 shadow-sm ring-1 ring-border">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <span className="text-[11px] font-bold text-foreground">{averageRating.toFixed(1)}</span>
                </div>
              ) : null}
              {experienceLevel ? (
                <div className="rounded-full bg-card px-2 py-1 shadow-sm ring-1 ring-border">
                  <span className="text-[11px] font-bold capitalize text-foreground">{experienceLevel}</span>
                </div>
              ) : null}
              {rateLabel ? (
                <div className="rounded-full bg-card px-2 py-1 shadow-sm ring-1 ring-border">
                  <span className="text-[11px] font-bold text-foreground">{rateLabel}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-5 w-full space-y-2 [&_a]:pointer-events-none [&_a]:cursor-default">
              {stackEntries.length === 0 ? (
                <p className="pt-4 text-center text-xs text-muted-foreground">Your links will show up here.</p>
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
                <div className="flex w-full items-center gap-2.5 rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-bold">Hire Now</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">Live preview — updates as you type</p>
    </div>
  )
}
