import { fetchWithRetry, getApiUrl, parseJsonSafely } from "@/lib/fetch-client"

export interface PortfolioMedia {
  id: number
  projectId: number
  url: string
  sortOrder: number
  createdAt: string
}

export interface PortfolioProject {
  id: number
  specialistClerkId: string
  title: string
  description: string | null
  category: string | null
  skills: string | null
  projectUrl: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  media: PortfolioMedia[]
}

export interface PortfolioProjectInput {
  title: string
  description?: string
  category?: string
  skills?: string
  projectUrl?: string
}

/** GET /api/portfolio/me — the signed-in specialist's own portfolio (for editing). */
export async function getMyPortfolio(token: string): Promise<PortfolioProject[]> {
  const response = await fetchWithRetry(getApiUrl("/api/portfolio/me"), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJsonSafely(response)
  return response.ok && data?.success ? (data.data?.projects as PortfolioProject[]) ?? [] : []
}

export async function createPortfolioProject(input: PortfolioProjectInput, token: string): Promise<PortfolioProject> {
  const response = await fetchWithRetry(
    getApiUrl("/api/portfolio/projects"),
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to add portfolio project")
  }
  return data.data as PortfolioProject
}

export async function updatePortfolioProject(
  id: number,
  input: Partial<PortfolioProjectInput>,
  token: string
): Promise<PortfolioProject> {
  const response = await fetchWithRetry(
    getApiUrl(`/api/portfolio/projects/${id}`),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to update portfolio project")
  }
  return data.data as PortfolioProject
}

export async function deletePortfolioProject(id: number, token: string): Promise<void> {
  const response = await fetchWithRetry(
    getApiUrl(`/api/portfolio/projects/${id}`),
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to delete portfolio project")
  }
}

/** Replaces the whole project ordering; returns the reordered project list. */
export async function reorderPortfolioProjects(orderedProjectIds: number[], token: string): Promise<PortfolioProject[]> {
  const response = await fetchWithRetry(
    getApiUrl("/api/portfolio/projects/reorder"),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderedProjectIds }),
    },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to reorder your portfolio")
  }
  return (data.data?.projects as PortfolioProject[]) ?? []
}

export async function addPortfolioMedia(projectId: number, mediaUrl: string, token: string): Promise<PortfolioMedia> {
  const response = await fetchWithRetry(
    getApiUrl(`/api/portfolio/projects/${projectId}/media`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ mediaUrl }),
    },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to add photo")
  }
  return data.data as PortfolioMedia
}

export async function removePortfolioMedia(mediaId: number, token: string): Promise<void> {
  const response = await fetchWithRetry(
    getApiUrl(`/api/portfolio/media/${mediaId}`),
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to remove photo")
  }
}
