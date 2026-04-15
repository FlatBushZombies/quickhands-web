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

// ─── Category accent colours — one warm tone per card ────────────────────────
const CATEGORY_ACCENTS: Record<string, string> = {
  "Tutors & Education":             "#F5A623",
  "Home & Repair Services":         "#4A90D9",
  "Beauty & Personal Care":         "#E8639A",
  "Freelancers & Digital Services": "#7B61FF",
  "Business & Legal Services":      "#2DB67D",
  "Sports & Wellness":              "#F56C23",
  "Arts & Entertainment":           "#D94A4A",
  "Domestic & Household Staff":     "#4ABAAB",
  "Driving & Transport":            "#5A7FD9",
  "Animal & Pet Services":          "#7DBF3F",
  "Other Popular Services":         "#C17D2A",
}

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
  const fill   = forBanner ? "rgba(255,255,255,0.07)" : "rgba(193,125,42,0.055)"
  const stroke = forBanner ? "rgba(255,255,255,0.0)"  : "rgba(193,125,42,0.13)"
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

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

/* ── Section shell ── */
.mkt {
  font-family: 'DM Sans', sans-serif;
  background: #FDFAF5;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding: 7rem 0 8rem;
}

/* Ambient noise */
.mkt::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

/* Warm amber orb top-right */
.mkt-orb-1 {
  position: absolute; pointer-events: none; border-radius: 50%; filter: blur(90px); z-index: 0;
  width: 560px; height: 560px;
  background: radial-gradient(circle, rgba(245,166,35,0.10) 0%, transparent 70%);
  top: -160px; right: -100px;
}

/* Cool blue orb bottom-left */
.mkt-orb-2 {
  position: absolute; pointer-events: none; border-radius: 50%; filter: blur(90px); z-index: 0;
  width: 420px; height: 420px;
  background: radial-gradient(circle, rgba(74,144,217,0.08) 0%, transparent 70%);
  bottom: 120px; left: -80px;
}

.mkt-inner {
  position: relative; z-index: 1;
  max-width: 1280px; margin: 0 auto; padding: 0 3rem;
}

@media (max-width: 768px) { .mkt-inner { padding: 0 1.5rem; } }

/* ── Header ── */
.mkt-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 4rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.mkt-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Syne', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #C17D2A;
  margin-bottom: 1rem;
}

.mkt-eyebrow-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #F5A623;
  display: inline-block;
}

.mkt-h1 {
  font-family: 'DM Serif Display', serif;
  font-weight: 400;
  font-size: clamp(2.4rem, 4vw, 3.4rem);
  line-height: 1.08;
  color: #1A1208;
  letter-spacing: -0.01em;
  margin: 0;
}

.mkt-h1 em {
  font-style: italic;
  color: #C17D2A;
}

.mkt-header-right {
  max-width: 320px;
  align-self: flex-end;
}

.mkt-sub {
  color: #6B5E48;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.75;
  margin: 0 0 1.5rem;
}

.mkt-sub strong { color: #1A1208; font-weight: 500; }

/* Stats bar */
.stats-row {
  display: flex;
  align-items: stretch;
  border: 1px solid rgba(26,18,8,0.09);
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
}

.stat-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 18px;
  border-right: 1px solid rgba(26,18,8,0.07);
  position: relative;
  overflow: hidden;
  transition: background 0.25s ease;
}

.stat-cell:last-child { border-right: none; }

.stat-cell::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 2px;
  background: #F5A623;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.32s cubic-bezier(0.22,1,0.36,1);
}

.stat-cell:hover { background: #FFFBF4; }
.stat-cell:hover::after { transform: scaleX(1); }

.stat-n {
  font-family: 'DM Serif Display', serif;
  font-size: 1.6rem;
  font-weight: 400;
  color: #1A1208;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-l {
  font-family: 'Syne', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: #B0A090;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* ── Section rule ── */
.section-rule {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 2.5rem;
}

.section-rule-label {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #B0A090;
  white-space: nowrap;
}

.section-rule-line { flex: 1; height: 1px; background: rgba(26,18,8,0.08); }

/* ── Card grid ── */
.cat-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
}

/* ── Category card ── */
.cat-card {
  background: #FFFFFF;
  border-radius: 22px;
  border: 1px solid rgba(26,18,8,0.07);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
              box-shadow 0.35s cubic-bezier(0.22,1,0.36,1);
}

.cat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 44px -12px rgba(26,18,8,0.13);
}

.cat-card-glow {
  position: absolute; inset: 0;
  pointer-events: none; opacity: 0;
  transition: opacity 0.35s ease; z-index: 0;
}

.cat-card:hover .cat-card-glow { opacity: 1; }

/* Illustration tray */
.illus-tray {
  width: 100%; height: 186px;
  background: #F7F3EC;
  position: relative; overflow: hidden;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-bottom: 1px solid rgba(26,18,8,0.06);
}

