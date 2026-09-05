import { fetchWithRetry, getApiUrl, parseJsonSafely } from "@/lib/fetch-client"
import type { BioCustomLink, BioSmartLinks } from "@/lib/bio-api"

export interface MyBioSettings {
  username: string | null
  suggestedUsername: string
  tagline: string
  phone: string
  smartLinks: BioSmartLinks
  customLinks: BioCustomLink[]
  isPublished: boolean
  profile: {
    name: string | null
    imageUrl: string | null
    skills: string | null
    experienceLevel: string | null
    hourlyRate: number | null
    reviewSummary: { averageRating: number; reviewCount: number }
  }
}

export interface UpdateBioPayload {
  username?: string
  tagline?: string
  phone?: string
  smartLinks?: BioSmartLinks
  customLinks?: BioCustomLink[]
}

const FETCH_OPTS = { retries: 1, timeoutMs: 15000, retryDelayMs: 2000 }

export async function getMyBioSettings(token: string): Promise<MyBioSettings> {
  const response = await fetchWithRetry(
    getApiUrl("/api/bio/me"),
    { headers: { Authorization: `Bearer ${token}` } },
    FETCH_OPTS
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to load your bio settings")
  }
  return data.data as MyBioSettings
}

export async function updateMyBioSettings(payload: UpdateBioPayload, token: string): Promise<MyBioSettings> {
  const response = await fetchWithRetry(
    getApiUrl("/api/bio/me"),
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    { retries: 0, timeoutMs: 20000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to save your bio settings")
  }
  return data.data as MyBioSettings
}

export async function checkUsernameAvailable(
  username: string,
  token: string
): Promise<{ available: boolean; reason: string | null }> {
  const response = await fetchWithRetry(
    getApiUrl(`/api/bio/check/${encodeURIComponent(username)}`),
    { headers: { Authorization: `Bearer ${token}` } },
    { retries: 0, timeoutMs: 8000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    return { available: false, reason: "Could not check availability" }
  }
  return data.data as { available: boolean; reason: string | null }
}
