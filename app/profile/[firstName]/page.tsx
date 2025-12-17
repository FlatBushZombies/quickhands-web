import { neon } from "@neondatabase/serverless"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Briefcase, Sparkles, Calendar, CheckCircle2, Smartphone } from "lucide-react"
import { notFound } from "next/navigation"

const sql = neon(process.env.DATABASE_URL!)

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ firstName: string }>
}) {
  const { firstName } = await params

  try {
    const users = await sql`
      SELECT id, first_name, last_name, email, phone, profession, relevant_info, created_at
      FROM users
      WHERE LOWER(first_name) = LOWER(${firstName})
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (!users || users.length === 0) {
      notFound()
    }

    const user = users[0]

    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 to-background">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl text-center">
                {/* Avatar */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-5xl font-bold text-primary-foreground">
                      {user.first_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary border-4 border-background">
                      <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm text-primary font-medium">Welcome to Quickhands</span>
                </div>

                <h1 className="font-sans text-balance text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
                  Welcome, {user.first_name}!
                </h1>

                <p className="font-sans mt-6 text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Your profile has been successfully created. You're now part of the Quickhands community platform. 
                </p>
              </div>
            </div>
          </section>

          <section className="py-16 border-b border-border/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

                  <CardContent className="relative pt-12 pb-12 px-8 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                        <Smartphone className="h-10 w-10 text-primary-foreground" />
                      </div>
                    </div>

                    <h2 className="font-sans text-3xl font-bold tracking-tight mb-4">Mobile App Coming Soon</h2>

                    <p className="font-sans text-lg text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
                      We're excited to announce that the quickhands mobile app will be launching in January 2025.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
                      <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-background/50 border border-border/50">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground font-medium">Launch Date</p>
                          <p className="font-sans text-sm font-semibold">January 2026</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-background/50 border border-border/50">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground font-medium">Your Status</p>
                          <p className="font-sans text-sm font-semibold">Early Access</p>
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">You'll be notified when we launch</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <h2 className="font-sans text-3xl font-bold tracking-tight mb-8 text-center">Your Profile</h2>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                          <p className="font-sans text-base font-semibold truncate">{user.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-medium text-muted-foreground mb-1">Phone Number</p>
                          <p className="font-sans text-base font-semibold">{user.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-medium text-muted-foreground mb-1">Profession</p>
                          <p className="font-sans text-base font-semibold">{user.profession}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-medium text-muted-foreground mb-1">Member Since</p>
                          <p className="font-sans text-base font-semibold">
                            {new Date(user.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* About Section */}
                <Card className="border-border bg-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-sans text-sm font-medium text-muted-foreground mb-2">About You</p>
                        <p className="font-sans text-base text-foreground leading-relaxed">{user.relevant_info}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error("[v0] Profile fetch error:", error)
    notFound()
  }
}
