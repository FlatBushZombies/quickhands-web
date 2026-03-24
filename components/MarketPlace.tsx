"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import ProfessionalCounter from "./professionals/ProfessionalsCounter"

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

const CATEGORY_ILLUSTRATIONS: Record<string, string> = {
  "Tutors & Education":             "/illustrations/Teacher.svg",
  "Home & Repair Services":         "/illustrations/Electrician.svg",
  "Beauty & Personal Care":         "/illustrations/Beauty.svg",
  "Freelancers & Digital Services": "/illustrations/Freelancer.svg",
  "Business & Legal Services":      "/illustrations/Lawyer.svg",
  "Sports & Wellness":              "/illustrations/Coach.svg",
  "Arts & Entertainment":           "/illustrations/Videographer.svg",
  "Domestic & Household Staff":     "/illustrations/Gardening.svg",
  "Driving & Transport":            "/illustrations/Driver.svg",
  "Animal & Pet Services":          "/illustrations/Veterinary.svg",
  "Other Popular Services":         "/illustrations/Installation.svg",
}

const CATEGORY_PROFESSIONS: Record<string, string[]> = {
  "Tutors & Education": [
    "Mathematics Tutor",
    "Science Tutor",
    "English Tutor",
    "Language Tutor",
    "Music Teacher",
    "Computer Studies Tutor",
  ],
  "Home & Repair Services": [
    "Plumber",
    "Electrician",
    "Painter",
    "Carpenter",
    "Handyman",
    "Appliance Repair Technician",
  ],
  "Beauty & Personal Care": [
    "Makeup Artist",
    "Hair Stylist",
    "Barber",
    "Nail Technician",
    "Lash Technician",
    "Massage Therapist",
  ],
  "Freelancers & Digital Services": [
    "Graphic Designer",
    "Web Developer",
    "Social Media Manager",
    "Content Writer",
    "Virtual Assistant",
    "SEO Specialist",
  ],
  "Business & Legal Services": [
    "Accountant",
    "Bookkeeper",
    "Tax Consultant",
    "Lawyer",
    "HR Consultant",
    "Business Consultant",
  ],
  "Sports & Wellness": [
    "Personal Trainer",
    "Fitness Coach",
    "Yoga Instructor",
    "Pilates Instructor",
    "Dance Coach",
    "Wellness Coach",
  ],
  "Arts & Entertainment": [
    "Musician",
    "DJ",
    "Photographer",
    "Videographer",
    "Event MC",
    "Performer",
  ],
  "Domestic & Household Staff": [
    "Housekeeper",
    "Cleaner",
    "Nanny",
    "Babysitter",
    "Caregiver",
    "Gardener",
  ],
  "Driving & Transport": [
    "Driving Instructor",
    "Delivery Driver",
    "Courier Rider",
    "Logistics Driver",
    "Moving Assistant",
    "Chauffeur",
  ],
  "Animal & Pet Services": [
    "Veterinarian",
    "Pet Groomer",
    "Dog Trainer",
    "Pet Sitter",
    "Animal Care Assistant",
    "Kennel Assistant",
  ],
  "Other Popular Services": [
    "Phone Repair Technician",
    "Solar Installer",
    "CCTV Installer",
    "Internet Technician",
    "Tailor",
    "Welder",
  ],
}

// All 11 categories pre-seeded as empty — live data fills them in
const STATIC_CATEGORIES = Object.keys(CATEGORY_KEYWORDS)

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfessionEntry = { profession: string; count: number }

type Category = {
  title: string
  illustration: string
  totalCount: number
  professions: ProfessionEntry[]
  hasLiveData: boolean
}

// ─── Matching helper ──────────────────────────────────────────────────────────

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

// ─── Africa silhouette SVG ────────────────────────────────────────────────────

