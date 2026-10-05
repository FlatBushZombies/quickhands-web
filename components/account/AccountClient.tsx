"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  ClipboardList,
  Hourglass,
  IdCard,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  ScanFace,
  Settings,
  ShieldAlert,
  ShieldCheck,
  SquarePlus,
  UserSearch,
  type LucideIcon,
} from "lucide-react"
import { authFontClassName } from "@/components/auth/fonts"
import { AccountReviewModal, AccountThreadModal, AccountVerifyModal } from "@/components/account/AccountModals"
import { AccountTaskDetail } from "@/components/account/AccountTaskDetail"
import {
  ACCOUNT_CSS,
  EYEBROW,
  GREEN,
  PAGE_H1,
  SERIF_EM,
  firstNameOf,
  initialsOf,
  sx,
  whenLabel,
} from "@/components/account/account-styles"
import {
  hiredOf,
  statusLookOf,
  taskStatusOf,
  taskTitleOf,
  type TaskStatus,
} from "@/components/account/account-tasks"
import {
  getApplicationReviews,
  getClientApplications,
  confirmApplicationCompletion,
  updateApplicationStatus,
  type Application,
  type ClientJobWithApplications,
  type ReviewEntry,
  type ReviewMatrix,
} from "@/lib/applications-api"

type View = "tasks" | "offers" | "verify"

type VerificationStatus = "none" | "pending" | "verified"

/**
 * Identity verification status of this client. There is no verification store
 * or upload yet, so every client is "none" (not started). The pending and
 * verified looks stay in place for when a real status exists.
 */
const VERIFICATION_STATUS = "none" as VerificationStatus

/** Real destinations outside this page, linked from the client sidebar. */
const SITE_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/specialists", label: "Browse specialists", icon: UserSearch },
  { href: "/post-job", label: "Post a task", icon: SquarePlus },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
]

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

const TASK_CARD = sx(
  "display:flex;flex-direction:column;gap:12px;padding:20px;border:0;border-radius:var(--radius-lg);background:var(--white);text-align:left;cursor:pointer;color:var(--fg-1);transition:box-shadow var(--dur-fast) var(--ease-out)"
)

const CHIP_BUTTON = sx(
  "display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 7px 0 14px;border:0;border-radius:999px;font:500 14px/1 var(--font-sans);cursor:pointer;transition:background var(--dur-fast) var(--ease-out)"
)

const PILL_BUTTON_GREEN = sx(
  "height:40px;padding:0 18px;border:0;border-radius:999px;background:#108600;color:var(--white);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px"
)

const LIST_CARD = sx("border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline);overflow:hidden")

const SPINNER = sx(
  "width:18px;height:18px;border-radius:50%;border:1.5px solid var(--ink-200);border-top-color:#108600;animation:qhSpin 900ms linear infinite;flex-shrink:0"
)

const NAV_ITEM_BASE = sx(
  "display:flex;align-items:center;gap:12px;height:42px;padding:0 12px;border:0;border-radius:var(--radius-md);font:500 14px/1 var(--font-sans);cursor:pointer;text-align:left;transition:background var(--dur-fast) var(--ease-out)"
)

const DIVIDER = sx("height:1px;background:var(--border-hairline);margin:14px 0")

