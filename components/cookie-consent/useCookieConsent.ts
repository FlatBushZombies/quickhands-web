"use client"

import { useState, useEffect } from "react"

export type ConsentStatus = "undecided" | "accepted" | "rejected" | "custom"

export interface ConsentCategories {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export function useCookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>("undecided")
  const [categories, setCategories] = useState<ConsentCategories>({
    essential: true,
    analytics: false,
    marketing: false,
  })
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // SSR safe check
    if (typeof window !== "undefined") {
      const storedStatus = localStorage.getItem("cookie_consent") as ConsentStatus | null
      const storedCategories = localStorage.getItem("cookie_consent_categories")

      if (storedStatus) {
        setStatus(storedStatus)
      }
      if (storedCategories) {
        try {
          setCategories(JSON.parse(storedCategories))
        } catch (e) {
          console.error("Failed to parse cookie categories", e)
        }
      }
      setIsInitialized(true)
    }
  }, [])

  const acceptAll = () => {
    const allCategories = { essential: true, analytics: true, marketing: true }
    setStatus("accepted")
    setCategories(allCategories)
    localStorage.setItem("cookie_consent", "accepted")
    localStorage.setItem("cookie_consent_categories", JSON.stringify(allCategories))
  }

  const rejectAll = () => {
    const onlyEssential = { essential: true, analytics: false, marketing: false }
    setStatus("rejected")
    setCategories(onlyEssential)
    localStorage.setItem("cookie_consent", "rejected")
    localStorage.setItem("cookie_consent_categories", JSON.stringify(onlyEssential))
  }

  const saveCustom = (customCategories: Partial<ConsentCategories>) => {
    const finalCategories = {
      essential: true,
      analytics: !!customCategories.analytics,
      marketing: !!customCategories.marketing,
    }
    setStatus("custom")
    setCategories(finalCategories)
    localStorage.setItem("cookie_consent", "custom")
    localStorage.setItem("cookie_consent_categories", JSON.stringify(finalCategories))
  }

  const resetConsent = () => {
    setStatus("undecided")
    localStorage.removeItem("cookie_consent")
    localStorage.removeItem("cookie_consent_categories")
  }

  return {
    status,
    categories,
    isInitialized,
    acceptAll,
    rejectAll,
    saveCustom,
    resetConsent,
  }
}
