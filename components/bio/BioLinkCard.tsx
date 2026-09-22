import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"

/** Full-width rounded card — the reference's primary CTA/link treatment. */
export function BioLinkCard({
  href,
  label,
  icon,
  external,
}: {
  href: string
  label: string
  icon: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex w-full items-center gap-3 rounded-2xl border border-primary/15 bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="flex-1 truncate text-[15px] font-semibold text-foreground">{label}</span>
      {external ? (
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      ) : null}
    </a>
  )
}

/** Plain centered bold text divider between groups of link cards (the reference's "We are hiring!" pattern). */
export function BioHeadingDivider({ label }: { label: string }) {
  return <p className="pt-2 text-center text-[15px] font-bold text-foreground">{label}</p>
}
