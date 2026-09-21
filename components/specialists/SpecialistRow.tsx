import Link from "next/link"
import { ArrowRight, Briefcase, MapPin, Star } from "lucide-react"
import type { SpecialistSummary } from "@/lib/specialists-api"

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

const actionBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 font-sans text-sm font-semibold whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/**
 * One specialist in the search results. A row, not a card: the list sits in
 * a single bordered container and hairlines separate the people, so the
 * page scans like a directory instead of a wall of identical tiles.
 */
export function SpecialistRow({ specialist }: { specialist: SpecialistSummary }) {
  const { name, imageUrl, skillList, experienceLevel, hourlyRate, location, tagline, reviewSummary, bioUsername, clerkId } =
    specialist

  const rateLabel = formatHourlyRate(hourlyRate)
  const locationLabel = location?.label || location?.city || null
  const hireHref = `/hire/${bioUsername ?? clerkId}`
  const metaParts = [
    experienceLevel ? <span key="exp" className="capitalize">{experienceLevel}</span> : null,
    locationLabel ? (
      <span key="loc" className="inline-flex items-center gap-1">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        {locationLabel}
      </span>
    ) : null,
    rateLabel ? <span key="rate" className="font-semibold text-foreground">{rateLabel}</span> : null,
  ].filter(Boolean)

  return (
    <li className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-light font-heading text-xl font-bold text-primary"
        >
          {initialsOf(name)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">{name}</h2>
          {reviewSummary.reviewCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
              <span className="font-semibold text-foreground">{reviewSummary.averageRating.toFixed(1)}</span>
              <span>
                ({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </span>
          ) : null}
        </div>

        {metaParts.length > 0 ? (
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {metaParts.map((part, index) => (
              <span key={index} className="inline-flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">·</span> : null}
                {part}
              </span>
            ))}
          </p>
        ) : null}

        {tagline ? <p className="mt-3 max-w-[60ch] font-body text-base leading-relaxed text-foreground">{tagline}</p> : null}

        {skillList.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${name}'s specialties`}>
            {skillList.map((skill) => (
              <li key={skill} className="rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-foreground">
                {skill}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:w-44">
        {bioUsername ? (
          <Link
            href={`/${bioUsername}`}
            className={`${actionBase} border border-border bg-card text-foreground hover:bg-secondary`}
          >
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            View portfolio
          </Link>
        ) : null}
        <Link
          href={hireHref}
          className={`${actionBase} group bg-primary text-primary-foreground hover:bg-primary-hover`}
        >
          Hire Now
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </li>
  )
}
