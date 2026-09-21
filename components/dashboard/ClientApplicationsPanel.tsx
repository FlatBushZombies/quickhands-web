"use client"

import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { CheckCircle2, Loader2, MessageCircle, Star, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/app-shell/Avatar"
import { DateDivider, FeedSkeleton, dayBucket, timeAgo } from "@/components/app-shell/feed"
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
    // Only poll while this tab is actually visible — a background tab was
    // previously still hitting the backend every 10s for no one to see,
    // multiplied by every open tab across every client. Refreshing once
    // immediately on regaining focus covers the gap instead.
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

  const handleStatus = async (application: Application, status: "accepted" | "rejected" | "completed") => {
    setBusyId(application.id)
    try {
      const token = await getToken()
      if (!token) return
      // The PATCH response already carries the fully updated application —
      // patch it into local state directly instead of re-fetching every
      // job and application from scratch, which was throwing away and
      // re-requesting data this call already returned.
      const updated = await updateApplicationStatus(application.id, status, token)
      setJobs((current) =>
        current.map((job) => {
          if (job.id !== updated.jobId) return job
          const applications = job.applications.map((app) => (app.id === updated.id ? updated : app))
          const applicationSummary = {
            total: applications.length,
            pending: applications.filter((a) => a.status === "pending").length,
            accepted: applications.filter((a) => a.status === "accepted").length,
            rejected: applications.filter((a) => a.status === "rejected").length,
            completed: applications.filter((a) => a.status === "completed").length,
          }
          return { ...job, applications, applicationSummary }
        })
      )
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
    return <FeedSkeleton />
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">You haven&apos;t posted any jobs yet.</p>
        <Link href="/post-job" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Post your first job
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {jobs.map((job) => (
        <section key={job.id} aria-labelledby={`client-job-${job.id}`}>
          <div className="flex items-center gap-3">
            <h3 id={`client-job-${job.id}`} className="font-heading text-[17px] font-medium text-foreground">
              {job.serviceType}
            </h3>
            <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              {job.applicationSummary.total} applicant{job.applicationSummary.total === 1 ? "" : "s"}
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>

          {job.applications.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No applications yet.</p>
          ) : (
            <ul className="mt-1">
              {job.applications.map((application, index) => {
                const canReview = application.status === "accepted" || application.status === "completed"
                const matrix = reviewMatrices[application.id]
                // Data arrives newest-first, so a divider only needs to appear
                // where the day bucket changes within this job.
                const bucket = dayBucket(application.createdAt)
                const showDivider = index > 0 && bucket !== dayBucket(job.applications[index - 1].createdAt)

                return (
                  <Fragment key={application.id}>
                    {showDivider ? <DateDivider label={bucket} /> : null}
                    <li className="flex gap-3 border-b border-border/60 py-4 last:border-b-0">
                      <Avatar name={application.freelancerName} size="lg" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="text-[17px] font-medium text-foreground">{application.freelancerName}</p>
                          <span className="text-xs text-muted-foreground">{timeAgo(application.createdAt)}</span>
                          <span className={`ml-auto shrink-0 rounded-full border border-border/60 px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[application.status]}`}>
                            {application.status}
                          </span>
                        </div>
                        {application.quotation ? (
                          <p className="mt-0.5 text-[15px] text-muted-foreground">Quote: {application.quotation}</p>
                        ) : null}
                        {application.conditions ? (
                          <p className="mt-1 text-[15px] text-muted-foreground">{application.conditions}</p>
                        ) : null}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {application.status === "pending" ? (
                            <>
                              <Button size="sm" className="rounded-full" onClick={() => handleStatus(application, "accepted")} disabled={busyId === application.id}>
                                {busyId === application.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                Accept
                              </Button>
                              <Button size="sm" variant="outline" className="rounded-full" onClick={() => handleStatus(application, "rejected")} disabled={busyId === application.id}>
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </Button>
                            </>
                          ) : null}
                          {application.status === "accepted" ? (
                            <Button size="sm" variant="outline" className="rounded-full" onClick={() => handleStatus(application, "completed")} disabled={busyId === application.id}>
                              {busyId === application.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Mark complete"}
                            </Button>
                          ) : null}
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
                              {matrix?.clientToFreelancer ? "Edit review" : "Rate specialist"}
                            </Button>
                          ) : null}
                        </div>

                        {openReviewId === application.id ? (
                          <ReviewForm
                            applicationId={application.id}
                            existingReview={matrix?.clientToFreelancer ?? null}
                            onSubmitted={(saved) => {
                              setReviewMatrices((current) => ({
                                ...current,
                                [application.id]: { ...(current[application.id] as ReviewMatrix), clientToFreelancer: saved },
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
          )}
        </section>
      ))}
    </div>
  )
}
