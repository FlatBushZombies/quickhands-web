import type React from "react"
import type { Metadata } from "next"
import { Newsreader, Inter, Martian_Mono, Onest, Instrument_Serif, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import CookieConsent from "@/components/cookie-consent/CookieConsent"
import { PostHogProvider } from "@/components/PostHogProvider"

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
  display: "swap",
})

/**
 * Satoshi — the H1/H2/H3 heading family from the user's type-scale spec.
 * Not on Google Fonts (it's a Fontshare release), so it's wired via
 * next/font/local against the .woff2 files already sitting in
 * public/fonts/satoshi/. Exposed as --font-satoshi here and remapped to the
 * --font-heading token in globals.css, which stays separate from --font-sans
 * (Onest) — Onest is still correct for UI chrome (buttons, nav, badges),
 * which this type-scale spec doesn't cover.
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

/**
 * Plus Jakarta Sans — the H4 tier of the spec ("Plus Jakarta Sans, Semibold,
 * 24 — (deprecated)" per the user's notes). Wired for completeness but only
 * applied where a genuine <h4> already exists in the swept components; not
 * used to invent new H4-level headings.
 */
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
})

/**
 * Editorial accent italic — used exclusively via components/quickhands/Em.tsx
 * for single-word "startup accent" moments in headlines (the Worrki
 * reference's "*employers*" move). Instrument Serif only ships one weight
 * (400) in both roman and italic, so it's wired to its own --font-accent
 * token instead of replacing --font-serif, which other headlines still rely
 * on at font-medium/font-bold weights Instrument Serif can't render.
 */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
})

/**
 * Playfair Display — the "RZA" display-serif role from the newest spec.
 * RZA is a real paid Out of the Dark foundry release with no free web/app
 * license, so this is the user's own stated fallback, wired the same way as
 * the other 6 Google fonts above. Exposed as --font-playfair and remapped
 * to the --font-editorial token in globals.css, used sparingly for hero
 * headlines and editorial callouts only (see Hero.tsx, Quickhandshero.tsx,
 * CtaBand.tsx) — not a replacement for --font-heading (Satoshi), which
 * keeps its existing H1–H3 role everywhere else.
 */
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "QuickHands | Find Trusted  Specialists in Africa",
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
    icon: "/favicon.ico",
  },
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
            ${onest.variable}
            ${inter.variable}
            ${newsreader.variable}
            ${martianMono.variable}
            ${instrumentSerif.variable}
            ${satoshi.variable}
            ${plusJakartaSans.variable}
            ${playfairDisplay.variable}
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