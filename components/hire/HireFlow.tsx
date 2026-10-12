"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { ArrowLeft, Briefcase, CalendarX, Loader2, MapPin, MessageCircle, Star } from "lucide-react"
import type { SpecialistSummary } from "@/lib/specialists-api"
import { bookAppointment, getSpecialistSlots, type AppointmentSlot, type Appointment } from "@/lib/appointments-api"
import { getConversationWithUser } from "@/lib/messaging-api"

const SLOT_LOOKAHEAD_DAYS = 14

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "Q"
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

function formatHourlyRate(rate: number | string | null) {
  const value = typeof rate === "string" ? Number(rate) : rate
  if (!value || Number.isNaN(value)) return null
  return `$${value % 1 === 0 ? value : value.toFixed(2)}/hr`
}

function dateKeyOf(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function buildDays(slots: AppointmentSlot[]) {
  const slotsByDay = new Map<string, AppointmentSlot[]>()
  for (const slot of slots) {
    const key = dateKeyOf(slot.start)
    if (!slotsByDay.has(key)) slotsByDay.set(key, [])
    slotsByDay.get(key)!.push(slot)
  }

  const days: { key: string; date: Date; slots: AppointmentSlot[] }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < SLOT_LOOKAHEAD_DAYS; i += 1) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    days.push({ key, date, slots: slotsByDay.get(key) ?? [] })
  }
  return days
}

type BookingState = { status: "idle" | "submitting" | "error" } | { status: "success"; appointment: Appointment }

