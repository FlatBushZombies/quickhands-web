export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://quickhands-api.onrender.com").replace(/\/$/, "")

export function getApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * The API's free-tier host spins down after inactivity — the first request
 * after it's been idle can take 20-50s to wake it and sometimes drops
 * outright. This wraps fetch with a timeout and a couple of retries so that
 * scenario self-heals instead of surfacing as a hard error. Same shape as
 * the mobile apps' fetchWithRetry (client-app/lib/fetch.ts) — mutations
 * that create a resource should pass { retries: 0, timeoutMs: 45000 }
 * explicitly at the call site instead of these defaults, since a retried
 * "merely slow, not failed" request risks a duplicate with no idempotency
 * key to de-dupe on the backend.
 */
export async function fetchWithRetry(
  input: string,
  init: RequestInit = {},
  opts: { retries?: number; timeoutMs?: number; retryDelayMs?: number } = {}
): Promise<Response> {
  const { retries = 2, timeoutMs = 20000, retryDelayMs = 3000 } = opts
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(input, { ...init, signal: controller.signal })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      lastError = error
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
      }
    }
  }

  throw lastError
}

export async function parseJsonSafely(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}
