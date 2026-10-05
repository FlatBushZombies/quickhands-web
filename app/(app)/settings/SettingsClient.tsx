"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { ChevronDown, ChevronUp, Eye, Loader2, Plus, Star, Trash2 } from "lucide-react"
import { authFontClassName } from "@/components/auth/fonts"
import {
  checkUsernameAvailable,
  getMyBioSettings,
  updateMyBioSettings,
  type MyBioSettings,
} from "@/lib/bio-api-client"
import type { BioCustomLink } from "@/lib/bio-api"
import { BioPreview } from "@/components/bio/BioPreview"

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "current"
type SaveStatus = "idle" | "saving" | "saved" | "error"

const SITE_ORIGIN =
  typeof window !== "undefined" ? window.location.origin : "https://quickhands-web.vercel.app"

/*
 * Artifact design tokens for the settings page, scoped to .qh-set. Values are
 * copied from the auth screen, the client landing and the onboarding flow.
 * The viewer's role is not known to this page, so the client green is used.
 */
const SETTINGS_CSS = `
.qh-set{
--ink-950:#0A0A0B;--ink-600:#4A4A50;--ink-500:#6E6E75;--ink-400:#9A9AA0;--ink-100:#EFEFF0;--ink-50:#F6F6F5;
--paper:#FBFBFA;--white:#FFFFFF;--signal-500:#2F54FF;--danger-600:#C9302C;
--accent:#108600;--accent-hover:#0D6E00;--accent-tint:rgba(16,134,0,.08);
--fg-1:var(--ink-950);--fg-2:var(--ink-600);--fg-3:var(--ink-500);
--border-hairline:rgba(10,10,11,.08);--border-default:rgba(10,10,11,.12);
--shadow-hairline:0 0 0 1px var(--border-hairline);
--shadow-inset:inset 0 0 0 1px var(--border-default);
--ease-out:cubic-bezier(.22,1,.36,1);--dur-fast:140ms;
--font-sans:var(--font-geist),ui-sans-serif,system-ui,sans-serif;
--font-mono:var(--font-geist-mono),ui-monospace,Menlo,monospace;
--font-serif:var(--font-instrument-serif),ui-serif,Georgia,serif;
--ls-heading:-0.035em;--ls-body:-0.005em;--ls-mono:0.06em;
background:var(--paper);color:var(--fg-1);font:400 15px/1.55 var(--font-sans);letter-spacing:var(--ls-body);
-webkit-font-smoothing:antialiased;min-height:100%;
}
.qh-set :focus-visible{outline:2px solid var(--signal-500);outline-offset:2px}
.qh-set ::selection{background:var(--ink-950);color:var(--white)}
.qh-set .qh-set-h1{margin:0;font-family:var(--font-sans);font-weight:500;font-size:clamp(32px,4.6vw,40px);line-height:1.05;letter-spacing:var(--ls-heading);color:var(--fg-1)}
.qh-set .qh-set-em{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-0.02em;color:var(--accent)}
.qh-set .qh-set-lead{margin:10px 0 0;color:var(--fg-2);text-wrap:pretty}
.qh-set .qh-set-eyebrow{margin:0;font-family:var(--font-mono);font-size:11px;line-height:1.3;font-weight:400;letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)}
.qh-set .qh-set-label{display:block;font:500 13px/18px var(--font-sans);color:var(--fg-1)}
.qh-set .qh-set-hint{margin:8px 0 0;font:400 12px/1.4 var(--font-sans);color:var(--fg-2)}
.qh-set .qh-set-card{background:var(--white);border-radius:20px;box-shadow:var(--shadow-hairline);padding:24px}
.qh-set .qh-set-chip{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:999px;background:var(--white);box-shadow:var(--shadow-inset);font:500 13px/1 var(--font-sans);color:var(--fg-1)}
.qh-set .qh-set-chip-muted{font-weight:400;color:var(--fg-2)}
.qh-set .qh-set-field{display:block;width:100%;box-sizing:border-box;height:48px;margin:0;padding:0 14px;border:0;border-radius:10px;background:var(--white);box-shadow:var(--shadow-inset);font:400 15px/1 var(--font-sans);letter-spacing:var(--ls-body);color:var(--fg-1);outline:none;transition:box-shadow var(--dur-fast) var(--ease-out)}
.qh-set textarea.qh-set-field{height:auto;min-height:88px;padding:12px 14px;line-height:1.5;resize:vertical}
.qh-set .qh-set-field::placeholder{color:var(--fg-3);opacity:1}
.qh-set .qh-set-field:focus,.qh-set .qh-set-field:focus-visible{outline:none;box-shadow:inset 0 0 0 1.5px var(--accent)}
.qh-set .qh-set-group{display:flex;align-items:center;width:100%;box-sizing:border-box;height:48px;padding-left:14px;border-radius:10px;background:var(--white);box-shadow:var(--shadow-inset);transition:box-shadow var(--dur-fast) var(--ease-out)}
.qh-set .qh-set-group:focus-within{box-shadow:inset 0 0 0 1.5px var(--accent)}
.qh-set .qh-set-prefix{flex-shrink:0;font:400 14px/1 var(--font-sans);color:var(--fg-3);white-space:nowrap}
.qh-set .qh-set-bare{flex:1;min-width:0;height:100%;margin:0;padding:0 14px 0 4px;border:0;background:transparent;font:400 15px/1 var(--font-sans);letter-spacing:var(--ls-body);color:var(--fg-1);outline:none}
.qh-set .qh-set-bare::placeholder{color:var(--fg-3);opacity:1}
.qh-set .qh-set-link{font:500 13px/1.4 var(--font-sans);color:var(--accent);text-decoration:underline;text-decoration-color:rgba(16,134,0,.32);text-underline-offset:3px;transition:text-decoration-color var(--dur-fast) var(--ease-out)}
.qh-set .qh-set-link:hover{text-decoration-color:currentColor}
.qh-set .qh-set-option{display:flex;align-items:center;gap:10px;font:400 14px/1.4 var(--font-sans);color:var(--fg-1);cursor:pointer}
.qh-set .qh-set-check{appearance:none;-webkit-appearance:none;flex-shrink:0;width:18px;height:18px;margin:0;border:0;border-radius:6px;background-color:var(--white);box-shadow:var(--shadow-inset);cursor:pointer;transition:background-color var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out)}
.qh-set .qh-set-check:checked{background-color:var(--accent);box-shadow:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 6.2l2.2 2.2 4.8-4.8' fill='none' stroke='%23FFFFFF' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center;background-size:12px 12px}
.qh-set .qh-set-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 14px;border:0;border-radius:999px;background:var(--white);box-shadow:var(--shadow-inset);font:500 13px/1 var(--font-sans);letter-spacing:-0.01em;color:var(--fg-1);cursor:pointer;transition:background var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out),filter var(--dur-fast) var(--ease-out)}
.qh-set .qh-set-btn:hover:not(:disabled){background:var(--ink-50)}
.qh-set .qh-set-btn:active:not(:disabled){transform:scale(.98)}
.qh-set .qh-set-btn-primary{width:100%;height:52px;padding:0 24px;background:var(--accent);box-shadow:none;color:var(--white);font:500 15px/1 var(--font-sans);letter-spacing:-0.01em}
.qh-set .qh-set-btn-primary:hover:not(:disabled){background:var(--accent-hover)}
.qh-set .qh-set-btn:disabled{opacity:.45;cursor:not-allowed}
.qh-set .qh-set-icon{display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:var(--fg-3);cursor:pointer;transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)}
.qh-set .qh-set-icon:hover:not(:disabled){background:var(--ink-50);color:var(--fg-1)}
.qh-set .qh-set-icon-remove{width:36px;height:36px;border-radius:999px}
.qh-set .qh-set-icon-remove:hover:not(:disabled){color:var(--danger-600)}
.qh-set .qh-set-icon-nudge{width:24px;height:20px;border-radius:6px}
.qh-set .qh-set-icon:disabled{opacity:.3;cursor:default}
.qh-set .qh-set-row{border-radius:14px;background:var(--paper);box-shadow:var(--shadow-hairline);padding:10px}
.qh-set .qh-set-skeleton{height:256px;border-radius:20px;background:var(--ink-100)}
.qh-set .qh-set-anim{animation:qhSetFade 260ms var(--ease-out) both}
@keyframes qhSetFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.qh-set *{transition:none!important;animation:none!important}}
`

