import { fetchWithRetry, getApiUrl, parseJsonSafely } from "@/lib/fetch-client"

export interface AvailabilityWindow {
  id?: number
  dayOfWeek: number // 0 = Sunday .. 6 = Saturday
  dayName?: string
  startTime: string // "HH:MM", 24h
  endTime: string
}

export interface AppointmentSlot {
  start: string // ISO instant
  end: string
}

export type AppointmentStatus = "confirmed" | "cancelled" | "completed"

export interface Appointment {
  id: number
  specialistClerkId: string
  clientClerkId: string
  serviceType: string | null
  scheduledStart: string
  scheduledEnd: string
  status: AppointmentStatus
  cancelledBy: string | null
  cancelledAt: string | null
  notes: string | null
  createdAt: string
}

/** GET /api/availability/me — the signed-in specialist's weekly working hours. */
export async function getMyAvailability(token: string): Promise<AvailabilityWindow[]> {
  const response = await fetchWithRetry(getApiUrl("/api/availability/me"), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJsonSafely(response)
  return response.ok && data?.success ? (data.data as AvailabilityWindow[]) : []
}

/** PUT /api/availability/me — replaces the whole weekly schedule. */
export async function setMyAvailability(windows: AvailabilityWindow[], token: string): Promise<AvailabilityWindow[]> {
  const response = await fetchWithRetry(
    getApiUrl("/api/availability/me"),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ windows }),
    },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to save your working hours")
  }
  return data.data as AvailabilityWindow[]
}

/**
 * GET /api/availability/:clerkId/slots — the open booking slots for a
 * specialist. Requires sign-in (same as the rest of the hire flow) but no
 * special role; any signed-in client can look.
 */
export async function getSpecialistSlots(
  specialistClerkId: string,
  token: string,
  opts: { from?: string; to?: string; slotMinutes?: number } = {}
): Promise<AppointmentSlot[]> {
  const params = new URLSearchParams()
  if (opts.from) params.set("from", opts.from)
  if (opts.to) params.set("to", opts.to)
  if (opts.slotMinutes) params.set("slotMinutes", String(opts.slotMinutes))

  const response = await fetchWithRetry(
    getApiUrl(`/api/availability/${encodeURIComponent(specialistClerkId)}/slots?${params.toString()}`),
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await parseJsonSafely(response)
  return response.ok && data?.success ? (data.data as AppointmentSlot[]) : []
}

export type BookAppointmentResult = { status: "success"; appointment: Appointment } | { status: "error"; message: string }

/** POST /api/appointments — books a specific open slot. No retries: this creates a resource. */
export async function bookAppointment(
  payload: { specialistClerkId: string; serviceType?: string; scheduledStart: string; scheduledEnd: string; notes?: string },
  token: string
): Promise<BookAppointmentResult> {
  try {
    const response = await fetchWithRetry(
      getApiUrl("/api/appointments"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      },
      { retries: 0, timeoutMs: 45000 }
    )
    const data = await parseJsonSafely(response)
    if (!response.ok || !data?.success) {
      return { status: "error", message: data?.message || `Couldn't book that slot (${response.status})` }
    }
    return { status: "success", appointment: data.data as Appointment }
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Network error" }
  }
}

/** GET /api/appointments/me — appointments where the signed-in user is either side. */
export async function getMyAppointments(token: string, upcomingOnly = false): Promise<Appointment[]> {
  const response = await fetchWithRetry(getApiUrl(`/api/appointments/me?upcomingOnly=${upcomingOnly}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJsonSafely(response)
  return response.ok && data?.success ? (data.data as Appointment[]) : []
}

export async function cancelAppointment(id: number, token: string): Promise<Appointment> {
  const response = await fetchWithRetry(
    getApiUrl(`/api/appointments/${id}/cancel`),
    { method: "PATCH", headers: { Authorization: `Bearer ${token}` } },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to cancel appointment")
  }
  return data.data as Appointment
}

export async function completeAppointment(id: number, token: string): Promise<Appointment> {
  const response = await fetchWithRetry(
    getApiUrl(`/api/appointments/${id}/complete`),
    { method: "PATCH", headers: { Authorization: `Bearer ${token}` } },
    { retries: 0, timeoutMs: 45000 }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to mark appointment completed")
  }
  return data.data as Appointment
}
