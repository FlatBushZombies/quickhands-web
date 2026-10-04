"use client"

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"
import {
  Calendar,
  Check,
  CircleCheck,
  CircleDashed,
  ClipboardList,
  IdCard,
  Inbox,
  Mail,
  ScanFace,
  ShieldCheck,
  LogOut,
  MapPin,
  MessagesSquare,
  Plus,
  Send,
  Star,
  type LucideIcon,
} from "lucide-react"
import { authFontClassName } from "@/components/auth/fonts"
import { AccountChatModal, AccountReviewModal } from "@/components/account/AccountModals"
import {
  ACCOUNT_CSS,
  EYEBROW,
  GREEN,
  PAGE_H1,
  SERIF_EM,
  firstNameOf,
  fullDateLabel,
  initialsOf,
  shortNameOf,
  sx,
  whenLabel,
} from "@/components/account/account-styles"
import { timeAgo } from "@/components/app-shell/feed"
import {
  getApplicationReviews,
  getClientApplications,
  confirmApplicationCompletion,
  getMyVerification,
  updateApplicationStatus,
  type MyVerification,
  type Application,
  type ClientJobWithApplications,
  type ReviewEntry,
  type ReviewMatrix,
} from "@/lib/applications-api"

type View = "tasks" | "offers" | "verify"
type TaskStatus = "open" | "in_progress" | "completed"

const TABS: { id: TaskStatus; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In progress" },
  { id: "completed", label: "Completed" },
]

const EMPTY_TEXT: Record<TaskStatus, string> = {
  open: "No open tasks. Post one and specialists will send offers.",
  in_progress: "Nothing in progress. Hire a specialist from one of your open tasks.",
  completed: "No completed tasks yet.",
}

/** The hired application for a task: completed wins over accepted. */
function hiredOf(job: ClientJobWithApplications): Application | null {
  return (
    job.applications.find((app) => app.status === "completed") ??
    job.applications.find((app) => app.status === "accepted") ??
    null
  )
}

function taskStatusOf(job: ClientJobWithApplications): TaskStatus {
  const hired = hiredOf(job)
  if (!hired) return "open"
  return hired.status === "completed" ? "completed" : "in_progress"
}

const STATUS_LOOK: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  open: { label: "Waiting for offers", color: "var(--fg-3)", bg: "var(--ink-100)" },
  in_progress: { label: "In progress", color: "var(--fg-1)", bg: "var(--ink-100)" },
  completed: { label: "Completed", color: GREEN, bg: "#F1F8EF" },
}

function openStatusLook(job: ClientJobWithApplications) {
  if (job.applications.length === 0) return STATUS_LOOK.open
  return { label: "Receiving offers", color: GREEN, bg: "#F1F8EF" }
}

function stageIndex(job: ClientJobWithApplications, status: TaskStatus) {
  if (status === "completed") return 3
  if (status === "in_progress") return 2
  return job.applications.length ? 1 : 0
}

function jobPhotos(job: ClientJobWithApplications) {
  // Attachments are Cloudinary URLs; only image uploads are shown as photos.
  return (job.documents ?? []).filter((url) => url.includes("/image/upload/"))
}

function locationLabel(job: ClientJobWithApplications) {
  return job.jobLocation?.label || job.jobLocation?.city || ""
}

function ratingOf(app: Application) {
  const summary = app.freelancerReviewSummary
  if (!summary || summary.reviewCount === 0) return "New"
  return summary.averageRating.toFixed(1)
}

/** Verification rows from the real verification record. Only a reviewer can mark documents verified. */
function verificationRows(email: string | null, verification: MyVerification | null) {
  const status = verification?.status
  const verified = status === "verified"
  const pending = status === "pending"
  const documentStatus = verified ? "Done" : pending ? "In review" : status === "rejected" ? "Not approved" : "Required"
  return [
    { icon: Mail, label: "Email address", hint: email || "Confirmed at sign-up", status: "Done", ok: true, pending: false },
    { icon: IdCard, label: "National ID or passport", hint: "Photo of the bio page", status: documentStatus, ok: verified, pending },
    { icon: ScanFace, label: "Live selfie", hint: "Matched to your document", status: documentStatus, ok: verified, pending },
  ]
}

function tasksLabel(count: number | undefined) {
  return `${count ?? 0} tasks`
}

function starsOf(rating: number) {
  return [1, 2, 3, 4, 5].map((i) => (i <= rating ? "var(--ink-950)" : "var(--ink-200)"))
}

const TASK_CARD = sx(
  "display:flex;flex-direction:column;gap:12px;padding:20px;border:0;border-radius:var(--radius-lg);background:var(--white);text-align:left;cursor:pointer;color:var(--fg-1);transition:box-shadow var(--dur-fast) var(--ease-out)"
)

const CHIP_BUTTON = sx(
  "display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 7px 0 14px;border:0;border-radius:999px;font:500 14px/1 var(--font-sans);cursor:pointer;transition:background var(--dur-fast) var(--ease-out)"
)

const PILL_BUTTON_GREEN = sx(
  "height:40px;padding:0 18px;border:0;border-radius:999px;background:#108600;color:var(--white);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px"
)

