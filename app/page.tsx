"use client"

import { useState } from "react"
import { IntroLoader } from "@/components/quickhands/IntroLoader"
import { Header } from "@/components/quickhands/Header"
import { Hero } from "@/components/quickhands/Hero"
import { HowItWorks } from "@/components/quickhands/HowItWorks"
import { TaskCategories } from "@/components/quickhands/TaskCategories"
import { MarketplacePreview } from "@/components/quickhands/MarketplacePreview"
import { TaskerSection } from "@/components/quickhands/TaskerSection"
import { Stats } from "@/components/quickhands/Stats"
import { Footer } from "@/components/Footer"
import { ClientFAQ } from "@/components/ClientFAQ"

export default function Home() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <>
      <IntroLoader onComplete={() => setIntroDone(true)} />
      <Header />
      <Hero ready={introDone} />
      <HowItWorks />
      <TaskCategories />
      <MarketplacePreview />
      <TaskerSection />
      <Stats />
      <ClientFAQ />
      <Footer />
    </>
  )
}
