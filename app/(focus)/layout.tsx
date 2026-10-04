import { OnboardingGate } from "@/components/app/OnboardingGate"

/**
 * Full-screen focused flows (the Post a task wizard). Same auth and onboarding
 * gating as the app shell, but without the three-pane chrome: the design is a
 * two-column layout that needs the whole viewport.
 */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <OnboardingGate>{children}</OnboardingGate>
    </div>
  )
}
