import { Briefcase } from "lucide-react"
import { listJobs, searchJobs } from "@/lib/jobs-api"
import { JobCard } from "@/components/jobs/JobCard"
import { JobFilters } from "@/components/jobs/JobFilters"

export const revalidate = 30

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.q?.trim()

  const jobs = query
    ? await searchJobs(query)
    : await listJobs(
        new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
        )
      )

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Browse jobs</h1>
      <p className="mt-1 text-sm text-muted-foreground">Find work near you.</p>

      <div className="mt-6">
        <JobFilters />
      </div>

      <div className="mt-6 space-y-3">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No jobs match your filters right now.</p>
          </div>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  )
}
