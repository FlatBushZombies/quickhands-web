import type { Application, ClientJobWithApplications } from "@/lib/applications-api"
import { GREEN } from "@/components/account/account-styles"

export type TaskStatus = "open" | "in_progress" | "completed"

/** The hired application for a task: completed wins over accepted. */
export function hiredOf(job: ClientJobWithApplications): Application | null {
  return (
    job.applications.find((app) => app.status === "completed") ??
    job.applications.find((app) => app.status === "accepted") ??
    null
  )
}

export function taskStatusOf(job: ClientJobWithApplications): TaskStatus {
  const hired = hiredOf(job)
  if (!hired) return "open"
  return hired.status === "completed" ? "completed" : "in_progress"
}

/** Card title: the specific services the client picked, else the trade. */
export function taskTitleOf(job: ClientJobWithApplications) {
  const services = (job.selectedServices ?? []).filter(Boolean)
  return services.length ? services.join(", ") : job.serviceType
}

export const STATUS_LOOK: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  open: { label: "Waiting for offers", color: "var(--fg-3)", bg: "var(--ink-100)" },
  in_progress: { label: "In progress", color: "var(--fg-1)", bg: "var(--ink-100)" },
  completed: { label: "Completed", color: GREEN, bg: "#F1F8EF" },
}

export function openStatusLook(job: ClientJobWithApplications) {
  if (job.applications.length === 0) return STATUS_LOOK.open
  return { label: "Receiving offers", color: GREEN, bg: "#F1F8EF" }
}

export function statusLookOf(job: ClientJobWithApplications) {
  const status = taskStatusOf(job)
  return status === "open" ? openStatusLook(job) : STATUS_LOOK[status]
}

export function stageIndex(job: ClientJobWithApplications, status: TaskStatus) {
  if (status === "completed") return 3
  if (status === "in_progress") return 2
  return job.applications.length ? 1 : 0
}

/** Attachments are Cloudinary URLs; only image uploads are shown as photos. */
export function jobPhotos(job: ClientJobWithApplications) {
  return (job.documents ?? []).filter((url) => url.includes("/image/upload/"))
}

export function locationLabel(job: ClientJobWithApplications) {
  return job.jobLocation?.label || job.jobLocation?.city || ""
}

/** Rating from real reviews only. A specialist with none is shown as New. */
export function ratingOf(app: Application) {
  const summary = app.freelancerReviewSummary
  if (!summary || summary.reviewCount === 0) return "New"
  return summary.averageRating.toFixed(1)
}

export function tasksLabel(count: number | undefined) {
  return `${count ?? 0} ${count === 1 ? "task" : "tasks"}`
}

export function starsOf(rating: number) {
  return [1, 2, 3, 4, 5].map((i) => (i <= rating ? "var(--ink-950)" : "var(--ink-200)"))
}
