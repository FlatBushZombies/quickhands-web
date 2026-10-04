import { fetchWithRetry, getApiUrl, parseJsonSafely } from "@/lib/fetch-client"

export type AppRole = "client" | "freelancer"

export interface BackendLocation {
  label: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
}

export interface BackendUser {
  id: number | string
  clerkId: string
  name: string | null
  email: string | null
  imageUrl: string | null
  skills: string | null
  experienceLevel: string | null
  hourlyRate: number | null
  completedOnboarding: boolean
  location: BackendLocation | null
}

export interface ExperienceEntry {
  title: string
  org: string
  from: string
  to: string
  desc: string
}

interface ClerkLikeUser {
  id?: string | null
  firstName?: string | null
  lastName?: string | null
  fullName?: string | null
  imageUrl?: string | null
  primaryEmailAddress?: { emailAddress?: string | null } | null
}

function buildUserPayload(user: ClerkLikeUser, appRole: AppRole) {
  const fullName =
    user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null

  return {
    clerkId: user.id,
    name: fullName,
    email: user.primaryEmailAddress?.emailAddress || null,
    imageUrl: user.imageUrl || null,
    appRole,
  }
}

// This gates the post-sign-in/onboarding redirect, so it uses a tighter
// budget than the default background-retry config — same pattern as
// client-app's ensureBackendUser in lib/userSync.ts, which this is a
// direct port of (parameterized on appRole instead of hardcoding "client",
// since this one app serves both roles).
const STARTUP_FETCH_OPTS = { retries: 1, timeoutMs: 8000, retryDelayMs: 2000 }

export async function ensureBackendUser(
  user: ClerkLikeUser | null | undefined,
  appRole: AppRole
): Promise<BackendUser | null> {
  if (!user?.id) {
    return null
  }

  const lookupResponse = await fetchWithRetry(
    getApiUrl(`/api/user/get?clerkId=${user.id}`),
    {},
    STARTUP_FETCH_OPTS
  )
  const lookupData = await parseJsonSafely(lookupResponse)

  if (lookupResponse.ok && lookupData?.user) {
    return lookupData.user as BackendUser
  }

  if (lookupResponse.status !== 404) {
    throw new Error(lookupData?.message || lookupData?.error || "Failed to load user")
  }

  const createResponse = await fetchWithRetry(
    getApiUrl("/api/user"),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildUserPayload(user, appRole)),
    },
    STARTUP_FETCH_OPTS
  )
  const createData = await parseJsonSafely(createResponse)

  if (!createResponse.ok || !createData?.user) {
    throw new Error(createData?.message || createData?.error || "Failed to create user")
  }

  return createData.user as BackendUser
}

export async function getBackendUser(clerkId: string): Promise<BackendUser | null> {
  const response = await fetchWithRetry(getApiUrl(`/api/user/get?clerkId=${clerkId}`), {}, STARTUP_FETCH_OPTS)
  const data = await parseJsonSafely(response)
  return response.ok && data?.user ? (data.user as BackendUser) : null
}

export interface UpdateOnboardingPayload {
  clerkId: string
  name?: string
  skills?: string
  experienceLevel?: string
  hourlyRate?: number
  completedOnboarding: boolean
  appRole: AppRole
}

export async function updateOnboarding(payload: UpdateOnboardingPayload): Promise<BackendUser> {
  const response = await fetchWithRetry(
    getApiUrl("/api/user/update"),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    STARTUP_FETCH_OPTS
  )
  const data = await parseJsonSafely(response)

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to update user")
  }

  return data.user as BackendUser
}

/** GET /api/user/me/experience — the signed-in specialist's past work. */
export async function getMyExperience(token: string): Promise<ExperienceEntry[]> {
  const response = await fetchWithRetry(getApiUrl("/api/user/me/experience"), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to load experience")
  }
  return data.experience as ExperienceEntry[]
}

/** PUT /api/user/me/experience — replaces the whole list. */
export async function saveMyExperience(experience: ExperienceEntry[], token: string): Promise<ExperienceEntry[]> {
  const response = await fetchWithRetry(
    getApiUrl("/api/user/me/experience"),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ experience }),
    },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to save experience")
  }
  return data.experience as ExperienceEntry[]
}

/**
 * PATCH /api/user/location with a label only. The backend replaces the whole
 * stored location, so callers must only use this when the text actually
 * changed (coordinates from GPS detection describe the old place then).
 */
export async function updateMyLocationLabel(label: string, token: string): Promise<BackendLocation> {
  const response = await fetchWithRetry(
    getApiUrl("/api/user/location"),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ label }),
    },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to save your area")
  }
  return data.location as BackendLocation
}
