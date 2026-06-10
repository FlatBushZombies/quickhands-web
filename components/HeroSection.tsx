"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Search, ArrowRight, Star, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import UserCounter from "./professionals/ClientCounter"
import { ClientLogin } from "./ClientLogin"
import Link from "next/link"

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
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-white pt-24 pb-14"
      role="banner"
      aria-label="Hero section"
    >
      {/* Soft radial glow using brand green */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a02_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a02_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20" />

      {/* Centered Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-6 max-w-4xl mx-auto w-full text-center gap-7">
        
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-3.5 py-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
          <span className="text-[10px] font-semibold text-primary tracking-[0.08em] uppercase font-sans">
            Available in Harare
          </span>
        </motion.div>

        {/* Title - Editorial Serif */}
        <h1 className="font-serif text-[42px] sm:text-5xl md:text-[68px] tracking-[-0.025em] leading-[1.06] text-zinc-950 font-normal">
          Quickly find the right <span className="italic text-primary font-normal">specialists</span> for your tasks.
        </h1>

        {/* Subtitle - Sohne */}
        <div className="text-zinc-500 font-sans text-sm leading-relaxed max-w-[460px] font-light">
          <UserCounter />
        </div>

        {/* Integrated Pill Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-[540px] relative mt-1"
        >
          <div className="relative w-full flex items-center bg-zinc-50/50 border border-zinc-100 rounded-full p-1.5 focus-within:bg-white focus-within:border-zinc-200 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
            <Search className="h-4.5 w-4.5 text-zinc-400 shrink-0 ml-3.5" />
            <input
              type="text"
              placeholder="Specialist or service…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                fetchSuggestions(e.target.value)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
              className="w-full bg-transparent border-0 ring-0 outline-none px-3 text-sm text-zinc-900 placeholder:text-zinc-400 font-sans"
            />
            <button
              type="button"
              className="h-10 px-6 font-sans text-xs font-semibold rounded-full bg-primary text-white hover:bg-primary-hover active:scale-[0.98] transition-all shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 rounded-2xl shadow-md z-50 max-h-[280px] overflow-hidden text-left"
            >
              {suggestions.length > 0 ? (
                <div className="p-1.5 overflow-y-auto max-h-[268px]">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between gap-3 px-3.5 py-3 hover:bg-zinc-50 cursor-pointer rounded-xl transition-colors duration-150"
                      onClick={() => {
                        setSearchQuery(suggestion.profession)
                        setShowSuggestions(false)
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0 font-sans">
                        <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100">
                          <Search className="w-3.5 h-3.5 text-zinc-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-zinc-900 truncate">
                            {suggestion.profession}
                          </p>
                          <p className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5">
                            <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                            {suggestion.count} available
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="py-8 px-6 text-center">
                  <p className="text-xs font-medium text-zinc-500 font-sans">No specialists found</p>
                </div>
              ) : null}
            </motion.div>
          )}
        </motion.div>

        {/* Primary & Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-row items-center gap-6 mt-1"
        >
          <ClientLogin>
            <button
              type="button"
              className="h-11 px-7 font-sans text-xs font-semibold rounded-full bg-primary text-white hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm cursor-pointer"
            >
              Get Started
            </button>
          </ClientLogin>
          <Link href="#how">
            <span className="text-zinc-500 hover:text-zinc-900 font-sans font-semibold text-xs transition flex items-center gap-1 cursor-pointer">
              Learn How It Works <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-row items-center gap-4 mt-2 font-sans"
        >
          <div className="flex flex-row -space-x-2 select-none">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Professional ${index + 1}`}
                className="rounded-full border-2 border-white w-7 h-7 object-cover shadow-sm"
              />
            ))}
          </div>
          <span className="text-xs text-zinc-400 font-light">Join 2+ professionals</span>
          <span className="w-px h-4 bg-zinc-200" />
          <div className="text-left">
            <p className="text-xs font-semibold text-zinc-900 leading-none">48+</p>
            <p className="text-[9px] uppercase tracking-[0.07em] text-zinc-400 mt-1 font-semibold">Categories</p>
          </div>
          <span className="w-px h-4 bg-zinc-200" />
          <div className="text-left">
            <p className="text-xs font-semibold text-zinc-900 leading-none">4.9★</p>
            <p className="text-[9px] uppercase tracking-[0.07em] text-zinc-400 mt-1 font-semibold">Avg rating</p>
          </div>
        </motion.div>

      </div>

      {/* Premium Infinite Scroll Cards Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full overflow-hidden mt-12 select-none"
      >
        {/* Soft Side Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none w-[160px] bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none w-[160px] bg-gradient-to-l from-white via-white/80 to-transparent" />

        {/* Infinite Scrolling Row */}
        <motion.div
          className="flex items-center gap-5 pl-6"
          animate={{
            x: [0, -((displayedServices.length * 280 + displayedServices.length * 20))],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: displayedServices.length * 6,
              ease: "linear",
            },
          }}
        >
          {[...displayedServices, ...displayedServices, ...displayedServices].map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.015, y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-shrink-0 cursor-pointer relative overflow-hidden rounded-[24px] border border-zinc-100 group shadow-sm/50"
              style={{ width: "280px", height: "350px" }}
            >
              {/* Background Cover Image */}
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />

              {/* Subdued Dark Editorial Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-zinc-950/90" />

              {/* Soft Green Card Top Highlight on hover */}
              <div className="absolute inset-x-0 top-0 h-[3px] bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

              {/* Text Info Drawer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1.5 text-left font-sans">
                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest leading-none">
                  {service.category}
                </span>
                
                <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight mt-0.5">
                  {service.title}
                </h3>
                
                {index % displayedServices.length === 0 && typeof service.signupCount === "number" && (
                  <span className="inline-flex items-center gap-1.5 mt-2 self-start bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-[10.5px] text-white/95">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                    {service.signupCount} registered
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