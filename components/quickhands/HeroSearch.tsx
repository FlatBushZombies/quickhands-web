"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Search } from "lucide-react"

/**
 * Searches real job listings via /jobs?q=... (backed by GET /api/jobs/search
 * on the Express backend, same endpoint the mobile apps use). Signed-out
 * visitors are sent to sign in first, with the intended search preserved
 * via Clerk's redirect_url convention so they land straight on their
 * results after authenticating instead of losing their query.
 */
export function HeroSearch() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    const destination = trimmed ? `/jobs?q=${encodeURIComponent(trimmed)}` : "/jobs"

    if (!isLoaded) return

    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(destination)}`)
      return
    }

    router.push(destination)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[560px] items-center gap-2 rounded-full border border-zinc-200 bg-white p-2 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.12)]"
      role="search"
      aria-label="Search jobs"
    >
      <Search className="ml-3 h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="What do you need done today?"
        className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover cursor-pointer"
      >
        Search
      </button>
    </form>
  )
}
