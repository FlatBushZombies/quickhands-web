"use client"

import { Eyebrow, G, G_TINT, Ico, Ix, css } from "@/components/pro-account/ui"
import { formatRange, initials, shortName, type ProfessionCategory } from "@/components/pro-account/professions"
import { timeAgo } from "@/components/app-shell/feed"
import type { Application, ReviewMatrix } from "@/lib/applications-api"
import type { RecommendedJob } from "@/lib/jobs-api"
import type { ExperienceEntry } from "@/lib/user-api"

const EM = `font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-0.02em;color:${G}`
const H1 = "font:var(--text-h1);font-size:clamp(36px,4.4vw,52px);letter-spacing:var(--ls-heading);margin:12px 0 0"
const PRIMARY_PILL = `height:48px;padding:0 22px;border:0;border-radius:999px;background:${G};color:var(--white);font:500 15px/1 var(--font-sans);cursor:pointer`
const CARD = "border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)"
const EMPTY = "padding:48px 32px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline);text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px"
const IMAGE_RE = /\.(png|jpe?g|webp|gif)(\?|$)/i

function Money({ value, label, size = 24 }: { value: string; label: string; size?: number }) {
  return (
    <div style={css("text-align:right")}>
      <div style={css(`font:500 ${size}px/1 var(--font-sans);letter-spacing:var(--ls-heading);font-variant-numeric:tabular-nums`)}>{value}</div>
      <div style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3);margin-top:6px")}>{label}</div>
    </div>
  )
}

function MatchTag() {
  return (
    <span style={css(`display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;background:${G_TINT};color:${G}`)}>
      Matches your skills
    </span>
  )
}

function Heading({ title, count }: { title: string; count?: number | string }) {
  return (
    <h2 style={css("font:var(--text-h4);letter-spacing:var(--ls-tight);margin:0")}>
      {title} {count !== undefined ? <span style={css("color:var(--fg-3);font-weight:400")}>{count}</span> : null}
    </h2>
  )
}

/* ───────────── Overview ───────────── */

export interface SetupStep {
  icon: string
  label: string
  hint: string
  done: boolean
  doneLabel: string
  cta: string
  optional?: boolean
  act: () => void
}

