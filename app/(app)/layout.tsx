import { OnboardingGate } from "@/components/app/OnboardingGate"
import { AppShell } from "@/components/app-shell/AppShell"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <OnboardingGate>
        <AppShell>{children}</AppShell>
      </OnboardingGate>
    </div>
  )
}
