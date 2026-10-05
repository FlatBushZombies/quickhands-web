"use client"

import { Fragment } from "react"
import { Calendar, Check, CircleCheck, CircleDashed, Lock, MapPin, MessageSquare, MessagesSquare, Star, type LucideIcon } from "lucide-react"
import { timeAgo } from "@/components/app-shell/feed"
import {
  EYEBROW,
  GREEN,
  fullDateLabel,
  firstNameOf,
  initialsOf,
  sx,
  whenLabel,
} from "@/components/account/account-styles"
import {
  jobPhotos,
  locationLabel,
  ratingOf,
  stageIndex,
  starsOf,
  statusLookOf,
  tasksLabel,
  taskTitleOf,
  type TaskStatus,
} from "@/components/account/account-tasks"
import type { Application, ClientJobWithApplications, ReviewMatrix } from "@/lib/applications-api"

const SECTION_CARD = sx("padding:28px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)")

const SPINNER = sx(
  "width:18px;height:18px;border-radius:50%;border:1.5px solid var(--ink-200);border-top-color:#108600;animation:qhSpin 900ms linear infinite;flex-shrink:0"
)

const PILL_GREEN = sx(
  "height:40px;padding:0 18px;border:0;border-radius:999px;background:#108600;color:var(--white);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px"
)

const PILL_GHOST = sx(
  "height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);color:var(--fg-1);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px"
)

const PILL_DECLINE = sx(
  "height:40px;padding:0 16px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:500 14px/1 var(--font-sans);cursor:pointer"
)

const MICRO = sx("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")