function AfricaSilhouette({ forBanner = false }) {
  const fill   = forBanner ? "rgba(255,255,255,0.10)" : "rgba(22,163,74,0.055)"
  const stroke = forBanner ? "rgba(255,255,255,0.0)"  : "rgba(22,163,74,0.14)"
  return (
    <svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={forBanner ? {
        position:"absolute", right:"-40px", bottom:"-60px",
        width:"400px", height:"auto", pointerEvents:"none", zIndex:0,
      } : {
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%, -46%)",
        width:"min(900px, 95vw)", height:"auto",
        pointerEvents:"none", zIndex:0,
      }}>
      <path d="M195 8 C183 8 167 12 158 21 C146 32 136 36 122 42 C108 48 96 47 86 56 C74 67 69 85 65 100 C61 115 55 127 53 142 C51 157 53 170 51 184 C49 199 40 210 38 225 C36 242 40 258 45 273 C50 288 53 303 60 317 C69 335 81 347 90 362 C99 379 102 396 113 411 C124 427 141 436 157 447 C173 458 186 467 202 474 C218 481 236 483 252 478 C270 472 281 459 292 446 C305 431 314 414 321 397 C330 378 334 358 336 339 C338 319 336 299 338 279 C340 260 347 242 347 223 C347 204 343 186 341 169 C339 152 337 134 330 119 C323 102 310 89 299 76 C288 63 278 49 265 40 C251 30 234 18 216 12 C209 10 201 8 195 8Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <path d="M336 200 C342 195 356 192 361 201 C356 216 342 226 335 219 Z" fill={fill} stroke={stroke} strokeWidth="1" />
      <ellipse cx="360" cy="332" rx="13" ry="31" fill={fill} stroke={stroke} strokeWidth="1" transform="rotate(-12,360,332)" />
    </svg>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');

.mkt {
  font-family: 'DM Sans', sans-serif;
  background: #fff;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding: 100px 0 140px;
}

.mkt::before {
  content: '';
  position: absolute;
  top: -200px; left: 50%;
  transform: translateX(-50%);
  width: 1100px; height: 700px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(22,163,74,0.05) 0%, transparent 68%);
  pointer-events: none; z-index: 0;
}

.mkt-inner {
  position: relative; z-index: 1;
  max-width: 1280px; margin: 0 auto; padding: 0 48px;
}

@media (max-width: 768px) { .mkt-inner { padding: 0 24px; } }

/* ── Header: asymmetric two-column ── */
.mkt-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: end;
  margin-bottom: 88px;
}

@media (max-width: 820px) {
  .mkt-header { grid-template-columns: 1fr; gap: 36px; }
  .mkt-sub { max-width: 100% !important; }
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #16A34A;
  margin-bottom: 20px;
}

.eyebrow-dash {
  display: inline-block;
  width: 28px; height: 1px;
  background: #86EFAC;
}

.mkt-h1 {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-size: clamp(3rem, 5.5vw, 5rem);
  line-height: 1.04;
  color: #111827;
  letter-spacing: -0.03em;
  margin: 0;
}

.mkt-h1 em {
  font-style: italic;
  color: #16A34A;
  font-weight: 300;
}

.header-right { padding-bottom: 4px; }

.mkt-sub {
  color: #6B7280;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.8;
  max-width: 420px;
  margin: 0 0 36px;
}

.mkt-sub strong { color: #16A34A; font-weight: 500; }

/* Stats bar */
.stats-row {
  display: flex;
  align-items: stretch;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.stat-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px 20px;
  border-right: 1px solid #E5E7EB;
  position: relative;
  overflow: hidden;
}

.stat-cell:last-child { border-right: none; }

.stat-cell::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 2px;
  background: #22C55E;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.32s cubic-bezier(0.22,1,0.36,1);
}

.stat-cell:hover::after { transform: scaleX(1); }

