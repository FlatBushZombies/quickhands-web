export function Stats() {
  const stats = [
    { value: "2M+", label: "Active freelancers" },
    { value: "500K+", label: "Projects completed" },
    { value: "$1B+", label: "Paid to freelancers" },
    { value: "150+", label: "Countries served" },
  ]

  return (
    <section className="border-b border-border/40 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-sans text-4xl font-bold text-primary tracking-tight">{stat.value}</div>
              <div className="font-sans mt-2 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
