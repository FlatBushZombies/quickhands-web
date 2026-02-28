import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, TrendingUp, Zap, ClipboardList, Search, MessageSquare, CreditCard } from "lucide-react"
import { FaqSection } from "@/components/FAQ"
import { PricingPlans } from "@/components/PricingPlans"
import { OnboardingModal } from "@/components/OnboardingModal"
import { ProfessionalsHeader } from "@/components/ProffesionalsHeader"
import QuickHandsHero from "@/components/Quickhandshero"
import HowItWorks from "@/components/professionals/HowItWorks"

const steps = [
  {
    icon: ClipboardList,
    title: "Clients post tasks",
    description: "Clients describe their task in detail and suggest a budget.",
  },
  {
    icon: Search,
    title: "Choose the orders that suit you",
    description: "Browse available tasks and select the ones that match your skills and schedule.",
  },
  {
    icon: MessageSquare,
    title: "Send your offer",
    description: "Respond to the task and discuss pricing and details privately with the client.",
  },
  {
    icon: CreditCard,
    title: "Complete the work and get paid",
    description: "Finish the task and receive your payment securely within the app.",
  },
  {
    icon: Star,
    title: "Build your reputation",
    description: "Earn reviews, grow your profile, and attract even more clients.",
  },
]

export default function ProfessionalsPage() {
  const features = [
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Access enterprise clients and high-value projects that match your skills and experience level.",
    },
    {
      icon: Zap,
      title: "Work Efficiently",
      description: "Manage proposals, contracts, and payments all in one place with our powerful professional tools.",
    },
  ]

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
