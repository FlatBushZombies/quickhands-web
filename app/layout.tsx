import type React from "react"
import type { Metadata } from "next"
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  display: "swap",
})

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
  display: "swap",
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
            ${schibstedGrotesk.variable}
            ${martianMono.variable}
            font-sans
            min-h-screen
            antialiased
            bg-background
            text-foreground
          `}
        >
          <main>{children}</main>

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