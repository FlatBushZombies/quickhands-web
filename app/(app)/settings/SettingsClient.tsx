"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { ChevronDown, ChevronUp, Eye, Loader2, Plus, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="h-64 animate-pulse rounded-2xl bg-secondary" />
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
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-5xl">
      <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Set up your public bio page — a single link you can share anywhere, showing your rating, skills, and portfolio.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {settings?.profile.reviewSummary.reviewCount ? (
          <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {settings.profile.reviewSummary.averageRating.toFixed(1)} ({settings.profile.reviewSummary.reviewCount} reviews)
          </div>
        ) : null}
        {settings ? (
          settings.viewCount > 0 ? (
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              {settings.viewCount} {settings.viewCount === 1 ? "page view" : "page views"}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              No views yet
            </div>
          )
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <Label htmlFor="username" className="text-sm font-semibold text-foreground">
              Your bio link
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <span className="shrink-0 text-sm text-muted-foreground">{SITE_ORIGIN.replace(/^https?:\/\//, "")}/</span>
              <Input
                id="username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="your-name"
              />
            </div>
            {usernameHint ? (
              <p className={`mt-1.5 text-xs ${usernameStatus === "taken" ? "text-destructive" : "text-muted-foreground"}`}>
                {usernameHint}
              </p>
            ) : null}
            {settings?.isPublished && settings.username ? (
              <Link
                href={`/${settings.username}`}
                target="_blank"
                className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
              >
                View your live page →
              </Link>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <Label htmlFor="tagline" className="text-sm font-semibold text-foreground">
              Tagline
            </Label>
            <Textarea
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value.slice(0, 140))}
              placeholder="A short line about what you do"
              className="mt-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">{tagline.length}/140</p>

            <Label htmlFor="phone" className="mt-4 block text-sm font-semibold text-foreground">
              Phone
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +263 77 123 4567"
              className="mt-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">Powers the Call and WhatsApp buttons on your page.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold text-foreground">Links to show</p>
            <div className="mt-3 space-y-2">
              {([
                ["portfolio", "Portfolio"],
                ["hireMe", "Hire me on Quickhands"],
                ["call", "Call me"],
                ["whatsapp", "Message on WhatsApp"],
                ["email", "Email me"],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={smartLinks[key]}
                    onChange={(e) => setSmartLinks((current) => ({ ...current, [key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">Custom links</p>
              {customLinks.length < 8 ? (
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={addHeading}>
                    <Plus className="h-3.5 w-3.5" />
                    Add heading
                  </Button>
                  <Button size="sm" variant="outline" onClick={addCustomLink}>
                    <Plus className="h-3.5 w-3.5" />
                    Add link
                  </Button>
                </div>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Headings drop a plain text divider between groups of links — use the arrows to reorder.
            </p>
            <div className="mt-3 space-y-3">
              {customLinks.map((link, index) => {
                const isHeading = link.type === "heading"
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex shrink-0 flex-col">
                      <button
                        type="button"
                        onClick={() => moveCustomLink(index, -1)}
                        disabled={index === 0}
                        aria-label="Move up"
                        className="rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCustomLink(index, 1)}
                        disabled={index === customLinks.length - 1}
                        aria-label="Move down"
                        className="rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {isHeading ? (
                      <Input
                        value={link.label}
                        onChange={(e) => updateCustomLink(index, { label: e.target.value })}
                        placeholder="Section heading, e.g. “We are hiring!”"
                        className="flex-1"
                      />
                    ) : (
                      <>
                        <Input
                          value={link.label}
                          onChange={(e) => updateCustomLink(index, { label: e.target.value })}
                          placeholder="Label"
                          className="w-1/3"
                        />
                        <Input
                          value={link.url ?? ""}
                          onChange={(e) => updateCustomLink(index, { url: e.target.value })}
                          placeholder="https://…"
                          className="flex-1"
                        />
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => removeCustomLink(index)}
                      className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
              {customLinks.length === 0 ? <p className="text-xs text-muted-foreground">No custom links yet.</p> : null}
            </div>
          </div>

          {saveStatus === "error" ? <p className="text-sm text-destructive">{saveError}</p> : null}

          <Button className="w-full" onClick={handleSave} disabled={saveStatus === "saving" || usernameStatus === "taken"}>
            {saveStatus === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : saveStatus === "saved" ? "Saved" : "Save settings"}
          </Button>
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
  )
}
