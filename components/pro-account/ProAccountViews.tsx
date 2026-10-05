"use client"

import type { ReactNode } from "react"
import { Eyebrow, G, G_TINT, Ico, Ix, Tag, css } from "@/components/pro-account/ui"
import { formatRange, firstName, initials, shortName, YEAR_OPTIONS, type ProfessionCategory, type YearValue } from "@/components/pro-account/professions"
import { timeAgo } from "@/components/app-shell/feed"
import type { Application, ReviewMatrix } from "@/lib/applications-api"
import { jobBudget, type RecommendedJob } from "@/lib/jobs-api"
import type { ExperienceEntry } from "@/lib/user-api"

const EM = `font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-0.02em;color:${G}`
const H1 = "font:var(--text-h1);font-size:clamp(36px,4.4vw,52px);letter-spacing:var(--ls-heading);margin:12px 0 0"
const H4 = "font:var(--text-h4);letter-spacing:var(--ls-tight);margin:0"
const CAPTION = "font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)"
const PRIMARY_PILL = `height:48px;padding:0 22px;border:0;border-radius:999px;background:${G};color:var(--white);font:500 15px/1 var(--font-sans);cursor:pointer`
const EMPTY_CARD = "padding:48px 32px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline);text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px"
const IMAGE_RE = /\.(png|jpe?g|webp|gif)(\?|$)/i

export interface SetupStep {
  key: string
  icon: string
  label: string
  hint: string
  done: boolean
  doneLabel: string
  doneIcon: string
  doneColor: string
  cta: string
  /** Steps whose action is not available yet show a disabled button. */
  disabled?: boolean
  optional?: boolean
  act: () => void
}

/** A job is in progress once hired, until the specialist has confirmed it done. */
export function isInProgress(a: Application) {
  return a.status === "accepted" || (a.status === "completed" && !a.completion?.freelancerConfirmed)
}

/** Both the specialist and the client have confirmed the job is finished. */
export function isJobDone(a: Application) {
  return Boolean(a.completion?.freelancerConfirmed && a.completion?.clientConfirmed)
}

export function jobSkill(job: RecommendedJob) {
  return job.selectedServices?.[0] || job.serviceType
}

function jobBudgetText(job: RecommendedJob) {
  const budget = jobBudget(job.maxPrice)
  return {
    value: budget !== null ? `$${budget}` : "Open",
    label: budget !== null ? "Client budget" : "Name your price",
  }
}

function jobArea(job: RecommendedJob) {
  return job.location?.label || job.location?.city || "Location not set"
}

function offersText(count: number) {
  return count ? `${count} ${count === 1 ? "offer" : "offers"}` : "Be the first to apply"
}

/** Stars drawn in the design's ink tones: filled ink for each rated star. */
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

function PageTitle({ eyebrow, title, em, after = "" }: { eyebrow: string; title: ReactNode; em?: string; after?: string }) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 style={css(H1)}>
        {title}
        {em ? (
          <>
            {" "}
            <em style={css(EM)}>{em}</em>
          </>
        ) : null}
        {after}
      </h1>
    </div>
  )
}

function Money({ value, label, size = 24 }: { value: string; label: string; size?: number }) {
  return (
    <div style={css("text-align:right")}>
      <div style={css(`font:500 ${size}px/1 var(--font-sans);letter-spacing:var(--ls-heading);font-variant-numeric:tabular-nums`)}>{value}</div>
      <div style={css(`${CAPTION};margin-top:6px`)}>{label}</div>
    </div>
  )
}

/* ───────────── Overview ───────────── */

