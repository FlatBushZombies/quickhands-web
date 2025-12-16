"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignupClick: () => void
}

export function LoginModal({ open, onOpenChange, onSignupClick }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans text-2xl">Welcome back</DialogTitle>
          <DialogDescription className="font-sans">Enter your credentials to access your account</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans">
              Email
            </Label>
            <Input id="email" type="email" placeholder="you@example.com" className="font-sans" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-sans">
              Password
            </Label>
            <Input id="password" type="password" className="font-sans" />
          </div>
          <Button className="font-sans w-full bg-primary text-primary-foreground hover:bg-primary/90">Log in</Button>
          <div className="text-center text-sm">
            <span className="font-sans text-muted-foreground">{"Don't have an account? "}</span>
            <button onClick={onSignupClick} className="font-sans text-primary hover:underline">
              Sign up
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
