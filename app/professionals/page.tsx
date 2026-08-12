import { Footer } from "@/components/Footer"
import { FaqSection } from "@/components/FAQ"
import { PricingPlans } from "@/components/PricingPlans"
import { ProfessionalsHeader } from "@/components/ProffesionalsHeader"
import QuickHandsHero from "@/components/Quickhandshero"
import HowItWorks from "@/components/professionals/HowItWorks"

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
