import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import {
  Star,
  ShieldCheck,
  Wallet,
  BadgeCheck,
} from "lucide-react"

const features = [
  {
    icon: Star,
    title: "Real reviews",
    description:
      "Reviews can only be left after the job is completed, so every review reflects a genuine, real-world experience.",
    illustration: "/Review.svg",
  },
  {
    icon: BadgeCheck,
    title: "Verified professionals",
    description:
      "Your safety matters to us. Every specialist goes through identity, experience, and education verification before joining the platform.",
    illustration: "/Verified.svg",
  },
  {
    icon: Wallet,
    title: "Best prices",
    description:
      "Browse a wide range of professionals, compare pricing transparently, and choose the option that works best for you.",
    illustration: "/Pricing.svg",
  },
  {
    icon: ShieldCheck,
    title: "Safe payment method",
    description:
      "Pay securely through our platform. Funds are released to the specialist only after you approve the completed work.",
    illustration: "/Safe-amico.svg",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-24"
    >
      {/* Soft premium background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FFF6EB] via-white to-white" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <Card
                key={feature.title}
                className="group relative h-full overflow-hidden rounded-3xl border border-black/5 bg-white/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]"
              >
                {/* Subtle glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <CardContent className="relative flex h-full flex-col px-8 pt-10 pb-8">
                  {/* Illustration */}
                  <div className="mb-8 flex h-[220px] items-center justify-center">
                    <Image
                      src={feature.illustration}
                      alt={feature.title}
                      width={220}
                      height={220}
                      className="object-contain"
                      priority={index < 2}
                    />
                  </div>

                  {/* Icon badge */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
