import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HireRedirect } from "@/components/specialists/HireRedirect"
import { getPublicBioProfile } from "@/lib/bio-api"

export const metadata: Metadata = {
  title: "Opening your conversation",
  robots: { index: false, follow: false },
}

interface PageProps {
  params: Promise<{ specialist: string }>
}

// Clerk user ids always look like "user_…", while a published bio username can
// only contain [a-z0-9-] — the two can never collide, so one route serves both
// ("Hire Now" from a portfolio page passes a username; from a search result a
// specialist without a published page passes their Clerk id directly).
const CLERK_ID_PATTERN = /^user_[A-Za-z0-9]+$/

export default async function HirePage({ params }: PageProps) {
  const { specialist } = await params

  if (CLERK_ID_PATTERN.test(specialist)) {
    return <HireRedirect clerkId={specialist} name={null} />
  }

  const profile = await getPublicBioProfile(specialist)
  if (!profile) {
    notFound()
  }

  return <HireRedirect clerkId={profile.clerkId ?? null} name={profile.name} />
}
