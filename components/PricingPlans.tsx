import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard, Percent, Zap } from "lucide-react"

export function PricingPlans() {
  const plans = [
    {
      icon: Percent,
      badge: "RECOMMENDED",
      badgeColor: "bg-emerald-600 text-white",
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
    <section className="relative py-28 bg-white overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.06),transparent)]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 mb-6">
            <Zap className="h-3.5 w-3.5 text-emerald-600" />
            <span
              className="text-xs font-semibold text-zinc-600 tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Transparent pricing
            </span>
          </div>
          <h2
            className="text-5xl font-black text-zinc-900 tracking-tight mb-4 text-balance"
            style={{ fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.03em" }}
          >
            Tariffs
          </h2>
          <p className="text-lg text-zinc-500 max-w-lg mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Flexible tariff options to match your workflow
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.title}
                className={`relative rounded-2xl p-px overflow-hidden transition-all duration-300 hover:-translate-y-1 group ${
                  plan.accent
                    ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 shadow-2xl shadow-emerald-500/20"
                    : "bg-zinc-200 hover:bg-zinc-300"
                }`}
              >
                <div
                  className={`h-full rounded-2xl p-8 ${
                    plan.accent
                      ? "bg-white"
                      : "bg-white"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute top-4 right-4">
                      <span
                        className={`${plan.badgeColor} text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
                      plan.accent ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-zinc-100 ring-1 ring-zinc-200"
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${plan.accent ? "text-emerald-600" : "text-zinc-600"}`} />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight"
                    style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
                  >
                    {plan.title}
                  </h3>
                  <p className="text-sm text-zinc-500 mb-6 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {plan.subtitle}
                  </p>

                  {/* Price */}
                  <div className="mb-8 pb-8 border-b border-zinc-100">
                    <span
                      className="text-3xl font-black text-zinc-900"
                      style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" }}
                    >
                      {plan.priceLabel}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                            plan.accent ? "bg-emerald-100" : "bg-zinc-100"
                          }`}
                        >
                          <Check className={`h-3 w-3 ${plan.accent ? "text-emerald-600" : "text-zinc-600"}`} />
                        </div>
                        <span className="text-sm text-zinc-700 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-zinc-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          All pricing includes secure payment processing and platform support
        </p>
      </div>
    </section>
  )
}
