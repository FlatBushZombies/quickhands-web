"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import ProfessionalCounter from "./professionals/ProfessionalsCounter"
import {
  GraduationCap,
  Wrench,
  Sparkles,
  Laptop,
  Briefcase,
  Activity,
  Camera,
  Home,
  Car,
  Heart,
  Hammer,
  ArrowRight,
  ShieldCheck
} from "lucide-react"

// ─── Static category definitions (all 11 always shown) ───────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Tutors & Education":             ["tutor","teacher","education","math","science","english","language","music","computer","lecturer","biology","chemistry","physics","primary","high school","university"],
  "Home & Repair Services":         ["plumber","electrician","painter","tiler","builder","handyman","roofer","appliance","renovation","bricklayer","roofing","repair"],
  "Beauty & Personal Care":         ["makeup","hair","barber","nail","lash","brow","massage","wax","stylist","beauty","braider","grooming"],
  "Freelancers & Digital Services": ["graphic","web","social media","digital","content","writer","translator","virtual","it support","data entry","developer","designer","freelance","seo","marketing"],
  "Business & Legal Services":      ["accountant","bookkeeper","tax","lawyer","legal","company","business","hr","real estate","consultant","compliance","auditor","finance"],
  "Sports & Wellness":              ["trainer","fitness","yoga","pilates","stretch","dance","sports","coach","wellness","gym","aerobics"],
  "Arts & Entertainment":           ["musician","dj","mc","dancer","photographer","videographer","entertainer","artist","event","band","singer","performer"],
  "Domestic & Household Staff":     ["housekeeper","cleaner","nanny","babysitter","caregiver","gardener","driver","pet sitter","domestic","cook","chef","maid"],
  "Driving & Transport":            ["driving instructor","motorcycle","defensive driving","delivery","courier","transport","logistics","moving","chauffeur","taxi"],
  "Animal & Pet Services":          ["vet","veterinary","pet","grooming","dog trainer","animal","livestock","boarding","kennel"],
  "Other Popular Services":         ["mobile money","phone repair","solar","cctv","security","internet","satellite","tailor","welder","metalwork","installation","technician"],
}

const CATEGORY_ICONS: Record<string, any> = {
  "Tutors & Education":             GraduationCap,
  "Home & Repair Services":         Wrench,
  "Beauty & Personal Care":         Sparkles,
  "Freelancers & Digital Services": Laptop,
  "Business & Legal Services":      Briefcase,
  "Sports & Wellness":              Activity,
  "Arts & Entertainment":           Camera,
  "Domestic & Household Staff":     Home,
  "Driving & Transport":            Car,
  "Animal & Pet Services":          Heart,
  "Other Popular Services":         Hammer,
}

const CATEGORY_PROFESSIONS: Record<string, string[]> = {
  "Tutors & Education": ["Mathematics Tutor","Science Tutor","English Tutor","Language Tutor","Music Teacher","Computer Studies Tutor"],
  "Home & Repair Services": ["Plumber","Electrician","Painter","Carpenter","Handyman","Appliance Repair Technician"],
  "Beauty & Personal Care": ["Makeup Artist","Hair Stylist","Barber","Nail Technician","Lash Technician","Massage Therapist"],
  "Freelancers & Digital Services": ["Graphic Designer","Web Developer","Social Media Manager","Content Writer","Virtual Assistant","SEO Specialist"],
  "Business & Legal Services": ["Accountant","Bookkeeper","Tax Consultant","Lawyer","HR Consultant","Business Consultant"],
  "Sports & Wellness": ["Personal Trainer","Fitness Coach","Yoga Instructor","Pilates Instructor","Dance Coach","Wellness Coach"],
  "Arts & Entertainment": ["Musician","DJ","Photographer","Videographer","Event MC","Performer"],
  "Domestic & Household Staff": ["Housekeeper","Cleaner","Nanny","Babysitter","Caregiver","Gardener"],
  "Driving & Transport": ["Driving Instructor","Delivery Driver","Courier Rider","Logistics Driver","Moving Assistant","Chauffeur"],
  "Animal & Pet Services": ["Veterinarian","Pet Groomer","Dog Trainer","Pet Sitter","Animal Care Assistant","Kennel Assistant"],
  "Other Popular Services": ["Phone Repair Technician","Solar Installer","CCTV Installer","Internet Technician","Tailor","Welder"],
}

const STATIC_CATEGORIES = Object.keys(CATEGORY_KEYWORDS)

const CATEGORY_ACCENTS: Record<string, string> = {
  "Tutors & Education":             "#F5A623",
  "Home & Repair Services":         "#3B82F6",
  "Beauty & Personal Care":         "#EC4899",
  "Freelancers & Digital Services": "#8B5CF6",
  "Business & Legal Services":      "#10B981",
  "Sports & Wellness":              "#F97316",
  "Arts & Entertainment":           "#EF4444",
  "Domestic & Household Staff":     "#14B8A6",
  "Driving & Transport":            "#6366F1",
  "Animal & Pet Services":          "#84CC16",
  "Other Popular Services":         "#B45309",
}

