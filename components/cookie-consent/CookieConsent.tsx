"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Sparkles, AlertCircle, X } from "lucide-react"
import { useCookieConsent, ConsentCategories } from "./useCookieConsent"

// Helper to join classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// Ease curve: cubic-bezier(0.2, 0.8, 0.2, 1)
const softEase: [number, number, number, number] = [0.2, 0.8, 0.2, 1]

// Custom Toggle Component
interface ToggleProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}

function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-300 focus:outline-none focus:ring-0",
        checked ? "bg-[#E07A5F]" : "bg-[#EAE6E1]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="sr-only">Toggle consent category</span>
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 600, damping: 35 }}
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}

export default function CookieConsent() {
  const { status, categories, isInitialized, acceptAll, rejectAll, saveCustom } = useCookieConsent()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Avoid SSR rendering during hydration check
  if (!isInitialized) return null

  return (
    <>
      <AnimatePresence>
        {status === "undecided" && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.5, ease: softEase }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[600px] px-4"
          >
            <div className="bg-[#F7F5F2]/95 backdrop-blur-md border border-[#EAE6E1] shadow-[0_8px_32px_rgba(46,45,43,0.06)] rounded-[20px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              
              {/* Text Area */}
              <div className="flex-1 text-left font-sans">
                <h4 className="font-serif text-[14px] font-medium text-[#2E2D2B] leading-relaxed tracking-tight">
                  We use cookies to improve your experience and measure performance.
                </h4>
                <p className="text-[11px] text-[#7A7875] font-light mt-0.5 leading-normal">
                  By clicking “Accept all”, you agree to our storage of metrics and performance diagnostics.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 select-none">
                <button
                  type="button"
                  onClick={rejectAll}
                  className="text-[11px] font-semibold text-[#7A7875] hover:text-[#2E2D2B] transition-colors duration-150 px-2 cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-[11px] font-semibold text-[#7A7875] hover:text-[#2E2D2B] border border-[#EAE6E1] rounded-full px-3.5 py-1.5 hover:bg-white/40 transition-all cursor-pointer"
                >
                  Preferences
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="text-[11.5px] font-semibold text-white bg-[#E07A5F] hover:bg-[#D6684B] rounded-full px-4.5 py-1.5 shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  Accept all
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Custom Preferences Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#2E2D2B]/10 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.4, ease: softEase }}
              className="relative w-full max-w-[440px] mx-4 bg-[#F7F5F2] border border-[#EAE6E1] rounded-[24px] p-6 shadow-xl z-50 text-left font-sans"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 h-7 w-7 rounded-full flex items-center justify-center text-[#7A7875] hover:text-[#2E2D2B] hover:bg-white/40 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title & Description */}
              <div className="mb-6">
                <h3 className="font-serif text-xl font-medium text-[#2E2D2B] tracking-tight">
                  Consent Preferences
                </h3>
                <p className="text-[11.5px] text-[#7A7875] font-light mt-1.5 leading-relaxed">
                  We customize cookies to fit your privacy guidelines. Adjust preferences below and select save.
                </p>
              </div>

              {/* Toggle Sections List */}
              <div className="space-y-3.5 mb-6">
                <PreferenceItem
                  icon={<Shield className="h-4 w-4 text-[#7A7875]" />}
                  title="Essential cookies"
                  description="Required for secure session auth and core platform features."
                  checked={true}
                  disabled={true}
                  onChange={() => {}}
                />
                <PreferenceItem
                  icon={<Sparkles className="h-4 w-4 text-[#7A7875]" />}
                  title="Analytics cookies"
                  description="Help us measure workspace metrics and performance diagnostics."
                  checked={categories.analytics}
                  onChange={() => saveCustom({ analytics: !categories.analytics, marketing: categories.marketing })}
                />
                <PreferenceItem
                  icon={<AlertCircle className="h-4 w-4 text-[#7A7875]" />}
                  title="Marketing cookies"
                  description="Allow us to customize notifications and active event campaigns."
                  checked={categories.marketing}
                  onChange={() => saveCustom({ analytics: categories.analytics, marketing: !categories.marketing })}
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-[#EAE6E1] pt-4 select-none">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-semibold text-[#7A7875] hover:text-[#2E2D2B] transition-colors duration-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[12px] font-semibold text-white bg-[#E07A5F] hover:bg-[#D6684B] rounded-full px-5 py-2 shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
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

interface PreferenceItemProps {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: () => void
}

function PreferenceItem({ icon, title, description, checked, disabled, onChange }: PreferenceItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 bg-white/40 border border-[#EAE6E1]/50 rounded-2xl p-4 transition-all duration-200 hover:bg-white/70">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-xl bg-white border border-[#EAE6E1]/70 flex items-center justify-center shrink-0 shadow-sm/30">
          {icon}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-[#2E2D2B]">{title}</p>
          <p className="text-[10.5px] text-[#7A7875] font-light leading-normal max-w-[240px]">
            {description}
          </p>
        </div>
      </div>
      <div className="shrink-0 mt-0.5">
        <Toggle checked={checked} onChange={onChange} disabled={disabled} />
      </div>
    </div>
  )
}