const FIELD_STYLE = { minWidth: 0 } as const

export default function SettingsClient() {
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<MyBioSettings | null>(null)

  const [username, setUsername] = useState("")
  const [tagline, setTagline] = useState("")
  const [phone, setPhone] = useState("")
  const [smartLinks, setSmartLinks] = useState({ portfolio: true, hireMe: true, call: true, whatsapp: true, email: true })
  const [customLinks, setCustomLinks] = useState<BioCustomLink[]>([])

  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle")
  const [usernameReason, setUsernameReason] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [saveError, setSaveError] = useState("")
  const usernameCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const token = await getToken()
        if (!token) return
        const data = await getMyBioSettings(token)
        setSettings(data)
        setUsername(data.username || data.suggestedUsername)
        setTagline(data.tagline)
        setPhone(data.phone)
        setSmartLinks(data.smartLinks)
        setCustomLinks(data.customLinks)
        setUsernameStatus(data.username ? "current" : "idle")
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUsernameChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setUsername(normalized)

    if (usernameCheckTimer.current) clearTimeout(usernameCheckTimer.current)

    if (!normalized || normalized === settings?.username) {
      setUsernameStatus(normalized && normalized === settings?.username ? "current" : "idle")
      return
    }

    setUsernameStatus("checking")
    usernameCheckTimer.current = setTimeout(async () => {
      const token = await getToken()
      if (!token) return
      const result = await checkUsernameAvailable(normalized, token)
      setUsernameStatus(result.available ? "available" : "taken")
      setUsernameReason(result.reason)
    }, 500)
  }

  const addCustomLink = () => {
    if (customLinks.length >= 8) return
    setCustomLinks((current) => [...current, { type: "link", label: "", url: "" }])
  }

  const addHeading = () => {
    if (customLinks.length >= 8) return
    setCustomLinks((current) => [...current, { type: "heading", label: "" }])
  }

  const updateCustomLink = (index: number, patch: Partial<BioCustomLink>) => {
    setCustomLinks((current) => current.map((link, i) => (i === index ? { ...link, ...patch } : link)))
  }

  const removeCustomLink = (index: number) => {
    setCustomLinks((current) => current.filter((_, i) => i !== index))
  }

  // The array order IS the reorder mechanism — the backend just persists
  // whatever order arrives, there's no separate position field to keep in
  // sync (see bio.service.js `sanitizeCustomLinks`).
  const moveCustomLink = (index: number, direction: -1 | 1) => {
    setCustomLinks((current) => {
      const target = index + direction
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const handleSave = async () => {
    setSaveStatus("saving")
    setSaveError("")
    try {
      const token = await getToken()
      if (!token) throw new Error("Not signed in")
      const updated = await updateMyBioSettings(
        {
          username: username || undefined,
          tagline,
          phone,
          smartLinks,
          customLinks: customLinks.filter((link) =>
            link.type === "heading" ? link.label.trim() : link.label.trim() && (link.url ?? "").trim()
          ),
        },
        token
      )
      setSettings(updated)
      setUsernameStatus(updated.username ? "current" : "idle")
      setSaveStatus("saved")
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save")
      setSaveStatus("error")
    }
  }

  if (loading) {
    return (
      <div className={`qh-set ${authFontClassName}`}>
        <style>{SETTINGS_CSS}</style>
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <div className="qh-set-skeleton animate-pulse" />
        </div>
      </div>
    )
  }

  const usernameHint =
    usernameStatus === "checking"
      ? "Checking availability…"
      : usernameStatus === "available"
        ? "Available"
        : usernameStatus === "taken"
          ? usernameReason || "Already taken"
          : usernameStatus === "current"
            ? "Your current bio link"
            : null

  return (
    <div className={`qh-set ${authFontClassName}`}>
      <style>{SETTINGS_CSS}</style>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-5xl">
        <h1 className="qh-set-h1">
          <em className="qh-set-em">Settings</em>
        </h1>
        <p className="qh-set-lead" style={{ fontSize: 15 }}>
          Set up your public bio page — a single link you can share anywhere, showing your rating, skills, and portfolio.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {settings?.profile.reviewSummary.reviewCount ? (
            <div className="qh-set-chip">
              <Star className="h-3.5 w-3.5" style={{ fill: "currentColor" }} />
              {settings.profile.reviewSummary.averageRating.toFixed(1)} ({settings.profile.reviewSummary.reviewCount} reviews)
            </div>
          ) : null}
          {settings ? (
            settings.viewCount > 0 ? (
              <div className="qh-set-chip">
                <Eye className="h-3.5 w-3.5" style={{ color: "var(--fg-2)" }} />
                {settings.viewCount} {settings.viewCount === 1 ? "page view" : "page views"}
              </div>
            ) : (
              <div className="qh-set-chip qh-set-chip-muted">
                <Eye className="h-3.5 w-3.5" />
                No views yet
              </div>
            )
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4" style={FIELD_STYLE}>
            <div className="qh-set-card">
              <label htmlFor="username" className="qh-set-label">
                Your bio link
              </label>
              <div className="mt-3">
                <div className="qh-set-group">
                  <span className="qh-set-prefix">{SITE_ORIGIN.replace(/^https?:\/\//, "")}/</span>
                  <input
                    id="username"
                    className="qh-set-bare"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="your-name"
                  />
                </div>
              </div>
              {usernameHint ? (
                <p className="qh-set-hint" style={usernameStatus === "taken" ? { color: "var(--danger-600)" } : undefined}>
                  {usernameHint}
                </p>
              ) : null}
              {settings?.isPublished && settings.username ? (
                <Link
                  href={`/${settings.username}`}
                  target="_blank"
                  className="qh-set-link mt-3 inline-block"
                >
                  View your live page →
                </Link>
              ) : null}
            </div>

            <div className="qh-set-card">
              <label htmlFor="tagline" className="qh-set-label">
                Tagline
              </label>
              <textarea
                id="tagline"
                className="qh-set-field"
                style={{ marginTop: 12, height: "auto", minHeight: 88, padding: "12px 14px", lineHeight: 1.5 }}
                value={tagline}
                onChange={(e) => setTagline(e.target.value.slice(0, 140))}
                placeholder="A short line about what you do"
              />
              <p className="qh-set-hint">{tagline.length}/140</p>

              <label htmlFor="phone" className="qh-set-label mt-5 block">
                Phone
              </label>
              <input
                id="phone"
                className="qh-set-field"
                style={{ marginTop: 12 }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +263 77 123 4567"
              />
              <p className="qh-set-hint">Powers the Call and WhatsApp buttons on your page.</p>
            </div>

            <div className="qh-set-card">
              <p className="qh-set-eyebrow">Links to show</p>
              <div className="mt-4 space-y-3">
                {([
                  ["portfolio", "Portfolio"],
                  ["hireMe", "Hire me on Quickhands"],
                  ["call", "Call me"],
                  ["whatsapp", "Message on WhatsApp"],
                  ["email", "Email me"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="qh-set-option">
                    <input
                      type="checkbox"
                      className="qh-set-check"
                      checked={smartLinks[key]}
                      onChange={(e) => setSmartLinks((current) => ({ ...current, [key]: e.target.checked }))}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="qh-set-card">
              <div className="flex items-center justify-between gap-2">
                <p className="qh-set-eyebrow">Custom links</p>
                {customLinks.length < 8 ? (
                  <div className="flex shrink-0 gap-2">
                    <button type="button" className="qh-set-btn" onClick={addHeading}>
                      <Plus className="h-3.5 w-3.5" />
                      Add heading
                    </button>
                    <button type="button" className="qh-set-btn" onClick={addCustomLink}>
                      <Plus className="h-3.5 w-3.5" />
                      Add link
                    </button>
                  </div>
                ) : null}
              </div>
              <p className="qh-set-hint" style={{ marginTop: 10 }}>
                Headings drop a plain text divider between groups of links — use the arrows to reorder.
              </p>
              <div className="mt-4 space-y-3">
                {customLinks.map((link, index) => {
                  const isHeading = link.type === "heading"
                  return (
                    <div key={index} className="qh-set-row flex items-center gap-2">
                      <div className="flex shrink-0 flex-col">
                        <button
                          type="button"
                          onClick={() => moveCustomLink(index, -1)}
                          disabled={index === 0}
                          aria-label="Move up"
                          className="qh-set-icon qh-set-icon-nudge"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCustomLink(index, 1)}
                          disabled={index === customLinks.length - 1}
                          aria-label="Move down"
                          className="qh-set-icon qh-set-icon-nudge"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {isHeading ? (
                        <input
                          value={link.label}
                          onChange={(e) => updateCustomLink(index, { label: e.target.value })}
                          placeholder="Section heading, e.g. “We are hiring!”"
                          className="qh-set-field"
                          style={{ flex: 1, minWidth: 0 }}
                        />
                      ) : (
                        <>
                          <input
                            value={link.label}
                            onChange={(e) => updateCustomLink(index, { label: e.target.value })}
                            placeholder="Label"
                            className="qh-set-field"
                            style={{ flex: "0 0 33%", width: "33%", minWidth: 0 }}
                          />
                          <input
                            value={link.url ?? ""}
                            onChange={(e) => updateCustomLink(index, { url: e.target.value })}
                            placeholder="https://…"
                            className="qh-set-field"
                            style={{ flex: 1, minWidth: 0 }}
                          />
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => removeCustomLink(index)}
                        className="qh-set-icon qh-set-icon-remove shrink-0"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
                {customLinks.length === 0 ? <p className="qh-set-hint" style={{ marginTop: 0 }}>No custom links yet.</p> : null}
              </div>
            </div>

            {saveStatus === "error" ? (
              <p role="alert" style={{ margin: 0, font: "400 13px/1.45 var(--font-sans)", color: "var(--danger-600)" }}>
                {saveError}
              </p>
            ) : null}

            <button
              type="button"
              className="qh-set-btn qh-set-btn-primary"
              onClick={handleSave}
              disabled={saveStatus === "saving" || usernameStatus === "taken"}
            >
              {saveStatus === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : saveStatus === "saved" ? "Saved" : "Save settings"}
            </button>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <BioPreview
              name={settings?.profile.name || ""}
              imageUrl={settings?.profile.imageUrl ?? null}
              skills={settings?.profile.skills ?? null}
              experienceLevel={settings?.profile.experienceLevel ?? null}
              hourlyRate={settings?.profile.hourlyRate ?? null}
              reviewCount={settings?.profile.reviewSummary.reviewCount ?? 0}
              averageRating={settings?.profile.reviewSummary.averageRating ?? 0}
              tagline={tagline}
              phone={phone}
              smartLinks={smartLinks}
              customLinks={customLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
