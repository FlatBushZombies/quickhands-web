"use client"

import Image from "next/image"
import Link from "next/link"

const footerLinks = {
  forClients: [
    { title: "Post a Project", href: "#" },
    { title: "How to Hire", href: "#" },
    { title: "Enterprise", href: "#" },
  ],
  forSpecialists: [
    { title: "Create Profile", href: "#" },
    { title: "How to Win Jobs", href: "#" },
    { title: "Success Stories", href: "#" },
  ],
  company: [
    { title: "About Us", href: "#" },
    { title: "Feedback", href: "/feedback" },
    { title: "Terms of Service", href: "#" },
    { title: "Privacy Policy", href: "/privacy-policy" },
  ],
}

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.79 1.52V6.75a4.85 4.85 0 0 1-1.02-.06z" />
  </svg>
)

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
)

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

export function Footer() {
  return (
    <footer id="footer" className="w-full bg-zinc-950 border-t border-zinc-900">
      {/* Main footer content */}
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12">

          {/* Left: Logo + description + social */}
          <div className="flex flex-col gap-6 max-w-[280px] text-left">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-7 w-7 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                <Image src="/quickhands.png" alt="Quickhands Logo" fill className="opacity-90 object-contain p-0.5" />
              </div>
              <span className="text-sm font-semibold text-white tracking-tight font-sans">
                Quickhands Africa
              </span>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light">
              The complete directory and secure matches platform for clients and specialists to connect, collaborate, and get jobs done.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1 font-sans">
              {[
                { href: "https://www.tiktok.com/@quickhands.app", label: "TikTok", Icon: TikTokIcon },
                { href: "https://www.instagram.com/quickhandsafrica", label: "Instagram", Icon: InstagramIcon },
                { href: "https://www.facebook.com/share/181GvFUCXq/?mibextid=wwXIfr", label: "Facebook", Icon: FacebookIcon },
              ].map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors duration-150 cursor-pointer"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-16 text-left font-sans">
            {/* For Clients */}
            <div>
              <h3 className="mb-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.14em]">
                For Clients
              </h3>
              <ul className="flex flex-col gap-3.5">
                {footerLinks.forClients.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-[12.5px] text-zinc-400 hover:text-white transition-colors duration-150 font-light"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Specialists */}
            <div>
              <h3 className="mb-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.14em]">
                For Specialists
              </h3>
              <ul className="flex flex-col gap-3.5">
                {footerLinks.forSpecialists.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-[12.5px] text-zinc-400 hover:text-white transition-colors duration-150 font-light"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.14em]">
                Company
              </h3>
              <ul className="flex flex-col gap-3.5">
                {footerLinks.company.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-[12.5px] text-zinc-400 hover:text-white transition-colors duration-150 font-light"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-900/60 py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-zinc-400">
          <p>
            &copy; 2026 Quickhands, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { title: "Privacy Policy", href: "/privacy-policy" },
              { title: "Terms of Service", href: "#" },
              { title: "Accessibility", href: "#" },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-zinc-400 transition-colors duration-150"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}