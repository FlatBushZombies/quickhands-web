import type { Metadata } from "next"
import { Footer } from "@/components/Footer"
import { FaqSection } from "@/components/FAQ"
import { PricingPlans } from "@/components/PricingPlans"
import { ProfessionalsHeader } from "@/components/ProffesionalsHeader"
import QuickHandsHero from "@/components/Quickhandshero"
import HowItWorks from "@/components/professionals/HowItWorks"

export const metadata: Metadata = {
  title: "For Specialists",
  description:
    "Join QuickHands as a specialist — browse local jobs, set your own rates, and get paid for plumbing, electrical, cleaning, beauty and trade work across Africa.",
}

export default function ProfessionalsPage() {
  return (
    <>
      <ProfessionalsHeader />

      <QuickHandsHero />
      <HowItWorks />
      <PricingPlans />
      <FaqSection />
      <Footer />
    </>
  )
}
