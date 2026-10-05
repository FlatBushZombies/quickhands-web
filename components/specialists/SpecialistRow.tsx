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

/**
 * One specialist in the search results. A row, not a card: the list sits in
 * a single bordered container and hairlines separate the people, so the
 * page scans like a directory instead of a wall of identical tiles.
 * Styling lives in SPECIALISTS_CSS (components/specialists/specialists-design.ts).
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
      <span key="loc" className="qh-sp-meta-item">
        <MapPin size={14} strokeWidth={1.5} aria-hidden="true" />
        {locationLabel}
      </span>
    ) : null,
    rateLabel ? <span key="rate" className="qh-sp-meta-rate">{rateLabel}</span> : null,
  ].filter(Boolean)

  return (
    <li className="qh-sp-row">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="qh-sp-avatar" />
      ) : (
        <div aria-hidden="true" className="qh-sp-initials">
          {initialsOf(name)}
        </div>
      )}

      <div className="qh-sp-body">
        <div className="qh-sp-head">
          <h2 className="qh-sp-name">{name}</h2>
          {reviewSummary.reviewCount > 0 ? (
            <span className="qh-sp-rating">
              <Star size={14} strokeWidth={1.5} className="fill-warning text-warning" aria-hidden="true" />
              <strong>{reviewSummary.averageRating.toFixed(1)}</strong>
              <span>
                ({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </span>
          ) : null}
        </div>

        {metaParts.length > 0 ? (
          <p className="qh-sp-meta">
            {metaParts.map((part, index) => (
              <span key={index} className="qh-sp-meta-item">
                {index > 0 ? <span className="qh-sp-meta-dot" aria-hidden="true">·</span> : null}
                {part}
              </span>
            ))}
          </p>
        ) : null}

        {tagline ? <p className="qh-sp-tagline">{tagline}</p> : null}

        {skillList.length > 0 ? (
          <ul className="qh-sp-skills" aria-label={`${name}'s specialties`}>
            {skillList.map((skill) => (
              <li key={skill} className="qh-sp-skill">
                {skill}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="qh-sp-actions">
        {bioUsername ? (
          <Link href={`/${bioUsername}`} className="qh-sp-btn qh-sp-btn-ghost">
            <Briefcase className="qh-sp-btn-icon" aria-hidden="true" />
            View portfolio
          </Link>
        ) : null}
        <Link href={hireHref} className="qh-sp-btn qh-sp-btn-primary qh-sp-hire">
          Hire Now
          <ArrowRight className="qh-sp-btn-icon qh-sp-arrow" aria-hidden="true" />
        </Link>
      </div>
    </li>
  )
}
