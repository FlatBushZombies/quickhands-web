/* Shared pieces of the feed language used by the dashboard panels and the
   chat: a "Today" / "Earlier" divider, relative timestamps and a skeleton
   that matches the row anatomy (squircle avatar + two text lines). */

export function isToday(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

/** Bucket used by the dashboard feeds (data arrives newest-first). */
export function dayBucket(iso: string): "Today" | "Earlier" {
  return isToday(iso) ? "Today" : "Earlier"
}

export function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

export function DateDivider({ label }: { label: string }) {
  return (
    <li role="presentation" className="flex items-center gap-3 py-3">
      <span className="h-px flex-1 bg-border" />
      <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </li>
  )
}

export function FeedSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-5" aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-[14px] bg-secondary motion-reduce:animate-none" />
          <div className="flex-1 space-y-2.5 pt-1">
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-secondary motion-reduce:animate-none" />
            <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-secondary motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  )
}
