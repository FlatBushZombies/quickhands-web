import type { Metadata } from "next"
import { AuthScreen } from "@/components/auth/AuthScreen"
import { authFontClassName } from "@/components/auth/fonts"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free QuickHands account to hire trusted specialists or start finding work across Africa.",
}

export default function SignUpPage() {
  return (
    <div className={authFontClassName}>
      <AuthScreen mode="signup" />
    </div>
  )
}