export function OverviewView({
  firstName: first,
  steps,
  doneCount,
  totalSteps,
  hasProfession,
  activeCount,
  activeTitle,
  previewJobs,
  newJobCount,
  onGoJobs,
  onGoMine,
  onOpenJob,
}: {
  firstName: string
  steps: SetupStep[]
  doneCount: number
  totalSteps: number
  hasProfession: boolean
  activeCount: number
  activeTitle: string
  previewJobs: RecommendedJob[]
  newJobCount: number
  onGoJobs: () => void
  onGoMine: () => void
  onOpenJob: (job: RecommendedJob) => void
}) {
  const setupIncomplete = doneCount < totalSteps
  const firstTodo = steps.findIndex((s) => !s.done && !s.disabled)

  return (
    <div style={css("display:flex;flex-direction:column;gap:32px")}>
      <div>
        <span style={css(CAPTION)}>Welcome, {first}</span>
        <h1 style={css(`${H1};font-size:clamp(36px,4.4vw,52px)`)}>
          {setupIncomplete ? "Let's finish your" : "You're all"} <em style={css(EM)}>{setupIncomplete ? "account" : "set"}</em>.
        </h1>
      </div>

      {setupIncomplete ? (
        <div style={css("border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline);overflow:hidden")}>
          <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:22px 24px;border-bottom:1px solid var(--border-hairline)")}>
            <div>
              <div style={css("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>Finish setting up your account</div>
              <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>
                Complete these steps to start receiving and applying for tasks.
              </div>
            </div>
            <div style={css("display:flex;align-items:center;gap:12px")}>
              <div style={css("width:120px;height:4px;border-radius:999px;background:var(--ink-100)")}>
                <div style={css(`height:4px;border-radius:999px;width:${(doneCount / totalSteps) * 100}%;background:${G};transition:width var(--dur-base) var(--ease-out)`)} />
              </div>
              <span style={css(`${CAPTION};font-variant-numeric:tabular-nums`)}>
                {doneCount} / {totalSteps}
              </span>
            </div>
          </div>
          {steps.map((s, i) => {
            const todo = !s.done
            const primary = i === firstTodo
            return (
              <div key={s.key} style={css("display:flex;align-items:center;gap:16px;padding:20px 24px;border-bottom:1px solid var(--border-hairline)")}>
                <span
                  style={css(
                    `width:44px;height:44px;border-radius:var(--radius-md);background:${s.done ? G_TINT : "var(--ink-100)"};color:${s.done ? G : "var(--fg-2)"};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0`
                  )}
                >
                  <Ico name={s.icon} size={18} />
                </span>
                <div style={css("flex:1;min-width:0")}>
                  <div style={css("display:flex;align-items:center;gap:8px;font:500 15px/1.3 var(--font-sans)")}>
                    {s.label}
                    {s.optional ? <span style={css(CAPTION)}>Optional</span> : null}
                  </div>
                  <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px;text-wrap:pretty")}>{s.hint}</div>
                </div>
                {s.done ? (
                  <span style={css(`display:inline-flex;align-items:center;gap:6px;${CAPTION};color:${s.doneColor}`)}>
                    <Ico name={s.doneIcon} size={14} />
                    {s.doneLabel}
                  </span>
                ) : null}
                {todo ? (
                  <button
                    type="button"
                    onClick={s.act}
                    disabled={s.disabled}
                    style={css(
                      `height:38px;padding:0 16px;border:0;border-radius:999px;background:${s.disabled ? "var(--ink-100)" : primary ? G : "var(--white)"};color:${s.disabled ? "var(--fg-3)" : primary ? "var(--white)" : "var(--fg-1)"};box-shadow:${primary && !s.disabled ? "none" : "inset 0 0 0 1px var(--border-default)"};font:500 14px/1 var(--font-sans);cursor:${s.disabled ? "not-allowed" : "pointer"};white-space:nowrap`
                    )}
                  >
                    {s.cta}
                  </button>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}

      {activeCount > 0 ? (
        <Ix
          onClick={onGoMine}
          base="display:flex;align-items:center;gap:16px;padding:20px 22px;border:0;border-radius:var(--radius-xl);background:var(--ink-950);color:var(--white);text-align:left;cursor:pointer;width:100%"
          active="transform:scale(0.99)"
        >
          <span style={css("width:44px;height:44px;border-radius:var(--radius-md);background:rgba(255,255,255,.08);color:#AFC0F5;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0")}>
            <Ico name="briefcase" size={20} />
          </span>
          <span style={css("flex:1;min-width:0")}>
            <span style={css("display:block;font:500 16px/1.3 var(--font-sans)")}>{activeTitle}</span>
            <span style={css("display:block;font:var(--text-small);color:rgba(255,255,255,.62);margin-top:4px")}>
              Message the client in QuickHands or mark the job complete from My jobs.
            </span>
          </span>
          <Ico name="arrow-right" size={16} />
        </Ix>
      ) : null}

      {hasProfession ? (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          <div style={css("display:flex;justify-content:space-between;align-items:baseline;gap:12px")}>
            <h2 style={css(H4)}>
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
            <div style={css("padding:24px;border-radius:var(--radius-lg);background:var(--white);box-shadow:var(--shadow-hairline);color:var(--fg-3);font:var(--text-small)")}>
              No open jobs for your profession right now. Check back soon.
            </div>
          ) : null}
          {previewJobs.map((job) => (
            <OverviewJobCard key={job.id} job={job} onOpen={() => onOpenJob(job)} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function OverviewJobCard({ job, onOpen }: { job: RecommendedJob; onOpen: () => void }) {
  const budget = jobBudgetText(job)
  return (
    <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:16px;padding:20px 22px;border-radius:var(--radius-lg);background:var(--white);box-shadow:var(--shadow-hairline)")}>
      <div style={css("flex:1 1 300px;min-width:0")}>
        <div style={css(`${CAPTION};display:flex;flex-wrap:wrap;align-items:center;gap:8px`)}>
          <span>{jobSkill(job)}</span>
          <span>·</span>
          <span>{timeAgo(job.createdAt)}</span>
          {job.skillMatch ? <MatchTag /> : null}
        </div>
        <div style={css("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight);margin-top:8px")}>{job.serviceType}</div>
        <div style={css("display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:8px;font:var(--text-small);color:var(--fg-2)")}>
          <span style={css("display:inline-flex;align-items:center;gap:6px")}>
            <Ico name="map-pin" size={13} />
            {jobArea(job)}
          </span>
          <span style={css("display:inline-flex;align-items:center;gap:6px")}>
            <Ico name="calendar" size={13} />
            {formatRange(job.startDate, job.endDate)}
          </span>
        </div>
      </div>
      <Money value={budget.value} label={budget.label} size={22} />
      <Ix
        onClick={onOpen}
        base={`height:40px;padding:0 18px;border:0;border-radius:999px;background:${G};color:var(--white);font:500 14px/1 var(--font-sans);cursor:pointer`}
        active="transform:scale(0.98)"
      >
        Apply
      </Ix>
    </div>
  )
}

function MatchTag() {
  return <span style={css(`display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;background:${G_TINT};color:${G}`)}>Matches your skills</span>
}

/* ───────────── Jobs for you ───────────── */

export function JobsView({
  hasProfession,
  category,
  filter,
  onFilter,
  jobs,
  appliedJobIds,
  onOpenJob,
  onAddProfession,
}: {
  hasProfession: boolean
  category: ProfessionCategory | null
  filter: string
  onFilter: (f: string) => void
  jobs: RecommendedJob[]
  appliedJobIds: Set<number>
  onOpenJob: (job: RecommendedJob) => void
  onAddProfession: () => void
}) {
  const feed = filter === "all" ? jobs : jobs.filter((j) => j.serviceType === filter || j.selectedServices?.includes(filter))
  const chips = category ? [{ id: "all", label: `All ${category.label.toLowerCase()}` }, ...category.subs.map((s) => ({ id: s, label: s }))] : []

  return (
    <div style={css("display:flex;flex-direction:column;gap:24px")}>
      <div>
        <Eyebrow>{category ? `Matched to ${category.role}` : "Matched to your profession"}</Eyebrow>
        <h1 style={css(H1)}>
          Jobs <em style={css(EM)}>near</em> you.
        </h1>
      </div>

      {!hasProfession ? (
        <div style={css(EMPTY_CARD)}>
          <span style={css(`width:52px;height:52px;border-radius:var(--radius-lg);background:${G_TINT};color:${G};display:inline-flex;align-items:center;justify-content:center`)}>
            <Ico name="briefcase" size={22} />
          </span>
          <div style={css("font:500 18px/1.3 var(--font-sans);margin-top:8px")}>Tell us what you do</div>
          <div style={css("color:var(--fg-2);max-width:340px")}>Add your profession and we&apos;ll show you tasks that match your skills.</div>
          <button type="button" onClick={onAddProfession} style={css(`${PRIMARY_PILL};margin-top:12px;height:48px`)}>
            Add your profession
          </button>
        </div>
      ) : (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
            {chips.map((c) => {
              const on = filter === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onFilter(c.id)}
                  style={css(
                    `height:34px;padding:0 14px;border:0;border-radius:999px;background:${on ? "var(--ink-950)" : "var(--white)"};color:${on ? "var(--white)" : "var(--fg-1)"};box-shadow:${on ? "none" : "inset 0 0 0 1px var(--border-default)"};font:500 13px/1 var(--font-sans);cursor:pointer`
                  )}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
          {feed.map((job) => (
            <JobFeedCard key={job.id} job={job} applied={appliedJobIds.has(job.id)} onOpen={() => onOpenJob(job)} />
          ))}
          {feed.length === 0 ? (
            <div style={css("padding:40px;text-align:center;color:var(--fg-3)")}>No open jobs for this skill right now. Check back soon.</div>
          ) : null}
        </div>
      )}
    </div>
  )
}

function JobFeedCard({ job, applied, onOpen }: { job: RecommendedJob; applied: boolean; onOpen: () => void }) {
  const budget = jobBudgetText(job)
  const photos = job.documents.filter((u) => IMAGE_RE.test(u))
  return (
    <div style={css("display:flex;flex-direction:column;gap:14px;padding:22px;border-radius:var(--radius-lg);background:var(--white);box-shadow:var(--shadow-hairline)")}>
      <div style={css("display:flex;flex-wrap:wrap;align-items:flex-start;gap:16px")}>
        <div style={css("flex:1 1 300px;min-width:0")}>
          <div style={css(`${CAPTION};display:flex;flex-wrap:wrap;align-items:center;gap:8px`)}>
            <span>{jobSkill(job)}</span>
            <span>·</span>
            <span>{timeAgo(job.createdAt)}</span>
            {job.skillMatch ? <MatchTag /> : null}
          </div>
          <div style={css("font:500 18px/1.3 var(--font-sans);letter-spacing:var(--ls-tight);margin-top:8px")}>{job.serviceType}</div>
        </div>
        <Money value={budget.value} label={budget.label} />
      </div>
      <p style={css("margin:0;color:var(--fg-2);text-wrap:pretty")}>{job.additionalInfo || "No extra details."}</p>
      {photos.length ? (
        <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
          {photos.map((url) => (
            <div
              key={url}
              role="img"
              aria-label="Task photo"
              style={css(`width:72px;height:72px;border-radius:var(--radius-md);background-color:var(--ink-100);background-size:cover;background-position:center;background-image:url("${url}")`)}
            />
          ))}
        </div>
      ) : null}
      <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;padding-top:14px;border-top:1px solid var(--border-hairline);font:var(--text-small);color:var(--fg-2)")}>
        <span style={css("display:inline-flex;align-items:center;gap:6px")}>
          <Ico name="map-pin" size={13} />
          {jobArea(job)}
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
          {offersText(job.applicantCount)}
        </span>
        <span style={css("flex:1")} />
        <Ix
          onClick={onOpen}
          base={`height:40px;padding:0 18px;border:0;border-radius:999px;background:${applied ? G_TINT : G};color:${applied ? G : "var(--white)"};box-shadow:none;font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px`}
          active="transform:scale(0.98)"
        >
          <Ico name={applied ? "check" : "send"} size={14} />
          {applied ? "Applied · view" : "Apply"}
        </Ix>
      </div>
    </div>
  )
}

/* ───────────── My jobs ───────────── */

export function MyJobsView({
  applications,
  matrices,
  firstName: first,
  onMessage,
  onReview,
  onBrowse,
  onConfirm,
  confirmingId,
  confirmError,
}: {
  applications: Application[]
  matrices: Record<number, ReviewMatrix | null>
  firstName: string
  onMessage: (app: Application) => void
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
      <PageTitle eyebrow="Your work" title="My" em="jobs" after="." />

      {empty ? (
        <div style={css(EMPTY_CARD)}>
          <span style={css(`width:52px;height:52px;border-radius:var(--radius-lg);background:${G_TINT};color:${G};display:inline-flex;align-items:center;justify-content:center`)}>
            <Ico name="send" size={22} />
          </span>
          <div style={css("font:500 18px/1.3 var(--font-sans);margin-top:8px")}>No jobs yet</div>
          <div style={css("color:var(--fg-2);max-width:360px")}>
            Apply to tasks that match your skills. When a client hires you, the job appears here and you can message the client in QuickHands.
          </div>
          <button type="button" onClick={onBrowse} style={css(`${PRIMARY_PILL};margin-top:12px;height:48px`)}>
            Browse jobs
          </button>
        </div>
      ) : null}

      {active.length > 0 ? (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          <h2 style={css(H4)}>
            In progress <span style={css("color:var(--fg-3);font-weight:400")}>{active.length}</span>
          </h2>
          {active.map((app) => {
            const clientName = app.job?.clientName || "Client"
            const cf = firstWord(clientName)
            const mine = app.completion?.freelancerConfirmed === true
            const theirs = app.completion?.clientConfirmed === true
            return (
              <div
                key={app.id}
                style={css(
                  "display:flex;flex-direction:column;gap:18px;padding:24px;border-radius:var(--radius-xl);background:var(--white);box-shadow:inset 0 0 0 1.5px #1B3A9E,var(--shadow-sm)"
                )}
              >
                <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:flex-start")}>
                  <div style={css("min-width:0")}>
                    <div style={css(`${CAPTION};color:${G};display:inline-flex;align-items:center;gap:6px`)}>
                      <Ico name="lock-open" size={13} />
                      Hired · message in QuickHands
                    </div>
                    <div style={css("font:var(--text-h4);letter-spacing:var(--ls-tight);margin-top:10px")}>{app.job?.serviceType || "Job"}</div>
                    <div style={css("display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:8px;font:var(--text-small);color:var(--fg-2)")}>
                      <span style={css("display:inline-flex;align-items:center;gap:6px")}>
                        <Ico name="calendar" size={13} />
                        {formatRange(app.job?.startDate ?? null, app.job?.endDate ?? null)}
                      </span>
                    </div>
                  </div>
                  <Money value={app.quotation || "Agreed"} label="Agreed price" size={24} />
                </div>

                <div style={css("display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--border-hairline)")}>
                  <span style={css("width:40px;height:40px;border-radius:50%;background:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 13px/1 var(--font-sans);flex-shrink:0")}>
                    {initials(clientName)}
                  </span>
                  <div style={css("flex:1;min-width:0")}>
                    <div style={css("font:500 15px/1.3 var(--font-sans)")}>{clientName}</div>
                    <div style={css("font:var(--text-small);color:var(--fg-3)")}>Client</div>
                  </div>
                  <Ix
                    onClick={() => onMessage(app)}
                    base="height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);color:var(--fg-1);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px"
                    hover="background:var(--ink-50)"
                  >
                    <Ico name="message-square" size={14} />
                    Message
                  </Ix>
                </div>

                <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px")}>
                  <Ix
                    as="button"
                    onClick={() => onMessage(app)}
                    base="display:flex;align-items:center;gap:12px;padding:14px 16px;border:0;border-radius:var(--radius-lg);background:var(--ink-50);color:var(--fg-1);text-align:left;cursor:pointer;transition:background var(--dur-fast) var(--ease-out)"
                    hover="background:var(--ink-100)"
                  >
                    <Ico name="message-square" size={16} />
                    <span style={css("display:flex;flex-direction:column;gap:4px;min-width:0")}>
                      <span style={css(CAPTION)}>Messages</span>
                      <span style={css("font:500 15px/1.2 var(--font-sans)")}>Chat with {cf} in QuickHands</span>
                    </span>
                  </Ix>
                </div>

                <div style={css("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
                  <div style={css("font:500 16px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>Is the job done?</div>
                  <div style={css("font:var(--text-small);color:var(--fg-2);margin-top:4px;text-wrap:pretty")}>
                    When you both confirm, the job is marked completed.
                  </div>
                  <div style={css("display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:14px")}>
                    {[
                      { label: "You", ok: mine },
                      { label: cf, ok: theirs },
                    ].map((r) => (
                      <span key={r.label} style={css(`display:inline-flex;align-items:center;gap:6px;font:500 14px/1 var(--font-sans);color:${r.ok ? G : "var(--fg-3)"}`)}>
                        <Ico name={r.ok ? "circle-check" : "circle-dashed"} size={15} />
                        {r.label} · {r.ok ? "Confirmed" : "Not yet"}
                      </span>
                    ))}
                  </div>
                  {!mine ? (
                    <button
                      type="button"
                      onClick={() => onConfirm(app)}
                      disabled={confirmingId === app.id}
                      style={css(`margin-top:16px;height:44px;padding:0 20px;border:0;border-radius:999px;background:${G};color:var(--white);font:500 14px/1 var(--font-sans);cursor:${confirmingId === app.id ? "wait" : "pointer"};display:inline-flex;align-items:center;gap:8px`)}
                    >
                      <Ico name="check" size={15} />
                      Mark as completed
                    </button>
                  ) : null}
                  {mine && !theirs ? (
                    <div style={css("display:flex;align-items:center;gap:10px;margin-top:16px;font:var(--text-small);color:var(--fg-2)")}>
                      <span style={css(`width:14px;height:14px;border-radius:50%;border:1.5px solid var(--ink-200);border-top-color:${G};animation:qhSpin 900ms linear infinite;flex-shrink:0`)} />
                      Waiting for {cf} to confirm.
                    </div>
                  ) : null}
                  {confirmError ? <p style={css("margin:12px 0 0;font:var(--text-small);color:var(--danger-600)")}>{confirmError}</p> : null}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}

      {applied.length > 0 ? (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          <h2 style={css(H4)}>
            Applications <span style={css("color:var(--fg-3);font-weight:400")}>{applied.length}</span>
          </h2>
          <div style={css("border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline);overflow:hidden")}>
            {applied.map((app) => {
              const rejected = app.status === "rejected"
              return (
                <div key={app.id} style={css("display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;padding:18px 22px;border-bottom:1px solid var(--border-hairline)")}>
                  <div style={css("flex:1 1 240px;min-width:0")}>
                    <div style={css("font:500 15px/1.3 var(--font-sans)")}>{app.job?.serviceType || "Job"}</div>
                    <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>
                      {shortName(app.job?.clientName)} · sent {timeAgo(app.createdAt)}
                    </div>
                  </div>
                  <span
                    style={css(
                      `display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:999px;background:var(--ink-100);color:${rejected ? "var(--fg-3)" : "var(--fg-2)"};${CAPTION}`
                    )}
                  >
                    {rejected ? "Not selected" : "Sent"}
                  </span>
                  <span style={css("font:500 17px/1 var(--font-sans);font-variant-numeric:tabular-nums;width:72px;text-align:right")}>{app.quotation || ""}</span>
                  <Ix
                    onClick={() => onMessage(app)}
                    base="height:36px;padding:0 14px;border:0;border-radius:999px;background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);color:var(--fg-1);font:500 13px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:6px"
                    hover="background:var(--ink-50)"
                  >
                    <Ico name="message-square" size={13} />
                    View
                  </Ix>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {done.length > 0 ? (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          <h2 style={css(H4)}>
            Completed <span style={css("color:var(--fg-3);font-weight:400")}>{done.length}</span>
          </h2>
          {done.map((app) => {
            const clientName = app.job?.clientName || "Client"
            const cf = firstWord(clientName)
            const matrix = matrices[app.id]
            const myReview = matrix?.freelancerToClient ?? null
            const theirReview = matrix?.clientToFreelancer ?? null
            return (
              <div key={app.id} style={css("display:flex;flex-direction:column;gap:18px;padding:24px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)")}>
                <div style={css("display:flex;align-items:center;gap:14px")}>
                  <span style={css(`width:44px;height:44px;border-radius:50%;background:${G};color:var(--white);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0`)}>
                    <Ico name="check" size={20} />
                  </span>
                  <div style={css("min-width:0")}>
                    <div style={css("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>{app.job?.serviceType || "Job"}</div>
                    <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>
                      {shortName(clientName)} · {formatDate(app.completedAt)} · {app.quotation || ""}
                    </div>
                  </div>
                </div>

                <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px")}>
                  <div style={css("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
                    <div style={css(CAPTION)}>Your review of {cf}</div>
                    {myReview ? (
                      <>
                        <Stars rating={myReview.rating} />
                        <p style={css("margin:10px 0 0;color:var(--fg-2);text-wrap:pretty")}>{myReview.comment || "No written review."}</p>
                      </>
                    ) : matrix?.canFreelancerReview ? (
                      <button
                        type="button"
                        onClick={() => onReview(app)}
                        style={css(`margin-top:12px;height:38px;padding:0 16px;border:0;border-radius:999px;background:${G};color:var(--white);font:500 13px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:6px`)}
                      >
                        <Ico name="star" size={13} />
                        Leave a review
                      </button>
                    ) : (
                      <p style={css("margin:12px 0 0;font:var(--text-small);color:var(--fg-3)")}>No review yet.</p>
                    )}
                  </div>
                  <div style={css("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
                    <div style={css(CAPTION)}>{cf}&apos;s review of you</div>
                    {theirReview ? (
                      <>
                        <Stars rating={theirReview.rating} />
                        <p style={css("margin:10px 0 0;color:var(--fg-2);text-wrap:pretty")}>{theirReview.comment || "No written review."}</p>
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

/* ───────────── Profile ───────────── */

export function ProfileView({
  category,
  skills,
  years,
  area,
  experience,
  skipped,
  onEditProfession,
  onAddExperience,
  onRemoveExperience,
}: {
  category: ProfessionCategory | null
  skills: string[]
  years: YearValue
  area: string
  experience: ExperienceEntry[]
  skipped: boolean
  onEditProfession: () => void
  onAddExperience: () => void
  onRemoveExperience: (index: number) => void
}) {
  const yearsText = YEAR_OPTIONS.find((o) => o.value === years)?.long ?? ""

  return (
    <div style={css("display:flex;flex-direction:column;gap:24px")}>
      <PageTitle eyebrow="What clients see" title="Your" em="profile" after="." />

      <div style={css("padding:28px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)")}>
        <div style={css("display:flex;justify-content:space-between;align-items:center;gap:12px")}>
          <span style={css(CAPTION)}>Profession</span>
          <button type="button" onClick={onEditProfession} style={css(`border:0;background:transparent;padding:0;font:500 13px/1 var(--font-sans);color:${G};cursor:pointer`)}>
            {category ? "Edit" : "Add"}
          </button>
        </div>
        {category ? (
          <>
            <div style={css("font:var(--text-h3);letter-spacing:var(--ls-heading);margin-top:14px")}>{category.role}</div>
            <div style={css("display:flex;flex-wrap:wrap;gap:6px;margin-top:14px")}>
              {skills.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
            <div style={css("display:flex;flex-wrap:wrap;gap:20px;margin-top:16px;font:var(--text-small);color:var(--fg-2)")}>
              <span style={css("display:inline-flex;align-items:center;gap:6px")}>
                <Ico name="award" size={14} />
                {yearsText ? `${yearsText} experience` : "Experience not set"}
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
          <span style={css(CAPTION)}>Work experience</span>
          <button
            type="button"
            onClick={onAddExperience}
            style={css(`border:0;background:transparent;padding:0;font:500 13px/1 var(--font-sans);color:${G};cursor:pointer;display:inline-flex;align-items:center;gap:4px`)}
          >
            <Ico name="plus" size={13} />
            Add
          </button>
        </div>
        <div style={css("display:flex;flex-direction:column;margin-top:8px")}>
          {experience.map((x, i) => {
            const meta = [x.org, [x.from, x.to || "Present"].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")
            return (
              <div key={`${x.title}-${i}`} style={css("display:flex;gap:16px;padding:18px 0;border-bottom:1px solid var(--border-hairline)")}>
                <span style={css("width:40px;height:40px;border-radius:var(--radius-md);background:var(--ink-100);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0")}>
                  <Ico name="briefcase" size={16} />
                </span>
                <div style={css("flex:1;min-width:0")}>
                  <div style={css("font:500 15px/1.3 var(--font-sans)")}>{x.title}</div>
                  {meta ? <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>{meta}</div> : null}
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
            )
          })}
          {experience.length === 0 ? (
            <p style={css("margin:6px 0 0;color:var(--fg-3)")}>{skipped ? "No past experience added. You can add it any time." : "Nothing added yet."}</p>
          ) : null}
        </div>
      </div>

      <div style={css("border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline);overflow:hidden")}>
        <div style={css(`padding:22px 24px 6px;${CAPTION}`)}>Identity verification</div>
        {[
          { icon: "id-card", label: "National ID or passport", hint: "Photo of the bio page" },
          { icon: "scan-face", label: "Live selfie", hint: "Matched to your document" },
        ].map((r) => (
          <div key={r.label} style={css("display:flex;align-items:center;gap:16px;padding:18px 24px;border-bottom:1px solid var(--border-hairline)")}>
            <span style={css("width:40px;height:40px;border-radius:var(--radius-md);background:var(--ink-100);color:var(--fg-2);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0")}>
              <Ico name={r.icon} size={18} />
            </span>
            <div style={css("flex:1")}>
              <div style={css("font:500 15px/1.3 var(--font-sans)")}>{r.label}</div>
              <div style={css("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>{r.hint}</div>
            </div>
            <span style={css(`${CAPTION};color:var(--fg-3)`)}>Coming soon</span>
          </div>
        ))}
        <div style={css("padding:16px 24px;display:flex;justify-content:flex-end;align-items:center;gap:16px")}>
          <span style={css("font:var(--text-small);color:var(--fg-3)")}>Identity verification is coming soon.</span>
          <button type="button" disabled style={css("height:40px;padding:0 18px;border:0;border-radius:999px;background:var(--ink-300);color:var(--white);font:500 14px/1 var(--font-sans);cursor:not-allowed")}>
            Start verification
          </button>
        </div>
      </div>
    </div>
  )
}

/** The first name of a client, as the design writes it in running copy. */
function firstWord(name: string | null | undefined) {
  return firstName(name) || "the client"
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return ""
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
}
