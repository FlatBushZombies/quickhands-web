import { Card, CardContent } from "@/components/ui/card"
import { Search, Users, CheckCircle, Zap } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Post Your Project",
    description: "Describe your project needs and budget. Our AI will match you with the perfect freelancers.",
  },
  {
    icon: Users,
    title: "Review Proposals",
    description: "Receive proposals from qualified freelancers. Review portfolios, ratings, and experience.",
  },
  {
    icon: Zap,
    title: "Collaborate & Work",
    description: "Use our built-in tools to communicate, share files, and track progress in real-time.",
  },
  {
    icon: CheckCircle,
    title: "Pay Securely",
    description: "Release payment only when you're 100% satisfied. Protected by our money-back guarantee.",
  },
]

export function HowItWorks() {
  return (
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
  )
}
