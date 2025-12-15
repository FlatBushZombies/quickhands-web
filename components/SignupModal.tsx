"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

interface SignupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginClick: () => void
}

export function SignupModal({ open, onOpenChange, onLoginClick }: SignupModalProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("freelancer")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup:", { fullName, email, password, userType })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create an account</DialogTitle>
          <DialogDescription>Join ProFreelance and start your journey</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>I want to</Label>
            <RadioGroup value={userType} onValueChange={setUserType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="freelancer" id="freelancer" />
                <Label htmlFor="freelancer" className="font-normal cursor-pointer">
                  Work as a freelancer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client" className="font-normal cursor-pointer">
                  Hire freelancers
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Create Account
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" className="w-full bg-transparent">
              Google
            </Button>
            <Button type="button" variant="outline" className="w-full bg-transparent">
              GitHub
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button type="button" onClick={onLoginClick} className="text-primary hover:underline font-medium">
              Log in
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
