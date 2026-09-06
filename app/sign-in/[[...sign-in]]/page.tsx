import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#14a8001a_1px,transparent_1px),linear-gradient(to_bottom,#14a8001a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_105%)]" />

      <div className="relative">
        <SignIn
          appearance={{
            variables: { colorPrimary: "#14A800" },
            elements: { rootBox: "mx-auto", card: "shadow-xl rounded-2xl" },
          }}
        />
      </div>
    </main>
  )
}
