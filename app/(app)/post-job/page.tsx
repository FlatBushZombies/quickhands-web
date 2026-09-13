import type { Metadata } from "next"
import PostJobClient from "./PostJobClient"

export const metadata: Metadata = {
  title: "Post a Job",
  description: "Tell specialists what you need done — post a job for plumbing, electrical, cleaning, or other trade work.",
  robots: { index: false, follow: false },
}

export default function PostJobPage() {
  return <PostJobClient />
}
