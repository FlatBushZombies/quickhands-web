import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Briefcase,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  Link2,
  ArrowUpRight,
} from "lucide-react"
import { getPublicBioProfile, type BioCustomLink, type BioTestimonial, type PortfolioProject } from "@/lib/bio-api"

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

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "Q"
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
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

type LinkButton = {
  key: string
  label: string
  href: string
  icon: React.ReactNode
  external?: boolean
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

  const links: LinkButton[] = [
    hasPortfolio
      ? { key: "portfolio", label: "See my work", href: "#portfolio", icon: <Briefcase className="h-4 w-4" /> }
      : null,
    smartLinks.hireMe
      ? { key: "hireMe", label: "Hire me on Quickhands", href: "/", icon: <Sparkles className="h-4 w-4" /> }
      : null,
    smartLinks.call && phone
      ? { key: "call", label: "Call me", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" /> }
      : null,
    smartLinks.whatsapp && whatsappHref
      ? { key: "whatsapp", label: "Message on WhatsApp", href: whatsappHref, icon: <MessageCircle className="h-4 w-4" />, external: true }
      : null,
    smartLinks.email && email
      ? { key: "email", label: "Email me", href: `mailto:${email}`, icon: <Mail className="h-4 w-4" /> }
      : null,
    ...customLinks.map((link: BioCustomLink, index: number) => ({
      key: `custom-${index}`,
      label: link.label,
      href: link.url,
      icon: <Link2 className="h-4 w-4" />,
      external: true,
    })),
  ].filter(Boolean) as LinkButton[]

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Same soft-grid brand treatment used across the site's hero sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#14a8001a_1px,transparent_1px),linear-gradient(to_bottom,#14a8001a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_105%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center px-6 pb-16 pt-14">
        <Link href="/" className="mb-10 flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary">
          <img src="/quickhands.png" alt="" className="h-6 w-6 rounded-md" />
          quickhands
        </Link>

        {/* ── Identity ── */}
        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-28 w-28 rounded-full border-4 border-background object-cover shadow-[0_8px_30px_-8px_rgba(20,168,0,0.45)]"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-primary/70 text-3xl font-bold text-primary-foreground shadow-[0_8px_30px_-8px_rgba(20,168,0,0.45)]">
              {initialsOf(name)}
            </div>
          )}
          {isVerified ? (
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-primary">
              <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
            </div>
          ) : null}
        </div>

        <h1 className="font-heading mt-4 text-center text-2xl font-bold tracking-tight text-foreground">{name}</h1>

        {skills ? (
          <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
            <span className="truncate text-xs font-semibold text-primary">{skills}</span>
          </div>
        ) : null}

        {tagline ? (
          <p className="font-body mt-3 text-center text-[15px] leading-relaxed text-muted-foreground">{tagline}</p>
        ) : null}

        {locationLabel ? (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{locationLabel}</span>
          </div>
        ) : null}

        {/* ── Stat pills ── */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {reviewSummary.reviewCount > 0 ? (
            <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-xs font-bold text-foreground">{reviewSummary.averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviewSummary.reviewCount})</span>
            </div>
          ) : null}
          {completedJobsCount > 0 ? (
            <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-foreground">{completedJobsCount}</span>
              <span className="text-xs text-muted-foreground">jobs done</span>
            </div>
          ) : null}
          {experienceLevel ? (
            <div className="rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border">
              <span className="text-xs font-bold capitalize text-foreground">{experienceLevel}</span>
            </div>
          ) : null}
          {rateLabel ? (
            <div className="rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border">
              <span className="text-xs font-bold text-foreground">{rateLabel}</span>
            </div>
          ) : null}
        </div>

        {/* ── Link stack ── */}
        <div className="mt-8 w-full space-y-3">
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="group flex w-full items-center gap-3 rounded-2xl border border-primary/15 bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {link.icon}
              </span>
              <span className="flex-1 truncate text-[15px] font-semibold text-foreground">{link.label}</span>
              {link.external ? (
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              ) : null}
            </a>
          ))}

          {links.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">This specialist hasn&apos;t added any links yet.</p>
            </div>
          ) : null}
        </div>

        {/* ── Portfolio gallery ── */}
        {hasPortfolio ? (
          <div id="portfolio" className="mt-10 w-full scroll-mt-10">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[1.5px] text-muted-foreground">Recent work</h2>
            <div className="-mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-2">
              {projects.map((project: PortfolioProject) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ) : null}

        {/* ── Testimonials ── */}
        {testimonials.length > 0 ? (
          <div className="mt-10 w-full">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[1.5px] text-muted-foreground">What clients say</h2>
            <div className="space-y-3">
              {testimonials.map((testimonial: BioTestimonial, index: number) => (
                <div key={index} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{testimonial.reviewerName}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-3 w-3 ${starIndex < testimonial.rating ? "fill-warning text-warning" : "text-border"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{testimonial.comment}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {memberSinceLabel ? (
          <p className="mt-10 text-xs text-muted-foreground">On Quickhands since {memberSinceLabel}</p>
        ) : null}

        <p className="mt-3 text-xs text-muted-foreground">
          Powered by{" "}
          <Link href="/" className="font-semibold text-primary hover:underline">
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
    <div className="w-44 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {cover ? (
        <img src={cover} alt={project.title} className="h-28 w-full object-cover" />
      ) : (
        <div className="flex h-28 w-full items-center justify-center bg-primary/5">
          <Briefcase className="h-6 w-6 text-primary/40" />
        </div>
      )}
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-foreground">{project.title}</p>
        {project.category ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{project.category}</p> : null}
      </div>
    </div>
  )

  if (project.projectUrl) {
    return (
      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}
