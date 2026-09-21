"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

/**
 * The landing page's search is a client looking for a specialist: it goes
 * straight to /specialists?q=... — public, no sign-in wall. Browsing is free;
 * the account gate sits at "Hire Now" (see /hire/[specialist]), where it
 * belongs.
 */
export function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/specialists?q=${encodeURIComponent(trimmed)}` : "/specialists")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[560px] items-center gap-2 rounded-full border border-zinc-200 bg-white p-2 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.12)]"
      role="search"
      aria-label="Search specialists"
    >
      <Search className="ml-3 h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search a specialist: plumber, electrician, cleaner…"
        aria-label="Search for a specialist by skill, trade or location"
        className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[15px] text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-0"
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
