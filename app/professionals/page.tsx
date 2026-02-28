import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, TrendingUp, Zap, ClipboardList, Search, MessageSquare, CreditCard } from "lucide-react"
import { FaqSection } from "@/components/FAQ"
import { PricingPlans } from "@/components/PricingPlans"
import { OnboardingModal } from "@/components/OnboardingModal"
import { ProfessionalsHeader } from "@/components/ProffesionalsHeader"
import QuickHandsHero from "@/components/Quickhandshero"

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

      <section id="how" className="py-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-sans text-4xl font-bold tracking-tight text-white">How It Works</h2>
            <p className="mt-4 font-sans text-lg text-neutral-300">Get started in minutes with our simple process</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card
                  key={step.title}
                  className="relative h-full border-neutral-700 bg-neutral-800/50 backdrop-blur-sm hover:bg-neutral-800 transition-colors"
                >
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-600/20">
                      <Icon className="h-6 w-6 text-green-500" />
                    </div>

                    <div className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white shadow-lg">
                      <span className="font-mono">{index + 1}</span>
                    </div>

                    <h3 className="mb-2 font-sans text-xl font-semibold text-white">{step.title}</h3>
                    <p className="font-sans text-sm leading-relaxed text-neutral-300">{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <PricingPlans />
      <FaqSection />
      <Footer />
    </>
  )
}
