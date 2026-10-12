import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingNav } from "@/components/client-landing/LandingNav"
import { Footer } from "@/components/Footer"
import { HireFlow } from "@/components/hire/HireFlow"
import { HIRE_CSS, HIRE_ROOT_CLASS } from "@/components/hire/hire-design"
import { getPublicBioProfile } from "@/lib/bio-api"
import { getPublicSpecialist } from "@/lib/specialists-api"

export const metadata: Metadata = {
  title: "Book a specialist",
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
  const { specialist: identifier } = await params

  const clerkId = CLERK_ID_PATTERN.test(identifier)
    ? identifier
    : (await getPublicBioProfile(identifier))?.clerkId ?? null

  const specialist = clerkId ? await getPublicSpecialist(clerkId) : null
  if (!specialist) {
    notFound()
  }

  return (
    <div className={HIRE_ROOT_CLASS}>
      <style>{HIRE_CSS}</style>
      <LandingNav />
      <main className="qh-hire-main">
        <div className="qh-hire-wrap">
          <HireFlow specialist={specialist} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
