import type { Metadata } from "next"
import Link from "next/link"
import { Search, SearchX } from "lucide-react"
import { Header } from "@/components/quickhands/Header"
import { Footer } from "@/components/Footer"
import { SpecialistRow } from "@/components/specialists/SpecialistRow"
import { searchSpecialists } from "@/lib/specialists-api"

interface PageProps {
  searchParams: Promise<{ q?: string | string[] }>
}

function readQuery(raw: string | string[] | undefined) {
  const value = Array.isArray(raw) ? raw[0] : raw
  return (value ?? "").trim().slice(0, 100)
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const query = readQuery((await searchParams).q)

  if (query) {
    return {
      title: `${query} specialists`,
      description: `Specialists on QuickHands matching “${query}”. View their portfolio and hire them.`,
      // Individual searches are thin, endless variations — keep them out of the index.
      robots: { index: false, follow: true },
    }
  }

  return {
    title: "Find a specialist",
    description:
      "Search skilled specialists across Africa by skill, trade or location, see their portfolio and reviews, and hire them on QuickHands.",
  }
}

export default async function SpecialistsPage({ searchParams }: PageProps) {
  const query = readQuery((await searchParams).q)
  const { specialists, unavailable } = await searchSpecialists(query)

  // With so few specialists on the platform early on, a search that finds
  // nobody shouldn't be a dead end — show who *is* here alongside the next step.
  const showFallback = Boolean(query) && !unavailable && specialists.length === 0
  const fallback = showFallback ? (await searchSpecialists("", 6)).specialists : []

  const resultLabel = query
    ? `${specialists.length} ${specialists.length === 1 ? "specialist" : "specialists"} for “${query}”`
    : `${specialists.length} ${specialists.length === 1 ? "specialist" : "specialists"} on QuickHands`

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-24 pt-36 sm:pt-40">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
          <h1 className="font-heading text-4xl font-bold tracking-[-0.02em] text-foreground sm:text-5xl">
            Find a specialist
          </h1>
          <p className="mt-3 max-w-[56ch] font-body text-lg leading-relaxed text-muted-foreground">
            Search by skill, trade or location. Open a profile to see their work, then message them when you&apos;re ready.
          </p>

          <form
            action="/specialists"
            method="get"
            role="search"
            aria-label="Search specialists"
            className="mt-8 flex w-full max-w-[640px] items-center gap-2 rounded-full border border-border bg-card p-2 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Plumber, electrician, cleaner…"
              aria-label="Search for a specialist by skill, trade or location"
              className="min-w-0 flex-1 border-0 bg-transparent font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Search
            </button>
          </form>

          {unavailable ? (
            <div className="mt-10 rounded-[20px] border border-dashed border-border bg-card/60 px-6 py-14 text-center">
              <SearchX className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
                We couldn&apos;t load specialists just now
              </h2>
              <p className="mx-auto mt-2 max-w-[44ch] font-body text-base text-muted-foreground">
                This usually clears up in a moment. Try again, or post a job and let specialists come to you.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={query ? `/specialists?q=${encodeURIComponent(query)}` : "/specialists"}
                  className="inline-flex h-11 items-center rounded-full border border-border bg-card px-5 font-sans text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  Try again
                </Link>
                <Link
                  href="/post-job"
                  className="inline-flex h-11 items-center rounded-full bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                >
                  Post a job
                </Link>
              </div>
            </div>
          ) : specialists.length > 0 ? (
            <section className="mt-10" aria-labelledby="results-heading">
              <h2 id="results-heading" className="font-body text-base font-medium text-muted-foreground">
                {resultLabel}
              </h2>
              <ul className="mt-4 divide-y divide-border overflow-hidden rounded-[20px] border border-border bg-card">
                {specialists.map((specialist) => (
                  <SpecialistRow key={specialist.clerkId} specialist={specialist} />
                ))}
              </ul>
            </section>
          ) : (
            <section className="mt-10" aria-labelledby="empty-heading">
              <div className="rounded-[20px] border border-dashed border-border bg-card/60 px-6 py-12 text-center">
                <SearchX className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <h2 id="empty-heading" className="mt-4 font-heading text-xl font-bold text-foreground">
                  {query ? `No specialists match “${query}” yet` : "No specialists to show yet"}
                </h2>
                <p className="mx-auto mt-2 max-w-[48ch] font-body text-base text-muted-foreground">
                  Post what you need done and specialists will apply to you, or try a different word.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {query ? (
                    <Link
                      href="/specialists"
                      className="inline-flex h-11 items-center rounded-full border border-border bg-card px-5 font-sans text-sm font-semibold text-foreground hover:bg-secondary"
                    >
                      Clear search
                    </Link>
                  ) : null}
                  <Link
                    href="/post-job"
                    className="inline-flex h-11 items-center rounded-full bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                  >
                    Post a job
                  </Link>
                </div>
              </div>

              {fallback.length > 0 ? (
                <div className="mt-12">
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                    Specialists on QuickHands
                  </h2>
                  <ul className="mt-4 divide-y divide-border overflow-hidden rounded-[20px] border border-border bg-card">
                    {fallback.map((specialist) => (
                      <SpecialistRow key={specialist.clerkId} specialist={specialist} />
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
