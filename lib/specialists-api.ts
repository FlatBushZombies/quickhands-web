import { API_BASE_URL } from "@/lib/fetch-client"

export interface SpecialistSummary {
  clerkId: string
  name: string
  imageUrl: string | null
  /** Raw comma-separated skills string as stored on the profile. */
  skills: string
  /** The same skills, split into individual specialties for display. */
  skillList: string[]
  experienceLevel: string | null
  hourlyRate: number | string | null
  location: { label: string | null; city: string | null } | null
  /** Great-circle distance from the viewer, in km — only set when the search was given a lat/lng. */
  distanceKm: number | null
  tagline: string
  reviewSummary: { averageRating: number; reviewCount: number }
  /** Set only when the specialist has published their link-in-bio page. */
  bioUsername: string | null
}

export interface SpecialistSearchResult {
  specialists: SpecialistSummary[]
  /** True when the backend couldn't be reached or doesn't have the endpoint yet. */
  unavailable: boolean
}

export interface ViewerLocation {
  lat: number
  lng: number
}

/**
 * Public specialist search (GET /api/user/search/specialists — no auth), so
 * it's safe to call from server components. Same generous-timeout +
 * short-ISR shape as lib/jobs-api.ts and lib/bio-api.ts: the Render
 * free-tier host can take 30-60s to wake from a cold start.
 *
 * Passing `viewerLocation` sorts matching results nearest-first and fills in
 * `distanceKm` on each one; without it the backend falls back to its
 * rating/recency ordering.
 */
export async function searchSpecialists(
  query: string,
  limit = 24,
  viewerLocation?: ViewerLocation | null
): Promise<SpecialistSearchResult> {
  const params = new URLSearchParams()
  if (query.trim()) params.set("q", query.trim())
  params.set("limit", String(limit))
  if (viewerLocation) {
    params.set("lat", String(viewerLocation.lat))
    params.set("lng", String(viewerLocation.lng))
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/user/search/specialists?${params.toString()}`, {
      // Viewer-specific (lat/lng) results shouldn't be cached/shared across visitors.
      ...(viewerLocation ? { cache: "no-store" as const } : { next: { revalidate: 30 } }),
      signal: AbortSignal.timeout(45000),
    })

    if (!response.ok) {
      return { specialists: [], unavailable: true }
    }

    const data = await response.json()
    if (!data?.success || !Array.isArray(data.data)) {
      return { specialists: [], unavailable: true }
    }

    return { specialists: data.data as SpecialistSummary[], unavailable: false }
  } catch (error) {
    console.error("[specialists] Failed to search specialists:", error)
    return { specialists: [], unavailable: true }
  }
}

/**
 * Public single-specialist lookup (GET /api/user/specialists/:clerkId — no
 * auth) — resolves one person for the "hire" booking flow. Returns null for
 * a client, an unknown clerkId, or a backend error.
 */
export async function getPublicSpecialist(
  clerkId: string,
  viewerLocation?: ViewerLocation | null
): Promise<SpecialistSummary | null> {
  const params = new URLSearchParams()
  if (viewerLocation) {
    params.set("lat", String(viewerLocation.lat))
    params.set("lng", String(viewerLocation.lng))
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/user/specialists/${encodeURIComponent(clerkId)}?${params.toString()}`,
      { cache: "no-store", signal: AbortSignal.timeout(45000) }
    )
    if (!response.ok) return null

    const data = await response.json()
    return data?.success ? (data.data as SpecialistSummary) : null
  } catch (error) {
    console.error("[specialists] Failed to load specialist:", error)
    return null
  }
}
