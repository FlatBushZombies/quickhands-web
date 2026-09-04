"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { CheckCircle2, Loader2, MessageCircle, Star, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReviewForm } from "@/components/dashboard/ReviewForm"
import {
  getApplicationReviews,
  getClientApplications,
  updateApplicationStatus,
  type Application,
  type ClientJobWithApplications,
  type ReviewMatrix,
} from "@/lib/applications-api"

const STATUS_STYLES: Record<Application["status"], string> = {
  pending: "bg-secondary text-secondary-foreground",
  accepted: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  completed: "bg-primary text-primary-foreground",
}

export function ClientApplicationsPanel() {
  const { getToken } = useAuth()
  const [jobs, setJobs] = useState<ClientJobWithApplications[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [openReviewId, setOpenReviewId] = useState<number | null>(null)
  const [reviewMatrices, setReviewMatrices] = useState<Record<number, ReviewMatrix>>({})
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    const data = await getClientApplications(token)
    setJobs(data)
    setLoading(false)
  }, [getToken])

  useEffect(() => {
    refresh()
    pollRef.current = setInterval(refresh, 10000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [refresh])

  const handleStatus = async (application: Application, status: "accepted" | "rejected" | "completed") => {
    setBusyId(application.id)
    try {
      const token = await getToken()
      if (!token) return
      await updateApplicationStatus(application.id, status, token)
      await refresh()
    } catch (error) {
      console.error("Failed to update application:", error)
    } finally {
      setBusyId(null)
    }
  }

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

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">You haven&apos;t posted any jobs yet.</p>
        <Link href="/post-job" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Post your first job
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <div key={job.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-foreground">{job.serviceType}</h3>
            <span className="text-xs text-muted-foreground">
              {job.applicationSummary.total} applicant{job.applicationSummary.total === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {job.applications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications yet.</p>
            ) : (
              job.applications.map((application) => {
                const canReview = application.status === "accepted" || application.status === "completed"
                const matrix = reviewMatrices[application.id]

                return (
                  <div key={application.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{application.freelancerName}</p>
                        {application.quotation ? (
                          <p className="text-sm text-muted-foreground">Quote: {application.quotation}</p>
                        ) : null}
                        {application.conditions ? (
                          <p className="mt-1 text-xs text-muted-foreground">{application.conditions}</p>
                        ) : null}
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[application.status]}`}>
                        {application.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {application.status === "pending" ? (
                        <>
                          <Button size="sm" onClick={() => handleStatus(application, "accepted")} disabled={busyId === application.id}>
                            {busyId === application.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleStatus(application, "rejected")} disabled={busyId === application.id}>
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </>
                      ) : null}
                      {application.status === "accepted" ? (
                        <Button size="sm" variant="outline" onClick={() => handleStatus(application, "completed")} disabled={busyId === application.id}>
                          {busyId === application.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Mark complete"}
                        </Button>
                      ) : null}
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
                          {matrix?.clientToFreelancer ? "Edit review" : "Rate specialist"}
                        </Button>
                      ) : null}
                    </div>

                    {openReviewId === application.id ? (
                      <ReviewForm
                        applicationId={application.id}
                        existingReview={matrix?.clientToFreelancer ?? null}
                        onSubmitted={() => setOpenReviewId(null)}
                      />
                    ) : null}
                  </div>
                )
              })
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
