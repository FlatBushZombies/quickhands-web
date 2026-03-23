"use client"

import { useEffect, useMemo, useState } from "react"
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
      className={cn("relative w-full min-h-screen flex flex-col overflow-hidden")}
      style={{
        background: "linear-gradient(180deg, #E8F0FF 0%, #F5F9FF 50%, #FFFFFF 100%)",
      }}
      role="banner"
      aria-label="Hero section"
    >
      {/* Premium subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a08_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center text-center max-w-4xl gap-8"
        >
          {/* Title */}
          <h1 className="font-sans text-balance font-bold leading-[1.1] tracking-tight text-[#1a1a1a] text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Quickly find the right{" "}
            <span className="bg-gradient-to-r from-[#1a1a1a] via-[#4a5568] to-[#1a1a1a] bg-clip-text text-transparent">
              Specialists
            </span>{" "}
            for your tasks.
          </h1>

          {/* Subtitle */}
          <UserCounter />

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4a5568]" />
              <Input
                type="text"
                placeholder="Specialist or services"
                className="h-14 pl-12 pr-4 text-base bg-white border-[#e2e8f0] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus:shadow-[0_4px_24px_rgba(0,0,0,0.12)] transition-shadow placeholder:text-[#718096]"
              />
            </div>
            <Button
              size="lg"
              className="h-14 px-8 font-medium rounded-full bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] hover:scale-105 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center gap-2"
            >
              Search
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Social Proof 
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-row items-center gap-3"
          >
            <div className="flex flex-row -space-x-3">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar || "/placeholder.svg"}
                  alt={`Professional ${index + 1}`}
                  className="rounded-full border-2 border-white w-10 h-10 object-cover shadow-md"
                />
              ))}
            </div>
            <span className="font-sans text-sm font-medium text-[#4a5568]">Join over 10,000+ professionals</span>
          </motion.div>
          */}
          
        </motion.div>
      </div>

      {/* Service Cards Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 w-full overflow-hidden py-12"
      >
        {/* Gradient Overlays */}
        <div
          className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none w-[150px]"
          style={{
            background: "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none w-[150px]"
          style={{
            background: "linear-gradient(270deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        />

        {/* Scrolling Container */}
        <motion.div
          className="flex items-center gap-6 pl-6"
          animate={{
            x: [0, -((displayedServices.length * 380) / 2)],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: displayedServices.length * 4,
              ease: "linear",
            },
          }}
        >
          {/* Duplicate services for seamless loop */}
          {[...displayedServices, ...displayedServices].map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 cursor-pointer relative overflow-hidden rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              style={{
                width: "320px",
                height: "420px",
              }}
            >
              {/* Image */}
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover"
              />

              {/* Premium Gradient Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.75) 100%)",
                }}
              />

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                <span className="font-sans text-xs font-medium text-white/80 uppercase tracking-[0.15em]">
                  {service.category}
                </span>
                <h3 className="font-sans text-2xl font-semibold text-white leading-tight">{service.title}</h3>
                {index % displayedServices.length === 0 && typeof service.signupCount === "number" && (
                  <span className="font-sans text-xs font-medium text-white/90">
                    {service.signupCount} signed up in this category
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
