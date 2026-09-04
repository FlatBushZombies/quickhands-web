"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Locate, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const SERVICE_FILTERS = ["All", "Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry", "Moving"]
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "distance", label: "Closest" },
  { value: "budget_high", label: "Budget high" },
  { value: "client_rating", label: "Best clients" },
]

export function JobFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [locating, setLocating] = useState(false)

  const activeService = searchParams.get("selectedServices") || "All"
  const activeSort = searchParams.get("sortBy") || "newest"
  const nearbyOn = searchParams.get("nearbyOnly") === "true"

  function updateParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) next.delete(key)
      else next.set(key, value)
    }
    startTransition(() => router.push(`${pathname}?${next.toString()}`))
  }

  function handleNearMe() {
    if (nearbyOn) {
      updateParams({ nearbyOnly: null, latitude: null, longitude: null })
      return
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        updateParams({
          nearbyOnly: "true",
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        })
      },
      () => setLocating(false),
      { timeout: 10000 }
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {SERVICE_FILTERS.map((service) => {
          const active = service === "All" ? activeService === "All" : activeService === service
          return (
            <button
              key={service}
              type="button"
              onClick={() => updateParams({ selectedServices: service === "All" ? null : service })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {service}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateParams({ sortBy: opt.value })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeSort === opt.value ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Button type="button" size="sm" variant={nearbyOn ? "default" : "outline"} onClick={handleNearMe} disabled={locating}>
          {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Locate className="h-3.5 w-3.5" />}
          {nearbyOn ? "Near me: on" : "Near me"}
        </Button>
      </div>

      {isPending ? <div className="h-0.5 w-full animate-pulse rounded-full bg-primary/30" /> : null}
    </div>
  )
}