function Icon({ icon: Glyph, size = 16, color }: { icon: LucideIcon; size?: number; color?: string }) {
  return <Glyph width={size} height={size} strokeWidth={1.5} color={color} aria-hidden="true" style={{ flexShrink: 0 }} />
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
  const [thread, setThread] = useState<{ jobId: number; applicationId: number } | null>(null)
  const [reviewAppId, setReviewAppId] = useState<number | null>(null)
  const [dismissedReviews, setDismissedReviews] = useState<Record<number, true>>({})
  const [matrices, setMatrices] = useState<Record<number, ReviewMatrix>>({})
  const [verifyOpen, setVerifyOpen] = useState(false)

  const refresh = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    const data = await getClientApplications(token)
    setJobs(data)
    setLoaded(true)
  }, [getToken])

  // Poll only while this tab is visible, and refresh once when it becomes visible again.
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

  // Review matrices for completed hires, so the review cards and the prompt know each side's state.
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
      const results = await Promise.all(
        toLoad.map(async (app) => [app.id, await getApplicationReviews(app.id, token)] as const)
      )
      setMatrices((current) => {
        const next = { ...current }
        for (const [id, matrix] of results) if (matrix) next[id] = matrix
        return next
      })
    })()
  }, [sortedJobs, getToken])

  // A completed task with no review from the client asks for one, unless it was dismissed with "Later".
  const reviewPrompt = useMemo(() => {
    if (reviewAppId !== null) return null
    for (const job of sortedJobs) {
      const hired = hiredOf(job)
      if (!hired || hired.status !== "completed") continue
      if (dismissedReviews[hired.id]) continue
      const matrix = matrices[hired.id]
      if (matrix && !matrix.clientToFreelancer) return hired
    }
    return null
  }, [sortedJobs, matrices, reviewAppId, dismissedReviews])

  useEffect(() => {
    if (reviewPrompt) setReviewAppId(reviewPrompt.id)
  }, [reviewPrompt])

  const reviewTarget = useMemo(() => {
    if (reviewAppId === null) return null
    for (const job of sortedJobs) {
      const hired = hiredOf(job)
      if (hired && hired.id === reviewAppId) return { application: hired, job }
    }
    return null
  }, [reviewAppId, sortedJobs])

  const threadTarget = useMemo(() => {
    if (!thread) return null
    const job = sortedJobs.find((item) => item.id === thread.jobId)
    const application = job?.applications.find((app) => app.id === thread.applicationId)
    return job && application ? { job, application } : null
  }, [thread, sortedJobs])

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

  // This side confirms the work is finished. The task completes only once the
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
    () => sortedJobs.flatMap((job) => job.applications.map((app) => ({ app, job, status: taskStatusOf(job) }))),
    [sortedJobs]
  )

  const displayName = user?.fullName || user?.firstName || ""
  const firstName = firstNameOf(displayName) || "there"
  const initials = initialsOf(displayName || "U")
  const accountEmail = user?.primaryEmailAddress?.emailAddress ?? ""
  const emailConfirmed = user?.primaryEmailAddress?.verification?.status === "verified"
  const verified = VERIFICATION_STATUS === "verified"
  const pending = VERIFICATION_STATUS === "pending"

  const navItems: { id: View; label: string; icon: LucideIcon; badge: number | string | null; badgeBg: string }[] = [
    { id: "tasks", label: "My tasks", icon: ClipboardList, badge: sortedJobs.length || null, badgeBg: "var(--ink-400)" },
    { id: "offers", label: "Offers", icon: Inbox, badge: pendingOffers || null, badgeBg: GREEN },
    {
      id: "verify",
      label: "Verification",
      icon: ShieldCheck,
      badge: verified ? null : "!",
      badgeBg: pending ? "#C98A1B" : "#C2410C",
    },
  ]

  const documentStatus = verified ? "Done" : pending ? "In review" : "Required"
  const verifyRows = [
    {
      icon: Mail,
      label: "Email address",
      hint: accountEmail || "No email on this account",
      status: emailConfirmed ? "Done" : "Required",
      ok: emailConfirmed,
      pend: false,
    },
    { icon: IdCard, label: "National ID or passport", hint: "Photo of the bio page", status: documentStatus, ok: verified, pend: pending },
    { icon: ScanFace, label: "Live selfie", hint: "Matched to your document", status: documentStatus, ok: verified, pend: pending },
  ].map((row) => ({
    ...row,
    iconBg: row.ok ? "#F1F8EF" : "var(--ink-100)",
    iconColor: row.ok ? GREEN : "var(--fg-2)",
    statusColor: row.ok ? GREEN : row.pend ? "#9A6A12" : "#C2410C",
  }))

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
              <span style={sx("position:relative;width:32px;height:32px;border-radius:50%;background:var(--ink-950);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 13px/1 var(--font-sans)")}>
                {initials}
                {verified ? (
                  <span style={sx("position:absolute;right:-4px;bottom:-4px;display:inline-flex;color:#108600;background:var(--white);border-radius:50%")}>
                    <Icon icon={BadgeCheck} size={14} />
                  </span>
                ) : null}
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
                style={{ ...NAV_ITEM_BASE, background: active ? "var(--ink-100)" : "transparent", color: active ? "var(--fg-1)" : "var(--fg-2)" }}
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
          <div style={DIVIDER} />
          {SITE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === "/dashboard" ? "page" : undefined}
              className="qh-acc-nav"
              style={{ ...NAV_ITEM_BASE, color: "var(--fg-2)", textDecoration: "none" }}
            >
              <Icon icon={link.icon} />
              <span style={sx("flex:1")}>{link.label}</span>
            </Link>
          ))}
          <div style={DIVIDER} />
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
          {view !== "verify" && !verified ? (
            <div style={sx("display:flex;flex-wrap:wrap;align-items:center;gap:20px;padding:24px;border-radius:var(--radius-xl);background:var(--ink-950);color:var(--white)")}>
              <span style={sx("width:52px;height:52px;border-radius:var(--radius-lg);background:rgba(255,255,255,.08);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:#7BD96B")}>
                {pending ? (
                  <Icon icon={Hourglass} size={22} />
                ) : (
                  <Icon icon={ShieldAlert} size={22} />
                )}
              </span>
              <div style={sx("flex:1 1 320px")}>
                <div style={sx("font:500 18px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>
                  {pending ? "We're reviewing your documents" : "Verify your identity to hire specialists"}
                </div>
                <div style={sx("font:var(--text-small);color:rgba(255,255,255,.62);margin-top:6px;text-wrap:pretty")}>
                  {pending
                    ? "This usually takes a few minutes. You can keep chatting with specialists in the meantime."
                    : "For everyone's safety, we need a photo of your national ID or passport and a quick live selfie."}
                </div>
              </div>
              {pending ? (
                <span style={sx("display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 14px;border-radius:999px;background:rgba(255,255,255,.08);font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase")}>
                  <span style={sx("width:6px;height:6px;border-radius:50%;background:#F5B544;animation:qhPulse 1.4s ease-in-out infinite")} />
                  In review
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setVerifyOpen(true)}
                  className="qh-acc-inverse qh-acc-press"
                  style={sx("height:40px;padding:0 18px;border:0;border-radius:999px;background:var(--white);color:var(--fg-1);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px")}
                >
                  Verify now
                  <Icon icon={ArrowRight} size={16} />
                </button>
              )}
            </div>
          ) : null}

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
                  <div style={sx("color:var(--fg-2);max-width:340px")}>Post what you need done and specialists in that trade will send you offers.</div>
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
                      const look = statusLookOf(job)
                      const hired = hiredOf(job)
                      const count = job.applications.length
                      const meta =
                        status === "open"
                          ? count
                            ? `${count} offer${count === 1 ? "" : "s"}`
                            : "No offers yet"
                          : hired
                            ? `With ${firstNameOf(hired.freelancerName)}`
                            : ""
                      const ring = job.id === selected.id ? "inset 0 0 0 1.5px var(--ink-950)" : "var(--shadow-hairline)"
                      return (
                        <button key={job.id} type="button" onClick={() => setSelectedId(job.id)} className="qh-acc-card" style={{ ...TASK_CARD, boxShadow: ring }}>
                          <div style={sx("display:flex;justify-content:space-between;align-items:center;gap:12px")}>
                            <span style={sx("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>
                              {job.serviceType}
                            </span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: look.color }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: look.color }} />
                              {look.label}
                            </span>
                          </div>
                          <div style={sx("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>{taskTitleOf(job)}</div>
                          <div style={sx("display:flex;justify-content:space-between;gap:12px;font:var(--text-small);color:var(--fg-2)")}>
                            <span style={sx("display:inline-flex;align-items:center;gap:6px;min-width:0")}>
                              <Icon icon={Calendar} size={13} />
                              <span style={sx("white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{whenLabel(job.startDate, job.endDate)}</span>
                            </span>
                            <span style={sx("white-space:nowrap")}>{meta}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <AccountTaskDetail
                    key={selected.id}
                    job={selected}
                    status={selectedStatus}
                    hired={selectedHired}
                    matrix={selectedHired ? matrices[selectedHired.id] ?? null : null}
                    busyId={busyId}
                    verified={verified}
                    onHire={(app) => setStatus(app, "accepted")}
                    onDecline={(app) => setStatus(app, "rejected")}
                    onComplete={(app) => confirmDone(app)}
                    onMessage={(app) => setThread({ jobId: selected.id, applicationId: app.id })}
                    onReview={() => setReviewAppId(selectedHired?.id ?? null)}
                  />
                </div>
              ) : null}
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
                        {app.freelancerName} <span style={sx("color:var(--fg-3);font-weight:400")}>for</span> {taskTitleOf(job)}
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
                {allOffers.length === 0 ? <div style={sx("padding:40px;text-align:center;color:var(--fg-3)")}>No offers yet.</div> : null}
              </div>
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
                {verifyRows.map((row) => (
                  <div key={row.label} style={sx("display:flex;align-items:center;gap:16px;padding:22px 24px;border-bottom:1px solid var(--border-hairline)")}>
                    <span style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: row.iconBg, color: row.iconColor, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon icon={row.icon} size={18} />
                    </span>
                    <div style={sx("flex:1;min-width:0")}>
                      <div style={sx("font:500 15px/1.3 var(--font-sans)")}>{row.label}</div>
                      <div style={sx("font:var(--text-small);color:var(--fg-3);margin-top:4px;overflow:hidden;text-overflow:ellipsis")}>{row.hint}</div>
                    </div>
                    <span style={{ font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase", color: row.statusColor }}>
                      {row.status}
                    </span>
                  </div>
                ))}
                <div style={sx("padding:20px 24px;display:flex;justify-content:flex-end")}>
                  {verified ? (
                    <span style={sx("display:inline-flex;align-items:center;gap:8px;font:500 14px/1 var(--font-sans);color:#0D6E00")}>
                      <Icon icon={BadgeCheck} size={16} />
                      You&apos;re verified
                    </span>
                  ) : pending ? null : (
                    <button type="button" onClick={() => setVerifyOpen(true)} className="qh-acc-green qh-acc-press" style={PILL_BUTTON_GREEN}>
                      Start verification
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {threadTarget ? (
        <AccountThreadModal
          key={threadTarget.application.id}
          job={threadTarget.job}
          application={threadTarget.application}
          verified={verified}
          hiring={busyId === threadTarget.application.id}
          onHire={() => setStatus(threadTarget.application, "accepted")}
          onClose={() => setThread(null)}
        />
      ) : null}

      {verifyOpen ? <AccountVerifyModal onClose={() => setVerifyOpen(false)} /> : null}

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
