"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useAppRole } from "@/components/app/AppRoleContext"
import { getClientApplications, getMyApplications, type ApplicationStatus } from "@/lib/applications-api"
import { getConversations, type Conversation } from "@/lib/messaging-api"

/**
 * Read-only data behind the list panel and the pane header's meta line.
 * Built from the same API functions the pages already use — no new
 * endpoints. Fetched once when the shell mounts, then again only when the
 * route moves to /dashboard or /messages, never more often than every 20s
 * (no polling; the Render backend cold-starts and fetchWithRetry already
 * absorbs that).
 */

export interface ShellJobRow {
  id: number
  title: string
  /** Client: applicants still awaiting a decision. */
  pending?: number
  /** Specialist: status of the application. */
  status?: ApplicationStatus
}

export type ShellLoadState = "loading" | "ready" | "error"

interface ShellDataValue {
  jobs: ShellJobRow[]
  jobsState: ShellLoadState
  conversations: Conversation[]
  conversationsState: ShellLoadState
}

const MIN_REFETCH_INTERVAL_MS = 20000

const ShellDataContext = createContext<ShellDataValue | null>(null)

export function ShellDataProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const { appRole } = useAppRole()
  const { getToken } = useAuth()
  const pathname = usePathname()

  const [jobs, setJobs] = useState<ShellJobRow[]>([])
  const [jobsState, setJobsState] = useState<ShellLoadState>("loading")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [conversationsState, setConversationsState] = useState<ShellLoadState>("loading")

  const lastFetchRef = useRef(0)
  const inFlightRef = useRef(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const load = useCallback(async () => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    lastFetchRef.current = Date.now()
    try {
      const token = await getToken()
      if (!token || !mountedRef.current) {
        lastFetchRef.current = 0 // nothing was fetched — let the next trigger retry
        return
      }

      const jobsTask =
        appRole === "client"
          ? getClientApplications(token).then((data): ShellJobRow[] =>
              data.map((job) => ({ id: job.id, title: job.serviceType, pending: job.applicationSummary.pending }))
            )
          : getMyApplications(token).then((data): ShellJobRow[] =>
              data.map((application) => ({
                id: application.id,
                title: application.job?.serviceType || "Job",
                status: application.status,
              }))
            )

      const [jobsResult, conversationsResult] = await Promise.allSettled([jobsTask, getConversations(token)])
      if (!mountedRef.current) return

      if (jobsResult.status === "fulfilled") {
        setJobs(jobsResult.value)
        setJobsState("ready")
      } else {
        setJobsState((current) => (current === "ready" ? current : "error"))
      }
      if (conversationsResult.status === "fulfilled") {
        setConversations(conversationsResult.value)
        setConversationsState("ready")
      } else {
        setConversationsState((current) => (current === "ready" ? current : "error"))
      }
    } finally {
      inFlightRef.current = false
    }
  }, [appRole, getToken])

  // First load as soon as the panel is actually in use (≥ lg). Also covers
  // the panel becoming enabled later (window resized up from mobile).
  useEffect(() => {
    if (!enabled) return
    if (Date.now() - lastFetchRef.current < MIN_REFETCH_INTERVAL_MS) return
    void load()
  }, [enabled, load])

  // Refresh when navigating to the two routes that change this data.
  useEffect(() => {
    if (!enabled) return
    const relevant = pathname === "/dashboard" || pathname?.startsWith("/messages")
    if (!relevant) return
    if (Date.now() - lastFetchRef.current < MIN_REFETCH_INTERVAL_MS) return
    void load()
  }, [pathname, enabled, load])

  const value = useMemo(
    () => ({ jobs, jobsState, conversations, conversationsState }),
    [jobs, jobsState, conversations, conversationsState]
  )

  return <ShellDataContext.Provider value={value}>{children}</ShellDataContext.Provider>
}

export function useShellData() {
  const ctx = useContext(ShellDataContext)
  if (!ctx) throw new Error("useShellData must be used within ShellDataProvider")
  return ctx
}
