import type { Metadata } from "next"
import Link from "next/link"
import { Search, SearchX } from "lucide-react"
import { Header } from "@/components/quickhands/Header"
import { Footer } from "@/components/Footer"
import { SpecialistRow } from "@/components/specialists/SpecialistRow"
import { SPECIALISTS_CSS, SPECIALISTS_ROOT_CLASS } from "@/components/specialists/specialists-design"
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
    <div className={SPECIALISTS_ROOT_CLASS}>
      <style>{SPECIALISTS_CSS}</style>
      <Header />
      <main className="qh-sp-main">
        <div className="qh-sp-wrap">
          <span className="qh-sp-eyebrow">Specialist directory</span>
          <h1 className="qh-sp-h1">
            Find a <em>specialist</em>
          </h1>
          <p className="qh-sp-lead">
            Search by skill, trade or location. Open a profile to see their work, then message them when you&apos;re ready.
          </p>

          <form action="/specialists" method="get" role="search" aria-label="Search specialists" className="qh-sp-search">
            <Search size={18} strokeWidth={1.5} className="qh-sp-search-icon" aria-hidden="true" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Plumber, electrician, cleaner…"
              aria-label="Search for a specialist by skill, trade or location"
            />
            <button type="submit" className="qh-sp-btn qh-sp-btn-primary">
              Search
            </button>
          </form>

          {unavailable ? (
            <div className="qh-sp-section">
              <div className="qh-sp-panel">
                <SearchX size={32} strokeWidth={1.5} className="qh-sp-panel-icon" aria-hidden="true" />
                <h2 className="qh-sp-panel-title">We couldn&apos;t load specialists just now</h2>
                <p className="qh-sp-panel-body">
                  This usually clears up in a moment. Try again, or post a job and let specialists come to you.
                </p>
                <div className="qh-sp-panel-actions">
                  <Link
                    href={query ? `/specialists?q=${encodeURIComponent(query)}` : "/specialists"}
                    className="qh-sp-btn qh-sp-btn-ghost"
                  >
                    Try again
                  </Link>
                  <Link href="/post-job" className="qh-sp-btn qh-sp-btn-primary">
                    Post a job
                  </Link>
                </div>
              </div>
            </div>
          ) : specialists.length > 0 ? (
            <section className="qh-sp-section" aria-labelledby="results-heading">
              <h2 id="results-heading" className="qh-sp-label">
                {resultLabel}
              </h2>
              <ul className="qh-sp-list">
                {specialists.map((specialist) => (
                  <SpecialistRow key={specialist.clerkId} specialist={specialist} />
                ))}
              </ul>
            </section>
          ) : (
            <section className="qh-sp-section" aria-labelledby="empty-heading">
              <div className="qh-sp-panel">
                <SearchX size={32} strokeWidth={1.5} className="qh-sp-panel-icon" aria-hidden="true" />
                <h2 id="empty-heading" className="qh-sp-panel-title">
                  {query ? `No specialists match “${query}” yet` : "No specialists to show yet"}
                </h2>
                <p className="qh-sp-panel-body">
                  Post what you need done and specialists will apply to you, or try a different word.
                </p>
                <div className="qh-sp-panel-actions">
                  {query ? (
                    <Link href="/specialists" className="qh-sp-btn qh-sp-btn-ghost">
                      Clear search
                    </Link>
                  ) : null}
                  <Link href="/post-job" className="qh-sp-btn qh-sp-btn-primary">
                    Post a job
                  </Link>
                </div>
              </div>

              {fallback.length > 0 ? (
                <div className="qh-sp-fallback">
                  <h2 className="qh-sp-section-title">Specialists on QuickHands</h2>
                  <ul className="qh-sp-list">
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
    </div>
  )
}
