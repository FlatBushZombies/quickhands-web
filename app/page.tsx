import { FeaturedJobs } from "@/components/FeaturedJobs"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { HowItWorks } from "@/components/HowItWorks"
import { Stats } from "@/components/Stats"


const HomePage = () => {
  return (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <HeroSection />
      <Stats />
      <FeaturedJobs />
      <HowItWorks />
    </main>
    <Footer />
  </div>
  )
}

export default HomePage
