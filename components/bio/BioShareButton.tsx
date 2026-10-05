"use client"

import { useState } from "react"
import { Check, Share2 } from "lucide-react"
import { BIO_ACCENT, BIO_INSET } from "@/components/bio/BioDesign"

/** Top-right share affordance — copies the page URL (falls back from the Web Share API). */
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
      className="qh-bio-share"
      style={{
        display: "flex",
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: 0,
        background: "#FFFFFF",
        color: "var(--fg-2)",
        boxShadow: BIO_INSET,
        cursor: "pointer",
      }}
    >
      {copied ? <Check style={{ width: 16, height: 16, color: BIO_ACCENT }} /> : <Share2 style={{ width: 16, height: 16 }} />}
    </button>
  )
}