type ProfessionEntry = { profession: string; count: number }

type Category = {
  title: string
  totalCount: number
  professions: ProfessionEntry[]
  hasLiveData: boolean
}

function matchCategory(profession: string): string {
  const lower = profession.toLowerCase()
  let bestCategory = "Other Popular Services"
  let bestScore = 0
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((total, kw) => {
      if (lower.includes(kw.toLowerCase())) return total + kw.length
      return total
    }, 0)
    if (score > bestScore) { bestScore = score; bestCategory = category }
  }
  return bestCategory
}

function AfricaSilhouette({ forBanner = false }) {
  const fill   = forBanner ? "rgba(255,255,255,0.03)" : "rgba(38,192,141,0.01)"
  const stroke = forBanner ? "rgba(255,255,255,0.05)" : "rgba(38,192,141,0.03)"
  return (
    <svg 
      viewBox="0 0 400 520" 
      xmlns="http://www.w3.org/2000/svg" 
      aria-hidden="true"
      className="absolute pointer-events-none -z-10"
      style={forBanner ? {
        right: "-40px", 
        bottom: "-60px",
        width: "320px", 
        height: "auto",
      } : {
        top: "50%", 
        left: "50%",
        transform: "translate(-50%, -46%)",
        width: "min(700px, 90vw)", 
        height: "auto",
      }}
    >
      <path d="M195 8 C183 8 167 12 158 21 C146 32 136 36 122 42 C108 48 96 47 86 56 C74 67 69 85 65 100 C61 115 55 127 53 142 C51 157 53 170 51 184 C49 199 40 210 38 225 C36 242 40 258 45 273 C50 288 53 303 60 317 C69 335 81 347 90 362 C99 379 102 396 113 411 C124 427 141 436 157 447 C173 458 186 467 202 474 C218 481 236 483 252 478 C270 472 281 459 292 446 C305 431 314 414 321 397 C330 378 334 358 336 339 C338 319 336 299 338 279 C340 260 347 242 347 223 C347 204 343 186 341 169 C339 152 337 134 330 119 C323 102 310 89 299 76 C288 63 278 49 265 40 C251 30 234 18 216 12 C209 10 201 8 195 8Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <path d="M336 200 C342 195 356 192 361 201 C356 216 342 226 335 219 Z" fill={fill} stroke={stroke} strokeWidth="1" />
      <ellipse cx="360" cy="332" rx="13" ry="31" fill={fill} stroke={stroke} strokeWidth="1" transform="rotate(-12,360,332)" />
    </svg>
  )
}

