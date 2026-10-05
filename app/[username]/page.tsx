import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { CSSProperties } from "react"
import {
  Briefcase,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Link2,
  ArrowRight,
} from "lucide-react"
import { getPublicBioProfile, type BioCustomLink, type BioTestimonial, type PortfolioProject } from "@/lib/bio-api"
import { BioAvatar } from "@/components/bio/BioAvatar"
import { BioIconRow, type BioIconLink } from "@/components/bio/BioIconRow"
import { BioLinkCard, BioHeadingDivider } from "@/components/bio/BioLinkCard"
import { BioShareButton } from "@/components/bio/BioShareButton"
import {
  BIO_ACCENT,
  BIO_ACCENT_TINT,
  BIO_INSET,
  BIO_MICRO,
  BIO_ROOT_CLASS,
  BIO_ROOT_STYLE,
  BIO_SERIF_EM,
  BioNameText,
  BioStyles,
} from "@/components/bio/BioDesign"

export const revalidate = 60

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getPublicBioProfile(username)

  if (!profile) {
    return { title: "Profile not found | Quickhands" }
  }

  const description = profile.tagline || `${profile.name} on Quickhands — ${profile.skills || "skilled specialist"}.`

  return {
    title: `${profile.name} | Quickhands`,
    description,
    openGraph: {
      title: `${profile.name} | Quickhands`,
      description,
      images: profile.imageUrl ? [profile.imageUrl] : undefined,
    },
  }
}

function formatHourlyRate(rate: number | string | null) {
  const value = typeof rate === "string" ? Number(rate) : rate
  if (!value || Number.isNaN(value)) return null
  return `$${value % 1 === 0 ? value : value.toFixed(2)}/hr`
}

function formatMemberSince(dateString: string) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

type StackEntry =
  | { kind: "link"; key: string; label: string; href: string; icon: React.ReactNode; external?: boolean }
  | { kind: "heading"; key: string; label: string }

/** Mono uppercase section eyebrow (h2), used for "Recent work" and "What clients say". */
const SECTION_HEADING: CSSProperties = {
  ...BIO_MICRO,
  margin: "0 0 12px",
  color: "var(--fg-2)",
  fontWeight: 400,
}

/** White inset-ringed card used for stat chips, testimonials and project tiles. */
const SURFACE: CSSProperties = {
  background: "#FFFFFF",
  boxShadow: `${BIO_INSET},0 1px 2px rgba(10,10,11,.04)`,
}

