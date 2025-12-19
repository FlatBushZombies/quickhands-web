import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Star,
  TrendingUp,
  Zap,
  ClipboardList,
  Search,
  MessageSquare,
  CreditCard,
} from "lucide-react"
import {  FaqSection } from "@/components/FAQ"
import { PricingPlans } from "@/components/PricingPlans"
import { OnboardingModal } from "@/components/OnboardingModal"
import { ProfessionalsHeader } from "@/components/ProffesionalsHeader"

const steps = [
  {
    icon: ClipboardList,
    title: "Clients post tasks",
    description:
      "Clients describe their task in detail and suggest a budget.",
  },
  {
    icon: Search,
    title: "Choose the orders that suit you",
    description:
      "Browse available tasks and select the ones that match your skills and schedule.",
  },
  {
    icon: MessageSquare,
    title: "Send your offer",
    description:
      "Respond to the task and discuss pricing and details privately with the client.",
  },
  {
    icon: CreditCard,
    title: "Complete the work and get paid",
    description:
      "Finish the task and receive your payment securely within the app.",
  },
  {
    icon: Star,
    title: "Build your reputation",
    description:
      "Earn reviews, grow your profile, and attract even more clients.",
  },
]


export default function ProfessionalsPage() {
  const features = [
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description:
        "Access enterprise clients and high-value projects that match your skills and experience level.",
    },
    {
      icon: Zap,
      title: "Work Efficiently",
      description:
        "Manage proposals, contracts, and payments all in one place with our powerful professional tools.",
    },
  ]

  return (
    <>
      <ProfessionalsHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-background">
  {/* Background grid */}
  <div className="absolute inset-0 
    bg-[linear-gradient(to_right,#11182720_1px,transparent_1px),
        linear-gradient(to_bottom,#11182720_1px,transparent_1px)]
    bg-[size:4rem_4rem]
    [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]
  " />

  <div className="container relative mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
    <div className="mx-auto max-w-4xl text-center">

      {/* Headline */}
      <h1 className="font-sans text-balance text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
        Earn money doing what you are great at
      </h1>

      {/* Image cards */}
      <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
        <div className="relative h-48 w-48 sm:h-56 sm:w-56 overflow-hidden rounded-2xl border border-border/50 bg-background shadow-lg">
          <img
            src="/trader.jpg"
            alt="Professional focused on their work"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative h-48 w-48 sm:h-56 sm:w-56 overflow-hidden rounded-2xl border border-border/50 bg-background shadow-lg">
          <img
            src="/factory-worker.jpg"
            alt="Skilled worker doing their job"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Subheading */}
      <p className="font-sans mt-6 text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
        Access over 50,000 new orders every month in your country
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <OnboardingModal>
          <Button
            size="lg"
            className="h-14 bg-secondary px-8 font-sans font-medium text-secondary-foreground hover:bg-secondary/90"
          >
            Register with your email
          </Button>
        </OnboardingModal>
      </div>

      {/* Footer text */}
      <p className="font-sans mt-6 text-sm text-muted-foreground">
        We'll send you a confirmation code — no spam, no advertising.
      </p>
      <p className="font-sans mt-2 text-sm text-muted-foreground">
        By signing up, you'll be automatically notified when the app launches in January.
      </p>
    </div>
  </div>
</section>


      {/* How It Works */}
      <section id="how" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-sans text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 font-sans text-lg text-muted-foreground">
              Get started in minutes with our simple process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={step.title} className="relative h-full border-border bg-card">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>

                    <div className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                      <span className="font-mono">{index + 1}</span>
                    </div>

                    <h3 className="mb-2 font-sans text-xl font-semibold">
                      {step.title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
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
