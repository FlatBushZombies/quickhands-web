import type { Metadata } from "next"
import { ProfessionalsLanding } from "@/components/professionals/ProfessionalsLanding"

export const metadata: Metadata = {
  title: "For Specialists",
  description:
    "Join QuickHands as a specialist — browse local jobs, set your own rates, and get paid for plumbing, electrical, cleaning, beauty and trade work across Africa.",
}

export default function ProfessionalsPage() {
  return <ProfessionalsLanding />
}
