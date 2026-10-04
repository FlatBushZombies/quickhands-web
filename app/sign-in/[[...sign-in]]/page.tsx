import type { Metadata } from "next"
import { AuthScreen } from "@/components/auth/AuthScreen"
import { authFontClassName } from "@/components/auth/fonts"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your QuickHands account to hire specialists or find work across Africa.",
}

export default function SignInPage() {
  return (
    <div className={authFontClassName}>
      <AuthScreen mode="signin" />
    </div>
  )
}
