"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { Loader2, TriangleAlert } from "lucide-react"
import { getConversationWithUser } from "@/lib/messaging-api"

interface HireRedirectProps {
  clerkId: string | null
  name: string | null
}

function friendlyError(message: string) {
  if (/yourself/i.test(message)) {
    return "This is your own profile, so there's no one to message. Share this page with clients instead."
  }
  return message
}

/**
 * "Hire Now" lands here. proxy.ts already guarantees the visitor is signed
 * in (Clerk sends signed-out visitors to sign in and back to this exact URL),
 * so all that's left is to open — or find — the direct conversation with the
 * specialist and drop them into it. The backend derives a deterministic
 * conversation id, so repeats and retries never create duplicates.
 */
export function HireRedirect({ clerkId, name }: HireRedirectProps) {
  const router = useRouter()
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const [error, setError] = useState<string | null>(
    clerkId ? null : "This specialist can't be contacted right now. Please try again later."
  )
  const startedRef = useRef(false)

  const openConversation = useCallback(async () => {
    if (!clerkId) return
    setError(null)

    const token = await getToken()
    if (!token) {
      setError("Couldn't verify your session. Please sign in again.")
      return
    }

    const result = await getConversationWithUser(clerkId, token)
    if ("conversationId" in result) {
      router.replace(`/messages/${result.conversationId}`)
      return
    }
    setError(friendlyError(result.error))
  }, [clerkId, getToken, router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || startedRef.current) return
    startedRef.current = true
    void openConversation()
  }, [isLoaded, isSignedIn, openConversation])

  const displayName = name || "this specialist"

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm text-center" role="status" aria-live="polite">
        {error ? (
          <>
            <TriangleAlert className="mx-auto h-8 w-8 text-warning" aria-hidden="true" />
            <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">We couldn&apos;t open the chat</h1>
            <p className="mt-2 font-body text-base text-muted-foreground">{error}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {clerkId ? (
                <button
                  type="button"
                  onClick={() => {
                    startedRef.current = true
                    void openConversation()
                  }}
                  className="inline-flex h-11 cursor-pointer items-center rounded-full bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                >
                  Try again
                </button>
              ) : null}
              <Link
                href="/specialists"
                className="inline-flex h-11 items-center rounded-full border border-border bg-card px-5 font-sans text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Back to specialists
              </Link>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary motion-reduce:animate-none" aria-hidden="true" />
            <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Opening your conversation</h1>
            <p className="mt-2 font-body text-base text-muted-foreground">
              Connecting you with {displayName}. This can take a few seconds.
            </p>
          </>
        )}
      </div>
    </main>
  )
}
