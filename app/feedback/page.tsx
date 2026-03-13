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
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-gray-200">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
          >
            &larr; Back to home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Feedback</h1>
          <p className="text-sm text-gray-500">
            Help us improve QuickHands &mdash; we&apos;d love to hear from you.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Thank you for your feedback!
            </h2>
            <p className="text-green-700 text-sm mb-4">
              We&apos;ve received your message and will review it shortly.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-sm text-green-700 underline hover:text-green-900"
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
                className="block text-sm font-medium text-gray-900 mb-1.5"
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
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-1.5"
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
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Feedback type */}
            <div>
              <label
                htmlFor="feedbackType"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Feedback Type
              </label>
              <select
                id="feedbackType"
                name="feedbackType"
                required
                value={form.feedbackType}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
                className="block text-sm font-medium text-gray-900 mb-1.5"
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
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none"
              />
            </div>

            {/* Error message */}
            {status === "error" && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === "loading" ? "Sending..." : "Submit Feedback"}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            &copy; 2026 Quickhands Africa. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
