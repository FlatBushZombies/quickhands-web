"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {
  Briefcase,
  Wrench,
  Zap,
  Sparkles,
  Hammer,
  PaintBucket,
  Truck,
  Grid2x2,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ensureBackendUser, updateOnboarding, type AppRole } from "@/lib/user-api"

// Same field set/labels as freelance-app's app/(auth)/onboarding.tsx, for
// backend data parity — a specialist's skills/experience/rate are read by
// the marketplace's job-matching logic regardless of which app wrote them.
const SKILL_OPTIONS = [
  { label: "Plumbing", Icon: Wrench },
  { label: "Electrical", Icon: Zap },
  { label: "Cleaning", Icon: Sparkles },
  { label: "Carpentry", Icon: Hammer },
  { label: "Painting", Icon: PaintBucket },
  { label: "Moving", Icon: Truck },
  { label: "Other", Icon: Grid2x2 },
] as const

const EXPERIENCE_LEVELS = [
  { label: "Beginner", subtitle: "0-2 years", value: "Beginner (0-2 years)" },
  { label: "Intermediate", subtitle: "2-5 years", value: "Intermediate (2-5 years)" },
  { label: "Expert", subtitle: "5+ years", value: "Expert (5+ years)" },
] as const

type Step = "role" | "client-confirm" | "freelancer-details"

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [step, setStep] = useState<Step>("role")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState("")
  const [experienceLevel, setExperienceLevel] = useState<string>("")
  const [hourlyRate, setHourlyRate] = useState("")

  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.completedOnboarding === true) {
      router.replace("/dashboard")
    }
  }, [isLoaded, user, router])

  if (!isLoaded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  const toggleSkill = (label: string) => {
    setSelectedSkills((current) =>
      current.includes(label) ? current.filter((s) => s !== label) : [...current, label]
    )
  }

  const hasAnySkill =
    selectedSkills.filter((s) => s !== "Other").length > 0 || (selectedSkills.includes("Other") && customSkill.trim().length > 0)
  const isFreelancerFormValid =
    hasAnySkill && experienceLevel.length > 0 && hourlyRate.trim().length > 0 && !isNaN(parseFloat(hourlyRate)) && parseFloat(hourlyRate) > 0

  const finishAs = async (appRole: AppRole) => {
    setSubmitting(true)
    setError(null)

    try {
      if (appRole === "client") {
        await user.update({ unsafeMetadata: { appRole, completedOnboarding: true } })
        // Fire-and-forget: the client's backend row has nothing else to
        // capture at signup, and a sync hiccup here shouldn't block someone
        // who's already confirmed their Clerk-side onboarding.
        void ensureBackendUser(
          { id: user.id, fullName: user.fullName, imageUrl: user.imageUrl, primaryEmailAddress: user.primaryEmailAddress },
          appRole
        ).catch((syncError) => console.error("Backend user sync failed:", syncError))
      } else {
        const skillsValue = [...selectedSkills.filter((s) => s !== "Other"), customSkill.trim()]
          .filter(Boolean)
          .join(", ")

        // Awaited, not fire-and-forget — match.service.js's job-matching
        // logic reads skills/experienceLevel/hourlyRate directly, so a
        // specialist whose backend sync silently failed would never
        // actually receive job notifications.
        await updateOnboarding({
          clerkId: user.id,
          name: user.fullName || undefined,
          skills: skillsValue,
          experienceLevel,
          hourlyRate: parseFloat(hourlyRate),
          completedOnboarding: true,
          appRole,
        })
        await user.update({ unsafeMetadata: { appRole, completedOnboarding: true } })
      }

      router.replace("/dashboard")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#26c08d1a_1px,transparent_1px),linear-gradient(to_bottom,#26c08d1a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_105%)]" />

      <div className="relative mx-auto max-w-2xl px-6 py-16">
        {step === "role" ? (
          <>
            <h1 className="font-heading text-center text-3xl font-bold text-foreground">Welcome to Quickhands</h1>
            <p className="font-body mt-2 text-center text-muted-foreground">How do you want to use Quickhands?</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStep("client-confirm")}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Briefcase className="h-7 w-7" />
                </span>
                <span className="font-heading text-lg font-bold text-foreground">Hire specialists</span>
                <span className="text-sm text-muted-foreground">Post jobs and find help for tasks around you.</span>
              </button>

              <button
                type="button"
                onClick={() => setStep("freelancer-details")}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Wrench className="h-7 w-7" />
                </span>
                <span className="font-heading text-lg font-bold text-foreground">Find work</span>
                <span className="text-sm text-muted-foreground">Browse jobs and apply as a specialist.</span>
              </button>
            </div>
          </>
        ) : step === "client-confirm" ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="h-7 w-7" />
            </span>
            <h2 className="font-heading mt-4 text-2xl font-bold text-foreground">Setting up your Client account</h2>
            <p className="font-body mt-2 text-muted-foreground">You&apos;ll be able to post jobs and review applications from specialists.</p>

            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

            <div className="mt-8 flex justify-center gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep("role")} disabled={submitting}>
                Back
              </Button>
              <Button type="button" onClick={() => finishAs("client")} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-foreground">Tell us about your skills</h2>
            <p className="font-body mt-2 text-sm text-muted-foreground">This helps clients find you for the right jobs.</p>

            <div className="mt-6">
              <Label className="text-sm font-semibold text-foreground">What do you specialize in?</Label>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {SKILL_OPTIONS.map(({ label, Icon }) => {
                  const selected = selectedSkills.includes(label)
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleSkill(label)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  )
                })}
              </div>

              {selectedSkills.includes("Other") ? (
                <Input
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="What else do you do?"
                  className="mt-3"
                />
              ) : null}
            </div>

            <div className="mt-6">
              <Label className="text-sm font-semibold text-foreground">Experience level</Label>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setExperienceLevel(level.value)}
                    className={`rounded-xl border px-3 py-3 text-center transition-colors ${
                      experienceLevel === level.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{level.label}</span>
                    <span className="block text-xs text-muted-foreground">{level.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="hourlyRate" className="text-sm font-semibold text-foreground">
                Hourly rate (US$)
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="e.g. 25"
                className="mt-2"
              />
            </div>

            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

            <div className="mt-8 flex justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep("role")} disabled={submitting}>
                Back
              </Button>
              <Button type="button" onClick={() => finishAs("freelancer")} disabled={submitting || !isFreelancerFormValid}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Finish setup"}
                {!submitting ? <CheckCircle2 className="ml-1.5 h-4 w-4" /> : null}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
