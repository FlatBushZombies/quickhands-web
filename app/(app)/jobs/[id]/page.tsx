import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Calendar, MapPin, Paperclip, Star, User } from "lucide-react"
import { getJob } from "@/lib/jobs-api"
import { ApplyPanel } from "@/components/jobs/ApplyPanel"

export const revalidate = 30

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const job = await getJob(id)
  if (!job) return { title: "Job not found | Quickhands" }
  return {
    title: `${job.serviceType} | Quickhands`,
    description: job.additionalInfo || `${job.serviceType} job on Quickhands.`,
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params
  const job = await getJob(id)

  if (!job) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-heading text-2xl font-bold text-foreground">{job.serviceType}</h1>
              <div className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                ${job.maxPrice}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {job.userName}
                {job.clientReviewSummary.reviewCount > 0 ? (
                  <span className="flex items-center gap-1 text-warning">
                    <Star className="h-3.5 w-3.5 fill-warning" />
                    {job.clientReviewSummary.averageRating.toFixed(1)}
                  </span>
                ) : null}
              </span>
              {job.location?.label || job.location?.city ? (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location.label || job.location.city}
                </span>
              ) : null}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(job.startDate)} – {formatDate(job.endDate)}
              </span>
            </div>

            {job.selectedServices.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {job.selectedServices.map((service) => (
                  <span key={service} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {service}
                  </span>
                ))}
              </div>
            ) : null}

            {job.specialistChoice ? (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Looking for:</span> {job.specialistChoice}
              </p>
            ) : null}

            {job.additionalInfo ? (
              <div className="mt-6 border-t border-border pt-6">
                <h2 className="text-sm font-semibold text-foreground">Details</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{job.additionalInfo}</p>
              </div>
            ) : null}

            {job.documents.length > 0 ? (
              <div className="mt-6 border-t border-border pt-6">
                <h2 className="text-sm font-semibold text-foreground">Attachments</h2>
                <div className="mt-2 space-y-1.5">
                  {job.documents.map((url, index) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <ApplyPanel job={job} />
        </div>
      </div>
    </div>
  )
}
