"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ClientLoginProps {
  children: React.ReactNode
}

export function ClientLogin({ children }: ClientLoginProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (!nextOpen) {
      setError("")
      setSuccess(false)
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to register")
      }

      // Show success message
      setSuccess(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("")
    if (success) setSuccess(false)

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Service Login</DialogTitle>
          <DialogDescription>
            Enter your details to register as client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}
          {success && (
  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900 space-y-3">
    <p className="font-semibold text-base">
      Welcome to QuickHands Africa 👋
    </p>

    <p>
      Your account is now active.
      You’re ready to find trusted professionals and get your work done with confidence.
    </p>

    <div>
      <p className="font-medium">With QuickHands Africa, you can:</p>
      <ul className="list-disc list-inside mt-1 space-y-1">
        <li>Find skilled and verified service providers</li>
        <li>Compare options and choose what works best for you</li>
        <li>Communicate directly and securely</li>
        <li>C Get quality work done faster and stress-free</li>
      </ul>
    </div>

    <p>
      For tips, updates, and new services, please follow us on our social media platforms.
    </p>

    <p className="font-medium">
      Post a job, connect with the right hands, and get started today.
      <br />
      <span className="text-green-800">The QuickHands Africa Team</span>
    </p>
  </div>
)}


          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting......
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
