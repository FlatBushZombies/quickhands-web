"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const ASKED_KEY = "qh_location_prompted"

/**
 * Renders nothing. On mount, if the URL doesn't already carry a lat/lng,
 * asks the browser for the visitor's position once and folds it into the
 * current search as `lat`/`lng` — which re-runs the server search sorted
 * nearest-first. Silently does nothing on denial/unsupported browsers; the
 * page just keeps its default (rating/recency) order. Only asks once per
 * browser session so declining doesn't re-prompt on every search.
 */
export function UseNearestFirst() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("lat") || searchParams.get("lng")) return
    if (!("geolocation" in navigator)) return
    if (sessionStorage.getItem(ASKED_KEY)) return

    try {
      sessionStorage.setItem(ASKED_KEY, "1")
    } catch {
      // Private browsing etc. — fine to just ask again next time.
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("lat", String(position.coords.latitude))
        params.set("lng", String(position.coords.longitude))
        router.replace(`/specialists?${params.toString()}`, { scroll: false })
      },
      () => {
        // Denied or unavailable — leave the default order in place.
      },
      { maximumAge: 10 * 60 * 1000, timeout: 8000 }
    )
    // Only ever run once on mount; re-running on every searchParams change
    // would re-request location mid-session for no reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
