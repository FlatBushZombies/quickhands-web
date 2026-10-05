"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"
import { AppRoleProvider } from "@/components/app/AppRoleContext"
import "@/components/pro-account/pro-account.css"
import { authFontClassName } from "@/components/auth/fonts"
import { Ico, Ix, css, G } from "@/components/pro-account/ui"
import {
  ApplyModal,
  ExperienceModal,
  ProfessionModal,
  ReviewModal,
  ThreadModal,
  type ProfessionDraft,
} from "@/components/pro-account/ProAccountModals"
import {
  JobsView,
  MyJobsView,
  OverviewView,
  ProfileView,
  isInProgress,
  isJobDone,
  type SetupStep,
} from "@/components/pro-account/ProAccountViews"
import {
  CATEGORIES,
  YEAR_OPTIONS,
  deriveCategory,
  firstName,
  formatRange,
  initials,
  parseSkills,
  skillsForCategory,
  yearsFromStored,
  yearsLabel,
  type ProfessionCategory,
} from "@/components/pro-account/professions"
import {
  applyToJob,
  confirmApplicationCompletion,
  getApplicationReviews,
  getMyApplications,
  submitApplicationReview,
  type Application,
  type ReviewMatrix,
} from "@/lib/applications-api"
import { getRecommendedJobsForMe, jobBudget, type RecommendedJob } from "@/lib/jobs-api"
import {
  getBackendUser,
  getMyExperience,
  saveMyExperience,
  updateMyLocationLabel,
  updateOnboarding,
  type BackendUser,
  type ExperienceEntry,
} from "@/lib/user-api"

type View = "home" | "jobs" | "mine" | "profile"

type Modal =
  | { kind: "profession" }
  | { kind: "experience" }
  | { kind: "apply"; job: RecommendedJob }
  | { kind: "thread"; app: Application }
  | { kind: "review"; app: Application }
  | null

const SIGN_IN_PRO = "/sign-in#pro"

