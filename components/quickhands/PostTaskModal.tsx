"use client"

import { useState } from "react"
import type React from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eyebrow } from "./Eyebrow"
import { PillButton } from "./PillButton"

interface PostTaskModalProps {
  children: React.ReactNode
}

const INITIAL_FORM = { name: "", email: "", task: "" }

/**
 * Front-end-only "post a task" demo flow. There is no backend for this yet,
 * so submission is simulated with a short local timeout rather than a call
 * to a nonexistent endpoint. Reuses the existing shadcn Dialog primitive —
 * focus trap, Escape-to-close and body scroll lock all come from Radix for
 * free, matching the ClientLogin/OnboardingModal pattern already in the app.
 */
export function PostTaskModal({ children }: PostTaskModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      // Reset once the dialog is closed, however it was closed.
      setLoading(false)
      setSuccess(false)
      setForm(INITIAL_FORM)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    // Simulated network round-trip — no API exists for this yet.
    window.setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 900)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="rounded-[28px] border-zinc-200 p-7 sm:max-w-[440px] sm:p-8">
        {!success ? (
          <>
            <DialogHeader className="items-start gap-3 text-left">
              <Eyebrow animate={false}>Post a task</Eyebrow>
              <DialogTitle className="font-serif text-2xl font-medium leading-tight tracking-tight text-zinc-950 sm:text-[26px]">
                Tell us what you need done.
              </DialogTitle>
              <DialogDescription className="font-sans text-[13px] leading-relaxed text-zinc-500">
                We&rsquo;ll help you find the right person for the job.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-2 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="post-task-name" className="font-sans text-xs font-medium text-zinc-700">
                  Name
                </Label>
                <Input
                  id="post-task-name"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="post-task-email" className="font-sans text-xs font-medium text-zinc-700">
                  Email
                </Label>
                <Input
                  id="post-task-email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="post-task-task" className="font-sans text-xs font-medium text-zinc-700">
                  Task
                </Label>
                <Textarea
                  id="post-task-task"
                  name="task"
                  placeholder="Describe the task, location, timing, and anything the tasker should know."
                  value={form.task}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="rounded-xl"
                />
              </div>

              <DialogFooter className="pt-1">
                <PillButton
                  type="submit"
                  size="lg"
                  disabled={loading}
                  showArrow={!loading}
                  icon={loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : undefined}
                  className="w-full sm:w-auto"
                >
                  {loading ? "Posting…" : "Post Task"}
                </PillButton>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader className="items-start gap-3 text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <DialogTitle className="font-serif text-2xl font-medium leading-tight tracking-tight text-zinc-950 sm:text-[26px]">
                Task posted
              </DialogTitle>
              <DialogDescription className="font-sans text-[13px] leading-relaxed text-zinc-500">
                Your task is ready to go. Browse available specialists and choose the right person for the job.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-1">
              <PillButton
                type="button"
                variant="outline"
                size="lg"
                showArrow={false}
                onClick={() => handleOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Close
              </PillButton>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
