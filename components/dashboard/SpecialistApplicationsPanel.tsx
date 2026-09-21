"use client"

import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/app-shell/Avatar"
import { DateDivider, FeedSkeleton, dayBucket, timeAgo } from "@/components/app-shell/feed"
import { ReviewForm } from "@/components/dashboard/ReviewForm"
import { getApplicationReviews, getMyApplications, type Application, type ReviewMatrix } from "@/lib/applications-api"

const STATUS_STYLES: Record<Application["status"], string> = {
  pending: "bg-secondary text-secondary-foreground",
  accepted: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  completed: "bg-primary text-primary-foreground",
}

export function SpecialistApplicationsPanel() {
  const { getToken } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [openReviewId, setOpenReviewId] = useState<number | null>(null)
  const [reviewMatrices, setReviewMatrices] = useState<Record<number, ReviewMatrix>>({})
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    const data = await getMyApplications(token)
    setApplications(data)
    setLoading(false)
  }, [getToken])

  useEffect(() => {
    refresh()
    // Only poll while this tab is actually visible — see the matching
    // comment in ClientApplicationsPanel.tsx.
    const tick = () => {
      if (!document.hidden) refresh()
    }
    pollRef.current = setInterval(tick, 10000)
    document.addEventListener("visibilitychange", tick)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      document.removeEventListener("visibilitychange", tick)
    }
  }, [refresh])

  const toggleReview = async (application: Application) => {
    if (openReviewId === application.id) {
      setOpenReviewId(null)
      return
    }
    setOpenReviewId(application.id)
    if (!reviewMatrices[application.id]) {
      const token = await getToken()
      if (!token) return
      const matrix = await getApplicationReviews(application.id, token)
      if (matrix) setReviewMatrices((current) => ({ ...current, [application.id]: matrix }))
    }
  }

  if (loading) {
    return <FeedSkeleton />
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">You haven&apos;t applied to any jobs yet.</p>
        <Link href="/jobs" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Browse jobs
        </Link>
      </div>
    )
  }

  return (
    <ul>
      {applications.map((application, index) => {
        const canReview = application.status === "accepted" || application.status === "completed"
        const matrix = reviewMatrices[application.id]
        const title = application.job?.serviceType || "Job"
        // Data arrives newest-first: label each run of same-day applications.
        const bucket = dayBucket(application.createdAt)
        const showDivider = index === 0 || bucket !== dayBucket(applications[index - 1].createdAt)

        return (
          <Fragment key={application.id}>
            {showDivider ? <DateDivider label={bucket} /> : null}
            <li className="flex gap-3 border-b border-border/60 py-4 last:border-b-0">
              <Avatar name={application.job?.clientName || title} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-heading text-[17px] font-medium text-foreground">{title}</p>
                  <span className="text-xs text-muted-foreground">{timeAgo(application.createdAt)}</span>
                  <span className={`ml-auto shrink-0 rounded-full border border-border/60 px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[application.status]}`}>
                    {application.status}
                  </span>
                </div>
                {application.job?.clientName ? (
                  <p className="mt-0.5 text-[15px] text-muted-foreground">Client: {application.job.clientName}</p>
                ) : null}
                {application.quotation ? <p className="mt-1 text-[15px] text-muted-foreground">Your quote: {application.quotation}</p> : null}

                {application.conversationId || canReview ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {application.conversationId ? (
                      <Link href={`/messages/${application.conversationId}`}>
                        <Button size="sm" variant="outline" className="rounded-full">
                          <MessageCircle className="h-3.5 w-3.5" />
                          Message
                        </Button>
                      </Link>
                    ) : null}
                    {canReview ? (
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => toggleReview(application)}>
                        <Star className="h-3.5 w-3.5" />
                        {matrix?.freelancerToClient ? "Edit review" : "Rate client"}
                      </Button>
                    ) : null}
                  </div>
                ) : null}

                {openReviewId === application.id ? (
                  <ReviewForm
                    applicationId={application.id}
                    existingReview={matrix?.freelancerToClient ?? null}
                    onSubmitted={(saved) => {
                      setReviewMatrices((current) => ({
                        ...current,
                        [application.id]: { ...(current[application.id] as ReviewMatrix), freelancerToClient: saved },
                      }))
                      setOpenReviewId(null)
                    }}
                  />
                ) : null}
              </div>
            </li>
          </Fragment>
        )
      })}
    </ul>
  )
}
