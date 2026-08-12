"use client"

import { Header } from "@/components/quickhands/Header"
import { Hero } from "@/components/quickhands/Hero"
import { HowItWorks } from "@/components/quickhands/HowItWorks"
import { TaskCategories } from "@/components/quickhands/TaskCategories"
import { MarketplacePreview } from "@/components/quickhands/MarketplacePreview"
import { TaskerSection } from "@/components/quickhands/TaskerSection"
import { Stats } from "@/components/quickhands/Stats"
import { CtaBand } from "@/components/quickhands/CtaBand"
import { Footer } from "@/components/Footer"
import { ClientFAQ } from "@/components/ClientFAQ"

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <TaskCategories />
      <MarketplacePreview />
      <TaskerSection />
      <Stats />
      <CtaBand />
      <ClientFAQ />
      <Footer />
    </>
  )
}
