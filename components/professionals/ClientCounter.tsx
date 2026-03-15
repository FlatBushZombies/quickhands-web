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
        setTick(t => t + 1)
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
    <p className="font-serif text-balance text-lg sm:text-xl leading-relaxed text-[#4a5568] max-w-2xl">
      <span className="inline-flex items-center gap-1.5 align-middle mr-1">
        <span
          key={tick}
          className="font-mono text-[1.15em] font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-2.5 py-0.5 tracking-tight animate-[countpop_.35s_cubic-bezier(.34,1.56,.64,1)_both]"
        >
          {count.toLocaleString()}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
      </span>
      clients have already connected with trusted professionals on our platform.
    </p>
  )
}