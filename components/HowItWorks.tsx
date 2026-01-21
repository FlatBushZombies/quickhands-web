import { Card } from "@/components/ui/card"
import Image from "next/image"
import {
  Clipboard,
  Users,
  CheckCircle,
  Star,
} from "lucide-react"

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative py-28 bg-gradient-to-b from-muted/40 via-background to-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            How it works
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            A frictionless way to get work done
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Designed to remove uncertainty, reduce back-and-forth, and help you
            move from idea to execution with confidence.
          </p>
        </div>

        {/* Layout */}
        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left column */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <PremiumInfoCard
              icon={Clipboard}
              title="Tell us what you need"
              description="Share the details of your task through a short questionnaire, and we’ll match you with the right experts."
              step="01"
            />

            <PremiumInfoCard
              icon={Users}
              title="Choose with confidence"
              description="Compare profiles, reviews, and pricing, then select the professional that feels right for you."
              step="03"
            />
          </div>

          {/* Center featured card */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-full rounded-[28px] bg-gradient-to-br from-primary/10 via-background to-background p-[1px]">
              <Card className="relative h-full overflow-hidden rounded-[27px] border-0 bg-background shadow-xl">
                <div className="relative h-[420px]">
                  <Image
                    src="/hairdresser.jpg"
                    alt="Professionals collaborating"
                    fill
                    className="object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                  {/* Floating badge */}
                  <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-background/90 p-5 backdrop-blur">
                    <div className="text-xs font-medium text-muted-foreground">
                      Step 02
                    </div>
                    <h3 className="mt-1 text-lg font-semibold">
                      Hear from qualified professionals
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Skilled specialists review your request and reach out with
                      personalised offers.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-3 flex flex-col justify-end gap-6">
            <PremiumInfoCard
              icon={CheckCircle}
              title="Get it done and review"
              description="Approve the completed work, release payment, and leave a review to help others choose confidently."
              step="04"
            />

            <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium">
                  Trusted by fast-growing teams
                </p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                High completion rates, verified professionals, and transparent
                pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Helper Card ---------------- */

function PremiumInfoCard({
  icon: Icon,
  title,
  description,
  step,
}: {
  icon: any
  title: string
  description: string
  step: string
}) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-background p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute right-4 top-4 text-xs font-mono text-muted-foreground">
        {step}
      </div>

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <h3 className="mb-2 text-base font-semibold">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </Card>
  )
}
