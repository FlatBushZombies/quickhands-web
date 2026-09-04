"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    pollRef.current = setInterval(refresh, 10000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
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
    return <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">You haven&apos;t applied to any jobs yet.</p>
        <Link href="/jobs" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Browse jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {applications.map((application) => {
        const canReview = application.status === "accepted" || application.status === "completed"
        const matrix = reviewMatrices[application.id]

        return (
          <div key={application.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading font-bold text-foreground">{application.job?.serviceType || "Job"}</p>
                {application.job?.clientName ? (
                  <p className="text-sm text-muted-foreground">Client: {application.job.clientName}</p>
                ) : null}
                {application.quotation ? <p className="mt-1 text-sm text-muted-foreground">Your quote: {application.quotation}</p> : null}
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[application.status]}`}>
                {application.status}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {application.conversationId ? (
                <Link href={`/messages/${application.conversationId}`}>
                  <Button size="sm" variant="ghost">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Message
                  </Button>
                </Link>
              ) : null}
              {canReview ? (
                <Button size="sm" variant="ghost" onClick={() => toggleReview(application)}>
                  <Star className="h-3.5 w-3.5" />
                  {matrix?.freelancerToClient ? "Edit review" : "Rate client"}
                </Button>
              ) : null}
            </div>

            {openReviewId === application.id ? (
              <ReviewForm
                applicationId={application.id}
                existingReview={matrix?.freelancerToClient ?? null}
                onSubmitted={() => setOpenReviewId(null)}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
