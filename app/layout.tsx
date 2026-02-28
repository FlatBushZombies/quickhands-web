import type React from "react"
import type { Metadata } from "next"
import { Schibsted_Grotesk, Martian_Mono} from "next/font/google"
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

export const metadata = {
  title: "QuickHands – Find Trusted Service Specialists in Africa",
  description:
    "Book reliable plumbing, electrical, cleaning, beauty and home service specialists in Harare. Compare prices, chat on WhatsApp and get jobs done fast with QuickHands.",
};

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
      </body>
    </html>
  </ClerkProvider>
  )
}
