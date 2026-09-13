import type { Metadata } from "next"
import FeedbackForm from "./FeedbackForm"

export const metadata: Metadata = {
  title: "Feedback",
  description: "Help us improve QuickHands — share product feedback, report a bug, or request a feature.",
}

export default function FeedbackPage() {
  return <FeedbackForm />
}
