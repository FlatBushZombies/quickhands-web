"use client"

import { useEffect, useRef, useState } from "react"

export default function UserCounter() {
  const [count, setCount] = useState<number>(0)
  const [tick, setTick] = useState(0)
  const prevCountRef = useRef<number | null>(null)

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/client")
      const data = await res.json()
      if (prevCountRef.current !== data.count) {
        prevCountRef.current = data.count
        setCount(data.count)
        setTick((t) => t + 1)
      }
    } catch (err) {
      console.error("Failed to fetch count:", err)
    }
  }

  useEffect(() => {
    fetchCount()
    const interval = setInterval(fetchCount, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <p className="font-sans text-balance text-lg sm:text-xl leading-relaxed text-[#4a5568] max-w-2xl">
      <span className="inline-flex items-center gap-2 align-middle mr-1.5">
        <span
          key={tick}
          className="relative inline-flex items-center font-mono text-[1.1em] font-semibold text-[#166534] bg-gradient-to-b from-[#dcfce7] to-[#bbf7d0] border border-[#86efac]/60 rounded-xl px-3 py-1 tracking-tight shadow-[0_2px_8px_rgba(34,197,94,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] animate-[countpop_.35s_cubic-bezier(.34,1.56,.64,1)_both]"
        >
          {count.toLocaleString()}
        </span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
        </span>
      </span>
      clients have already connected with trusted professionals on our platform.
    </p>
  )
}
