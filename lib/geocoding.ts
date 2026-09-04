export interface DetectedLocation {
  label: string | null
  city: string | null
  latitude: number
  longitude: number
}

/**
 * Browser Geolocation only returns raw coordinates — there's no
 * `expo-location`-style native reverse-geocode on web. Nominatim
 * (OpenStreetMap) is free and needs no API key/signup, just a descriptive
 * identifier per its usage policy: https://operations.osmfoundation.org/policies/nominatim/
 * Never blocks job posting on this succeeding — callers should fall back
 * to a manual city input if this throws.
 */
async function reverseGeocode(latitude: number, longitude: number): Promise<{ label: string | null; city: string | null }> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`

  const response = await fetch(url, {
    headers: { "Accept-Language": "en" },
    signal: AbortSignal.timeout(8000),
  })

  if (!response.ok) {
    throw new Error(`Reverse geocoding failed (HTTP ${response.status})`)
  }

  const data = await response.json()
  const address = data?.address || {}
  const city: string | null = address.city || address.town || address.village || address.county || null
  const label: string | null = data?.display_name ? String(data.display_name).split(",").slice(0, 2).join(",").trim() : city

  return { label, city }
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
