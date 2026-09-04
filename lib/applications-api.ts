import { fetchWithRetry, getApiUrl, parseJsonSafely } from "@/lib/fetch-client"

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "completed"

export interface Application {
  id: number
  jobId: number
  freelancerClerkId: string
  freelancerName: string
  freelancerEmail: string | null
  quotation: string | null
  conditions: string | null
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
  conversationId?: string
  job?: {
    serviceType: string | null
    maxPrice: number
    startDate: string | null
    endDate: string | null
    clientName: string | null
    clientClerkId: string | null
  }
}

export interface ClientJobWithApplications {
  id: number
  serviceType: string
  maxPrice: number
  startDate: string
  endDate: string
  applications: Application[]
  applicationSummary: { total: number; pending: number; accepted: number; rejected: number; completed: number }
}

export type ApplyResult =
  | { status: "success"; conversation?: { conversationId: string; jobId: number; jobTitle: string; otherClerkId: string; otherDisplayName: string } }
  | { status: "already_applied" }
  | { status: "error"; message: string }

// No retries, same reasoning as createJob — this creates a resource.
export async function applyToJob(
  jobId: number,
  payload: { userId: string; userName: string; userEmail?: string; quotation: string; conditions?: string },
  token: string
): Promise<ApplyResult> {
  try {
    const response = await fetchWithRetry(
      getApiUrl(`/api/jobs/${jobId}/apply`),
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      },
      { retries: 0, timeoutMs: 45000 }
    )
    const data = await parseJsonSafely(response)

    if (data?.alreadyApplied) {
      return { status: "already_applied" }
    }
    if (!response.ok || !data?.success) {
      return { status: "error", message: data?.message || `Server error (${response.status})` }
    }
    return { status: "success", conversation: data.conversation }
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Network error" }
  }
}

export async function getMyApplications(token: string): Promise<Application[]> {
  const response = await fetchWithRetry(getApiUrl("/api/applications/my"), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJsonSafely(response)
  return response.ok && data?.success ? (data.data as Application[]) : []
}

export async function getClientApplications(token: string): Promise<ClientJobWithApplications[]> {
  const response = await fetchWithRetry(getApiUrl("/api/applications/client"), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJsonSafely(response)
  return response.ok && data?.success ? (data.data as ClientJobWithApplications[]) : []
}

export async function updateApplicationStatus(
  id: number,
  status: ApplicationStatus,
  token: string
): Promise<Application> {
  const response = await fetchWithRetry(
    getApiUrl(`/api/applications/${id}/status`),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to update application")
  }
  return data.data as Application
}

export interface ReviewEntry {
  applicationId: number
  reviewerClerkId: string
  reviewerName: string
  subjectClerkId: string
  subjectName: string
  subjectRole: "client" | "freelancer"
  rating: number
  comment: string | null
  createdAt: string
}

export interface ReviewMatrix {
  clientToFreelancer: ReviewEntry | null
  freelancerToClient: ReviewEntry | null
  canClientReview: boolean
  canFreelancerReview: boolean
}

export async function getApplicationReviews(id: number, token: string): Promise<ReviewMatrix | null> {
  const response = await fetchWithRetry(getApiUrl(`/api/applications/${id}/reviews`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJsonSafely(response)
  return response.ok && data?.success ? (data.data as ReviewMatrix) : null
}

export async function submitApplicationReview(
  id: number,
  payload: { rating: number; comment: string },
  token: string
): Promise<ReviewEntry> {
  const response = await fetchWithRetry(
    getApiUrl(`/api/applications/${id}/reviews`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to save review")
  }
  return data.data as ReviewEntry
}
