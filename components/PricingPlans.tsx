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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(38,192,141,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,#1a1a1a01_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none -z-10" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 font-sans">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-100 bg-white px-3.5 py-1 mb-5 shadow-sm/30 select-none">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-semibold text-zinc-500 tracking-[0.08em] uppercase font-sans">
              Transparent pricing
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-zinc-950 leading-tight mb-4">
            Tariffs
          </h2>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed font-light">
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
                    ? "bg-gradient-to-br from-primary via-primary-hover to-[#1FA777] shadow-sm/50 hover:shadow-md"
                    : "bg-zinc-150 hover:bg-zinc-200 hover:shadow-sm"
                }`}
              >
                <div className="h-full rounded-[23px] bg-white p-8 text-left">
                  
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute top-5 right-5 select-none">
                      <span className={`${plan.badgeColor} text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`mb-6 inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${
                      plan.accent 
                        ? "bg-primary-light border-primary/10 text-primary" 
                        : "bg-zinc-50 border-zinc-100 text-zinc-650"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-md font-semibold text-zinc-950 mb-1.5 tracking-tight">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-6 leading-relaxed font-light">
                    {plan.subtitle}
                  </p>

                  {/* Price Label */}
                  <div className="mb-6 pb-6 border-b border-zinc-100">
                    <span className="text-xl font-bold text-zinc-950">
                      {plan.priceLabel}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 font-sans">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-xs text-zinc-650 font-light">
                        <div
                          className={`mt-0.5 flex-shrink-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border ${
                            plan.accent 
                              ? "bg-primary-light border-primary/10 text-primary" 
                              : "bg-zinc-50 border-zinc-100 text-zinc-500"
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
        <p className="mt-12 text-center text-xs text-zinc-400 font-sans font-light">
          All pricing includes secure payment processing and platform support.
        </p>
      </div>
    </section>
  )
}
