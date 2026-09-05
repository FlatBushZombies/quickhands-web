import { NextResponse } from "next/server"

/**
 * Nominatim's usage policy explicitly prohibits calling it directly from
 * client-side/browser JavaScript: https://operations.osmfoundation.org/policies/nominatim/
 * "such usage should be avoided because it results in a large number of
 * users sharing the same referrer/User-Agent, generating unidentifiable
 * traffic that we cannot allow". Browsers also can't set a custom
 * User-Agent header at all (it's a forbidden header), so a direct
 * browser->Nominatim call can never comply. This route proxies the
 * request server-side, where a real identifying User-Agent can be set,
 * fixing the previously-intermittent "location detection" failures.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&zoom=14&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "QuickHands-Web/1.0 (https://quickhands-web.vercel.app)",
        },
        signal: AbortSignal.timeout(8000),
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: `Nominatim returned ${response.status}` }, { status: 502 })
    }

    const data = await response.json()
    const address = data?.address || {}
    const city: string | null = address.city || address.town || address.village || address.county || null
    const label: string | null = data?.display_name
      ? String(data.display_name).split(",").slice(0, 2).join(",").trim()
      : city

    return NextResponse.json({ label, city })
  } catch (error) {
    console.error("[geocode] Reverse geocode failed:", error)
    return NextResponse.json({ error: "Reverse geocoding failed" }, { status: 502 })
  }
}
