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
    <p className="font-sans text-[1rem] leading-relaxed text-[#78716c] max-w-lg">
      <span className="inline-flex items-center gap-2 align-middle mr-2">
        <span
          key={tick}
          className="relative inline-flex items-center font-mono text-[0.9375rem] font-semibold text-[#1c1917] bg-[#f5f5f4] border border-[#e7e5e4] rounded-lg px-2.5 py-0.5 tracking-tight animate-[countpop_.3s_cubic-bezier(.22,1,.36,1)_both]"
        >
          {count.toLocaleString()}
        </span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
      </span>
      clients have already connected with trusted professionals on our platform.
    </p>
  )
}