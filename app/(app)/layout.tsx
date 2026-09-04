import { OnboardingGate } from "@/components/app/OnboardingGate"
import { AppHeader } from "@/components/app/AppHeader"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <OnboardingGate>
        <AppHeader />
        <main>{children}</main>
      </OnboardingGate>
    </div>
  )
}
