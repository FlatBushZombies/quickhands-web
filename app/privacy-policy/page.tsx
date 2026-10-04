import type { Metadata } from "next"
import { PrivacyPolicyPage } from "@/components/legal/LegalPage"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Quickhands Africa collects, uses and protects your personal information across our website and mobile app.",
}

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />
}
