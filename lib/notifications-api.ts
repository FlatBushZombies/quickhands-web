import { fetchWithRetry, getApiUrl, parseJsonSafely } from "@/lib/fetch-client"

export interface AppNotification {
  id: number
  userId: string
  jobId: number | null
  message: string
  read: boolean
  type: string | null
  conversationId: string | null
  createdAt: string
}

// No auth required on these routes (clerkId is the URL param, same as the
// mobile apps' usage) — no CLERK_SECRET_KEYS dependency here.
const FETCH_OPTS = { retries: 1, timeoutMs: 10000, retryDelayMs: 2000 }

export async function getMyNotifications(clerkId: string): Promise<AppNotification[]> {
  try {
    const response = await fetchWithRetry(getApiUrl(`/api/notifications/by-clerk/${clerkId}`), {}, FETCH_OPTS)
    const data = await parseJsonSafely(response)
    if (!response.ok || !data?.success) return []
    return data.notifications as AppNotification[]
  } catch {
    return []
  }
}

export async function markNotificationRead(id: number): Promise<void> {
  await fetchWithRetry(
    getApiUrl(`/api/notifications/${id}/read`),
    { method: "PATCH" },
    { retries: 0, timeoutMs: 8000 }
  ).catch(() => {})
}

export async function markAllNotificationsRead(clerkId: string): Promise<void> {
  await fetchWithRetry(
    getApiUrl(`/api/notifications/by-clerk/${clerkId}/read`),
    { method: "PATCH" },
    { retries: 0, timeoutMs: 8000 }
  ).catch(() => {})
}