/* Dot-grid texture on tray */
.illus-tray::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(circle at 1px 1px, rgba(26,18,8,0.045) 1px, transparent 0);
  background-size: 20px 20px;
  z-index: 1;
}

.illus-tray.is-empty {
  background: #F5F2EE;
}

.illus-tray > span {
  position: absolute !important;
  inset: 10px 24px 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 2;
}

.illus-tray img {
  object-fit: contain !important;
  width: auto !important; height: 100% !important;
  max-height: 168px !important;
  position: relative !important;
  filter: drop-shadow(0 6px 14px rgba(0,0,0,0.09));
  transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.45s ease;
}

.illus-tray.is-empty img {
  filter: drop-shadow(0 6px 14px rgba(0,0,0,0.06)) saturate(0.3) opacity(0.65);
}

.cat-card:hover .illus-tray img {
  transform: scale(1.05) translateY(-4px);
  filter: drop-shadow(0 12px 22px rgba(0,0,0,0.13));
}

.cat-card:hover .illus-tray.is-empty img {
  filter: drop-shadow(0 12px 22px rgba(0,0,0,0.1)) saturate(0.5) opacity(0.8);
}

/* Accent index number top-right of tray */
.illus-index {
  position: absolute;
  top: 14px; right: 16px;
  font-family: 'DM Serif Display', serif;
  font-style: italic;
  font-size: 12px;
  color: rgba(26,18,8,0.22);
  z-index: 3;
  transition: opacity 0.3s ease;
  opacity: 0.65;
}

.cat-card:hover .illus-index { opacity: 1; }

/* Card body */
.cat-body {
  padding: 1.4rem 1.5rem 1.4rem;
  display: flex; flex-direction: column; flex: 1;
  position: relative; z-index: 1;
}

.cat-header-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 0.6rem;
}

.cat-title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: #1A1208;
  line-height: 1.25;
  margin: 0;
  letter-spacing: -0.01em;
}

.cat-total {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

.cat-total.is-live { color: #C17D2A; }
.cat-total.is-empty { color: #D4C9BA; }

.cat-total-link {
  color: #C17D2A;
  text-decoration: none;
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cat-total-link:hover { text-decoration: underline; }

/* Divider between title and list */
.cat-divider {
  height: 1px;
  background: rgba(26,18,8,0.07);
  margin-bottom: 0.85rem;
}

.prof-list {
  list-style: none; padding: 0; margin: 0 0 1.1rem;
  display: flex; flex-direction: column;
}

.prof-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid rgba(26,18,8,0.05);
}

.prof-row:last-child { border-bottom: none; }

.prof-name {
  font-size: 13px;
  font-weight: 300;
  color: #7A6B54;
  line-height: 1.4;
}

.prof-count {
  font-family: 'DM Serif Display', serif;
  font-size: 13px;
  font-weight: 400;
  color: #B8A898;
  flex-shrink: 0;
}

/* Empty state */
.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 0 14px;
}

.empty-hint-label {
  font-size: 12px;
  font-weight: 300;
  color: #C8BDB0;
  font-style: italic;
  line-height: 1.5;
}

.empty-hint-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px dashed rgba(26,18,8,0.15);
  font-size: 10px;
  font-weight: 600;
  color: #C8BDB0;
  letter-spacing: 0.06em;
  font-family: 'Syne', sans-serif;
}

/* CTA strip */
.cat-cta {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(26,18,8,0.07);
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #1A1208;
  display: flex;
  align-items: center;
  justify-content: space-between;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cta-arrow {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(26,18,8,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: #7A6B54;
  transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.25s;
  flex-shrink: 0;
}

.cat-card:hover .cta-arrow {
  background: #1A1208;
  border-color: #1A1208;
  color: #FDFAF5;
  transform: translateX(2px);
}

/* ── Skeleton ── */
.skeleton {
  background: linear-gradient(90deg, #EDE8DF 25%, #E4DDD3 50%, #EDE8DF 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  border-radius: 4px;
  height: 12px;
  margin-bottom: 8px;
}
.skeleton-tray {
  width: 100%; height: 186px;
  background: #F0EBE2;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(26,18,8,0.06);
}

@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── App Banner ── */
.app-banner {
  margin-top: 6rem;
  border-radius: 28px;
  background: #1A1208;
  position: relative;
  overflow: hidden;
}

/* Warm amber glow inside banner */
.app-banner-orb-1 {
  position: absolute; pointer-events: none; border-radius: 50%; filter: blur(70px); z-index: 0;
  width: 440px; height: 440px;
  background: radial-gradient(circle, rgba(245,166,35,0.22) 0%, transparent 65%);
  top: -120px; left: -80px;
}

.app-banner-orb-2 {
  position: absolute; pointer-events: none; border-radius: 50%; filter: blur(80px); z-index: 0;
  width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(74,144,217,0.14) 0%, transparent 65%);
  bottom: -100px; right: 160px;
}

/* Dot grid on banner */
.app-banner::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
  background-size: 22px 22px;
  pointer-events: none; z-index: 0;
}

.banner-inner {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  padding: clamp(3.5rem, 6vw, 6rem);
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
  padding: 5px 14px 5px 10px;
  border-radius: 100px;
  background: rgba(245,166,35,0.15);
  border: 1px solid rgba(245,166,35,0.30);
  color: #F5A623;
  font-family: 'Syne', sans-serif;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.live-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #F5A623;
  animation: ldot 2.2s ease infinite;
}
@keyframes ldot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.55)} }