export default async function BioPage({ params }: PageProps) {
  const { username } = await params
  const profile = await getPublicBioProfile(username)

  if (!profile) {
    notFound()
  }

  const {
    name,
    imageUrl,
    skills,
    experienceLevel,
    hourlyRate,
    location,
    tagline,
    phone,
    email,
    smartLinks,
    customLinks,
    reviewSummary,
    testimonials,
    completedJobsCount,
    projects,
    memberSince,
  } = profile

  const hasPortfolio = smartLinks.portfolio && projects.length > 0
  const isVerified = reviewSummary.reviewCount > 0 || completedJobsCount > 0
  const rateLabel = formatHourlyRate(hourlyRate)
  const memberSinceLabel = formatMemberSince(memberSince)
  const locationLabel = location?.label || location?.city || null
  const whatsappHref = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null
  const firstName = name.trim().split(/\s+/)[0] || "this specialist"

  // Quick-contact actions render as a compact icon-only row (reference's
  // social row); portfolio + custom entries render as the full-width card
  // stack below, with "heading" custom entries as plain text dividers.
  const contactLinks: BioIconLink[] = [
    smartLinks.call && phone
      ? { key: "call", label: "Call me", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" /> }
      : null,
    smartLinks.whatsapp && whatsappHref
      ? { key: "whatsapp", label: "Message on WhatsApp", href: whatsappHref, icon: <MessageCircle className="h-4 w-4" />, external: true }
      : null,
    smartLinks.email && email
      ? { key: "email", label: "Email me", href: `mailto:${email}`, icon: <Mail className="h-4 w-4" /> }
      : null,
  ].filter(Boolean) as BioIconLink[]

  const stackEntries: StackEntry[] = [
    hasPortfolio
      ? { kind: "link", key: "portfolio", label: "See my work", href: "#portfolio", icon: <Briefcase className="h-4 w-4" /> }
      : null,
    ...customLinks.map((link: BioCustomLink, index: number) => {
      if (link.type === "heading") {
        return { kind: "heading" as const, key: `heading-${index}`, label: link.label }
      }
      return {
        kind: "link" as const,
        key: `custom-${index}`,
        label: link.label,
        href: link.url || "#",
        icon: <Link2 className="h-4 w-4" />,
        external: true,
      }
    }),
  ].filter(Boolean) as StackEntry[]

  const hasNoLinks = stackEntries.length === 0 && contactLinks.length === 0 && !smartLinks.hireMe

  return (
    <main
      className={BIO_ROOT_CLASS}
      style={{ ...BIO_ROOT_STYLE, minHeight: "100vh", overflowX: "clip" }}
    >
      <BioStyles />

      <div
        style={{
          position: "relative",
          boxSizing: "border-box",
          display: "flex",
          minHeight: "100vh",
          maxWidth: 440,
          margin: "0 auto",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 16px 64px",
        }}
      >
        <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "var(--fg-1)",
              textDecoration: "none",
            }}
          >
            <img src="/quickhands.png" alt="" style={{ width: 24, height: 24, borderRadius: 6 }} />
            quickhands
          </Link>
          <BioShareButton name={name} />
        </div>

        {/* ── Identity ── */}
        <BioAvatar name={name} imageUrl={imageUrl} isVerified={isVerified} />

        <h1
          style={{
            margin: "20px 0 0",
            textAlign: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(34px, 8.6vw, 42px)",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "var(--ls-heading)",
            color: "var(--fg-1)",
            textWrap: "balance",
            overflowWrap: "anywhere",
          }}
        >
          <BioNameText name={name} />
        </h1>

        {skills ? (
          <div
            style={{
              ...BIO_MICRO,
              marginTop: 12,
              display: "inline-flex",
              maxWidth: "100%",
              alignItems: "center",
              borderRadius: 999,
              background: BIO_ACCENT_TINT,
              boxShadow: "inset 0 0 0 1px rgba(27,58,158,.2)",
              padding: "6px 12px",
              color: BIO_ACCENT,
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{skills}</span>
          </div>
        ) : null}

        {tagline ? (
          <p
            style={{
              margin: "14px 0 0",
              maxWidth: 360,
              textAlign: "center",
              fontSize: 15,
              lineHeight: 1.55,
              color: "var(--fg-2)",
              textWrap: "pretty",
            }}
          >
            {tagline}
          </p>
        ) : null}

        {locationLabel ? (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--fg-3)" }}>
            <MapPin style={{ width: 14, height: 14 }} />
            <span>{locationLabel}</span>
          </div>
        ) : null}

        {/* ── Quick contact (icon-only row) ── */}
        <BioIconRow links={contactLinks} />

        {/* ── Stat pills ── */}
        <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {reviewSummary.reviewCount > 0 ? (
            <div style={{ ...SURFACE, display: "flex", alignItems: "center", gap: 6, borderRadius: 999, padding: "7px 12px" }}>
              <Star style={{ width: 14, height: 14, fill: "var(--warning)", color: "var(--warning)" }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-1)" }}>{reviewSummary.averageRating.toFixed(1)}</span>
              <span style={{ fontSize: 13, color: "var(--fg-3)" }}>({reviewSummary.reviewCount})</span>
            </div>
          ) : null}
          {completedJobsCount > 0 ? (
            <div style={{ ...SURFACE, display: "flex", alignItems: "center", gap: 6, borderRadius: 999, padding: "7px 12px" }}>
              <CheckCircle2 style={{ width: 14, height: 14, color: BIO_ACCENT }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-1)" }}>{completedJobsCount}</span>
              <span style={{ fontSize: 13, color: "var(--fg-3)" }}>jobs done</span>
            </div>
          ) : null}
          {experienceLevel ? (
            <div style={{ ...SURFACE, borderRadius: 999, padding: "7px 12px", fontSize: 13, fontWeight: 500, textTransform: "capitalize", color: "var(--fg-1)" }}>
              {experienceLevel}
            </div>
          ) : null}
          {rateLabel ? (
            <div style={{ ...SURFACE, borderRadius: 999, padding: "7px 12px", fontSize: 13, fontWeight: 500, color: "var(--fg-1)" }}>
              {rateLabel}
            </div>
          ) : null}
        </div>

        {/* ── Link stack ── */}
        <div style={{ marginTop: 32, width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          {stackEntries.map((entry) =>
            entry.kind === "heading" ? (
              <BioHeadingDivider key={entry.key} label={entry.label} />
            ) : (
              <BioLinkCard key={entry.key} href={entry.href} label={entry.label} icon={entry.icon} external={entry.external} />
            )
          )}

          {hasNoLinks ? (
            <div
              style={{
                borderRadius: 16,
                border: "1px dashed rgba(10,10,11,.2)",
                background: "rgba(255,255,255,.6)",
                padding: "28px 20px",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontSize: 14, color: "var(--fg-3)" }}>This specialist hasn&apos;t added any links yet.</p>
            </div>
          ) : null}

          {/* The last CTA of the link stack: opens a conversation (sign-in
              first if needed — see /hire/[specialist]). Respects the
              specialist's own "Hire me" toggle in Settings. */}
          {smartLinks.hireMe ? <HireNowButton username={username} firstName={firstName} /> : null}
        </div>

        {/* ── Portfolio gallery ── */}
        {hasPortfolio ? (
          <div id="portfolio" style={{ marginTop: 40, width: "100%", scrollMarginTop: 40 }}>
            <h2 style={SECTION_HEADING}>Recent work</h2>
            <div
              style={{
                display: "flex",
                gap: 12,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                margin: "0 -16px",
                padding: "0 16px 8px",
              }}
            >
              {projects.map((project: PortfolioProject) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ) : null}

        {/* ── Testimonials ── */}
        {testimonials.length > 0 ? (
          <div style={{ marginTop: 40, width: "100%" }}>
            <h2 style={SECTION_HEADING}>What clients say</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {testimonials.map((testimonial: BioTestimonial, index: number) => (
                <div key={index} style={{ ...SURFACE, borderRadius: 16, padding: 16 }}>
                  <div style={{ marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--fg-1)" }}>{testimonial.reviewerName}</p>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <Star
                          key={starIndex}
                          style={{
                            width: 12,
                            height: 12,
                            fill: starIndex < testimonial.rating ? "var(--warning)" : "transparent",
                            color: starIndex < testimonial.rating ? "var(--warning)" : "rgba(10,10,11,.16)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)" }}>{testimonial.comment}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {smartLinks.hireMe ? (
          <div
            style={{
              ...SURFACE,
              marginTop: 48,
              width: "100%",
              boxSizing: "border-box",
              borderRadius: 20,
              padding: "28px 24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "var(--ls-heading)",
                color: "var(--fg-1)",
                textWrap: "balance",
              }}
            >
              Ready to work with <em style={BIO_SERIF_EM}>{firstName}</em>?
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.55, color: "var(--fg-2)" }}>
              Send {firstName} a message on QuickHands to talk through the job.
            </p>
            <div style={{ marginTop: 20 }}>
              <HireNowButton username={username} firstName={firstName} />
            </div>
          </div>
        ) : null}

        {memberSinceLabel ? (
          <p style={{ ...BIO_MICRO, margin: "40px 0 0", color: "var(--fg-3)" }}>On Quickhands since {memberSinceLabel}</p>
        ) : null}

        <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--fg-3)" }}>
          Powered by{" "}
          <Link href="/" className="qh-bio-link" style={{ fontWeight: 500, color: BIO_ACCENT }}>
            Quickhands
          </Link>
        </p>
      </div>
    </main>
  )
}

function ProjectCard({ project }: { project: PortfolioProject }) {
  const cover = project.media[0]?.url
  const content = (
    <div
      style={{
        ...SURFACE,
        width: 176,
        flexShrink: 0,
        scrollSnapAlign: "start",
        overflow: "hidden",
        borderRadius: 16,
      }}
    >
      {cover ? (
        <img src={cover} alt={project.title} style={{ display: "block", width: "100%", height: 112, objectFit: "cover" }} />
      ) : (
        <div style={{ display: "flex", width: "100%", height: 112, alignItems: "center", justifyContent: "center", background: BIO_ACCENT_TINT }}>
          <Briefcase style={{ width: 24, height: 24, color: "rgba(27,58,158,.4)" }} />
        </div>
      )}
      <div style={{ padding: 12 }}>
        <p
          style={{
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--fg-1)",
          }}
        >
          {project.title}
        </p>
        {project.category ? (
          <p
            style={{
              ...BIO_MICRO,
              margin: "6px 0 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "var(--fg-3)",
            }}
          >
            {project.category}
          </p>
        ) : null}
      </div>
    </div>
  )

  if (project.projectUrl) {
    return (
      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
        {content}
      </a>
    )
  }

  return content
}

function HireNowButton({ username, firstName }: { username: string; firstName: string }) {
  return (
    <Link
      href={`/hire/${encodeURIComponent(username)}`}
      className="qh-bio-hire"
      style={{
        display: "flex",
        width: "100%",
        boxSizing: "border-box",
        alignItems: "center",
        gap: 12,
        borderRadius: 999,
        background: BIO_ACCENT,
        padding: "10px 20px 10px 10px",
        color: "#FFFFFF",
        textDecoration: "none",
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
          background: "rgba(255,255,255,.2)",
        }}
      >
        <MessageCircle style={{ width: 16, height: 16 }} aria-hidden="true" />
      </span>
      <span style={{ flex: 1, textAlign: "left" }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 500, lineHeight: 1.25, letterSpacing: "-0.01em" }}>Hire Now</span>
        <span style={{ display: "block", fontSize: 12.5, lineHeight: 1.35, color: "rgba(255,255,255,.82)" }}>
          Message {firstName} on QuickHands
        </span>
      </span>
      <ArrowRight style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true" />
    </Link>
  )
}