const PILL_BUTTON_GHOST = sx(
  "height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);color:var(--fg-1);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px"
)

const PILL_BUTTON_DECLINE = sx(
  "height:40px;padding:0 16px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:500 14px/1 var(--font-sans);cursor:pointer"
)

const SMALL_GHOST_BUTTON = sx(
  "margin-top:12px;height:38px;padding:0 16px;border:0;border-radius:999px;background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);color:var(--fg-1);font:500 13px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:6px"
)

const PILL_GREEN_LG = sx(
  "margin-top:16px;height:44px;padding:0 20px;border:0;border-radius:999px;background:#108600;color:var(--white);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px"
)

const SECTION_CARD = sx(
  "padding:28px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)"
)

const LIST_CARD = sx("border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline);overflow:hidden")

const SPINNER = sx(
  "width:18px;height:18px;border-radius:50%;border:1.5px solid var(--ink-200);border-top-color:#108600;animation:qhSpin 900ms linear infinite;flex-shrink:0"
)

const NAV_ITEM_BASE = sx(
  "display:flex;align-items:center;gap:12px;height:42px;padding:0 12px;border:0;border-radius:var(--radius-md);font:500 14px/1 var(--font-sans);cursor:pointer;text-align:left;transition:background var(--dur-fast) var(--ease-out)"
)

function Icon({ icon: Glyph, size = 16, className }: { icon: LucideIcon; size?: number; className?: string }) {
  return <Glyph width={size} height={size} strokeWidth={1.5} className={className} aria-hidden="true" />
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={sx("display:flex;gap:2px;margin-top:12px")}>
      {starsOf(rating).map((color, i) => (
        <span key={i} style={{ fontSize: 18, lineHeight: 1, color }}>
          ★
        </span>
      ))}
    </div>
  )
}

