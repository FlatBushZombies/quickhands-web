import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/messages", "/settings", "/onboarding", "/post-job", "/hire", "/api/"],
    },
    sitemap: "https://quickhandsafrica.com/sitemap.xml",
  }
}
