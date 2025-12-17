import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {  Star, TrendingUp, Users, Zap, ClipboardList, Search, MessageSquare, CreditCard  } from "lucide-react"
import { Faq } from "@/components/FAQ"
import { PricingPlans } from "@/components/PricingPlans"



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
];


export default function ProfessionalsPage() {
  const features = [
    {
      icon: Users,
      title: "Build Your Brand",
      description: "Create a stunning professional profile that showcases your expertise and attracts premium clients.",
    },
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
    {
      icon: Star,
      title: "Premium Support",
      description: "Get priority support and dedicated account management to help you succeed on the platform.",
    },
  ]

  const benefits = [
    "Professional website builder",
    "Advanced portfolio showcase",
    "Priority in search results",
    "Custom pricing packages",
    "Client relationship management",
    "Analytics and insights",
    "Secure payment processing",
    "24/7 priority support",
  ]

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="container relative mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 mb-6">
              <Star className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-primary font-medium">Premium Professional Platform</span>
            </div>

            <h1 className="font-sans text-balance text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-7xl sm:leading-tight">
              Earn money doing what you’re great at
            </h1>

            <p className="font-sans mt-6 text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Access over 50,000 new orders every month in your country
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                size="lg"
                className="font-sans h-14 bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-medium"
              >
                Register with your email
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-sans h-14 border-border text-foreground hover:bg-card px-8 font-medium bg-transparent"
              >
                View Pricing
              </Button>
            </div>

            <p className="font-sans mt-6 text-sm text-muted-foreground">
              We’ll send you a confirmation code — no spam, no advertising.
            </p>
             <p className="font-sans mt-6 text-sm text-muted-foreground">
              By signing up, you’ll be automatically notified when the app launches in January.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-sans text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
            <p className="font-sans mt-4 text-lg text-muted-foreground">
              Professional tools designed for serious freelancers and agencies
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-border bg-card">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-sans mb-2 text-xl font-semibold">{feature.title}</h3>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

          <section id="how" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <h2 className="font-sans text-4xl font-bold tracking-tight">How It Works</h2>
                <p className="font-sans mt-4 text-lg text-muted-foreground">Get started in minutes with our simple process</p>
              </div>
      
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.title} className="relative">
                      <Card className="h-full border-border bg-card">
                        <CardContent className="pt-6">
                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                            <span className="font-mono">{index + 1}</span>
                          </div>
                          <h3 className="font-sans mb-2 text-xl font-semibold">{step.title}</h3>
                          <p className="font-sans text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

        <PricingPlans />

        <Faq />

      <Footer />
    </>
  )
}