export function ProAccountView() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const { signOut } = useClerk()

  const appRole = user?.unsafeMetadata?.appRole as string | undefined
  const onboarded = user?.unsafeMetadata?.completedOnboarding === true
  const clerkId = user?.id ?? ""
  const ready = isLoaded && Boolean(user) && onboarded && appRole === "freelancer"

  const [view, setView] = useState<View>("home")
  const [jobFilter, setJobFilter] = useState("all")
  const [modal, setModal] = useState<Modal>(null)
  const [busy, setBusy] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [dismissedReviews, setDismissedReviews] = useState<Record<number, true>>({})

  const [profile, setProfile] = useState<BackendUser | null>(null)
  const [experience, setExperience] = useState<ExperienceEntry[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<RecommendedJob[]>([])
  const [matrices, setMatrices] = useState<Record<number, ReviewMatrix | null>>({})
  const [loaded, setLoaded] = useState(false)

  const refreshApplications = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    setApplications(await getMyApplications(token))
  }, [getToken])

  const loadAll = useCallback(async () => {
    const token = await getToken()
    if (!token || !clerkId) return
    const [backend, exp, apps, recommended] = await Promise.all([
      getBackendUser(clerkId),
      getMyExperience(token).catch(() => [] as ExperienceEntry[]),
      getMyApplications(token),
      getRecommendedJobsForMe(token, 50),
    ])
    setProfile(backend)
    setExperience(exp)
    setApplications(apps)
    setJobs(recommended.jobs)
    setLoaded(true)
  }, [clerkId, getToken])

  useEffect(() => {
    if (ready) void loadAll()
  }, [ready, loadAll])

  // Review matrices are needed only for completed jobs (the "Completed" list
  // and the review prompt), so they are fetched for those alone.
  useEffect(() => {
    if (!ready) return
    let cancelled = false
    ;(async () => {
      const token = await getToken()
      if (!token) return
      const completed = applications.filter((a) => isJobDone(a) && !(a.id in matrices))
      if (completed.length === 0) return
      const results = await Promise.all(completed.map((a) => getApplicationReviews(a.id, token)))
      if (cancelled) return
      setMatrices((current) => {
        const next = { ...current }
        completed.forEach((a, i) => {
          next[a.id] = results[i]
        })
        return next
      })
    })()
    return () => {
      cancelled = true
    }
  }, [ready, applications, matrices, getToken])

  const skills = useMemo(() => parseSkills(profile?.skills), [profile?.skills])
  const category: ProfessionCategory | null = useMemo(() => deriveCategory(skills), [skills])
  const hasProfession = skills.length > 0
  const area = profile?.location?.label ?? ""
  const name = user?.fullName || user?.firstName || ""
  const first = firstName(name) || "there"

  const appliedByJob = useMemo(() => {
    const map = new Map<number, Application>()
    applications.forEach((a) => map.set(a.jobId, a))
    return map
  }, [applications])
  const openJobs = jobs.filter((j) => !appliedByJob.has(j.id))
  const active = applications.filter(isInProgress)

  const setupDone = (hasProfession ? 1 : 0) + (experience.length > 0 ? 1 : 0)
  const setupTotal = 2

  // Prompt for the first completed job that has no review from this specialist yet.
  const pendingReview = applications.find(
    (a) =>
      isJobDone(a) &&
      matrices[a.id]?.canFreelancerReview === true &&
      !matrices[a.id]?.freelancerToClient &&
      !dismissedReviews[a.id]
  )
  useEffect(() => {
    if (!modal && pendingReview) setModal({ kind: "review", app: pendingReview })
  }, [modal, pendingReview])

  const setupSteps: SetupStep[] = [
    {
      icon: "briefcase",
      label: "Add your profession",
      hint: "Your trade and skills decide which tasks you receive.",
      done: hasProfession,
      doneLabel: category ? category.role : "Added",
      cta: "Add profession",
      act: () => openProfession(),
    },
    {
      icon: "history",
      label: "Add past work experience",
      hint: "Previous jobs or regular clients. Helps you win your first tasks.",
      done: experience.length > 0,
      doneLabel: `${experience.length} added`,
      cta: "Add experience",
      optional: true,
      act: () => setModal({ kind: "experience" }),
    },
  ]

  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [confirmError, setConfirmError] = useState<string | null>(null)

  const confirmCompletion = async (app: Application) => {
    setConfirmingId(app.id)
    setConfirmError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Not signed in")
      await confirmApplicationCompletion(app.id, token)
      await refreshApplications()
    } catch (error) {
      setConfirmError(error instanceof Error ? error.message : "Could not confirm completion")
    } finally {
      setConfirmingId(null)
    }
  }

  const openProfession = () => {
    setModalError(null)
    setModal({ kind: "profession" })
  }

  const saveProfession = async (draft: ProfessionDraft) => {
    setBusy(true)
    setModalError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Not signed in")
      const cat = CATEGORIES.find((c) => c.id === draft.categoryId)
      const chosen = cat ? draft.skills.filter((s) => skillsForCategory([s], cat.id).length) : draft.skills
      const updated = await updateOnboarding({
        clerkId,
        skills: chosen.join(", "),
        experienceLevel: yearsLabel(draft.years),
        completedOnboarding: true,
        appRole: "freelancer",
      })
      let location = updated.location
      const newArea = draft.area.trim()
      if (newArea && newArea !== area) {
        location = await updateMyLocationLabel(newArea, token)
      }
      setProfile({ ...updated, location })
      setModal(null)
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Could not save your profession")
    } finally {
      setBusy(false)
    }
  }

  const saveExperienceEntry = async (entry: ExperienceEntry) => {
    setBusy(true)
    setModalError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Not signed in")
      const saved = await saveMyExperience([...experience, entry], token)
      setExperience(saved)
      setModal(null)
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Could not save experience")
    } finally {
      setBusy(false)
    }
  }

  const removeExperience = async (index: number) => {
    const token = await getToken()
    if (!token) return
    const saved = await saveMyExperience(experience.filter((_, i) => i !== index), token)
    setExperience(saved)
  }

  const openJob = (job: RecommendedJob) => {
    const existing = appliedByJob.get(job.id)
    setModalError(null)
    if (existing) {
      setModal({ kind: "thread", app: existing })
    } else {
      setModal({ kind: "apply", job })
    }
  }

  const sendOffer = async (job: RecommendedJob, price: number, message: string) => {
    setBusy(true)
    setModalError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Not signed in")
      const result = await applyToJob(
        job.id,
        {
          userId: clerkId,
          userName: name,
          userEmail: user?.primaryEmailAddress?.emailAddress || undefined,
          quotation: `$${price}`,
          conditions: message || undefined,
        },
        token
      )
      if (result.status === "error") throw new Error(result.message)
      await refreshApplications()
      setModal(null)
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Could not send your offer")
    } finally {
      setBusy(false)
    }
  }

  const submitReview = async (app: Application, rating: number, text: string) => {
    setBusy(true)
    setModalError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Not signed in")
      const saved = await submitApplicationReview(app.id, { rating, comment: text }, token)
      setMatrices((current) => ({
        ...current,
        [app.id]: { ...(current[app.id] as ReviewMatrix), freelancerToClient: saved },
      }))
      setModal(null)
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Could not save your review")
    } finally {
      setBusy(false)
    }
  }

  const laterReview = (app: Application) => {
    setDismissedReviews((d) => ({ ...d, [app.id]: true }))
    setModal(null)
  }

  if (!ready) {
    return (
      <div className={`${authFontClassName} qh-pro-account`} style={css("display:flex;align-items:center;justify-content:center;min-height:100dvh")}>
        <div style={css(`width:32px;height:32px;border-radius:50%;border:2px solid ${G};border-top-color:transparent;animation:qhSpin 900ms linear infinite`)} />
      </div>
    )
  }

  const navItems: { id: View; label: string; icon: string; badge: string | number | null; badgeBg: string }[] = [
    { id: "home", label: "Overview", icon: "layout-grid", badge: setupDone < setupTotal ? setupTotal - setupDone : null, badgeBg: "#C2410C" },
    { id: "jobs", label: "Jobs for you", icon: "briefcase", badge: hasProfession && openJobs.length ? openJobs.length : null, badgeBg: G },
    { id: "mine", label: "My jobs", icon: "send", badge: active.length || null, badgeBg: "var(--ink-950)" },
    { id: "profile", label: "Profile", icon: "user-round", badge: null, badgeBg: G },
  ]

  const threadApp = modal?.kind === "thread" ? modal.app : null

  return (
    <AppRoleProvider value={{ appRole: "freelancer", clerkId }}>
      <div className={`${authFontClassName} qh-pro-account`} style={css("min-height:100dvh")}>
        <header
          style={css(
            "position:sticky;top:0;z-index:20;background:var(--surface-glass);backdrop-filter:var(--blur-glass);-webkit-backdrop-filter:var(--blur-glass);border-bottom:1px solid var(--border-hairline)"
          )}
        >
          <div style={css("max-width:var(--container-max);margin:0 auto;padding:0 var(--gutter);height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px")}>
            <a href="/professionals" style={css("display:flex;align-items:baseline;gap:8px;text-decoration:none;color:var(--fg-1)")}>
              <span style={css("font:600 20px/1 var(--font-sans);letter-spacing:-0.05em")}>quickhands</span>
              <span style={css(`font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:${G}`)}>Pro</span>
            </a>
            <div style={css("display:flex;align-items:center;gap:10px;padding:4px 12px 4px 4px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--border-hairline)")}>
              <span style={css(`position:relative;width:32px;height:32px;border-radius:50%;background:${G};color:var(--white);display:inline-flex;align-items:center;justify-content:center;font:500 13px/1 var(--font-sans)`)}>
                {initials(name || "U")}
              </span>
              <span style={css("display:flex;flex-direction:column;gap:3px")}>
                <span style={css("font:500 14px/1 var(--font-sans)")}>{first}</span>
                <span style={css("font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)")}>
                  {category ? category.role : "Specialist"}
                </span>
              </span>
            </div>
          </div>
        </header>

        <div style={css("max-width:var(--container-max);margin:0 auto;padding:40px var(--gutter) 80px;display:flex;flex-wrap:wrap;gap:40px;align-items:flex-start")}>
          <nav style={css("flex:0 0 220px;position:sticky;top:104px;display:flex;flex-direction:column;gap:2px")} aria-label="Account sections">
            {navItems.map((n) => {
              const on = view === n.id
              return (
                <Ix
                  key={n.id}
                  onClick={() => setView(n.id)}
                  aria-current={on ? "page" : undefined}
                  base={`display:flex;align-items:center;gap:12px;height:42px;padding:0 12px;border:0;border-radius:var(--radius-md);background:${on ? "var(--ink-100)" : "transparent"};color:${on ? "var(--fg-1)" : "var(--fg-2)"};font:500 14px/1 var(--font-sans);cursor:pointer;text-align:left`}
                  hover="background:var(--ink-100);color:var(--fg-1)"
                >
                  <Ico name={n.icon} size={16} />
                  <span style={css("flex:1")}>{n.label}</span>
                  {n.badge !== null ? (
                    <span style={css(`min-width:20px;height:20px;padding:0 6px;box-sizing:border-box;border-radius:999px;background:${n.badgeBg};color:var(--white);font:500 11px/20px var(--font-sans);text-align:center`)}>
                      {n.badge}
                    </span>
                  ) : null}
                </Ix>
              )
            })}
            <div style={css("height:1px;background:var(--border-hairline);margin:14px 0")} />
            <Ix
              onClick={() => signOut({ redirectUrl: SIGN_IN_PRO })}
              base="display:flex;align-items:center;gap:12px;height:42px;padding:0 12px;border:0;border-radius:var(--radius-md);background:transparent;color:var(--fg-3);font:500 14px/1 var(--font-sans);cursor:pointer;text-align:left"
              hover="background:var(--ink-100);color:var(--fg-1)"
            >
              <Ico name="log-out" size={16} />
              Sign out
            </Ix>
          </nav>

          <main style={css("flex:1 1 600px;min-width:0;display:flex;flex-direction:column;gap:32px")}>
            {!loaded ? (
              <div style={css("height:240px;border-radius:var(--radius-xl);background:var(--ink-100)")} aria-hidden="true" />
            ) : view === "home" ? (
              <OverviewView
                firstName={first}
                setupSteps={setupSteps}
                setupDone={setupDone}
                setupTotal={setupTotal}
                activeCount={active.length}
                activeTitle={active.length === 1 ? `You've been hired for ${(active[0].job?.serviceType || "a job").toLowerCase()}` : `You have ${active.length} jobs in progress`}
                activeSub="Open My jobs to message the client or see the job."
                previewJobs={openJobs.slice(0, 3).map((job) => ({ job, applied: false }))}
                newJobCount={openJobs.length}
                hasProfession={hasProfession}
                onGoJobs={() => setView("jobs")}
                onGoMine={() => setView("mine")}
                onOpenJob={openJob}
                onAddProfession={openProfession}
              />
            ) : view === "jobs" ? (
              <JobsView
                hasProfession={hasProfession}
                category={category}
                skills={skills}
                filter={jobFilter}
                onFilter={setJobFilter}
                jobs={jobs}
                appliedJobIds={new Set(appliedByJob.keys())}
                loaded={loaded}
                onOpenJob={openJob}
                onAddProfession={openProfession}
              />
            ) : view === "mine" ? (
              <MyJobsView
                applications={applications}
                matrices={matrices}
                onOpenThread={(app) => setModal({ kind: "thread", app })}
                onReview={(app) => {
                  setModalError(null)
                  setModal({ kind: "review", app })
                }}
                onBrowse={() => setView("jobs")}
                onConfirm={confirmCompletion}
                confirmingId={confirmingId}
                confirmError={confirmError}
              />
            ) : (
              <ProfileView
                hasProfession={hasProfession}
                roleTitle={category ? category.role : ""}
                skills={skills}
                yearsLabel={YEAR_OPTIONS.find((o) => o.value === yearsFromStored(profile?.experienceLevel))?.long ?? "1–3 years"}
                area={area}
                experience={experience}
                onEditProfession={openProfession}
                onAddExperience={() => setModal({ kind: "experience" })}
                onRemoveExperience={removeExperience}
              />
            )}
          </main>
        </div>

        {modal?.kind === "profession" ? (
          <ProfessionModal
            initial={{
              categoryId: category?.id ?? null,
              skills,
              years: yearsFromStored(profile?.experienceLevel),
              area,
            }}
            saving={busy}
            error={modalError}
            onSave={saveProfession}
            onClose={() => setModal(null)}
          />
        ) : null}

        {modal?.kind === "experience" ? (
          <ExperienceModal saving={busy} error={modalError} onSave={saveExperienceEntry} onClose={() => setModal(null)} />
        ) : null}

        {modal?.kind === "apply" ? (
          <ApplyModal
            job={{
              skill: modal.job.selectedServices?.[0] || "Job",
              area: modal.job.location?.label || modal.job.location?.city || "Location not set",
              title: modal.job.serviceType,
              when: formatRange(modal.job.startDate, modal.job.endDate),
              budgetText: jobBudget(modal.job.maxPrice) ? `Budget $${jobBudget(modal.job.maxPrice)}` : "No budget set",
              maxPrice: jobBudget(modal.job.maxPrice) ?? 0,
            }}
            saving={busy}
            error={modalError}
            onSend={(price, message) => sendOffer(modal.job, price, message)}
            onClose={() => setModal(null)}
          />
        ) : null}

        {threadApp ? <ThreadModal conversationId={threadApp.conversationId ?? null} onClose={() => setModal(null)} /> : null}

        {modal?.kind === "review" ? (
          <ReviewModal
            name={modal.app.job?.clientName || "Client"}
            sub={`Rate ${modal.app.job?.clientName || "the client"} as a client.`}
            saving={busy}
            error={modalError}
            onSubmit={(rating, text) => submitReview(modal.app, rating, text)}
            onLater={() => laterReview(modal.app)}
          />
        ) : null}
      </div>
    </AppRoleProvider>
  )
}

