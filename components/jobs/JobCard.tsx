import Link from "next/link"
import { ArrowRight, MapPin, Star, Users, Clock } from "lucide-react"
import type { Job } from "@/lib/jobs-api"

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays}d ago`
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-heading text-lg font-bold text-foreground group-hover:text-primary">
            {job.serviceType}
          </h3>
          {job.location?.label || job.location?.city ? (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{job.location.label || job.location.city}</span>
              {job.proximity?.inYourArea ? (
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Nearby
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-heading text-lg font-bold text-primary">${job.maxPrice}</p>
          <p className="text-[11px] text-muted-foreground">budget</p>
        </div>
      </div>

      {job.additionalInfo ? (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{job.additionalInfo}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {timeAgo(job.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {job.applicantCount === 0 ? "Be the first to apply" : `${job.applicantCount} applied`}
        </span>
        {job.clientReviewSummary.reviewCount > 0 ? (
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {job.clientReviewSummary.averageRating.toFixed(1)} ({job.clientReviewSummary.reviewCount})
          </span>
        ) : null}
      </div>

      {/* Explicit CTA rather than relying on the whole card being a silent
          link — makes "this is something you apply to" unambiguous. */}
      <div className="mt-4 flex items-center justify-end gap-1 text-sm font-semibold text-primary">
        Apply now
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
