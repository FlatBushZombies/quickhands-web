"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { MapPin, Sparkles, Users } from "lucide-react"
import { Avatar } from "@/components/app-shell/Avatar"
import { FeedSkeleton, timeAgo } from "@/components/app-shell/feed"
import { getRecommendedJobsForMe, type RecommendedJob } from "@/lib/jobs-api"

/**
 * Specialist-facing "Jobs for you" discovery list — GET
 * /api/jobs/recommended-for-me. Deliberately no polling (unlike
 * SpecialistApplicationsPanel): this is a curated discovery feed, not
 * something that needs to track live status changes, so a single fetch on
 * mount is enough.
 */
export function JobsForYouPanel() {
  const { getToken } = useAuth()
  const [jobs, setJobs] = useState<RecommendedJob[]>([])
  const [matchedBySkill, setMatchedBySkill] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    const { jobs: data, matchedBySkill: matched } = await getRecommendedJobsForMe(token, 10)
    setJobs(data)
    setMatchedBySkill(matched)
    setLoading(false)
  }, [getToken])

  useEffect(() => {
    refresh()
  }, [refresh])

  if (loading) {
    return <FeedSkeleton />
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">No matching jobs yet — add skills to your profile for better matches.</p>
        <Link href="/jobs" className="mt-3 inline-block text-sm font-semibold text-specialist hover:underline">
          Browse all jobs
        </Link>
      </div>
    )
  }

  return (
    <div>
      {matchedBySkill ? (
        <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-specialist" />
          Matched to your skills
        </p>
      ) : null}
      <ul className="divide-y divide-border/60 overflow-hidden rounded-[16px] border border-border">
        {jobs.map((job) => {
          const locationLabel = job.location?.label || job.location?.city || null
          const metaParts = [
            locationLabel ? (
              <span key="loc" className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {locationLabel}
              </span>
            ) : null,
            <span key="apps" className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" aria-hidden="true" />
              {job.applicantCount === 0 ? "Be the first to apply" : `${job.applicantCount} applied`}
            </span>,
            <span key="time">{timeAgo(job.createdAt)}</span>,
          ].filter(Boolean)

          return (
            <li key={job.id}>
              <Link href={`/jobs/${job.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/60">
                <Avatar name={job.userName} imageUrl={job.userAvatar} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <p className="truncate text-[15px] font-medium text-foreground">{job.serviceType}</p>
                    {job.skillMatch ? (
                      <span className="shrink-0 rounded-full bg-specialist/10 px-2 py-0.5 text-[10px] font-semibold text-specialist">
                        Skill match
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    {metaParts.map((part, index) => (
                      <span key={index} className="inline-flex items-center gap-2">
                        {index > 0 ? <span aria-hidden="true">·</span> : null}
                        {part}
                      </span>
                    ))}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-specialist">${job.maxPrice}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
