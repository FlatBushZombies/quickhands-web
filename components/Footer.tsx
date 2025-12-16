export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="font-sans text-lg font-bold">Quickhands</span>
            </div>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              The complete platform to run your freelance business like a pro.
            </p>
          </div>

          <div>
            <h3 className="font-sans mb-4 font-semibold">For Clients</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  Post a Project
                </a>
              </li>
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  Find Talent
                </a>
              </li>
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  How to Hire
                </a>
              </li>
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  Enterprise
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans mb-4 font-semibold">For Freelancers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  Find Work
                </a>
              </li>
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  Create Profile
                </a>
              </li>
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  How to Win Jobs
                </a>
              </li>
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans mb-4 font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="font-sans hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p className="font-sans">&copy; 2026 Quickhands. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
