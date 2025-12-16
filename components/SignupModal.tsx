"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SignupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginClick: () => void
}

export function SignupModal({ open, onOpenChange, onLoginClick }: SignupModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans text-2xl">Create your account</DialogTitle>
          <DialogDescription className="font-sans">Join thousands of professionals on Quickhands</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-sans">
              Full Name
            </Label>
            <Input id="name" placeholder="John Doe" className="font-sans" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="font-sans">
              Email
            </Label>
            <Input id="signup-email" type="email" placeholder="you@example.com" className="font-sans" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="font-sans">
              Password
            </Label>
            <Input id="signup-password" type="password" className="font-sans" />
          </div>
          <Button className="font-sans w-full bg-primary text-primary-foreground hover:bg-primary/90">Sign up</Button>
          <div className="text-center text-sm">
            <span className="font-sans text-muted-foreground">Already have an account? </span>
            <button onClick={onLoginClick} className="font-sans text-primary hover:underline">
              Log in
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
