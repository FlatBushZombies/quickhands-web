"use client"

import { useState } from "react"
import { Check, Share2 } from "lucide-react"

/** Top-right share affordance from the reference — copies the page URL (falls back from the Web Share API). */
export function BioShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: name, url })
        return
      }
    } catch {
      // User cancelled or share isn't available — fall through to copy.
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable — nothing more we can do silently.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this page"
      title="Share this page"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-card text-foreground/70 shadow-sm transition-colors hover:text-primary"
    >
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Share2 className="h-4 w-4" />}
    </button>
  )
}
