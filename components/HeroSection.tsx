"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import UserCounter from "./professionals/ClientCounter"

interface ServiceCard {
  image: string
  category: string
  title: string
  signupCount?: number
}

const services: ServiceCard[] = [
  {
    image: "/photo-1557804506-669a67965ba0.jfif",
    category: "DEVELOPMENT",
    title: "Web Development",
  },
  {
    image: "/photo-1561070791-2526d30994b5.jfif",
    category: "DESIGN",
    title: "Brand Identity",
  },
  {
    image: "/emmanuel-ikwuegbu--0-kl1BjvFc-unsplash.jpg",
    category: "PLUMBING",
    title: "Residential Plumbing",
  },
  {
    image: "/premium_photo-1663012852133-96e65ca2cf9a.jpg",
    category: "TUTORING",
    title: "In-Person Tutoring",
  },
  {
    image: "/photo-1460925895917-afdab827c52f.jfif",
    category: "ANALYTICS",
    title: "Data Analysis",
  },
]

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
]

export function HeroSection() {
  const [featuredCategory, setFeaturedCategory] = useState<{
    category: string
    signupCount: number
  } | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<{ profession: string; count: number }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchFeaturedCategory = async () => {
      try {
        const response = await fetch("/api/categories/featured", {
          cache: "no-store",
        })

        if (!response.ok) return

        const data = await response.json()

        if (!isMounted || !data?.category) return

        setFeaturedCategory({
          category: data.category,
          signupCount: Number(data.signupCount ?? 0),
        })
      } catch {
        // Keep default first card when API is unavailable.
      }
    }

    fetchFeaturedCategory()
    const intervalId = setInterval(fetchFeaturedCategory, 10000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    try {
      const res = await fetch(`/api/search/professions?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Failed to fetch suggestions", error)
    }
  }, [])

  const displayedServices = useMemo(() => {
    if (!featuredCategory?.category) return services

    return [
      {
        ...services[0],
        category: featuredCategory.category.toUpperCase(),
        title: featuredCategory.category,
        signupCount: featuredCategory.signupCount,
      },
      ...services.slice(1),
    ]
  }, [featuredCategory])

  return (
    <section
      className={cn("relative w-full min-h-screen flex flex-col overflow-hidden bg-white")}
      role="banner"
      aria-label="Hero section"
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a06_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a06_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_55%_at_50%_0%,#000_60%,transparent_100%)]" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-6 pt-24 sm:pt-28 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-4xl gap-5 md:gap-6"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-[#f5f5f4] border border-[#e7e5e4] rounded-full px-4 py-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] font-medium text-[#78716c] tracking-[0.08em] uppercase">
              Available in Harare
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="font-sans text-balance font-semibold leading-[1.06] tracking-[-0.03em] text-[#1c1917] text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.2rem]">
            Quickly find the right{" "}
            <span className="text-[#78716c]">Specialists</span>{" "}
            for your tasks.
          </h1>

          {/* Subtitle */}
          <div className="text-[1.0rem] leading-relaxed text-[#78716c] max-w-[440px]">
            <UserCounter />
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[560px] flex items-center gap-2.5 mt-1"
          >
            <div className="relative flex-1">
              <Search className="absolute left-[18px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8a29e] pointer-events-none" />
              <Input
                type="text"
                placeholder="Specialist or service…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  fetchSuggestions(e.target.value)
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                className="h-[52px] pl-[46px] pr-4 text-[0.9375rem] bg-white border-[#e7e5e4] rounded-xl shadow-none focus:border-[#a8a29e] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#a8a29e] transition-colors"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e7e5e4] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] z-50 max-h-[300px] overflow-hidden"
                >
                  {suggestions.length > 0 ? (
                    <div className="p-1.5 overflow-y-auto max-h-[284px]">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between gap-3 px-3 py-3 hover:bg-[#fafaf9] cursor-pointer rounded-lg transition-colors duration-150"
                          onClick={() => {
                            setSearchQuery(suggestion.profession)
                            setShowSuggestions(false)
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="shrink-0 w-8 h-8 rounded-lg bg-[#f5f5f4] flex items-center justify-center">
                              <Search className="w-3.5 h-3.5 text-[#78716c]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#1c1917] truncate">
                                {suggestion.profession}
                              </p>
                              <p className="flex items-center gap-1.5 text-xs text-[#a8a29e] mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {suggestion.count} specialist{suggestion.count !== 1 ? "s" : ""} available
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#a8a29e] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <div className="py-8 px-6 text-center">
                      <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#f5f5f4] flex items-center justify-center">
                        <Search className="w-4 h-4 text-[#a8a29e]" />
                      </div>
                      <p className="text-sm font-medium text-[#44403c]">No specialists found</p>
                      <p className="text-xs text-[#a8a29e] mt-1">Try a different search term</p>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </div>

            <Button
              size="lg"
              className="h-[52px] px-6 font-medium rounded-xl bg-[#1c1917] text-white hover:bg-[#292524] active:scale-[0.98] transition-all duration-150 shadow-none flex items-center gap-2 text-[0.9375rem] shrink-0"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-row items-center gap-4 mt-1"
          >
            <div className="flex flex-row -space-x-2">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar || "/placeholder.svg"}
                  alt={`Professional ${index + 1}`}
                  className="rounded-full border-2 border-white w-8 h-8 object-cover"
                />
              ))}
            </div>
            <span className="text-sm text-[#78716c]">Join 2+ professionals</span>
            <span className="w-px h-5 bg-[#e7e5e4]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#1c1917] leading-none">48+</p>
              <p className="text-[10px] uppercase tracking-[0.07em] text-[#a8a29e] mt-0.5">Categories</p>
            </div>
            <span className="w-px h-5 bg-[#e7e5e4]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#1c1917] leading-none">4.9</p>
              <p className="text-[10px] uppercase tracking-[0.07em] text-[#a8a29e] mt-0.5">Avg rating</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Service Cards Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full overflow-hidden pt-6 pb-14"
      >
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none w-[140px] bg-gradient-to-r from-white to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none w-[140px] bg-gradient-to-l from-white to-transparent" />

        {/* Scrolling Container */}
        <motion.div
          className="flex items-center gap-4 pl-6"
          animate={{
            x: [0, -((displayedServices.length * 312) / 2)],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: displayedServices.length * 5,
              ease: "linear",
            },
          }}
        >
          {[...displayedServices, ...displayedServices].map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-shrink-0 cursor-pointer relative overflow-hidden rounded-2xl border border-[#e7e5e4]"
              style={{ width: "280px", height: "370px" }}
            >
              {/* Image */}
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.04]"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1">
                <span className="text-[10px] font-medium text-white/60 uppercase tracking-[0.12em]">
                  {service.category}
                </span>
                <h3 className="text-[1.2rem] font-semibold text-white leading-tight tracking-[-0.02em]">
                  {service.title}
                </h3>
                {index % displayedServices.length === 0 && typeof service.signupCount === "number" && (
                  <span className="inline-flex items-center gap-1.5 mt-2 self-start bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-1 text-[11px] text-white/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {service.signupCount} signed up
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}