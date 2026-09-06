import { Check, CreditCard, Percent, Zap } from "lucide-react"

export function PricingPlans() {
  const plans = [
    {
      icon: Percent,
      badge: "RECOMMENDED",
      badgeColor: "bg-primary text-white",
      title: "Commission per order",
      subtitle: "You only pay after you receive an order — responding is free",
      priceLabel: "Pay on success",
      accent: true,
      features: [
        "Unlocks after verification or 3 paid responses",
        "Available to all professionals",
        "No upfront costs or hidden fees",
        "Only pay when you get paid",
      ],
    },
    {
      icon: CreditCard,
      badge: null,
      title: "Pay per response",
      subtitle: "Pay a small fee to send an offer to a client",
      priceLabel: "Small fee",
      accent: false,
      features: [
        "No hidden charges",
        "Not every response leads to a job",
        "First order requires 5–10 responses average",
        "Great for getting started quickly",
      ],
    },
  ]

  return (
    <section className="relative py-32 bg-zinc-50/50 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(20,168,0,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,#1a1a1a01_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none -z-10" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 font-sans">
          <div className="mb-5 inline-flex items-center gap-2 select-none">
            <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span className="text-[10px] font-semibold text-primary tracking-[0.16em] uppercase font-sans">
              Transparent pricing
            </span>
          </div>
          <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-zinc-950 leading-tight mb-4">
            Tariffs
          </h2>
          <p className="font-body text-[15px] text-zinc-500 max-w-xs mx-auto leading-relaxed font-normal">
            Flexible tariff options to match your workspace workflow.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto font-sans">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.title}
                className={`relative rounded-[24px] p-px overflow-hidden transition-all duration-300 hover:-translate-y-1 group ${
                  plan.accent
                    ? "bg-gradient-to-br from-primary via-primary-hover to-[#108600] shadow-[0_10px_35px_-8px_rgba(20,168,0,0.25)] hover:shadow-[0_20px_45px_-10px_rgba(20,168,0,0.35)]"
                    : "bg-zinc-200/80 hover:bg-zinc-300 hover:shadow-[0_10px_35px_-10px_rgba(0,0,0,0.03)]"
                }`}
              >
                <div className="h-full rounded-[23px] bg-white p-8 text-left relative flex flex-col justify-between">
                  <div>
                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute top-6 right-6 select-none">
                        <span className="bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      className={`mb-6 inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${
                        plan.accent 
                          ? "bg-primary/5 border-primary/15 text-primary" 
                          : "bg-zinc-50 border-zinc-150/80 text-zinc-650"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-heading text-3xl font-bold text-zinc-950 mb-1.5 tracking-tight leading-tight">
                      {plan.title}
                    </h3>
                    <p className="font-body text-[15px] text-zinc-500 mb-6 leading-relaxed font-normal">
                      {plan.subtitle}
                    </p>

                    {/* Price Label */}
                    <div className="mb-6 pb-6 border-b border-zinc-200">
                      <span className="text-2xl font-bold text-zinc-950">
                        {plan.priceLabel}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 font-sans">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-xs text-zinc-650 font-light">
                        <div
                          className={`mt-0.5 flex-shrink-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border ${
                            plan.accent 
                              ? "bg-primary/5 border-primary/15 text-primary" 
                              : "bg-zinc-50 border-zinc-150/80 text-zinc-500"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-center text-[15px] text-zinc-400 font-body font-normal">
          All pricing includes secure payment processing and platform support.
        </p>
      </div>
    </section>
  )
}
