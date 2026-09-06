"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Loader2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { submitApplicationReview, type ReviewEntry } from "@/lib/applications-api"

export function ReviewForm({
  applicationId,
  existingReview,
  onSubmitted,
}: {
  applicationId: number
  existingReview: ReviewEntry | null
  onSubmitted: (saved: ReviewEntry) => void
}) {
  const { getToken } = useAuth()
  const [rating, setRating] = useState(existingReview?.rating ?? 5)
  const [comment, setComment] = useState(existingReview?.comment ?? "")
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Not signed in")
      // Use the response the write already returns instead of leaving the
      // caller's cached review matrix stale until some later re-fetch.
      const savedReview = await submitApplicationReview(applicationId, { rating, comment: comment.trim() }, token)
      setSaved(true)
      onSubmitted(savedReview)
    } catch (error) {
      console.error("Failed to save review:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-border bg-background p-4">
      <p className="text-xs font-semibold text-foreground">{existingReview ? "Your review" : "Leave a review"}</p>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} stars`}>
            <Star className={`h-5 w-5 ${value <= rating ? "fill-warning text-warning" : "text-border"}`} />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How did it go?"
        className="mt-2"
      />
      <Button size="sm" className="mt-2" onClick={handleSubmit} disabled={submitting}>
        {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved || existingReview ? "Update review" : "Save review"}
      </Button>
    </div>
  )
}