export default function Marketplace() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function load(showLoading = false) {
      if (showLoading && isMounted) setLoading(true)

      const map: Record<string, ProfessionEntry[]> = {}
      for (const title of STATIC_CATEGORIES) map[title] = []

      try {
        const res = await fetch("/api/onboarding?type=professions")
        if (res.ok) {
          const { professions } = await res.json() as {
            professions: { profession: string; count: string }[]
          }
          for (const { profession, count } of professions) {
            const cat = matchCategory(profession)
            if (!map[cat]) map[cat] = []
            map[cat].push({ profession, count: parseInt(count) })
          }
        }
      } catch { /* fail silently */ }

      const built: Category[] = Object.entries(map)
        .map(([title, entries]) => ({
          title,
          totalCount: entries.reduce((s, e) => s + e.count, 0),
          professions: entries.sort((a, b) => b.count - a.count),
          hasLiveData: entries.length > 0,
        }))
        .sort((a, b) => {
          if (a.hasLiveData && !b.hasLiveData) return -1
          if (!a.hasLiveData && b.hasLiveData) return 1
          return b.totalCount - a.totalCount
        })

      if (isMounted) {
        setCategories(built)
        setLoading(false)
      }
    }

    load(true)
    const id = setInterval(() => load(false), 10000)
    return () => { isMounted = false; clearInterval(id) }
  }, [])

  return (
    <section className="relative py-32 bg-zinc-50/50 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-0 w-[450px] h-[450px] bg-primary/3 rounded-full blur-[110px] pointer-events-none -z-10" />
      <AfricaSilhouette />

      <div className="max-w-[1200px] mx-auto px-6">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-xl text-left"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-semibold text-primary tracking-[0.08em] uppercase font-sans">
                Across Africa &amp; Beyond
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-zinc-950 leading-tight">
              Trusted specialists<br />
              <span className="italic text-primary">near you</span>.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="max-w-sm text-left flex flex-col gap-6"
          >
            <p className="font-sans text-sm text-zinc-500 font-light leading-relaxed">
              Choose from <strong><ProfessionalCounter /> local specialists</strong> or remote professionals, all ready to deliver quality work when you need it.
            </p>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 border border-zinc-100 bg-white rounded-2xl overflow-hidden shadow-sm/30 divide-x divide-y divide-zinc-50">
              {[
                { n: "2M+", l: "Vetted experts" },
                { n: "500K+", l: "Completed jobs" },
                { n: "100%", l: "Secure pay" },
                { n: "4.9★", l: "Avg rating" },
              ].map((s, i) => (
                <div 
                  className="flex flex-col p-3.5 font-sans hover:bg-emerald-50/10 transition-colors group relative" 
                  key={i}
                >
                  <span className="text-md font-bold text-zinc-900 group-hover:text-primary transition-colors">{s.n}</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">{s.l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Section rule ── */}
        <div className="flex items-center gap-6 mb-12">
          <span className="font-sans text-[10px] font-bold tracking-[0.16em] uppercase text-zinc-400">Browse categories</span>
          <div className="flex-1 h-px bg-zinc-100" />
        </div>

        {/* ── Categories Grid ── */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white border border-zinc-100 rounded-[24px] h-[340px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => {
              const accent = CATEGORY_ACCENTS[cat.title] ?? "#B45309"
              const Icon = CATEGORY_ICONS[cat.title] ?? Hammer
              
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.2) }}
                  viewport={{ once: true }}
                  className="flex"
                >
                  <div className="group w-full bg-white border border-zinc-100 rounded-[24px] flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    
                    {/* Index Card Header (Replaces Illustration Tray) */}
                    <div 
                      className="h-28 w-full relative overflow-hidden flex items-center justify-center border-b border-zinc-50"
                      style={{ backgroundColor: `${accent}04` }}
                    >
                      <span className="absolute top-4 right-5 font-serif text-[13px] italic text-zinc-300 select-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div 
                        className="h-11 w-11 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105"
                        style={{ 
                          borderColor: `${accent}15`, 
                          backgroundColor: `${accent}05` 
                        }}
                      >
                        <Icon className="h-5 w-5" style={{ color: accent }} />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between font-sans text-left">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-primary transition-colors duration-200">
                            {cat.title}
                          </h3>
                          <span className="text-[10px] font-bold text-zinc-400 tracking-wide shrink-0">
                            {cat.hasLiveData
                              ? `${cat.totalCount.toLocaleString()} available`
                              : "0 available"}
                          </span>
                        </div>

                        <div className="h-px bg-zinc-100/60" />

                        <ul className="space-y-2 text-[11.5px]">
                          {cat.hasLiveData ? (
                            cat.professions.slice(0, 4).map((p) => (
                              <li key={p.profession} className="flex justify-between text-zinc-500 font-light">
                                <span>{p.profession}</span>
                                <span className="font-semibold text-zinc-800">{p.count}</span>
                              </li>
                            ))
                          ) : (
                            (CATEGORY_PROFESSIONS[cat.title] ?? []).slice(0, 4).map((title) => (
                              <li key={title} className="flex justify-between text-zinc-400 font-light">
                                <span>{title}</span>
                                <span>0</span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>

                      {/* Card Footer CTA */}
                      <div className="border-t border-zinc-100/60 pt-4 mt-6 flex items-center justify-between text-xs text-zinc-800 group-hover:text-primary transition-colors font-semibold">
                        <span>{cat.hasLiveData ? "View specialists" : "Register profile"}</span>
                        <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* ── App Banner (Editorial Callout) ── */}
        <div className="mt-24 bg-zinc-950 border border-zinc-900 rounded-[32px] relative overflow-hidden text-white p-8 md:p-14 text-left group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <AfricaSilhouette forBanner={true} />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Info Box */}
            <div className="flex-1 space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-[10px] font-semibold text-primary tracking-[0.08em] uppercase font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Launching Soon
              </div>
              
              <h3 className="font-serif text-3xl md:text-5xl leading-tight text-white font-normal">
                Try the <span className="italic text-primary">Quickhands</span> mobile app.
              </h3>
              
              <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed">
                Quickhands is currently deploying — built to connect you with vetted specialists, faster. Be the first to receive access when we go live in your area.
              </p>

              {/* Store Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-sans">
                <button className="h-10 px-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">
                  <Image src="/icons/app-store.svg" alt="App Store" width={14} height={14} />
                  App Store
                </button>
                <button className="h-10 px-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">
                  <Image src="/icons/google-play.svg" alt="Google Play" width={14} height={14} />
                  Google Play
                </button>
              </div>
            </div>

            {/* Right Phone mockup container */}
            <div className="flex-shrink-0 relative hidden md:block">
              <div className="relative border-[6px] border-zinc-800 rounded-[28px] p-1 bg-zinc-950 shadow-2xl">
                <Image
                  src="/demo.png"
                  alt="Quickhands app demo"
                  width={210}
                  height={420}
                  className="rounded-[20px] block"
                  priority
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}