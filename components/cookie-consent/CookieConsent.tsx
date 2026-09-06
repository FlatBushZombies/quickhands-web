"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, BarChart3, Megaphone, ShieldCheck, X } from "lucide-react"
import { useCookieConsent, type ConsentCategories } from "./useCookieConsent"

const softEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ─── Toggle ──────────────────────────────────────────────────────────────
// No shadcn Switch is installed in this project, so this stays hand-rolled
// — restyled onto the site's own --primary token instead of an unrelated
// accent color.

function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${checked ? "bg-primary" : "bg-border"}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="pointer-events-none block h-4.5 w-4.5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
        style={{ marginLeft: checked ? "22px" : "3px" }}
      />
    </button>
  )
}

// ─── Preference row ──────────────────────────────────────────────────────

function PreferenceRow({
  icon,
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-background/60 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="font-heading text-[13.5px] font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 font-body text-[12.5px] leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0 pt-1">
        <Toggle checked={checked} onChange={onChange} disabled={disabled} label={title} />
      </div>
    </div>
  )
}

export default function CookieConsent() {
  const { status, categories, isInitialized, acceptAll, rejectAll, saveCustom } = useCookieConsent()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!isInitialized) return null

  const toggleCategory = (key: keyof Omit<ConsentCategories, "essential">) => {
    saveCustom({ ...categories, [key]: !categories[key] })
  }

  return (
    <>
      {/* ─── Banner ─── */}
      <AnimatePresence>
        {status === "undecided" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: softEase }}
            className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6"
          >
            <div className="relative w-full max-w-[620px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_8px_rgba(15,23,42,0.04),0_24px_48px_-16px_rgba(15,23,42,0.18)]">
              {/* A restrained brand touch — not a loud banner, just a thin
                  signal that this card belongs to the product. */}
              <div className="h-[3px] w-full bg-gradient-to-r from-primary via-primary to-primary-hover" />

              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
                <div className="flex items-start gap-3.5 sm:items-center">
                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary sm:flex">
                    <Cookie className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-[15px] font-bold tracking-tight text-foreground">
                      Your privacy, your call
                    </h4>
                    <p className="mt-1 font-body text-[13px] leading-relaxed text-muted-foreground sm:max-w-[380px]">
                      We use cookies to keep you signed in and understand how Quickhands is used. Accept
                      all, or choose exactly what you&apos;re comfortable with.
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 font-sans sm:ml-auto">
                  <button
                    type="button"
                    onClick={rejectAll}
                    className="cursor-pointer rounded-full px-3.5 py-2 text-[12.5px] font-semibold text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer rounded-full border border-border px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition-colors duration-150 hover:bg-secondary"
                  >
                    Manage preferences
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="cursor-pointer rounded-full bg-primary px-4.5 py-2 text-[12.5px] font-semibold text-primary-foreground shadow-[0_4px_14px_rgba(20,168,0,0.25)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_6px_18px_rgba(20,168,0,0.32)] active:scale-[0.97]"
                  >
                    Accept all
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Preferences modal ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: softEase }}
              className="relative z-10 max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.3)] sm:mx-4 sm:rounded-3xl sm:p-7"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <Cookie className="h-5.5 w-5.5" />
              </div>

              <h3 className="mt-4 font-heading text-xl font-bold tracking-tight text-foreground">
                Cookie preferences
              </h3>
              <p className="mt-1.5 font-body text-[13px] leading-relaxed text-muted-foreground">
                Essential cookies keep the platform working and can&apos;t be turned off. Everything else
                is entirely your choice — changes save instantly.
              </p>

              <div className="mt-6 space-y-3">
                <PreferenceRow
                  icon={<ShieldCheck className="h-4.5 w-4.5" />}
                  title="Essential"
                  description="Sign-in, security, and core marketplace features. Always on."
                  checked={true}
                  disabled={true}
                  onChange={() => {}}
                />
                <PreferenceRow
                  icon={<BarChart3 className="h-4.5 w-4.5" />}
                  title="Analytics"
                  description="Helps us see what's working and fix what isn't."
                  checked={categories.analytics}
                  onChange={() => toggleCategory("analytics")}
                />
                <PreferenceRow
                  icon={<Megaphone className="h-4.5 w-4.5" />}
                  title="Marketing"
                  description="Lets us show you relevant offers and updates."
                  checked={categories.marketing}
                  onChange={() => toggleCategory("marketing")}
                />
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-5 font-sans">
                <button
                  type="button"
                  onClick={rejectAll}
                  className="cursor-pointer text-[12.5px] font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  Reject all
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-full bg-primary px-5 py-2.5 text-[12.5px] font-semibold text-primary-foreground shadow-[0_4px_14px_rgba(20,168,0,0.25)] transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
                >
                  Save preferences
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
