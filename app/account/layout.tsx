import { OnboardingGate } from "@/components/app/OnboardingGate"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <OnboardingGate>{children}</OnboardingGate>
}
