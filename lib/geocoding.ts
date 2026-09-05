export interface DetectedLocation {
  label: string | null
  city: string | null
  latitude: number
  longitude: number
}

/**
 * Browser Geolocation only returns raw coordinates — there's no
 * `expo-location`-style native reverse-geocode on web. Reverse geocoding
 * itself happens server-side via /api/geocode (a thin proxy to Nominatim)
 * rather than calling Nominatim directly from here: their usage policy
 * prohibits client-side calls (browsers can't set a custom User-Agent at
 * all, which their policy requires), and doing it anyway got silently
 * rate-limited/blocked in a way that looked like an intermittent "location
 * detection is broken" bug. Never blocks job posting on this succeeding —
 * callers should fall back to a manual city input if this throws.
 */
async function reverseGeocode(latitude: number, longitude: number): Promise<{ label: string | null; city: string | null }> {
  const response = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`, {
    signal: AbortSignal.timeout(8000),
  })

  if (!response.ok) {
    throw new Error(`Reverse geocoding failed (HTTP ${response.status})`)
  }

  return response.json()
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser"))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, maximumAge: 60000 })
  })
}

export async function detectLocation(): Promise<DetectedLocation> {
  const position = await getCurrentPosition()
  const { latitude, longitude } = position.coords

  try {
    const { label, city } = await reverseGeocode(latitude, longitude)
    return { label, city, latitude, longitude }
  } catch (error) {
    console.error("[geocoding] Reverse geocode failed, using coordinates only:", error)
    return { label: null, city: null, latitude, longitude }
  }
}