function Icon({ glyph: Glyph, size = 14, color }: { glyph: LucideIcon; size?: number; color?: string }) {
  return <Glyph width={size} height={size} strokeWidth={1.5} aria-hidden="true" style={{ color, flexShrink: 0 }} />
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

export function AccountTaskDetail({
  job,
  status,
  hired,
  matrix,
  busyId,
  verified,
  onHire,
  onDecline,
  onComplete,
  onMessage,
  onReview,
}: {
  job: ClientJobWithApplications
  status: TaskStatus
  hired: Application | null
  matrix: ReviewMatrix | null
  busyId: number | null
  verified: boolean
  onHire: (app: Application) => void
  onDecline: (app: Application) => void
  onComplete: (app: Application) => void
  onMessage: (app: Application) => void
  onReview: () => void
}) {
  const look = statusLookOf(job)
  const idx = stageIndex(job, status)
  const stages = ["Posted", "Offers", "In progress", "Completed"]
  const photos = jobPhotos(job)
  const place = locationLabel(job)
  const when = whenLabel(job.startDate, job.endDate)
  const details = job.additionalInfo?.trim() ?? ""
  const title = taskTitleOf(job)
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
          <span style={MICRO}>
            {job.serviceType}
            {job.createdAt ? ` · Posted ${timeAgo(job.createdAt)}` : ""}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", height: 26, padding: "0 12px", borderRadius: 999, background: look.bg, color: look.color, font: "var(--text-micro)", letterSpacing: "var(--ls-mono)", textTransform: "uppercase" }}>
            {look.label}
          </span>
        </div>
        <h2 style={sx("font:var(--text-h3);letter-spacing:var(--ls-heading);margin:16px 0 0")}>{title}</h2>
        <div style={sx("display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:14px;font:var(--text-small);color:var(--fg-2)")}>
          {when ? (
            <span style={sx("display:inline-flex;align-items:center;gap:6px")}>
              <Icon glyph={Calendar} />
              {when}
            </span>
          ) : null}
          {place ? (
            <span style={sx("display:inline-flex;align-items:center;gap:6px")}>
              <Icon glyph={MapPin} />
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
            <span style={EYEBROW}>Reply in chat · hire to start the job</span>
          </div>
          {offers.length === 0 ? (
            <div style={sx("display:flex;align-items:center;gap:14px;padding:20px;border-radius:var(--radius-lg);box-shadow:inset 0 0 0 1px var(--border-default);color:var(--fg-2)")}>
              <span style={SPINNER} />
              <span>Sent to specialists in {job.serviceType}.</span>
            </div>
          ) : null}
          {offers.map((app) => {
            const declined = app.status === "rejected"
            const pending = app.status === "pending"
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
                    <div style={sx("font:500 16px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>{app.freelancerName}</div>
                    <div style={sx("display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:4px;font:var(--text-small);color:var(--fg-3)")}>
                      <span style={sx("display:inline-flex;align-items:center;gap:4px;color:var(--fg-1);font-variant-numeric:tabular-nums")}>
                        <Icon glyph={Star} size={12} />
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
                      <button type="button" onClick={() => onHire(app)} disabled={busyId === app.id} className="qh-acc-green qh-acc-press" style={PILL_GREEN}>
                        <Icon glyph={verified ? Check : Lock} />
                        {verified ? (app.quotation ? `Hire · ${app.quotation}` : "Hire") : "Verify to hire"}
                      </button>
                      <button type="button" onClick={() => onMessage(app)} className="qh-acc-ghost qh-acc-press" style={PILL_GHOST}>
                        <Icon glyph={MessageSquare} />
                        Reply
                      </button>
                      <button type="button" onClick={() => onDecline(app)} disabled={busyId === app.id} className="qh-acc-decline qh-acc-press" style={PILL_DECLINE}>
                        Decline
                      </button>
                    </Fragment>
                  ) : null}
                  {declined ? <span style={sx("font:var(--text-small);color:var(--fg-3)")}>Declined</span> : null}
                </div>
              </div>
            )
          })}
          {!verified && offers.some((app) => app.status === "pending") ? (
            <div style={sx("display:flex;gap:10px;align-items:center;font:var(--text-small);color:var(--fg-3)")}>
              <Icon glyph={Lock} size={14} />
              Verify your identity to hire a specialist. It takes about two minutes.
            </div>
          ) : null}
        </div>
      ) : null}

      {status === "in_progress" && hired ? (
        <div style={sx("display:flex;flex-direction:column;gap:18px;padding:24px;border-radius:var(--radius-xl);background:var(--white);box-shadow:inset 0 0 0 1.5px #108600,var(--shadow-sm)")}>
          <div style={sx("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:#108600;display:inline-flex;align-items:center;gap:6px")}>
            <Icon glyph={CircleCheck} size={13} />
            Your specialist
          </div>
          <div style={sx("display:flex;align-items:center;gap:14px")}>
            <div role="img" aria-label={hired.freelancerName} style={sx("width:52px;height:52px;border-radius:50%;background-color:var(--ink-900);color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 16px/1 var(--font-sans);flex-shrink:0")}>
              {initialsOf(hired.freelancerName)}
            </div>
            <div style={sx("flex:1;min-width:0")}>
              <div style={sx("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>{hired.freelancerName}</div>
              <div style={sx("display:flex;gap:12px;margin-top:4px;font:var(--text-small);color:var(--fg-3)")}>
                <span style={sx("display:inline-flex;align-items:center;gap:4px;color:var(--fg-1)")}>
                  <Icon glyph={Star} size={12} />
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
          <div style={sx("display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px")}>
            <div style={sx("display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:var(--radius-lg);background:var(--ink-50);color:var(--fg-1)")}>
              <Icon glyph={MessagesSquare} size={16} color="var(--fg-2)" />
              <span style={sx("display:flex;flex-direction:column;gap:4px;min-width:0")}>
                <span style={MICRO}>Contact</span>
                <span style={sx("font:500 15px/1.2 var(--font-sans)")}>In-app messages only</span>
              </span>
            </div>
          </div>
          <div>
            <button type="button" onClick={() => onMessage(hired)} className="qh-acc-ghost qh-acc-press" style={PILL_GHOST}>
              <Icon glyph={MessagesSquare} />
              Message {hiredFirst}
            </button>
          </div>
          <div style={sx("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
            <div style={sx("font:500 16px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>Is the job done?</div>
            <div style={sx("font:var(--text-small);color:var(--fg-2);margin-top:4px;text-wrap:pretty")}>
              When you both confirm, the task is marked as completed.
            </div>
            <div style={sx("display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:14px")}>
              {[
                { label: "You", done: clientConfirmed },
                { label: hiredFirst || "Specialist", done: freelancerConfirmed },
              ].map((row) => (
                <span key={row.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "500 14px/1 var(--font-sans)", color: row.done ? GREEN : "var(--fg-3)" }}>
                  <Icon glyph={row.done ? CircleCheck : CircleDashed} size={15} />
                  {row.label} · {row.done ? "Confirmed" : "Not yet"}
                </span>
              ))}
            </div>
            {!clientConfirmed ? (
              <button type="button" onClick={() => onComplete(hired)} disabled={busyId === hired.id} className="qh-acc-green qh-acc-press" style={sx("margin-top:16px;height:44px;padding:0 20px;border:0;border-radius:999px;background:#108600;color:var(--white);font:500 14px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:8px")}>
                <Icon glyph={Check} size={15} />
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
              <Check width={20} height={20} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <div style={sx("font:500 17px/1.3 var(--font-sans);letter-spacing:var(--ls-tight)")}>Task completed</div>
              <div style={sx("font:var(--text-small);color:var(--fg-3);margin-top:4px")}>
                {[fullDateLabel(hired.completedAt), `with ${hired.freelancerName}`, hired.quotation].filter(Boolean).join(" · ")}
              </div>
            </div>
          </div>

          <div style={sx("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px")}>
            <div style={sx("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
              <div style={MICRO}>Your review of {hiredFirst || "them"}</div>
              {matrix?.clientToFreelancer ? (
                <Fragment>
                  <Stars rating={matrix.clientToFreelancer.rating} />
                  {matrix.clientToFreelancer.comment ? (
                    <p style={sx("margin:10px 0 0;color:var(--fg-2);text-wrap:pretty")}>{matrix.clientToFreelancer.comment}</p>
                  ) : null}
                </Fragment>
              ) : (
                <button type="button" onClick={onReview} className="qh-acc-green qh-acc-press" style={sx("margin-top:12px;height:38px;padding:0 16px;border:0;border-radius:999px;background:#108600;color:var(--white);font:500 13px/1 var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:6px")}>
                  <Icon glyph={Star} size={13} />
                  Leave a review
                </button>
              )}
            </div>
            <div style={sx("padding:18px;border-radius:var(--radius-lg);background:var(--ink-50)")}>
              <div style={MICRO}>{hiredFirst || "Their"}&apos;s review of you</div>
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
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
