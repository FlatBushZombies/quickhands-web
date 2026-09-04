const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://quickhands-api.onrender.com").replace(/\/$/, "")

export interface PortfolioMedia {
  url: string
}

export interface PortfolioProject {
  id: number
  title: string
  description: string | null
  category: string | null
  projectUrl?: string | null
  media: PortfolioMedia[]
}

export interface BioSmartLinks {
  portfolio: boolean
  hireMe: boolean
  call: boolean
  whatsapp: boolean
  email: boolean
}

export interface BioCustomLink {
  label: string
  url: string
}

export interface BioReviewSummary {
  averageRating: number
  reviewCount: number
}

export interface BioTestimonial {
  reviewerName: string
  rating: number
  comment: string
  createdAt: string
}

export interface BioLocation {
  label: string | null
  city: string | null
}

export interface PublicBioProfile {
  username: string
  name: string
  imageUrl: string | null
  skills: string | null
  experienceLevel: string | null
  hourlyRate: number | string | null
  location: BioLocation | null
  tagline: string
  phone: string | null
  email: string | null
  smartLinks: BioSmartLinks
  customLinks: BioCustomLink[]
  reviewSummary: BioReviewSummary
  testimonials: BioTestimonial[]
  completedJobsCount: number
  projects: PortfolioProject[]
  memberSince: string
}

/**
 * Render's free-tier backend can take 30-60s to wake from a cold start —
 * a generous timeout plus short-lived ISR caching means most visitors hit
 * the cache instead of paying that cost directly, and the ones who don't
 * still get a real answer instead of a premature failure.
 */
export async function getPublicBioProfile(username: string): Promise<PublicBioProfile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bio/${encodeURIComponent(username)}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(45000),
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`Bio API returned ${response.status}`)
    }

    const data = await response.json()
    return data.success ? (data.data as PublicBioProfile) : null
  } catch (error) {
    console.error("[bio] Failed to load public profile:", error)
    return null
  }
}