export function HireFlow({ specialist }: { specialist: SpecialistSummary }) {
  const router = useRouter()
  const { getToken } = useAuth()

  const [slots, setSlots] = useState<AppointmentSlot[] | null>(null)
  const [slotsUnavailable, setSlotsUnavailable] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null)
  const [serviceType, setServiceType] = useState(specialist.skillList[0] ?? "")
  const [notes, setNotes] = useState("")
  const [booking, setBooking] = useState<BookingState>({ status: "idle" })
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [messaging, setMessaging] = useState<"idle" | "loading" | "error">("idle")
  const [messageError, setMessageError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const token = await getToken()
      if (!token || !active) {
        if (active) setSlotsUnavailable(true)
        return
      }
      const result = await getSpecialistSlots(specialist.clerkId, token, { slotMinutes: 60 })
      if (!active) return
      setSlots(result)
      const days = buildDays(result)
      setSelectedDay(days.find((d) => d.slots.length > 0)?.key ?? days[0]?.key ?? null)
    })()
    return () => {
      active = false
    }
  }, [specialist.clerkId, getToken])

  const days = useMemo(() => buildDays(slots ?? []), [slots])
  const activeDaySlots = days.find((d) => d.key === selectedDay)?.slots ?? []
  const hasAnySlots = (slots?.length ?? 0) > 0

  const messageSpecialist = useCallback(async () => {
    setMessaging("loading")
    setMessageError(null)
    const token = await getToken()
    if (!token) {
      setMessaging("error")
      setMessageError("Couldn't verify your session. Please sign in again.")
      return
    }
    const result = await getConversationWithUser(specialist.clerkId, token)
    if ("conversationId" in result) {
      router.push(`/messages/${result.conversationId}`)
      return
    }
    setMessaging("error")
    setMessageError(
      /yourself/i.test(result.error)
        ? "This is your own profile, so there's no one to message."
        : result.error
    )
  }, [getToken, router, specialist.clerkId])

  const confirmBooking = useCallback(async () => {
    if (!selectedSlot) return
    setBooking({ status: "submitting" })
    setBookingError(null)

    const token = await getToken()
    if (!token) {
      setBooking({ status: "error" })
      setBookingError("Couldn't verify your session. Please sign in again.")
      return
    }

    const result = await bookAppointment(
      {
        specialistClerkId: specialist.clerkId,
        serviceType: serviceType.trim() || undefined,
        scheduledStart: selectedSlot.start,
        scheduledEnd: selectedSlot.end,
        notes: notes.trim() || undefined,
      },
      token
    )

    if (result.status === "success") {
      setBooking({ status: "success", appointment: result.appointment })
      return
    }
    setBooking({ status: "error" })
    setBookingError(result.message)
  }, [getToken, notes, selectedSlot, serviceType, specialist.clerkId])

  const rateLabel = formatHourlyRate(specialist.hourlyRate)
  const locationLabel = specialist.location?.label || specialist.location?.city || null

  if (booking.status === "success") {
    const start = new Date(booking.appointment.scheduledStart)
    return (
      <div className="qh-hire-panel" role="status" aria-live="polite">
        <span className="qh-hire-eyebrow">Booked</span>
        <h1 className="qh-hire-panel-title">
          You&apos;re booked with {specialist.name}
        </h1>
        <p className="qh-hire-panel-body">
          {start.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at{" "}
          {start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}. {specialist.name} has been
          notified.
        </p>
        <div className="qh-hire-actions">
          <button type="button" onClick={messageSpecialist} className="qh-hire-btn qh-hire-btn-primary" disabled={messaging === "loading"}>
            {messaging === "loading" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <MessageCircle size={16} aria-hidden="true" />}
            Message {specialist.name.split(" ")[0]} to coordinate
          </button>
          <Link href="/specialists" className="qh-hire-btn qh-hire-btn-ghost">
            Back to search
          </Link>
        </div>
        {messageError ? <p className="qh-hire-error">{messageError}</p> : null}
      </div>
    )
  }

  return (
    <div>
      <Link href="/specialists" className="qh-hire-back">
        <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
        Back to search
      </Link>

      <div className="qh-hire-profile">
        {specialist.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={specialist.imageUrl} alt="" className="qh-hire-avatar" />
        ) : (
          <div aria-hidden="true" className="qh-hire-initials">
            {initialsOf(specialist.name)}
          </div>
        )}
        <div>
          <span className="qh-hire-eyebrow">Book a time with</span>
          <h1 className="qh-hire-h1">
            <em>{specialist.name}</em>
          </h1>
          <p className="qh-hire-meta">
            {specialist.reviewSummary.reviewCount > 0 ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Star size={14} strokeWidth={1.5} className="fill-warning text-warning" aria-hidden="true" />
                <strong style={{ color: "var(--ink-950)" }}>{specialist.reviewSummary.averageRating.toFixed(1)}</strong>
                ({specialist.reviewSummary.reviewCount})
              </span>
            ) : null}
            {locationLabel ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span className="qh-hire-meta-dot">·</span>
                <MapPin size={14} strokeWidth={1.5} aria-hidden="true" />
                {locationLabel}
              </span>
            ) : null}
            {rateLabel ? (
              <span>
                <span className="qh-hire-meta-dot">·</span> {rateLabel}
              </span>
            ) : null}
          </p>
          {specialist.skillList.length > 0 ? (
            <ul className="qh-hire-skills" aria-label={`${specialist.name}'s specialties`}>
              {specialist.skillList.map((skill) => (
                <li key={skill} className="qh-hire-skill">
                  {skill}
                </li>
              ))}
            </ul>
          ) : null}
          {specialist.bioUsername ? (
            <p style={{ marginTop: 12 }}>
              <Link href={`/${specialist.bioUsername}`} className="qh-hire-back" style={{ display: "inline-flex" }}>
                <Briefcase size={14} strokeWidth={1.5} aria-hidden="true" />
                View portfolio
              </Link>
            </p>
          ) : null}
        </div>
      </div>

      <section className="qh-hire-section" aria-labelledby="hire-slots-heading">
        <h2 id="hire-slots-heading" className="qh-hire-label">
          Choose a time
        </h2>

        {slots === null ? (
          <div className="qh-hire-skeleton" style={{ height: 160 }} aria-hidden="true" />
        ) : slotsUnavailable ? (
          <div className="qh-hire-panel">
            <CalendarX size={28} strokeWidth={1.5} aria-hidden="true" style={{ color: "var(--ink-400)" }} />
            <h2 className="qh-hire-panel-title">We couldn&apos;t load {specialist.name}&apos;s calendar</h2>
            <p className="qh-hire-panel-body">This usually clears up in a moment, or you can message them directly.</p>
            <div className="qh-hire-actions">
              <button type="button" onClick={messageSpecialist} className="qh-hire-btn qh-hire-btn-primary" disabled={messaging === "loading"}>
                <MessageCircle size={16} aria-hidden="true" />
                Message {specialist.name.split(" ")[0]}
              </button>
            </div>
            {messageError ? <p className="qh-hire-error">{messageError}</p> : null}
          </div>
        ) : !hasAnySlots ? (
          <div className="qh-hire-panel">
            <CalendarX size={28} strokeWidth={1.5} aria-hidden="true" style={{ color: "var(--ink-400)" }} />
            <h2 className="qh-hire-panel-title">{specialist.name} hasn&apos;t set their availability yet</h2>
            <p className="qh-hire-panel-body">Message them directly to arrange a time that works.</p>
            <div className="qh-hire-actions">
              <button type="button" onClick={messageSpecialist} className="qh-hire-btn qh-hire-btn-primary" disabled={messaging === "loading"}>
                {messaging === "loading" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <MessageCircle size={16} aria-hidden="true" />}
                Message {specialist.name.split(" ")[0]}
              </button>
            </div>
            {messageError ? <p className="qh-hire-error">{messageError}</p> : null}
          </div>
        ) : (
          <>
            <div className="qh-hire-days" role="tablist" aria-label="Pick a day">
              {days.map((day) => (
                <button
                  key={day.key}
                  type="button"
                  role="tab"
                  aria-pressed={day.key === selectedDay}
                  disabled={day.slots.length === 0}
                  onClick={() => {
                    setSelectedDay(day.key)
                    setSelectedSlot(null)
                  }}
                  className="qh-hire-day"
                  style={day.slots.length === 0 ? { opacity: 0.35, cursor: "default" } : undefined}
                >
                  <span className="qh-hire-day-name">{day.date.toLocaleDateString(undefined, { weekday: "short" })}</span>
                  <span className="qh-hire-day-num">{day.date.getDate()}</span>
                </button>
              ))}
            </div>

            {activeDaySlots.length > 0 ? (
              <div className="qh-hire-slots">
                {activeDaySlots.map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    aria-pressed={selectedSlot?.start === slot.start}
                    onClick={() => setSelectedSlot(slot)}
                    className="qh-hire-slot"
                  >
                    {new Date(slot.start).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                  </button>
                ))}
              </div>
            ) : (
              <p className="qh-hire-panel-body" style={{ marginTop: 16 }}>
                No open times this day — try another day on the calendar.
              </p>
            )}
          </>
        )}
      </section>

      {selectedSlot ? (
        <section className="qh-hire-form" aria-labelledby="hire-confirm-heading">
          <div>
            <h2 id="hire-confirm-heading" className="qh-hire-label" style={{ marginBottom: 12 }}>
              Confirm booking
            </h2>
            <div className="qh-hire-summary">
              {new Date(selectedSlot.start).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              {" · "}
              {new Date(selectedSlot.start).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
              {" – "}
              {new Date(selectedSlot.end).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
            </div>
          </div>

          <div className="qh-hire-field">
            <label htmlFor="hire-service">What do you need done?</label>
            <input
              id="hire-service"
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="e.g. Haircut, pipe repair, deep clean…"
              maxLength={255}
            />
          </div>

          <div className="qh-hire-field">
            <label htmlFor="hire-notes">Notes for {specialist.name.split(" ")[0]} (optional)</label>
            <textarea
              id="hire-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything they should know before they arrive"
              rows={3}
              maxLength={1000}
            />
          </div>

          <button type="button" onClick={confirmBooking} disabled={booking.status === "submitting"} className="qh-hire-btn qh-hire-btn-primary">
            {booking.status === "submitting" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
            Confirm booking
          </button>
          {booking.status === "error" && bookingError ? <p className="qh-hire-error">{bookingError}</p> : null}
        </section>
      ) : null}
    </div>
  )
}
