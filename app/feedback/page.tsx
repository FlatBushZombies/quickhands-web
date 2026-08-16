"use client"

import { useState } from "react"
import Link from "next/link"

const feedbackTypes = [
  "Product Improvement",
  "Bug Report",
  "Feature Request",
  "General Feedback",
  "Other",
]

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    feedbackType: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Something went wrong")
      }

      setStatus("success")
      setForm({ name: "", email: "", feedbackType: "", message: "" })
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Failed to send feedback")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10 pb-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors mb-4 inline-block font-medium"
          >
            &larr; Back to home
          </Link>
          <h1 className="font-heading text-4xl font-bold text-foreground tracking-tight mb-2">Feedback</h1>
          <p className="font-body text-[15px] font-normal text-muted-foreground">
            Help us improve QuickHands &mdash; we&apos;d love to hear from you.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-sm p-8 sm:p-10">
          {status === "success" ? (
            <div className="rounded-2xl border border-primary/20 bg-primary-light p-6 text-center">
              <h2 className="font-heading text-lg font-bold text-primary-hover mb-2">
                Thank you for your feedback!
              </h2>
              <p className="font-body text-[15px] font-normal text-primary-hover/90 mb-4">
                We&apos;ve received your message and will review it shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-sm text-primary-hover underline hover:text-primary transition-colors font-medium"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-150"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-150"
                />
              </div>

              {/* Feedback type */}
              <div>
                <label
                  htmlFor="feedbackType"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Feedback Type
                </label>
                <select
                  id="feedbackType"
                  name="feedbackType"
                  required
                  value={form.feedbackType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-150"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {feedbackTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what you think..."
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-all duration-150"
                />
              </div>

              {/* Error message */}
              {status === "error" && (
                <p className="text-sm text-destructive font-medium">{errorMsg}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-md cursor-pointer"
              >
                {status === "loading" ? "Sending..." : "Submit Feedback"}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/60 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Quickhands Africa. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