.banner-h {
  font-family: 'DM Serif Display', serif;
  font-weight: 400;
  font-size: clamp(2.8rem, 4.5vw, 4.2rem);
  line-height: 1.04;
  color: #FDFAF5;
  margin: 0 0 1.1rem;
  letter-spacing: -0.02em;
}

.banner-h em {
  font-style: italic;
  color: #F5A623;
}

.banner-p {
  color: rgba(253,250,245,0.60);
  font-size: 15px;
  font-weight: 300;
  line-height: 1.8;
  max-width: 400px;
  margin-bottom: 2.2rem;
}

.banner-p strong { color: rgba(253,250,245,0.90); font-weight: 400; }

.store-row { display: flex; gap: 10px; flex-wrap: wrap; }

.store-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 11px 22px;
  border-radius: 100px;
  background: #FDFAF5;
  border: none;
  color: #1A1208;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Syne', sans-serif;
  letter-spacing: 0.02em;
  transition: transform 0.25s cubic-bezier(0.22,1,0.36,1),
              box-shadow 0.25s ease,
              background 0.2s ease;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
}

.store-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  background: #fff;
}

.phone-shell {
  background: rgba(255,255,255,0.06);
  border-radius: 32px;
  padding: 11px;
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 40px 80px rgba(0,0,0,0.35),
              0 0 0 1px rgba(255,255,255,0.06),
              inset 0 1px 0 rgba(255,255,255,0.12);
}
`

// ─── Component ────────────────────────────────────────────────────────────────

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
          illustration: CATEGORY_ILLUSTRATIONS[title] ?? "/illustrations/Installation.svg",
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
    <>
      <style>{CSS}</style>
      <section className="mkt">
        <div className="mkt-orb-1" />
        <div className="mkt-orb-2" />
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
              <div className="mkt-eyebrow">
                <span className="mkt-eyebrow-dot" />
                Across Africa &amp; Beyond
              </div>
              <h2 className="mkt-h1">
                Trusted specialists<br />
                <em>near you</em>
              </h2>
            </motion.div>

            <motion.div
              className="mkt-header-right"
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
                  <div className="skeleton-tray" />
                  <div className="cat-body">
                    <div className="skeleton" style={{ width: "55%", marginBottom: 14 }} />
                    <div className="skeleton" style={{ width: "28%", height: 9, marginBottom: 20 }} />
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="skeleton" style={{ width: `${80 - j * 9}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cat-grid">
              {categories.map((cat, i) => {
                const accent = CATEGORY_ACCENTS[cat.title] ?? "#C17D2A"
                const glowStyle = {
                  background: `radial-gradient(ellipse at 50% 0%, ${accent}14 0%, transparent 65%)`,
                }
                return (
                  <motion.div
                    key={cat.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    style={{ display: "flex" }}
                  >
                    <div className="cat-card">
                      {/* Per-card accent glow on hover */}
                      <div className="cat-card-glow" style={glowStyle} />

                      {/* Illustration tray */}
                      <div className={`illus-tray${cat.hasLiveData ? "" : " is-empty"}`}>
                        <span className="illus-index">
                          {String(i + 1).padStart(2, "0")}
                        </span>
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
                          <span className={`cat-total ${cat.hasLiveData ? "is-live" : "is-empty"}`}>
                            {cat.hasLiveData
                              ? `${cat.totalCount.toLocaleString()} specialist${cat.totalCount === 1 ? "" : "s"}`
                              : <Link href="/professionals" className="cat-total-link">Be the first</Link>
                            }
                          </span>
                        </div>

                        <div className="cat-divider" />

                        {cat.hasLiveData ? (
                          <ul className="prof-list">
                            {cat.professions.map((p) => (
                              <li key={p.profession} className="prof-row">
                                <span className="prof-name">{p.profession}</span>
                                <span className="prof-count">{p.count.toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
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
                              <span className="empty-hint-pill">✦ Be the first to register</span>
                            </div>
                          </>
                        )}

                        <div className="cat-cta">
                          <span>{cat.hasLiveData ? "View all specialists" : "Register as a specialist"}</span>
                          <span className="cta-arrow">→</span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* ── App Banner ── */}
          <div className="app-banner">
            <div className="app-banner-orb-1" />
            <div className="app-banner-orb-2" />
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