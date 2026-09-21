import type { MetadataRoute } from "next"
import { listJobs } from "@/lib/jobs-api"

const BASE_URL = "https://quickhandsafrica.com"

// Sitemap output is cached and rebuilt at most this often — listJobs() hits
// the (Render free-tier, cold-start-prone) backend API, so this keeps every
// crawler request from triggering a live fetch.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/professionals`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/specialists`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
  ]

  // Best-effort: job postings are time-sensitive and the listing endpoint
  // can be slow/unavailable, so a failure here must never break the whole
  // sitemap — fall back to the static routes alone.
  let jobRoutes: MetadataRoute.Sitemap = []
  try {
    const jobs = await listJobs(new URLSearchParams())
    jobRoutes = jobs.map((job) => ({
      url: `${BASE_URL}/jobs/${job.id}`,
      lastModified: job.updatedAt || job.createdAt,
      changeFrequency: "daily",
      priority: 0.5,
    }))
  } catch (error) {
    console.error("[sitemap] Failed to include job postings:", error)
  }

  return [...staticRoutes, ...jobRoutes]
}