export function AccountClient() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()

  const [jobs, setJobs] = useState<ClientJobWithApplications[]>([])
  const [loaded, setLoaded] = useState(false)
  const [view, setView] = useState<View>("tasks")
  const [filter, setFilter] = useState<TaskStatus>("open")
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [chat, setChat] = useState<{ application: Application; serviceType: string } | null>(null)
  const [reviewAppId, setReviewAppId] = useState<number | null>(null)
  const [dismissedReviews, setDismissedReviews] = useState<Record<number, true>>({})
  const [matrices, setMatrices] = useState<Record<number, ReviewMatrix>>({})
  const [verification, setVerification] = useState<MyVerification | null>(null)

  const refresh = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    const [data, verif] = await Promise.all([getClientApplications(token), getMyVerification(token)])
    setJobs(data)
    setVerification(verif)
    setLoaded(true)
  }, [getToken])

  // Same cadence as the dashboard: poll only while this tab is visible, and
  // refresh once when it becomes visible again.
  useEffect(() => {
    refresh()
    const tick = () => {
      if (!document.hidden) refresh()
    }
    const interval = setInterval(tick, 10000)
    document.addEventListener("visibilitychange", tick)
    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", tick)
    }
  }, [refresh])

  const sortedJobs = useMemo(
    () =>
      [...jobs].sort((a, b) => {
        const left = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const right = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return right - left
      }),
    [jobs]
  )

  const counts = useMemo(() => {
    const result: Record<TaskStatus, number> = { open: 0, in_progress: 0, completed: 0 }
    for (const job of sortedJobs) result[taskStatusOf(job)] += 1
    return result
  }, [sortedJobs])

  const pendingOffers = useMemo(
    () =>
      sortedJobs
        .filter((job) => taskStatusOf(job) === "open")
        .reduce((total, job) => total + job.applications.filter((app) => app.status === "pending").length, 0),
    [sortedJobs]
  )

  const visibleJobs = useMemo(() => sortedJobs.filter((job) => taskStatusOf(job) === filter), [sortedJobs, filter])
  const selected = visibleJobs.find((job) => job.id === selectedId) ?? visibleJobs[0] ?? null
  const selectedStatus = selected ? taskStatusOf(selected) : "open"
  const selectedHired = selected ? hiredOf(selected) : null

  // Review matrices for completed hires, so the review cards and the
  // "leave a review" prompt know each side's state. Each hire is requested once.
  const requestedMatrices = useRef<Set<number>>(new Set())
  useEffect(() => {
    const toLoad = sortedJobs
      .map((job) => hiredOf(job))
      .filter((app): app is Application => app !== null && app.status === "completed")
      .filter((app) => !requestedMatrices.current.has(app.id))
    if (toLoad.length === 0) return
    toLoad.forEach((app) => requestedMatrices.current.add(app.id))
    ;(async () => {
      const token = await getToken()
      if (!token) return
      const loaded = await Promise.all(
        toLoad.map(async (app) => [app.id, await getApplicationReviews(app.id, token)] as const)
      )
      setMatrices((current) => {
        const next = { ...current }
        for (const [id, matrix] of loaded) if (matrix) next[id] = matrix
        return next
      })
    })()
  }, [sortedJobs, getToken])

  // A completed task with no review from the client asks for one, once per
  // session, unless it was dismissed with "Later".
  const reviewPrompt = useMemo(() => {
    if (reviewAppId !== null) return null
    for (const job of sortedJobs) {
      const hired = hiredOf(job)
      if (!hired || hired.status !== "completed") continue
      if (dismissedReviews[hired.id]) continue
      const matrix = matrices[hired.id]
      if (matrix && !matrix.clientToFreelancer) return { application: hired, job }
    }
    return null
  }, [sortedJobs, matrices, reviewAppId, dismissedReviews])

  useEffect(() => {
    if (reviewPrompt) setReviewAppId(reviewPrompt.application.id)
  }, [reviewPrompt])

  const reviewTarget = useMemo(() => {
    if (reviewAppId === null) return null
    for (const job of sortedJobs) {
      const hired = hiredOf(job)
      if (hired && hired.id === reviewAppId) return { application: hired, job }
    }
    return null
  }, [reviewAppId, sortedJobs])

  const mergeApplication = (updated: Application) =>
    setJobs((current) =>
      current.map((job) =>
        job.id !== updated.jobId
          ? job
          : {
              ...job,
              applications: job.applications.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
            }
      )
    )

  const setStatus = async (app: Application, status: "accepted" | "rejected") => {
    setBusyId(app.id)
    setActionError(null)
    try {
      const token = await getToken()
      if (!token) return
      const updated = await updateApplicationStatus(app.id, status, token)
      mergeApplication(updated)
      // Hiring moves the task to In progress.
      if (status === "accepted") {
        setFilter("in_progress")
        setSelectedId(updated.jobId)
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update this offer")
    } finally {
      setBusyId(null)
    }
  }

  // This side confirms the work is finished. The job completes only once the
  // specialist has confirmed too, so a single confirmation may leave it In progress.
  const confirmDone = async (app: Application) => {
    setBusyId(app.id)
    setActionError(null)
    try {
      const token = await getToken()
      if (!token) return
      const { application: updated, completedNow } = await confirmApplicationCompletion(app.id, token)
      mergeApplication(updated)
      if (completedNow) {
        setFilter("completed")
        setSelectedId(updated.jobId)
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not confirm completion")
    } finally {
      setBusyId(null)
    }
  }

  const allOffers = useMemo(
    () =>
      sortedJobs.flatMap((job) =>
        job.applications.map((app) => ({ app, job, status: taskStatusOf(job) }))
      ),
    [sortedJobs]
  )

  const firstName = firstNameOf(user?.fullName || user?.firstName) || "there"
  const displayName = user?.fullName || user?.firstName || ""
  const initials = initialsOf(displayName || "U")

  const verified = verification?.status === "verified"
  const verifyPending = verification?.status === "pending"

  const navItems: { id: View; label: string; icon: LucideIcon; badge: number | string | null; badgeBg: string }[] = [
    { id: "tasks", label: "My tasks", icon: ClipboardList, badge: sortedJobs.length || null, badgeBg: "var(--ink-400)" },
    { id: "offers", label: "Offers", icon: Inbox, badge: pendingOffers || null, badgeBg: GREEN },
    {
      id: "verify",
      label: "Verification",
      icon: ShieldCheck,
      badge: verified ? null : "!",
      badgeBg: verifyPending ? "#C98A1B" : "#C2410C",
    },
  ]

  const selectTask = (job: ClientJobWithApplications) => setSelectedId(job.id)
  const openThread = (app: Application, job: ClientJobWithApplications) =>
    setChat({ application: app, serviceType: job.serviceType })

  return (
    <div className={`qh-account ${authFontClassName}`}>
      <style>{ACCOUNT_CSS}</style>

      <header
        style={sx(
          "position:sticky;top:0;z-index:20;background:var(--surface-glass);backdrop-filter:var(--blur-glass);-webkit-backdrop-filter:var(--blur-glass);border-bottom:1px solid var(--border-hairline)"
        )}
      >
        <div style={sx("max-width:var(--container-max);margin:0 auto;padding:0 var(--gutter);height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px")}>
          <Link href="/" style={sx("font:600 20px/1 var(--font-sans);letter-spacing:-0.05em;text-decoration:none;color:var(--fg-1)")}>
            quickhands
          </Link>
          <div style={sx("display:flex;align-items:center;gap:10px")}>
            <Link href="/post-job" className="qh-acc-green qh-acc-press" style={{ ...PILL_BUTTON_GREEN, height: 40, textDecoration: "none" }}>
              <Icon icon={Plus} />
              Post a task
            </Link>
            <div style={sx("display:flex;align-items:center;gap:10px;padding:4px 12px 4px 4px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--border-hairline)")}>
              <span style={sx("width:32px;height:32px;border-radius:50%;background:var(--ink-950);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 13px/1 var(--font-sans)")}>
                {initials}
              </span>
              <span style={sx("font:500 14px/1 var(--font-sans)")}>{firstName}</span>
            </div>
          </div>
        </div>
      </header>

      <div style={sx("max-width:var(--container-max);margin:0 auto;padding:40px var(--gutter) 80px;display:flex;flex-wrap:wrap;gap:40px;align-items:flex-start")}>
        <nav aria-label="Account sections" style={sx("flex:0 0 220px;position:sticky;top:104px;display:flex;flex-direction:column;gap:2px")}>
          {navItems.map((item) => {
            const active = view === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                aria-current={active ? "page" : undefined}
                className="qh-acc-nav"
                style={{
                  ...NAV_ITEM_BASE,
                  background: active ? "var(--ink-100)" : "transparent",
                  color: active ? "var(--fg-1)" : "var(--fg-2)",
                }}
              >
                <Icon icon={item.icon} />
                <span style={sx("flex:1")}>{item.label}</span>
                {item.badge ? (
                  <span style={{ minWidth: 20, height: 20, padding: "0 6px", boxSizing: "border-box", borderRadius: 999, background: item.badgeBg, color: "var(--white)", font: "500 11px/20px var(--font-sans)", textAlign: "center" }}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            )
          })}
          <div style={sx("height:1px;background:var(--border-hairline);margin:14px 0")} />
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="qh-acc-signout"
            style={sx("display:flex;align-items:center;gap:12px;height:42px;padding:0 12px;border:0;border-radius:var(--radius-md);background:transparent;color:var(--fg-3);font:500 14px/1 var(--font-sans);cursor:pointer;text-align:left")}
          >
            <Icon icon={LogOut} />
            Sign out
          </button>
        </nav>

        <main style={sx("flex:1 1 600px;min-width:0;display:flex;flex-direction:column;gap:32px")}>
          {actionError ? (
            <p role="alert" style={sx("margin:0;padding:14px 16px;border-radius:var(--radius-lg);background:#FBE6E5;color:#C9302C;font:var(--text-small)")}>
              {actionError}
            </p>
          ) : null}

          {!loaded ? (
            <div style={sx("display:flex;justify-content:center;padding:64px 0")}>
              <span style={{ ...SPINNER, width: 24, height: 24 }} />
            </div>
          ) : null}

          {loaded && view === "tasks" ? (
            <div style={sx("display:flex;flex-direction:column;gap:28px")}>
              <div style={sx("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px")}>
                <div>
                  <span style={EYEBROW}>Good to see you, {firstName}</span>
                  <h1 style={PAGE_H1}>
                    Your <em style={SERIF_EM}>tasks</em>.
                  </h1>
                </div>
                {sortedJobs.length ? (
                  <div role="tablist" aria-label="Task status" style={sx("display:flex;flex-wrap:wrap;gap:6px")}>
                    {TABS.map((tab) => {
                      const on = filter === tab.id
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={on}
                          onClick={() => {
                            setFilter(tab.id)
                            setSelectedId(null)
                          }}
                          className="qh-acc-press-sm"
                          style={{
                            ...CHIP_BUTTON,
                            background: on ? "var(--ink-950)" : "var(--white)",
                            color: on ? "var(--white)" : "var(--fg-2)",
                            boxShadow: on ? "none" : "inset 0 0 0 1px var(--border-default)",
                          }}
                        >
                          {tab.label}
                          <span
                            style={{
                              minWidth: 22,
                              height: 22,
                              padding: "0 6px",
                              boxSizing: "border-box",
                              borderRadius: 999,
                              background: on ? "rgba(255,255,255,.16)" : "var(--ink-100)",
                              color: on ? "var(--white)" : "var(--fg-2)",
                              font: "500 12px/22px var(--font-sans)",
                              textAlign: "center",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {counts[tab.id]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>

              {sortedJobs.length === 0 ? (
                <div style={sx("padding:56px 32px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline);text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px")}>
                  <span style={sx("width:52px;height:52px;border-radius:var(--radius-lg);background:var(--ink-100);display:inline-flex;align-items:center;justify-content:center")}>
                    <Icon icon={ClipboardList} size={22} />
                  </span>
                  <div style={sx("font:500 18px/1.3 var(--font-sans);margin-top:8px")}>No tasks yet</div>
                  <div style={sx("color:var(--fg-2);max-width:340px")}>
                    Post what you need done and specialists in that trade will send you offers.
                  </div>
                  <Link href="/post-job" className="qh-acc-green qh-acc-press" style={{ ...PILL_BUTTON_GREEN, height: 52, padding: "0 22px", marginTop: 12, textDecoration: "none", fontSize: 14 }}>
                    <Icon icon={Plus} />
                    Post a task
                  </Link>
                </div>
              ) : null}

              {sortedJobs.length > 0 && visibleJobs.length === 0 ? (
                <div style={sx("padding:48px 24px;border-radius:var(--radius-xl);box-shadow:inset 0 0 0 1px var(--border-default);text-align:center;color:var(--fg-3)")}>
                  {EMPTY_TEXT[filter]}
                </div>
              ) : null}

              {visibleJobs.length > 0 && selected ? (
                <div style={sx("display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start")}>
                  <div style={sx("flex:1 1 260px;max-width:340px;min-width:0;display:flex;flex-direction:column;gap:10px")}>
                    {visibleJobs.map((job) => {
                      const status = taskStatusOf(job)
                      const look = status === "open" ? openStatusLook(job) : STATUS_LOOK[status]
                      const hired = hiredOf(job)
                      const count = job.applications.length
                      const meta =
                        status === "open"
                          ? count
                            ? `${count} offer${count === 1 ? "" : "s"}`
                            : "No offers yet"
                          : hired
                            ? `With ${shortNameOf(hired.freelancerName)}`
                            : ""
                      const ring = job.id === selected.id ? "inset 0 0 0 1.5px var(--ink-950)" : "var(--shadow-hairline)"
                      return (
                        <button
                          key={job.id}
                          type="button"
                          onClick={() => selectTask(job)}
                          className="qh-acc-card"
                          style={{ ...TASK_CARD, boxShadow: ring }}
                        >
                          <div style={sx("display:flex;justify-content:space-between;align-items:center;gap:12px")}>
                            <span style={sx("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>
                              {job.createdAt ? `Posted ${timeAgo(job.createdAt)}` : "Posted"}
                            </span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: look.color }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: look.color }} />
                              {look.label}
                            </span>
                          </div>
                          <div style={sx("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>{job.serviceType}</div>
                          <div style={sx("display:flex;justify-content:space-between;gap:12px;font:var(--text-small);color:var(--fg-2)")}>
                            <span style={sx("display:inline-flex;align-items:center;gap:6px;min-width:0")}>
                              <Icon icon={Calendar} size={13} />
                              <span style={sx("white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                                {whenLabel(job.startDate, job.endDate)}
                              </span>
                            </span>
                            <span style={sx("white-space:nowrap")}>{meta}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <TaskDetail
                    key={selected.id}
                    job={selected}
                    status={selectedStatus}
                    hired={selectedHired}
                    matrix={selectedHired ? matrices[selectedHired.id] ?? null : null}
                    busyId={busyId}
                    onHire={(app) => setStatus(app, "accepted")}
                    onDecline={(app) => setStatus(app, "rejected")}
                    onComplete={(app) => confirmDone(app)}
                    onChat={(app) => openThread(app, selected)}
                    onReview={() => setReviewAppId(selectedHired?.id ?? null)}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {loaded && view === "verify" ? (
            <div style={sx("display:flex;flex-direction:column;gap:24px")}>
              <div>
                <span style={EYEBROW}>Trust &amp; safety</span>
                <h1 style={PAGE_H1}>
                  Identity <em style={SERIF_EM}>verification</em>.
                </h1>
                <p style={sx("margin:12px 0 0;color:var(--fg-2);max-width:520px;text-wrap:pretty")}>
                  Verified clients get faster offers, and specialists know who they&apos;re working with.{" "}
                  <span style={sx("color:var(--fg-3)")}>Your documents are encrypted and never shown to specialists.</span>
                </p>
              </div>
              <div style={LIST_CARD}>
                {verificationRows(user?.primaryEmailAddress?.emailAddress ?? null, verification).map((row) => (
                  <div key={row.label} style={sx("display:flex;align-items:center;gap:16px;padding:22px 24px;border-bottom:1px solid var(--border-hairline)")}>
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "var(--radius-md)",
                        background: row.ok ? "#F1F8EF" : "var(--ink-100)",
                        color: row.ok ? GREEN : "var(--fg-2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon icon={row.icon} size={18} />
                    </span>
                    <div style={sx("flex:1")}>
                      <div style={sx("font:500 15px/1.3 var(--font-sans)")}>{row.label}</div>
                      <div style={sx("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>{row.hint}</div>
                    </div>
                    <span style={{ font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: row.ok ? GREEN : row.pending ? "#9A6A12" : "#C2410C" }}>
                      {row.status}
                    </span>
                  </div>
                ))}
                {verified ? (
                  <div style={sx("padding:20px 24px;display:flex;justify-content:flex-end")}>
                    <span style={sx("display:inline-flex;align-items:center;gap:8px;font:500 14px/1 var(--font-sans);color:#0D6E00")}>
                      <Icon icon={ShieldCheck} size={16} />
                      You&apos;re verified
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {loaded && view === "offers" ? (
            <div style={sx("display:flex;flex-direction:column;gap:24px")}>
              <div>
                <span style={EYEBROW}>From specialists</span>
                <h1 style={PAGE_H1}>
                  All <em style={SERIF_EM}>offers</em>.
                </h1>
              </div>
              <div style={LIST_CARD}>
                {allOffers.map(({ app, job, status }) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      setView("tasks")
                      setFilter(status)
                      setSelectedId(job.id)
                    }}
                    className="qh-acc-row"
                    style={sx("width:100%;display:flex;align-items:center;gap:16px;padding:18px 22px;border:0;border-bottom:1px solid var(--border-hairline);background:transparent;text-align:left;cursor:pointer;color:var(--fg-1)")}
                  >
                    <div role="img" aria-label={app.freelancerName} style={sx("width:44px;height:44px;border-radius:50%;background-color:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 14px/1 var(--font-sans);flex-shrink:0")}>
                      {initialsOf(app.freelancerName)}
                    </div>
                    <div style={sx("flex:1;min-width:0")}>
                      <div style={sx("font:500 15px/1.3 var(--font-sans)")}>
                        {app.freelancerName} <span style={sx("color:var(--fg-3);font-weight:400")}>for</span> {job.serviceType}
                      </div>
                      <div style={sx("font:var(--text-small);color:var(--fg-3);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                        {app.conditions || "No message"}
                      </div>
                    </div>
                    <span style={{ font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: offerStatusColor(app, status) }}>
                      {offerStatusLabel(app, status)}
                    </span>
                    <span style={sx("font:500 17px/1 var(--font-sans);font-variant-numeric:tabular-nums;min-width:64px;text-align:right")}>
                      {app.quotation || "No quote"}
                    </span>
                  </button>
                ))}
                {allOffers.length === 0 ? (
                  <div style={sx("padding:40px;text-align:center;color:var(--fg-3)")}>No offers yet.</div>
                ) : null}
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {chat ? (
        <AccountChatModal
          application={chat.application}
          serviceType={chat.serviceType}
          onClose={() => setChat(null)}
        />
      ) : null}

      {reviewTarget ? (
        <AccountReviewModal
          application={reviewTarget.application}
          serviceType={reviewTarget.job.serviceType}
          existing={matrices[reviewTarget.application.id]?.clientToFreelancer ?? null}
          onSaved={(saved: ReviewEntry) => {
            setMatrices((current) => ({
              ...current,
              [reviewTarget.application.id]: {
                ...(current[reviewTarget.application.id] ?? emptyMatrix()),
                clientToFreelancer: saved,
              },
            }))
            setReviewAppId(null)
          }}
          onClose={() => {
            setDismissedReviews((current) => ({ ...current, [reviewTarget.application.id]: true }))
            setReviewAppId(null)
          }}
        />
      ) : null}
    </div>
  )
}

function emptyMatrix(): ReviewMatrix {
  return { clientToFreelancer: null, freelancerToClient: null, canClientReview: true, canFreelancerReview: false }
}

function offerStatusLabel(app: Application, status: TaskStatus) {
  if (app.status === "accepted" || app.status === "completed") return "Hired"
  if (app.status === "rejected") return "Declined"
  return status === "open" ? "New" : "Not selected"
}

function offerStatusColor(app: Application, status: TaskStatus) {
  return app.status === "accepted" || app.status === "completed" || (app.status === "pending" && status === "open")
    ? GREEN
    : "var(--fg-3)"
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={sx("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
      <div style={sx("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>{label}</div>
      {children}
    </div>
  )
}

function TaskDetail({
  job,
  status,
  hired,
  matrix,
  busyId,
  onHire,
  onDecline,
  onComplete,
  onChat,
  onReview,
}: {
  job: ClientJobWithApplications
  status: TaskStatus
  hired: Application | null
  matrix: ReviewMatrix | null
  busyId: number | null
  onHire: (app: Application) => void
  onDecline: (app: Application) => void
  onComplete: (app: Application) => void
  onChat: (app: Application) => void
  onReview: () => void
}) {
  const look = status === "open" ? openStatusLook(job) : STATUS_LOOK[status]
  const idx = stageIndex(job, status)
  const stages = ["Posted", "Offers", "In progress", "Completed"]
  const photos = jobPhotos(job)
  const place = locationLabel(job)
  const when = whenLabel(job.startDate, job.endDate)
  const details = job.additionalInfo?.trim() ?? ""
  const hiredFirst = hired ? firstNameOf(hired.freelancerName) : ""
  const clientConfirmed = Boolean(hired?.clientConfirmedAt)
  const freelancerConfirmed = Boolean(hired?.freelancerConfirmedAt)
  const offers = job.applications
    .slice()
    .sort(
      (a, b) =>
        Number(a.status === "rejected") - Number(b.status === "rejected") ||
        (b.freelancerReviewSummary?.averageRating ?? 0) - (a.freelancerReviewSummary?.averageRating ?? 0)
    )

  return (
    <div style={sx("flex:2 1 420px;min-width:0;display:flex;flex-direction:column;gap:20px;animation:qhFade 240ms var(--ease-out) both")}>
      <div style={SECTION_CARD}>
        <div style={sx("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px")}>
          <span style={EYEBROW}>
            {job.serviceType}
            {job.createdAt ? ` · Posted ${timeAgo(job.createdAt)}` : ""}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", height: 26, padding: "0 12px", borderRadius: 999, background: look.bg, color: look.color, font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase" }}>
            {look.label}
          </span>
        </div>
        <h2 style={sx("font:var(--text-h3);letter-spacing:var(--ls-heading);margin:16px 0 0")}>{job.serviceType}</h2>
        <div style={sx("display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:14px;font:var(--text-small);color:var(--fg-2)")}>
          {when ? (
            <span style={sx("display:inline-flex;align-items:center;gap:6px")}>
              <Icon icon={Calendar} size={14} />
              {when}
            </span>
          ) : null}
          {place ? (
            <span style={sx("display:inline-flex;align-items:center;gap:6px")}>
              <Icon icon={MapPin} size={14} />
              {place}
            </span>
          ) : null}
        </div>
        {details ? (
          <p style={sx("margin:18px 0 0;padding-top:18px;border-top:1px solid var(--border-hairline);color:var(--fg-2);white-space:pre-wrap;text-wrap:pretty")}>
            {details}
          </p>
        ) : null}
        {photos.length ? (
          <div style={sx("display:flex;flex-wrap:wrap;gap:8px;margin-top:16px")}>
            {photos.map((url) => (
              <div
                key={url}
                role="img"
                aria-label="Task photo"
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--ink-100)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url("${url}")`,
                }}
              />
            ))}
          </div>
        ) : null}
        <div style={sx("display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:24px")}>
          {stages.map((label, i) => {
            const on = i <= idx
            return (
              <div key={label}>
                <div style={{ height: 3, borderRadius: 999, background: on ? GREEN : "var(--ink-100)", transition: "background var(--dur-base) var(--ease-out)" }} />
                <div style={{ marginTop: 8, font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: on ? "var(--fg-1)" : "var(--fg-3)" }}>
                  {label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {status === "open" ? (
        <div style={sx("display:flex;flex-direction:column;gap:14px")}>
          <div style={sx("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:8px 12px;margin-top:8px")}>
            <h3 style={sx("font:var(--text-h4);letter-spacing:var(--ls-tight);margin:0")}>
              Offers <span style={sx("color:var(--fg-3);font-weight:400")}>{offers.length || ""}</span>
            </h3>
            <span style={EYEBROW}>Reply to chat · hire to share contacts</span>
          </div>
          {offers.length === 0 ? (
            <div style={sx("display:flex;align-items:center;gap:14px;padding:20px;border-radius:var(--radius-lg);box-shadow:inset 0 0 0 1px var(--border-default);color:var(--fg-2)")}>
              <span style={SPINNER} />
              <span>Sent to specialists in {job.serviceType}. Offers usually arrive within the hour.</span>
            </div>
          ) : null}
          {offers.map((app) => {
            const declined = app.status === "rejected"
            const pending = app.status === "pending"
            const reviews = app.freelancerReviewSummary?.reviewCount ?? 0
            return (
              <div
                key={app.id}
                style={sx(`display:flex;flex-direction:column;gap:16px;padding:22px;border-radius:var(--radius-lg);background:var(--white);box-shadow:var(--shadow-hairline);opacity:${declined ? 0.5 : 1};transition:opacity var(--dur-base) var(--ease-out)`)}
              >
                <div style={sx("display:flex;align-items:center;gap:14px")}>
                  <div role="img" aria-label={app.freelancerName} style={sx("width:48px;height:48px;border-radius:50%;background-color:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 15px/1 var(--font-sans);flex-shrink:0")}>
                    {initialsOf(app.freelancerName)}
                  </div>
                  <div style={sx("flex:1;min-width:0")}>
                    <div style={sx("display:flex;align-items:center;gap:6px;font:500 16px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>{app.freelancerName}</div>
                    <div style={sx("display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:4px;font:var(--text-small);color:var(--fg-3)")}>
                      <span style={sx("display:inline-flex;align-items:center;gap:4px;color:var(--fg-1);font-variant-numeric:tabular-nums")}>
                        <Icon icon={Star} size={12} />
                        {ratingOf(app)}
                      </span>
                      <span>{tasksLabel(app.freelancerCompletedCount)}</span>
                      <span>{timeAgo(app.createdAt)}</span>
                    </div>
                  </div>
                  <div style={sx("text-align:right")}>
                    <div style={sx("font:500 24px/1 var(--font-sans);letter-spacing:var(--ls-heading);font-variant-numeric:tabular-nums")}>
                      {app.quotation || "No quote"}
                    </div>
                    <div style={sx("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3);margin-top:6px")}>Offer</div>
                  </div>
                </div>
                {app.conditions ? <p style={sx("margin:0;color:var(--fg-2);text-wrap:pretty")}>{app.conditions}</p> : null}
                <div style={sx("display:flex;flex-wrap:wrap;align-items:center;gap:8px")}>
                  {pending ? (
                    <Fragment>
                      <button
                        type="button"
                        onClick={() => onHire(app)}
                        disabled={busyId === app.id}
                        className="qh-acc-green qh-acc-press"
                        style={PILL_BUTTON_GREEN}
                      >
                        <Icon icon={Check} size={14} />
                        {app.quotation ? `Hire · ${app.quotation}` : "Hire"}
                      </button>
                      <button type="button" onClick={() => onChat(app)} className="qh-acc-ghost qh-acc-press" style={PILL_BUTTON_GHOST}>
                        <Icon icon={Send} size={14} />
                        Message
                      </button>
                      <button type="button" onClick={() => onDecline(app)} disabled={busyId === app.id} className="qh-acc-decline qh-acc-press" style={PILL_BUTTON_DECLINE}>
                        Decline
                      </button>
                    </Fragment>
                  ) : null}
                  {declined ? <span style={sx("font:var(--text-small);color:var(--fg-3)")}>Declined</span> : null}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}

      {status === "in_progress" && hired ? (
        <div style={sx("display:flex;flex-direction:column;gap:18px;padding:24px;border-radius:var(--radius-xl);background:var(--white);box-shadow:inset 0 0 0 1.5px #108600,var(--shadow-sm)")}>
          <div style={sx("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:#108600;display:inline-flex;align-items:center;gap:6px")}>
            <Icon icon={Check} size={13} />
            Your specialist · contact shared
          </div>
          <div style={sx("display:flex;align-items:center;gap:14px")}>
            <div role="img" aria-label={hired.freelancerName} style={sx("width:52px;height:52px;border-radius:50%;background-color:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 16px/1 var(--font-sans);flex-shrink:0")}>
              {initialsOf(hired.freelancerName)}
            </div>
            <div style={sx("flex:1;min-width:0")}>
              <div style={sx("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>{hired.freelancerName}</div>
              <div style={sx("display:flex;gap:12px;margin-top:4px;font:var(--text-small);color:var(--fg-3)")}>
                <span style={sx("display:inline-flex;align-items:center;gap:4px;color:var(--fg-1)")}>
                  <Icon icon={Star} size={12} />
                  {ratingOf(hired)}
                </span>
                <span>{tasksLabel(hired.freelancerCompletedCount)}</span>
              </div>
            </div>
            <div style={sx("text-align:right")}>
              <div style={sx("font:500 24px/1 var(--font-sans);letter-spacing:var(--ls-heading);font-variant-numeric:tabular-nums")}>
                {hired.quotation || "No quote"}
              </div>
              <div style={sx("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3);margin-top:6px")}>Agreed price</div>
            </div>
          </div>
          <div>
            <button type="button" onClick={() => onChat(hired)} className="qh-acc-ghost qh-acc-press" style={PILL_BUTTON_GHOST}>
              <Icon icon={MessagesSquare} size={14} />
              Message {hiredFirst}
            </button>
          </div>
          <div style={sx("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
            <div style={sx("font:500 16px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>Is the job done?</div>
            <div style={sx("font:var(--text-small);color:var(--fg-2);margin-top:4px;text-wrap:pretty")}>
              When you both confirm, the task moves to completed and payment is released.
            </div>
            <div style={sx("display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:14px")}>
              {[
                { label: "You", done: clientConfirmed },
                { label: hiredFirst || "Specialist", done: freelancerConfirmed },
              ].map((row) => (
                <span
                  key={row.label}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "500 14px/1 var(--font-sans)", color: row.done ? GREEN : "var(--fg-3)" }}
                >
                  <Icon icon={row.done ? CircleCheck : CircleDashed} size={15} />
                  {row.label} · {row.done ? "Confirmed" : "Not yet"}
                </span>
              ))}
            </div>
            {!clientConfirmed ? (
              <button
                type="button"
                onClick={() => onComplete(hired)}
                disabled={busyId === hired.id}
                className="qh-acc-green qh-acc-press"
                style={PILL_GREEN_LG}
              >
                <Icon icon={Check} size={15} />
                {busyId === hired.id ? "Saving…" : "Mark as completed"}
              </button>
            ) : (
              <div style={sx("display:flex;align-items:center;gap:10px;margin-top:16px;font:var(--text-small);color:var(--fg-2)")}>
                <span style={SPINNER} />
                Waiting for {hiredFirst || "the specialist"} to confirm.
              </div>
            )}
          </div>
        </div>
      ) : null}

      {status === "completed" && hired ? (
        <div style={sx("display:flex;flex-direction:column;gap:18px;padding:24px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)")}>
          <div style={sx("display:flex;align-items:center;gap:14px")}>
            <span style={sx("width:44px;height:44px;border-radius:50%;background:#108600;color:var(--white);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0")}>
              <Icon icon={Check} size={20} />
            </span>
            <div>
              <div style={sx("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>Task completed</div>
              <div style={sx("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>
                {fullDateLabel(hired.completedAt ?? hired.updatedAt)} · with {hired.freelancerName} · {hired.quotation || "No quote"}
              </div>
            </div>
          </div>

          <div style={sx("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px")}>
            <Stat label={`Your review of ${hiredFirst || "them"}`}>
              {matrix?.clientToFreelancer ? (
                <Fragment>
                  <Stars rating={matrix.clientToFreelancer.rating} />
                  {matrix.clientToFreelancer.comment ? (
                    <p style={sx("margin:10px 0 0;color:var(--fg-2);text-wrap:pretty")}>{matrix.clientToFreelancer.comment}</p>
                  ) : null}
                </Fragment>
              ) : (
                <button type="button" onClick={onReview} className="qh-acc-green qh-acc-press" style={{ ...SMALL_GHOST_BUTTON, background: GREEN, color: "var(--white)", boxShadow: "none" }}>
                  <Icon icon={Star} size={13} />
                  Leave a review
                </button>
              )}
            </Stat>
            <Stat label={`${hiredFirst || "Their"}'s review of you`}>
              {matrix?.freelancerToClient ? (
                <Fragment>
                  <Stars rating={matrix.freelancerToClient.rating} />
                  {matrix.freelancerToClient.comment ? (
                    <p style={sx("margin:10px 0 0;color:var(--fg-2);text-wrap:pretty")}>{matrix.freelancerToClient.comment}</p>
                  ) : null}
                </Fragment>
              ) : (
                <p style={sx("margin:12px 0 0;font:var(--text-small);color:var(--fg-3)")}>Waiting for their review.</p>
              )}
            </Stat>
          </div>
        </div>
      ) : null}
    </div>
  )
}