export function OverviewView({
  firstName,
  setupSteps,
  setupDone,
  setupTotal,
  activeCount,
  activeTitle,
  activeSub,
  previewJobs,
  newJobCount,
  hasProfession,
  onGoJobs,
  onGoMine,
  onOpenJob,
  onAddProfession,
}: {
  firstName: string
  setupSteps: SetupStep[]
  setupDone: number
  setupTotal: number
  activeCount: number
  activeTitle: string
  activeSub: string
  previewJobs: { job: RecommendedJob; applied: boolean }[]
  newJobCount: number
  hasProfession: boolean
  onGoJobs: () => void
  onGoMine: () => void
  onOpenJob: (job: RecommendedJob) => void
  onAddProfession: () => void
}) {
  const setupIncomplete = setupDone < setupTotal
  const firstTodo = setupSteps.findIndex((s) => !s.done)
  return (
    <div style={css("display:flex;flex-direction:column;gap:32px")}>
      <div>
        <span style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>
          Welcome, {firstName}
        </span>
        <h1 style={css(H1)}>
          {setupIncomplete ? "Let's finish your" : "You're all"} <em style={css(EM)}>{setupIncomplete ? "account" : "set"}</em>.
        </h1>
      </div>

      {setupIncomplete ? (
        <div style={css(`${CARD};overflow:hidden`)}>
          <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:22px 24px;border-bottom:1px solid var(--border-hairline)")}>
            <div>
              <div style={css("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>Finish setting up your account</div>
              <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>
                Complete these steps to start receiving and applying for tasks.
              </div>
            </div>
            <div style={css("display:flex;align-items:center;gap:12px")}>
              <div style={css("width:120px;height:4px;border-radius:999px;background:var(--ink-100)")}>
                <div style={css(`height:4px;border-radius:999px;width:${(setupDone / setupTotal) * 100}%;background:${G};transition:width var(--dur-base) var(--ease-out)`)} />
              </div>
              <span style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);color:var(--fg-3);font-variant-numeric:tabular-nums")}>
                {setupDone} / {setupTotal}
              </span>
            </div>
          </div>
          {setupSteps.map((s, i) => {
            const isFirstTodo = i === firstTodo
            return (
              <div key={s.label} style={css("display:flex;align-items:center;gap:16px;padding:20px 24px;border-bottom:1px solid var(--border-hairline)")}>
                <span style={css(`width:44px;height:44px;border-radius:var(--radius-md);background:${s.done ? G_TINT : "var(--ink-100)"};color:${s.done ? G : "var(--fg-2)"};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0`)}>
                  <Ico name={s.icon} size={18} />
                </span>
                <div style={css("flex:1;min-width:0")}>
                  <div style={css("display:flex;align-items:center;gap:8px;font:500 15px/1.3 var(--font-sans)")}>
                    {s.label}
                    {s.optional ? (
                      <span style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>Optional</span>
                    ) : null}
                  </div>
                  <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px;text-wrap:pretty")}>{s.hint}</div>
                </div>
                {s.done ? (
                  <span style={css(`display:inline-flex;align-items:center;gap:6px;font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:${G}`)}>
                    <Ico name="check" size={14} />
                    {s.doneLabel}
                  </span>
                ) : (
                  <Ix
                    onClick={s.act}
                    base={`height:38px;padding:0 16px;border:0;border-radius:999px;background:${isFirstTodo ? G : "var(--white)"};color:${isFirstTodo ? "var(--white)" : "var(--fg-1)"};box-shadow:${isFirstTodo ? "none" : "inset 0 0 0 1px var(--border-default)"};font:500 14px/1 var(--font-sans);cursor:pointer;white-space:nowrap`}
                    active="transform:scale(0.98)"
                  >
                    {s.cta}
                  </Ix>
                )}
              </div>
            )
          })}
        </div>
      ) : null}

      {activeCount > 0 ? (
        <Ix
          onClick={onGoMine}
          base="display:flex;align-items:center;gap:16px;padding:20px 22px;border:0;border-radius:var(--radius-xl);background:var(--ink-950);color:var(--white);text-align:left;cursor:pointer"
          active="transform:scale(0.99)"
        >
          <span style={css("width:44px;height:44px;border-radius:var(--radius-md);background:rgba(255,255,255,.08);color:#AFC0F5;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0")}>
            <Ico name="briefcase" size={20} />
          </span>
          <span style={css("flex:1;min-width:0")}>
            <span style={css("display:block;font:500 16px/1.3 var(--font-sans)")}>{activeTitle}</span>
            <span style={css("display:block;font:var(--text-small);color:rgba(255,255,255,.62);margin-top:4px")}>{activeSub}</span>
          </span>
          <Ico name="arrow-right" size={16} />
        </Ix>
      ) : null}

      {hasProfession ? (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          <div style={css("display:flex;justify-content:space-between;align-items:baseline;gap:12px")}>
            <h2 style={css("font:var(--text-h4);letter-spacing:var(--ls-tight);margin:0")}>
              New jobs for you <span style={css("color:var(--fg-3);font-weight:400")}>{newJobCount || ""}</span>
            </h2>
            <Ix
              onClick={onGoJobs}
              base={`border:0;background:transparent;padding:0;font:500 14px/1 var(--font-sans);color:${G};cursor:pointer;display:inline-flex;align-items:center;gap:6px`}
            >
              See all
              <Ico name="arrow-right" size={14} />
            </Ix>
          </div>
          {previewJobs.length === 0 ? (
            <p style={css("margin:0;color:var(--fg-3)")}>No open jobs matching your skills right now.</p>
          ) : null}
          {previewJobs.map(({ job, applied }) => (
            <JobCard key={job.id} job={job} applied={applied} onOpen={() => onOpenJob(job)} compact />
          ))}
        </div>
      ) : (
        <div style={css(EMPTY)}>
          <Ico name="briefcase" size={22} style={`width:52px;height:52px;border-radius:var(--radius-lg);background:${G_TINT};color:${G};display:inline-flex;align-items:center;justify-content:center`} />
          <div style={css("font:500 18px/1.3 var(--font-sans);margin-top:8px")}>Tell us what you do</div>
          <div style={css("color:var(--fg-2);max-width:340px")}>Add your profession and we&apos;ll show you tasks that match your skills.</div>
          <Ix onClick={onAddProfession} base={`${PRIMARY_PILL};margin-top:12px;font-size:15px;height:48px`}>
            Add your profession
          </Ix>
        </div>
      )}
    </div>
  )
}

/* ───────────── Job card (shared by Overview and Jobs) ───────────── */

export function JobCard({
  job,
  applied,
  onOpen,
  compact = false,
}: {
  job: RecommendedJob
  applied: boolean
  onOpen: () => void
  compact?: boolean
}) {
  const eyebrow = job.selectedServices?.[0] || "Job"
  const area = job.location?.label || job.location?.city || "Location not set"
  const budget = job.maxPrice > 0 ? `$${job.maxPrice}` : "Open"
  const budgetLabel = job.maxPrice > 0 ? "Client budget" : "Name your price"
  const offers = job.applicantCount ? `${job.applicantCount} ${job.applicantCount === 1 ? "offer" : "offers"}` : "Be the first to apply"
  const photos = (job.documents ?? []).filter((u) => IMAGE_RE.test(u))
  const btnLabel = applied ? "Applied · view" : "Apply"
  const btnIcon = applied ? "check" : "send"
  const btnBg = applied ? G_TINT : G
  const btnColor = applied ? G : "var(--white)"

  const eyebrowRow = (
    <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:8px;font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>
      <span>{eyebrow}</span>
      <span>·</span>
      <span>{timeAgo(job.createdAt)}</span>
      {job.skillMatch ? <MatchTag /> : null}
    </div>
  )

  if (compact) {
    return (
      <div style={css(`display:flex;flex-wrap:wrap;align-items:center;gap:16px;padding:20px 22px;border-radius:var(--radius-lg);background:var(--white);box-shadow:var(--shadow-hairline)`)}>
        <div style={css("flex:1 1 300px;min-width:0")}>
          {eyebrowRow}
          <div style={css("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight);margin-top:8px")}>{job.serviceType}</div>
          <div style={css("display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:8px;font:var(--text-small);color:var(--fg-2)")}>
            <span style={css("display:inline-flex;align-items:center;gap:6px")}>
              <Ico name="map-pin" size={13} />
              {area}
            </span>
            <span style={css("display:inline-flex;align-items:center;gap:6px")}>
              <Ico name="calendar" size={13} />
              {formatRange(job.startDate, job.endDate)}
            </span>
          </div>
        </div>
        <Money value={budget} label={budgetLabel} size={22} />
        <Ix onClick={onOpen} base={`height:40px;padding:0 18px;border:0;border-radius:999px;background:${btnBg};color:${btnColor};font:500 14px/1 var(--font-sans);cursor:pointer`} active="transform:scale(0.98)">
          {btnLabel}
        </Ix>
      </div>
    )
  }

  return (
    <div style={css(`display:flex;flex-direction:column;gap:14px;padding:22px;border-radius:var(--radius-lg);background:var(--white);box-shadow:var(--shadow-hairline)`)}>
      <div style={css("display:flex;flex-wrap:wrap;align-items:flex-start;gap:16px")}>
        <div style={css("flex:1 1 300px;min-width:0")}>
          {eyebrowRow}
          <div style={css("font:500 18px/1.3 var(--font-sans);letter-spacing:var(--ls-tight);margin-top:8px")}>{job.serviceType}</div>
        </div>
        <Money value={budget} label={budgetLabel} />
      </div>
      {job.additionalInfo ? <p style={css("margin:0;color:var(--fg-2);text-wrap:pretty")}>{job.additionalInfo}</p> : null}
      {photos.length ? (
        <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
          {photos.map((url) => (
            <div
              key={url}
              role="img"
              aria-label="Task photo"
              style={{ width: 72, height: 72, borderRadius: "var(--radius-md)", backgroundColor: "var(--ink-100)", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: `url("${url}")` }}
            />
          ))}
        </div>
      ) : null}
      <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;padding-top:14px;border-top:1px solid var(--border-hairline);font:var(--text-small);color:var(--fg-2)")}>
        <span style={css("display:inline-flex;align-items:center;gap:6px")}>
          <Ico name="map-pin" size={13} />
          {area}
        </span>
        <span style={css("display:inline-flex;align-items:center;gap:6px")}>
          <Ico name="calendar" size={13} />
          {formatRange(job.startDate, job.endDate)}
        </span>
        <span style={css("display:inline-flex;align-items:center;gap:6px")}>
          <Ico name="user-round" size={13} />
          {shortName(job.userName)}
        </span>
        <span style={css("display:inline-flex;align-items:center;gap:6px")}>
          <Ico name="users" size={13} />
          {offers}
        </span>
        <span style={css("flex:1")} />
        <Ix
          onClick={onOpen}
          base={`height:40px;padding:0 18px;border:0;border-radius:999px;background:${btnBg};color:${btnColor};font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px`}
          active="transform:scale(0.98)"
        >
          <Ico name={btnIcon} size={14} />
          {btnLabel}
        </Ix>
      </div>
    </div>
  )
}

/* ───────────── Jobs for you ───────────── */

export function JobsView({
  hasProfession,
  category,
  skills,
  filter,
  onFilter,
  jobs,
  appliedJobIds,
  loaded,
  onOpenJob,
  onAddProfession,
}: {
  hasProfession: boolean
  category: ProfessionCategory | null
  skills: string[]
  filter: string
  onFilter: (f: string) => void
  jobs: RecommendedJob[]
  appliedJobIds: Set<number>
  loaded: boolean
  onOpenJob: (job: RecommendedJob) => void
  onAddProfession: () => void
}) {
  const matches = (job: RecommendedJob, skill: string) =>
    [job.serviceType, ...(job.selectedServices ?? []), job.additionalInfo ?? ""].join(" ").toLowerCase().includes(skill.toLowerCase())
  const feed = filter === "all" ? jobs : jobs.filter((j) => matches(j, filter))
  const filters = [{ id: "all", label: category ? `All ${category.label.toLowerCase()}` : "All jobs" }, ...skills.map((s) => ({ id: s, label: s }))]

  return (
    <div style={css("display:flex;flex-direction:column;gap:24px")}>
      <div>
        <Eyebrow>{category ? `Matched to ${category.role}` : "Matched to your profession"}</Eyebrow>
        <h1 style={css(H1)}>
          Jobs <em style={css(EM)}>near</em> you.
        </h1>
      </div>

      {!hasProfession ? (
        <div style={css(EMPTY)}>
          <Ico name="briefcase" size={22} style={`width:52px;height:52px;border-radius:var(--radius-lg);background:${G_TINT};color:${G};display:inline-flex;align-items:center;justify-content:center`} />
          <div style={css("font:500 18px/1.3 var(--font-sans);margin-top:8px")}>Tell us what you do</div>
          <div style={css("color:var(--fg-2);max-width:340px")}>Add your profession and we&apos;ll show you tasks that match your skills.</div>
          <Ix onClick={onAddProfession} base={`${PRIMARY_PILL};margin-top:12px`}>
            Add your profession
          </Ix>
        </div>
      ) : (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
            {filters.map((f) => {
              const on = filter === f.id
              return (
                <Ix
                  key={f.id}
                  onClick={() => onFilter(f.id)}
                  base={`height:34px;padding:0 14px;border:0;border-radius:999px;background:${on ? "var(--ink-950)" : "var(--white)"};color:${on ? "var(--white)" : "var(--fg-1)"};box-shadow:${on ? "none" : "inset 0 0 0 1px var(--border-default)"};font:500 13px/1 var(--font-sans);cursor:pointer`}
                >
                  {f.label}
                </Ix>
              )
            })}
          </div>
          {feed.map((job) => (
            <JobCard key={job.id} job={job} applied={appliedJobIds.has(job.id)} onOpen={() => onOpenJob(job)} />
          ))}
          {loaded && feed.length === 0 ? (
            <div style={css("padding:40px;text-align:center;color:var(--fg-3)")}>
              No open jobs for this skill right now. We&apos;ll notify you when one is posted.
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

/* ───────────── My jobs ───────────── */

function ApplicationRow({ app, onOpen }: { app: Application; onOpen: () => void }) {
  const status = app.status === "rejected" ? "Declined" : "Sent"
  return (
    <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;padding:18px 22px;border-bottom:1px solid var(--border-hairline)")}>
      <div style={css("flex:1 1 240px;min-width:0")}>
        <div style={css("font:500 15px/1.3 var(--font-sans)")}>{app.job?.serviceType || "Job"}</div>
        <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>
          {shortName(app.job?.clientName)} · sent {timeAgo(app.createdAt)}
        </div>
      </div>
      <span style={css(`display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:999px;background:var(--ink-100);color:var(--fg-2);font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase`)}>
        {status}
      </span>
      <span style={css("font:500 17px/1 var(--font-sans);font-variant-numeric:tabular-nums;min-width:56px;text-align:right")}>{app.quotation || ""}</span>
      <Ix
        onClick={onOpen}
        base="height:36px;padding:0 14px;border:0;border-radius:999px;background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);color:var(--fg-1);font:500 13px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:6px"
        hover="background:var(--ink-50)"
      >
        <Ico name="message-square" size={13} />
        View
      </Ix>
    </div>
  )
}

/** Accepted, or marked complete by the client but not yet confirmed by the specialist. */
export function isInProgress(a: Application) {
  return a.status === "accepted" || (a.status === "completed" && !a.completion?.freelancerConfirmed)
}

/** Both the specialist and the client have confirmed the job is finished. */
export function isJobDone(a: Application) {
  return Boolean(a.completion?.freelancerConfirmed && a.completion?.clientConfirmed)
}

export function MyJobsView({
  applications,
  matrices,
  onOpenThread,
  onReview,
  onBrowse,
  onConfirm,
  confirmingId,
  confirmError,
}: {
  applications: Application[]
  matrices: Record<number, ReviewMatrix | null>
  onOpenThread: (app: Application) => void
  onReview: (app: Application) => void
  onBrowse: () => void
  onConfirm: (app: Application) => void
  confirmingId: number | null
  confirmError: string | null
}) {
  const active = applications.filter(isInProgress)
  const applied = applications.filter((a) => a.status === "pending" || a.status === "rejected")
  const done = applications.filter(isJobDone)
  const empty = applications.length === 0

  return (
    <div style={css("display:flex;flex-direction:column;gap:40px")}>
      <div>
        <Eyebrow>Your work</Eyebrow>
        <h1 style={css(H1)}>
          My <em style={css(EM)}>jobs</em>.
        </h1>
      </div>

      {empty ? (
        <div style={css(EMPTY)}>
          <Ico name="send" size={22} style={`width:52px;height:52px;border-radius:var(--radius-lg);background:${G_TINT};color:${G};display:inline-flex;align-items:center;justify-content:center`} />
          <div style={css("font:500 18px/1.3 var(--font-sans);margin-top:8px")}>No jobs yet</div>
          <div style={css("color:var(--fg-2);max-width:360px")}>
            Apply to tasks that match your skills. When a client hires you, the job appears here.
          </div>
          <Ix onClick={onBrowse} base={`${PRIMARY_PILL};margin-top:12px`}>
            Browse jobs
          </Ix>
        </div>
      ) : null}

      {active.length > 0 ? (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          <Heading title="In progress" count={active.length} />
          {active.map((a) => (
            <div key={a.id} style={css(`display:flex;flex-direction:column;gap:18px;padding:24px;border-radius:var(--radius-xl);background:var(--white);box-shadow:inset 0 0 0 1.5px ${G},var(--shadow-sm)`)}>
              <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:flex-start")}>
                <div style={css("min-width:0")}>
                  <div style={css(`font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:${G};display:inline-flex;align-items:center;gap:6px`)}>
                    <Ico name="lock-open" size={13} />
                    Hired · message in app
                  </div>
                  <div style={css("font:var(--text-h4);letter-spacing:var(--ls-tight);margin-top:10px")}>{a.job?.serviceType || "Job"}</div>
                  <div style={css("display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:8px;font:var(--text-small);color:var(--fg-2)")}>
                    <span style={css("display:inline-flex;align-items:center;gap:6px")}>
                      <Ico name="calendar" size={13} />
                      {formatRange(a.job?.startDate ?? null, a.job?.endDate ?? null)}
                    </span>
                  </div>
                </div>
                <Money value={a.quotation || "—"} label="Agreed price" />
              </div>
              <div style={css("display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--border-hairline)")}>
                <span style={css("width:40px;height:40px;border-radius:50%;background:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 13px/1 var(--font-sans);flex-shrink:0")}>
                  {initials(a.job?.clientName)}
                </span>
                <div style={css("flex:1;min-width:0")}>
                  <div style={css("font:500 15px/1.3 var(--font-sans)")}>{a.job?.clientName || "Client"}</div>
                  <div style={css("font:var(--text-small);color:var(--fg-3)")}>Client</div>
                </div>
                <Ix
                  onClick={() => onOpenThread(a)}
                  base="height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);color:var(--fg-1);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px"
                  hover="background:var(--ink-50)"
                >
                  <Ico name="message-square" size={14} />
                  Message
                </Ix>
              </div>
              <div style={css("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
                <div style={css("font:500 16px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>Is the job done?</div>
                <div style={css("font:var(--text-small);color:var(--fg-2);margin-top:4px;text-wrap:pretty")}>
                  When you both confirm, the task moves to completed.
                </div>
                {a.completion?.freelancerConfirmed ? (
                  <div style={css("display:flex;align-items:center;gap:10px;margin-top:16px;font:var(--text-small);color:var(--fg-2)")}>
                    <span style={css(`width:14px;height:14px;border-radius:50%;border:1.5px solid var(--ink-200);border-top-color:${G};animation:qhSpin 900ms linear infinite;flex-shrink:0`)} />
                    Waiting for the client
                  </div>
                ) : (
                  <div style={css("margin-top:16px")}>
                    {a.completion?.clientConfirmed ? (
                      <p style={css("margin:0 0 12px;font:var(--text-small);color:var(--fg-2)")}>
                        The client has marked this job complete. Confirm to finish it.
                      </p>
                    ) : null}
                    <Ix
                      disabled={confirmingId === a.id}
                      onClick={() => onConfirm(a)}
                      base={`height:44px;padding:0 20px;border:0;border-radius:999px;background:${G};color:var(--white);font:500 14px/1 var(--font-sans);cursor:${confirmingId === a.id ? "default" : "pointer"};display:inline-flex;align-items:center;gap:8px`}
                      hover="background:#142C7A"
                      active="transform:scale(0.98)"
                    >
                      <Ico name="check" size={15} />
                      {confirmingId === a.id ? "Confirming…" : "Confirm completion"}
                    </Ix>
                    {confirmError && confirmingId === null ? (
                      <p style={css("margin:12px 0 0;font:var(--text-small);color:var(--danger-600)")}>{confirmError}</p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {applied.length > 0 ? (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          <Heading title="Applications" count={applied.length} />
          <div style={css(`border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline);overflow:hidden`)}>
            {applied.map((a) => (
              <ApplicationRow key={a.id} app={a} onOpen={() => onOpenThread(a)} />
            ))}
          </div>
        </div>
      ) : null}

      {done.length > 0 ? (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          <Heading title="Completed" count={done.length} />
          {done.map((c) => {
            const m = matrices[c.id] ?? null
            const counterpart = c.job?.clientName || "Client"
            const theirs = m?.clientToFreelancer ?? null
            const mine = m?.freelancerToClient ?? null
            const canReview = m ? m.canFreelancerReview : true
            return (
              <div key={c.id} style={css("display:flex;flex-direction:column;gap:18px;padding:24px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)")}>
                <div style={css("display:flex;align-items:center;gap:14px")}>
                  <span style={css(`width:44px;height:44px;border-radius:50%;background:${G};color:var(--white);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0`)}>
                    <Ico name="check" size={20} />
                  </span>
                  <div style={css("min-width:0")}>
                    <div style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>Completed</div>
                    <div style={css("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight);margin-top:4px")}>{c.job?.serviceType || "Job"}</div>
                    <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>
                      {shortName(counterpart)} · {new Date(c.updatedAt).toLocaleDateString()} · {c.quotation || ""}
                    </div>
                  </div>
                </div>
                <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px")}>
                  <div style={css("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
                    <div style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>
                      Your review of {shortName(counterpart)}
                    </div>
                    {mine ? (
                      <>
                        <Stars rating={mine.rating} />
                        <p style={css("margin:10px 0 0;color:var(--fg-2);text-wrap:pretty")}>{mine.comment || "No written review."}</p>
                      </>
                    ) : canReview ? (
                      <Ix
                        onClick={() => onReview(c)}
                        base={`margin-top:12px;height:38px;padding:0 16px;border:0;border-radius:999px;background:${G};color:var(--white);font:500 13px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:6px`}
                      >
                        <Ico name="star" size={13} />
                        Leave a review
                      </Ix>
                    ) : null}
                  </div>
                  <div style={css("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
                    <div style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>
                      {shortName(counterpart)}&apos;s review of you
                    </div>
                    {theirs ? (
                      <>
                        <Stars rating={theirs.rating} />
                        <p style={css("margin:10px 0 0;color:var(--fg-2);text-wrap:pretty")}>{theirs.comment || "No written review."}</p>
                      </>
                    ) : (
                      <p style={css("margin:12px 0 0;font:var(--text-small);color:var(--fg-3)")}>Waiting for their review.</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={css("display:flex;gap:2px;margin-top:12px")}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={css(`font-size:18px;line-height:1;color:${n <= rating ? "var(--ink-950)" : "var(--ink-200)"}`)}>
          ★
        </span>
      ))}
    </div>
  )
}

/* ───────────── Profile ───────────── */

export function ProfileView({
  hasProfession,
  roleTitle,
  skills,
  yearsLabel,
  area,
  experience,
  onEditProfession,
  onAddExperience,
  onRemoveExperience,
}: {
  hasProfession: boolean
  roleTitle: string
  skills: string[]
  yearsLabel: string
  area: string
  experience: ExperienceEntry[]
  onEditProfession: () => void
  onAddExperience: () => void
  onRemoveExperience: (index: number) => void
}) {
  return (
    <div style={css("display:flex;flex-direction:column;gap:24px")}>
      <div>
        <Eyebrow>What clients see</Eyebrow>
        <h1 style={css(H1)}>
          Your <em style={css(EM)}>profile</em>.
        </h1>
      </div>

      <div style={css("padding:28px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)")}>
        <div style={css("display:flex;justify-content:space-between;align-items:center;gap:12px")}>
          <Eyebrow>Profession</Eyebrow>
          <Ix
            onClick={onEditProfession}
            base={`border:0;background:transparent;padding:0;font:500 13px/1 var(--font-sans);color:${G};cursor:pointer`}
          >
            {hasProfession ? "Edit" : "Add"}
          </Ix>
        </div>
        {hasProfession ? (
          <>
            <div style={css("font:var(--text-h3);letter-spacing:var(--ls-heading);margin-top:14px")}>{roleTitle}</div>
            <div style={css("display:flex;flex-wrap:wrap;gap:6px;margin-top:14px")}>
              {skills.map((s) => (
                <span
                  key={s}
                  style={css("display:inline-flex;align-items:center;height:28px;padding:0 12px;border-radius:999px;background:var(--ink-100);font:500 13px/1 var(--font-sans)")}
                >
                  {s}
                </span>
              ))}
            </div>
            <div style={css("display:flex;flex-wrap:wrap;gap:20px;margin-top:16px;font:var(--text-small);color:var(--fg-2)")}>
              <span style={css("display:inline-flex;align-items:center;gap:6px")}>
                <Ico name="award" size={14} />
                {yearsLabel} experience
              </span>
              <span style={css("display:inline-flex;align-items:center;gap:6px")}>
                <Ico name="map-pin" size={14} />
                {area || "Area not set"}
              </span>
            </div>
          </>
        ) : (
          <p style={css("margin:14px 0 0;color:var(--fg-3)")}>Not added yet.</p>
        )}
      </div>

      <div style={css("padding:28px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)")}>
        <div style={css("display:flex;justify-content:space-between;align-items:center;gap:12px")}>
          <Eyebrow>Work experience</Eyebrow>
          <Ix
            onClick={onAddExperience}
            base={`border:0;background:transparent;padding:0;font:500 13px/1 var(--font-sans);color:${G};cursor:pointer;display:inline-flex;align-items:center;gap:4px`}
          >
            <Ico name="plus" size={13} />
            Add
          </Ix>
        </div>
        <div style={css("display:flex;flex-direction:column;margin-top:8px")}>
          {experience.map((x, i) => (
            <div key={`${x.title}-${i}`} style={css("display:flex;gap:16px;padding:18px 0;border-bottom:1px solid var(--border-hairline)")}>
              <span style={css("width:40px;height:40px;border-radius:var(--radius-md);background:var(--ink-100);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0")}>
                <Ico name="briefcase" size={16} />
              </span>
              <div style={css("flex:1;min-width:0")}>
                <div style={css("font:500 15px/1.3 var(--font-sans)")}>{x.title}</div>
                <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>
                  {[x.org, [x.from, x.to || "Present"].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
                </div>
                {x.desc ? <p style={css("margin:8px 0 0;color:var(--fg-2);text-wrap:pretty")}>{x.desc}</p> : null}
              </div>
              <Ix
                aria-label="Remove"
                onClick={() => onRemoveExperience(i)}
                base="align-self:flex-start;width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:var(--fg-3);display:inline-flex;align-items:center;justify-content:center;cursor:pointer"
                hover="background:var(--ink-100);color:var(--fg-1)"
              >
                <Ico name="trash-2" size={14} />
              </Ix>
            </div>
          ))}
          {experience.length === 0 ? <p style={css("margin:6px 0 0;color:var(--fg-3)")}>Nothing added yet.</p> : null}
        </div>
      </div>
    </div>
  )
}

