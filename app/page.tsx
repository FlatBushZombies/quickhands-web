import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { Stats } from "@/components/Stats"
import { FeaturedJobs } from "@/components/FeaturedJobs"
import { HowItWorks } from "@/components/HowItWorks"
import Marketplace from "@/components/MarketPlace"
import { Footer } from "@/components/Footer"
import { Features } from "@/components/Features"
import { Faq } from "@/components/FAQ"
import { PricingPlans } from "@/components/PricingPlans"

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <Features />
      <Stats />
      <HowItWorks />
      <Marketplace />
      <Footer />
    </>
  )
}
