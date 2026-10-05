"use client"

import { useEffect, useState } from "react"
import { getApiUrl } from "@/lib/fetch-client"

export type Stats = { specialists: number; jobsPosted: number; categories: number; averageRating: number | null }

/** Public marketplace counts for the landing pages. Null until loaded, or when the API is unreachable. */
export function useMarketplaceStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch(getApiUrl("/api/stats/public"))
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!cancelled && payload?.success) setStats(payload.data as Stats)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])
  return stats
}
