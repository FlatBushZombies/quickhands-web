import type { Metadata } from "next"
import OnboardingFlow from "./OnboardingFlow"

export const metadata: Metadata = {
  title: "Get Started",
  description: "Tell us how you want to use QuickHands — hire specialists or find work across Africa.",
  robots: { index: false, follow: false },
}

export default function OnboardingPage() {
  return <OnboardingFlow />
}
