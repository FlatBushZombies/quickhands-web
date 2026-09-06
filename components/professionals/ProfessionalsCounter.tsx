"use client"

import { useEffect, useRef, useState } from "react"

export default function ProfessionalCounter() {
  const [count, setCount] = useState<number>(0)
  const [tick, setTick] = useState(0)
  const prevCountRef = useRef<number | null>(null)

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/onboarding")
      const data = await res.json()
      if (typeof data.count === "number" && prevCountRef.current !== data.count) {
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
    <span className="block font-sans text-[15px] font-medium text-slate-600 m-0">
      <span
        key={tick}
        className="font-mono font-semibold text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5 mr-1.5 text-[15px] animate-[countpop_.35s_cubic-bezier(.34,1.56,.64,1)_both]"
      >
        {count.toLocaleString()}
      </span>
      professionals have already joined QuickHands.
    </span>
  )
}