.stat-n {
  font-family: 'Fraunces', serif;
  font-size: 1.7rem;
  font-weight: 400;
  color: #111827;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-l {
  font-size: 9px;
  font-weight: 500;
  color: #9CA3AF;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ── Section rule ── */
.section-rule {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 52px;
}

.section-rule-label {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #9CA3AF;
  white-space: nowrap;
}

.section-rule-line { flex: 1; height: 1px; background: #E5E7EB; }

/* ── Card grid: flush tile layout ── */
.cat-grid {
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  background: #E5E7EB;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  overflow: hidden;
}

.cat-card {
  background: #fff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  transition: background 0.2s ease;
}

.cat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 3px; height: 0;
  background: #22C55E;
  transition: height 0.35s cubic-bezier(0.22,1,0.36,1);
  z-index: 1;
}

.cat-card:hover { background: #F9FFF9; }
.cat-card:hover::before { height: 100%; }

/* Illustration tray */
.illus-tray {
  width: 100%; height: 190px;
  background: #F0FDF4;
  position: relative; overflow: hidden;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-bottom: 1px solid #E5E7EB;
}

/* "Coming soon" tray variant for empty categories */
.illus-tray.is-empty {
  background: #FAFAFA;
  border-bottom-color: #F3F4F6;
}

.illus-tray > span {
  position: absolute !important;
  inset: 12px 28px 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.illus-tray img {
  object-fit: contain !important;
  width: auto !important; height: 100% !important;
  max-height: 175px !important;
  position: relative !important;
  filter: drop-shadow(0 6px 16px rgba(0,0,0,0.09));
  transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.45s ease;
}

/* Desaturate illustration when no live data yet */
.illus-tray.is-empty img {
  filter: drop-shadow(0 6px 16px rgba(0,0,0,0.06)) saturate(0.35) opacity(0.7);
}

.cat-card:hover .illus-tray img {
  transform: scale(1.05) translateY(-4px);
  filter: drop-shadow(0 12px 24px rgba(0,0,0,0.13));
}

.cat-card:hover .illus-tray.is-empty img {
  filter: drop-shadow(0 12px 24px rgba(0,0,0,0.1)) saturate(0.55) opacity(0.85);
}

/* Card body */
.cat-body { padding: 24px 26px 22px; display: flex; flex-direction: column; flex: 1; }

.cat-header-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.cat-title {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 1.15rem;
  color: #111827;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.01em;
}

.cat-total {
  font-size: 9px;
  font-weight: 600;
  color: #16A34A;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Muted count label when no live data */
.cat-total.is-empty {
  color: #D1D5DB;
}

.cat-total-link {
  color: #16A34A;
  text-decoration: none;
}

.cat-total-link:hover {
  text-decoration: underline;
}

.prof-list {
  list-style: none; padding: 0; margin: 0 0 20px;
  display: flex; flex-direction: column;
}

.prof-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
}

.prof-row:last-child { border-bottom: none; }

.prof-name {
  font-size: 13px;
  font-weight: 300;
  color: #6B7280;
  line-height: 1.4;
}

.prof-count {
  font-family: 'Fraunces', serif;
  font-size: 13px;
  font-weight: 400;
  color: #9CA3AF;
  flex-shrink: 0;
}

/* Empty state within a card */
.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 0 18px;
  margin-bottom: 4px;
}

.empty-hint-label {
  font-size: 12px;
  font-weight: 300;
  color: #D1D5DB;
  font-style: italic;
  line-height: 1.5;
}

.empty-hint-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px dashed #E5E7EB;
  font-size: 10px;
  font-weight: 500;
  color: #D1D5DB;
  letter-spacing: 0.06em;
}

.cat-cta {
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid #E5E7EB;
  font-size: 10px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: space-between;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cta-pill {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid #E5E7EB;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: #6B7280;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
  flex-shrink: 0;
}

.cat-card:hover .cta-pill {
  background: #16A34A;
  border-color: #16A34A;
  color: #fff;
  transform: translateX(2px);
}

/* ── Skeleton ── */
.skeleton {
  background: linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 3px;
  height: 12px; margin-bottom: 8px;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── App Banner ── */
.app-banner {
  margin-top: 100px;
  border-radius: 24px;
  background: #16A34A;
  position: relative;
  overflow: hidden;
}

.app-banner::before {
  content: '';
  position: absolute;
  top: -140px; left: -100px;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 65%);
  pointer-events: none;
}

.app-banner::after {
  content: '';
  position: absolute;
  bottom: -160px; right: -100px;
  width: 560px; height: 560px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,0,0,0.12) 0%, transparent 65%);
  pointer-events: none;
}

