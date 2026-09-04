import { fetchWithRetry, getApiUrl, parseJsonSafely } from "@/lib/fetch-client"

export interface JobLocation {
  label: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
}

export interface JobProximity {
  inYourArea: boolean
  distanceKm: number | null
}

export interface ClientReviewSummary {
  averageRating: number
  reviewCount: number
  latestReview: { rating: number; comment: string | null; reviewerName: string; createdAt: string } | null
}

export interface Job {
  id: number
  serviceType: string
  selectedServices: string[]
  startDate: string
  endDate: string
  maxPrice: number
  specialistChoice: string | null
  additionalInfo: string | null
  documents: string[]
  clerkId: string
  userName: string
  userAvatar: string | null
  createdAt: string
  updatedAt: string | null
  location: JobLocation | null
  proximity: JobProximity | null
  clientReviewSummary: ClientReviewSummary
  applicantCount: number
}

/**
 * Both GET /api/jobs and GET /api/jobs/search take no auth (jobs.routes.js)
 * so these are safe to call from server components — same fetch-with-
 * timeout-and-ISR shape as lib/bio-api.ts.
 */
export async function listJobs(params: URLSearchParams): Promise<Job[]> {
  const query = params.toString()
  try {
    const response = await fetch(getApiUrl(`/api/jobs${query ? `?${query}` : ""}`), {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(45000),
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.success ? (data.data as Job[]) : []
  } catch (error) {
    console.error("[jobs] Failed to list jobs:", error)
    return []
  }
}

export async function searchJobs(query: string): Promise<Job[]> {
  try {
    const response = await fetch(getApiUrl(`/api/jobs/search?q=${encodeURIComponent(query)}`), {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(45000),
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.success ? (data.data as Job[]) : []
  } catch (error) {
    console.error("[jobs] Failed to search jobs:", error)
    return []
  }
}

export async function getJob(id: string | number): Promise<Job | null> {
  try {
    const response = await fetch(getApiUrl(`/api/jobs/${id}`), {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(45000),
    })
    if (response.status === 404) return null
    if (!response.ok) return null
    const data = await response.json()
    return data.success ? (data.data as Job) : null
  } catch (error) {
    console.error("[jobs] Failed to load job:", error)
    return null
  }
}

export interface CreateJobPayload {
  serviceType: string
  selectedServices: string[]
  startDate: string
  endDate: string
  maxPrice: number
  specialistChoice: string
  additionalInfo: string
  documents: string[]
  clerkId: string
  userName: string
  userAvatar: string | null
  location: { label: string | null; city: string | null; latitude: number | null; longitude: number | null }
}

export interface CreateJobResult {
  job: Job
  matchingSummary: { nearbyFreelancerCount: number; inYourArea: boolean }
}

// Deliberately no retries: this creates a resource. A slow-but-successful
// request retried blindly risks posting the same job twice with no
// idempotency key to de-dupe on — same reasoning as the mobile apps'
// PostJobModal. A single patient 45s attempt still gives a Render
// free-tier cold start (up to ~60s) room to finish.
export async function createJob(payload: CreateJobPayload, token: string): Promise<CreateJobResult> {
  const response = await fetchWithRetry(
    getApiUrl("/api/jobs"),
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)

  if (response.status !== 201 || !data?.success) {
    throw new Error(data?.message || `Failed to post job (HTTP ${response.status})`)
  }

  return { job: data.data as Job, matchingSummary: data.matchingSummary }
}
