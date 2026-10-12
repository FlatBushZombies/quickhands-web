"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { getMyAvailability, setMyAvailability, type AvailabilityWindow } from "@/lib/appointments-api"
import { css, G, Ico, Ix } from "@/components/pro-account/ui"

const CAPTION = "font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)"
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const DEFAULT_START = "09:00"
const DEFAULT_END = "17:00"

type DayRow = { enabled: boolean; startTime: string; endTime: string }

function toRows(windows: AvailabilityWindow[]): DayRow[] {
  const rows: DayRow[] = DAYS.map(() => ({ enabled: false, startTime: DEFAULT_START, endTime: DEFAULT_END }))
  // Only the first window per day is editable here — specialists with a split
  // schedule (e.g. two shifts) keep whatever else they set elsewhere; this UI
  // just won't show the second row.
  for (const w of windows) {
    if (!rows[w.dayOfWeek].enabled) {
      rows[w.dayOfWeek] = { enabled: true, startTime: w.startTime, endTime: w.endTime }
    }
  }
  return rows
}

function toWindows(rows: DayRow[]): { dayOfWeek: number; startTime: string; endTime: string }[] {
  return rows
    .map((row, dayOfWeek) => ({ ...row, dayOfWeek }))
    .filter((row) => row.enabled)
    .map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime }))
}

/**
 * Lets a specialist set the recurring weekly hours clients can book them
 * against (GET/PUT /api/availability/me). This is what makes the calendar
 * on /hire/[specialist] show real open slots instead of staying empty.
 */
export function AvailabilityCard() {
  const { getToken } = useAuth()
  const [rows, setRows] = useState<DayRow[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const token = await getToken()
      if (!token) return
      const windows = await getMyAvailability(token)
      if (active) setRows(toRows(windows))
    })()
    return () => {
      active = false
    }
  }, [getToken])

  if (!rows) {
    return (
      <div style={css("padding:28px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)")}>
        <div style={css(CAPTION)}>Working hours</div>
        <div style={css("height:120px;border-radius:var(--radius-md);background:var(--ink-100);margin-top:14px")} aria-hidden="true" />
      </div>
    )
  }

  function updateRow(index: number, patch: Partial<DayRow>) {
    setRows((prev) => {
      if (!prev) return prev
      const next = [...prev]
      next[index] = { ...next[index], ...patch }
      return next
    })
    setStatus("idle")
  }

  async function save() {
    if (!rows) return
    setSaving(true)
    setStatus("idle")
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Couldn't verify your session. Please sign in again.")
      await setMyAvailability(toWindows(rows), token)
      setStatus("saved")
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Failed to save your working hours")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={css("padding:28px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)")}>
      <div style={css("display:flex;justify-content:space-between;align-items:center;gap:12px")}>
        <span style={css(CAPTION)}>Working hours</span>
        <span style={css("font:var(--text-small);color:var(--fg-3)")}>Clients can only book inside these hours</span>
      </div>

      <div style={css("display:flex;flex-direction:column;margin-top:8px")}>
        {DAYS.map((day, index) => {
          const row = rows[index]
          return (
            <div key={day} style={css("display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--border-hairline)")}>
              <Ix
                as="button"
                aria-pressed={row.enabled}
                onClick={() => updateRow(index, { enabled: !row.enabled })}
                base={`width:40px;height:24px;border-radius:999px;border:0;flex-shrink:0;background:${row.enabled ? G : "var(--ink-200,#D8D8DB)"};position:relative;cursor:pointer;transition:background 140ms`}
              >
                <span
                  style={css(
                    `position:absolute;top:2px;left:${row.enabled ? "18px" : "2px"};width:20px;height:20px;border-radius:50%;background:var(--white);transition:left 140ms`
                  )}
                />
              </Ix>
              <span style={css("width:96px;font:500 14px/1.3 var(--font-sans)")}>{day}</span>
              {row.enabled ? (
                <div style={css("display:flex;align-items:center;gap:8px;flex:1")}>
                  <input
                    type="time"
                    value={row.startTime}
                    onChange={(e) => updateRow(index, { startTime: e.target.value })}
                    style={css("height:36px;padding:0 10px;border:0;border-radius:var(--radius-md);background:var(--ink-100);font:14px/1 var(--font-sans)")}
                  />
                  <span style={css("color:var(--fg-3)")}>to</span>
                  <input
                    type="time"
                    value={row.endTime}
                    onChange={(e) => updateRow(index, { endTime: e.target.value })}
                    style={css("height:36px;padding:0 10px;border:0;border-radius:var(--radius-md);background:var(--ink-100);font:14px/1 var(--font-sans)")}
                  />
                </div>
              ) : (
                <span style={css("flex:1;color:var(--fg-3)")}>Unavailable</span>
              )}
            </div>
          )
        })}
      </div>

      <div style={css("display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:16px")}>
        {status === "saved" ? (
          <span style={css(`display:inline-flex;align-items:center;gap:6px;${CAPTION};color:${G}`)}>
            <Ico name="check" size={13} />
            Saved
          </span>
        ) : null}
        {status === "error" && error ? <span style={css(`font:var(--text-small);color:#C2410C`)}>{error}</span> : null}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={css(`height:40px;padding:0 18px;border:0;border-radius:999px;background:${G};color:var(--white);font:500 14px/1 var(--font-sans);cursor:pointer;opacity:${saving ? 0.6 : 1}`)}
        >
          {saving ? "Saving…" : "Save working hours"}
        </button>
      </div>
    </div>
  )
}