.banner-inner {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  padding: clamp(52px,6vw,96px);
  align-items: center;
}

@media (max-width: 680px) {
  .banner-inner { grid-template-columns: 1fr; }
  .banner-phone { display: none; }
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 13px 5px 10px;
  border-radius: 100px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.live-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #fff;
  animation: ldot 2.2s ease infinite;
}
@keyframes ldot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.55)} }

.banner-h {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-size: clamp(2.8rem,4.5vw,4.4rem);
  line-height: 1.02;
  color: #fff;
  margin: 0 0 18px;
  letter-spacing: -0.03em;
}

.banner-h em {
  font-style: italic;
  color: rgba(255,255,255,0.8);
  font-weight: 300;
}

.banner-p {
  color: rgba(255,255,255,0.75);
  font-size: 0.98rem;
  font-weight: 300;
  line-height: 1.8;
  max-width: 400px;
  margin-bottom: 38px;
}

.banner-p strong { color: #fff; font-weight: 500; }

.store-row { display: flex; gap: 10px; flex-wrap: wrap; }

.store-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: 100px;
  background: #fff;
  border: none;
  color: #16A34A;
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.store-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.18);
  background: #f0fdf4;
}

.phone-shell {
  background: rgba(0,0,0,0.15);
  border-radius: 30px;
  padding: 11px;
  border: 1px solid rgba(255,255,255,0.22);
  box-shadow: 0 40px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15);
}
`

// ─── Component ────────────────────────────────────────────────────────────────

export default function Marketplace() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // 1. Seed all 11 categories as empty placeholders
      const map: Record<string, ProfessionEntry[]> = {}
      for (const title of STATIC_CATEGORIES) {
        map[title] = []
      }

      try {
        // 2. Fetch live data and overlay into the seeded map
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
      } catch {
        // fail silently — all 11 static categories still render
      }

      // 3. Build final sorted list
      // Categories with live data float to the top; empties go to the end
      const built: Category[] = Object.entries(map)
        .map(([title, entries]) => ({
          title,
          illustration: CATEGORY_ILLUSTRATIONS[title] ?? "/illustrations/Installation.svg",
          totalCount: entries.reduce((s, e) => s + e.count, 0),
          professions: entries.sort((a, b) => b.count - a.count),
          hasLiveData: entries.length > 0,
        }))
        .sort((a, b) => {
          // Live categories first, sorted by count; empty categories after
          if (a.hasLiveData && !b.hasLiveData) return -1
          if (!a.hasLiveData && b.hasLiveData) return 1
          return b.totalCount - a.totalCount
        })

      setCategories(built)
      setLoading(false)
    }

    load()
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <section className="mkt">
        <AfricaSilhouette />

        <div className="mkt-inner">

          {/* ── Header ── */}
          <motion.div
            className="mkt-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="eyebrow">
                <span className="eyebrow-dash" />
                Across Africa &amp; Beyond
                <span className="eyebrow-dash" />
              </div>
              <h2 className="mkt-h1">
                Trusted specialists<br />
                <em>near you</em>
              </h2>
            </motion.div>

            <motion.div
              className="header-right"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mkt-sub">
                Choose from <strong><ProfessionalCounter /> local specialists</strong> or{" "}
                <strong>remote professionals</strong>, all ready to help when you need them.
              </p>

              <div className="stats-row">
                {[
                  { n: "", l: "" },
                  { n: "", l: "" },
                  { n: "", l: "" },
                  { n: "", l: "" },
                ].map((s, i) => (
                  <div className="stat-cell" key={i}>
                    <span className="stat-n">{s.n}</span>
                    <span className="stat-l">{s.l}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Section rule ── */}
          <div className="section-rule">
            <span className="section-rule-label">Browse categories</span>
            <div className="section-rule-line" />
          </div>

          {/* ── Grid ── */}
          {loading ? (
            <div className="cat-grid">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="cat-card" style={{ minHeight: 340 }}>
                  <div className="illus-tray" />
                  <div className="cat-body">
                    <div className="skeleton" style={{ width: "55%", marginBottom: 14 }} />
                    <div className="skeleton" style={{ width: "28%", height: 9, marginBottom: 22 }} />
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="skeleton" style={{ width: `${80 - j * 9}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cat-grid">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  style={{ display: "flex" }}
                >
                  <div className="cat-card">

                    {/* Illustration */}
                    <div className={`illus-tray${cat.hasLiveData ? "" : " is-empty"}`}>
                      <span>
                        <Image
                          src={cat.illustration}
                          alt={`${cat.title} illustration`}
                          fill
                          sizes="360px"
                          priority={i < 6}
                        />
                      </span>
                    </div>

                    <div className="cat-body">
                      <div className="cat-header-row">
                        <h3 className="cat-title">{cat.title}</h3>
                        <span className={`cat-total${cat.hasLiveData ? "" : " is-empty"}`}>
                          {cat.hasLiveData
                            ? `${cat.totalCount.toLocaleString()} specialist${cat.totalCount === 1 ? "" : "s"}`
                            : <Link href="/professionals" className="cat-total-link">Be the first</Link>}
                        </span>
                      </div>

                      {cat.hasLiveData ? (
                        /* Live profession rows */
                        <ul className="prof-list">
                          {cat.professions.map((p) => (
                            <li key={p.profession} className="prof-row">
                              <span className="prof-name">{p.profession}</span>
                              <span className="prof-count">{p.count.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        /* Fallback keyword rows when no specialists registered yet */
                        <>
                          <ul className="prof-list">
                            {(CATEGORY_PROFESSIONS[cat.title] ?? []).map((title) => (
                              <li key={title} className="prof-row">
                                <span className="prof-name">{title}</span>
                                <span className="prof-count">0</span>
                              </li>
                            ))}
                          </ul>
                          <div className="empty-hint">
                            <span className="empty-hint-label">
                              No specialists registered yet in this category.
                            </span>
                            <span className="empty-hint-pill">
                              ✦ Be the first to register
                            </span>
                          </div>
                        </>
                      )}

                      <div className="cat-cta">
                        <span>{cat.hasLiveData ? "View all specialists" : "Register as a specialist"}</span>
                        <span className="cta-pill">→</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── App Banner ── */}
          <div className="app-banner">
            <AfricaSilhouette forBanner={true} />
            <div className="banner-inner">
              <div>
                <div className="live-badge">
                  <span className="live-dot" />
                  Launching Soon
                </div>
                <h3 className="banner-h">
                  Try the<br />
                  <em>Quickhands</em><br />
                  app.
                </h3>
                <p className="banner-p">
                  <strong>Quickhands</strong> is almost here — built to connect you with trusted
                  specialists, faster. Be the first in when we go live.
                </p>
                <div className="store-row">
                  <button className="store-btn">
                    <Image src="/icons/app-store.svg" alt="App Store" width={16} height={16} />
                    App Store
                  </button>
                  <button className="store-btn">
                    <Image src="/icons/google-play.svg" alt="Google Play" width={16} height={16} />
                    Google Play
                  </button>
                </div>
              </div>
              <div className="banner-phone">
                <div className="phone-shell">
                  <Image
                    src="/demo.png"
                    alt="Quickhands app demo"
                    width={258}
                    height={516}
                    style={{ borderRadius: "20px", display: "block" }}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}