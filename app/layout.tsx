import type React from "react"
import type { Metadata } from "next"
import { Martian_Mono } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import CookieConsent from "@/components/cookie-consent/CookieConsent"
import { PostHogProvider } from "@/components/PostHogProvider"

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
  display: "swap",
})

/**
 * Satoshi — the SOLE heading + body family sitewide (grey.co-style
 * one-family discipline). Not on Google Fonts (it's a Fontshare release),
 * so it's wired via next/font/local against the .woff2 files already
 * sitting in public/fonts/satoshi/. Exposed as --font-satoshi here and
 * remapped to both --font-heading and --font-sans/--font-body in
 * globals.css — weight (400/500/700) alone carries the full hierarchy,
 * matching grey.co's own approach. Onest, Inter, Newsreader, Instrument
 * Serif, Plus Jakarta Sans, and Playfair Display were all dropped in this
 * pass; Martian Mono (below) is the only other family left, kept for its
 * distinct tabular/numeric role that Satoshi can't perform.
 */
const satoshi = localFont({
  src: [
    { path: "../public/fonts/satoshi/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/satoshi/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/satoshi/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "QuickHands - Find Trusted  Specialists in Africa",
    template: "%s | QuickHands",
  },
  description:
    "QuickHands connects you with trusted freelance specialists across Africa. Book plumbing, electrical, cleaning, beauty and home services in Harare — compare prices, chat on WhatsApp and get jobs done fast.",
  keywords: [
    "freelance specialists Africa",
    "hire specialists Harare",
    "home services Zimbabwe",
    "plumbing Harare",
    "electrical services Harare",
    "cleaning services Zimbabwe",
    "beauty specialists Harare",
    "freelance professionals Africa",
    "QuickHands",
    "on-demand services Zimbabwe",
  ],
  metadataBase: new URL("https://quickhandsafrica.com"),
  alternates: {
    canonical: "https://quickhandsafrica.com",
  },
  openGraph: {
    type: "website",
    url: "https://quickhandsafrica.com",
    siteName: "QuickHands",
    title: "QuickHands | Trusted  Specialists in Africa",
    description:
      "Book reliable specialists for home, beauty and trade services across Africa. Fast, simple and trusted.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QuickHands – Hire Specialists in Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickHands | Hire Specialists in Africa",
    description:
      "Find and book trusted  specialists in Harare and across Africa. Compare prices and get jobs done fast.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`
            ${martianMono.variable}
            ${satoshi.variable}
            font-sans
            min-h-screen
            antialiased
            bg-background
            text-foreground
          `}
        >
          <PostHogProvider>
            <main>{children}</main>
          </PostHogProvider>
          <CookieConsent />

          {/* =============================
              STRUCTURED DATA (LD+JSON)
              Organization + Website Search
             ============================= */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "QuickHands",
                url: "https://quickhandsafrica.com",
                logo: "https://quickhandsafrica.com/logo.png",
                description:
                  "QuickHands is a freelance marketplace connecting clients with trusted specialists for home, trade and beauty services across Africa.",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Harare",
                  addressCountry: "ZW",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "Customer Service",
                  areaServed: "Africa",
                  availableLanguage: ["English"],
                },
                sameAs: [
                  "https://facebook.com/quickhands",
                  "https://instagram.com/quickhands",
                  "https://tiktok.com/@quickhands",
                ],
              }),
            }}
          />

          {/* Sitelinks Search Box */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                url: "https://quickhandsafrica.com",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://quickhandsafrica.com/?s={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}