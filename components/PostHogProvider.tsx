"use client"

import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { useCookieConsent } from "@/components/cookie-consent/useCookieConsent"

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

let initialized = false

function initPostHog() {
  if (initialized || !POSTHOG_KEY) return
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Cookie consent hasn't been granted yet (or was declined) — start opted
    // out and let the consent-sync effect below opt in/out as the user's
    // choice changes, rather than capturing before they've agreed to it.
    opt_out_capturing_by_default: true,
    capture_pageview: false, // handled manually below for App Router route changes
    person_profiles: "identified_only",
  })
  initialized = true
}

/** Fires a $pageview on every route change — App Router has no built-in
 *  pageview event the way the old Pages Router router did. */
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!POSTHOG_KEY || posthog.has_opted_out_capturing()) return
    const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname
    posthog.capture("$pageview", { $current_url: url })
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { categories, isInitialized } = useCookieConsent()

  useEffect(() => {
    initPostHog()
  }, [])

  // Keep PostHog's capture state in sync with the cookie-consent banner's
  // analytics toggle — never capture ahead of explicit consent.
  useEffect(() => {
    if (!POSTHOG_KEY || !isInitialized) return
    if (categories.analytics) {
      posthog.opt_in_capturing()
    } else {
      posthog.opt_out_capturing()
    }
  }, [categories.analytics, isInitialized])

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  )
}
