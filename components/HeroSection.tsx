"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container relative mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-sans text-balance text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-7xl sm:leading-tight">
          Quickly find the right  <span className="text-primary">Specialists</span> for your tasks.
          </h1>
          <p className="font-sans mt-6 text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Quickly find the right specialist for your task. 100 clients have already connected with trusted professionals on our platform.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Specialist or services"
                className="font-sans h-14 pl-12 pr-4 text-base bg-card border-border"
              />
            </div>
            <Button
              size="lg"
              className="font-sans h-14 bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-medium"
            >
              Search
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="font-sans">Trusted by:</span>
            <div className="flex flex-wrap items-center gap-6">
              <span className="font-sans font-semibold">Designers</span>
              <span className="font-sans font-semibold">Plumbers</span>
              <span className="font-sans font-semibold">Educators</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
