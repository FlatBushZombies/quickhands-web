"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { FeedSkeleton } from "@/components/app-shell/feed"
import { searchSpecialists, type SpecialistSummary } from "@/lib/specialists-api"

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
 * Client-facing "Specialists for you" discovery list — the same public
 * search endpoint as /specialists (GET /api/user/search/specialists), just
 * called with an empty query for a general curated/newest listing. No
 * polling: a curated discovery feed doesn't need to track live changes the
 * way the applications panels' 10s poll does.
 */
export function SpecialistsForYouPanel() {
  const [specialists, setSpecialists] = useState<SpecialistSummary[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { specialists: data } = await searchSpecialists("", 10)
    setSpecialists(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  if (loading) {
    return <FeedSkeleton />
  }

  if (specialists.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">No specialists to show right now.</p>
        <Link href="/specialists" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Search specialists
        </Link>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border/60 overflow-hidden rounded-[16px] border border-border">
      {specialists.map((specialist) => {
        const { clerkId, name, imageUrl, skillList, hourlyRate, location, tagline, reviewSummary, bioUsername } = specialist
        const rateLabel = formatHourlyRate(hourlyRate)
        const locationLabel = location?.label || location?.city || null
        const metaLabel = tagline || (skillList.length > 0 ? skillList.slice(0, 2).join(", ") : null)
        const metaParts = [
          locationLabel ? (
            <span key="loc" className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {locationLabel}
            </span>
          ) : null,
          metaLabel ? <span key="meta" className="truncate">{metaLabel}</span> : null,
        ].filter(Boolean)

        return (
          <li key={clerkId}>
            <Link href={`/hire/${bioUsername ?? clerkId}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/60">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light font-heading text-sm font-bold text-primary"
                >
                  {initialsOf(name)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <p className="truncate text-[15px] font-medium text-foreground">{name}</p>
                  {reviewSummary.reviewCount > 0 ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-warning text-warning" aria-hidden="true" />
                      {reviewSummary.averageRating.toFixed(1)}
                    </span>
                  ) : null}
                </div>
                {metaParts.length > 0 ? (
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    {metaParts.map((part, index) => (
                      <span key={index} className="inline-flex items-center gap-2">
                        {index > 0 ? <span aria-hidden="true">·</span> : null}
                        {part}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
              {rateLabel ? <p className="shrink-0 text-sm font-semibold text-primary">{rateLabel}</p> : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
