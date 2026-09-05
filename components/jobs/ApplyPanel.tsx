"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useAuth } from "@clerk/nextjs"
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { applyToJob, type ApplyResult } from "@/lib/applications-api"
import { ensureBackendUser } from "@/lib/user-api"
import type { Job } from "@/lib/jobs-api"

type ScreenState = "form" | "submitting" | "success" | "error" | "already_applied"

export function ApplyPanel({ job }: { job: Job }) {
  const { user, isLoaded, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const pathname = usePathname()

  const [screen, setScreen] = useState<ScreenState>("form")
  const [quotation, setQuotation] = useState("")
  const [conditions, setConditions] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [conversation, setConversation] = useState<Extract<ApplyResult, { status: "success" }>["conversation"]>()

  if (!isLoaded) {
    return <div className="h-32 animate-pulse rounded-2xl bg-secondary" />
  }

  if (!isSignedIn) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">Sign in to apply for this job.</p>
        <Link href={`/sign-in?redirect_url=${encodeURIComponent(pathname)}`}>
          <Button className="mt-4">Sign in</Button>
        </Link>
      </div>
    )
  }

  if (user?.id === job.clerkId) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">This is your own job posting.</p>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (!quotation.trim()) return
    setScreen("submitting")

    const token = await getToken()
    if (!token) {
      setErrorMessage("Could not verify your session. Please try again.")
      setScreen("error")
      return
    }

    // A visitor can reach this panel straight from the hero search without
    // ever going through /onboarding (that route only gates /dashboard,
    // /post-job, /messages) — make sure a backend profile exists so their
    // dashboard/reviews have something to attach to. Applying itself
    // doesn't depend on this succeeding, so it's fire-and-forget.
    ensureBackendUser(
      { id: user!.id, fullName: user!.fullName, imageUrl: user!.imageUrl, primaryEmailAddress: user!.primaryEmailAddress },
      "freelancer"
    ).catch(() => {})

    const result = await applyToJob(
      job.id,
      {
        userId: user!.id,
        userName: user!.fullName || "Specialist",
        userEmail: user!.primaryEmailAddress?.emailAddress,
        quotation: quotation.trim(),
        conditions: conditions.trim() || undefined,
      },
      token
    )

    if (result.status === "success") {
      setConversation(result.conversation)
      setScreen("success")
    } else if (result.status === "already_applied") {
      setScreen("already_applied")
    } else {
      setErrorMessage(result.message)
      setScreen("error")
    }
  }

  if (screen === "success") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-3 font-heading text-lg font-bold text-foreground">Application submitted</h3>
        <p className="mt-1 text-sm text-muted-foreground">The client has been notified.</p>
        {conversation ? (
          <Link href={`/messages/${conversation.conversationId}`}>
            <Button className="mt-4" variant="outline">
              <MessageCircle className="h-4 w-4" />
              Message {conversation.otherDisplayName}
            </Button>
          </Link>
        ) : null}
      </div>
    )
  }

  if (screen === "already_applied") {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-semibold text-foreground">You&apos;ve already applied to this job</p>
        <Link href="/dashboard" className="mt-3 inline-block text-sm text-primary hover:underline">
          View your applications
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="font-heading text-lg font-bold text-foreground">Apply for this job</h3>

      <div className="mt-4">
        <Label htmlFor="quotation" className="text-sm font-semibold text-foreground">
          Your rate or total cost
        </Label>
        <Input
          id="quotation"
          value={quotation}
          onChange={(e) => setQuotation(e.target.value)}
          placeholder="e.g. 150/hour or 2,500 total"
          className="mt-2"
        />
      </div>

      <div className="mt-4">
        <Label htmlFor="conditions" className="text-sm font-semibold text-foreground">
          Timeline, requirements, terms (optional)
        </Label>
        <Textarea
          id="conditions"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder="Anything the client should know upfront"
          className="mt-2"
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">First 5 applicants only.</p>

      {screen === "error" ? <p className="mt-3 text-sm text-destructive">{errorMessage}</p> : null}

      <Button className="mt-4 w-full" onClick={handleSubmit} disabled={screen === "submitting" || !quotation.trim()}>
        {screen === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit application"}
      </Button>
      {!quotation.trim() && screen !== "submitting" ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">Enter your rate above to submit</p>
      ) : null}
    </div>
  )
}
