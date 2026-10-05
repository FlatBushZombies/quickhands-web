import type { Metadata } from "next"
import { ClientLanding } from "@/components/client-landing/ClientLanding"

export const metadata: Metadata = {
  title: "Find trusted local specialists",
  description: "Post a task and get matched with trusted local specialists for cleaning, repairs, moving, beauty and trades across Africa.",
}

export default function Home() {
  return <ClientLanding />
}
