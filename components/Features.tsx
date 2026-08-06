"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Star,
  ShieldCheck,
  Wallet,
  BadgeCheck,
  ChevronRight
} from "lucide-react"

const features = [
  {
    icon: Star,
    title: "Real reviews",
    description:
      "Reviews can only be left after the job is completed, so every review reflects a genuine, real-world experience.",
    widget: (
      <div className="w-full bg-white border border-zinc-200 rounded-2xl p-5 text-left shadow-sm transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-zinc-100 overflow-hidden relative border border-zinc-200">
            <img 
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop" 
              alt="Tendai M." 
              className="object-cover h-full w-full" 
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-900 font-sans">Tendai M.</p>
            <div className="flex gap-0.5 text-primary mt-0.5">
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
            </div>
          </div>
        </div>
        <p className="text-[12px] leading-relaxed text-zinc-500 italic font-sans">
          "Highly professional plumber. Fixed my pipes within an hour and cleaned up afterwards. Exceptional!"
        </p>
      </div>
    )
  },
  {
    icon: BadgeCheck,
    title: "Verified professionals",
    description:
      "Your safety matters to us. Every specialist goes through identity, experience, and education verification before joining.",
    widget: (
      <div className="w-full bg-white border border-zinc-200 rounded-2xl p-5 text-left shadow-sm transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-md space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden border-2 border-white ring-1 ring-zinc-150 shadow-sm">
            <img
              src="https://images.pexels.com/photos/19039168/pexels-photo-19039168.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt="Verified specialist"
              className="object-cover h-full w-full"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-primary border-2 border-white flex items-center justify-center">
              <BadgeCheck className="h-2 w-2 text-white" strokeWidth={3} />
            </span>
          </div>
          <div className="flex-1 flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase font-sans">Verification status</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-primary font-sans shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Active
            </span>
          </div>
        </div>
        <div className="space-y-2.5 text-[12px] font-sans">
          <div className="flex justify-between border-b border-zinc-150 pb-1.5">
            <span className="text-zinc-500">ID Verification</span>
            <span className="font-medium text-zinc-900 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-primary inline" /> Verified
            </span>
          </div>
          <div className="flex justify-between border-b border-zinc-150 pb-1.5">
            <span className="text-zinc-500">Reference Check</span>
            <span className="font-medium text-zinc-900 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-primary inline" /> Complete
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Background Assessment</span>
            <span className="font-medium text-zinc-900">Passed</span>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: Wallet,
    title: "Best prices",
    description:
      "Browse a wide range of professionals, compare pricing transparently, and choose the option that works best for you.",
    widget: (
      <div className="w-full bg-white border border-zinc-200 rounded-2xl p-5 text-left shadow-sm transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-md space-y-3">
        <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase font-sans">Local Rates</span>
        <div className="space-y-2 font-sans">
          <div className="flex items-center justify-between rounded-xl bg-[var(--primary-light)] p-2.5 border border-primary/15">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-900">Tinashe K.</span>
              <span className="text-[10px] text-zinc-400">Home Electrician</span>
            </div>
            <span className="text-xs font-bold text-primary">$25/hr</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-2.5 border border-zinc-200">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-900">Sharon G.</span>
              <span className="text-[10px] text-zinc-400">Mathematics Tutor</span>
            </div>
            <span className="text-xs font-bold text-zinc-950">$18/hr</span>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: ShieldCheck,
    title: "Safe payment method",
    description:
      "Pay securely through our platform. Funds are released to the specialist only after you approve the completed work.",
    widget: (
      <div className="w-full bg-white border border-zinc-200 rounded-2xl p-5 text-left shadow-sm transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase font-sans font-medium">Escrow Protection</span>
          <span className="text-xs font-bold text-primary font-sans">$150.00</span>
        </div>
        <div className="relative pl-4 border-l border-zinc-200 space-y-3 text-[11px] font-sans">
          <div className="relative">
            <div className="absolute -left-[20.5px] top-0.5 h-2.5 w-2.5 rounded-full bg-zinc-200" />
            <p className="font-medium text-zinc-400">1. Client deposits funds</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[20.5px] top-0.5 h-2.5 w-2.5 rounded-full bg-zinc-200" />
            <p className="font-medium text-zinc-400">2. Specialist completes work</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[22.5px] top-0.5 h-3.5 w-3.5 rounded-full bg-emerald-50 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
            <p className="font-semibold text-zinc-900">3. Release payment securely</p>
          </div>
        </div>
      </div>
    )
  }
]

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-32 bg-zinc-50/40"
    >
      {/* Soft background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header — split editorial layout, consistent with HowItWorks / Marketplace */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-semibold text-primary tracking-[0.08em] uppercase font-sans">
                Why Quickhands
              </span>
            </div>
            <h2 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-zinc-950 leading-tight">
              Designed for trust,<br />built for efficiency.
            </h2>
          </div>
          <p className="font-sans text-sm text-zinc-500 leading-relaxed font-light lg:max-w-xs">
            Quickhands provides the infrastructure for high-integrity local service matches, ensuring safety and quality in every single job.
          </p>
        </div>

        {/* Feature Cards — asymmetric bento: wide anchor cards on rows 1 & 2 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isWide = index === 0 || index === 3

            return (
              <Card
                key={feature.title}
                className={cn(
                  "group relative h-full overflow-hidden rounded-[24px] border border-zinc-200 bg-white p-7 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1",
                  isWide && "md:col-span-2 lg:col-span-2"
                )}
              >
                {/* Subtle top primary highlight on hover */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

                <CardContent
                  className={cn(
                    "p-0 flex h-full flex-col justify-between",
                    isWide && "md:flex-row md:items-center md:gap-8",
                    isWide && index === 3 && "md:flex-row-reverse"
                  )}
                >
                  {/* Custom UI Visual Widget */}
                  <div
                    className={cn(
                      "mb-6 flex min-h-[160px] items-center justify-center rounded-2xl bg-[var(--primary-light)] p-2.5 border border-primary/10 transition-colors duration-300 group-hover:border-primary/20",
                      isWide && "md:mb-0 md:flex-1 md:self-stretch md:p-6"
                    )}
                  >
                    {feature.widget}
                  </div>

                  {/* Icon & Details */}
                  <div className={cn("space-y-4", isWide && "md:flex-1")}>
                    <div className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 transition-all duration-300 group-hover:bg-primary/5 group-hover:border-primary/20 group-hover:text-primary text-zinc-700">
                      <Icon className="h-4.5 w-4.5" aria-hidden />
                    </div>

                    <h3 className="text-md font-bold tracking-tight text-zinc-900 font-sans">
                      {feature.title}
                    </h3>

                    <p className={cn("text-[12.5px] leading-relaxed text-zinc-500 font-sans font-light", isWide && "md:max-w-sm")}>
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
